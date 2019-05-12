class Damage {
  private type: RangeType;
  private raw_value: number;
  private value: string;
  private override: boolean;

  constructor(damage: {
    type: string;
    val: string | number;
    override: boolean;
  }) {
    this.type = (<any>DamageType)[damage.type];
    this.raw_value = 0;
    this.value = damage.val.toString();
    this.override = damage.override;
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


export default Damage;