import 'jest'
import { DiceStats, DiceStatsResult } from './DiceStats'
import { DiceRoller } from './DiceRoller'

describe('DiceStats', () => {
  describe('getStats', () => {
    it.each`
      dice         | min    | max    | mean
      ${'1d6'}     | ${1}   | ${6}   | ${3.5}
      ${'1d6+0'}   | ${1}   | ${6}   | ${3.5}
      ${'1d6+5'}   | ${6}   | ${11}  | ${8.5}
      ${'1d6-10'}  | ${-9}  | ${-4}  | ${-6.5}
      ${'3d6'}     | ${3}   | ${18}  | ${10.5}
      ${'3d6+10'}  | ${13}  | ${28}  | ${20.5}
      ${'0d0'}     | ${0}   | ${0}   | ${0}
      ${'0d1'}     | ${0}   | ${0}   | ${0}
      ${'1d0'}     | ${0}   | ${0}   | ${0}
      ${'1d0'}     | ${0}   | ${0}   | ${0}
      ${'-1d6'}    | ${-6}  | ${-1}  | ${-3.5}
      ${'-3d6'}    | ${-18} | ${-3}  | ${-10.5}
      ${'-3d6+10'} | ${-8}  | ${7}   | ${-0.5}
      ${'-3d6-10'} | ${-28} | ${-13} | ${-20.5}
    `('calculates correctly for $dice', ({ dice, min, max, mean }) => {
  let result = DiceStats.getStats(dice)
  expect(result).toBeInstanceOf(DiceStatsResult)
  expect(result.min).toBe(min)
  expect(result.max).toBe(max)
  expect(result.mean).toBe(mean)
})

    it('errors out appropriately for garbage input', () => {
      let result = DiceStats.getStats('awdadawd')
      expect(result.min).toBe(0)
      expect(result.max).toBe(0)
      expect(result.mean).toBe(0)
      expect(result.error).toBe(true)
    })
  })

  describe('calculateMax', () => {
    it.each`
      dice         | expected
      ${'1d6'}     | ${6}
      ${'1d6+0'}   | ${6}
      ${'1d6+5'}   | ${11}
      ${'1d6-10'}  | ${-4}
      ${'3d6'}     | ${18}
      ${'0d0'}     | ${0}
      ${'0d1'}     | ${0}
      ${'1d0'}     | ${0}
      ${'-1d6'}    | ${-1}
      ${'-3d6'}    | ${-3}
      ${'-3d6+10'} | ${7}
      ${'-3d6-10'} | ${-13}
    `('gets max as $expected for $dice', ({ dice, expected }) => {
  let parsed = DiceRoller.parseDiceString(dice)
  expect(DiceStats.calculateMax(parsed)).toBe(expected)
})
  })

  describe('calculateMin', () => {
    it.each`
      dice         | expected
      ${'1d6'}     | ${1}
      ${'1d6+0'}   | ${1}
      ${'1d6+5'}   | ${6}
      ${'1d6-10'}  | ${-9}
      ${'3d6'}     | ${3}
      ${'0d0'}     | ${0}
      ${'0d1'}     | ${0}
      ${'1d0'}     | ${0}
      ${'0d10'}    | ${0}
      ${'-1d6'}    | ${-6}
      ${'-3d6'}    | ${-18}
      ${'-3d6+10'} | ${-8}
      ${'-3d6-10'} | ${-28}
    `('gets min as $expected for $dice', ({ dice, expected }) => {
  let parsed = DiceRoller.parseDiceString(dice)
  expect(DiceStats.calculateMin(parsed)).toBe(expected)
})
  })

  describe('calculateMean', () => {
    it.each`
      dice         | expected
      ${'1d6'}     | ${3.5}
      ${'1d6+0'}   | ${3.5}
      ${'1d6+5'}   | ${8.5}
      ${'1d6-10'}  | ${-6.5}
      ${'3d6'}     | ${10.5}
      ${'3d6+10'}  | ${20.5}
      ${'0d0'}     | ${0}
      ${'0d1'}     | ${0}
      ${'1d0'}     | ${0}
      ${'0d10'}    | ${0}
      ${'-1d6'}    | ${-3.5}
      ${'-3d6'}    | ${-10.5}
      ${'-3d6+10'} | ${-0.5}
      ${'-3d6-10'} | ${-20.5}
    `('gets mean as $expected for $dice', ({ dice, expected }) => {
  let parsed = DiceRoller.parseDiceString(dice)
  expect(DiceStats.calculateMean(parsed)).toBe(expected)
})
  })
})
