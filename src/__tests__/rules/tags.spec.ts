import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CompendiumStore } from '@/features/compendium/store'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { isDestroyable } from '@/classes/components/combat/StructureCheck'
import { mech, rollSeq, cur, StatKey } from './_helpers'
import { weaponPool } from '@/classes/components/combat/AttackRules'
import { usableWeapons, weaponUseState } from '@/classes/components/combat/flows/WeaponUseFlow'
import { DamageType } from '@/classes/enums'

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

  it('T-TAG-loading-01: reload clears every expended loading weapon, and offers only those', () => {
    const loading = { IsLoading: true, Used: true, Name: 'loading' }
    const spent = { IsLoading: false, Used: true, Name: 'other' }
    const ready = { IsLoading: true, Used: false, Name: 'ready' }
    vi.spyOn(cc(), 'AllEquipment', 'get').mockReturnValue([loading, spent, ready] as any)

    expect(
      cc()
        .ReloadOptions()
        .map((x: any) => x.Name)
    ).toEqual(['loading'])

    expect(cc().Reload()).toBe(true)
    expect(loading.Used).toBe(false)
    expect(spent.Used).toBe(true)
  })

  it('T-TAG-loading-01: reload leaves non-loading equipment alone', () => {
    const eq = { IsLoading: false, Used: true, Name: 'other' }
    vi.spyOn(cc(), 'AllEquipment', 'get').mockReturnValue([eq] as any)

    expect(cc().Reload()).toBe(false)
    expect(eq.Used).toBe(true)
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

describe('barrage weapon selection and burn resistance', () => {
  it('T-ACTION-barrage-01: the same weapon cannot be chosen twice, but two copies can', () => {
    const a = { InstanceID: 'a', Name: 'rifle', Barrage: true }
    const b = { InstanceID: 'b', Name: 'rifle', Barrage: true }
    const notBarrage = { InstanceID: 'c', Name: 'aux', Barrage: false }
    const cc = {
      ActiveActor: {
        MechLoadoutController: { ActiveLoadout: { Weapons: [a, b, notBarrage] } },
      },
    }
    const offered = (selected: any[]) =>
      usableWeapons(
        weaponUseState({
          cc,
          actionId: 'act_barrage',
          mode: 'barrage',
          makeEvent: () => ({}),
          selected,
        })
      ).map(w => w.InstanceID)

    expect(weaponPool(cc, 'barrage').map(w => w.InstanceID)).toEqual(['a', 'b'])
    expect(offered([])).toEqual(['a', 'b'])
    expect(offered([a])).toEqual(['b'])
    expect(offered([a, b])).toEqual([])
  })

  it('T-DMG-burn-01: resistance halves the burn taken on application, not the end-of-turn tick', () => {
    const m = mech()
    const cc = m.CombatController
    cc.AddResist('burn', 'resistance')

    cc.TakeDamage(DamageType.Burn, 4)
    expect(cur(cc, StatKey.BURN)).toBe(2)

    const hp = cur(cc, StatKey.HP)
    cc.ResolveBurn(false)

    expect(cur(cc, StatKey.HP)).toBe(hp - 2)
  })
})
