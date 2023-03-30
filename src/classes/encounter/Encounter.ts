import { v4 as uuid } from 'uuid';
import { Npc } from '@/class';
import { CompendiumStore } from '@/stores';
import { ISaveData, SaveController } from '../components';
import { INpcData } from '../npc/Npc';
import { ISitrepData, SitrepData } from './Sitrep';
import { IEnvironmentData, EnvironmentData } from './EnvironmentData';
import { EncounterMap, IMapData } from './Map';

class IEncounterData {
  id: string;
  lastModified: string;
  name: string;
  npcs: INpcData[];
  sitrep: ISitrepData;
  environment: IEnvironmentData;
  map?: IMapData;

  save: ISaveData;
}

class Encounter {
  public readonly ItemType: string = 'encounter';
  public SaveController: SaveController;
  public IsDirty: boolean;
  public LastModified: string;

  public Sitrep: SitrepData;
  public EnvironmentData: EnvironmentData;
  public Map?: EncounterMap;

  private _npcData: [];
  public InstancedNpcs: [];

  private _id: string;
  private _name: string;
  private _labels: string[];

  public constructor() {
    this._id = uuid();
    this.SaveController = new SaveController(this);
    this.Sitrep = new SitrepData();
    this.EnvironmentData = new EnvironmentData();
    this._name = 'New Encounter';
    this._labels = [];

    this._npcData = [];
    this.InstancedNpcs = [];
  }

  public get ID(): string {
    return this._id;
  }

  public RenewID(): void {
    this._id = uuid();
    this.SaveController.save();
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(val: string) {
    this._name = val;
    this.SaveController.save();
  }

  public get Labels(): string[] {
    return this._labels;
  }

  public set Labels(val: string[]) {
    this._labels = val;
    this.SaveController.save();
  }

  // this should return npc data when editing and instanced npcs when running
  public Npcs(): Npc[] {
    const npcs = [];

    return npcs;
  }

  // these should add/rem from encounter template when editing, and reinforcements when running
  public AddNpc() {}
  public RemoveNpc() {}

  // find npc data by id, update
  public UpdateNpcs() {}

  public static Serialize(enc: Encounter): IEncounterData {
    const data = {
      id: enc.ID,
      name: enc.Name,
      labels: enc.Labels,
    };
    SaveController.Serialize(enc, data);

    return data as IEncounterData;
  }

  public Serialize(): IEncounterData {
    return Encounter.Serialize(this);
  }

  public Clone(): Encounter {
    return Encounter.Deserialize(Encounter.Serialize(this));
  }

  public Update(data: IEncounterData): void {
    this._id = data.id;
    this._name = data.name;
    // this._sitrep = data.sitrep
  }

  public static Deserialize(data: IEncounterData): Encounter {
    const e = new Encounter();
    try {
      e.Update(data);
      SaveController.Deserialize(e, data.save);
      e.SaveController.SetLoaded();
      return e;
    } catch (err) {
      console.error(err);
    }
  }
}

export { Encounter, IEncounterData };
