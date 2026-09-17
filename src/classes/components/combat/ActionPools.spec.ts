import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot
let mech: Mech

const pcc = () => pilot.CombatController
const mcc = () => mech.CombatController

beforeEach(() => {
  pilot = makePilot({ level: 3 })
  mech = makeMech(pilot)
})

describe('pilot and mech hold separate action pools', () => {
  it('a pilot quick action spends exactly one pilot slot and no mech slot', () => {
    pcc().SetCombatAction('quick', false)

    expect(pcc().CombatActions.Quick1).toBe(false)
    expect(pcc().CombatActions.Quick2).toBe(true)
    expect(mcc().CombatActions.Quick1).toBe(true)
    expect(mcc().CombatActions.Quick2).toBe(true)
  })

  it('a mech quick action spends exactly one mech slot and no pilot slot', () => {
    mcc().SetCombatAction('quick', false)

    expect(mcc().CombatActions.Quick1).toBe(false)
    expect(mcc().CombatActions.Quick2).toBe(true)
    expect(pcc().CombatActions.Quick1).toBe(true)
    expect(pcc().CombatActions.Quick2).toBe(true)
  })

  it('undoing an activation restores exactly one slot', () => {
    pcc().SetCombatAction('quick', false)
    pcc().SetCombatAction('quick', false)
    expect(pcc().CombatActions.Quick1).toBe(false)
    expect(pcc().CombatActions.Quick2).toBe(false)

    pcc().ResetActivation('quick')
    expect(pcc().CombatActions.Quick1).toBe(true)
    expect(pcc().CombatActions.Quick2).toBe(false)
  })

  it('a mounted pilot still sees the mech overcharge, a dismounted one does not', () => {
    mcc().StartOvercharge()

    pilot.CombatController.Mounted = true
    expect(pcc().ActionPoolController.OverchargeApplies).toBe(true)

    pilot.CombatController.Mounted = false
    expect(pcc().ActionPoolController.OverchargeApplies).toBe(false)
  })
})

describe('overcharge repeats mech quick actions regardless of the pilot flag', () => {
  it('offers a repeat of hide and prepare to a mech in overcharge', () => {
    mcc().UseAttackAction('act_hide', 'act_hide')
    mcc().StartOvercharge()

    expect(mcc().CanRepeatAsOvercharge('act_hide', 'Quick')).toBe(true)
    expect(mcc().CanRepeatAsOvercharge('act_prepare', 'Quick')).toBe(true)
  })

  it('offers nothing to a dismounted pilot', () => {
    mcc().StartOvercharge()
    pilot.CombatController.Mounted = false

    expect(pcc().CanRepeatAsOvercharge('act_hide', 'Quick')).toBe(false)
  })
})
