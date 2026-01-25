import { Mech, MechWeapon, RangeType } from '@/class';
import { Bonus } from './components/feature/bonus/Bonus';
import { FeatureController } from './components/feature/FeatureController';

//TODO: getRange(mech?: Mech, mount?: Mount) to collect all relevant bonuses

interface IRangeData {
  type: RangeType;
  val: number | string;
  value?: number | string;
  override?: boolean;
  bonus?: number;
  min?: number;
}

type SpecialRange = {
  comparator: 'lt' | 'gt' | 'eq' | 'lte' | 'gte';
  val: number;
};

class Range {
  private _range_type: RangeType;
  private _value: number | string;
  private _override: boolean;
  private _bonus: number;
  private _min: number;

  public constructor(range: IRangeData) {
    this._range_type = range.type as RangeType;
    this._value = range.val || range.value || '';
    this._override = range.override || false;
    this._bonus = range.bonus || 0;
    this._min = range.min || 0;
  }

  public get Override(): boolean {
    return this._override;
  }

  public get Type(): RangeType {
    return this._range_type;
  }

  public get Value(): string {
    if (typeof this._value === 'string') {
      const str = FeatureController.RenderSpecialString(this._value);
      return `${str} ${this._bonus ? `(+${this._bonus})` : ''}`.trim();
    }
    if (this._bonus) return (this._value + this._bonus).toString();
    return this._value.toString();
  }

  public get Max(): number {
    const val = typeof this._value === 'string' ? parseInt(this._value) || 0 : this._value;
    if (isNaN(val)) return 0;
    return val + this._bonus;
  }

  public get Min(): number {
    return this._min;
  }

  public get Icon(): string {
    return `cc:${this._range_type.toLowerCase()}`;
  }

  public get DiscordEmoji(): string {
    switch (this._range_type) {
      case RangeType.Range:
      case RangeType.Threat:
      case RangeType.Thrown:
        return `:cc_${this._range_type.toLowerCase()}:`;
    }
    return `:cc_aoe_${this._range_type.toLowerCase()}:`;
  }

  public get Text(): string {
    if (this._override) return this.Value.toString();
    if (this._bonus) return `${this._range_type} ${this.Value} (+${this._bonus})`;
    return `${this._range_type} ${this.Value}`;
  }

  public get IsRollable(): boolean {
    if (Array.isArray(this._value))
      return this._value.some((v) => typeof v === 'string' && v.includes('d'));
    return typeof this._value === 'string' && this._value.includes('d');
  }

  public TieredRange(tier: number): string {
    if (this.Override) return this.Value;
    if (Array.isArray(this._value)) {
      if (tier - 1 < this._value.length) return this._value[tier - 1].toString();
      else return this._value[this._value.length - 1].toString();
    } else return this.Value;
  }

  public static CalculateRange(item: MechWeapon, mech: Mech, addedRange?: Range[]): Range[] {
    if (!item || !mech) return [];
    if (item.NoBonuses) return item.Range;

    if (!addedRange || !addedRange.length) addedRange = [];

    const output = [] as Range[];

    item.Range.forEach((r) => {
      if (r.Override) return;
      let bonus = 0;
      if (addedRange && addedRange.length)
        addedRange.forEach((added) => {
          const val = mech.FeatureController.EvaluateSpecial(added._value.toString()) as number;
          if (added._range_type === r._range_type) bonus += val;
        });
      output.push(
        new Range({
          type: r.Type,
          val: mech.FeatureController.EvaluateSpecial(r._value.toString()),
          override: r._override,
          bonus: bonus,
        }),
      );
    });

    if (!Bonus.get('range', mech) || item.NoCoreBonus) return output;
    const bonuses = mech.FeatureController.Bonuses.filter((x) => x.ID === 'range');
    output.forEach((r) => {
      if (r.Override) return;
      bonuses.forEach((b) => {
        if (b.WeaponTypes.length && !b.WeaponTypes.some((wt) => item.WeaponTypes.includes(wt)))
          return;
        if (b.WeaponSizes.length && !b.WeaponSizes.some((ws) => item.Size === ws)) return;
        if (
          b.DamageTypes.length &&
          !b.DamageTypes.some((dt) => item.DamageType.some((x) => x === dt))
        )
          return;
        if (!b.RangeTypes.length || b.RangeTypes.some((rt) => r.Type === rt)) {
          r._bonus += Bonus.Evaluate(b, mech.Pilot);
        }
      });
    });
    return output;
  }

  public get IsAoE(): boolean {
    return [RangeType.Cone, RangeType.Line, RangeType.Burst, RangeType.Blast].includes(
      this._range_type,
    );
  }

  public static Serialize(range: Range): IRangeData {
    return {
      type: range._range_type,
      val: range._value,
      override: range._override,
      bonus: range._bonus,
    };
  }
}

export { Range };
export type { IRangeData };
