import { describe, it, expect, beforeEach } from 'vitest'
import { makePilot } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import { ReservesController } from './ReservesController'
import { Reserve } from './Reserve'
import Organization from './Organization'
import { OrgType } from '@/classes/enums'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const reserves = () => pilot.ReservesController
const reserve = (i = 0) => new Reserve(Reserve.Serialize(CompendiumStore().Reserves[i]))
const org = (name = 'Test Org') =>
  new Organization({
    name,
    purpose: OrgType.Military,
    description: 'desc',
    efficiency: 1,
    influence: 1,
    actions: 'act',
  } as never)

beforeEach(() => {
  pilot = makePilot()
})

describe('ReservesController reserves', () => {
  it('starts empty', () => {
    expect(reserves().Reserves).toEqual([])
  })

  it('adds and removes by index', () => {
    reserves().AddReserve(reserve(0))
    reserves().AddReserve(reserve(1))
    expect(reserves().Reserves).toHaveLength(2)

    reserves().RemoveReserve(0)
    expect(reserves().Reserves).toHaveLength(1)
  })

  it('survives removing an index that is not there', () => {
    expect(() => reserves().RemoveReserve(4)).not.toThrow()
  })
})

describe('ReservesController organizations', () => {
  it('adds and removes by index', () => {
    reserves().AddOrganization(org('A'))
    reserves().AddOrganization(org('B'))

    reserves().RemoveOrganization(0)

    expect(reserves().Organizations.map(o => o.Name)).toEqual(['B'])
  })
})

describe('ReservesController.Serialize/Deserialize', () => {
  it('round-trips reserves and organizations', () => {
    reserves().AddReserve(reserve(0))
    reserves().AddOrganization(org('Test Org'))

    const target: any = {}
    ReservesController.Serialize(pilot, target)

    const other = makePilot()
    ReservesController.Deserialize(other, target)

    expect(other.ReservesController.Reserves).toHaveLength(1)
    expect(other.ReservesController.Reserves[0].ID).toBe(reserves().Reserves[0].ID)
    expect(other.ReservesController.Organizations.map(o => o.Name)).toEqual(['Test Org'])
  })

  it('loads a pilot that never had either', () => {
    const other = makePilot()
    ReservesController.Deserialize(other, {} as never)

    expect(other.ReservesController.Reserves).toEqual([])
    expect(other.ReservesController.Organizations).toEqual([])
  })
})

describe('Organization', () => {
  it('clones without sharing state', () => {
    const original = org('Test Org')
    const clone = Organization.Clone(original)

    clone.Name = 'Not Test Org'

    expect(original.Name).toBe('Test Org')
    expect(clone.Purpose).toBe(original.Purpose)
  })
})
