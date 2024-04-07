import { CompendiumItem, Tag } from '@/class';
import { ICompendiumItemData, ITagData } from '@/interface';
import { NpcClass } from '../class/NpcClass';
import { NpcTemplate } from '../template/NpcTemplate';
import { CompendiumStore } from '@/stores';
import { Bonus, IBonusData } from '@/classes/components';
import { Deployable, IDeployableData } from '@/classes/components/feature/deployable/Deployable';
import { IInstanceable } from '@/classes/components/instance/IInstanceable';
import Compendium from '@/assets/icons/svg/compendium.vue';

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
  detail?: string;
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

abstract class NpcFeature extends CompendiumItem implements IInstanceable {
  private _originID: string;
  private _effect: string;
  private _hide_active: boolean;
  public FeatureType: NpcFeatureType = NpcFeatureType.Trait;
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
    this._effect = data.effect || data.detail || '';
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
