import { INpcClassStats, NpcClassStats } from './NpcClassStats';
import { NpcFeature } from '..';

interface INpcClassData {
  id: string;
  name: string;
  role: string;
  info: { flavor: string; tactics: string };
  stats: INpcClassStats;
  base_features: string[];
  optional_features: string[];
  power: number;
  brew: string;
}

class NpcClass {
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  private _id: string;
  private _name: string;
  private _role: string;
  private _info: {
    flavor: string;
    tactics: string;
  };
  private _stats: NpcClassStats;
  private _power: number;
  private _brew: string;

  public constructor(data: INpcClassData, packName?: string) {
    this._id = data.id;
    this._name = data.name;
    this._role = data.role;
    this._info = data.info;
    this._stats = new NpcClassStats(data.stats);
    this._power = data.power;
    this._brew = data.brew || 'CORE';
    this.LcpName = packName || 'Lancer CORE NPCs';
    this.InLcp = this.LcpName != 'Lancer CORE NPCs' ? true : false;
  }

  public get ID(): string {
    return this._id;
  }

  public get Name(): string {
    return this._name;
  }

  public get Power(): number {
    return this._power;
  }

  public get Role(): string {
    return this._role.toUpperCase();
  }

  public get RoleIcon(): string {
    if (this._role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
    return `cc:role-${this._role}`;
  }

  public get Color(): string {
    return `role--${this._role}`;
  }

  public get Flavor(): string {
    return this._info.flavor;
  }

  public get Tactics(): string {
    return this._info.tactics;
  }

  private get _features(): NpcFeature[] {
    return [];
    // return CompendiumStore().NpcFeatures.filter((x) => x.Origin.ID === this.ID);
  }

  public get BaseFeatures(): NpcFeature[] {
    return this._features.filter((x) => !x.Origin.Optional);
  }

  public get OptionalFeatures(): NpcFeature[] {
    return this._features.filter((x) => x.Origin.Optional);
  }

  public get Stats(): NpcClassStats {
    return this._stats;
  }

  public get ItemType(): string {
    return 'NPC Class';
  }
}

export { NpcClass };
export type { INpcClassData };
