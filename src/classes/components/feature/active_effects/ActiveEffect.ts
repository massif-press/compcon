import { IRangeData } from '@/interface';
import { Bonus, IBonusData } from '../..';
import { Damage, IDamageData } from '../../../Damage';
import { Range } from '../../../Range';
import { IEffectResistData, EffectResist } from './EffectResist';
import { IEffectSpecialData, EffectSpecial } from './EffectSpecial';
import { IEffectOtherData, EffectOther } from './EffectOther';
import { IEffectStatusData, EffectStatus } from './EffectStatus';
import { EffectSave } from './EffectSave';

interface IActiveEffectData {
  name: string;
  detail: string;
  condition?: string;
  damage?: IDamageData[];
  range?: IRangeData[];
  bonuses?: IBonusData[];
  bonus_damage?: string;
  duration?: string;
  frequency?: string;
  save?: string | { stat: string; aoe: boolean };
  add_resist?: IEffectResistData[];
  add_special?: IEffectSpecialData[];
  remove_special?: string[];
  add_other?: IEffectOtherData[];
  add_status?: IEffectStatusData[] | string[];
  applied?: boolean;
}

class ActiveEffect {
  public readonly Origin: any;
  public readonly Name: string;
  public readonly Detail: string;
  public readonly Condition: string;
  public readonly Damage: Damage[];
  public readonly Range: Range[];
  public readonly Bonuses: Bonus[];
  public readonly Duration?: string;
  public readonly Frequency?: string;
  public readonly BonusDamage?: string;

  public readonly Save?: EffectSave;
  public readonly AddResist?: EffectResist[];
  public readonly AddSpecial?: EffectSpecial[];
  public readonly RemoveSpecial?: string[];
  public readonly AddOther?: EffectOther[];
  public readonly AddStatus?: EffectStatus[];

  public readonly Dismissible: boolean;

  public Applied: boolean = false;

  public constructor(data: IActiveEffectData, origin: any, dismissible?: boolean) {
    this.Origin = origin;

    this.Name = data.name;
    this.Detail = data.detail || '';
    this.Condition = data.condition || '';
    this.Damage = [];
    if (data.damage) {
      if (!Array.isArray(data.damage)) data.damage = [data.damage];
      this.Damage = data.damage ? data.damage.map((x) => new Damage(x)) : [];
    }
    this.Range = [];
    if (data.range) {
      if (!Array.isArray(data.range)) data.range = [data.range];
      this.Range = data.range ? data.range.map((x) => new Range(x)) : [];
    }
    this.Bonuses = data.bonuses ? data.bonuses.map((b) => new Bonus(b, this.Name)) : [];
    this.Duration = data.duration;
    this.Frequency = data.frequency;
    this.BonusDamage = data.bonus_damage;
    if (data.save) {
      this.Save = new EffectSave(data.save);
    }
    if (data.add_resist) {
      if (!Array.isArray(data.add_resist)) data.add_resist = [data.add_resist];
      this.AddResist = data.add_resist.map((r) => new EffectResist(r));
    }
    if (data.add_special) {
      if (!Array.isArray(data.add_special)) data.add_special = [data.add_special];
      this.AddSpecial = data.add_special.map((s) => new EffectSpecial(s));
    }
    if (data.remove_special) {
      if (!Array.isArray(data.remove_special)) data.remove_special = [data.remove_special];
      this.RemoveSpecial = data.remove_special;
    }
    if (data.add_other) {
      if (!Array.isArray(data.add_other)) data.add_other = [data.add_other];
      this.AddOther = data.add_other.map((o) => new EffectOther(o));
    }
    if (data.add_status) {
      this.AddStatus = (Array.isArray(data.add_status) ? data.add_status : [data.add_status]).map(
        (s) => new EffectStatus(s)
      );
    }

    this.Dismissible = dismissible || false;
    this.Applied = data.applied || false;
  }

  get IsPassive(): boolean {
    return (
      !this.Damage.length &&
      !this.AddStatus?.length &&
      !this.Save &&
      !this.AddOther?.length &&
      !this.AddResist?.length &&
      !this.AddSpecial?.length
    );
  }
}
export { ActiveEffect };
export type { IActiveEffectData };
