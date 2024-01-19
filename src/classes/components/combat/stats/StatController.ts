import { IStatContainer } from './IStatContainer';

interface IStatData {
  max: any;
  current: any;
}

class StatController {
  public Parent: IStatContainer;

  private _maxStats = {};
  private _currentStats = {};

  public static get DefaultStats(): any {
    return {
      activations: 1,
      size: 1,
      sizes: [0.5, 1, 2, 3],
      structure: 1,
      hp: 6,
      armor: 0,
      stress: 1,
      heat: 6,
      repairCapacity: 4,
      attackBonus: 0,
      techAttack: 0,
      limitedBonus: 0,
      speed: 4,
      evasion: 6,
      edef: 6,
      sensorRange: 1,
      saveBonus: 1,
      saveTarget: 1,
      grapple: 0,
      ram: 0,
      hull: 0,
      agi: 0,
      sys: 0,
      eng: 0,
    };
  }

  public constructor(parent: IStatContainer, data?: any) {
    this._maxStats = {};

    for (const key in this._maxStats) {
      if (parent.MandatoryStats.includes(key)) {
        this._maxStats[key] = StatController.DefaultStats[key];
      }
    }

    if (data && data.max) {
      if (!Array.isArray(data)) data = [data];
      data.max.forEach((d) => {
        Object.keys(d).forEach((key) => {
          let statKey = this.cleanKey(key);

          if (Array.isArray(d[key])) {
            this._maxStats[statKey] = d[key];
          } else {
            this._maxStats[statKey] = Array(3).fill(d[key]);
          }
        });
      });
    }

    this._currentStats = Object.keys(StatController.DefaultStats).reduce((acc, key) => {
      acc[key] =
        data && data.current && data.current[key]
          ? data.current[key]
          : StatController.DefaultStats[key][0];
      return acc;
    }, {});

    this.Parent = parent;
  }

  private cleanKey(key: string): string {
    let k = key.replace(/[\s_\-]/g, '');

    switch (k.toLowerCase()) {
      case 'repcap':
        k = 'repairCapacity';
        break;
      case 'save':
        k = 'saveBonus';
        break;
      case 'target':
        k = 'saveTarget';
        break;
      case 'sensors':
        k = 'sensorRange';
        break;
      case 'edefense':
        k = 'edef';
        break;
      case 'agility':
        k = 'agi';
        break;
      case 'systems':
        k = 'sys';
        break;
      case 'engineering':
        k = 'eng';
        break;
    }

    return k.charAt(0).toLowerCase() + k.slice(1);
  }

  private static expandKey(key: string): string {
    let k = key;
    switch (key.toLowerCase()) {
      case 'hp':
        return 'HP';
      case 'heat':
        return 'Heat Capacity';
      case 'edef':
        return 'E-Defense';
      case 'grapple':
      case 'ram':
        k += ' bonus';
        break;
      case 'agi':
        return 'Agility';
      case 'sys':
        return 'Systems';
      case 'eng':
        return 'Engineering';
    }

    k = key.charAt(0).toUpperCase() + key.slice(1);
    k = k.replace(/([A-Z])/g, ' $1').trim();

    return k;
  }

  public get DisplayKeys(): { key: string; title: string; type: string }[] {
    return Object.keys(this._maxStats).map((key) => ({
      key,
      title: StatController.expandKey(key),
      type: StatController.getKeyType(key),
    }));
  }

  public static get CoreStats(): { key: string; title: string; type: string }[] {
    return Object.keys(this.DefaultStats).map((key) => ({
      key,
      title: this.expandKey(key),
      type: this.getKeyType(key),
    }));
  }

  private static getKeyType(key: string): string {
    switch (key.toLowerCase()) {
      case 'size':
        return 'array';
      case 'sizes':
        return 'sizes';
      default:
        return 'number';
    }
  }

  public AddCoreStat(key: string): void {
    this._maxStats[key] = StatController.DefaultStats[key];
  }

  public AddCustomStat(title: string, type: string): void {
    const key = this.cleanKey(title);
    switch (type) {
      case 'array':
        this._maxStats[key] = [];
        break;
      default:
        this._maxStats[key] = Array(3).fill(0);
    }
  }

  public RemoveStat(key: string): void {
    if (this.Parent.MandatoryStats.includes(key)) return;
    delete this._maxStats[key];
  }

  public get MaxStats(): any {
    return this._maxStats;
  }

  public get CurrentStats(): any {
    return this._currentStats;
  }

  public getStatArray(stat: string): number {
    return this[this.cleanKey(stat)];
  }

  public getMax(stat: string): number {
    return this._maxStats[this.cleanKey(stat)];
  }

  public setMax(stat: string, val: any) {
    const k = this.cleanKey(stat);
    if (Array.isArray(val) && !Array.isArray(this._maxStats[k][0])) {
      this._maxStats[k] = val;
    } else {
      this._maxStats[k] = val;
    }
  }

  public getCurrent(stat: string): number {
    return this._currentStats[this.cleanKey(stat)];
  }

  public setCurrent(stat: string, val: any) {
    this._currentStats[this.cleanKey(stat)] = val;
  }

  public get SizeIcon(): string {
    if (!this.getCurrent('size')) return 'cc:size-1';
    return `cc:size-${this.getCurrent('size') === 0.5 ? 'half' : this.getCurrent('size')}`;
  }

  public static Serialize(parent: IStatContainer, target: any) {
    if (!target.stats) target.stats = {};
    target.stats.max = parent.StatController._maxStats;
    target.stats.current = parent.StatController._currentStats;
  }

  public static Deserialize(parent: IStatContainer, data: IStatData) {
    if (!parent.StatController)
      throw new Error(
        `StatController not found on parent (${typeof parent}). New StatControllers must be instantiated in the parent's constructor method.`
      );

    parent.StatController._maxStats = data.max || {};
    parent.StatController._currentStats = data.current || {};
  }
}

export { StatController };
export type { IStatData };
