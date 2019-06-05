// var DiceRoller = require("./DiceRoller");
import { DiceRoller } from "@/class"
import Jest from "Jest";  //included to make the linter behave

beforeEach(() => {
});

afterEach(() => {
});

test('_rollDie', () => {
  Math.random = () => .5000;

  expect(DiceRoller._rollDie(6)).toBe(4);

})
