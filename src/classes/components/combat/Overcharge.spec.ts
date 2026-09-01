import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'
import { ActivePeriod, Frequency } from '@/classes/Frequency'
import { Action } from '@/classes/Action'
import { StatKey } from './stats/Stats'
import { CombatController } from './CombatController'

let pilot: Pilot
let mech: Mech

const cc = () => mech.CombatController
const spendQuick = () => cc().SetCombatAction('quick', false)

beforeEach(() => {
  pilot = makePilot({ level: 3 })
  mech = makeMech(pilot)
})

describe('skirmish and fight are once per turn', () => {
  it('marks the action alongside the weapon', () => {
    cc().UseAttackAction('act_skirmish', 'weapon_a')

    expect(cc().IsActionUsed('act_skirmish')).toBe(true)
    expect(cc().IsActionUsed('weapon_a')).toBe(true)
    expect(cc().IsActionUsed('weapon_b')).toBe(false)
    expect(cc().CanTakeAction('act_skirmish', 'Quick', 'weapon_b')).toBe(false)
  })

  it('blocks a second skirmish while leaving the quick action spendable', () => {
    cc().UseAttackAction('act_skirmish', 'weapon_a')
    spendQuick()

    expect(cc().CanTakeAction('act_skirmish', 'Quick', 'weapon_b')).toBe(false)
    expect(cc().CanActivate('quick')).toBe(true)
  })

  it('clears on EndTurn', () => {
    cc().UseAttackAction('act_skirmish', 'weapon_a')
    cc().EndTurn()

    expect(cc().IsActionUsed('act_skirmish')).toBe(false)
    expect(cc().CanTakeAction('act_skirmish', 'Quick', 'weapon_a')).toBe(true)
  })

  it('clears on EndRound', () => {
    cc().UseAttackAction('act_skirmish', 'weapon_a')
    cc().EndRound(null)

    expect(cc().IsActionUsed('act_skirmish')).toBe(false)
  })

  it('is restored by ClearActionUsed', () => {
    cc().UseAttackAction('act_skirmish', 'weapon_a')
    cc().ClearActionUsed('act_skirmish')

    expect(cc().CanTakeAction('act_skirmish', 'Quick', 'weapon_b')).toBe(true)
  })

  it('round-trips as a spent turn-scoped record', () => {
    cc().UseAttackAction('act_skirmish', 'weapon_a')

    const target = {} as any
    CombatController.Serialize(cc(), target)

    const fresh = makeMech(makePilot({ level: 3 })).CombatController
    CombatController.Deserialize(fresh, target)

    expect(fresh.IsActionUsed('act_skirmish')).toBe(true)
    fresh.ClearUses(ActivePeriod.Turn)
    expect(fresh.IsActionUsed('act_skirmish')).toBe(false)
  })

  it('locks fight independently of skirmish', () => {
    cc().UseAttackAction('act_fight', 'sidearm_a')

    expect(cc().CanTakeAction('act_fight', 'Quick', 'sidearm_b')).toBe(false)
    expect(cc().IsActionUsed('act_skirmish')).toBe(false)
  })
})

describe('overcharge state', () => {
  it('spends the overcharge slot and enters the overcharge state', () => {
    cc().StartOvercharge()

    expect(cc().InOvercharge).toBe(true)
    expect(cc().CanActivate('overcharge')).toBe(false)
  })

  it('grants a quick action without granting a full or protocol action', () => {
    spendQuick()
    spendQuick()
    expect(cc().CanActivate('quick')).toBe(false)

    cc().StartOvercharge()

    expect(cc().CanActivate('quick')).toBe(true)
    expect(cc().CanActivate('full')).toBe(false)
    expect(cc().CanActivate('protocol')).toBe(false)
  })

  it('spends the overcharge state instead of a quick slot', () => {
    cc().StartOvercharge()
    spendQuick()

    expect(cc().InOvercharge).toBe(false)
    expect(cc().CombatActions.Quick1).toBe(true)
    expect(cc().CombatActions.Quick2).toBe(true)

    spendQuick()
    expect(cc().CombatActions.Quick1).toBe(false)
    expect(cc().CombatActions.Quick2).toBe(true)
  })

  it('does not restore a spent quick action', () => {
    spendQuick()
    expect(cc().CombatActions.Quick1).toBe(false)

    cc().StartOvercharge()

    expect(cc().CombatActions.Quick1).toBe(false)
    expect(cc().CombatActions.Quick2).toBe(true)
  })

  it('repeats an already-used unlimited quick action but not an exhausted limited one', () => {
    cc().StartOvercharge()

    cc().MarkActionUsed('act_boost')
    expect(cc().CanRepeatAsOvercharge('act_boost', 'Quick')).toBe(true)

    cc().MarkActionUsed('act_limited', new Frequency('1/round'))
    expect(cc().CanRepeatAsOvercharge('act_limited', 'Quick')).toBe(false)

    expect(cc().CanRepeatAsOvercharge('act_boost', 'Full')).toBe(false)
  })

  it('refuses a declared 1/turn quick action once its single use is spent', () => {
    const limited = new Action({
      id: 'act_once_per_turn',
      name: 'Once Per Turn',
      activation: 'Quick',
      frequency: '1/turn',
    } as any)
    vi.spyOn(cc(), 'FindAction').mockImplementation(id =>
      id === 'act_once_per_turn' ? limited : undefined
    )

    cc().StartOvercharge()
    expect(cc().CanRepeatAsOvercharge('act_once_per_turn', 'Quick')).toBe(true)

    cc().MarkActionUsed('act_once_per_turn', limited.Frequency)
    expect(cc().CanRepeatAsOvercharge('act_once_per_turn', 'Quick')).toBe(false)
  })

  it('never repeats an action when not overcharged', () => {
    cc().MarkActionUsed('act_boost')
    expect(cc().CanRepeatAsOvercharge('act_boost', 'Quick')).toBe(false)
  })

  it('permits ordnance once overcharged, and still blocks it after moving', () => {
    expect(cc().CanActivate('ordnance')).toBe(true)

    cc().StartOvercharge()
    expect(cc().CanActivate('ordnance')).toBe(true)

    const speed = cc().StatController.getMax(StatKey.SPEED)
    cc().StatController.setCurrentStat(StatKey.SPEED, speed - 1)
    expect(cc().CanActivate('ordnance')).toBe(false)
  })

  it('clears on EndRound and ResetCombatActions', () => {
    cc().StartOvercharge()
    cc().EndRound(null)
    expect(cc().InOvercharge).toBe(false)

    cc().StartOvercharge()
    cc().ResetCombatActions()
    expect(cc().InOvercharge).toBe(false)
  })

  it('clears on EndTurn once the actor has another activation left', () => {
    cc().StatController.setCurrentStat(StatKey.ACTIVATIONS, 2)
    cc().StartOvercharge()
    cc().EndTurn()

    expect(cc().InOvercharge).toBe(false)
  })

  it('clears on EndTurn for a single activation actor too', () => {
    cc().StartOvercharge()
    cc().SetCombatAction('full', false)
    cc().EndTurn()

    expect(cc().InOvercharge).toBe(false)
    expect(cc().CombatActions.Quick1).toBe(false)
  })

  it('clears through the brace cooldown branch of EndRound', () => {
    cc().StartOvercharge()
    cc().Braced = true
    cc().EndRound(null)

    expect(cc().InOvercharge).toBe(false)
    expect(cc().CombatActions.Overcharge).toBe(false)
  })

  it('is cancelled by handing the overcharge slot back', () => {
    cc().StartOvercharge()
    cc().SetCombatAction('overcharge', true)

    expect(cc().InOvercharge).toBe(false)
    expect(cc().CanActivate('overcharge')).toBe(true)
  })

  it('round-trips, and a save without the key deserializes as inactive', () => {
    cc().StartOvercharge()

    const target = {} as any
    CombatController.Serialize(cc(), target)
    expect(target.combatActions.InOvercharge).toBe(true)

    const fresh = makeMech(makePilot({ level: 3 })).CombatController
    CombatController.Deserialize(fresh, target)
    expect(fresh.InOvercharge).toBe(true)

    const legacy = makeMech(makePilot({ level: 3 })).CombatController
    CombatController.Deserialize(legacy, {
      combatActions: {
        Protocol: true,
        Full: true,
        Quick1: true,
        Quick2: true,
        Overcharge: true,
        Reaction: true,
      },
    } as any)
    expect(legacy.InOvercharge).toBe(false)
  })
})

describe('skirmish under overcharge', () => {
  it('unlocks a second skirmish and spends the overcharge for it', () => {
    cc().UseAttackAction('act_skirmish', 'weapon_a')
    expect(cc().CanTakeAction('act_skirmish', 'Quick', 'weapon_b')).toBe(false)

    cc().StartOvercharge()
    expect(cc().CanTakeAction('act_skirmish', 'Quick', 'weapon_b')).toBe(true)

    spendQuick()
    expect(cc().InOvercharge).toBe(false)
    expect(cc().CombatActions.Quick1).toBe(true)
    expect(cc().CombatActions.Quick2).toBe(true)
  })
})

describe('pilots cannot overcharge', () => {
  it('never unlocks a second fight', () => {
    cc().UseAttackAction('act_fight', 'sidearm_a')
    cc().StartOvercharge()

    expect(cc().CanRepeatAsOvercharge('act_fight', 'Quick')).toBe(false)
    expect(cc().CanTakeAction('act_fight', 'Quick', 'sidearm_b')).toBe(false)
  })

  it('does not give a dismounted pilot a quick action from the mech overcharge', () => {
    cc().StartOvercharge()
    pilot.CombatController.SetCombatAction('full', false)
    pilot.CombatController.Mounted = false

    expect(pilot.CombatController.CanActivate('quick')).toBe(false)
    expect(pilot.CombatController.HasRemainingActions).toBe(false)
  })

  it('refuses every repeat while the pilot is dismounted', () => {
    cc().StartOvercharge()

    pilot.CombatController.Mounted = false
    expect(pilot.CombatController.CanRepeatAsOvercharge('act_boost', 'Quick')).toBe(false)

    pilot.CombatController.Mounted = true
    expect(pilot.CombatController.CanRepeatAsOvercharge('act_boost', 'Quick')).toBe(true)
  })
})
