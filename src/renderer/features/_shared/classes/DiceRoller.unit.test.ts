// var DiceRoller = require("./DiceRoller");
import { DiceRoller } from '@/class'
import 'jest'

beforeEach(() => {})

afterEach(() => {})

test('_rollDie', () => {
  Math.random = () => 0.5

  expect(DiceRoller._rollDie(6)).toBe(4)
})
