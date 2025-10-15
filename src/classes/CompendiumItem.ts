import _ from 'lodash';
import { CompendiumStore } from '../stores';
import { ItemType, MechEquipment, MechWeapon, MechSystem, Tag } from '../class';
import { ICounterData, ITagData } from '../interface';
import { IActionData, Action } from './Action';
import { IBonusData, Bonus } from './components/feature/bonus/Bonus';
import { ISynergyData, Synergy } from './components/feature/synergy/Synergy';
import { Deployable, IDeployableData } from './components/feature/deployable/Deployable';
import { BrewInfo } from './components/brew/BrewController';
import { ContentPack } from './ContentPack';
import { ActiveEffect, IActiveEffectData } from './components/feature/active_effects/ActiveEffect';

interface ICompendiumItemData {
  id: string;
  name: string;
  description: string;
  active_effects?: IActiveEffectData[];
  actions?: IActionData[];
  bonuses?: IBonusData[];
  synergies?: ISynergyData[];
  deployables?: IDeployableData[];
  counters?: ICounterData[];
  special_equipment?: string[];
  integrated?: string[];
  tags?: ITagData[];
  flavorDescription?: string;
  brew?: BrewInfo;
  deprecated?: boolean;
}

abstract class CompendiumItem {
  public readonly InstanceID: string;
  public readonly ItemData: ICompendiumItemData;
  public FromInstance: boolean = false;
  public ItemType: ItemType;
  public readonly Brew: BrewInfo;
  public readonly LcpName: string = '';
  public readonly LcpAuthor: string = '';
  public readonly InLcp: boolean = false;
  public readonly ID: string;
  public ActiveEffects: ActiveEffect[] = [];
  public Actions: Action[];
  public Bonuses: Bonus[];
  public Synergies: Synergy[];
  public Deployables: Deployable[];
  public Counters: ICounterData[];
  public readonly Err: string;
  public IsHidden: boolean = false;
  public IsDeprecated: boolean = false;
  public IsExotic: boolean = false;
  public IntegratedOrigin: CompendiumItem | null = null;
  protected _special_equipment: string[] = [];
  protected _integrated: string[] = [];
  protected _name: string;
  protected _description: string;
  protected _note: string = '';
  protected _flavor_name: string = '';
  protected _flavor_description: string = '';
  private _baseTags: Tag[];

  // combat props
  public MaxUses: number = 0;
  public Uses: number = 0;
  public Used: boolean = false;
  public Destroyed: boolean = false;

  public constructor(data?: ICompendiumItemData, lcp?: ContentPack) {
    this.InstanceID = _.uniqueId();
    this.ItemType = ItemType.None;
    this.ItemData = data || ({} as ICompendiumItemData);
    if (data) {
      this.ID = data.id;
      if (data.id && data.id.includes('missing_')) {
        this.IsHidden = true;
      }
      this._name = data.name;
      this._flavor_name = '';
      this._description = data.description || '';
      this._flavor_description = data.flavorDescription || '';
      this.Brew = {
        LcpId: '',
        LcpName: 'Lancer Core Book',
        LcpVersion: '',
        Website: '',
        Status: 'OK',
      };
      if (data.brew) {
        this.Brew = data.brew;
      }
      if (lcp) {
        this.Brew = {
          LcpId: lcp.ID,
          LcpName: lcp.Name,
          LcpVersion: lcp.Version,
          Website: lcp.Website || '',
          Status: 'OK',
        };
        this.ItemData.brew = this.Brew;
      }
      this.InLcp = !!lcp;
      this.LcpName = lcp?.Name || 'Lancer Core Book';
      this.LcpAuthor = lcp?.Author || 'Massif Press';
      this._baseTags = Tag.Deserialize(data.tags || [], lcp?.Data.tags || [], lcp?.Name || '');
      this.IsExotic = this._baseTags.some((x) => x.IsExotic);
      const heatTag = this.Tags.find((x) => x.IsHeatCost);
      const heatCost = Number(heatTag ? heatTag.Value : 0);
      this.ActiveEffects = data.active_effects
        ? data.active_effects.map((x) => new ActiveEffect(x, this))
        : [];
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
      if (data.deprecated) {
        this.Name = `[Deprecated] ${this.Name}`;
        this._description = `*This item is deprecated and can be safely removed.*\n\n${this.Description}`;
        this.IsDeprecated = true;
        this.IsHidden = true;
      }
    } else {
      this.ID = `err_${Math.random().toString(36).substring(2)}`;
      this._name = this._description = this._note = '';
      this.Brew = {} as BrewInfo;
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

  public get Name(): string {
    return this._flavor_name ? this._flavor_name : this._name;
  }

  public set Name(val: string) {
    this._flavor_name = val;
  }

  public get FlavorName(): string {
    return this._flavor_name;
  }

  public get TrueName(): string {
    return this._name;
  }

  public get Description(): string {
    return this._description || this.FlavorDescription || '';
  }

  public set FlavorDescription(val: string) {
    this._flavor_description = val;
  }

  public get FlavorDescription(): string {
    return this._flavor_description;
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
    const map = this._integrated.map((x) => {
      const w = CompendiumStore().MechWeapons.find((item) => item.ID === x);
      if (w) return w as MechEquipment;
      return CompendiumStore().MechSystems.find((item) => item.ID === x) as MechEquipment;
    }) as MechEquipment[];

    map.forEach((x) => {
      x.IsIntegrated = true;
      x.IntegratedOrigin = this;
    });
    return map;
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this.IntegratedEquipment.filter((x) => x instanceof MechWeapon) as MechWeapon[];
  }

  public get IntegratedSystems(): MechSystem[] {
    return this.IntegratedEquipment.filter((x) => x instanceof MechSystem) as MechSystem[];
  }

  public get Tags(): Tag[] {
    return [...this._baseTags, ...Tag.Populate(this)];
  }

  public get Note(): string {
    return this._note;
  }

  public set Note(note: string) {
    this._note = note;
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
