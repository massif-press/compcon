import { v4 as uuid } from 'uuid';
import { ActivationType, Damage, Range } from '@/class';
import { IDeployableData } from './components/feature/deployable/Deployable';
import { isNumber } from 'lodash';
import { IDamageData } from './Damage';
import { IRangeData } from './Range';
import { ByTier } from '@/util/tierFormat';
import { ActiveEffect, IActiveEffectData } from './components/feature/active_effects/ActiveEffect';
import {
  EffectSpecial,
  IEffectSpecialData,
} from './components/feature/active_effects/EffectSpecial';
import { EffectOther, IEffectOtherData } from './components/feature/active_effects/EffectOther';
import { EffectResist, IEffectResistData } from './components/feature/active_effects/EffectResist';
import { EffectStatus } from './components/feature/active_effects/EffectStatus';

interface IActionData {
  id?: string;
  name: string;
  activation: ActivationType;
  description?: string;
  cost?: number;
  frequency?: string;
  init?: string;
  trigger?: string;
  terse?: string;
  detail: string;
  effect?: string;
  pilot?: boolean;
  mech?: boolean;
  active_effects?: IActiveEffectData[];
  damage?: IDamageData[];
  range?: IRangeData[];
  hide_active?: boolean;
  synergy_locations?: string[];
  ignore_used?: boolean;
  heat_cost?: number;
  tech_attack?: boolean;
  add_status?: string[] | { stat: string; aoe: boolean }[];
  add_special?: IEffectSpecialData[];
  remove_special?: string[];
  add_resist?: IEffectResistData[];
  add_other?: IEffectOtherData[];
  bonus_damage?: string;
}

enum ActivePeriod {
  Turn = 'Turn',
  Round = 'Round',
  Scene = 'Scene',
  Encounter = 'Encounter',
  Mission = 'Mission',
  Unlimited = 'Unlimited',
}

class Frequency {
  public readonly Uses: number;
  public readonly Duration: ActivePeriod;
  public readonly FreqText: string;
  public readonly Unlimited: boolean;

  public constructor(frq: string) {
    this.FreqText = frq;
    this.Unlimited = false;
    if (!frq || !frq.includes('/')) {
      this.Uses = 1;
      this.Duration = ActivePeriod.Unlimited;
      this.Unlimited = true;
    } else {
      const fArr = frq.split('/');
      const num = parseInt(fArr[0]);

      if (!Number.isNaN(num) && Number.isInteger(num)) {
        this.Uses = num;
      } else {
        this.Uses = 1;
        this.Duration = ActivePeriod.Unlimited;
        this.Unlimited = true;
      }

      switch (fArr[1].toLowerCase()) {
        case 'turn':
          this.Duration = ActivePeriod.Turn;
          break;
        case 'round':
          this.Duration = ActivePeriod.Round;
          break;
        case 'scene':
        case 'encounter':
          this.Duration = ActivePeriod.Scene;
          break;
        case 'mission':
          this.Duration = ActivePeriod.Mission;
          break;
        default:
          this.Uses = Number.MAX_SAFE_INTEGER;
          this.Duration = ActivePeriod.Unlimited;
          this.Unlimited = true;
          break;
      }
    }
  }

  public ToString(): string {
    if (this.Unlimited) return this.Duration;
    return `${this.Uses}/${this.Duration}`;
  }

  public RegainUsesOnEvent(event: ActivePeriod): boolean {
    //Nothing takes an unlimited time to regain uses
    if (event == ActivePeriod.Unlimited) return false;

    const order: Record<ActivePeriod, number> = {
      Unlimited: 0,
      Turn: 1,
      Round: 2,
      Scene: 3,
      Encounter: 3,
      Mission: 4,
    };
    //This action is free to regain uses if the given event
    //meets the duration threshold
    return order[this.Duration] <= order[event];
  }
}

class Action {
  public LastUse: ActivationType | null;
  public readonly ID: string;
  public readonly Name: string;
  public readonly Origin: string;
  public readonly Activation: ActivationType;
  public readonly Terse: string;
  public readonly Description: string;
  public readonly Cost: number;
  public readonly HeatCost: number;
  public readonly Frequency: Frequency;
  public readonly Init: string;
  public readonly Trigger: string;
  public readonly Damage: Damage[];
  public readonly Range: Range[];
  public readonly IsPilotAction: boolean;
  public readonly IsMechAction: boolean;
  public readonly IsItemAction: boolean;
  public readonly IsDowntimeAction: boolean;
  public readonly IsActiveHidden: boolean;
  public readonly IsTechAttack: boolean;
  public readonly SynergyLocations: string[];
  public readonly ItemType: string = 'Action';
  public readonly ActiveEffects: ActiveEffect[];
  public readonly AddStatus: EffectStatus[] = [];
  public readonly AddSpecial: EffectSpecial[] = [];
  public readonly RemoveSpecial: string[] = [];
  public readonly AddResist: EffectResist[] = [];
  public readonly AddOther: EffectOther[] = [];
  public readonly BonusDamage: string = '';
  public Deployable: IDeployableData | undefined;
  private _detail: string;
  private _uses: number;
  private _ignore_used: boolean;

  public constructor(data: IActionData, origin?: string, heat?: number) {
    if (data.name) this.Name = data.name;
    else this.Name = `Activate ${origin}` || 'Unknown Action';
    this.Description = data.description || '';
    this.ID = data.id ? data.id : `act_${this.Name.toLowerCase().replace(/\s/g, '')}_${uuid()}`;
    this.Origin = origin || '';
    this.IsItemAction = !!origin;
    if (data.synergy_locations)
      this.SynergyLocations = Array.isArray(data.synergy_locations)
        ? data.synergy_locations
        : [data.synergy_locations];
    else this.SynergyLocations = [];
    this.Activation = data.activation || ActivationType.Quick;
    this.Terse = data.terse || '';
    this._detail = data.detail || data.effect || '';
    this.Cost = data.cost || 1;
    this.HeatCost = heat && isNumber(heat) ? heat : 0;
    // heat cost override
    if (data.heat_cost || data.heat_cost === 0)
      this.HeatCost = isNumber(data.heat_cost) ? data.heat_cost : 0;
    this.Frequency = new Frequency(data.frequency || '');
    this._uses = this.Frequency.Uses;
    this.Init = data.init || '';
    this.Trigger = data.trigger || '';
    this.Damage = [];
    if (data.damage) {
      if (!Array.isArray(data.damage)) data.damage = [data.damage];
      this.Damage = data.damage ? data.damage.map((x) => new Damage(x)) : [];
    }
    if (this.Damage.length) this.Damage.forEach((d) => d.setDamageAttributes(this));
    this.Range = [];
    if (data.range) {
      if (!Array.isArray(data.range)) data.range = [data.range];
      this.Range = data.range ? data.range.map((x) => new Range(x)) : [];
    }
    this.IsPilotAction = data.pilot || data.id === 'act_free_action' || false;
    this.IsTechAttack = data.tech_attack || false;
    this.IsMechAction = data.mech || !data.pilot;
    this.IsActiveHidden = data.hide_active || false;
    this.IsDowntimeAction = data.activation && data.activation.toString() === 'Downtime';
    this.ActiveEffects = data.active_effects
      ? data.active_effects.map((x) => new ActiveEffect(x, this, true))
      : [];
    this.AddStatus = [];
    if (data.add_status) {
      if (!Array.isArray(data.add_status)) data.add_status = [data.add_status];
      this.AddStatus = data.add_status.map((x) => new EffectStatus(x));
    }
    this.AddSpecial = [];
    if (data.add_special) {
      if (!Array.isArray(data.add_special)) data.add_special = [data.add_special];
      this.AddSpecial = data.add_special.map((x) => new EffectSpecial(x));
    }
    if (data.remove_special) this.RemoveSpecial = data.remove_special;
    this.AddResist = [];
    if (data.add_resist) {
      if (!Array.isArray(data.add_resist)) data.add_resist = [data.add_resist];
      this.AddResist = data.add_resist.map((x) => new EffectResist(x));
    }
    this.AddOther = [];
    if (data.add_other) {
      if (!Array.isArray(data.add_other)) data.add_other = [data.add_other];
      this.AddOther = data.add_other.map((x) => new EffectOther(x));
    }
    if (data.bonus_damage) this.BonusDamage = data.bonus_damage;

    this._ignore_used = data.ignore_used || false;
    this.LastUse = null;
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

  public getDetail(tier?: number): string {
    return ByTier(this._detail, tier);
  }

  public get Uses(): number {
    return this._uses;
  }

  public get Color(): string {
    if (this.ID === 'act_overcharge') return 'action--overcharge';
    if (this.ID === 'act_self_destruct') return 'error';
    return `action--${this.Activation.toLowerCase()}`;
  }

  public get Icon(): string {
    if (this.ID === 'act_overcharge') return 'cc:overcharge';
    if (this.ID === 'act_self_destruct') return 'mdi-alert-rhombus';
    switch (this.Activation) {
      case ActivationType.Full:
        return 'mdi-hexagon-slice-6';
      case ActivationType.Quick:
        return 'mdi-hexagon-slice-3';
      case ActivationType.Move:
        return 'mdi-arrow-right-bold-hexagon-outline';
      default:
        return `cc:${this.Activation.toLowerCase().replace(' ', '_')}`;
    }
  }

  public static CreateDeployAction(d: IDeployableData, origin?: string): Action {
    const a = new Action(
      {
        id: `deploy_${d.name}_${uuid()}`,
        name: `Deploy ${d.name}`,
        activation: d.activation || ActivationType.Quick,
        cost: d.cost || 1,
        detail: '',
        synergy_locations:
          d.type?.toLowerCase() === 'drone' ? ['deployable', 'drone'] : ['deployable'],
        pilot: d.pilot,
      },
      origin
    );
    a.Deployable = d;
    return a;
  }

  public static Serialize(action: Action): IActionData {
    return {
      id: action.ID,
      name: action.Name,
      activation: action.Activation,
      cost: action.Cost,
      frequency: action.Frequency.FreqText,
      init: action.Init,
      trigger: action.Trigger,
      terse: action.Terse,
      detail: action.Detail,
      pilot: action.IsPilotAction,
      mech: action.IsMechAction,
      damage: action.Damage ? action.Damage.map((x) => Damage.Serialize(x)) : [],
      range: action.Range ? action.Range.map((x) => Range.Serialize(x)) : [],
      hide_active: action.IsActiveHidden,
      synergy_locations: action.SynergyLocations,
      ignore_used: action._ignore_used,
      heat_cost: action.HeatCost,
      tech_attack: action.IsTechAttack,
    };
  }
}

export { Action, ActivePeriod };
export type { IActionData };
