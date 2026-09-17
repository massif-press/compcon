import { describe, it, expect } from 'vitest'
import { DamageCalculationFlow, DamageApplicationFlow, HeatFlow } from './DamageFlow'

describe('the damage flows', () => {
  it('calculates in the documented order', () => {
    expect(DamageCalculationFlow.Steps).toEqual([
      'immunity',
      'exposed',
      'shredded',
      'irreducible',
      'armor',
      'resistance',
    ])
  })

  it('applies in the documented order', () => {
    expect(DamageApplicationFlow.Steps).toEqual([
      'heat-redirect',
      'burn-accumulation',
      'overshield',
      'hit-points',
      'structure-cascade',
    ])
  })

  it('takes heat in the documented order', () => {
    expect(HeatFlow.Steps).toEqual([
      'grunt-external-heat',
      'heat-accumulation',
      'heat-cap',
      'stress-cascade',
      'meltdown-watch',
    ])
  })

  it('stops the calculation at immunity, before anything can double or reduce it', () => {
    const target = {
      Resistances: [{ type: 'energy', condition: 'immunity' }],
      StatController: { getCurrent: () => 4 },
    }
    const cc = { HasStatus: () => true }
    const r = DamageCalculationFlow.Begin({
      cc,
      target,
      type: 'Energy',
      value: 10,
      ap: false,
      irreducible: false,
      armorReduction: 0,
      out: { total: 10, resist: [], condition: [], tookDamage: true },
    } as any)

    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('immunity')
    expect(r.state.out).toEqual({
      total: 0,
      resist: ['immunity'],
      condition: [],
      tookDamage: false,
    })
  })

  it('stops an irreducible calculation after the doubling conditions and before armor', () => {
    const target = {
      Resistances: [{ type: 'kinetic', condition: 'resistance' }],
      StatController: { getCurrent: () => 4 },
    }
    const cc = { HasStatus: (id: string) => id === 'exposed' }
    const r = DamageCalculationFlow.Begin({
      cc,
      target,
      type: 'Kinetic',
      value: 10,
      ap: false,
      irreducible: true,
      armorReduction: 0,
      out: { total: 10, resist: [], condition: [], tookDamage: true },
    } as any)

    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('irreducible')
    expect(r.completed).toEqual(['immunity', 'exposed', 'shredded'])
    expect(r.state.out.total).toBe(20)
    expect(r.state.out.resist).toEqual([])
  })
})
