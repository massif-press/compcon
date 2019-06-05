// var DiceRoller = require("./DiceRoller");
import { DiceRoller } from "@/class";
import 'jest';

beforeEach(() => {
});

afterEach(() => {
});

test('_rollDie', () => {
  Math.random = () => .5000;

  expect(DiceRoller._rollDie(6)).toBe(4);

})
