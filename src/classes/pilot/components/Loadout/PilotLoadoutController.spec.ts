import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import { PilotLoadoutController } from './PilotLoadoutController'
import { PilotLoadout } from './PilotLoadout'
import { ItemType } from '@/classes/enums'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const loadouts = () => pilot.PilotLoadoutController
const gearOfType = (type: ItemType) =>
  CompendiumStore().PilotGear.find((g: any) => g.ItemType === type)

beforeEach(() => {
  pilot = makePilot()
})

describe('PilotLoadoutController', () => {
  it('starts with one active loadout', () => {
    expect(loadouts().Loadouts).toHaveLength(1)
    expect(loadouts().ActiveLoadoutIndex).toBe(0)
    expect(loadouts().ActiveLoadout).toBe(loadouts().Loadouts[0])
  })

  it('adds a numbered loadout and makes it active', () => {
    loadouts().AddLoadout()

    expect(loadouts().Loadouts).toHaveLength(2)
    expect(loadouts().ActiveLoadout.Name).toBe('Loadout 2')
    expect(loadouts().ActiveLoadoutIndex).toBe(1)
  })

  it('clones the active loadout next to it', () => {
    loadouts().ActiveLoadout.Name = 'Test Loadout'
    loadouts().CloneLoadout()

    expect(loadouts().Loadouts.map(l => l.Name)).toEqual(['Test Loadout', 'Test Loadout (Copy)'])
    expect(loadouts().ActiveLoadoutIndex).toBe(1)
  })

  it('removes a loadout but never the last one', () => {
    loadouts().AddLoadout()
    loadouts().RemoveLoadout(1)
    expect(loadouts().Loadouts).toHaveLength(1)

    loadouts().RemoveLoadout(0)
    expect(loadouts().Loadouts).toHaveLength(1)
  })
})

describe('PilotLoadout equipment slots', () => {
  it('refuses an item past the slot limit', () => {
    const armor = gearOfType(ItemType.PilotArmor)
    if (!armor) return

    const loadout = loadouts().ActiveLoadout
    loadout.Add(armor as never, loadouts().MaxArmorSlots)

    expect(loadout.Armor).toHaveLength(0)
  })

  it('adds and removes gear by instance', () => {
    const weapon = gearOfType(ItemType.PilotWeapon)
    if (!weapon) return

    const loadout = loadouts().ActiveLoadout
    loadout.Add(weapon as never, 0)
    expect(loadout.Weapons).toHaveLength(1)

    loadout.Remove(weapon as never)
    expect(loadout.Weapons).toHaveLength(0)
  })

  it('ignores an item that is not pilot gear', () => {
    const loadout = loadouts().ActiveLoadout
    loadout.Add({ ItemType: ItemType.MechWeapon } as never, 0)

    expect(loadout.Items.filter(Boolean)).toEqual([])
  })
})

describe('PilotLoadoutController.Serialize/Deserialize', () => {
  it('round-trips every loadout and the active index', () => {
    loadouts().AddLoadout()
    loadouts().ActiveLoadout.Name = 'Test Loadout'

    const target: any = {}
    PilotLoadoutController.Serialize(pilot, target)

    const other = makePilot()
    PilotLoadoutController.Deserialize(other, target)

    expect(other.PilotLoadoutController.Loadouts.map(l => l.Name)).toEqual(
      loadouts().Loadouts.map(l => l.Name)
    )
    expect(other.PilotLoadoutController.ActiveLoadoutIndex).toBe(1)
  })

  it('keeps only the active loadout when serialized as an instance', () => {
    loadouts().AddLoadout()
    loadouts().ActiveLoadout.Name = 'Test Loadout'

    const target: any = {}
    PilotLoadoutController.Serialize(pilot, target, true)

    expect(target.loadouts).toHaveLength(1)
    expect(target.active_index).toBe(0)
    expect(PilotLoadout.Deserialize(target.loadouts[0], loadouts()).Name).toBe('Test Loadout')
  })
})
