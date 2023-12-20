import { CompendiumItem } from '@/class';
import { ICompendiumItemData } from '@/interface';
import { NpcReaction, INpcReactionData } from './NpcItem/NpcReaction';
import { NpcSystem, INpcSystemData } from './NpcItem/NpcSystem';
import { NpcTech, INpcTechData } from './NpcItem/NpcTech';
import NpcTrait from './NpcItem/NpcTrait';
import { NpcWeapon, INpcWeaponData } from './NpcItem/NpcWeapon';

export enum NpcFeatureType {
  Trait = 'Trait',
  System = 'System',
  Reaction = 'Reaction',
  Weapon = 'Weapon',
  Tech = 'Tech',
}

interface IOriginData {
  type: string;
  name: string;
  optional: boolean;
  origin_id: string;
}

interface INpcFeatureData extends ICompendiumItemData {
  id: string;
  name: string;
  origin: IOriginData;
  locked: boolean;
  effect?: string;
  bonus?: object;
  override?: object;
  tags: ITagData[];
  brew: string;
  hide_active: boolean;
  type: NpcFeatureType;
}

abstract class NpcFeature extends CompendiumItem {
  private _origin: IOriginData;
  private _effect: string;
  private _locked: boolean;
  private _hide_active: boolean;
  protected type: NpcFeatureType = NpcFeatureType.Trait;
  public IsHidden: boolean = false;
  public readonly LcpName: string;
  public readonly InLcp: boolean;

  public constructor(data: INpcFeatureData, packName?: string) {
    super(data);
    this._origin = data.origin;
    this._effect = data.effect || '';
    this._locked = data.locked || false;
    this._hide_active = data.hide_active || false;
    this.LcpName = packName || 'Lancer CORE NPCs';
    this.InLcp = this.LcpName != 'Lancer CORE NPCs' ? true : false;
  }

  public static Factory<T>(data: INpcFeatureData, packName?: string): T {
    if (data.type === NpcFeatureType.Reaction)
      return new NpcReaction(data as INpcReactionData, packName) as T;
    if (data.type === NpcFeatureType.System)
      return new NpcSystem(data as INpcSystemData, packName) as T;
    if (data.type === NpcFeatureType.Tech) return new NpcTech(data as INpcTechData, packName) as T;
    if (data.type === NpcFeatureType.Weapon)
      return new NpcWeapon(data as INpcWeaponData, packName) as T;
    return new NpcTrait(data, packName) as T;
  }

  public get Name(): string {
    return this._name;
  }

  public get Origin() {
    return {
      ID: this._origin.origin_id,
      Type: this._origin.type,
      Name: this._origin.name,
      Optional: this._origin.optional,
    };
  }

  public get OriginString(): string {
    return `${this.Origin.Optional ? 'Optional' : ''} ${this.Origin.Name} ${this.FeatureType}`;
  }

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

  public get IsBase(): boolean {
    return !this._origin.optional;
  }

  public get Effect(): string {
    if (!this._effect) return '';
    const perTier = /(\{.*?\})/;
    const m = this._effect.match(perTier);
    if (m) {
      return this._effect.replace(
        perTier,
        m[0].replace('{', '<b class="text-accent">').replace('}', '</b>')
      );
    }
    return this._effect;
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

  public get IsLocked(): boolean {
    return this._locked;
  }

  public get HideActive(): boolean {
    return this._hide_active;
  }

  public get FeatureType(): NpcFeatureType {
    return this.type;
  }

  public get Source(): string {
    return '';
    // return this._origin.name
  }
}

export { NpcFeature };
export type { INpcFeatureData, IOriginData };
