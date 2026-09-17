import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { makeMech, makePilot } from '@/__tests__/factories'
import { DamageType } from '@/classes/enums'
import { StatKey } from '../stats/Stats'
import { reduceEvents } from './telemetry'
import { renderEvent } from './render'
import { LOG_EVENT_KINDS } from './events'
import type { ILogEvent, LogEventKind } from './events'
import type { Mech } from '@/classes/mech/Mech'

const en = JSON.parse(readFileSync(resolve(process.cwd(), 'src/i18n/locales/en.json'), 'utf8'))
const t = (key: string, params: Record<string, unknown> = {}) => {
  const raw = key.split('.').reduce<any>((o, k) => (o ? o[k] : undefined), en)
  if (typeof raw !== 'string') return key
  return raw.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''))
}

let m: Mech
const cc = () => m.CombatController
const events = (): ILogEvent[] => cc().CombatLog.Events
const kinds = (): LogEventKind[] => events().map(e => e.kind)
const last = <K extends LogEventKind>(kind: K) =>
  [...events()].reverse().find(e => e.kind === kind) as ILogEvent<K> | undefined
const actorId = () => cc().RootActor.ID
const rollup = () => reduceEvents(events(), actorId())

beforeEach(() => {
  m = makeMech(makePilot({ level: 3 }))
  m.SetStats()
  m.CombatController.StatController.resetCurrentStats()
  m.CombatController.CombatLog.Clear()
  m.CombatController.CombatLog.EncounterId = 'enc-under-test'
})
afterEach(() => vi.restoreAllMocks())

describe('what the engine actually records', () => {
  it('stamps the encounter and the actor on everything it records', () => {
    cc().Record('note', { text: 'x' })
    const e = events()[0]

    expect(e.encounterId).toBe('enc-under-test')
    expect(e.actorId).toBe(actorId())
    expect(e.round).toBe(cc().Round)
    expect(e.seq).toBe(0)
  })

  it('records taking damage with the numbers that produced the final value', () => {
    cc().StatController.setCurrentStat(StatKey.ARMOR, 2)
    cc().AddStatus('exposed')
    cc().CombatLog.Clear()

    cc().TakeDamage(DamageType.Kinetic, 10)

    const d = last('damage')!
    expect(d.payload.damageType).toBe(DamageType.Kinetic)
    expect(d.payload.incoming).toBe(10)
    expect(d.payload.armorReduced).toBe(2)
    expect(d.payload.conditions).toContain('exposed')
    expect(d.payload.final).toBe(18)
    expect(d.payload.taken).toBe(true)
    expect(rollup().totalTaken).toBe(18)
  })

  const heats = (cleared: boolean) =>
    events().filter(
      e => e.kind === 'heat' && !!(e.payload as any).cleared === cleared
    ) as ILogEvent<'heat'>[]
  const lastGain = () => heats(false).at(-1)
  const lastClear = () => heats(true).at(-1)

  it('counts self-inflicted damage as taken but never as dealt', () => {
    cc().TakeDamage(DamageType.Kinetic, 6)

    const d = last('damage')!
    expect(d.actorId).toBe(d.payload.targetId)
    expect(rollup().totalTaken).toBeGreaterThan(0)
    expect(rollup().totalDealt).toBe(0)
  })

  it('records heat and whether it crossed into the danger zone', () => {
    cc().ApplyHeat(1)
    expect(lastGain()!.payload.dangerZone).toBe(false)

    cc().ApplyHeat(cc().StatController.getMax(StatKey.HEATCAP))
    expect(lastGain()!.payload.dangerZone).toBe(true)
    expect(rollup().heatGained).toBeGreaterThan(0)
  })

  it('records heat leaving the reactor, and keeps gained gross', () => {
    cc().ApplyHeat(4)
    const gained = rollup().heatGained

    cc().Stabilize('cool')

    const cleared = lastClear()!
    expect(renderEvent(cleared, cc().CombatLog.ToStream(), t)).not.toContain('active.log')
    expect(cleared.payload.reason).toBe('stabilize')
    expect(cleared.payload.amount).toBe(4)
    expect(cleared.payload.current).toBe(0)
    expect(rollup().heatGained).toBe(gained)
    expect(rollup().heatCleared).toBe(4)
  })

  it('records a shutdown and a system effect as their own reasons', () => {
    cc().ApplyHeat(3)
    cc().RemoveHeat(1)
    expect(lastClear()!.payload.reason).toBe('effect')

    cc().ApplyHeat(3)
    cc().ShutDown()
    expect(lastClear()!.payload.reason).toBe('shutdown')
  })

  it('records the stress cascade rolling heat over, distinctly from cooling', () => {
    cc().ApplyHeat(cc().StatController.getMax(StatKey.HEATCAP) + 1)
    expect(lastClear()!.payload.reason).toBe('cascade')
  })

  it('does not record a full repair as cooling', () => {
    cc().ApplyHeat(4)
    const before = heats(true).length
    cc().FullRepair()
    expect(heats(true)).toHaveLength(before)
  })

  it('files clearing under the same actor as the gain, so one curve reads both', () => {
    cc().ApplyHeat(4)
    cc().Stabilize('cool')
    expect(lastClear()!.actorId).toBe(lastGain()!.actorId)
    expect(lastClear()!.actorId).toBe(actorId())
  })

  it('records a status once, with its duration, and again when it goes', () => {
    cc().AddStatus('impaired', 'end_turn_self')
    cc().RemoveStatus('impaired')

    const gained = events().filter(e => e.kind === 'status.gain')
    expect(gained).toHaveLength(1)
    expect((gained[0].payload as any).status).toEqual({ id: 'impaired', name: 'Impaired' })
    expect(last('status.lose')!.payload.reason).toBe('removed')
  })

  it('records the statuses a status implies as their own events', () => {
    cc().AddStatus('prone')

    const gained = events()
      .filter(e => e.kind === 'status.gain')
      .map(e => (e.payload as any).status.id)
    expect(gained).toEqual(['prone', 'slow'])
  })

  it('records movement wherever speed is spent, including a raw stat write', () => {
    const speed = cc().StatController.getMax(StatKey.SPEED)
    cc().StatController.setCurrentStat(StatKey.SPEED, speed - 2)

    expect(last('move')!.payload).toEqual({ spent: 2, mode: 'move' })
    expect(rollup().movementSpent).toBe(2)

    cc().StatController.CurrentStats[StatKey.SPEED] = speed - 5

    expect(last('move')!.payload).toEqual({ spent: 3, mode: 'move' })
    expect(rollup().movementSpent).toBe(5)
  })

  it('does not count forfeited movement as movement spent', () => {
    cc().PerformAction('act_prepare')

    expect(kinds()).toContain('prepare')
    expect(kinds()).not.toContain('move')
    expect(rollup().movementSpent).toBe(0)
  })

  it('records an overcharge with the heat it actually cost', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const cost = cc().Overcharge(4)

    const o = last('overcharge')!
    expect(o.payload.heat).toBe(cost)
    expect(o.payload.heat).toBe(4)
    expect(rollup().overchargeHeat).toBe(4)
    expect(rollup().overcharges).toBe(1)
  })

  it('records a refused action rather than saying nothing', () => {
    cc().AddStatus('engaged')
    cc().CombatLog.Clear()

    expect(cc().PerformAction('act_hide')).toBe(false)
    expect(last('blocked')!.payload.reason).toBe('engaged')
  })

  it('records reloading as one event naming what was reloaded', () => {
    const loading = { Name: 'Rifle', ID: 'w1', IsLoading: true, Used: true }
    vi.spyOn(cc(), 'ReloadOptions').mockReturnValue([loading])

    cc().Reload()

    expect(last('reload')!.payload.items).toEqual([{ id: 'w1', name: 'Rifle' }])
  })

  it('records a turn ending and a round advancing', () => {
    cc().EndTurn()
    cc().EndRound()

    expect(kinds()).toContain('turn.end')
    expect(kinds()).toContain('round.end')
    expect(kinds()).toContain('round.start')
    expect(rollup().rounds).toBe(1)
  })

  it('records the mech being destroyed, once', () => {
    cc().SetDestroyed(true)
    cc().CombatLog.Clear()
    cc().StatController.setCurrentStat(StatKey.STRUCTURE, 4)

    cc().TakeDamage(DamageType.Kinetic, 9999)

    expect(events().filter(e => e.kind === 'mech.status')).toHaveLength(1)
    expect(last('mech.status')!.payload.to).toBe('destroyed')
  })

  it('survives a save and reload without losing an event or repeating a seq', () => {
    cc().Record('note', { text: 'before' })
    cc().TakeDamage(DamageType.Energy, 3)
    const before = events().length

    const saved = JSON.parse(JSON.stringify(cc().CombatLog.Save()))
    cc().CombatLog.Load(saved)
    cc().Record('note', { text: 'after' })

    expect(events()).toHaveLength(before + 1)
    expect(new Set(events().map(e => e.seq)).size).toBe(before + 1)
    expect(reduceEvents(events(), actorId()).totalTaken).toBe(3)
  })

  it('renders everything it recorded to prose, with no raw keys left over', () => {
    cc().AddStatus('impaired', 'end_turn_self')
    cc().TakeDamage(DamageType.Explosive, 5)
    cc().ApplyHeat(2)
    cc().PerformAction('act_shut_down')
    cc().Reset()
    cc().PerformAction('act_boot_up')
    cc().EndTurn()

    const stream = cc().CombatLog.ToStream()
    const lines = stream.events.map(e => renderEvent(e, stream, t))

    expect(lines.length).toBeGreaterThan(4)
    expect(lines.filter(l => !l || l.includes('active.log.'))).toEqual([])
  })

  it('emits only kinds the schema declares', () => {
    cc().AddStatus('prone')
    cc().TakeDamage(DamageType.Kinetic, 4)
    cc().ApplyHeat(1)
    cc().EndTurn()
    cc().EndRound()

    const declared = new Set<string>(LOG_EVENT_KINDS)
    expect(kinds().filter(k => !declared.has(k))).toEqual([])
  })
})
