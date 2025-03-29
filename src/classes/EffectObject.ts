import { Bonus, IBonusData } from './components';
import { IDamageData } from './Damage';
import { WeaponType, WeaponSize, DamageType, RangeType } from './enums';

interface IEffectObjectData {
  description: string;
  bonus_damage?: IBonusDamageData;
  resistance?: IResistanceData;
  effect_bonus?: IBonusData;
  apply_bonus?: IBonusData;
  save?: ISaveRollData;
}

interface IBonusDamageData {
  damage?: IDamageData;
  override?: boolean;
  frequency?: string;
  immediate?: boolean;
  crit?: boolean;
  ap?: boolean;
  target?: string;
  allowed_types?: WeaponType[];
  allowed_sizes?: WeaponSize[];
  duration?: string;
}

class BonusDamage {
  public readonly Damage: IDamageData | undefined;
  public readonly Override: boolean = false;
  public readonly Frequency: string | undefined;
  public readonly Immediate: boolean = false;
  public readonly Crit: boolean = false;
  public readonly AP: boolean = false;
  public readonly Target: string | undefined;
  public readonly AllowedTypes: WeaponType[] | undefined;
  public readonly AllowedSizes: WeaponSize[] | undefined;
  public readonly Duration: string | undefined;

  public constructor(data?: IBonusDamageData) {
    if (data) {
      this.Damage = data.damage;
      this.Override = data.override || false;
      this.Frequency = data.frequency;
      this.Immediate = data.immediate || false;
      this.Crit = data.crit || false;
      this.AP = data.ap || false;
      this.Target = data.target;
      this.AllowedTypes = data.allowed_types;
      this.AllowedSizes = data.allowed_sizes;
      this.Duration = data.duration;
    }
  }
}

interface IResistanceData {
  immune?: boolean;
  damage_types?: DamageType[];
  range_types?: RangeType[];
  special_range?: SpecialRange;
  weapon_types?: WeaponType[];
  weapon_sizes?: WeaponSize[];
  bonus_ids?: string[];
  duration?: string;
}

type SpecialRange = {
  comparator: 'lt' | 'gt' | 'eq' | 'lte' | 'gte';
  val: number;
};

class Resistance {
  public readonly Immune: boolean = false;
  public readonly DamageTypes: DamageType[] | undefined;
  public readonly RangeTypes: RangeType[] | undefined;
  public readonly SpecialRange: SpecialRange | undefined;
  public readonly WeaponTypes: WeaponType[] | undefined;
  public readonly WeaponSizes: WeaponSize[] | undefined;
  public readonly BonusIDs: string[] | undefined;
  public readonly Duration: string | undefined;

  public constructor(data?: IResistanceData) {
    if (data) {
      this.Immune = data.immune || false;
      this.DamageTypes = data.damage_types;
      this.RangeTypes = data.range_types;
      this.SpecialRange = data.special_range;
      this.WeaponTypes = data.weapon_types;
      this.WeaponSizes = data.weapon_sizes;
      this.BonusIDs = data.bonus_ids;
      this.Duration = data.duration;
    }
  }
}

interface ISaveRollData {
  description?: string;
  hase?: string;
  accuracy?: number;
  flat?: number;
  damage?: IDamageData;
  half?: boolean;
  bonuses?: IBonusData[];
}

class SaveRoll {
  public readonly Description: string | undefined;
  public readonly HASE: string | undefined;
  public readonly Accuracy: number = 0;
  public readonly Flat: number = 0;
  public readonly Damage: IDamageData | undefined;
  public readonly Half: boolean = false;
  public readonly Bonuses: IBonusData[] | undefined;

  public constructor(data?: ISaveRollData) {
    if (data) {
      this.Description = data.description;
      this.HASE = data.hase;
      this.Accuracy = data.accuracy || 0;
      this.Flat = data.flat || 0;
      this.Damage = data.damage;
      this.Half = data.half || false;
      this.Bonuses = data.bonuses;
    }
  }
}

class EffectObject {
  public readonly Description: string = '';
  public readonly BonusDamage?: BonusDamage;
  public readonly Resistance?: Resistance;
  public readonly SaveRoll?: SaveRoll;
  public readonly EffectBonus?: Bonus;
  public readonly ApplyBonus?: Bonus;

  public constructor(data?: string | IEffectObjectData, source?: any) {
    if (typeof data === 'string') {
      this.Description = data;
      return;
    }
    if (data) {
      this.Description = data.description || '';
      if (data.bonus_damage) {
        this.BonusDamage = new BonusDamage(data.bonus_damage);
      }
      if (data.resistance) {
        this.Resistance = new Resistance(data.resistance);
      }
      if (data.effect_bonus) {
        this.EffectBonus = new Bonus(data.effect_bonus, source);
      }
      if (data.apply_bonus) {
        this.ApplyBonus = new Bonus(data.apply_bonus, source);
      }
      if (data.save) {
        this.SaveRoll = new SaveRoll(data.save);
      }
    }
  }
}

export { EffectObject, BonusDamage, Resistance, SaveRoll };
export type { IEffectObjectData, IBonusDamageData, IResistanceData, ISaveRollData };
