import { v4 as uuid } from 'uuid';
import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { CloudController, PortraitController, SaveController } from '../../components';
import { NpcData, Npc } from '../Npc';
import { BrewController } from '@/classes/components/brew/BrewController';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import { FolderController } from '@/classes/components/folder/FolderController';
import { IInstanceableData } from '@/classes/components/instance/IInstancableData';
import { IInstanceable } from '@/classes/components/instance/IInstanceable';
import { NpcStore } from '@/stores';

class DoodadData extends NpcData implements IInstanceableData {
  npcType: 'unit' = 'unit';
  is_instance: boolean = false;
  instanceId?: string;

  stats!: IStatData;
}

class Doodad extends Npc implements IStatContainer, IInstanceable {
  public IsInstance: boolean;
  public InstanceID?: string;

  public StatController: StatController;
  public ItemType: string = 'Doodad';
  public MandatoryStats: string[] = [];

  public constructor(data?: DoodadData) {
    super(data);

    this.IsInstance = data?.is_instance || false;
    this.InstanceID = data?.instanceId;

    this._name = data?.name || 'New Doodad';
    this.StatController = new StatController(this);
    this.CloudController = new CloudController(this);
  }

  public CreateInstance<DoodadData>(): DoodadData {
    const data = this.Serialize(true) as DoodadData;
    this.SetInstanceProxies<DoodadData>(data);
    (data as any).instanceId = uuid();

    return data;
  }

  SetInstanceProxies<T>(dd: T) {
    // unnecessary for doodads
  }

  public get IsLinked(): boolean {
    return this.GetLinkedItem<Npc>() !== undefined;
  }

  public GetLinkedItem<Npc>(): Npc {
    return NpcStore().getNpcByID(this.ID);
  }

  public static Serialize(doodad: Doodad, asInstance: boolean): DoodadData {
    let data = {
      npcType: 'doodad',
      id: doodad.ID,
      instance: doodad.IsInstance || asInstance,
      instanceId: doodad.InstanceID,
      description: doodad.Description,
      gmDescription: doodad.GmDescription,
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

  public Serialize<DoodadData>(asInstance: boolean = false): DoodadData {
    return Doodad.Serialize(this, asInstance) as DoodadData;
  }

  public static Deserialize(data: DoodadData): Doodad {
    const doodad = new Doodad(data);
    SaveController.Deserialize(doodad, data.save);
    BrewController.Deserialize(doodad, data);
    PortraitController.Deserialize(doodad, data.img);
    NarrativeController.Deserialize(doodad, data.narrative);
    StatController.Deserialize(doodad, data.stats);
    FolderController.Deserialize(doodad, data.folder);
    return doodad;
  }

  public Clone<Doodad>(): Doodad {
    const itemData = Doodad.Serialize(this, false);
    const newItem = Doodad.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Doodad;
  }

  public get Icon(): string {
    return 'mdi-cube-outline';
  }

  public get TagIcon(): string {
    return 'mdi-cube-outline';
  }
}

export { DoodadData, Doodad };
