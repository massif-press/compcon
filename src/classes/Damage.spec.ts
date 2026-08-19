import fc from 'fast-check'
import { describe, it, expect } from 'vitest'
import { Damage, type IDamageData } from './Damage'
import { DamageType } from './enums'
import { assertDataRoundTrip } from '@/__tests__/roundtrip'

const damageDataArb: fc.Arbitrary<IDamageData> = fc.record(
  {
    type: fc.constantFrom(...Object.values(DamageType)),
    val: fc.oneof(fc.integer({ min: 0, max: 20 }), fc.constantFrom('1d6', '2d6+2', '')),
    bonus: fc.oneof(fc.integer({ min: 0, max: 5 }), fc.constantFrom('', '1d6', '{grit}')),
    override: fc.boolean(),
    ap: fc.boolean(),
    overkill: fc.boolean(),
    irreducible: fc.boolean(),
    reliable: fc.integer({ min: 0, max: 4 }),
    aoe: fc.oneof(fc.boolean(), fc.constantFrom('cone', 'blast 2')),
    save: fc.record({ stat: fc.constantFrom('hull', 'agi', 'sys', 'eng') }),
    save_half: fc.boolean(),
    attack: fc.constantFrom<'melee' | 'ranged' | 'tech'>('melee', 'ranged', 'tech'),
  },
  { requiredKeys: ['type', 'val'] }
)

describe('Damage.Serialize/Damage.Deserialize', () => {
  it('round-trips any damage', () => {
    assertDataRoundTrip(damageDataArb, Damage.Serialize, Damage.Deserialize)
  })

  it('does not re-apply the bonus on repeated round-trips', () => {
    const original = Damage.Deserialize({ type: DamageType.Kinetic, val: 3, bonus: 2 })
    expect(original.Value).toBe('5')

    let data = Damage.Serialize(original)
    for (let i = 0; i < 3; i++) data = Damage.Serialize(Damage.Deserialize(data))

    expect(Damage.Deserialize(data).Value).toBe('5')
  })

  it('serializes the unfolded value so the bonus is applied exactly once', () => {
    const data = Damage.Serialize(
      Damage.Deserialize({ type: DamageType.Energy, val: '1d6', bonus: 2 })
    )
    expect(data.val).toBe('1d6')
    expect(data.bonus).toBe(2)
  })

  it('keeps per-tier damage arrays intact across a round-trip', () => {
    const tiered = { type: DamageType.Kinetic, val: [1, 2, 3] as unknown as number }
    const back = Damage.Deserialize(Damage.Serialize(Damage.Deserialize(tiered)))

    expect(back.TieredDamage(1)).toBe('1')
    expect(back.TieredDamage(3)).toBe('3')
  })
})

describe('Damage constructor', () => {
  it('folds a numeric bonus into the value', () => {
    expect(Damage.Deserialize({ type: DamageType.Kinetic, val: 3, bonus: 2 }).Value).toBe('5')
  })

  it('keeps a dice bonus as an expression', () => {
    expect(Damage.Deserialize({ type: DamageType.Energy, val: '1d6', bonus: 2 }).Value).toBe(
      '1d6 + 2'
    )
  })

  it('falls back to Variable for an unknown damage type', () => {
    expect(Damage.Deserialize({ type: 'plasma' as DamageType, val: 1 }).Type).toBe(
      DamageType.Variable
    )
  })
})

describe('Damage.Max', () => {
  it('is qty * size + bonus for a dice expression', () => {
    expect(Damage.Deserialize({ type: DamageType.Kinetic, val: '2d6+1' }).Max).toBe(13)
  })
})

describe('Damage.getAoeIcon', () => {
  it.each([
    ['cone 3', 'cc:cone'],
    ['line 5', 'cc:line'],
    ['burst 2', 'cc:burst'],
    ['blast 1', 'cc:blast'],
    ['false', 'cc:range'],
    ['', 'cc:range'],
    ['something else', 'cc:sword_array'],
  ])('maps %s to %s', (input, expected) => {
    expect(Damage.getAoeIcon(input)).toBe(expected)
  })
})
