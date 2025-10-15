import { CompendiumStore } from '@/stores';
import { MechWeapon, Tag, ActivationType, Duration, MechSystem } from '@/class';
import { IActionData, Action } from '../../../Action';
import { IBonusData, Bonus } from '../../../components/feature/bonus/Bonus';
import { ISynergyData, Synergy } from '../../../components/feature/synergy/Synergy';
import { ICounterData } from '../../../components/combat/counters/Counter';
import { MechEquipment } from '../equipment/MechEquipment';
import { Deployable, IDeployableData } from '../../../components/feature/deployable/Deployable';
import { CompendiumItem } from '../../../CompendiumItem';
import { ITagData } from '@/interface';
import {
  ActiveEffect,
  IActiveEffectData,
} from '@/classes/components/feature/active_effects/ActiveEffect';

interface ICoreData {
  name: string;
  description: string;
  active_name: string;
  active_effect: string;
  activation: ActivationType;
  deactivation?: ActivationType;
  use?: Duration;
  duration?: string;
  active_effects?: IActiveEffectData[];
  active_actions?: IActionData[];
  active_bonuses?: IBonusData[];
  active_synergies?: ISynergyData[];
  active_deployables?: IDeployableData[];
  active_counters?: ICounterData[];
  passive_name?: string;
  passive_active_effects?: IActiveEffectData[];
  passive_effect?: string;
  passive_actions?: IActionData[];
  passive_bonuses?: IBonusData[];
  passive_synergies?: ISynergyData[];
  deployables?: IDeployableData[];
  counters?: ICounterData[];
  integrated?: string[];
  special_equipment?: string[];
  tags: ITagData[];
}

class CoreSystem {
  public readonly Name: string;
  public readonly Description: string;
  public readonly Activation: ActivationType;
  public readonly ActivateAction: Action;
  public readonly ActiveName: string;
  public readonly ActiveEffect: string;
  public readonly ActiveEffects: ActiveEffect[];
  public readonly ActiveActions: Action[];
  public readonly ActiveBonuses: Bonus[];
  public readonly ActiveSynergies: Synergy[];
  public readonly ActiveDeployables: Deployable[];
  public readonly ActiveCounters: ICounterData[];
  public readonly Deactivation?: ActivationType;
  public Use: Duration;
  public readonly Duration: Duration;
  public readonly PassiveName: string;
  public readonly PassiveEffect: string;
  public readonly PassiveActions: Action[];
  public readonly PassiveBonuses: Bonus[];
  public readonly PassiveSynergies: Synergy[];
  public readonly Deployables: Deployable[];
  public readonly DeployActions: Action[] = [];
  public readonly Counters: ICounterData[];
  public readonly Actions: Action[];

  public Energy: number;

  private _integrated: string[];
  private _special_equipment: string[];
  private _tags: ITagData[];

  private generateActivateAction(): Action {
    return new Action(
      {
        id: `core_active_activate`,
        name: 'Activate CORE System',
        activation: this.Activation,
        detail: this.ActiveEffect,
        mech: true,
        hide_active: true,
      },
      'Frame CORE System'
    );
  }

  public constructor(data: ICoreData) {
    this.Name = data.name;
    this.Description = data.description || '';
    this.ActiveName = data.active_name;
    this.ActiveEffect = data.active_effect;
    this.Activation = data.activation;
    this.ActiveEffects = data.active_effects
      ? data.active_effects.map((x) => new ActiveEffect(x, this))
      : [];
    this.ActiveActions = data.active_actions ? data.active_actions.map((x) => new Action(x)) : [];
    this.ActiveBonuses = data.active_bonuses
      ? data.active_bonuses.map((x) => new Bonus(x, `${this.Name} (ACTIVE)`))
      : [];
    this.ActiveSynergies = data.active_synergies
      ? data.active_synergies.map((x) => new Synergy(x, 'Frame CORE System (Active)'))
      : [];
    this.ActiveDeployables = data.active_deployables
      ? data.active_deployables.map((x) => new Deployable(x))
      : [];
    this.ActiveCounters = data.active_counters ? data.active_counters : [];
    if (data.deactivation) this.Deactivation = data.deactivation;
    this.Duration = data.use ? (data.use as Duration) : Duration.Mission;
    this.PassiveName = data.passive_name || '';
    this.PassiveEffect = data.passive_effect || '';
    this.PassiveActions = data.passive_actions
      ? data.passive_actions.map((x) => new Action(x))
      : [];
    this.PassiveBonuses = data.passive_bonuses
      ? data.passive_bonuses.map((x) => new Bonus(x, `${this.Name} (PASSIVE)`))
      : [];
    this.PassiveSynergies = data.passive_synergies
      ? data.passive_synergies.map((x) => new Synergy(x, 'Frame CORE System (Passive)'))
      : [];
    this.Actions = this.getActions();
    this.Deployables = data.deployables ? data.deployables.map((x) => new Deployable(x)) : [];
    if (data.deployables) {
      this.Actions = this.Actions.concat(
        data.deployables.map((d) => Action.CreateDeployAction(d, this.Name))
      );
    }
    this.Counters = data.counters ? data.counters : [];
    this._integrated = data.integrated ? data.integrated : [];
    this._special_equipment = data.special_equipment || [];
    this._tags = data.tags;
    this.ActivateAction = this.generateActivateAction();
    this.Duration = (data.duration as Duration) || Duration.Mission;
    this.Use = data.use ? (data.use as Duration) : Duration.Mission;

    this.Energy = 1;
  }

  // private activeFeatures(type: string): any[] {
  //   return this[`Passive${type}`].concat(this.IsActive ? this[`Active${type}`] : []);
  // }

  private Features(type: string): any[] {
    return this[`Passive${type}`].concat(this[`Active${type}`]);
  }

  public get Bonuses(): Bonus[] {
    return this.Features('Bonuses');
  }

  public get Synergies(): Synergy[] {
    return this.Features('Synergies');
  }

  public getActions(): Action[] {
    const arr = this.Features('Actions');
    arr.push(this.ActivateAction);
    return arr;
  }

  public get SpecialEquipment(): CompendiumItem[] {
    if (!this._special_equipment) return [];
    const res = this._special_equipment.map((x) => {
      const w = CompendiumStore().MechWeapons.find((item) => item.ID === x);
      if (w) return w;
      const s = CompendiumStore().MechSystems.find((item) => item.ID === x);
      if (s) return s;
      const wm = CompendiumStore().WeaponMods.find((item) => item.ID === x);
      if (wm) return wm;
      const pg = CompendiumStore().PilotGear.find((item: any) => item.ID === x);
      if (pg) return pg;
      return false;
    });
    return res as CompendiumItem[];
  }

  public get IntegratedEquipment(): MechEquipment[] {
    if (!this._integrated) return [];
    return this._integrated.map((x) => {
      const w = CompendiumStore().MechWeapons.find((item) => item.ID === x);
      if (w) return w as MechEquipment;
      return CompendiumStore().MechSystems.find((item) => item.ID === x) as MechEquipment;
    }) as MechEquipment[];
  }

  public get PassiveIntegratedWeapons(): MechWeapon[] {
    return this.IntegratedWeapons;
  }

  public get PassiveCounters(): ICounterData[] {
    return this.Counters;
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated
      .map((x) => CompendiumStore().MechWeapons.find((item) => item.ID === x))
      .filter((x) => !!x) as MechWeapon[];
  }

  public get PassiveIntegratedSystems(): MechSystem[] {
    return this.IntegratedSystems;
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated
      .map((x) => CompendiumStore().MechSystems.find((item) => item.ID === x))
      .filter((x) => !!x) as MechSystem[];
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags);
  }
}

export { CoreSystem };
export type { ICoreData };
