import { RangeType } from "@/class";

//TODO: getRange(mech?: Mech, mount?: Mount) to collect all relevant bonuses

class Range {
  private range_type: RangeType;
  private value: string;
  private override: boolean;

  constructor(range: {
    type: string;
    val: string | number;
    override: boolean;
  }) {
    this.range_type = this.getRangeType(range.type);
    this.value = (typeof range.val === "number") ? range.val.toString() : range.val;
    this.override = range.override || false;
  }

  private getRangeType(str: string): RangeType {
    switch (str) {
      case "blast": return RangeType.Blast;
      case "burst": return RangeType.Burst;
      case "cone": return RangeType.Cone;
      case "line": return RangeType.Line;
      case "threat": return RangeType.Threat;
      case "thrown": return RangeType.Thrown;
    }
    return RangeType.Range
  }

  public get Override(): boolean {
    return this.override
  }

  public get Type(): RangeType {
    return this.range_type;
  }

  public get Value(): string {
    return this.value;
  }

  public get Icon(): string {
    return `cc-${this.range_type.toLowerCase()}`;
  }

  public get ToString(): string {
    if (this.override) return this.value;
    return `${this.range_type} ${this.value}`;
  }

  // public get ToBadge(): string {
  //   if (this.override) return "<v-icon>more_horiz</v-icon>";
  //   return `${this.value} ${this.Icon}`;
  // }
}

export default Range;