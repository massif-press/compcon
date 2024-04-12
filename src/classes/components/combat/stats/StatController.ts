import _ from 'lodash';
import { IStatContainer } from './IStatContainer';
import { Stats } from './Stats';

interface IStatData {
  max: any;
}

class StatController {
  public Parent: IStatContainer;

  private _maxStats = {};

  public constructor(parent: IStatContainer) {
    this._maxStats = {};

    for (const key in this._maxStats) {
      if (parent.MandatoryStats.includes(key)) {
        this._maxStats[key] = Stats.DefaultStats[key];
      }
    }

    this.Parent = parent;
  }

  public setStats(stats: any) {
    this._maxStats = stats;
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
    if (key === 'size') {
      let sizes = this.getStat('sizes') as number | number[];
      if (!Array.isArray(sizes)) sizes = [sizes];
      return sizes;
    }
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

  public set MaxStats(val: any) {
    this._maxStats = val;
  }

  public getStatArray(stat: string): number {
    return this[Stats.cleanKey(stat)];
  }

  public getStat(stat: string): number {
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

  public get SizeIcon(): string {
    if (!this.getStat('size')) return 'cc:size-1';
    return `cc:size-${this.getStat('size') === 0.5 ? 'half' : this.getStat('size')}`;
  }

  public static Serialize(parent: IStatContainer, target: any) {
    if (!target.stats) target.stats = {};
    target.stats.max = parent.StatController._maxStats;
  }

  public static Deserialize(parent: IStatContainer, data: IStatData) {
    if (!parent.StatController)
      throw new Error(
        `StatController not found on parent (${typeof parent}). New StatControllers must be instantiated in the parent's constructor method.`
      );

    parent.StatController._maxStats = data.max || {};
  }
}

export { StatController };
export type { IStatData };
