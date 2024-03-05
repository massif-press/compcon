import { SaveController } from '@/classes/components';
import { IStateController } from '@/classes/components/combat/IStateController';
import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { Eidolon } from './Eidolon';
import { EidolonShard } from './EidolonShard';
import { EidolonLayer } from './EidolonLayer';

class EidolonShardSaveData implements IStateController {
  public readonly Shard: EidolonShard;
  public readonly Layer: EidolonLayer;
  public readonly Parent: Eidolon;
  public StatController: StatController;
  public SaveController: SaveController;

  public MandatoryStats: string[] = [
    'activations',
    'size',
    'structure',
    'hp',
    'armor',
    'stress',
    'heat',
    'speed',
    'evasion',
    'edef',
    'sensorRange',
    'saveTarget',
    'hull',
    'agi',
    'sys',
    'eng',
  ];

  public constructor(layer: EidolonLayer, parent: Eidolon, data?: IStatData) {
    this.Parent = parent;
    this.Layer = layer;
    this.Shard = layer.Shards;
    this.SaveController = parent.SaveController;
    this.StatController = new StatController(this);
    if (data) StatController.Deserialize(this, data);
    else this._setStats(parent.Tier);
  }

  private _setStats(tier: number): any {
    this.MandatoryStats.forEach((key) => {
      let statVal = this.Shard.Stats.Stat(key, tier);
      if (!statVal && statVal !== 0) statVal = EidolonShard.EidolonShardBaseStats[key];

      this.StatController.setMax(key, statVal);
    });
    let sizes = this.Shard.Stats.Stat('sizes', tier) || 1;
    if (!Array.isArray(sizes)) sizes = [sizes];
    this.StatController.setMax('size', sizes[0]);
  }

  public get ChangedStats(): any {
    const changedStats = {};
    this.MandatoryStats.forEach((key) => {
      if (key === 'size' || key === 'sizes') return;
      if (this.StatController.getStat(key) !== this.Shard.Stats.Stat(key, this.Parent.Tier)) {
        changedStats[key] = this.Shard.Stats.Stat(key, this.Parent.Tier);
      }
    });
    return changedStats;
  }

  public ResetStats() {
    this._setStats(this.Parent.Tier);
  }

  public static Serialize(ShardSave: EidolonShardSaveData): IStatData {
    let data = {} as any;
    StatController.Serialize(ShardSave, data);

    return data.stats as IStatData;
  }
}

export { EidolonShardSaveData };
