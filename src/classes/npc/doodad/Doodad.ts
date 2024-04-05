import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { CloudController, PortraitController, SaveController } from '../../components';
import { NpcData, Npc } from '../Npc';
import { BrewController } from '@/classes/components/brew/BrewController';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import { FolderController } from '@/classes/components/folder/FolderController';

class DoodadData extends NpcData {
  npcType: 'doodad' = 'doodad';
  stats!: IStatData;
}

class Doodad extends Npc implements IStatContainer {
  public StatController: StatController;
  public ItemType: string = 'doodad';
  public MandatoryStats: string[] = [];

  public constructor(data?: DoodadData) {
    super(data);
    this._name = data?.name || 'New Doodad';
    this.StatController = new StatController(this);
  }

  public static Serialize(doodad: Doodad): DoodadData {
    let data = {
      npcType: 'doodad',
      id: doodad.ID,
      name: doodad.Name,
      note: doodad.Note,
    };

    SaveController.Serialize(doodad, data);
    CloudController.Serialize(doodad, data);
    PortraitController.Serialize(doodad, data);
    BrewController.Serialize(doodad, data);
    NarrativeController.Serialize(doodad, data);
    StatController.Serialize(doodad, data);
    FolderController.Serialize(doodad, data);

    return data as DoodadData;
  }

  public Serialize<DoodadData>(): DoodadData {
    return Doodad.Serialize(this) as DoodadData;
  }

  public static Deserialize(data: DoodadData): Doodad {
    const doodad = new Doodad(data);
    SaveController.Deserialize(doodad, data.save);
    PortraitController.Deserialize(doodad, data.img);
    BrewController.Deserialize(doodad, data);
    NarrativeController.Deserialize(doodad, data.narrative);
    StatController.Deserialize(doodad, data.stats);
    FolderController.Deserialize(doodad, data.folder);
    return doodad;
  }

  public Clone<Doodad>(): Doodad {
    const itemData = Doodad.Serialize(this);
    const newItem = Doodad.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Doodad;
  }

  public get Icon(): string {
    return 'mdi-cube-outline';
  }
}

export { DoodadData, Doodad };
