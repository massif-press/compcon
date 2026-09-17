import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import type { Mech } from '@/classes/mech/Mech'
import { CoverType } from '../CombatController'
import { StatKey } from '../stats/Stats'

let mech: Mech
const cc = () => mech.CombatController
const kinds = () => cc().CombatLog.Events.map(e => e.kind)

beforeEach(() => {
  mech = makeMech(makePilot({ level: 3 }))
  mech.SetStats()
  cc().StatController.resetCurrentStats()
  cc().CombatLog.Clear()
})

describe('cover recording', () => {
  it('records cover when it is taken, not once per round', () => {
    cc().Cover = CoverType.Soft
    expect(kinds()).toEqual(['cover'])

    cc().Cover = CoverType.Soft
    expect(kinds()).toEqual(['cover'])

    cc().Cover = CoverType.None
    expect(cc().CombatLog.Events.at(-1)?.payload).toEqual({ cover: 'none' })
  })

  it('emits no cover event across a round boundary when no cover is taken', () => {
    cc().EndRound()
    expect(kinds()).not.toContain('cover')
  })
})

describe('end round lifecycle', () => {
  it('spends the outstanding activation before refilling', () => {
    cc().EndRound()
    expect(kinds()).toContain('turn.end')
    expect(kinds()).toContain('round.end')
    expect(kinds()).toContain('round.start')
  })

  it('clears an unlimited used mark at the boundary and leaves a limited one', () => {
    const plain: any = { Name: 'Plain', Used: true, IsLimited: false, Uses: 0, MaxUses: 0 }
    const limited: any = { Name: 'Ltd', Used: true, IsLimited: true, Uses: 1, MaxUses: 1 }
    Object.defineProperty(cc(), 'AllEquipment', { get: () => [plain, limited] })

    cc().EndRound()

    expect(plain.Used).toBe(false)
    expect(limited.Used).toBe(true)
    expect(limited.Uses).toBe(1)
  })

  it('leaves a silent secondary controller out of the round record', () => {
    cc().EndRound(undefined, true)
    expect(kinds()).not.toContain('round.end')
    expect(kinds()).not.toContain('round.start')
    expect(kinds()).not.toContain('turn.end')
    expect(cc().StatController.getCurrent(StatKey.ACTIVATIONS)).toBeGreaterThan(0)
  })
})

describe('encounter-scoped reset', () => {
  it('clears statuses, cover, uses and the log', () => {
    cc().Cover = CoverType.Hard
    cc().AddStatus('impaired')
    cc().MarkActionUsed('act_x')
    expect(cc().CombatLog.Events.length).toBeGreaterThan(0)

    cc().ResetForEncounter()

    expect(cc().Cover).toBe(CoverType.None)
    expect(cc().Statuses).toEqual([])
    expect(cc().IsActionUsed('act_x')).toBe(false)
    expect(cc().CombatLog.Events).toEqual([])
    expect(cc().Round).toBe(1)
  })
})

describe('activation recording', () => {
  it('records exactly one action per activation, and none when the caller already did', () => {
    cc().Activate('quick', { actionId: 'act_hide' })
    expect(kinds().filter(k => k === 'action')).toHaveLength(1)

    cc().CombatLog.Clear()
    cc().Activate('quick', { actionId: 'act_hide', recorded: true })
    expect(kinds()).not.toContain('action')
  })
})
