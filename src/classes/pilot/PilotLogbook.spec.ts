import { describe, it, expect, beforeEach } from 'vitest'
import { PilotLogbook, STREAM_RETENTION } from './PilotLogbook'
import { buildStream } from '../components/combat/log/stream'
import { makeEvent } from '../components/combat/log/events'
import type {
  ILogEvent,
  ILogStream,
  LogEventKind,
  LogSource,
} from '../components/combat/log/events'

let seq = 0
const ev = <K extends LogEventKind>(kind: K, payload: any, actorId = 'me'): ILogEvent =>
  makeEvent(kind, payload, {
    seq: seq++,
    source: 'gm',
    encounterId: 'x',
    round: 1,
    turn: 1,
    actorId,
  }) as ILogEvent

const stream = (
  encounterId: string,
  over: Partial<ILogStream> = {},
  events: ILogEvent[] = []
): ILogStream =>
  buildStream(
    {
      encounterId,
      encounterName: over.encounterName ?? `Op ${encounterId}`,
      start: over.start ?? 1000,
      ...over,
    },
    over.participants ?? [{ id: 'me', name: 'Ghost', type: 'pilot' }],
    events,
    (over.source ?? 'gm') as LogSource
  )

let book: PilotLogbook

beforeEach(() => {
  book = new PilotLogbook({ pilotId: 'pilot-7' })
})

describe('the pilot logbook', () => {
  it('is its own syncable item rather than a field on pilot data', () => {
    expect(book.StorageType).toBe('pilot_logbooks')
    expect(book.ItemType).toBe('PilotLogbook')
    expect(book.PilotID).toBe('pilot-7')
  })

  it('records an imported encounter as both a rollup and a stream', () => {
    book.Import(
      stream('enc-1', {}, [ev('damage', { targetId: 'them', damageType: 'Kinetic', final: 8 })]),
      'me'
    )

    expect(book.Encounters).toBe(1)
    expect(book.RecordFor('enc-1')!.rollup.totalDealt).toBe(8)
    expect(book.StreamFor('enc-1')!.events).toHaveLength(1)
  })

  it('sums a lifetime from the per-encounter rollups', () => {
    book.Import(
      stream('enc-1', {}, [ev('damage', { targetId: 'x', damageType: 'Kinetic', final: 8 })]),
      'me'
    )
    book.Import(
      stream('enc-2', {}, [ev('damage', { targetId: 'x', damageType: 'Energy', final: 3 })]),
      'me'
    )
    book.Import(stream('enc-3', {}, [ev('actor.destroy', { targetId: 'x' })]), 'me')

    expect(book.Lifetime.totalDealt).toBe(11)
    expect(book.Lifetime.damageDealt).toEqual({ kinetic: 8, energy: 3 })
    expect(book.Lifetime.killsConfirmed).toBe(1)
  })

  it('scopes a rollup by campaign, which is a loose tag and not an entity', () => {
    book.Import(
      stream('enc-1', { campaignId: 'camp-a' }, [ev('move', { spent: 4, mode: 'move' })]),
      'me'
    )
    book.Import(
      stream('enc-2', { campaignId: 'camp-b' }, [ev('move', { spent: 6, mode: 'move' })]),
      'me'
    )

    expect(book.Rollups({ campaignId: 'camp-a' }).movementSpent).toBe(4)
    expect(book.Rollups({ campaignId: 'camp-b' }).movementSpent).toBe(6)
    expect(book.Rollups().movementSpent).toBe(10)
    expect(book.Rollups({ campaignId: 'nope' }).movementSpent).toBe(0)
  })

  it('plans an add when it holds nothing that matches', () => {
    const plan = book.PlanImport(stream('enc-1'))

    expect(plan.action).toBe('add')
    expect(plan.candidate.encounterName).toBe('Op enc-1')
    expect(plan.candidate.source).toBe('gm')
  })

  it('plans a silent replace once it already holds that encounter id', () => {
    book.Import(stream('enc-1'), 'me')

    expect(book.PlanImport(stream('enc-1')).action).toBe('replace')
  })

  it('suggests a match but never applies one on its own', () => {
    book.Import(stream('own-1', { encounterName: 'MatchTest', source: 'self' }), 'me')

    const plan = book.PlanImport(stream('enc-9', { encounterName: 'MatchTest' }))
    expect(plan.action).toBe('add')
    expect(plan.suggestions).toEqual([0])
    expect(book.Encounters).toBe(1)
  })

  it('replaces a chosen record wholesale, self-reported kills included', () => {
    book.Import(
      stream('own-1', { source: 'self' }, [ev('actor.destroy', { selfReported: true })]),
      'me'
    )
    expect(book.Lifetime.killsSelfReported).toBe(1)

    const incoming = stream('enc-1', {}, [
      ev('damage', { targetId: 'x', damageType: 'Kinetic', final: 5 }),
    ])
    book.Import(incoming, 'me', 0)

    expect(book.Encounters).toBe(1)
    expect(book.Lifetime.killsSelfReported).toBe(0)
    expect(book.Lifetime.totalDealt).toBe(5)
    expect(book.RecordFor('enc-1')!.source).toBe('gm')
  })

  it('keeps rollups forever but only the most recent streams', () => {
    for (let i = 0; i < STREAM_RETENTION + 5; i++) {
      book.Import(
        stream(`enc-${i}`, { start: 1000 + i }, [
          ev('damage', { targetId: 'x', damageType: 'Kinetic', final: 1 }),
        ]),
        'me'
      )
    }

    expect(book.Encounters).toBe(STREAM_RETENTION + 5)
    expect(book.Lifetime.totalDealt).toBe(STREAM_RETENTION + 5)
    expect(book.Streams).toHaveLength(STREAM_RETENTION)
    expect(book.StreamFor('enc-0')).toBeUndefined()
    expect(book.StreamFor(`enc-${STREAM_RETENTION + 4}`)).toBeDefined()
    expect(book.RecordFor('enc-0')!.rollup.totalDealt).toBe(1)
  })

  it('can still replace an encounter whose stream was trimmed away', () => {
    for (let i = 0; i < STREAM_RETENTION + 2; i++) {
      book.Import(stream(`enc-${i}`, { start: 1000 + i }), 'me')
    }
    expect(book.StreamFor('enc-0')).toBeUndefined()
    expect(book.RecordFor('enc-0')).toBeDefined()

    const plan = book.PlanImport(stream('enc-0'))
    expect(plan.action).toBe('replace')
    expect(book.Records[plan.targetIndex].encounterId).toBe('enc-0')
  })

  it('round-trips through save data', () => {
    book.Import(
      stream('enc-1', {}, [ev('damage', { targetId: 'x', damageType: 'Kinetic', final: 8 })]),
      'me'
    )

    const once = PilotLogbook.Serialize(book)
    const back = PilotLogbook.Deserialize(JSON.parse(JSON.stringify(once)))

    expect(back.PilotID).toBe('pilot-7')
    expect(back.Encounters).toBe(1)
    expect(back.Lifetime.totalDealt).toBe(8)
    expect(back.StreamFor('enc-1')!.events).toHaveLength(1)
    expect(PilotLogbook.Serialize(back)).toEqual(once)
  })

  it('drops an event of an unknown kind on read rather than failing the whole logbook', () => {
    const raw = PilotLogbook.Serialize(book)
    raw.streams = [
      {
        ...stream('enc-1'),
        events: [{ kind: 'from.the.future', payload: {} }],
      } as never,
    ]

    const back = PilotLogbook.Deserialize(JSON.parse(JSON.stringify(raw)))
    expect(back.StreamFor('enc-1')!.events).toEqual([])
  })
})
