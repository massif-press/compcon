import { CompendiumStore } from '@/stores';
import { MechWeapon, Duration, MechSystem, CompendiumItem } from '@/class';
import { IActionData, Action } from '../../../Action';
import { IBonusData, Bonus } from '../../../components/feature/bonus/Bonus';
import { ISynergyData, Synergy } from '../../../components/feature/synergy/Synergy';
import { ICounterData } from '../../../components/combat/counters/Counter';
import { MechEquipment } from '../equipment/MechEquipment';
import { Deployable, IDeployableData } from '../../../components/feature/deployable/Deployable';
import { IResistanceData, Resistance } from '@/classes/EffectObject';

interface IFrameTraitData {
  name: string;
  description: string;
  use?: Duration;
  actions?: IActionData[];
  bonuses?: IBonusData[];
  synergies?: ISynergyData[];
  deployables?: IDeployableData[];
  counters?: ICounterData[];
  integrated?: string[];
  special_equipment?: string[];
  resistances?: IResistanceData[];
}

class FrameTrait {
  public readonly Name: string;
  public readonly Description: string;
  public readonly Use: Duration;
  public readonly Actions: Action[];
  public readonly Bonuses: Bonus[];
  public readonly Synergies: Synergy[];
  public readonly Deployables: Deployable[];
  public readonly Counters: ICounterData[];
  public readonly Resistances: Resistance[];
  public readonly weight: number = 0;
  private _integrated: string[];
  private _special_equipment: string[];

  public constructor(data: IFrameTraitData) {
    this.Name = data.name;
    this.Description = data.description || '';
    this.Use = data.use ? (data.use as Duration) : Duration.Mission;
    this.Actions = data.actions ? data.actions.map((x) => new Action(x)) : [];
    this.Bonuses = data.bonuses
      ? data.bonuses.map((x) => new Bonus(x, `${this.Name} (Frame Trait)`))
      : [];
    this.Synergies = data.synergies ? data.synergies.map((x) => new Synergy(x, 'Frame Trait')) : [];
    this.Deployables = data.deployables ? data.deployables.map((x) => new Deployable(x)) : [];
    if (data.deployables) {
      this.Actions = this.Actions.concat(
        data.deployables.map((d) => Action.CreateDeployAction(d, this.Name))
      );
    }
    this.Counters = data.counters ? data.counters : [];
    this.Resistances = data.resistances ? data.resistances.map((x) => new Resistance(x)) : [];
    this._integrated = data.integrated ? data.integrated : [];
    this._special_equipment = data.special_equipment || [];

    // weight is used to determine the order of traits in the UI
    // weight = description length + actions * 100 + bonuses * 10 + synergies * 1 + deployables * 1000
    this.weight += this.Description.length;
    this.weight += this.Actions.length * 100;
    this.weight += this.Bonuses.length * 10;
    this.weight += this.Synergies.length * 1;
    this.weight += this.Deployables.length * 1000;
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

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated
      .map((x) => CompendiumStore().MechWeapons.find((item) => item.ID === x))
      .filter((x) => !!x) as MechWeapon[];
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated
      .map((x) => CompendiumStore().MechSystems.find((item) => item.ID === x))
      .filter((x) => !!x) as MechSystem[];
  }
}

export { FrameTrait };
export type { IFrameTraitData };
