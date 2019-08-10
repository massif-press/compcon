import { RangeType } from '@/class'

//TODO: getRange(mech?: Mech, mount?: Mount) to collect all relevant bonuses

class Range {
  private range_type: RangeType
  private value: number
  private override: boolean
  private bonus: number

  constructor(range: { type: string; val: number; override: boolean; bonus?: number }) {
    this.range_type = range.type as RangeType
    this.value = range.val
    this.override = range.override || false
    this.bonus = range.bonus || 0
  }

  public get Override(): boolean {
    return this.override
  }

  public get Type(): RangeType {
    return this.range_type
  }

  public get Value(): string {
    if (this.bonus) return (this.value + this.bonus).toString()
    return this.value.toString()
  }

  public get Max(): number {
    return this.value + this.bonus
  }

  public get Icon(): string {
    return `cci-${this.range_type.toLowerCase()}`
  }

  public get ToString(): string {
    if (this.override) return this.Value.toString()
    if (this.bonus) return `${this.range_type} ${this.Value} (+${this.bonus})`
    return `${this.range_type} ${this.Value}`
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
          val: range.value,
          override: range.override,
          bonus: bonus,
        })
      )
    })
    return output
  }
}

export default Range
