import { SaveController } from '@/classes/components';
import { IStateController } from '@/classes/components/combat/IStateController';
import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { CompendiumStore } from '@/stores';
import { Eidolon } from './Eidolon';
import { EidolonLayer } from './EidolonLayer';
import { FeatureController } from '@/classes/components/feature/FeatureController';
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { NpcFeature } from '../feature/NpcFeature';
import { EidolonShardSaveData } from './EidolonShardSaveData';

class EidolonLayerSaveData implements IStateController, IFeatureContainer {
  public readonly Layer: EidolonLayer;
  public readonly Parent: Eidolon;
  public readonly Shard: EidolonShardSaveData;
  public StatController: StatController;
  public SaveController: SaveController;
  public FeatureController: FeatureController;

  private _description: string;

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

  public constructor(
    data: { id: string; description: string; stats?: IStatData; shard?: IStatData },
    parent: Eidolon
  ) {
    this.Layer = CompendiumStore().EidolonLayers.find((x) => x.ID === data.id)!;
    this.Parent = parent;
    this.SaveController = parent.SaveController;
    this.StatController = new StatController(this);
    if (data.stats) StatController.Deserialize(this, data.stats);
    else this._setStats(parent.Tier);

    this.Shard = new EidolonShardSaveData(this.Layer, parent, data.shard);

    this._description = data.description;

    this.FeatureController = new FeatureController(this);
    this.FeatureController.Register(this);
  }

  public get FeatureSource(): NpcFeature[] {
    return this.Layer.Features;
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(newDescription: string) {
    this._description = newDescription;
    this.SaveController.save();
  }

  private _setStats(tier: number): any {
    this.MandatoryStats.forEach((key) => {
      let statVal = this.Layer.Stats.Stat(key, tier);
      if (!statVal && statVal !== 0) statVal = EidolonLayer.EidolonLayerBaseStats[key];

      this.StatController.setMax(key, statVal);
    });
    let sizes = this.Layer.Stats.Stat('sizes', tier) || 1;
    if (!Array.isArray(sizes)) sizes = [sizes];
    this.StatController.setMax('size', sizes[0]);
  }

  public get ChangedStats(): any {
    const changedStats = {};
    this.MandatoryStats.forEach((key) => {
      if (key === 'size' || key === 'sizes') return;
      if (this.StatController.getStat(key) !== this.Layer.Stats.Stat(key, this.Parent.Tier)) {
        changedStats[key] = this.Layer.Stats.Stat(key, this.Parent.Tier);
      }
    });
    return changedStats;
  }

  public ResetStats() {
    this._setStats(this.Parent.Tier);
  }

  public static Serialize(layerSave: EidolonLayerSaveData): IStatData {
    let data = {} as any;

    StatController.Serialize(layerSave, data);

    return data.stats as IStatData;
  }
}

export { EidolonLayerSaveData };
