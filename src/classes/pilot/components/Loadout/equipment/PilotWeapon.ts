import {
  PilotEquipment,
  Range,
  Damage,
  ItemType,
  DamageType,
  RangeType,
  ContentPack,
} from '@/class';
import {
  IPilotEquipmentData,
  IRangeData,
  IDamageData,
  ITagCompendiumData,
  IContentPack,
} from '@/interface';

interface IPilotWeaponData extends IPilotEquipmentData {
  range: IRangeData[];
  damage: IDamageData[];
}

class PilotWeapon extends PilotEquipment {
  public readonly Range: Range[];
  public readonly Damage: Damage[];

  public constructor(data: IPilotWeaponData, pack?: ContentPack) {
    super(data, pack);
    this.Range = data.range.map((x) => new Range(x));
    this.Damage = data.damage.map((x) => new Damage(x));
    this.ItemType = ItemType.PilotWeapon;
  }

  public get DamageTypeOverride(): string {
    return this._custom_damage_type || '';
  }

  public set DamageTypeOverride(val: string) {
    this._custom_damage_type = val;
    // this.save();
  }

  public get DefaultDamageType(): DamageType {
    if (0 === this.Damage.length) {
      return DamageType.Variable;
    } else {
      return this.Damage[0].Type;
    }
  }

  public get MaxDamage(): number {
    if (0 === this.Damage.length) {
      return 0;
    } else {
      return this.Damage[0].Max;
    }
  }

  public get Icon(): string {
    return 'cc:pilot';
  }

  public DamageSum(type?: DamageType) {
    if (!this.Damage) return 0;
    return this.Damage.reduce((a, b) => a + b.ToNumber(type), 0);
  }

  public RangeSum(type?: RangeType) {
    if (!this.Range) return 0;
    if (!type) return Math.max(...this.Range.map((r) => r.Max));
    return this.Range.find((x) => x.Type === type)?.Max || 0;
  }

  // for scatter and comparators
  public get StatsByProfile() {
    return {
      Name: this.Name,
      Source: '',
      LcpName: this.LcpName,
      ID: this.ID,
      Stats: this.Stats,
    };
  }

  public get Stats() {
    return {
      range: this.RangeSum(),
      damage: this.DamageSum(),
    };
  }
}

export { PilotWeapon };
export type { IPilotWeaponData };
