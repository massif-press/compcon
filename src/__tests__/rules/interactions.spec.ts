import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DamageType } from '@/classes/enums'
import { effectsFor, structureDamageTargets } from '@/classes/components/combat/StructureCheck'
import { CombatController } from '@/classes/components/combat/CombatController'

import { mech, npc, cur, max, set, setMax, StatKey } from './_helpers'
import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'

let m: Mech
let p: Pilot
const cc = () => m.CombatController

beforeEach(() => {
  m = mech()
  p = m.Pilot as Pilot
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('rule interactions', () => {
  it('T-INT-duration-01: a chart status survives the turn it lands on and expires on the next', () => {
    const fx = effectsFor('core-structure-damage', { title: 'Glancing Blow' } as any) as any
    cc().AddStatus(fx[0].id, fx[0].duration)

    const entry = cc().Statuses.find(s => s.status.ID === 'impaired')!
    expect(entry.expires.HasExpired(cc().Round, m.ID, cc().Turn)).toBe(false)
    expect(entry.expires.HasExpired(cc().Round, m.ID, cc().Turn + 1)).toBe(true)
  })

  it('T-INT-duration-02: a scene-duration status survives every round boundary', () => {
    cc().AddStatus('slow', 'scene')

    cc().EndRound(undefined)
    cc().EndRound(undefined)

    expect(cc().HasStatus('slow')).toBe(true)
  })

  it('T-INT-heat-01: overcharge heat can trigger an overheating check in the same step', () => {
    setMax(cc(), StatKey.HEATCAP, 4)
    set(cc(), StatKey.HEATCAP, 4)
    const stress = cur(cc(), StatKey.STRESS)

    cc().TakeDamage(DamageType.Heat, 1)

    expect(cur(cc(), StatKey.STRESS)).toBe(stress - 1)
    expect(cc().PendingChecks.some(x => x.kind === 'stress')).toBe(true)
  })

  it('T-INT-heat-02: overcharge heat against an actor with no heat cap becomes energy damage', () => {
    setMax(cc(), StatKey.HEATCAP, 0)
    const hp = cur(cc(), StatKey.HP)

    cc().TakeDamage(DamageType.Heat, 3)

    expect(cur(cc(), StatKey.HP)).toBe(hp - 3)
  })

  it('T-INT-reaction-01: bracing locks out reactions until the end of the next turn', () => {
    cc().Brace()
    expect(cc().CanActivate('reaction')).toBe(false)

    cc().EndRound(undefined)
    expect(cc().CanActivate('reaction')).toBe(false)
  })

  it("T-INT-reaction-02: a reaction spent before the first turn stays spent until StartTurn, the engine's only turn-start hook", () => {
    cc().SetCombatAction('reaction', false)
    expect(cc().CanActivate('reaction')).toBe(false)

    cc().StartTurn()
    expect(cc().CanActivate('reaction')).toBe(true)
  })

  it('T-INT-struct-01: system trauma never offers a weapon mod as a target', () => {
    const opts = structureDamageTargets(cc())
    expect(opts.some((o: any) => o.IsMod)).toBe(false)
  })

  it('T-INT-struct-02: a hit crossing three structure points on a ten HP track queues a check for each', () => {
    setMax(cc(), StatKey.HP, 10)
    setMax(cc(), StatKey.STRUCTURE, 4)
    set(cc(), StatKey.HP, 10)
    set(cc(), StatKey.STRUCTURE, 4)

    cc().ApplyDamage(DamageType.Kinetic, 35)

    expect(cur(cc(), StatKey.STRUCTURE)).toBe(1)
    expect(cc().PendingChecks.filter(x => x.kind === 'structure')).toHaveLength(3)
  })

  it('T-INT-struct-03: a one-structure NPC is destroyed without selecting a chart row', () => {
    const u = npc()
    const c = u.CombatController
    setMax(c, StatKey.STRUCTURE, 1)
    set(c, StatKey.STRUCTURE, 1)
    setMax(c, StatKey.HP, 8)
    set(c, StatKey.HP, 8)

    c.ApplyDamage(DamageType.Kinetic, 8)

    expect(c.IsDestroyed).toBe(true)
    expect(c.PendingChecks).toHaveLength(0)
  })

  it('T-INT-status-01: a stunned mech cannot overcharge, and loses one already granted', () => {
    cc().StartOvercharge()
    cc().AddStatus('stunned')

    expect(cc().CanActivate('overcharge')).toBe(false)
    expect(cc().InOvercharge).toBe(false)
  })

  it('T-INT-status-02: prone implies slowed', () => {
    cc().AddStatus('prone')
    expect(cc().CanActivate('boost')).toBe(false)

    cc().RemoveStatus('prone')
    expect(cc().CanActivate('boost')).toBe(true)
  })

  it('T-INT-status-03: shredded removes armor and resistance but leaves exposed and vulnerable', () => {
    set(cc(), StatKey.ARMOR, 3)
    cc().AddResist('kinetic', 'resistance')
    cc().AddStatus('shredded')
    cc().AddStatus('exposed')

    expect(cc().CalculateDamage(DamageType.Kinetic, 5).total).toBe(10)
  })

  it('T-INT-undo-01: a structure check snapshot restores stats, statuses, and pending checks', () => {
    const snapshot: any = {}
    CombatController.Serialize(cc(), snapshot)

    set(cc(), StatKey.STRUCTURE, 1)
    cc().AddStatus('impaired')

    CombatController.Deserialize(cc(), snapshot)

    expect(cur(cc(), StatKey.STRUCTURE)).toBe(max(cc(), StatKey.STRUCTURE))
    expect(cc().HasStatus('impaired')).toBe(false)
    expect(cc().PendingChecks).toHaveLength(0)
  })

  it('T-INT-actor-01: a mounted pilot cannot be brought down and out while the mech is intact', () => {
    const pilotHp = cur(p.CombatController, StatKey.HP)

    p.CombatController.ApplyDamage(DamageType.Kinetic, 99)

    expect(cur(p.CombatController, StatKey.HP)).toBe(pilotHp)
    expect(p.CombatController.HasStatus('downandout')).toBe(false)
  })

  it('T-INT-actor-02: an AI mech and its pilot spend from separate pools', () => {
    cc().ToggleMounted()
    cc().AIControl = true
    expect(cc().IsAIControlled).toBe(true)
    cc().SetCombatAction('full', false)

    expect(cc().CanActivate('full')).toBe(false)
    expect(p.CombatController.CanActivate('full')).toBe(true)
  })
})
