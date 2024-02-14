export interface INpcClassStats {
  activations: number[] | number;
  armor: number[] | number;
  hp: number[] | number;
  evade: number[] | number;
  edef: number[] | number;
  heatcap: number[] | number;
  speed: number[] | number;
  sensor: number[] | number;
  save: number[] | number;
  hull: number[] | number;
  agility: number[] | number;
  systems: number[] | number;
  engineering: number[] | number;
  size: number[][] | number;
  structure?: number[] | number;
  stress?: number[] | number;
}

const statMap = {
  heatcap: 'heat',
  evade: 'evasion',
  sensor: 'sensorRange',
  save: 'saveTarget',
  agility: 'agi',
  systems: 'sys',
  engineering: 'eng',
};

export class NpcClassStats {
  private _stats: INpcClassStats;

  public constructor(data: INpcClassStats) {
    // transform old stat keys
    this._transformKeys(data);
    this._stats = data;
  }

  private _transformKeys(data: INpcClassStats): any {
    if (!data.structure) data.structure = 1;
    if (!data.stress) data.stress = 1;
    for (const key in data) {
      if (Object.keys(statMap).includes(key.toLowerCase())) {
        data[statMap[key]] = data[key];
        delete data[key];
      }
    }
    for (const key in data) if (!Array.isArray(data[key])) data[key] = new Array(3).fill(data[key]);
  }

  public Stat(key: string, tier: number): number {
    return this._getStatVal(this._stats[key], tier);
  }

  public AllStats(tier: number): any {
    const stats: any = {};
    for (const key in this._stats) {
      stats[key] = this._getStatVal(this._stats[key], tier);
    }
    return stats;
  }

  public StatArr(key: string): number[] {
    let s = this._stats[key.toLowerCase()];
    if (!s) s = this._stats[statMap[key.toLowerCase()]];
    if (!s) return [0, 0, 0];

    return Array.isArray(s) ? s : new Array(3).fill(s);
  }

  private _getStatVal(stat: number | number[], tier: number): number {
    if (Array.isArray(stat)) return stat[tier - 1];
    return stat;
  }

  // for comparitors
  public Average(key: string) {
    if (!this._stats[key]) {
      console.log('no stat', key);
      return 0;
    }
    return this._stats[key].reduce((a, b) => a + b, 0) / this._stats[key].length;
  }

  // public Sizes(tier: number): number[] {
  //   if (!this._stats.size) return [1];
  //   if (!Array.isArray(this._stats.size)) return [this._stats.size];
  //   return this._stats.size[tier - 1];
  // }
}
