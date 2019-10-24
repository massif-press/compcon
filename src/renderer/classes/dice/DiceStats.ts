import { DiceRoller, ParsedDieString } from './DiceRoller'

class DiceStatsResult implements IDiceStats {
  private _diceString: string
  private _min: number
  private _max: number
  private _mean: number
  private _error: boolean

  public constructor(diceString: string, min: number, max: number, mean: number, error?: boolean) {
    this._diceString = diceString
    this._min = min
    this._max = max
    this._mean = mean
    this._error = error || false
  }

  public get diceString(): string {
    return this.diceString
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

  public get error(): boolean {
    return this._error
  }
}

class DiceStats {
  // returns stats for a dice string
  public static getStats(diceString: string): DiceStatsResult {
    let min = 0
    let max = 0
    let mean = 0
    let error = false

    let parsedString = DiceRoller.parseDiceString(diceString)

    if (parsedString) {
      min = DiceStats.calculateMin(parsedString)
      max = DiceStats.calculateMax(parsedString)
      mean = DiceStats.calculateMean(parsedString)
    } else {
      min = 0
      max = 0
      mean = 0
      error = true
    }

    return new DiceStatsResult(diceString, min, max, mean, error)
  }

  public static calculateMin(parsedDice: ParsedDieString): number {
    let min: number = parsedDice.modifier
    parsedDice.dice.forEach(die => {
      if (die.type > 0 && die.quantity > 0) {
        min += die.quantity
      } else if (die.type > 0) {
        min += die.type * die.quantity // i.e. for -3d6, min is -6
      }
    })

    return min
  }

  public static calculateMax(parsedDice: ParsedDieString): number {
    let max: number = parsedDice.modifier
    parsedDice.dice.forEach(die => {
      if (die.type > 0 && die.quantity > 0) {
        max += die.type * die.quantity
      } else if (die.type > 0) {
        max += die.quantity // i.e. for -3d6, max is -3
      }
    })

    return max
  }

  public static calculateMean(parsedDice: ParsedDieString): number {
    let result = 0
    parsedDice.dice.forEach(die => {
      if (die.type <= 0) return

      let total = 0
      let count = 0
      for (let x = 0; x < die.type; x++) {
        total += x + 1
        count += 1
      }

      result += (total / count) * die.quantity + parsedDice.modifier
    })

    return result
  }
}

export { DiceStats, DiceStatsResult }
