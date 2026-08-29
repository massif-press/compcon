import { describe, it, expect } from 'vitest'
import { MechSystem } from './MechSystem'
import { MechWeapon } from './MechWeapon'
import { CompendiumStore } from '@/features/compendium/store'

const aSystem = () => CompendiumStore().MechSystems.find(s => !s.IsHidden)!
const aWeapon = () => CompendiumStore().MechWeapons.find(w => !w.IsHidden)!

describe('MechSystem.Serialize/Deserialize', () => {
  it('keeps the instance id across a round-trip', () => {
    const item = MechSystem.Deserialize(MechSystem.Serialize(aSystem()))
    const back = MechSystem.Deserialize(MechSystem.Serialize(item))

    expect(back.InstanceID).toBe(item.InstanceID)
  })

  it('gives two copies of the same system distinct instance ids', () => {
    const data = MechSystem.Serialize(aSystem())
    const a = MechSystem.Deserialize(data)
    const b = MechSystem.Deserialize({ ...data, instanceId: undefined })

    expect(a.InstanceID).not.toBe(b.InstanceID)
  })

  it('keeps combat state across a round-trip', () => {
    const item = MechSystem.Deserialize(MechSystem.Serialize(aSystem()))
    item.Used = true
    item.Destroyed = true
    item.Uses = 2

    const back = MechSystem.Deserialize(MechSystem.Serialize(item))

    expect(back.Used).toBe(true)
    expect(back.Destroyed).toBe(true)
    expect(back.Uses).toBe(2)
  })
})

describe('MechWeapon.Serialize/Deserialize', () => {
  it('keeps the instance id across a round-trip', () => {
    const item = MechWeapon.Deserialize(MechWeapon.Serialize(aWeapon()))
    const back = MechWeapon.Deserialize(MechWeapon.Serialize(item))

    expect(back.InstanceID).toBe(item.InstanceID)
  })

  it('survives a save/load cycle with the used flag intact', () => {
    const item = MechWeapon.Deserialize(MechWeapon.Serialize(aWeapon()))
    item.Used = true

    const back = MechWeapon.Deserialize(JSON.parse(JSON.stringify(MechWeapon.Serialize(item))))

    expect(back.InstanceID).toBe(item.InstanceID)
    expect(back.Used).toBe(true)
  })
})
