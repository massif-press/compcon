import { CloudController, SaveController, PortraitController } from '@/classes/components';
import { BrewController } from '@/classes/components/brew/BrewController';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { Npc, NpcData } from '../Npc';
import { CompendiumStore } from '@/stores';
import { IStatData } from '@/classes/components/combat/stats/StatController';
import { EidolonLayerSaveData } from './EidolonLayerSaveData';
import { EidolonShardSaveData } from './EidolonShardSaveData';
import { FolderController } from '@/classes/components/folder/FolderController';

class EidolonData extends NpcData {
  npcType: 'eidolon' = 'eidolon';
  tier!: number;
  layer_data!: {
    id: string;
    description: string;
    stats: IStatData;
    shard: IStatData;
  }[];
}

class Eidolon extends Npc {
  public readonly ItemType: string = 'Eidolon';
  private _tier: number;

  private _layers: EidolonLayerSaveData[];

  public constructor(data?: EidolonData) {
    super(data);
    this._name = data?.name || 'New Eidolon';

    this._tier = data?.tier || 1;

    this._layers = [];
    if (data?.layer_data) {
      this._layers = data.layer_data.map((l) => new EidolonLayerSaveData(l, this));
    }

    if (!data || this._layers.length === 0)
      this._layers.push(new EidolonLayerSaveData({ id: 'el_core', description: '' }, this));
  }

  public get Tier(): number {
    return this._tier;
  }

  public set Tier(newTier: number) {
    this._tier = newTier;

    this._layers.forEach((l) => {
      l.ResetStats();
      l.Shard.ResetStats();
    });

    this.SaveController.save();
  }

  public get Class() {
    const l = this._layers.length - 1;
    if (l < 3) return '0';
    if (l > 5) return '3+';
    return (l - 2).toString();
  }

  public get Layers(): EidolonLayerSaveData[] {
    return this._layers;
  }

  public AddLayer(id: string) {
    this._layers.push(new EidolonLayerSaveData({ id, description: '' }, this));
  }

  public AddRandomLayer() {
    const availableLayers = CompendiumStore().EidolonLayers.filter(
      (l) => !this._layers.some((x) => x.Layer.ID === l.ID)
    );
    const l = availableLayers[Math.floor(Math.random() * availableLayers.length)];
    if (l) this._layers.push(new EidolonLayerSaveData({ id: l.ID, description: '' }, this));
  }

  public RemoveLayer(index: number) {
    if (index > -1) this._layers.splice(index, 1);
  }

  public static Serialize(eidolon: Eidolon): EidolonData {
    let data = {
      npcType: 'eidolon',
      id: eidolon.ID,
      name: eidolon.Name,
      note: eidolon.Note,
      tier: eidolon.Tier,
      layer_data: [] as { id: string; description: string; stats: IStatData; shard: IStatData }[],
    };

    eidolon._layers.forEach((layer) => {
      data.layer_data.push({
        id: layer.Layer.ID,
        description: layer.Description,
        stats: EidolonLayerSaveData.Serialize(layer),
        shard: EidolonShardSaveData.Serialize(layer.Shard),
      });
    });

    SaveController.Serialize(eidolon, data);
    CloudController.Serialize(eidolon, data);
    PortraitController.Serialize(eidolon, data);
    BrewController.Serialize(eidolon, data);
    NarrativeController.Serialize(eidolon, data);
    FolderController.Serialize(eidolon, data);

    return data as EidolonData;
  }

  public Serialize<EidolonData>(): EidolonData {
    return Eidolon.Serialize(this) as EidolonData;
  }

  public static Deserialize(data: EidolonData): Eidolon {
    const eidolon = new Eidolon(data);
    SaveController.Deserialize(eidolon, data.save);
    PortraitController.Deserialize(eidolon, data.img);
    BrewController.Deserialize(eidolon, data);
    NarrativeController.Deserialize(eidolon, data.narrative);
    FolderController.Deserialize(eidolon, data.folder);
    return eidolon;
  }

  public Clone<Eidolon>(): Eidolon {
    const itemData = Eidolon.Serialize(this);
    const newItem = Eidolon.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Eidolon;
  }
}

export { Eidolon, EidolonData };
