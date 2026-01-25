import { ActivationType, Tag } from '@/class';
import { ICounterData, IDamageData, IRangeData, ISynergyData, ITagData } from '@/interface';
import { IActionData, Action } from '../../../Action';
import { IBonusData } from '../bonus/Bonus';
import { ICompendiumItemData } from '../../../CompendiumItem';
import { ByTier } from '@/util/tierFormat';
import { ActiveEffect, IActiveEffectData } from '../active_effects/ActiveEffect';
import { EffectStatus, IEffectStatusData } from '../active_effects/effect_subtype/EffectStatus';
import { EffectSpecial, IEffectSpecialData } from '../active_effects/effect_subtype/EffectSpecial';
import { EffectOther, IEffectOtherData } from '../active_effects/effect_subtype/EffectOther';
import { EffectResist, IEffectResistData } from '../active_effects/effect_subtype/EffectResist';

interface IDeployableData extends ICompendiumItemData {
  name: string;
  detail: string;
  type: string; // this is for UI furnishing only
  activation: ActivationType;
  deactivation?: ActivationType;
  recall?: ActivationType;
  redeploy?: ActivationType;
  size?: number;
  size_special?: string;
  cost?: number;
  instances?: number;
  armor?: number;
  hp?: number;
  evasion?: number;
  edef?: number;
  heatcap?: number;
  repcap?: number;
  sensor_range?: number;
  tech_attack?: number;
  save?: number;
  ram?: number;
  grapple?: number;
  attack_bonus?: number;
  speed?: number;
  damage?: IDamageData[];
  range?: IRangeData[];
  actions?: IActionData[];
  bonuses?: IBonusData[];
  synergies?: ISynergyData[];
  counters?: ICounterData[];
  active_effects?: IActiveEffectData[];
  add_status?: IEffectStatusData[];
  add_special?: IEffectSpecialData[];
  remove_special?: string[];
  add_other?: IEffectOtherData[];
  add_reist?: IEffectResistData[];
  tags?: ITagData[];
  pilot?: boolean;
  mech?: boolean;
}

class Deployable {
  public readonly Name: string;
  public readonly Type: string;
  public readonly Size: number;
  public readonly SizeSpecial?: string;
  public readonly MaxHP: number;
  public readonly Armor: number;
  public readonly Evasion: number;
  public readonly EDefense: number;
  public readonly Heatcap: number;
  public readonly Repcap: number;
  public readonly Sensors: number;
  public readonly TechAttack: number;
  public readonly Save: number;
  public readonly Speed: number;
  public readonly SaveTarget: number;
  public readonly Ram: number;
  public readonly Grapple: number;
  public readonly AttackBonus: number;

  public readonly IsPilotDeployable: boolean;
  public readonly IsMechDeployable: boolean;
  public readonly Activation: ActivationType;
  public readonly Recall: ActivationType | null;
  public readonly Redeploy: ActivationType | null;
  public readonly Actions: Action[] = [];
  public readonly Tags: Tag[] = [];

  public readonly ItemData: IDeployableData;

  public readonly ActiveEffects?: ActiveEffect[];
  public readonly AddStatus?: EffectStatus[];
  public readonly AddSpecial?: EffectSpecial[];
  public readonly RemoveSpecial?: string[];
  public readonly AddOther?: EffectOther[];
  public readonly AddResist?: EffectResist[];

  private _detail: string;

  public constructor(data: IDeployableData) {
    this.Name = data.name;
    this.ItemData = data;
    this.Type = data.type || 'Deployable';
    this._detail = data.detail;
    this.Activation = data.activation;
    this.Recall = data.recall || null;
    this.Redeploy = data.redeploy || null;
    if (data.actions) {
      this.Actions = data.actions.map((x) => new Action(x));
    }
    if (this.Redeploy) {
      this.Actions.push(
        new Action({
          name: 'Redeploy',
          activation: this.Redeploy,
          detail: `Redeploy this ${this.Type}.`,
        }),
      );
    }
    this.Size = data.size || 0.5;
    this.SizeSpecial = data.size_special;
    this.MaxHP = data.hp || 0;
    this.Armor = data.armor || 0;
    this.Evasion = data.evasion || 0;
    this.EDefense = data.edef || 0;
    this.Heatcap = data.heatcap || 0;
    this.Repcap = data.repcap || 0;
    this.Sensors = data.sensor_range || 0;
    this.TechAttack = data.tech_attack || 0;
    this.Save = data.save || 0;
    this.Speed = data.speed || 0;
    this.SaveTarget = data.save || 10;
    this.Ram = data.ram || 0;
    this.Grapple = data.grapple || 0;
    this.AttackBonus = data.attack_bonus || 0;

    this.IsPilotDeployable = data.pilot || false;
    this.IsMechDeployable = data.mech || !data.pilot;

    if (data.tags) this.Tags = Tag.Deserialize(data.tags);
  }

  public get Detail(): string {
    if (!this._detail) return '';
    let out = this._detail;
    const perTier = /(\{.*?\})/gi;
    const matches = out.match(perTier);
    if (matches) {
      matches.forEach((m) => {
        out = out.replace(m, m.replace('{', '<b class="text-accent">').replace('}', '</b>'));
      });
    }
    return out;
  }

  public get DeployAction(): Action {
    return new Action({
      name: `Deploy ${this.Name}`,
      activation: this.Activation,
      detail: `Deploy this ${this.Type}.`,
    });
  }

  public getDetail(tier?: number) {
    return ByTier(this._detail, tier);
  }

  public getStat(key: string, tier?: number): string {
    const v = this[key] as any;
    if (Array.isArray(v) && tier) return v[tier - 1];
    return v;
  }

  public get Icon(): string {
    if (this.Type.toLowerCase() === 'mine') return 'cc:mine';
    if (this.Type.toLowerCase() === 'drone') return 'cc:drone';
    if (this.Type.toLowerCase() === 'shard') return 'mdi-cards-diamond-outline';
    return 'cc:deployable';
  }

  public get SizeIcon(): string {
    return `cc:size_${this.Size === 0.5 ? 'half' : this.Size}`;
  }

  public get Color(): string {
    return 'deployable';
  }

  public static Serialize(deployable: Deployable): IDeployableData {
    return {
      id: deployable.Name,
      name: deployable.Name,
      detail: deployable._detail,
      description: '',
      type: deployable.Type,
      activation: deployable.Activation,
      size: deployable.Size,
      hp: deployable.MaxHP,
      armor: deployable.Armor,
      evasion: deployable.Evasion,
      edef: deployable.EDefense,
      heatcap: deployable.Heatcap,
      repcap: deployable.Repcap,
      sensor_range: deployable.Sensors,
      tech_attack: deployable.TechAttack,
      save: deployable.Save,
      speed: deployable.Speed,
      actions: deployable.Actions.map((x) => Action.Serialize(x)),
      pilot: deployable.IsPilotDeployable,
      mech: deployable.IsMechDeployable,
    };
  }
}

export { Deployable };
export type { IDeployableData };
