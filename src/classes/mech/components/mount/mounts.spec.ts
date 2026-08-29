import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import WeaponSlot from './WeaponSlot'
import EquippableMount from './EquippableMount'
import IntegratedMount from './IntegratedMount'
import { MechLoadout } from '../loadout/MechLoadout'
import { WeaponMod } from '../equipment/WeaponMod'
import type { Mech } from '@/classes/mech/Mech'
import type { MechWeapon } from '../equipment/MechWeapon'

let mech: Mech

const loadout = () => mech.MechLoadoutController.ActiveLoadout
const weapon = () =>
  CompendiumStore().instantiate(
    'MechWeapons',
    CompendiumStore().MechWeapons.find(w => !w.IsHidden)!.ID
  ) as MechWeapon

beforeEach(() => {
  mech = makeMech(makePilot({ level: 3 }))
})

describe('MechLoadout mounts', () => {
  it('exposes equippable and integrated mounts', () => {
    expect(loadout().EquippableMounts.length).toBeGreaterThan(0)
    expect(Array.isArray(loadout().IntegratedMounts)).toBe(true)
  })

  it('keeps the special mounts separate from the frame mounts', () => {
    expect(loadout().IntegratedWeaponMount).toBeInstanceOf(EquippableMount)
    expect(loadout().ImprovedArmamentMount).toBeInstanceOf(EquippableMount)
    expect(loadout().SuperheavyMount).toBeInstanceOf(EquippableMount)
  })

  it('reports itself unequipped until every mount is filled', () => {
    expect(loadout().FullyEquipped).toBe(false)
  })

  it('round-trips through Serialize', () => {
    const mount = loadout().EquippableMounts.find(m => m.Slots.length)!
    mount.Slots[0].EquipWeapon(weapon(), false)

    const back = MechLoadout.Deserialize(
      JSON.parse(JSON.stringify(MechLoadout.Serialize(loadout()))),
      mech
    )

    expect(back.Weapons.map(w => w.ID)).toEqual(loadout().Weapons.map(w => w.ID))
  })
})

describe('WeaponSlot', () => {
  it('starts empty, takes a weapon, and gives it up again', () => {
    const slot = loadout().EquippableMounts.find(m => m.Slots.length)!.Slots[0]

    expect(slot.Weapon).toBeNull()

    const w = weapon()
    slot.EquipWeapon(w, false)
    expect(slot.Weapon?.ID).toBe(w.ID)

    slot.UnequipWeapon()
    expect(slot.Weapon).toBeNull()
  })

  it('round-trips with its weapon', () => {
    const mount = loadout().EquippableMounts.find(m => m.Slots.length)!
    const slot = mount.Slots[0]
    slot.EquipWeapon(weapon(), false)

    const back = WeaponSlot.Deserialize(
      JSON.parse(JSON.stringify(WeaponSlot.Serialize(slot))),
      mount
    )

    expect(back.Weapon?.ID).toBe(slot.Weapon?.ID)
    expect(back.Size).toBe(slot.Size)
  })

  it('round-trips an empty slot', () => {
    const mount = loadout().EquippableMounts.find(m => m.Slots.length)!
    const back = WeaponSlot.Deserialize(WeaponSlot.Serialize(mount.Slots[0]), mount)

    expect(back.Weapon).toBeNull()
  })
})

describe('EquippableMount', () => {
  it('locks and unlocks against another mount', () => {
    const [a, b] = loadout().EquippableMounts

    a.Lock(b)
    expect(a.LockTarget).toBe(b)

    a.Unlock()
    expect(a.LockTarget).toBeNull()
  })

  it('clears its slots', () => {
    const mount = loadout().EquippableMounts.find(m => m.Slots.length)!
    mount.Slots[0].EquipWeapon(weapon(), false)

    mount.Clear()

    expect(mount.Slots.every(s => !s.Weapon)).toBe(true)
  })

  it('round-trips its type and contents', () => {
    const mount = loadout().EquippableMounts.find(m => m.Slots.length)!
    mount.Slots[0].EquipWeapon(weapon(), false)

    const back = EquippableMount.Deserialize(
      JSON.parse(JSON.stringify(EquippableMount.Serialize(mount))),
      loadout()
    )

    expect(back.Type).toBe(mount.Type)
    expect(back.Weapons.map(w => w.ID)).toEqual(mount.Weapons.map(w => w.ID))
  })
})

describe('IntegratedMount', () => {
  it('round-trips its weapon', () => {
    const w = weapon()
    const mount = new IntegratedMount(w, loadout())

    const back = IntegratedMount.Deserialize(
      JSON.parse(JSON.stringify(IntegratedMount.Serialize(mount))),
      loadout()
    )

    expect(back.Weapons.map(x => x.ID)).toEqual([w.ID])
  })
})

describe('WeaponMod', () => {
  it('round-trips a compendium mod', () => {
    const source = CompendiumStore().WeaponMods.find(m => !m.IsHidden)
    if (!source) return

    const mod = WeaponMod.Deserialize(WeaponMod.Serialize(source))

    expect(mod.ID).toBe(source.ID)
    expect(WeaponMod.Serialize(mod).instanceId).toBe(mod.InstanceID)
  })
})
