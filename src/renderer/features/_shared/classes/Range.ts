import { RangeType } from "@/class";

//TODO: getRange(mech?: Mech, mount?: Mount) to collect all relevant bonuses

class Range {
  private range_type: RangeType;
  private value: string | number;
  private override: boolean;
  private bonus: number

  constructor(range: {
    type: string;
    val: string | number;
    override: boolean;
    bonus?: number;
  }) {
    this.range_type = range.type as RangeType
    this.value = range.val;
    this.override = range.override || false;
    this.bonus = range.bonus || 0;
  }

  public get Override(): boolean {
    return this.override
  }

  public get Type(): RangeType {
    return this.range_type;
  }

  public get Value(): string {
    if (this.bonus && typeof this.value === 'number') 
      return (this.value + this.bonus).toString() 
    return this.value.toString();
  }

  public get Icon(): string {
    return `cc-${this.range_type.toLowerCase()}`;
  }

  public get ToString(): string {
    if (this.override) return this.Value.toString();
    if (this.bonus) return `${this.range_type} ${this.Value} (+${this.bonus})`
    return `${this.range_type} ${this.Value}`;
  }

  // public static Bonus(ranges: Range[], bonus: string | number): Range[] {
  //   let output = [] as Range[]
  //   ranges.forEach(x => {
  //     if (!x.Override) {
  //       const newVal = typeof x.Value === "number" && typeof bonus === "number" && x.Type === RangeType.Range
  //         ? x.Value + bonus + ` (+${bonus})`
  //         : x.Value
  //       output.push(
  //         new Range({
  //           type: x.Type, val: newVal, override: false
  //         })
  //       )
  //     }
  //   })
  //   return output;
  // }

  public static AddBonuses(ranges: Range[], bonuses: {type: RangeType, val: number}[]): Range[] {
    var output = [] as Range[]
    ranges.forEach(range => {
      let bonus = bonuses.filter(x => x.type === range.Type).map(x => x.val).reduce((sum, bonus) => sum + bonus, 0)
      output.push(
        new Range({
          type: range.Type,
          val: range.value,
          override: range.override,
          bonus: bonus,
        })
      )
    });
    return output;
  }

}

export default Range;