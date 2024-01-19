import { Npc } from '@/class';
import { BrewController } from '@/classes/components/brew/BrewController';
import { EidolonShard, EidolonShardData } from './EidolonShard';
import { Eidolon } from './Eidolon';
import { SaveController, CloudController, PortraitController } from '@/classes/components';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { NpcData } from '../Npc';

class EidolonLayerData extends NpcData {
  index!: number;
  shards!: EidolonShardData[];
}

class EidolonLayer extends Npc {
  public readonly Parent: Eidolon;
  public readonly ItemType: string = 'eidolon_layer';
  public readonly Required: boolean = false;

  public LayerIndex: number;
  public ActiveShards: EidolonShard[] = [];

  public constructor(parent: Eidolon, data: EidolonLayerData) {
    super();
    this.Parent = parent;
    this.ActiveShards = data.shards
      ? data.shards.map((s) => EidolonShard.Deserialize(s, this))
      : [];
    this.LayerIndex = data.index;
    if (data.index === 0) this.Required = true;

    this.Name = data._name || `New Eidolon Layer`;
  }

  public get Active(): boolean {
    return this.LayerIndex === this.Parent.ActiveLayerIndex;
  }

  public static Serialize(e: EidolonLayer): EidolonLayerData {
    let data = {
      id: e.ID,
      name: e.Name,
      note: e.Note,
      index: e.LayerIndex,
      shards: e.ActiveShards.map((s) => EidolonShard.Serialize(s)),
    };

    SaveController.Serialize(e, data);
    CloudController.Serialize(e, data);
    PortraitController.Serialize(e, data);
    BrewController.Serialize(e, data);
    NarrativeController.Serialize(e, data);

    return data as EidolonLayerData;
  }

  public Serialize<EidolonLayerData>(): EidolonLayerData {
    return EidolonLayer.Serialize(this) as EidolonLayerData;
  }

  public static Deserialize(data: EidolonLayerData, parent: Eidolon): EidolonLayer {
    return new EidolonLayer(parent, data);
  }

  public Clone<EidolonLayer>(): EidolonLayer {
    const itemData = EidolonLayer.Serialize(this);
    const newItem = EidolonLayer.Deserialize(itemData, this.Parent);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as EidolonLayer;
  }
}

export { EidolonLayer, EidolonLayerData };
