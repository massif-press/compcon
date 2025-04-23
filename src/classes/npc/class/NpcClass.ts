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
  public Hull = { raw: 1, norm: 1 };
  public Agi = { raw: 1, norm: 1 };
  public Sys = { raw: 1, norm: 1 };
  public Eng = { raw: 1, norm: 1 };
  public Armor = { raw: 1, norm: 1 };
  public HP = { raw: 1, norm: 1 };
  public HeatCap = { raw: 1, norm: 1 };
  public Evasion = { raw: 1, norm: 1 };
  public EDefense = { raw: 1, norm: 1 };
  public Speed = { raw: 1, norm: 1 };
  public Sensors = { raw: 1, norm: 1 };
  public SaveTarget = { raw: 1, norm: 1 };

  constructor(npcClass: NpcClass) {
    this.Hull.raw = npcClass.Stats.Average('hull');
    this.Agi.raw = npcClass.Stats.Average('agi');
    this.Sys.raw = npcClass.Stats.Average('sys');
    this.Eng.raw = npcClass.Stats.Average('eng');
    this.Armor.raw = npcClass.Stats.Average('armor');
    this.HP.raw = npcClass.Stats.Average('hp');
    this.HeatCap.raw = npcClass.Stats.Average('heat');
    this.Evasion.raw = npcClass.Stats.Average('evasion');
    this.EDefense.raw = npcClass.Stats.Average('edef');
    this.Speed.raw = npcClass.Stats.Average('speed');
    this.Sensors.raw = npcClass.Stats.Average('sensorRange');
    this.SaveTarget.raw = npcClass.Stats.Average('saveTarget');
  }

  public static NormalizeReferenceSet(NpcClasses: NpcClass[]) {
    const normalize = (val, valMin, valMax, min, max) =>
      ((val - valMin) / (valMax - valMin)) * (max - min) + min;

    const statVals = [
      'Hull',
      'Agi',
      'Sys',
      'Eng',
      'Armor',
      'HP',
      'HeatCap',
      'Evasion',
      'EDefense',
      'Speed',
      'Sensors',
      'SaveTarget',
    ];
    statVals.forEach((v) => {
      const vMax = Math.max(...NpcClasses.map((x) => x.Comparator[v].raw));
      const vMin = Math.min(...NpcClasses.map((x) => x.Comparator[v].raw));

      NpcClasses.forEach((x) => {
        x.Comparator[v].norm = normalize(x.Comparator[v].raw, vMin, vMax, 0, 100) + 10;
      });
    });
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
}

export { NpcClass, NpcComparison };
export type { INpcClassData };
