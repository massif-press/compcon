import { ActivationType } from '@/class';
import { ICounterData, ISynergyData, ITagData } from '@/interface';
import { IActionData, Action } from '../../../Action';
import { Bonus, IBonusData } from '../bonus/Bonus';
import { ICompendiumItemData } from '../../../CompendiumItem';
import ByTier from '@/util/tierFormat';

interface IDeployableData extends ICompendiumItemData {
  name: string;
  detail: string;
  type: string; // this is for UI furnishing only
  activation: ActivationType;
  deactivation?: ActivationType;
  recall?: ActivationType;
  redeploy?: ActivationType;
  size: number;
  cost?: number;
  armor?: number;
  hp?: number;
  evasion?: number;
  edef?: number;
  heatcap?: number;
  repcap?: number;
  sensor_range?: number;
  tech_attack?: number;
  save?: number;
  speed?: number;
  actions?: IActionData[];
  bonuses?: IBonusData[];
  synergies?: ISynergyData[];
  counters?: ICounterData[];
  tags?: ITagData[];
  pilot?: boolean;
  mech?: boolean;
}

interface IDeployedData {
  // id: string
  data: IDeployableData;
  assigned_name: string;
  current_hp: number;
  current_duration?: number;
  overshield?: number;
  Destroyed?: boolean;
}

class Deployable {
  public readonly Name: string;
  public readonly Type: string;
  public readonly Size: number;
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
  public readonly IsPilotDeployable: boolean;
  public readonly IsMechDeployable: boolean;
  public readonly Recall: ActivationType | null;
  public readonly Redeploy: ActivationType | null;
  public readonly Actions: Action[] = [];

  private _detail: string;

  public constructor(data: IDeployableData) {
    this.Name = data.name;
    this.Type = data.type || 'Deployable';
    this._detail = data.detail;
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
        })
      );
    }
    this.Size = data.size || 0.5;
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

    this.IsPilotDeployable = data.pilot || false;
    this.IsMechDeployable = data.mech || !data.pilot;
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

  public getDetail(tier?: number) {
    return ByTier(this._detail, tier);
  }

  public get Icon(): string {
    if (this.Type.toLowerCase() === 'mine') return 'cc:mine';
    if (this.Type.toLowerCase() === 'drone') return 'cc:drone';
    return 'cc:deployable';
  }

  public get SizeIcon(): string {
    return `cc:size_${this.Size === 0.5 ? 'half' : this.Size}`;
  }
}

export { Deployable };
export type { IDeployableData, IDeployedData };
