import fc from 'fast-check'
import { describe, it, expect } from 'vitest'
import { Synergy, type ISynergyData } from './Synergy'
import { assertDataRoundTrip } from '@/__tests__/roundtrip'

const synergyDataArb: fc.Arbitrary<ISynergyData> = fc.record(
  {
    locations: fc.array(fc.constantFrom('weapon', 'system', 'move', 'active_effects'), {
      maxLength: 3,
    }),
    detail: fc.string({ maxLength: 40 }),
    weapon_types: fc.array(fc.constantFrom('Rifle', 'Melee', 'CQB'), { maxLength: 2 }),
    system_types: fc.array(fc.constantFrom('Drone', 'Shield'), { maxLength: 2 }),
    weapon_sizes: fc.array(fc.constantFrom('Main', 'Heavy'), { maxLength: 2 }),
  },
  { requiredKeys: ['locations', 'detail'] }
)

const de = (d: ISynergyData) => new Synergy(d, 'test')

describe('Synergy.Serialize/new Synergy', () => {
  it('round-trips any synergy', () => {
    assertDataRoundTrip(synergyDataArb, Synergy.Serialize, de)
  })

  it('defaults the type filters to any', () => {
    const s = de({ locations: ['weapon'], detail: 'x' })
    expect(s.WeaponTypes).toEqual(['any'])
    expect(s.WeaponSizes).toEqual(['any'])
    expect(s.SystemTypes).toEqual(['any'])
  })

  it('labels a missing origin', () => {
    expect(new Synergy({ locations: [], detail: '' }, '').Origin).toBe('UNKNOWN ORIGIN')
  })
})
