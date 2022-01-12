declare interface Id20RollResult {
  total: number
  rawDieRoll: number
  staticBonus: number
  accuracyDiceCount: number // net accuracy dice total - negative if at disadvantage
  rawAccuracyRolls: number[] // results of each accuracy/disadvantage die
  accuracyResult: number
}

declare interface IDamageRollResult {
  diceString: string
  total: number
  rawDieRolls: number[]
  staticBonus: number
  overkillRerolls: number
  parseError: boolean
}

class DieSet {
  private _type: number
  private _quantity: number

  public constructor(quantity: number, type: number) {
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

  public constructor(dice, modifier) {
    this._dice = dice
    this._modifier = modifier
  }

  public get dice(): DieSet[] {
    return this._dice
  }

  public get modifier(): number {
    return this._modifier
  }
}

class D20RollResult implements Id20RollResult {
  private _total: number
  private _rawDieRoll: number
  private _staticBonus: number
  private _accuracyDiceCount: number
  private _rawAccuracyRolls: number[]
  private _accuracyResult: number

  public constructor(
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

  public get overkillRerolls(): number {
    return 0
  }

  public get accuracyResult(): number {
    return this._accuracyResult
  }
}

class DamageRollResult implements IDamageRollResult {
  private _total: number
  private _rawDieRolls: number[]
  private _rollClassifications: string[]
  private _overkillRerolls: number
  private _staticBonus: number
  private _parseError: boolean
  private _diceString: string

  public constructor(
    diceString: string,
    total: number,
    rawRolls: number[],
    rollClass: string[],
    staticBonus: number,
    overkillRerolls: number,
    parseError?: boolean
  ) {
    this._diceString = diceString
    this._total = total || 0
    this._rawDieRolls = rawRolls || [0]
    this._rollClassifications = rollClass || ['']
    this._overkillRerolls = overkillRerolls || 0
    this._staticBonus = staticBonus || 0
    this._parseError = parseError || false
  }

  public get diceString(): string {
    return this._diceString
  }

  public get total(): number {
    return this._total
  }

  public get rawDieRolls(): number[] {
    return this._rawDieRolls
  }

  public get rollClassifications(): string[] {
    return this._rollClassifications
  }


  public get staticBonus(): number {
    return this._staticBonus
  }

  public get parseError(): boolean {
    return this._parseError
  }

  public get overkillRerolls(): number {
    return this._overkillRerolls
  }
}

class DiceRoller {
  // this class will make rolls, given all the inputs
  // it makes no evaluation re their success or failure

  public static rollSkillCheck(
    staticBonus = 0,
    totalAccuracy = 0,
    totalDifficulty = 0
  ): D20RollResult {
    const d20Result: number = DiceRoller.rollDie(20)

    const netAccuracyDice: number = totalAccuracy - totalDifficulty
    const accuracyResults = DiceRoller.rollAccuracyDice(netAccuracyDice)
    const total = d20Result + staticBonus + accuracyResults.result

    return new D20RollResult(
      total,
      d20Result,
      staticBonus,
      netAccuracyDice,
      accuracyResults.rolls,
      accuracyResults.result
    )
  }

  public static rollToHit(staticBonus = 0, totalAccuracy = 0, totalDifficulty = 0): D20RollResult {
    return DiceRoller.rollSkillCheck(staticBonus, totalAccuracy, totalDifficulty)
  }

  public static rollDamage(
    diceString: string,
    critical?: boolean,
    overkill?: boolean
  ): DamageRollResult {
    const parsedRoll = DiceRoller.parseDiceString(diceString)

    if (!parsedRoll) {
      // return as a error - they get back the dice string
      // and can handle as a special case

      return new DamageRollResult(diceString, 0, [0], [], 0, 0, true)
    } else {
      let total = 0
      const rawRolls: number[] = []
      const rollClass: string[] = []
      let okRerolls = 0
      let staticBonus = 0

      staticBonus = parsedRoll.modifier
      total = staticBonus

      parsedRoll.dice.forEach(dieSet => {
        const x = DiceRoller.rollDieSet(dieSet, overkill, critical)
        rawRolls.push(...x.rolls)
        rollClass.push(...this.classifyDamageRolls(dieSet, x.rolls, overkill))
        okRerolls += x.rerolls
        total += x.result
      })

      return new DamageRollResult(diceString, total, rawRolls, rollClass, staticBonus, okRerolls, false)
    }
  }

  public static classifyDamageRolls(dieSet: DieSet, rolls: number[], overkill?: boolean): string[] {
    if (dieSet.quantity <= 0 || rolls.length <= 0) return []

    const rollClass: string[] = []
    //Set initial 'overkill' and 'low' values
    rolls.forEach((value, index) => {
      if (overkill && (value === 1)) {
        rollClass.push('overkill')
      } else {
        rollClass.push('low')
      }
    })

    //Find high values and mark them
    for (let x = 0; x < dieSet.quantity; x++) {
      let highValue = 0
      let highIndex = 0;
      rolls.forEach((value, index) => {
        if (value > highValue && rollClass[index] != 'high') {
          highValue = value
          highIndex = index
        }
      })
      if (highValue > 0) {
        rollClass[highIndex] = 'high'
      }
    }

    return rollClass
  }

  public static parseDiceString(diceString: string): ParsedDieString {
    // remove all spaces
    const parsedString = diceString.replace(/\s/g, '')

    // parse
    const numberTest = new RegExp('^([\\+-]?[0-9]*)$').exec(parsedString)
    const simpleDieTest = new RegExp('^([\\+-]?[0-9]*)d([0-9]*)$').exec(parsedString)
    const complexDieTest = new RegExp('^([\\+-]?[0-9]*)d([0-9]*)([\\+-][0-9]*)$').exec(parsedString)

    if (numberTest) {
      const dieSet = new DieSet(0, 0)
      const modifier = parseInt(numberTest[1])

      return new ParsedDieString([dieSet], modifier)
    } else if (simpleDieTest) {
      const dieSet = new DieSet(parseInt(simpleDieTest[1]), parseInt(simpleDieTest[2]))
      // let modifier = 0

      return new ParsedDieString([dieSet], 0)
    } else if (complexDieTest) {
      const dieSet = new DieSet(parseInt(complexDieTest[1]), parseInt(complexDieTest[2]))
      const modifier = parseInt(complexDieTest[3])

      return new ParsedDieString([dieSet], modifier)
    } else {
      return undefined
    }
  }

  public static rollDieSet(dieSet: DieSet, overkill?: boolean, critical?: boolean): { result: number; rolls: number[]; rerolls: number } {
    if (dieSet.quantity <= 0 || dieSet.type <= 0) return { result: 0, rolls: [], rerolls: 0 }

    let total = 0
    let rerolls = 0
    const quantity = critical ? dieSet.quantity * 2 : dieSet.quantity
    const rolls: number[] = []

    for (let x = 0; x < quantity; x++) {
      const result = DiceRoller.rollDie(dieSet.type)
      if (overkill && result === 1) {
        rerolls += 1
        x -= 1
      }
      total += result
      rolls.push(result)
    }

    return {
      result: total,
      rolls,
      rerolls
    }
  }

  public static rollAccuracyDice(numberOfDice: number): { result: number; rolls: number[] } {
    if (numberOfDice === 0) return { result: 0, rolls: [] }

    // needs to handle both positive and negative accuracy (aka difficulty)
    const rawResults = DiceRoller.rollDieSet(new DieSet(Math.abs(numberOfDice), 6))

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

  public static rollDie(dieType: number): number {
    if (dieType <= 0) return 0
    return Math.floor(Math.random() * Math.floor(dieType)) + 1
  }
}

export { DiceRoller, D20RollResult, DamageRollResult, ParsedDieString, DieSet }
