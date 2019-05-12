class Range {
  private type: RangeType;
  private raw_value: number;
  private value: string;
  private override: boolean;

  constructor(range: {
    type: string;
    val: string | number;
    override: boolean;
  }) {
    this.type = (<any>RangeType)[range.type];
    this.raw_value = 0;
    this.value = range.val.toString();
    this.override = range.override;
  }

  public get Type(): RangeType {
    return this.type;
  }

  public get Value(): number {
    return this.raw_value;
  }

  public get ToString(): string {
    //TODO: override
    return this.value;
  }
}

export default Range;