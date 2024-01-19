import { BrewController } from '@/classes/components/brew/BrewController';
import { EidolonLayer } from './EidolonLayer';
import { Npc, NpcData } from '../Npc';
import { SaveController, CloudController, PortraitController } from '@/classes/components';
import { NarrativeController } from '@/classes/narrative/NarrativeController';

class EidolonShardData extends NpcData {}

class EidolonShard extends Npc {
  public readonly ItemType: string = 'eidolon_shard';
  public readonly Parent: EidolonLayer;

  public constructor(data: EidolonShardData, parent: EidolonLayer) {
    super();
    this.Parent = parent;

    this.Name = data._name || `New Eidolon Shard`;
  }

  public static Serialize(e: EidolonShard): EidolonShardData {
    let data = {
      id: e.ID,
      name: e.Name,
      note: e.Note,
    };

    SaveController.Serialize(e, data);
    CloudController.Serialize(e, data);
    PortraitController.Serialize(e, data);
    BrewController.Serialize(e, data);
    NarrativeController.Serialize(e, data);

    return data as EidolonShardData;
  }

  public Serialize<EidolonShardData>(): EidolonShardData {
    return EidolonShard.Serialize(this) as EidolonShardData;
  }

  public static Deserialize(data: EidolonShardData, parent: EidolonLayer): EidolonShard {
    return new EidolonShard(data, parent);
  }

  public Clone<EidolonShard>(): EidolonShard {
    const itemData = EidolonShard.Serialize(this);
    const newItem = EidolonShard.Deserialize(itemData, this.Parent);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as EidolonShard;
  }
}

export { EidolonShard, EidolonShardData };
