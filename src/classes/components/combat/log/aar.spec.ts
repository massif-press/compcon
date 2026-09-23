import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildStream } from './stream'
import { makeEvent } from './events'
import { casualties, formatReport, highlights, participantIdFor, sitrep, summarize } from './aar'
import type { IActorRef, ILogEvent, LogEventKind } from './events'

const en = JSON.parse(readFileSync(resolve(process.cwd(), 'src/i18n/locales/en.json'), 'utf8'))
const t = (key: string, params: Record<string, unknown> = {}) => {
  const raw = key.split('.').reduce<any>((o, k) => (o ? o[k] : undefined), en)
  if (typeof raw !== 'string') return key
  return raw.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''))
}

const participants: IActorRef[] = [
  { id: 'a', name: 'test pilot', type: 'pilot', side: 'ally' },
  { id: 'b', name: 'test npc', type: 'npc', side: 'enemy' },
  { id: 'c', name: 'Test NPC 2', type: 'npc', side: 'enemy' },
]

let seq = 0
const ev = <K extends LogEventKind>(kind: K, payload: any, actorId = 'a', round = 1): ILogEvent =>
  makeEvent(kind, payload, {
    seq: seq++,
    source: 'gm',
    encounterId: 'e',
    round,
    turn: 1,
    actorId,
    ts: seq,
  }) as ILogEvent

const damage = (actorId: string, targetId: string, final: number, damageType = 'Kinetic') =>
  ev('damage', { targetId, damageType, final, incoming: final, armorReduced: 0 }, actorId)

const stream = () =>
  buildStream({ encounterId: 'e', encounterName: 'Test Encounter', rounds: 2 }, participants, [
    ev('encounter.start', { name: 'Test Encounter', sitrep: 'Hold the line' }),
    damage('a', 'b', 6),
    damage('a', 'b', 11, 'Energy'),
    damage('b', 'a', 4),
    ev('attack', { targetId: 'b', result: 'crit' }),
    ev('actor.destroy', { targetId: 'b' }, 'a', 2),
    ev('pilot.status', { from: 'active', to: 'injured', manual: true }, 'a', 2),
  ])

describe('the after action report', () => {
  it('summarizes idle participants too', () => {
    const rows = summarize(stream())
    expect(rows.map(r => r.ref.id)).toEqual(['a', 'b', 'c'])
    expect(rows[0].rollup.totalDealt).toBe(17)
    expect(rows[1].rollup.destroyed).toBe(true)
    expect(rows[0].rollup.outcome?.pilot).toBe('injured')
  })

  it('skips empty standout categories', () => {
    const byKey = Object.fromEntries(highlights(stream()).map(h => [h.key, h]))
    expect(byKey.topDealt).toMatchObject({ actorId: 'a', value: 17 })
    expect(byKey.topTaken).toMatchObject({ actorId: 'b', value: 17 })
    expect(byKey.topKills).toMatchObject({ actorId: 'a', value: 1 })
    expect(byKey.biggestHit).toMatchObject({ actorId: 'a', value: 11, damageType: 'energy' })
    expect(byKey.topCrits).toMatchObject({ actorId: 'a', value: 1 })
    expect(byKey.topOvercharges).toBeUndefined()
    expect(byKey.topHeatCleared).toBeUndefined()
  })

  it('ignores self-inflicted hits', () => {
    const s = buildStream({ encounterId: 'e' }, participants, [damage('a', 'a', 50)])
    expect(highlights(s).find(h => h.key === 'biggestHit')).toBeUndefined()
  })

  it('lists kills and status changes in order', () => {
    expect(casualties(stream()).map(e => e.kind)).toEqual(['actor.destroy', 'pilot.status'])
  })

  it('reads the sitrep off the encounter start', () => {
    expect(sitrep(stream())).toBe('Hold the line')
  })

  it('exports as text without raw keys', () => {
    const text = formatReport(stream(), t, 'PC VICTORY')
    expect(text).toContain('Test Encounter: PC VICTORY')
    expect(text).toContain('test pilot [INJURED]')
    expect(text).toContain('Biggest single hit: test pilot (11 Energy)')
    expect(text).not.toMatch(/active\.|enums\./)
  })
})

describe('finding a roster pilot in a GM stream', () => {
  it('resolves through the instance origin', () => {
    const s = buildStream(
      { encounterId: 'e' },
      [{ id: 'inst-1', originId: 'roster-1', name: 'test pilot', type: 'pilot' }],
      []
    )
    expect(participantIdFor(s, 'roster-1')).toBe('inst-1')
    expect(participantIdFor(s, 'inst-1')).toBe('inst-1')
  })
})
