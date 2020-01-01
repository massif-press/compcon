import { RangeType } from '@/class'

//TODO: getRange(mech?: Mech, mount?: Mount) to collect all relevant bonuses

interface IRangeData {
  type: RangeType
  val: number
  override?: boolean
  bonus?: number
}

class Range {
  private _range_type: RangeType
  private _value: number
  private _override: boolean
  private _bonus: number

  public constructor(range: IRangeData) {
    this._range_type = range.type as RangeType
    this._value = range.val
    this._override = range.override || false
    this._bonus = range.bonus || 0
  }

  public get Override(): boolean {
    return this._override
  }

  public get Type(): RangeType {
    return this._range_type
  }

  public get Value(): string {
    if (this._bonus) return (this._value + this._bonus).toString()
    return this._value.toString()
  }

  public get Max(): number {
    return this._value + this._bonus
  }

  public get Icon(): string {
    return `cci-${this._range_type.toLowerCase()}`
  }

  public get Text(): string {
    if (this._override) return this.Value.toString()
    if (this._bonus) return `${this._range_type} ${this.Value} (+${this._bonus})`
    return `${this._range_type} ${this.Value}`
  }

  public static AddBonuses(ranges: Range[], bonuses: { type: RangeType; val: number }[]): Range[] {
    var output = [] as Range[]
    ranges.forEach(range => {
      let bonus = bonuses
        .filter(x => x.type === range.Type)
        .map(x => x.val)
        .reduce((sum, bonus) => sum + bonus, 0)
      output.push(
        new Range({
          type: range.Type,
          val: range._value,
          override: range._override,
          bonus: bonus,
        })
      )
    })
    return output
  }
}

export { Range, IRangeData }
