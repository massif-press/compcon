import { DiceRoller, ParsedDieString } from './DiceRoller'

class DiceStats {
  // returns stats for a dice string
  public getStats(diceString: string) {
    let min: number = 0
    let max: number = 0
    let mean: number = 0
    let median: number = 0
    let mode: number = 0

    let parsedString = DiceRoller.parseDiceString(diceString)

    if (parsedString) {
      min = DiceStats.calculateMin(parsedString)
      max = DiceStats.calculateMax(parsedString)
      mean = DiceStats.calculateMean(parsedString)
      median = DiceStats.calculateMedian(parsedString)
      mode = DiceStats.calculateMode(parsedString)

      // parsedString.dice.forEach(die => {
      //   // assuming a die's lowest pip side is 1
      //   min += 1
      //   max += die.type

      //   // get mean
      //   // add up all possible values for die
      // })

      // min += parsedString.modifier
      // max += parsedString.modifier
    }

    return new DiceStatsResult(min, max, mean, median, mode)
  }

  public static calculateMin(parsedDice: ParsedDieString): number {
    let min: number = parsedDice.modifier
    parsedDice.dice.forEach(die => {
      if (die.type >= 1 && die.quantity >= 1) {
        min += 1
      }
    })

    return min
  }

  public static calculateMax(parsedDice: ParsedDieString): number {
    let max: number = parsedDice.modifier
    parsedDice.dice.forEach(die => {
      max += die.type
    })

    return max
  }

  public static calculateMean(parsedDice: ParsedDieString): number {
    return
  }

  public static calculateMedian(parsedDice: ParsedDieString): number {
    return
  }

  public static calculateMode(parsedDice: ParsedDieString): number {
    return
  }
}

class DiceStatsResult implements IDiceStats {
  private _min: number
  private _max: number
  private _mean: number
  private _median: number
  private _mode: number

  constructor(
    min: number,
    max: number,
    mean: number,
    median: number,
    mode: number
  ) {
    this._min = min
    this._max = max
    this._mean = mean
    this._median = median
    this._mode = mode
  }

  public get min(): number {
    return this._min
  }

  public get max(): number {
    return this._max
  }

  public get mean(): number {
    return this._mean
  }

  public get median(): number {
    return this._median
  }

  public get mode(): number {
    return this._mode
  }
}

export { DiceStats, DiceStatsResult }
