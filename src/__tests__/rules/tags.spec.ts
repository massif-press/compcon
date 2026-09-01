import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CompendiumStore } from '@/features/compendium/store'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { isDestroyable } from '@/classes/components/combat/StructureCheck'
import { mech, rollSeq } from './_helpers'

declare function overkillTriggers(o: { die: number; represents: number; rolled: number }): boolean
declare function structureDamageTargets(mech: any): any[]
import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController

const loadingWeapon = () =>
  CompendiumStore().MechWeapons.find((w: any) => w.Tags?.some((t: any) => t.ID === 'tg_loading'))

beforeEach(() => {
  m = mech()
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('loading', () => {
  it('T-TAG-loading-01: a loading weapon reports itself as reloading equipment', () => {
    const w = loadingWeapon()
    if (!w) return
    expect(w.IsLoading).toBe(true)
  })

  it('T-TAG-loading-01: reload clears every expended loading weapon', () => {
    const eq = { IsReloading: true, IsUsed: true, Recharge: 0 }
    const spy = vi.spyOn(cc(), 'AllEquipment', 'get').mockReturnValue([eq] as any)

    cc().Reload()

    expect(eq.IsUsed).toBe(false)
    spy.mockRestore()
  })

  it('T-TAG-loading-01: reload leaves non-loading equipment alone', () => {
    const eq = { IsReloading: false, IsUsed: true, Recharge: 0 }
    const spy = vi.spyOn(cc(), 'AllEquipment', 'get').mockReturnValue([eq] as any)

    cc().Reload()

    expect(eq.IsUsed).toBe(true)
    spy.mockRestore()
  })
})

describe('tag defects', () => {
  it('T-TAG-overkill-01: rerolls on a 1 in the resulting value, not the raw die, so a d6 read as a d3 rerolls on 1 and 2', () => {
    expect(DiceRoller.overkillTriggers({ die: 6, represents: 3, rolled: 2 })).toBe(true)
    expect(DiceRoller.overkillTriggers({ die: 6, represents: 3, rolled: 3 })).toBe(false)

    expect(DiceRoller.overkillTriggers({ die: 6, rolled: 1 })).toBe(true)
    expect(DiceRoller.overkillTriggers({ die: 6, rolled: 2 })).toBe(false)
  })

  it('T-TAG-overkill-01: each reroll deals the attacker one heat, from the engine', () => {
    rollSeq(1, 1, 4)
    const result = DiceRoller.rollDamage('1d6', false, true)

    expect(result.overkillHeat).toBe(2)
  })

  it('T-TAG-mod-01: a weapon mod is never a valid system trauma target', () => {
    const mod = CompendiumStore().WeaponMods[0]
    expect(mod.IsMod).toBe(true)
    expect(isDestroyable(mod)).toBe(false)

    expect(isDestroyable({ Destroyed: false, IsLimited: false })).toBe(true)
  })
})
