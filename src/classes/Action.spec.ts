import fc from 'fast-check'
import { describe, it, expect } from 'vitest'
import { Action, ActivePeriod, type IActionData } from './Action'
import { regainsOn } from './Frequency'
import { ActivationType } from './enums'
import { assertDataRoundTrip } from '@/__tests__/roundtrip'

const actionDataArb: fc.Arbitrary<IActionData> = fc.record(
  {
    id: fc.string({ minLength: 1, maxLength: 10 }),
    name: fc.string({ minLength: 1, maxLength: 20 }),
    activation: fc.constantFrom(...Object.values(ActivationType)),
    detail: fc.string({ maxLength: 40 }),
    terse: fc.string({ maxLength: 20 }),
    cost: fc.integer({ min: 0, max: 3 }),
    frequency: fc.constantFrom('', '1/round', '2/scene', '3/mission', 'unlimited'),
    init: fc.string({ maxLength: 10 }),
    trigger: fc.string({ maxLength: 20 }),
    pilot: fc.boolean(),
    mech: fc.boolean(),
    hide_active: fc.boolean(),
    ignore_used: fc.boolean(),
    heat_cost: fc.integer({ min: 0, max: 4 }),
    synergy_locations: fc.array(fc.constantFrom('weapon', 'system', 'move'), { maxLength: 2 }),
    attack: fc.constantFrom<'melee' | 'ranged' | 'tech'>('melee', 'ranged', 'tech'),
  },
  { requiredKeys: ['name', 'activation', 'detail'] }
)

describe('Action.Serialize/Action.Deserialize', () => {
  it('round-trips any action', () => {
    assertDataRoundTrip(actionDataArb, Action.Serialize, d => Action.Deserialize(d))
  })

  it('names an unnamed action after its origin', () => {
    const a = Action.Deserialize(
      { name: '', activation: ActivationType.Quick, detail: '' },
      'Nexus'
    )
    expect(a.Name).toBe('Activate Nexus')
  })
})

describe('Action.Frequency', () => {
  it.each([
    ['1/round', 1, ActivePeriod.Round],
    ['2/turn', 2, ActivePeriod.Turn],
    ['3/scene', 3, ActivePeriod.Scene],
    ['1/encounter', 1, ActivePeriod.Scene],
    ['1/mission', 1, ActivePeriod.Mission],
  ])('parses %s', (freq, uses, duration) => {
    const a = Action.Deserialize({
      name: 'x',
      activation: ActivationType.Quick,
      detail: '',
      frequency: freq,
    })
    expect(a.Frequency.Uses).toBe(uses)
    expect(a.Frequency.Duration).toBe(duration)
  })

  it('is unlimited when the use count is not a number', () => {
    const a = Action.Deserialize({
      name: 'x',
      activation: ActivationType.Quick,
      detail: '',
      frequency: 'x/round',
    })
    expect(a.Frequency.Unlimited).toBe(true)
    expect(a.Frequency.Duration).toBe(ActivePeriod.Unlimited)
  })

  it('is unlimited without a slash', () => {
    const a = Action.Deserialize({ name: 'x', activation: ActivationType.Quick, detail: '' })
    expect(a.Frequency.Unlimited).toBe(true)
    expect(a.Frequency.Duration).toBe(ActivePeriod.Unlimited)
  })

  it('regains uses only on an event at or above its duration', () => {
    const perRound = Action.Deserialize({
      name: 'x',
      activation: ActivationType.Quick,
      detail: '',
      frequency: '1/round',
    }).Frequency

    expect(regainsOn(perRound.Duration, ActivePeriod.Turn)).toBe(false)
    expect(regainsOn(perRound.Duration, ActivePeriod.Round)).toBe(true)
    expect(regainsOn(perRound.Duration, ActivePeriod.Mission)).toBe(true)
    expect(regainsOn(perRound.Duration, ActivePeriod.Unlimited)).toBe(false)
  })
})

describe('Action.normalizeData', () => {
  it('accepts a bare object where a list is expected', () => {
    const a = Action.Deserialize({
      name: 'x',
      activation: ActivationType.Quick,
      detail: '',
      synergy_locations: 'weapon' as unknown as string[],
    })
    expect(a.SynergyLocations).toEqual(['weapon'])
  })
})
