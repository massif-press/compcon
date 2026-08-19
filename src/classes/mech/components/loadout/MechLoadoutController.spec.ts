import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot, makeMech } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import { MechLoadoutController } from './MechLoadoutController'
import type { Mech } from '@/classes/mech/Mech'
import type { MechWeapon } from '../equipment/MechWeapon'
import type { MechSystem } from '../equipment/MechSystem'

let mech: Mech

const loadouts = () => mech.MechLoadoutController
const weapon = () =>
  CompendiumStore().instantiate(
    'MechWeapons',
    CompendiumStore().MechWeapons.find(w => !w.IsHidden)!.ID
  ) as MechWeapon
const system = () =>
  CompendiumStore().instantiate(
    'MechSystems',
    CompendiumStore().MechSystems.find(s => !s.IsHidden)!.ID
  ) as MechSystem

const equipWeapon = (w = weapon()) => {
  const mount = loadouts().ActiveLoadout.EquippableMounts.find(m => m.Slots.length)!
  mount.Slots[0].EquipWeapon(w, false)
  return w
}

beforeEach(() => {
  mech = makeMech(makePilot({ level: 3 }))
})

describe('MechLoadoutController', () => {
  it('starts with one active loadout', () => {
    expect(loadouts().Loadouts).toHaveLength(1)
    expect(loadouts().ActiveLoadout).toBe(loadouts().Loadouts[0])
  })

  it('adds a loadout and makes it active', () => {
    loadouts().AddLoadout()

    expect(loadouts().Loadouts).toHaveLength(2)
    expect(loadouts().ActiveLoadout).toBe(loadouts().Loadouts[1])
  })

  it('clones the active loadout', () => {
    equipWeapon()
    loadouts().CloneLoadout()

    expect(loadouts().Loadouts).toHaveLength(2)
    expect(loadouts().ActiveLoadout.Weapons).toHaveLength(1)
  })

  it('removes a loadout but never the last one', () => {
    loadouts().AddLoadout()
    loadouts().RemoveLoadout()
    expect(loadouts().Loadouts).toHaveLength(1)

    loadouts().RemoveLoadout()
    expect(loadouts().Loadouts).toHaveLength(1)
  })

  it('finds the mount a weapon sits in', () => {
    const w = equipWeapon()
    expect(loadouts().getMount(w)).toBeTruthy()
    expect(loadouts().getMount(weapon())).toBeFalsy()
  })
})

describe('MechLoadout contents', () => {
  it('lists an equipped weapon', () => {
    const w = equipWeapon()
    expect(loadouts().ActiveLoadout.Weapons.map(x => x.ID)).toContain(w.ID)
  })

  it('lists an added system', () => {
    const s = system()
    loadouts().ActiveLoadout.AddSystem(s)

    expect(loadouts().ActiveLoadout.Systems.map(x => x.ID)).toContain(s.ID)
  })

  it('reports empty mounts before anything is equipped', () => {
    expect(loadouts().ActiveLoadout.HasEmptyMounts).toBe(true)
  })

  it('unequips a weapon from its slot', () => {
    equipWeapon()
    const mount = loadouts().ActiveLoadout.EquippableMounts.find(m => m.Slots[0]?.Weapon)!

    mount.Slots[0].UnequipWeapon()

    expect(mount.Slots[0].Weapon).toBeNull()
  })

  it('clears a whole mount', () => {
    equipWeapon()
    const mount = loadouts().ActiveLoadout.EquippableMounts.find(m => m.Slots[0]?.Weapon)!

    mount.Clear()

    expect(mount.Slots.every(s => !s.Weapon)).toBe(true)
  })
})

describe('MechLoadoutController.Serialize/Deserialize', () => {
  it('round-trips loadouts with their equipment', () => {
    const w = equipWeapon()
    loadouts().ActiveLoadout.AddSystem(system())

    const target: any = {}
    MechLoadoutController.Serialize(mech, target)

    const other = makeMech(makePilot())
    MechLoadoutController.Deserialize(other, JSON.parse(JSON.stringify(target)))

    const active = other.MechLoadoutController.ActiveLoadout
    expect(active.Weapons.map(x => x.ID)).toContain(w.ID)
    expect(active.Systems).toHaveLength(1)
  })

  it('keeps only the active loadout when serialized as an instance', () => {
    loadouts().AddLoadout()

    const target: any = {}
    MechLoadoutController.Serialize(mech, target, true)

    expect(target.loadouts).toHaveLength(1)
  })
})
