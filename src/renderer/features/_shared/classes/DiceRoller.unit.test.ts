import { 
  DiceRoller,
  SkillRollResult } from '@/class'
import 'jest'
import { mockRandom, resetMockRandom } from 'jest-mock-random'

afterEach(() => {
  resetMockRandom()
})

describe('rollSkillCheck', () => {
  it('sets optional args to zero if not passed', () => {
    mockRandom([.499])

    let result = DiceRoller.rollSkillCheck()
    expect(result).toBeInstanceOf(SkillRollResult)
    expect(result.total).toBe(10)
    expect(result.staticBonus).toBe(0)
    expect(result.total).toBe(10)
  })
})

describe('_rollAccuracyDice', () => {
  it('returns correct results for positive dice', () => {
    mockRandom([.399, .678, .555, .444, .999])
    
    expect(DiceRoller._rollAccuracyDice(5)).toEqual(
      expect.objectContaining({
        result: 6,
        rolls: [3, 5, 4, 3, 6]
      })
    )
  })

  it('returns correct results when dice roll identically', () => {
    mockRandom([.399])

    expect(DiceRoller._rollAccuracyDice(6)).toEqual(
      expect.objectContaining({
        result: 3,
        rolls: [3, 3, 3, 3, 3, 3]
      })
    )
  })

  it('returns correct results for negative dice', () => {
    mockRandom([.399, .678, .555, .444, .999])

    expect(DiceRoller._rollAccuracyDice(-5)).toEqual(
      expect.objectContaining({
        result: -6,
        rolls: [3, 5, 4, 3, 6]
      })
    )
  })

  it('returns 0 & [] for zero dice', () => {
    expect(DiceRoller._rollAccuracyDice(0)).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: []
      })
    )
  })
})

describe('_rollDieSet', () => {
  it('returns correctly for 1 die', () => {
    mockRandom([.4])
    expect(DiceRoller._rollDieSet(1, 10)).toEqual(
      expect.objectContaining({
        result: 5,
        rolls: [5]
      })
    )
  })

  it('returns correctly for multiple dice', () => {
    mockRandom([.399, .678, .555])
    expect(DiceRoller._rollDieSet(3, 10)).toEqual(
      expect.objectContaining({
        result: 17,
        rolls: [4, 7, 6]
      })
    )
  })

  it('returns 0 & [] when rolling 0 dice', () => {
    expect(DiceRoller._rollDieSet(0, 10)).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: []
      })
    )
  })

  it('returns 0 & [] when rolling negative dice', () => {
    expect(DiceRoller._rollDieSet(-5, 10)).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: []
      })
    )
  })

  it('returns 0 & [] when rolling dice type 0', () => {
    expect(DiceRoller._rollDieSet(5, 0)).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: []
      })
    )
  })

  it('returns 0 & [] when rolling a negative dice type ', () => {
    expect(DiceRoller._rollDieSet(5, -5)).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: []
      })
    )
  })
})

describe('_rollDie', () => {
  it('outputs are correct', () => {
    mockRandom([0.0, 0.0999, 0.4500, 0.9999])

    expect(DiceRoller._rollDie(10)).toBe(1)
    expect(DiceRoller._rollDie(10)).toBe(1)
    expect(DiceRoller._rollDie(10)).toBe(5)
    expect(DiceRoller._rollDie(10)).toBe(10)
  })

  it('returns 0 for negative die type', () => {
    expect(DiceRoller._rollDie(-5)).toBe(0)
  })

  it('returns 0 for 0 die type', () => {
    expect(DiceRoller._rollDie(0)).toBe(0)
  })
})