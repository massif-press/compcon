import { v4 as uuid } from 'uuid';
import { SaveController } from '@/classes/components';
import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { CompendiumStore } from '@/stores';
import { Eidolon } from './Eidolon';
import { EidolonLayer, IEidolonLayerData } from './EidolonLayer';
import { FeatureController } from '@/classes/components/feature/FeatureController';
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature';
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';

class EidolonLayerSaveData implements IFeatureContainer {
  public readonly Parent: Eidolon;
  public Layer: EidolonLayer;
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
    data: {
      id: string;
      data: IEidolonLayerData;
      description: string;
      stats?: IStatData;
      shard?: IStatData;
    },
    parent: Eidolon
  ) {
    this.Parent = parent;

    this.SaveController = parent.SaveController;
    this.StatController = new StatController(this);
    console.log(data.stats);
    if (data.stats) StatController.Deserialize(this, data.stats);
    this._description = data.description;

    this.Layer =
      CompendiumStore().EidolonLayers.find((x) => x.ID === data.id) || new EidolonLayer(data.data);

    if (!data.stats) this._setStats(parent.Tier);

    if (this.Layer.Shards) this.Layer.Shards.Tier = parent.Tier;

    this.FeatureController = new FeatureController(this);
    this.FeatureController.Register(this);
  }

  public get FeatureSource(): NpcFeature[] {
    try {
      return this.Layer.Features;
    } catch (e) {
      this.Parent.BrewController.MissingContent = true;
      return [];
    }
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
      let statVal = (this.Layer as EidolonLayer).Stats.Stat(key, tier);
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
      if (
        this.StatController.getStat(key) !==
        (this.Layer as EidolonLayer).Stats.Stat(key, this.Parent.Tier)
      ) {
        changedStats[key] = (this.Layer as EidolonLayer).Stats.Stat(key, this.Parent.Tier);
      }
    });
    return changedStats;
  }

  public ResetStats() {
    this._setStats(this.Parent.Tier);
    if (this.Layer.Shards) this.Layer.Shards.Tier = this.Parent.Tier;
  }

  public static Serialize(layerSave: EidolonLayerSaveData) {
    const data: {
      id: string;
      data: IEidolonLayerData;
      description: string;
      stats?: IStatData;
      shard?: IStatData;
    } = {
      id: layerSave.Layer.ID,
      data: layerSave.Layer.Data,
      description: layerSave.Description,
      shard: undefined,
    };

    StatController.Serialize(layerSave, data);

    // if (layerSave.Layer.Shards) StatController.Serialize(this as any, data.shard);

    return data;
  }

  public Serialize<EidolonLayerSaveData>(): EidolonLayerSaveData {
    return EidolonLayerSaveData.Serialize(this) as EidolonLayerSaveData;
  }

  public static Deserialize(
    data: { id: string; data: any; description: string; stats?: IStatData; shard?: IStatData },
    parent: Eidolon
  ): EidolonLayerSaveData {
    return new EidolonLayerSaveData(data, parent);
  }
}

export { EidolonLayerSaveData };
