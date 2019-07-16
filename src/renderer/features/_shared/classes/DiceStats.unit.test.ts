import { DiceStats, DiceStatsResult } from './DiceStats'
import { DiceRoller, ParsedDieString } from './DiceRoller'

describe('DiceStats', () => {
  describe('calculateMax', () => {
    it.each`
      dice     | expected
      ${'1d6'} | ${6}
      ${'0d0'} | ${0}
    `('gets max as $expected for $dice', ({ dice, expected }) => {
      let parsed = DiceRoller.parseDiceString(dice)
      expect(DiceStats.calculateMax(parsed)).toBe(expected)
    })
  })

  describe('calculateMin', () => {
    it.each`
      dice      | expected
      ${'1d6'}  | ${1}
      ${'0d0'}  | ${0}
      ${'0d10'} | ${0}
    `('gets min as $expected for $dice', ({ dice, expected }) => {
      let parsed = DiceRoller.parseDiceString(dice)
      expect(DiceStats.calculateMin(parsed)).toBe(expected)
    })
  })

  describe('calculateMean', () => {
    it('gets mean for 1d6', () => {
      let parsed = DiceRoller.parseDiceString('1d6')
      expect(DiceStats.calculateMin(parsed)).toBe(1)
    })

    it('gets mean for 0d0', () => {
      let parsed = DiceRoller.parseDiceString('0d0')
      expect(DiceStats.calculateMin(parsed)).toBe(0)
    })

    it('gets mean for 0d10', () => {
      let parsed = DiceRoller.parseDiceString('0d10')
      expect(DiceStats.calculateMin(parsed)).toBe(0)
    })
  })
})
