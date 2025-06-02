import { CompendiumStore } from '@/stores';
import {
  ReserveType,
  Synergy,
  MechEquipment,
  MechWeapon,
  MechSystem,
  CompendiumItem,
  ItemType,
  ContentPack,
} from '@/class';
import { reserves } from '@massif/lancer-data';
import { IActionData, Action } from '@/classes/Action';
import { IBonusData, Bonus } from '@/classes/components/feature/bonus/Bonus';
import { ISynergyData, ICounterData, IContentPack } from '@/interface';
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
  private _resource_name: string;
  private _resource_note: string;
  private _resource_cost: string;
  private _used: boolean;
  private _deployableData: IDeployableData[];

  public constructor(data: any, pack?: ContentPack) {
    super(data, pack);
    this.ID = data.id;
    this.ResourceLabel = data.label || data.name || '';
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

    this.ItemType = ItemType.Reserve;
    this._deployableData = data.deployables;
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

  public get Color(): string {
    return this._used ? 'grey darken-1' : `reserve`;
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
      deployables: reserve._deployableData,
      counters: reserve.Counters,
      integrated: reserve._integrated,
      special_equipment: reserve._special_equipment,
    };
  }

  public static Deserialize(rData: IReserveData): Reserve {
    let r = {} as Reserve;
    if (CompendiumStore().has('Reserves', rData.id))
      r = CompendiumStore().referenceByID('Reserves', rData.id);
    else r = new Reserve(rData);

    console.log(r);
    r._resource_name = rData.resource_name;
    r._resource_note = rData.resource_note;
    r._resource_cost = rData.resource_cost;
    r._used = rData.used;
    return r;
  }
}

export { Reserve };
export type { IReserveData };
