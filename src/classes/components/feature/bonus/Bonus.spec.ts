import fc from 'fast-check'
import { describe, it, expect } from 'vitest'
import { Bonus, type IBonusData } from './Bonus'
import { DamageType, RangeType, WeaponSize, WeaponType } from '@/classes/enums'
import { assertDataRoundTrip } from '@/__tests__/roundtrip'

const bonusDataArb: fc.Arbitrary<IBonusData> = fc.record(
  {
    id: fc.constantFrom('range', 'damage', 'hp', 'skill_point', 'not_a_real_bonus'),
    val: fc.oneof(
      fc.integer({ min: -3, max: 5 }),
      fc.constantFrom('1', '{ll}', '1/2/3'),
      fc.boolean(),
      fc.array(fc.constantFrom('1', '2', '3'), { maxLength: 3 })
    ),
    damage_types: fc.array(fc.constantFrom(...Object.values(DamageType)), { maxLength: 2 }),
    range_types: fc.array(fc.constantFrom(...Object.values(RangeType)), { maxLength: 2 }),
    weapon_types: fc.array(fc.constantFrom(...Object.values(WeaponType)), { maxLength: 2 }),
    weapon_sizes: fc.array(fc.constantFrom(...Object.values(WeaponSize)), { maxLength: 2 }),
    overwrite: fc.boolean(),
    replace: fc.boolean(),
    condition: fc.string({ maxLength: 20 }),
  },
  { requiredKeys: ['id', 'val'] }
)

const de = (d: IBonusData) => new Bonus(d, 'test')

describe('Bonus.Serialize/new Bonus', () => {
  it('round-trips any bonus', () => {
    assertDataRoundTrip(bonusDataArb, Bonus.Serialize, de)
  })

  it('drops accuracy, which Serialize does not write', () => {
    const data = Bonus.Serialize(de({ id: 'range', val: 1, accuracy: 2 }))
    expect(data).not.toHaveProperty('accuracy')
    expect(de(data).Accuracy).toBe(0)
  })

  it('omits condition when there is none', () => {
    expect(Bonus.Serialize(de({ id: 'range', val: 1 }))).not.toHaveProperty('condition')
  })
})

describe('Bonus constructor', () => {
  it('treats val true as a flag', () => {
    expect(de({ id: 'range', val: true }).IsFlag).toBe(true)
  })

  it('treats an explicit flag type as a flag', () => {
    expect(de({ id: 'range', val: 1, type: 'flag' }).IsFlag).toBe(true)
  })

  it('marks a _pct bonus as per-pc', () => {
    expect(de({ id: 'hp_pct', val: 1 }).PerPc).toBe(true)
    expect(de({ id: 'hp', val: 1 }).PerPc).toBe(false)
  })

  it('labels an unknown id rather than throwing', () => {
    expect(de({ id: 'not_a_real_bonus', val: 1 }).Title).toBe('UNKNOWN BONUS')
  })
})

describe('Bonus.Symbol', () => {
  it.each([
    [1, '+'],
    [-1, '-'],
    [0, '+'],
  ])('is %s for value %i', (val, symbol) => {
    expect(de({ id: 'range', val }).Symbol).toBe(symbol)
  })

  it('is = when the bonus overwrites', () => {
    expect(de({ id: 'range', val: 1, overwrite: true }).Symbol).toBe('=')
  })

  it('is empty for a non-numeric value', () => {
    expect(de({ id: 'range', val: '{ll}' }).Symbol).toBe('')
  })
})

describe('Bonus.SumStatic', () => {
  it('sums numeric values and appends the computed ones', () => {
    const sum = Bonus.SumStatic(
      {
        bonuses: [
          { id: 'hp', val: 2 },
          { id: 'hp', val: 3 },
          { id: 'hp', val: '{ll}' },
          { id: 'range', val: 9 },
        ],
      } as never,
      'hp'
    )
    expect(sum).toBe('5 ({ll})')
  })

  it('is 0 with no matching bonuses', () => {
    expect(Bonus.SumStatic({ bonuses: [] } as never, 'hp')).toBe('0')
  })
})
