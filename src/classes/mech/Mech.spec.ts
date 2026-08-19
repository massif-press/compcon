import { describe, it, expect, beforeEach } from 'vitest'
import { Mech } from './Mech'
import { Pilot } from '@/classes/pilot/Pilot'
import { CompendiumStore } from '@/features/compendium/store'
import { makePilot, makeMech, frame } from '@/__tests__/factories'
import type { MechWeapon } from './components/equipment/MechWeapon'

let pilot: Pilot
let mech: Mech

const equipFirstWeapon = (m: Mech): MechWeapon => {
  const mount = m.MechLoadoutController.ActiveLoadout.EquippableMounts.find(x => x.Slots.length)!
  const weapon = CompendiumStore().instantiate(
    'MechWeapons',
    CompendiumStore().MechWeapons.find(w => !w.IsHidden)!.ID
  ) as MechWeapon
  mount.Slots[0].EquipWeapon(weapon, false)
  return weapon
}

beforeEach(() => {
  pilot = makePilot({ level: 3 })
  mech = makeMech(pilot)
})

describe('Mech construction', () => {
  it('links the frame and the pilot', () => {
    expect(mech.Frame.ID).toBe(frame().ID)
    expect(mech.Pilot).toBe(pilot)
    expect(mech.ID).toBeTruthy()
  })

  it('starts with an active loadout', () => {
    expect(mech.MechLoadoutController.ActiveLoadout).toBeTruthy()
  })

  it('derives its stats from the frame', () => {
    expect(mech.MaxHP).toBeGreaterThan(0)
    expect(mech.Size).toBeGreaterThan(0)
  })
})

describe('Mech.RenewID', () => {
  it('replaces the id', () => {
    const before = mech.ID
    mech.RenewID()
    expect(mech.ID).not.toBe(before)
  })
})

describe('Mech.Serialize/Deserialize', () => {
  it('round-trips a bare mech', () => {
    mech.Notes = 'runs hot'

    const back = Mech.Deserialize(JSON.parse(JSON.stringify(Mech.Serialize(mech))), pilot)

    expect(back.ID).toBe(mech.ID)
    expect(back.Name).toBe('Test Mech')
    expect(back.Notes).toBe('runs hot')
    expect(back.Frame.ID).toBe(mech.Frame.ID)
  })

  it('is idempotent once loaded', () => {
    const once = Mech.Serialize(
      Mech.Deserialize(JSON.parse(JSON.stringify(Mech.Serialize(mech))), pilot)
    )
    const twice = Mech.Serialize(Mech.Deserialize(JSON.parse(JSON.stringify(once)), pilot))

    expect(twice).toEqual(once)
  })

  it('keeps an equipped weapon and its instance id', () => {
    const weapon = equipFirstWeapon(mech)

    const back = Mech.Deserialize(JSON.parse(JSON.stringify(Mech.Serialize(mech))), pilot)
    const restored = back.MechLoadoutController.ActiveLoadout.Weapons.find(w => w.ID === weapon.ID)!

    expect(restored).toBeTruthy()
    expect(restored.InstanceID).toBe(weapon.InstanceID)
  })

  it('carries the frame data so an uninstalled LCP frame still loads', () => {
    const data = Mech.Serialize(mech) as any
    expect(data.frame).toBe(mech.Frame.ID)
    expect(data.frameData).toBeTruthy()

    data.frame = 'mf_not_installed'
    const back = Mech.Deserialize(data, pilot)

    expect(back.Frame.FromInstance).toBe(true)
    expect(back.Frame.ID).toBe(mech.Frame.ID)
  })
})

describe('Mech.Clone', () => {
  it('copies under a new id and a marked name', () => {
    const clone = mech.Clone() as Mech

    expect(clone.ID).not.toBe(mech.ID)
    expect(clone.Name).toBe('Test Mech (COPY)')
    expect(clone.Frame.ID).toBe(mech.Frame.ID)
  })
})
