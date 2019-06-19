// var DiceRoller = require("./DiceRoller");
import { DiceRoller } from '@/class'
import 'jest'

// beforeEach(() => {})

// afterEach(() => {})

test('_rollDie outputs are correct', () => {
  Math.random = () => 0.0
  expect(DiceRoller._rollDie(10)).toBe(1)
  Math.random = () => 0.0999
  expect(DiceRoller._rollDie(10)).toBe(1)
  Math.random = () => 0.4500
  expect(DiceRoller._rollDie(10)).toBe(5)
  Math.random = () => 0.9999
  expect(DiceRoller._rollDie(10)).toBe(10)
})
