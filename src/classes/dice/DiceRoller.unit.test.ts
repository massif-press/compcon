import { DiceRoller, D20RollResult, DamageRollResult, ParsedDieString, DieSet } from '@/class'
import 'jest'
import { mockRandom, resetMockRandom } from 'jest-mock-random'

afterEach(() => {
  resetMockRandom()
})

describe('rollSkillCheck', () => {
  it('rolls a basic check correctly', () => {
    mockRandom([0.499])

    let result = DiceRoller.rollSkillCheck()
    expect(result).toBeInstanceOf(D20RollResult)
    expect(result.rawDieRoll).toBe(10)
    expect(result.staticBonus).toBe(0)
    expect(result.accuracyDiceCount).toBe(0)
    expect(result.accuracyResult).toBe(0)
    expect(result.rawAccuracyRolls).toHaveLength(0)
    expect(result.total).toBe(10)
  })

  it('rolls a complicated skill check correctly', () => {
    mockRandom([0.499, 0.001, 0.55])

    let result = DiceRoller.rollSkillCheck(5, 5, 3)
    expect(result).toBeInstanceOf(D20RollResult)
    expect(result.rawDieRoll).toBe(10)
    expect(result.staticBonus).toBe(5)
    expect(result.accuracyDiceCount).toBe(2)
    expect(result.accuracyResult).toBe(4)
    expect(result.rawAccuracyRolls).toHaveLength(2)
    expect(result.rawAccuracyRolls[0]).toBe(1)
    expect(result.rawAccuracyRolls[1]).toBe(4)
    expect(result.total).toBe(19)
  })

  it('handles negative accuracy correctly', () => {
    mockRandom([0.499, 0.001, 0.55])

    let result = DiceRoller.rollSkillCheck(0, 3, 5)
    expect(result).toBeInstanceOf(D20RollResult)
    expect(result.accuracyDiceCount).toBe(-2)
    expect(result.accuracyResult).toBe(-4)
    expect(result.rawAccuracyRolls).toHaveLength(2)
    expect(result.rawAccuracyRolls[0]).toBe(1)
    expect(result.rawAccuracyRolls[1]).toBe(4)
    expect(result.total).toBe(6)
  })
})

describe('rollToHit', () => {
  it('rolls a basic hit roll correctly', () => {
    mockRandom([0.499])

    let result = DiceRoller.rollToHit()
    expect(result).toBeInstanceOf(D20RollResult)
    expect(result.rawDieRoll).toBe(10)
    expect(result.staticBonus).toBe(0)
    expect(result.accuracyDiceCount).toBe(0)
    expect(result.accuracyResult).toBe(0)
    expect(result.rawAccuracyRolls).toHaveLength(0)
    expect(result.total).toBe(10)
  })

  it('rolls a complicated hit roll correctly', () => {
    mockRandom([0.499, 0.001, 0.55])

    let result = DiceRoller.rollSkillCheck(5, 5, 3)
    expect(result).toBeInstanceOf(D20RollResult)
    expect(result.rawDieRoll).toBe(10)
    expect(result.staticBonus).toBe(5)
    expect(result.accuracyDiceCount).toBe(2)
    expect(result.accuracyResult).toBe(4)
    expect(result.rawAccuracyRolls).toHaveLength(2)
    expect(result.rawAccuracyRolls[0]).toBe(1)
    expect(result.rawAccuracyRolls[1]).toBe(4)
    expect(result.total).toBe(19)
  })

  it('handles negative accuracy correctly', () => {
    mockRandom([0.499, 0.001, 0.55])

    let result = DiceRoller.rollSkillCheck(0, 3, 5)
    expect(result).toBeInstanceOf(D20RollResult)
    expect(result.accuracyDiceCount).toBe(-2)
    expect(result.accuracyResult).toBe(-4)
    expect(result.rawAccuracyRolls).toHaveLength(2)
    expect(result.rawAccuracyRolls[0]).toBe(1)
    expect(result.rawAccuracyRolls[1]).toBe(4)
    expect(result.total).toBe(6)
  })
})

describe('rollDamage', () => {
  it('rolls static 123 correctly', () => {
    mockRandom([0.4])

    let result = DiceRoller.rollDamage('123')
    expect(result).toBeInstanceOf(DamageRollResult)
    expect(result.diceString).toEqual('123')
    expect(result.parseError).toBeFalsy()
    expect(result.rawDieRolls).toEqual([])
    expect(result.staticBonus).toBe(123)
    expect(result.total).toEqual(123)
  })

  it('rolls static 000123 correctly', () => {
    mockRandom([0.4])

    let result = DiceRoller.rollDamage('000123')
    expect(result).toBeInstanceOf(DamageRollResult)
    expect(result.diceString).toEqual('000123')
    expect(result.parseError).toBeFalsy()
    expect(result.rawDieRolls).toEqual([])
    expect(result.staticBonus).toBe(123)
    expect(result.total).toEqual(123)
  })

  it('rolls 1d6 correctly', () => {
    mockRandom([0.4])

    let result = DiceRoller.rollDamage('1d6')
    expect(result).toBeInstanceOf(DamageRollResult)
    expect(result.diceString).toEqual('1d6')
    expect(result.parseError).toBeFalsy()
    expect(result.rawDieRolls).toEqual([3])
    expect(result.staticBonus).toBe(0)
    expect(result.total).toEqual(3)
  })

  it('rolls 1d6+10 correctly', () => {
    mockRandom([0.4])

    let result = DiceRoller.rollDamage('1d6+10')
    expect(result).toBeInstanceOf(DamageRollResult)
    expect(result.diceString).toEqual('1d6+10')
    expect(result.parseError).toBeFalsy()
    expect(result.rawDieRolls).toEqual([3])
    expect(result.staticBonus).toBe(10)
    expect(result.total).toEqual(13)
  })

  it('rolls 1d6-22 correctly', () => {
    mockRandom([0.4])

    let result = DiceRoller.rollDamage('1d6-22')
    expect(result).toBeInstanceOf(DamageRollResult)
    expect(result.diceString).toEqual('1d6-22')
    expect(result.parseError).toBeFalsy()
    expect(result.rawDieRolls).toEqual([3])
    expect(result.staticBonus).toBe(-22)
    expect(result.total).toEqual(-19)
  })

  it('rolls 1 d 6 - 22 correctly', () => {
    mockRandom([0.4])

    let result = DiceRoller.rollDamage('1 d 6 - 22')
    expect(result).toBeInstanceOf(DamageRollResult)
    expect(result.diceString).toEqual('1 d 6 - 22')
    expect(result.parseError).toBeFalsy()
    expect(result.rawDieRolls).toEqual([3])
    expect(result.staticBonus).toBe(-22)
    expect(result.total).toEqual(-19)
  })
})

describe('parseDiceString', () => {
  it.each`
    input          | arrayLength | dieType | dieQuantity | modifier
    ${'123'}       | ${1}        | ${0}    | ${0}        | ${123}
    ${'-1d6'}      | ${1}        | ${6}    | ${-1}       | ${0}
    ${'+1d6'}      | ${1}        | ${6}    | ${1}        | ${0}
    ${'1d6'}       | ${1}        | ${6}    | ${1}        | ${0}
    ${'1d3+9'}     | ${1}        | ${3}    | ${1}        | ${9}
    ${'1d3+22'}    | ${1}        | ${3}    | ${1}        | ${22}
    ${'1d3+10'}    | ${1}        | ${3}    | ${1}        | ${10}
    ${'1d3-22'}    | ${1}        | ${3}    | ${1}        | ${-22}
    ${'-1d3-22'}   | ${1}        | ${3}    | ${-1}       | ${-22}
    ${'1 d 6 + 5'} | ${1}        | ${6}    | ${1}        | ${5}
  `('parses $input correctly', ({ input, arrayLength, dieType, dieQuantity, modifier }) => {
  let result = DiceRoller.parseDiceString(input)
  expect(result).toBeInstanceOf(ParsedDieString)
  expect(result.dice).toHaveLength(arrayLength)
  expect(result.dice[0]).toBeInstanceOf(DieSet)
  expect(result.dice[0].type).toEqual(dieType)
  expect(result.dice[0].quantity).toEqual(dieQuantity)
  expect(result.modifier).toEqual(modifier)
})

  it('returns a parse error for a bad string', () => {
    let result = DiceRoller.parseDiceString('blahblah')

    expect(result).toBeUndefined()
  })
})

describe('rollAccuracyDice', () => {
  it('returns correct results for positive dice', () => {
    mockRandom([0.399, 0.678, 0.555, 0.444, 0.999])

    expect(DiceRoller.rollAccuracyDice(5)).toEqual(
      expect.objectContaining({
        result: 6,
        rolls: [3, 5, 4, 3, 6],
      })
    )
  })

  it('returns correct results when dice roll identically', () => {
    mockRandom([0.399])

    expect(DiceRoller.rollAccuracyDice(6)).toEqual(
      expect.objectContaining({
        result: 3,
        rolls: [3, 3, 3, 3, 3, 3],
      })
    )
  })

  it('returns correct results for negative dice', () => {
    mockRandom([0.399, 0.678, 0.555, 0.444, 0.999])

    expect(DiceRoller.rollAccuracyDice(-5)).toEqual(
      expect.objectContaining({
        result: -6,
        rolls: [3, 5, 4, 3, 6],
      })
    )
  })

  it('returns 0 & [] for zero dice', () => {
    expect(DiceRoller.rollAccuracyDice(0)).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: [],
      })
    )
  })
})

describe('rollDieSet', () => {
  it('returns correctly for 1 die', () => {
    mockRandom([0.4])
    expect(DiceRoller.rollDieSet(new DieSet(1, 10))).toEqual(
      expect.objectContaining({
        result: 5,
        rolls: [5],
      })
    )
  })

  it('returns correctly for multiple dice', () => {
    mockRandom([0.399, 0.678, 0.555])
    expect(DiceRoller.rollDieSet(new DieSet(3, 10))).toEqual(
      expect.objectContaining({
        result: 17,
        rolls: [4, 7, 6],
      })
    )
  })

  it('returns 0 & [] when rolling 0 dice', () => {
    expect(DiceRoller.rollDieSet(new DieSet(0, 10))).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: [],
      })
    )
  })

  it('returns 0 & [] when rolling negative dice', () => {
    expect(DiceRoller.rollDieSet(new DieSet(-5, 10))).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: [],
      })
    )
  })

  it('returns 0 & [] when rolling dice type 0', () => {
    expect(DiceRoller.rollDieSet(new DieSet(5, 0))).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: [],
      })
    )
  })

  it('returns 0 & [] when rolling a negative dice type ', () => {
    expect(DiceRoller.rollDieSet(new DieSet(5, -5))).toEqual(
      expect.objectContaining({
        result: 0,
        rolls: [],
      })
    )
  })
})

describe('rollDie', () => {
  it('outputs are correct', () => {
    mockRandom([0.0, 0.0999, 0.45, 0.9999])

    expect(DiceRoller.rollDie(10)).toBe(1)
    expect(DiceRoller.rollDie(10)).toBe(1)
    expect(DiceRoller.rollDie(10)).toBe(5)
    expect(DiceRoller.rollDie(10)).toBe(10)
  })

  it('returns 0 for negative die type', () => {
    expect(DiceRoller.rollDie(-5)).toBe(0)
  })

  it('returns 0 for 0 die type', () => {
    expect(DiceRoller.rollDie(0)).toBe(0)
  })
})
