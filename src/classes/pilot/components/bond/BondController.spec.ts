import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot } from '@/__tests__/factories'
import { BondController } from './BondController'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const bond = () => pilot.BondController

beforeEach(() => {
  pilot = makePilot()
})

describe('BondController.XP', () => {
  it('clamps between 0 and 8', () => {
    bond().XP = 5
    expect(bond().XP).toBe(5)

    bond().XP = 99
    expect(bond().XP).toBe(8)

    bond().XP = -3
    expect(bond().XP).toBe(0)
  })
})

describe('BondController.Stress', () => {
  it('clamps between 0 and the maximum', () => {
    bond().MaxStress = 8

    bond().Stress = 4
    expect(bond().Stress).toBe(4)

    bond().Stress = 99
    expect(bond().Stress).toBe(8)

    bond().Stress = -1
    expect(bond().Stress).toBe(0)
  })

  it('reports being at maximum stress', () => {
    bond().MaxStress = 8
    bond().Stress = 8

    expect(bond().AtMaxStress).toBe(true)
  })

  it('never lets the maximum fall below current stress', () => {
    bond().MaxStress = 8
    bond().Stress = 6

    bond().MaxStress = 2

    expect(bond().MaxStress).toBe(6)
  })

  it('caps the maximum at 20', () => {
    bond().MaxStress = 99
    expect(bond().MaxStress).toBe(20)
  })
})

describe('BondController burdens', () => {
  it('grows the clock each time and resets stress', () => {
    bond().Stress = 5

    bond().AddNewBurden()
    expect(bond().Stress).toBe(0)
    expect(bond().Burdens[0].Segments).toBe(4)

    bond().AddNewBurden()
    expect(bond().Burdens[1].Segments).toBe(6)

    bond().AddNewBurden()
    expect(bond().Burdens[2].Segments).toBe(10)
    expect(bond().AtMaxBurdens).toBe(true)
  })
})

describe('BondController.Serialize/Deserialize', () => {
  it('round-trips the bond sheet', () => {
    bond().MaxStress = 10
    bond().XP = 6
    bond().Stress = 3
    bond().IsBroken = true
    bond().AddNewBurden()
    bond().AddClock()

    const target: any = {}
    BondController.Serialize(pilot, target)

    const other = makePilot()
    BondController.Deserialize(other, target.bond)

    expect(other.BondController.XP).toBe(6)
    expect(other.BondController.MaxStress).toBe(10)
    expect(other.BondController.IsBroken).toBe(true)
    expect(other.BondController.Burdens).toHaveLength(1)
  })

  it('loads a pilot that never had a bond', () => {
    const other = makePilot()
    expect(() => BondController.Deserialize(other, undefined as never)).not.toThrow()
    expect(other.BondController.Bond).toBeNull()
  })
})
