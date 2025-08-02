import { v4 as uuid } from 'uuid';
import { CloudController, PortraitController, SaveController } from '../../components';
import { NpcData, Npc } from '../Npc';
import { BrewController } from '@/classes/components/brew/BrewController';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { FolderController } from '@/classes/components/folder/FolderController';
import { IInstanceableData } from '@/classes/components/instance/IInstancableData';
import { IInstanceable } from '@/classes/components/instance/IInstanceable';
import { NpcStore } from '@/stores';
import { CombatController } from '@/classes/components/combat/CombatController';
import { ICombatant } from '@/classes/components/combat/ICombatant';
import { StatController } from '@/classes/components/combat/stats/StatController';
import { Stats } from '@/classes/components/combat/stats/Stats';

class DoodadData extends NpcData implements IInstanceableData {
  npcType: 'unit' = 'unit';
  combat_data: any = {};
}

class Doodad extends Npc implements ICombatant, IInstanceable {
  public InstanceID?: string;

  public CombatController: CombatController;
  public ItemType: string = 'Doodad';
  public MandatoryStats: string[] = [];

  public constructor(data?: DoodadData) {
    super(data);

    this.InstanceID = data?.instanceId;

    this._name = data?.name || 'New Doodad';
    this.CombatController = new CombatController(this);
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

  public get StatController(): StatController {
    return this.CombatController.StatController;
  }

  private _getStats(): any {
    const kvps = [] as { key: string; val: number }[];

    const allStats = Object.keys({
      ...this.StatController.MaxStats,
    });

    allStats.forEach((key) => {
      let statVal = Stats.DefaultStats[key];
      kvps.push({ key, val: statVal });
    });
    kvps.push({ key: 'burn', val: 0 });
    return kvps;
  }

  public SetStats() {
    this.CombatController.setStats(this._getStats());
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
    CombatController.Serialize(doodad.CombatController, data);
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
    CombatController.Deserialize(doodad.CombatController, data.combat_data);
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

  public get SizeIcon(): string {
    return `cc:size_${this.StatController.getStat('size') || 1}`;
  }
}

export { DoodadData, Doodad };
