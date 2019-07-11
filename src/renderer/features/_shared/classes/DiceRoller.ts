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

// class damageRollResult implements IDamageRollResult {

//   // getDiceString(): string
//   // getStaticBonus(): number
//   // getDamage(): number
//   // getRawRolls(): number[]

// }

class DamageRollResult implements IDamageRollResult {
  private _total: number
  private _rawDieRolls: number[]
  private _staticBonus: number

  constructor(total: number, rawRolls: number[], staticBonus: number) {
    this._total = total || 0
    this._rawDieRolls = rawRolls || [0]
    this._staticBonus = staticBonus || 0
  }

  public get total(): number {
    return this._total
  }

  public get rawDieRolls(): number[] {
    return this._rawDieRolls
  }

  public get staticBonus(): number {
    return this._staticBonus
  }
}

class D20RollResult implements Id20RollResult {
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
    accuracyResult?: number
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

class DieSet {
  private _type: number
  private _quantity: number

  constructor(type: number, quantity: number) {
    this._type = type
    this._quantity = quantity
  }

  public get type(): number {
    return this._type
  }

  public get quantity(): number {
    return this._quantity
  }
}

class ParsedDieString {
  private _dice: DieSet[]
  private _modifier: number

  constructor(dice, modifier) {
    this._dice = dice
    this._modifier = modifier
  }

  public get dice(): { type: number; quantity: number }[] {
    return this._dice
  }

  public get modifier(): number {
    return this._modifier
  }
}

class DiceRoller {
  // this class will make rolls, given all the inputs
  // it makes no evaluation re their success or failure

  public static rollSkillCheck(
    staticBonus: number = 0,
    totalAccuracy: number = 0,
    totalDifficulty: number = 0
  ): D20RollResult {
    let d20Result: number = DiceRoller.rollDie(20)

    let netAccuracyDice: number = totalAccuracy - totalDifficulty
    let accuracyResults = DiceRoller.rollAccuracyDice(netAccuracyDice)
    let total = d20Result + staticBonus + accuracyResults.result

    return new D20RollResult(
      total,
      d20Result,
      staticBonus,
      netAccuracyDice,
      accuracyResults.rolls,
      accuracyResults.result
    )
  }

  public static rollToHit(
    staticBonus: number = 0,
    totalAccuracy: number = 0,
    totalDifficulty: number = 0
  ): D20RollResult {
    return DiceRoller.rollSkillCheck(
      staticBonus,
      totalAccuracy,
      totalDifficulty
    )
  }

  public static rollDamage(diceString: string): DamageRollResult {
    let parsedRoll = DiceRoller.parseDiceString(diceString)

    let result: DamageRollResult = new DamageRollResult(0, [0], 0)

    return result
  }

  public static parseDiceString(diceString: string): ParsedDieString {
    // remove all spaces
    let parsedString = diceString.replace(/\s/g, '')

    // parse
    let numberTest = new RegExp('^([1-9]*)$').exec(parsedString)
    let simpleDieTest = new RegExp('^([1-9]*)d([1-9]*)$').exec(parsedString)
    let complexDieTest = new RegExp('^([1-9]*)d([1-9]*)\\+([1-9]*)$').exec(
      parsedString
    )

    if (numberTest) {
      let dieSet = new DieSet(0, 0)
      let modifier = parseInt(numberTest[1])

      return new ParsedDieString([dieSet], modifier)
    } else if (simpleDieTest) {
      let dieSet = new DieSet(
        parseInt(simpleDieTest[2]),
        parseInt(simpleDieTest[1])
      )
      let modifier = 0

      return new ParsedDieString([dieSet], 0)
    } else if (complexDieTest) {
      let dieSet = new DieSet(
        parseInt(complexDieTest[2]),
        parseInt(complexDieTest[1])
      )
      let modifier = parseInt(complexDieTest[3])

      return new ParsedDieString([dieSet], modifier)
    } else {
      return
    }
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

  public static rollAccuracyDice(
    numberOfDice: number
  ): { result: number; rolls: number[] } {
    if (numberOfDice === 0) return { result: 0, rolls: [] }

    // needs to handle both positive and negative accuracy (aka difficulty)
    let rawResults = DiceRoller.rollDieSet(Math.abs(numberOfDice), 6)

    let total: number = Math.max(...rawResults.rolls)
    if (numberOfDice < 0) {
      total = -total
      rawResults.rolls.forEach((value, index) => {
        rawResults[index] = -rawResults[index]
      })
    }

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
export { DiceRoller, D20RollResult, DamageRollResult, ParsedDieString, DieSet }
