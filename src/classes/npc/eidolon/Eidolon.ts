import { CloudController, SaveController, PortraitController } from '@/classes/components';
import { BrewController } from '@/classes/components/brew/BrewController';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { EidolonLayer, EidolonLayerData } from './EidolonLayer';
import { Npc, NpcData } from '../Npc';

class EidolonData extends NpcData {
  npcType: 'eidolon' = 'eidolon';
  layers!: EidolonLayerData[];
  activeLayerIndex!: number;
}

class Eidolon extends Npc {
  public readonly ItemType: string = 'eidolon';

  public Layers: EidolonLayer[];
  public ActiveLayerIndex: number = 0;

  public constructor(data: EidolonData) {
    super();
    this.Layers = data.layers ? data.layers.map((l) => EidolonLayer.Deserialize(l, this)) : [];
    this.ActiveLayerIndex = data.activeLayerIndex || 0;

    this.Name = data._name || `New Eidolon`;
  }

  public get ActiveLayer(): EidolonLayer {
    return this.Layers[this.ActiveLayerIndex];
  }

  public static Serialize(eidolon: Eidolon): EidolonData {
    let data = {
      npcType: 'eidolon',
      id: eidolon.ID,
      name: eidolon.Name,
      note: eidolon.Note,
    };

    SaveController.Serialize(eidolon, data);
    CloudController.Serialize(eidolon, data);
    PortraitController.Serialize(eidolon, data);
    BrewController.Serialize(eidolon, data);
    NarrativeController.Serialize(eidolon, data);

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
