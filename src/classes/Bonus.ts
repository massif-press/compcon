import { Pilot } from '@/class'

interface IBonusData {
  id: string
  val: string | number
}

class Bonus {
  public readonly ID: string
  public readonly Value: string | number

  public constructor(data: IBonusData) {
    this.ID = data.id
    this.Value = data.val
  }

  public static Evaluate(bonus: Bonus, pilot: Pilot): number {
    if (typeof bonus.Value === 'number') return Math.ceil(bonus.Value)
    let valStr = bonus.Value
    valStr = valStr.replaceAll(`{ll}`, pilot.Level.toString())
    valStr = valStr.replaceAll(`{grit}`, pilot.Grit.toString())
    valStr = valStr.replace(/[^-()\d/*+.]/g, '')
    return Math.ceil(eval(valStr))
  }

  public static get(id: string, pilot: Pilot): number {
    return pilot.Bonuses.filter(x => x.ID === id).reduce(
      (sum, bonus) => sum + this.Evaluate(bonus, pilot),
      0
    )
  }
}

export { Bonus, IBonusData }
