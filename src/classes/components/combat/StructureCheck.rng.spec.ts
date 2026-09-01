import { describe, it, expect, afterEach, vi } from 'vitest'
import { DiceRoller, seedRng, resetRng } from '@/classes/dice/DiceRoller'
import { rollCheck, prerollEffects } from './StructureCheck'

afterEach(() => {
  vi.restoreAllMocks()
  resetRng()
})

const table = {
  Die: 6,
  Results: [
    { min: 1, max: 3, title: 'a' },
    { min: 4, max: 6, title: 'b' },
  ],
} as any

describe('StructureCheck RNG routing', () => {
  it('rollDie mock', () => {
    vi.spyOn(DiceRoller, 'rollDie').mockReturnValue(1)
    const r = rollCheck(table, 3)
    expect(r.dice).toEqual([1, 1, 1])
    expect(r.multipleOnes).toBe(true)
  })

  it('seed', () => {
    seedRng(42)
    const a = rollCheck(table, 4).dice
    seedRng(42)
    expect(rollCheck(table, 4).dice).toEqual(a)
  })

  it('mock in prerollEffects damage and sub_roll', () => {
    vi.spyOn(DiceRoller, 'rollDie').mockReturnValue(4)
    const out = prerollEffects([
      { type: 'damage', roll: '2d6' } as any,
      { type: 'sub_roll', die: 6, cases: [] } as any,
    ])
    expect(out['0']).toBe(8)
    expect(out['1']).toBe(4)
  })
})
