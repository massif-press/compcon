import { CompendiumStore } from '@/stores';
import { NpcFeature } from '../feature/NpcFeature';
import { INpcClassStats, NpcClassStats } from './NpcClassStats';
import _ from 'lodash';
import { ContentPack } from '@/class';

interface INpcClassData {
  id: string;
  name: string;
  role: string;
  info: { flavor: string; tactics: string; terse?: string };
  stats: INpcClassStats;
  brew: string;
  optionalClassMin?: number;
  optionalClassMax?: number;
  optionalClassPerTier?: number;
  forceTag?: string;

  // library imports
  base_features?: string[];
  optional_features?: string[];
}

class NpcComparison {
  public Hull = 0;
  public Agi = 0;
  public Sys = 0;
  public Eng = 0;
  public Armor = 0;
  public HP = 0;
  public HeatCap = 0;
  public Evasion = 0;
  public EDefense = 0;
  public Speed = 0;
  public Sensors = 0;
  public SaveTarget = 0;

  constructor(npcClass: NpcClass) {
    this.Hull = npcClass.Stats.Average('hull');
    this.Agi = npcClass.Stats.Average('agi');
    this.Sys = npcClass.Stats.Average('sys');
    this.Eng = npcClass.Stats.Average('eng');
    this.Armor = npcClass.Stats.Average('armor');
    this.HP = npcClass.Stats.Average('hp');
    this.HeatCap = npcClass.Stats.Average('heat');
    this.Evasion = npcClass.Stats.Average('evasion');
    this.EDefense = npcClass.Stats.Average('edef');
    this.Speed = npcClass.Stats.Average('speed');
    this.Sensors = npcClass.Stats.Average('sensorRange');
    this.SaveTarget = npcClass.Stats.Average('saveTarget');
  }
}

class NpcClass {
  public readonly ItemType = 'NpcClass';
  public readonly LcpName: string;
  public readonly InLcp: boolean;
  public readonly ForceTag: string;
  private _id: string;
  private _name: string;
  private _role: string;
  private _info: {
    flavor: string;
    tactics: string;
    terse?: string;
  };
  private _stats: NpcClassStats;

  private _baseFeatureList: string[];
  private _optionalFeatureList: string[];

  // Additional feature selections
  public readonly OptionalClassMin: number;
  public readonly OptionalClassMax: number;
  public readonly OptionalClassPerTier: number;

  public Comparator: NpcComparison;

  public constructor(data: INpcClassData, pack?: ContentPack) {
    this._id = data.id;
    this._name = data.name;
    this._role = data.role;
    this._info = data.info;
    this._stats = new NpcClassStats(data.stats);
    this.ForceTag = data.forceTag || '';
    this.LcpName = pack?.Name || 'Lancer Core Book';
    this.InLcp = !!pack;
    this.OptionalClassMin = data.optionalClassMin || 0;
    this.OptionalClassMax = data.optionalClassMax || 0;
    this.OptionalClassPerTier = data.optionalClassPerTier || 0;

    // library style imports
    this._baseFeatureList = data.base_features || [];
    this._optionalFeatureList = data.optional_features || [];

    this.Comparator = new NpcComparison(this);
  }

  public get ID(): string {
    return this._id;
  }

  public get Name(): string {
    return this._name;
  }

  public get Role(): string {
    return this._role.toUpperCase();
  }

  public get Icon(): string {
    if (this._role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
    return `cc:role_${this._role}`;
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

  public get Terse(): string {
    if (this._info.terse) return this._info.terse;
    return this._role;
  }

  public get Features(): NpcFeature[] {
    return CompendiumStore()
      .getItemCollection('NpcFeatures')
      .filter((x) => x.Origin.ID === this.ID && !x.Deprecated);
  }

  public get BaseFeatures(): NpcFeature[] {
    return this.Features.filter((x) => x.Base || this._baseFeatureList.includes(x.ID));
  }

  public get OptionalFeatures(): NpcFeature[] {
    return this.Features.filter((x) => !x.Base || this._optionalFeatureList.includes(x.ID));
  }

  public get Stats(): NpcClassStats {
    return this._stats;
  }

  public get ClassFeatureSelectionInfo(): string {
    if (!this.OptionalClassMin) return '';
    let out = `The ${this.Name} chooses `;
    if (this.OptionalClassMin === this.OptionalClassMax) out += `${this.OptionalClassMin} `;
    else out += `between ${this.OptionalClassMin} and ${this.OptionalClassMax} `;
    out += `additional optional feature${this.OptionalClassMax > 1 ? 's' : ''} from the ${
      this.Name
    } Class Optional Features list ${this.OptionalClassPerTier ? 'per NPC Tier' : ''}`;
    return out;
  }

  public NormalizedStats() {
    const npcs = CompendiumStore().NpcClasses;
    const output = {
      Hull: 0,
      Armor: 0,
      HP: 0,
      Agi: 0,
      Speed: 0,
      Evasion: 0,
      Sys: 0,
      EDefense: 0,
      Sensors: 0,
      Eng: 0,
      HeatCap: 0,
      SaveTarget: 0,
    };

    const normalize = (val, min, max) => {
      if (max === min) return 10;
      return ((val - min) / (max - min)) * 90 + 10;
    };

    Object.keys(output).forEach((v) => {
      const vMax = Math.max(...npcs.map((x) => x.Comparator[v]));
      const vMin = Math.min(...npcs.map((x) => x.Comparator[v]));
      output[v] = normalize(this.Comparator[v], vMin, vMax);
    });
    return output;
  }
}

export { NpcClass, NpcComparison };
export type { INpcClassData };
