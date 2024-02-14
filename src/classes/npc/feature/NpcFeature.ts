import { CompendiumItem, Tag } from '@/class';
import { ICompendiumItemData } from '@/interface';
import { NpcClass } from '../class/NpcClass';
import { NpcTemplate } from '../template/NpcTemplate';
import { CompendiumStore } from '@/stores';
import { Bonus, IBonusData } from '@/classes/components';
import { Deployable, IDeployableData } from '@/classes/components/feature/deployable/Deployable';
import { Npc } from '../Npc';

export enum NpcFeatureType {
  Trait = 'Trait',
  System = 'System',
  Reaction = 'Reaction',
  Weapon = 'Weapon',
  Tech = 'Tech',
}

interface INpcFeatureData extends ICompendiumItemData {
  id: string;
  name: string;
  origin: string;
  base?: boolean;
  effect?: string;
  bonus?: object;
  mod?: IFeatureModData;
  tags: ITagData[];
  brew: string;
  hide_active: boolean;
  type: string;
  deprecated?: boolean;
  build_feature?: boolean;
}

interface IFeatureModData {
  target: string;
  add_effect?: string;
  add_bonuses?: IBonusData[];
  add_tags?: ITagData[];
  add_deployables?: IDeployableData[];
}

class NpcFeatureMod {
  _targetID: string;
  Target?: NpcFeature;
  AddEffect: string;
  AddBonuses: Bonus[];
  AddTags: ITagData[];
  AddDeployables: Deployable[];

  constructor(data: IFeatureModData, parent: NpcFeature) {
    this._targetID = data.target;
    this.AddEffect = data.add_effect || '';
    this.AddBonuses = data.add_bonuses
      ? data.add_bonuses.map((x) => new Bonus(x, parent.Name))
      : [];
    this.AddTags = data.add_tags || [];
    this.AddDeployables = data.add_deployables
      ? data.add_deployables.map((x) => new Deployable(x))
      : [];
  }

  public SetTarget() {
    this.Target = CompendiumStore().referenceByID('NpcFeatures', this._targetID) as NpcFeature;
    if ((this.Target as any).err) {
      console.error(`Mod ${this._targetID} has no valid target data!`);
    }
  }
}

abstract class NpcFeature extends CompendiumItem {
  private _originID: string;
  private _effect: string;
  private _hide_active: boolean;
  protected FeatureType: NpcFeatureType = NpcFeatureType.Trait;
  public IsHidden: boolean = false;
  public readonly Base: boolean;
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly Deprecated: boolean = false;
  public readonly BuildFeature: boolean = false;
  public readonly Mod?: NpcFeatureMod;
  // set after all content packs have loaded
  public Origin!: NpcClass | NpcTemplate;

  public constructor(data: INpcFeatureData, packName?: string) {
    super(data);
    this._originID = data.origin;
    this._effect = data.effect || '';
    this._hide_active = data.hide_active || false;
    this.Base = data.base || false;
    this.LcpName = packName || 'Lancer CORE NPCs';
    this.InLcp = this.LcpName != 'Lancer CORE NPCs' ? true : false;
    this.Deprecated = data.deprecated || false;
    if (data.mod) this.Mod = new NpcFeatureMod(data.mod, this);
  }

  public get Name(): string {
    return this._name;
  }

  public SetOrigin() {
    this.Origin = CompendiumStore().referenceByID('NpcClasses', this._originID) as NpcClass;
    if ((this.Origin as any).err) {
      this.Origin = CompendiumStore().referenceByID('NpcTemplates', this._originID) as NpcTemplate;
    }
    if ((this.Origin as any).err) {
      console.error(`Feature ${this._name} has no valid origin data!`);
    }

    if (this.Mod) {
      this.Mod.SetTarget();
    }
  }

  // public get OriginString(): string {
  //   return `${this.Origin.Optional ? 'Optional' : ''} ${this.Origin.Name} ${this.FeatureType}`;
  // }

  // public get OriginString(): string {
  //   return `${this._origin.name} ${this._origin.type} - ${
  //     !this._origin.optional ? 'Base' : 'Optional'
  //   } ${this.FeatureType}`
  // }

  // public get OriginClass(): string {
  //   return this._origin.name
  // }

  // public get OriginSet(): string {
  //   return !this._origin.optional ? 'Base' : 'Optional'
  // }

  // public get IsBase(): boolean {
  //   return !this._origin.optional;
  // }

  public get EffectLength(): number {
    return (
      this._effect.length +
      this.Actions.map((x) => x.Detail.length + x.Trigger.length || 0).reduce((a, b) => a + b, 0) +
      this.Deployables.map((x) => x.Detail.length).reduce((a, b) => a + b, 0)
    );
  }

  public get Effect(): string {
    if (!this._effect) return '';
    let out = this._effect;
    const perTier = /(\{.*?\})/gi;
    const matches = out.match(perTier);
    if (matches) {
      matches.forEach((m) => {
        out = out.replace(m, m.replace('{', '<b class="text-accent">').replace('}', '</b>'));
      });
    }
    return out;
  }

  public EffectByTier(tier: number): string {
    if (!this._effect) return '';
    let fmt = this._effect;
    const perTier = /(\{.*?\})/g;
    const m = this._effect.match(perTier);
    if (m) {
      m.forEach((x) => {
        const tArr = x.replace('{', '').replace('}', '').split('/');
        fmt = fmt.replace(x, `<b class="text-accent">${tArr[tier - 1]}</b>`);
      });
    }
    return fmt;
  }

  public get HideActive(): boolean {
    return this._hide_active;
  }
}

export { NpcFeature };
export type { INpcFeatureData };
