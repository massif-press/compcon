import { describe, it, expect } from 'vitest'
import {
  LOG_SCHEMA_VERSION,
  LOG_EVENT_KINDS,
  makeEvent,
  readEvent,
  readStream,
  isKnownKind,
  resolveActor,
} from './events'
import type { ILogEnvelope, IActorRef } from './events'

const envelope = (over: Partial<ILogEnvelope> = {}): ILogEnvelope => ({
  seq: 0,
  source: 'gm',
  encounterId: 'enc-1',
  round: 1,
  turn: 1,
  actorId: 'actor-1',
  ...over,
})

describe('the log envelope', () => {
  it('stamps the schema version, an id, and a timestamp', () => {
    const e = makeEvent('note', { text: 'hello' }, envelope())

    expect(e.v).toBe(LOG_SCHEMA_VERSION)
    expect(e.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(e.ts).toBeGreaterThan(0)
    expect(e.kind).toBe('note')
    expect(e.payload).toEqual({ text: 'hello' })
  })

  it('carries the envelope through', () => {
    const e = makeEvent(
      'move',
      { spent: 4, mode: 'boost' },
      envelope({
        seq: 7,
        round: 3,
        turn: 2,
        campaignId: 'camp-1',
        missionId: 'mis-1',
        source: 'self',
      })
    )

    expect(e.seq).toBe(7)
    expect(e.round).toBe(3)
    expect(e.turn).toBe(2)
    expect(e.campaignId).toBe('camp-1')
    expect(e.missionId).toBe('mis-1')
    expect(e.source).toBe('self')
    expect(e.actorId).toBe('actor-1')
  })

  it('gives every event a distinct id, since ids identify within one stream only', () => {
    const a = makeEvent('note', { text: 'a' }, envelope({ seq: 0 }))
    const b = makeEvent('note', { text: 'a' }, envelope({ seq: 1 }))

    expect(a.id).not.toBe(b.id)
  })

  it('orders by seq, which a timestamp cannot do', () => {
    const ts = Date.now()
    const a = makeEvent('note', { text: 'a' }, envelope({ seq: 0, ts }))
    const b = makeEvent('note', { text: 'b' }, envelope({ seq: 1, ts }))

    expect(a.ts).toBe(b.ts)
    expect([b, a].sort((x, y) => x.seq - y.seq).map(e => e.payload)).toEqual([
      { text: 'a' },
      { text: 'b' },
    ])
  })
})

describe('tolerant reading', () => {
  it('accepts every kind it declares', () => {
    LOG_EVENT_KINDS.forEach(k => expect(isKnownKind(k)).toBe(true))
    expect(isKnownKind('not.a.kind')).toBe(false)
    expect(isKnownKind(undefined)).toBe(false)
  })

  it('drops an event of an unknown kind rather than throwing', () => {
    expect(readEvent({ kind: 'from.the.future', payload: {} })).toBeNull()
    expect(readEvent(null)).toBeNull()
    expect(readEvent('nonsense')).toBeNull()
  })

  it('defaults a missing envelope field and keeps fields it does not know', () => {
    const e = readEvent({ kind: 'note', payload: { text: 'x' }, somethingNew: 42 })!

    expect(e.seq).toBe(0)
    expect(e.round).toBe(0)
    expect(e.source).toBe('gm')
    expect(e.v).toBe(LOG_SCHEMA_VERSION)
    expect((e as any).somethingNew).toBe(42)
  })

  it('round-trips an event it wrote', () => {
    const e = makeEvent(
      'damage',
      {
        damageType: 'Kinetic',
        incoming: 10,
        armorReduced: 2,
        resisted: ['resistance'],
        conditions: ['exposed'],
        final: 9,
        taken: true,
      },
      envelope({ seq: 3 })
    )

    expect(readEvent(JSON.parse(JSON.stringify(e)))).toEqual(e)
  })
})

describe('the transfer stream', () => {
  const participants: IActorRef[] = [
    { id: 'a', name: 'TestNPC', type: 'npc', npcClassId: 'npcc_bombard', npcClassName: 'Bombard' },
    { id: 'b', name: 'TestPilot', type: 'pilot', originId: 'pilot-7' },
  ]

  it('refuses a stream with no encounter id, since that is the only key import has', () => {
    expect(readStream({ participants: [], events: [] })).toBeNull()
    expect(readStream({ encounterId: '' })).toBeNull()
  })

  it('reads a stream and drops only the events it cannot understand', () => {
    const s = readStream({
      encounterId: 'enc-1',
      encounterName: 'Test Encounter',
      participants,
      events: [
        { kind: 'note', payload: { text: 'ok' } },
        { kind: 'from.the.future', payload: {} },
        { kind: 'move', payload: { spent: 2, mode: 'move' } },
      ],
    })!

    expect(s.events.map(e => e.kind)).toEqual(['note', 'move'])
    expect(s.participants).toHaveLength(2)
    expect(s.source).toBe('gm')
  })

  it('resolves an actor reference out of its own participant table, needing no compendium', () => {
    const s = readStream({ encounterId: 'enc-1', participants, events: [] })!

    expect(resolveActor(s, 'a').npcClassName).toBe('Bombard')
    expect(resolveActor(s, 'b').originId).toBe('pilot-7')
  })

  it('names an actor it does not know rather than failing on it', () => {
    const s = readStream({ encounterId: 'enc-1', participants, events: [] })!

    expect(resolveActor(s, 'ghost-id')).toEqual({
      id: 'ghost-id',
      name: 'Unknown',
      type: 'unknown',
    })
    expect(resolveActor(s, undefined).name).toBe('Unknown')
  })
})
