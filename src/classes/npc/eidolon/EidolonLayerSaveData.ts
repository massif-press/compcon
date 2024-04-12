import { v4 as uuid } from 'uuid';
import { SaveController } from '@/classes/components';
import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { CompendiumStore } from '@/stores';
import { Eidolon } from './Eidolon';
import { EidolonLayer } from './EidolonLayer';
import { FeatureController } from '@/classes/components/feature/FeatureController';
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature';
import { IInstanceableData } from '@/classes/components/instance/IInstancableData';
import { NpcFeatureFactory } from '../feature/NpcFeatureFactory';
import {
  CompendiumItemInstance,
  CompendiumItemInstanceData,
} from '@/classes/CompendiumItemInstance';
import { EidolonShard, IEidolonShardData } from './EidolonShard';

// type EidolonShardProxyData = {
//   count: string | number | number[];
//   detail: string;
//   features: CompendiumItemInstanceData[];
// };

// class EidolonShardProxy {
//   public readonly Count: string | number | number[];
//   public readonly Detail: string;
//   public readonly Features: NpcFeature[] = [];

//   public constructor(shard?: EidolonShard, data?: EidolonShardProxyData) {
//     this.Count = shard?.Count || data?.count || 1;
//     this.Detail = shard?.Detail || data?.detail || '';
//     if (shard) {
//       this.Features = shard.Features;
//     } else if (data) {
//       this.Features = data.features.map((f) =>
//         NpcFeatureFactory.Build(f.sourceData as INpcFeatureData)
//       );
//     }
//   }

//   public get CountString(): string {
//     if (this.Count === 'hostile_characters') return '# of Hostile Mechs';
//     if (Array.isArray(this.Count)) return this.Count.join('/');
//     return this.Count as string;
//   }

//   public static Serialize(shard: EidolonShardProxy): EidolonShardProxyData {
//     return {
//       count: shard.Count,
//       detail: shard.Detail,
//       features: shard.Features.map((f) => new CompendiumItemInstance(f).Serialize()),
//     };
//   }

//   public static Deserialize(data: EidolonShardProxyData): EidolonShardProxy {
//     return new EidolonShardProxy(undefined, data);
//   }
// }

type EidolonLayerProxyData = {
  id: string;
  name: string;
  hints: string;
  rules: string;
  features: CompendiumItemInstanceData[];
  shards: IEidolonShardData;
};

class EidolonLayerProxy {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Hints: string;
  public readonly Rules: string;
  public readonly Features: NpcFeature[] = [];
  public readonly Shards?: EidolonShard;

  public constructor(layer?: EidolonLayer, data?: EidolonLayerProxyData) {
    this.ID = layer?.ID || data?.id || '';
    this.Name = layer?.Name || data?.name || '';
    this.Hints = layer?.Hints || data?.hints || '';
    this.Rules = layer?.Rules || data?.rules || '';
    if (layer) {
      this.Features = layer.Features;
      this.Shards = layer.Shards;
    } else if (data) {
      this.Features = data.features.map((f) =>
        NpcFeatureFactory.Build(f.sourceData as INpcFeatureData)
      );
      this.Shards = new EidolonShard(data.shards);
    }
  }

  public static Serialize(layer: EidolonLayerProxy): EidolonLayerProxyData {
    let data = {
      id: layer.ID,
      name: layer.Name,
      hints: layer.Hints,
      rules: layer.Rules,
      features: layer.Features.map((f) => new CompendiumItemInstance(f).Serialize()),
    } as EidolonLayerProxyData;

    if (layer.Shards) {
      data.shards = {
        count: layer.Shards.Count,
        detail: layer.Shards.Detail,
        features: layer.Shards.Features.map(
          (f) => new CompendiumItemInstance(f).Serialize().sourceData as INpcFeatureData
        ),
      };
    }

    return data as EidolonLayerProxyData;
  }

  public Serialize(): EidolonLayerProxyData {
    return EidolonLayerProxy.Serialize(this);
  }

  public static Deserialize(data: EidolonLayerProxyData): EidolonLayerProxy {
    return new EidolonLayerProxy(undefined, data);
  }
}

class EidolonLayerInstanceSave implements IInstanceableData {
  instance!: boolean;
  instanceId: string | undefined;
  id!: string;
  description!: string;
  stats!: IStatData;
  layer!: EidolonLayerProxyData;
  shard?: CompendiumItemInstanceData;
}

class EidolonLayerSaveData implements IFeatureContainer {
  public IsInstance: boolean = false;
  public InstanceID?: string;

  public readonly Parent: Eidolon;
  public Layer: EidolonLayer | EidolonLayerProxy;
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
    data:
      | EidolonLayerInstanceSave
      | { id: string; description: string; stats?: IStatData; shard?: IStatData },
    parent: Eidolon
  ) {
    this.Parent = parent;

    this.SaveController = parent.SaveController;
    this.StatController = new StatController(this);
    if (data.stats) StatController.Deserialize(this, data.stats);
    this._description = data.description;

    if (data instanceof EidolonLayerInstanceSave) {
      this.IsInstance = data.instance || false;
      this.InstanceID = data.instanceId;
      this.Layer = EidolonLayerProxy.Deserialize(data.layer);
    } else {
      this.Layer = CompendiumStore().EidolonLayers.find((x) => x.ID === data.id)!;
      if (!data.stats) this._setStats(parent.Tier);
    }

    if (this.Layer.Shards) this.Layer.Shards.Tier = parent.Tier;

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
    if (!this.Layer) return;
    if (this.Layer instanceof EidolonLayerProxy) return;

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
    if (this.Layer instanceof EidolonLayerProxy) return;

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

  public static Serialize(layerSave: EidolonLayerSaveData, asInstance: boolean) {
    let data = {} as any;

    if (asInstance) {
      return {
        instance: true,
        instanceId: layerSave.InstanceID || uuid(),
        id: layerSave.Layer.ID,
        description: layerSave.Description,
        stats: StatController.Serialize(layerSave, layerSave.StatController),
        layer: EidolonLayerProxy.Serialize(layerSave.Layer as EidolonLayerProxy),
      };
    }

    StatController.Serialize(layerSave, data);
    return data.stats;
  }

  public Serialize<EidolonLayerSaveData>(asInstance: boolean = false): EidolonLayerSaveData {
    return EidolonLayerSaveData.Serialize(this, asInstance) as EidolonLayerSaveData;
  }

  public static Deserialize(data: EidolonLayerInstanceSave, parent: Eidolon): EidolonLayerSaveData {
    return new EidolonLayerSaveData(data, parent);
  }
}

export { EidolonLayerSaveData, EidolonLayerProxy, EidolonLayerInstanceSave };
