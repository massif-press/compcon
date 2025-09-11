import { SaveController } from '@/classes/components';
import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { CompendiumStore } from '@/stores';
import { Eidolon } from './Eidolon';
import { EidolonLayer, IEidolonLayerData } from './EidolonLayer';
import { FeatureController } from '@/classes/components/feature/FeatureController';
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { INpcFeatureData, NpcFeature } from '../feature/NpcFeature';
import { CombatController } from '@/classes/components/combat/CombatController';

class EidolonLayerSaveData implements IFeatureContainer {
  public readonly Parent: Eidolon;
  public readonly ID: string;
  public readonly Name: string;
  public Layer: EidolonLayer;
  public SaveController: SaveController;
  public FeatureController: FeatureController;
  public CombatController: CombatController;

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
    this.ID = data.id;
    this.Name = data.data.name || data.id;

    this.SaveController = parent.SaveController;
    this.CombatController = new CombatController(this);

    if (data.stats) StatController.Deserialize(this, data.stats);
    this._description = data.description;

    this.Layer =
      CompendiumStore().EidolonLayers.find((x) => x.ID === data.id) || new EidolonLayer(data.data);

    if (!data.stats) this._setStats(parent.Tier);

    if (this.Layer.Shards) this.Layer.Shards.Tier = parent.Tier;

    this.FeatureController = new FeatureController(this);
    this.FeatureController.Register(this);
  }

  public get StatController(): StatController {
    return this.CombatController.StatController;
  }

  public get Tier(): number {
    return this.Parent.Tier;
  }

  public SetStats(): void {
    const tier = this.Parent.Tier;
    const kvps = Object.keys(this.Layer.Stats.AllStats(tier)).map((s) => ({
      key: s,
      val: this.Layer.Stats.AllStats(tier)[s],
    }));

    this.CombatController.setStats(kvps);
  }

  public ResetHp(playerCount: number, reset: boolean = false) {
    const maxHp = this.Layer.HpPerPlayer * playerCount;
    this.StatController.setMax('hp', maxHp);
    if (reset) this.StatController.CurrentStats['hp'] = maxHp;
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
