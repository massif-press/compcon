import fc from 'fast-check'
import { describe, it, expect } from 'vitest'
import { Status, type IStatusData } from './Status'
import { assertDataRoundTrip } from '@/__tests__/roundtrip'

const statusDataArb: fc.Arbitrary<IStatusData> = fc.record(
  {
    id: fc.string({ minLength: 1, maxLength: 12 }),
    name: fc.string({ minLength: 1, maxLength: 20 }),
    type: fc.constantFrom('Status', 'Condition'),
    icon: fc.constantFrom('impaired', 'jammed', 'slowed', ''),
    effects: fc.array(fc.string({ maxLength: 30 }), { maxLength: 3 }),
    terse: fc.string({ maxLength: 20 }),
    svg: fc.constantFrom('', '<svg />'),
  },
  { requiredKeys: ['name', 'type', 'icon', 'effects'] }
)

describe('Status.Serialize/Status.Deserialize', () => {
  it('round-trips any status', () => {
    assertDataRoundTrip(statusDataArb, Status.Serialize, Status.Deserialize)
  })

  it('derives an ID from the pack name when one is not supplied', () => {
    const s = Status.Deserialize({
      name: 'Danger Zone',
      type: 'Status',
      icon: 'danger',
      effects: [],
    })
    expect(s.ID).toBe('Lancer_Core_Book_Danger_Zone')
  })

  it('joins effects into terse when terse is absent', () => {
    const s = Status.Deserialize({
      name: 'Impaired',
      type: 'Status',
      icon: 'impaired',
      effects: ['a', 'b'],
    })
    expect(s.Terse).toBe('a, b')
  })
})

describe('Status.Icon', () => {
  it('composes the cc icon from type and icon name', () => {
    const s = Status.Deserialize({
      name: 'Jammed',
      type: 'Condition',
      icon: 'jammed-out',
      effects: [],
    })
    expect(s.Icon).toBe('cc:condition_jammedout')
  })

  it('falls back to cc:talent with no icon', () => {
    expect(Status.Deserialize({ name: 'X', type: 'Status', icon: '', effects: [] }).Icon).toBe(
      'cc:talent'
    )
  })
})
