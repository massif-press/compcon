import { CompendiumItem, ContentPack, Tag } from '@/class';
import { Action, IActionData, ICompendiumItemData, IContentPack, ITagData } from '@/interface';
import { NpcClass } from '../class/NpcClass';
import { NpcTemplate } from '../template/NpcTemplate';
import { CompendiumStore } from '@/stores';
import { Bonus, IBonusData } from '@/classes/components';
import { Deployable, IDeployableData } from '@/classes/components/feature/deployable/Deployable';
import { IInstanceable } from '@/classes/components/instance/IInstanceable';
import Compendium from '@/assets/icons/svg/compendium.vue';
import { BrewInfo } from '@/classes/components/brew/BrewController';
import logger from '@/user/logger';

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
  kit?: string;
  effect?: string;
  detail?: string;
  bonus?: object;
  mod?: IFeatureModData;
  tags: ITagData[];
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
  add_actions?: IActionData[];
}

class NpcFeatureMod {
  _targetID: string;
  AddEffect: string;
  AddBonuses: Bonus[];
  AddTags: ITagData[];
  AddDeployables: Deployable[];
  AddActions: Action[];

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
    this.AddActions = data.add_actions
      ? data.add_actions.map((x) => new Action(x, parent.Name))
      : [];
  }

  public get Target() {
    return CompendiumStore().referenceByID('NpcFeatures', this._targetID) as NpcFeature;
  }
}

abstract class NpcFeature extends CompendiumItem {
  public InLcp: boolean = true;
  // this needs to be public (for now) to support v2 style NPC data
  public _originID: string;
  private _effect: string;
  private _hide_active: boolean;
  public FeatureType: NpcFeatureType = NpcFeatureType.Trait;
  public IsHidden: boolean = false;
  public readonly Base: boolean;
  public readonly Deprecated: boolean = false;
  public readonly BuildFeature: boolean = false;
  public readonly Kit?: string;
  public readonly Mod?: NpcFeatureMod;

  public constructor(data: INpcFeatureData, pack?: ContentPack) {
    super(data as ICompendiumItemData, pack);
    this._originID = data.origin;
    this._effect = data.effect || data.detail || '';

    this._hide_active = data.hide_active || false;
    this.Base = data.base || false;
    this.Deprecated = data.deprecated || false;
    if (data.kit) this.Kit = data.kit;
    if (data.mod) this.Mod = new NpcFeatureMod(data.mod, this);
  }

  public get Name(): string {
    return this._name;
  }

  public get Origin() {
    // nested try/catch to preserve missing LCP error throws. Works but smells.
    try {
      return CompendiumStore().referenceByID('NpcClasses', this._originID) as NpcClass;
    } catch (e) {
      try {
        return CompendiumStore().referenceByID('NpcTemplates', this._originID) as NpcTemplate;
      } catch (e) {
        logger.error(`Feature ${this._name} has no valid origin data!`, this);
        return { ID: 'err' };
      }
    }
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
        if (tier) {
          const tArr = x.replace('{', '').replace('}', '').split('/');
          fmt = fmt.replace(x, `<b class="text-accent">${tArr[tier - 1]}</b>`);
        } else fmt = fmt.replace(x, x.replace('{', '<b class="text-accent">').replace('}', '</b>'));
      });
    }
    return fmt;
  }

  public get HideActive(): boolean {
    return this._hide_active;
  }

  public get Passive(): boolean {
    return this.BuildFeature || this.Deprecated || !!this.Mod || this.HideActive;
  }

  Serialize(): INpcFeatureData {
    const data = Compendium.CreateInstanceData() as INpcFeatureData;
    data.origin = this._originID;
    data.effect = this._effect;
    data.hide_active = this._hide_active;
    data.base = this.Base;
    data.deprecated = this.Deprecated;
    data.build_feature = this.BuildFeature;
    if (this.Mod) {
      data.mod = {
        target: this.Mod._targetID,
        add_effect: this.Mod.AddEffect,
        add_bonuses: this.Mod.AddBonuses.map((x) => Bonus.Serialize(x)),
        add_tags: this.Mod.AddTags,
        add_deployables: this.Mod.AddDeployables.map((x) => Deployable.Serialize(x)),
      };
    }
    return data;
  }
}

export { NpcFeature };
export type { INpcFeatureData };
