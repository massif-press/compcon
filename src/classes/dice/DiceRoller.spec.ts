import { describe, it, expect, afterEach, vi } from 'vitest'
import { DiceRoller, DieSet } from './DiceRoller'

const rollsOf = (...values: number[]) => {
  let i = 0
  vi.spyOn(DiceRoller, 'rollDie').mockImplementation(() => values[Math.min(i++, values.length - 1)])
}

const alwaysRolls = (face: number) => {
  vi.spyOn(DiceRoller, 'rollDie').mockReturnValue(face)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('DiceRoller.parseDiceString', () => {
  it('parses a bare modifier', () => {
    const p = DiceRoller.parseDiceString('+3')
    expect(p.modifier).toBe(3)
    expect(p.dice[0].quantity).toBe(0)
  })

  it('parses a simple die string', () => {
    const p = DiceRoller.parseDiceString('2d6')
    expect(p.dice[0].quantity).toBe(2)
    expect(p.dice[0].type).toBe(6)
    expect(p.modifier).toBe(0)
  })

  it('parses a die string with a modifier', () => {
    const p = DiceRoller.parseDiceString('1d20+4')
    expect(p.dice[0].quantity).toBe(1)
    expect(p.dice[0].type).toBe(20)
    expect(p.modifier).toBe(4)
  })

  it('parses a negative modifier', () => {
    expect(DiceRoller.parseDiceString('1d6-2').modifier).toBe(-2)
  })

  it('ignores whitespace', () => {
    expect(DiceRoller.parseDiceString(' 1d6 + 2 ').modifier).toBe(2)
  })

  it('is undefined for an unparseable string', () => {
    expect(DiceRoller.parseDiceString('not dice')).toBeUndefined()
    expect(DiceRoller.parseDiceString('1d6+2d8')).toBeUndefined()
  })
})

describe('DiceRoller.rollDie', () => {
  it('is 0 for a non-positive die type', () => {
    expect(DiceRoller.rollDie(0)).toBe(0)
    expect(DiceRoller.rollDie(-6)).toBe(0)
  })

  it('maps the random range onto 1..type', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(DiceRoller.rollDie(6)).toBe(1)
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    expect(DiceRoller.rollDie(6)).toBe(6)
    expect(DiceRoller.rollDie(20)).toBe(20)
  })
})

describe('DiceRoller.rollDieSet', () => {
  it('is empty for a zero-quantity or zero-type set', () => {
    expect(DiceRoller.rollDieSet(new DieSet(0, 6))).toEqual({ result: 0, rolls: [], rerolls: 0 })
    expect(DiceRoller.rollDieSet(new DieSet(2, 0))).toEqual({ result: 0, rolls: [], rerolls: 0 })
  })

  it('sums the rolls', () => {
    alwaysRolls(4)
    const r = DiceRoller.rollDieSet(new DieSet(3, 6))
    expect(r.rolls).toEqual([4, 4, 4])
    expect(r.result).toBe(12)
    expect(r.rerolls).toBe(0)
  })

  it('doubles the dice on a critical', () => {
    alwaysRolls(2)
    expect(DiceRoller.rollDieSet(new DieSet(2, 6), false, true).rolls).toHaveLength(4)
  })

  it('rerolls ones for overkill and counts them', () => {
    rollsOf(1, 1, 5)
    const r = DiceRoller.rollDieSet(new DieSet(1, 20), true)
    expect(r.rerolls).toBe(2)
    expect(r.rolls).toEqual([5])
    expect(r.result).toBe(5)
  })
})

describe('DiceRoller.rollAccuracyDice', () => {
  it('is 0 for no dice', () => {
    expect(DiceRoller.rollAccuracyDice(0)).toEqual({ result: 0, rolls: [] })
  })

  it('takes the highest of the accuracy dice', () => {
    rollsOf(2, 5, 3)
    const r = DiceRoller.rollAccuracyDice(3)
    expect(r.rolls).toEqual([2, 5, 3])
    expect(r.result).toBe(5)
  })

  it('negates the result for difficulty', () => {
    rollsOf(2, 5)
    expect(DiceRoller.rollAccuracyDice(-2).result).toBe(-5)
  })
})

describe('DiceRoller.roll', () => {
  it('adds the modifier to the dice total', () => {
    alwaysRolls(3)
    expect(DiceRoller.roll('2d6+1')).toBe(7)
  })

  it('is 0 for an unparseable string', () => {
    expect(DiceRoller.roll('garbage')).toBe(0)
  })
})

describe('DiceRoller.rollDamage', () => {
  it('flags a parse error and echoes the string back', () => {
    const r = DiceRoller.rollDamage('garbage')
    expect(r.parseError).toBe(true)
    expect(r.diceString).toBe('garbage')
    expect(r.total).toBe(0)
  })

  it('totals dice plus static bonus', () => {
    alwaysRolls(3)
    const r = DiceRoller.rollDamage('2d6+2')
    expect(r.rawDieRolls).toEqual([3, 3])
    expect(r.staticBonus).toBe(2)
    expect(r.total).toBe(8)
  })

  it('raises the total to the reliable floor', () => {
    alwaysRolls(1)
    expect(DiceRoller.rollDamage('1d6', false, false, 4).total).toBe(4)
  })

  it('leaves a total above the reliable floor alone', () => {
    alwaysRolls(6)
    expect(DiceRoller.rollDamage('1d6', false, false, 4).total).toBe(6)
  })

  it('counts overkill rerolls', () => {
    rollsOf(1, 4)
    const r = DiceRoller.rollDamage('1d6', false, true)
    expect(r.overkillRerolls).toBe(1)
    expect(r.total).toBe(4)
  })
})

describe('DiceRoller.classifyDamageRolls', () => {
  it('is empty for an empty roll', () => {
    expect(DiceRoller.classifyDamageRolls(new DieSet(0, 6), [])).toEqual([])
    expect(DiceRoller.classifyDamageRolls(new DieSet(2, 6), [])).toEqual([])
  })

  it('marks the best rolls high and the rest low', () => {
    expect(DiceRoller.classifyDamageRolls(new DieSet(2, 6), [1, 6, 3, 2])).toEqual([
      'low',
      'high',
      'high',
      'low',
    ])
  })

  it('marks rerolled ones as overkill', () => {
    expect(DiceRoller.classifyDamageRolls(new DieSet(1, 6), [1, 5], true)).toEqual([
      'overkill',
      'high',
    ])
  })
})

describe('DiceRoller.rollSkillCheck', () => {
  it('adds the static bonus and the accuracy result', () => {
    rollsOf(10, 4)
    const r = DiceRoller.rollSkillCheck(2, 1)

    expect(r.rawDieRoll).toBe(10)
    expect(r.staticBonus).toBe(2)
    expect(r.accuracyDiceCount).toBe(1)
    expect(r.accuracyResult).toBe(4)
    expect(r.total).toBe(16)
  })

  it('nets accuracy against difficulty', () => {
    rollsOf(10, 3, 3)
    expect(DiceRoller.rollSkillCheck(0, 2, 2).accuracyDiceCount).toBe(0)
  })
})
