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
}

export { Bonus, IBonusData }
