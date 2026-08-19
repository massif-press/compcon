import fc from 'fast-check'
import { describe, it, expect } from 'vitest'
import { Range, type IRangeData } from './Range'
import { RangeType } from './enums'
import { assertDataRoundTrip } from '@/__tests__/roundtrip'
import { makeRange } from '@/__tests__/factories'

const rangeDataArb: fc.Arbitrary<IRangeData> = fc.record({
  type: fc.constantFrom(...Object.values(RangeType)),
  val: fc.oneof(fc.integer({ min: 0, max: 20 }), fc.constantFrom('1d6', '', '{grit}')),
  override: fc.boolean(),
  bonus: fc.integer({ min: 0, max: 5 }),
})

describe('Range.Serialize/Range.Deserialize', () => {
  it('round-trips any range', () => {
    assertDataRoundTrip(rangeDataArb, Range.Serialize, Range.Deserialize)
  })

  it('drops min, which Serialize does not write', () => {
    const data = Range.Serialize(Range.Deserialize({ type: RangeType.Blast, val: 2, min: 1 }))
    expect(data).not.toHaveProperty('min')
    expect(Range.Deserialize(data).Min).toBe(0)
  })
})

describe('Range.Max', () => {
  it('adds the bonus to a numeric value', () => {
    expect(makeRange({ val: 5, bonus: 2 }).Max).toBe(7)
  })

  it('is 0 when the value is not numeric', () => {
    expect(makeRange({ val: 'special' }).Max).toBe(0)
  })
})

describe('Range.Text', () => {
  it('renders the bonus in parentheses', () => {
    expect(makeRange({ type: RangeType.Threat, val: 3, bonus: 1 }).Text).toBe('Threat 4 (+1)')
  })
})
