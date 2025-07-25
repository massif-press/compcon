import _ from 'lodash';
import { IStatContainer } from './IStatContainer';
import { Stats } from './Stats';

interface IStatData {
  max: any;
  current: any;
}

const MandatoryStats: string[] = [
  'activations',
  'size',
  'sizes',
  'structure',
  'hull',
  'agi',
  'sys',
  'eng',
  'hp',
  'armor',
  'stress',
  'heat',
  'speed',
  'evasion',
  'edef',
  'sensorRange',
  'saveTarget',
  'overshield',
  'overcharge',
  'burn',
];

class StatController {
  public Parent: IStatContainer;

  private _maxStats = {};
  private _currentStats = {};

  public constructor(parent: IStatContainer) {
    this._maxStats = {};
    this._currentStats = {};

    for (const key in this._maxStats) {
      if (MandatoryStats.includes(key)) {
        this._maxStats[key] = Stats.DefaultStats[key];
      }
      if (parent.AdditionalStats?.includes(key)) {
        this._maxStats[key] = Stats.DefaultStats[key] || 0;
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

  public get TrackableStats(): { key: string; title: string; type: string }[] {
    const trackable = [
      'hp',
      'stress',
      'heatcap',
      'structure',
      'repairCapacity',
      'overcharge',
      'overshield',
      'activations',
      'burn',
      'speed',
    ];
    return this.DisplayKeys.filter((x) => trackable.includes(x.key));
  }

  public get NonTrackableStats(): {
    key: string;
    title: string;
    type: string;
  }[] {
    const trackable = ['hp', 'stress', 'heatcap', 'structure', 'repairCapacity'];
    return this.DisplayKeys.filter((x) => !trackable.includes(x.key));
  }

  public GetStatCollection(keys: string[]): { key: string; title: string; type: string }[] {
    return this.DisplayKeys.filter((x) => keys.includes(x.key));
  }

  public static get CoreStats(): {
    key: string;
    title: string;
    type: string;
  }[] {
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
    this.Parent.SaveController.save();
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
    this.Parent.SaveController.save();
  }

  public RemoveStat(key: string): void {
    if (MandatoryStats.includes(key) || this.Parent.AdditionalStats?.includes(key)) return;
    delete this._maxStats[key];
    this.Parent.SaveController.save();
  }

  public get MaxStats(): any {
    return this._maxStats;
  }

  public set MaxStats(val: any) {
    this._maxStats = val;
  }

  public get CurrentStats(): any {
    return this._currentStats;
  }

  public set CurrentStats(val: any) {
    this._currentStats = val;
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
    // this.Parent.SaveController.save();
  }

  public resetCurrentStats() {
    this._currentStats = { ...this._maxStats };
    this._currentStats['heatcap'] = 0;
  }

  public get SizeIcon(): string {
    if (!this.getStat('size')) return 'cc:size-1';
    return `cc:size-${this.getStat('size') === 0.5 ? 'half' : this.getStat('size')}`;
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

    if (data.max) parent.StatController._maxStats = data.max;
    if (data.current && Object.keys(data.current).length)
      parent.StatController._currentStats = data.current;
    else {
      (parent as any).Parent.SetStats();
      parent.StatController.resetCurrentStats();
    }
  }
}

export { StatController, MandatoryStats };
export type { IStatData };
