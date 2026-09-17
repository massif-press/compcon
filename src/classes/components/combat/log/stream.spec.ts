import { describe, it, expect } from 'vitest'
import {
  extractActorStream,
  concernsActor,
  buildStream,
  planImport,
  applyImport,
  candidateOf,
} from './stream'
import { makeEvent, readStream } from './events'
import type { ILogEvent, ILogStream, IActorRef, LogEventKind } from './events'

let seq = 0
const ev = <K extends LogEventKind>(
  kind: K,
  payload: any,
  actorId: string,
  ts = ++seq
): ILogEvent =>
  makeEvent(kind, payload, {
    seq,
    source: 'gm',
    encounterId: 'enc-1',
    round: 1,
    turn: 1,
    actorId,
    ts,
  }) as ILogEvent

const participants: IActorRef[] = [
  { id: 'ghost', name: 'Ghost', type: 'pilot', originId: 'pilot-7' },
  { id: 'bob', name: 'BOB', type: 'npc', npcClassId: 'npcc_bombard', npcClassName: 'Bombard' },
  { id: 'other', name: 'Someone Else', type: 'pilot' },
]

const gmStream = (): ILogStream =>
  buildStream(
    { encounterId: 'enc-1', encounterName: 'Test Encounter', result: 'victory' },
    participants,
    [
      ev('damage', { targetId: 'bob', damageType: 'Kinetic', final: 8 }, 'ghost'),
      ev('damage', { targetId: 'ghost', damageType: 'Energy', final: 4 }, 'bob'),
      ev('move', { spent: 3, mode: 'move' }, 'other'),
      ev('damage', { targetId: 'other', damageType: 'Kinetic', final: 2 }, 'bob'),
      ev('actor.destroy', { targetId: 'bob' }, 'ghost'),
    ]
  )

describe('the transfer stream', () => {
  it('orders a stream it builds by time, then by sequence', () => {
    const s = gmStream()
    const times = s.events.map(e => e.ts)
    expect([...times].sort((a, b) => a - b)).toEqual(times)
    expect(s.rounds).toBe(1)
  })

  it('counts an actor as concerned whether it acted or was acted upon', () => {
    const dealt = ev('damage', { targetId: 'bob', damageType: 'Kinetic', final: 8 }, 'ghost')

    expect(concernsActor(dealt, 'ghost')).toBe(true)
    expect(concernsActor(dealt, 'bob')).toBe(true)
    expect(concernsActor(dealt, 'other')).toBe(false)
  })

  it("hands a player only their own fight, not everyone else's", () => {
    const mine = extractActorStream(gmStream(), 'ghost')

    expect(mine.events).toHaveLength(3)
    expect(mine.events.every(e => concernsActor(e, 'ghost'))).toBe(true)
    expect(mine.events.some(e => e.actorId === 'other')).toBe(false)
  })

  it('carries the refs its events mention and drops the ones they do not', () => {
    const mine = extractActorStream(gmStream(), 'ghost')

    expect(mine.participants.map(p => p.id).sort()).toEqual(['bob', 'ghost'])
    expect(mine.participants.find(p => p.id === 'bob')!.npcClassName).toBe('Bombard')
  })

  it('keeps the encounter identity so an import can reconcile against it', () => {
    const mine = extractActorStream(gmStream(), 'ghost')

    expect(mine.encounterId).toBe('enc-1')
    expect(mine.encounterName).toBe('Test Encounter')
    expect(mine.result).toBe('victory')
  })

  it('survives a round trip through JSON, which is how it travels', () => {
    const mine = extractActorStream(gmStream(), 'ghost')
    const back = readStream(JSON.parse(JSON.stringify(mine)))!

    expect(back.events).toHaveLength(mine.events.length)
    expect(back.participants).toEqual(mine.participants)
    expect(back.encounterId).toBe('enc-1')
  })
})

describe('planning an import', () => {
  const held = (over: Partial<ILogStream>): ILogStream =>
    buildStream({ encounterId: 'own-1', encounterName: '', ...over }, [], [], 'self')

  it('adds when the player holds nothing', () => {
    expect(planImport(gmStream(), [])).toEqual({ action: 'add', targetIndex: -1, suggestions: [] })
  })

  it('replaces silently once a record already carries the encounter id', () => {
    const already = held({ encounterId: 'enc-1' })

    expect(planImport(gmStream(), [already])).toEqual({
      action: 'replace',
      targetIndex: 0,
      suggestions: [],
    })
  })

  it('suggests a match on name or date but never acts on the guess', () => {
    const sameName = held({ encounterId: 'own-1', encounterName: 'Test Encounter' })
    const unrelated = held({ encounterId: 'own-2', encounterName: 'Something Else', start: 0 })

    const plan = planImport(gmStream(), [sameName, unrelated])
    expect(plan.action).toBe('add')
    expect(plan.suggestions).toEqual([0])
  })

  it('appends when the player takes the default', () => {
    const mine = held({ encounterId: 'own-1' })
    const out = applyImport(gmStream(), [mine])

    expect(out).toHaveLength(2)
    expect(out[1].encounterId).toBe('enc-1')
  })

  it('replaces wholesale when the player picks a record, keeping nothing of the old one', () => {
    const mine = held({ encounterId: 'own-1', encounterName: 'My Version' })
    const out = applyImport(gmStream(), [mine], 'own-1')

    expect(out).toHaveLength(1)
    expect(out[0].encounterId).toBe('enc-1')
    expect(out[0].source).toBe('gm')
    expect(out[0].encounterName).toBe('Test Encounter')
  })

  it('does not duplicate an encounter it already holds', () => {
    const already = held({ encounterId: 'enc-1' })
    const out = applyImport(gmStream(), [already])

    expect(out).toHaveLength(1)
    expect(out[0].source).toBe('gm')
  })

  it('describes an incoming stream well enough for a player to recognise it', () => {
    expect(candidateOf(gmStream())).toMatchObject({
      encounterId: 'enc-1',
      encounterName: 'Test Encounter',
      rounds: 1,
      source: 'gm',
    })
  })
})
