import _ from 'lodash';
import { IStatContainer } from './IStatContainer';
import { Stats } from './Stats';

interface IStatData {
  max: any;
  current: any;
}

class StatController {
  public Parent: IStatContainer;

  private _maxStats = {};
  private _currentStats = {};

  public constructor(parent: IStatContainer, data?: any) {
    this._maxStats = {};

    for (const key in this._maxStats) {
      if (parent.MandatoryStats.includes(key)) {
        this._maxStats[key] = Stats.DefaultStats[key];
      }
    }

    if (data && data.max) {
      if (!Array.isArray(data)) data = [data];
      data.max.forEach((d) => {
        Object.keys(d).forEach((key) => {
          let statKey = Stats.cleanKey(key);

          if (Array.isArray(d[key])) {
            this._maxStats[statKey] = d[key];
          } else {
            this._maxStats[statKey] = Array(3).fill(d[key]);
          }
        });
      });
    }

    this._currentStats = Object.keys(Stats.DefaultStats).reduce((acc, key) => {
      acc[key] =
        data && data.current && data.current[key] ? data.current[key] : Stats.DefaultStats[key][0];
      return acc;
    }, {});

    this.Parent = parent;
  }

  public get DisplayKeys(): { key: string; title: string; type: string }[] {
    return Object.keys(this._maxStats)
      .filter((x) => x.toLowerCase() !== 'sizes')
      .map((key) => ({
        key,
        title: Stats.expandKey(key),
        type: StatController.getKeyType(key),
        icon: Stats.IconMap[key] || 'mdi-flask-empty-outline',
        sort: Stats.SortMap[key] || 100,
      }));
  }

  public static get CoreStats(): { key: string; title: string; type: string }[] {
    return Object.keys(Stats.DefaultStats).map((key) => ({
      key,
      title: Stats.expandKey(key),
      type: this.getKeyType(key),
    }));
  }

  public StatSelections(key: string) {
    if (key === 'size') return this.getMax('sizes');
    return [];
  }

  private static getKeyType(key: string): string {
    switch (key.toLowerCase()) {
      case 'sizes':
        return 'array';
      default:
        return 'number';
    }
  }

  public AddCoreStat(key: string): void {
    this._maxStats[key] = Stats.DefaultStats[key];
  }

  public AddCustomStat(title: string, type: string): void {
    const key = Stats.cleanKey(_.camelCase(title));
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
    return this[Stats.cleanKey(stat)];
  }

  public getMax(stat: string): number {
    return this._maxStats[Stats.cleanKey(stat)];
  }

  public setMax(stat: string, val: any) {
    const k = Stats.cleanKey(stat);
    if (Array.isArray(val) && !Array.isArray(this._maxStats[k])) {
      this._maxStats[k] = val;
    } else {
      this._maxStats[k] = val;
    }
  }

  public getCurrent(stat: string): number {
    return this._currentStats[Stats.cleanKey(stat)];
  }

  public setCurrent(stat: string, val: any) {
    this._currentStats[Stats.cleanKey(stat)] = val;
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
