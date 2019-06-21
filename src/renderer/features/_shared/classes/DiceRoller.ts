// stats: {
//   min: number
//   max: number
//   mean: number
//   median: number
//   mode: number
// }

// private _stats: {
//   min: number
//   max: number
//   mean: number
//   median: number
//   mode: number
// }

// this._stats = stats || {
//   min: 0,
//   max: 0,
//   mean: 0,
//   median: 0,
//   mode: 0,
// }


class SkillRollResult implements ISkillRollResult {
  private _total: number
  private _rawDieRoll: number
  private _staticBonus: number
  private _accuracyDiceCount: number
  private _rawAccuracyRolls: number[]
  private _accuracyResult: number

  constructor(
    total: number,
    rawDieRoll: number,
    staticBonus?: number,
    accuracyDiceCount?: number,
    rawAccuracyRolls?: number[],
    accuracyResult?: number,
  ) {
    this._total = total || 0
    this._rawDieRoll = rawDieRoll || 0
    this._staticBonus = staticBonus || 0
    this._accuracyDiceCount = accuracyDiceCount || 0
    this._rawAccuracyRolls = rawAccuracyRolls || []
    this._accuracyResult = accuracyResult || 0
  }
  
  public get total(): number {
    return this._total
  }

  public get rawDieRoll(): number {
    return this._rawDieRoll
  }

  public get staticBonus(): number {
    return this._staticBonus
  }

  public get accuracyDiceCount(): number {
    return this._accuracyDiceCount
  }

  public get rawAccuracyRolls(): number[] {
    return this._rawAccuracyRolls
  }

  public get accuracyResult(): number {
    return this._accuracyResult
  }
}

class DiceRoller {
  // this class will make rolls, given all the inputs
  // it makes no evaluation re their success or failure
  
  public static rollSkillCheck(
    staticBonus: number = 0,
    totalAccuracy: number = 0,
    totalDifficulty: number = 0
  ): SkillRollResult {
    let d20Result: number = DiceRoller.rollDie(20)

    let netAccuracyDice: number = totalAccuracy - totalDifficulty
    let accuracyResults = DiceRoller.rollAccuracyDice(netAccuracyDice)
    let total = d20Result + staticBonus + accuracyResults.result

    return new SkillRollResult(
      total,
      d20Result,
      staticBonus,
      netAccuracyDice,
      accuracyResults.rolls,
      accuracyResults.result
    )
  }

  public static rollDieSet(dieQuantity: number, dieType: number) {
    if (dieQuantity <= 0 || dieType <= 0) return { result: 0, rolls: [] }

    let total: number = 0
    let rolls: number[] = []

    for (let x = 0; x < dieQuantity; x++) {
      let result = DiceRoller.rollDie(dieType)
      total += result
      rolls.push(result)
    }

    return {
      result: total,
      rolls: rolls,
    }
  }

  // parseRange = (text: string): { lower: number; upper: number; } => {
  public static rollAccuracyDice(numberOfDice: number): {result: number, rolls: number[] } {
    if (numberOfDice === 0) return { result: 0, rolls: [] }
    
    // needs to handle both positive and negative accuracy (aka difficulty)
    let rawResults = DiceRoller.rollDieSet(Math.abs(numberOfDice), 6)

    let total: number = Math.max(...rawResults.rolls)
    if (numberOfDice < 0) total = -total

    return {
      result: total,
      rolls: rawResults.rolls,
    }
  }

  public static rollDie(dieType: number) {
    if (dieType <= 0) return 0

    return Math.floor(Math.random() * Math.floor(dieType)) + 1
  }
}

// module.exports = DiceRoller
export { DiceRoller, SkillRollResult }
