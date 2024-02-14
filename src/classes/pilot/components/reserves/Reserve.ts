import { CompendiumStore } from '@/stores';
import {
  ReserveType,
  Synergy,
  MechEquipment,
  MechWeapon,
  MechSystem,
  CompendiumItem,
  ItemType,
} from '@/class';
import { reserves } from '@massif/lancer-data';
import { IActionData, Action } from '@/classes/Action';
import { IBonusData, Bonus } from '@/classes/components/feature/bonus/Bonus';
import { ISynergyData, ICounterData } from '@/interface';
import { Deployable, IDeployableData } from '@/classes/components/feature/deployable/Deployable';

declare interface IReserveData {
  id: string;
  type?: string;
  name?: string;
  label?: string;
  description?: string;
  resource_name: string;
  resource_note: string;
  resource_cost: string;
  used: boolean;
  consumable: boolean;
  actions?: IActionData[];
  bonuses?: IBonusData[];
  synergies?: ISynergyData[];
  deployables?: IDeployableData[];
  counters?: ICounterData[];
  integrated?: string[];
  special_equipment?: string[];
}

class Reserve extends CompendiumItem {
  public readonly ID: string;
  public readonly ResourceLabel: string;
  public readonly Consumable: boolean;
  public readonly Type: ReserveType;
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  private _resource_name: string;
  private _resource_note: string;
  private _resource_cost: string;
  private _used: boolean;

  public constructor(data: any, packTags?: any, packName?: string) {
    super(data, packTags, packName);
    this.ID = data.id;
    this.ResourceLabel = data.label || '';
    this.Consumable = data.consumable;
    this.Type = (data.type as ReserveType) || ReserveType.Resources;
    this._name = data.name || '';
    this._resource_name = data.resource_name || '';
    this._resource_note = data.resource_note || '';
    this._resource_cost = data.resource_cost || '';
    this._description = data.description || '';
    this._integrated = data.integrated ? data.integrated : [];
    this._special_equipment = data.special_equipment || [];
    this._used = false;

    this.LcpName = packName || 'LANCER Core Book';
    this.InLcp = packName ? true : false;
    this.ItemType = ItemType.Reserve;
  }

  protected save(): void {
    // store.dispatch('set_pilot_dirty');
  }

  public get Icon(): string {
    if (this.Type === ReserveType.Organization) return 'mdi-account-group';
    if (this.Type === ReserveType.Project) return 'cc:orbital';
    if (this.Type === ReserveType.Bonus) return 'cc:accuracy';
    return `cc:reserve_${this.Type.toString().toLowerCase()}`;
  }

  public get SpecialEquipment(): CompendiumItem[] {
    if (!this._special_equipment) return [];
    const res = this._special_equipment.map((x) => {
      const w = CompendiumStore().referenceByID('MechWeapons', x);
      if (w && !w.err) return w;
      const s = CompendiumStore().referenceByID('MechSystems', x);
      if (s && !s.err) return s;
      const wm = CompendiumStore().referenceByID('WeaponMods', x);
      if (wm && !wm.err) return wm;
      const pg = CompendiumStore().referenceByID('PilotGear', x);
      if (pg && !pg.err) return pg;
      return false;
    });
    return res.filter((x) => x);
  }

  public get IntegratedEquipment(): MechEquipment[] {
    if (!this._integrated) return [];
    return this._integrated.map((x) => {
      const w = CompendiumStore().referenceByID('MechWeapons', x);
      if (w) return w;
      return CompendiumStore().referenceByID('MechSystems', x);
    });
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated.map((x) => CompendiumStore().referenceByID('MechWeapons', x));
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated.map((x) => CompendiumStore().referenceByID('MechSystems', x));
  }

  public get Color(): string {
    return this._used ? 'grey darken-1' : `reserve--${this.Type.toLowerCase()}`;
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(n: string) {
    this._name = n;
  }

  public get ResourceName(): string {
    return this._resource_name;
  }

  public set ResourceName(name: string) {
    this._resource_name = name;
    this.save();
  }

  public get ResourceCost(): string {
    return this._resource_cost;
  }

  public set ResourceCost(cost: string) {
    this._resource_cost = cost;
    this.save();
  }

  public get Description(): string {
    return this._description;
  }

  public get Note(): string {
    return this._resource_note;
  }

  public set Note(note: string) {
    this._resource_note = note;
    this.save();
  }

  public get Used(): boolean {
    return this._used;
  }

  public set Used(b: boolean) {
    this._used = b;
  }

  public static Serialize(reserve: Reserve): IReserveData {
    return {
      id: reserve.ID,
      type: reserve.Type,
      name: reserve.Name,
      label: reserve.ResourceLabel,
      description: reserve.Description,
      resource_name: reserve.ResourceName,
      resource_note: reserve.Note,
      resource_cost: reserve.ResourceCost,
      consumable: reserve.Consumable,
      used: reserve.Used,
      bonuses: reserve.Bonuses.map((x) => Bonus.Serialize(x)),
      actions: reserve.Actions.map((x) => Action.Serialize(x)),
      synergies: reserve.Synergies.map((x) => Synergy.Serialize(x)),
      deployables: reserve.Deployables,
      counters: reserve.Counters,
      integrated: reserve._integrated,
      special_equipment: reserve._special_equipment,
    };
  }

  public static Deserialize(rData: IReserveData): Reserve {
    let data = reserves.find((x) => x.id === rData.id);
    if (!data)
      data = {
        id: rData.id,
        type: rData.type,
        name: rData.name,
        label: rData.label,
        description: rData.description,
        bonuses: rData.bonuses,
        actions: rData.actions,
        deployables: rData.deployables,
        counters: rData.counters,
        integrated: rData.integrated,
        special_equipment: rData.special_equipment,
      };
    const r = new Reserve(data);
    r._resource_name = rData.resource_name;
    r._resource_note = rData.resource_note;
    r._resource_cost = rData.resource_cost;
    r._used = rData.used;
    return r;
  }
}

export { Reserve };
export type { IReserveData };
