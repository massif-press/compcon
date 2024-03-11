import _ from 'lodash';
import { CompendiumStore, PilotStore } from '../stores';
import { ItemType, MechEquipment, MechWeapon, MechSystem, Tag } from '../class';
import { ICounterData, ITagCompendiumData, ITagData } from '../interface';
import { IActionData, Action } from './Action';
import { IBonusData, Bonus } from './components/feature/bonus/Bonus';
import { ISynergyData, Synergy } from './components/feature/synergy/Synergy';
import { Deployable, IDeployableData } from './components/feature/deployable/Deployable';

interface ICompendiumItemData {
  id: string;
  name: string;
  description: string;
  actions?: IActionData[];
  bonuses?: IBonusData[];
  synergies?: ISynergyData[];
  deployables?: IDeployableData[];
  counters?: ICounterData[];
  special_equipment?: string[];
  integrated?: string[];
  brew?: string;
  tags?: ITagData[];
  flavorDescription?: string;
}

abstract class CompendiumItem {
  public readonly InstanceID: string;
  public ItemType: ItemType;
  public readonly Brew: string;
  public readonly LcpName: string = '';
  public readonly InLcp: boolean = false;
  public readonly ID: string;
  public Actions: Action[];
  public Bonuses: Bonus[];
  public Synergies: Synergy[];
  public Deployables: Deployable[];
  public Counters: ICounterData[];
  // public readonly Tags: Tag[]
  public readonly Err: string;
  public IsHidden: boolean = false;
  public IsExotic: boolean = false;
  protected _special_equipment: string[] = [];
  protected _integrated: string[] = [];
  protected _name: string;
  protected _description: string;
  protected _note: string = '';
  protected _flavor_name: string = '';
  protected _flavor_description: string = '';
  private _baseTags: Tag[];

  public constructor(
    data?: ICompendiumItemData,
    packTags?: ITagCompendiumData[],
    packName?: string
  ) {
    this.InstanceID = _.uniqueId();
    this.ItemType = ItemType.None;
    if (data) {
      this.ID = data.id;
      if (data.id && data.id.includes('missing_')) {
        this.IsHidden = true;
      }
      this._name = data.name;
      this._flavor_name = '';
      this._description = data.description || '';
      this._flavor_description = data.flavorDescription || '';
      this.Brew = data.brew || 'Core';
      this.LcpName = packName || 'LANCER Core Book';
      this.InLcp = packName ? true : false;
      this._baseTags = Tag.Deserialize(data.tags || [], packTags);
      this.IsExotic = this._baseTags.some((x) => x.IsExotic);
      const heatTag = this.Tags.find((x) => x.IsHeatCost);
      const heatCost = Number(heatTag ? heatTag.Value : 0);
      this.Actions = data.actions
        ? data.actions.map((x) => new Action(x, data.name, heatCost))
        : [];
      this.Bonuses = data.bonuses ? data.bonuses.map((x) => new Bonus(x, this._name)) : [];
      this.Synergies = data.synergies ? data.synergies.map((x) => new Synergy(x, data.name)) : [];
      this.Deployables = data.deployables ? data.deployables.map((x) => new Deployable(x)) : [];
      if (data.deployables) {
        this.Actions = this.Actions.concat(
          data.deployables.map((d) => Action.CreateDeployAction(d, this._name))
        );
      }
      this.Counters = data.counters ? data.counters : [];
      this._integrated = data.integrated ? data.integrated : [];
      this._special_equipment = data.special_equipment ? data.special_equipment : [];
      this.Err = '';
    } else {
      this.ID = `err_${Math.random().toString(36).substring(2)}`;
      this._name = this._description = this._note = this.Brew = '';
      this.Actions =
        this.Bonuses =
        this.Synergies =
        this.Deployables =
        this.Counters =
        this._baseTags =
          [];
      this.Err = 'Item data not found!';
    }
  }

  public static Clone(item: CompendiumItem): CompendiumItem {
    return _.cloneDeep(item);
  }

  protected save(): void {
    // TODO: set pilot store to dirty
    // PilotStore().;
  }

  public get Name(): string {
    return this._flavor_name ? this._flavor_name : this._name;
  }

  public set Name(val: string) {
    this._flavor_name = val;
    this.save();
  }

  public get FlavorName(): string {
    return this._flavor_name;
  }

  public get TrueName(): string {
    return this._name;
  }

  public get Description(): string {
    return this._flavor_description ? this._flavor_description : this._description;
  }

  public set Description(val: string) {
    this._flavor_description = val;
    this.save();
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
      if (w.Name) return w;
      return CompendiumStore().referenceByID('MechSystems', x);
    });
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated
      .map((x) => CompendiumStore().referenceByID('MechWeapons', x))
      .filter((x) => !x.err);
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated
      .map((x) => CompendiumStore().referenceByID('MechSystems', x))
      .filter((x) => !x.err);
  }

  public get Tags(): Tag[] {
    return [...this._baseTags, ...Tag.Populate(this)];
  }

  public get Note(): string {
    return this._note;
  }

  public set Note(note: string) {
    this._note = note;
    this.save();
  }

  public get Icon(): string {
    return 'cc:' + _.snakeCase(this.ItemType.toLowerCase().replace(/mech|pilot/gm, ''));
  }

  public get Color(): string {
    return _.kebabCase(this.ItemType);
  }
}

export { CompendiumItem };
export type { ICompendiumItemData };
