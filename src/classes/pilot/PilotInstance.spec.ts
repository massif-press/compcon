import { describe, it, expect } from 'vitest'
import { Pilot } from './Pilot'
import { CompendiumStore } from '@/features/compendium/store'
import { makePilot, makeMech } from '@/__tests__/factories'
import type { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'

const equipFirstWeapon = (pilot: Pilot): MechWeapon => {
  const mech = pilot.Mechs[0]
  const mount = mech.MechLoadoutController.ActiveLoadout.EquippableMounts.find(
    m => m.Slots.length > 0
  )!
  const weapon = CompendiumStore().instantiate(
    'MechWeapons',
    CompendiumStore().MechWeapons.find(w => !w.IsHidden)!.ID
  ) as MechWeapon

  mount.Slots[0].EquipWeapon(weapon, false)
  return weapon
}

describe('Pilot instance identity', () => {
  it('keeps the same instanceId across repeated saves', () => {
    const pilot = makePilot()

    const first = Pilot.Serialize(pilot, true).instanceId
    const second = Pilot.Serialize(pilot, true).instanceId

    expect(first).toBeTruthy()
    expect(second).toBe(first)
  })

  it('keeps the instanceId across a save and reload', () => {
    const pilot = makePilot()
    const saved = Pilot.Serialize(pilot, true)
    const reloaded = Pilot.Deserialize(JSON.parse(JSON.stringify(saved)))

    expect(reloaded.InstanceID).toBe(saved.instanceId)
    expect(reloaded.IsInstance).toBe(true)
    expect(Pilot.Serialize(reloaded, true).instanceId).toBe(saved.instanceId)
  })

  it('keeps originId pointing at the source pilot after a reload', () => {
    const pilot = makePilot()
    const instance = Pilot.Deserialize(pilot.CreateInstance())
    const reloaded = Pilot.Deserialize(JSON.parse(JSON.stringify(Pilot.Serialize(instance, true))))

    expect(reloaded.OriginId).toBe(pilot.ID)
  })

  it('CreateInstance mints a fresh identity without stamping the source pilot', () => {
    const pilot = makePilot()
    expect(pilot.InstanceID).toBe('')

    const a = pilot.CreateInstance() as any
    const b = pilot.CreateInstance() as any

    expect(pilot.InstanceID).toBe('')
    expect(a.instanceId).not.toBe(b.instanceId)
    expect(a.originId).toBe(pilot.ID)
    expect(b.originId).toBe(pilot.ID)
  })
})

describe('used actions across a save/load cycle', () => {
  it('still reports a spent weapon as used after reloading the pilot', () => {
    const pilot = makePilot()
    makeMech(pilot)
    const weapon = equipFirstWeapon(pilot)
    const mech = pilot.Mechs[0]

    mech.CombatController.MarkActionUsed(weapon.InstanceID)
    expect(mech.CombatController.IsActionUsed(weapon.InstanceID)).toBe(true)

    const reloaded = Pilot.Deserialize(JSON.parse(JSON.stringify(Pilot.Serialize(pilot))))
    const reloadedMech = reloaded.Mechs[0]
    const reloadedWeapon = reloadedMech.MechLoadoutController.ActiveLoadout.Weapons.find(
      w => w.ID === weapon.ID
    )!

    expect(reloadedWeapon.InstanceID).toBe(weapon.InstanceID)
    expect(reloadedMech.CombatController.IsActionUsed(reloadedWeapon.InstanceID)).toBe(true)
  })
})
