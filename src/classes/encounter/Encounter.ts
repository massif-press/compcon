import { v4 as uuid } from 'uuid';
import {
  IPortraitData,
  ISaveData,
  ISaveable,
  PortraitController,
  SaveController,
} from '../components';
import { ISitrepData, Sitrep, SitrepInstance } from './Sitrep';
import { EncounterMap, IMapData } from './EncounterMap';
import { FolderController, IFolderData } from '../components/folder/FolderController';
import { NarrativeController, NarrativeElementData } from '../narrative/NarrativeController';
import { IFolderPlaceable } from '../components/folder/IFolderPlaceable';
import { INarrativeElement } from '../narrative/INarrativeElement';
import { ImageTag } from '@/io/ImageManagement';
import { Environment, EnvironmentInstance, IEnvironmentData } from '../Environment';

interface IEncounterData {
  id: string;
  name: string;
  note?: string;
  description?: string;
  gmDescription?: string;
  save: ISaveData;
  folder: IFolderData;
  img: IPortraitData;
  narrative: NarrativeElementData;
  sitrep?: ISitrepData;
  environment?: IEnvironmentData;
  map?: IMapData;
}

class Encounter implements INarrativeElement, ISaveable, IFolderPlaceable {
  public readonly ItemType: string = 'encounter';
  public readonly StorageType: string = 'encounters';

  private _id: string;
  protected _name: string = 'New Encounter';

  private _note: string;
  private _description: string;
  private _gmDescription: string;
  private _sitrep?: SitrepInstance;
  private _environment?: EnvironmentInstance;

  // public Sitrep: Sitrep;
  // public EnvironmentData: EnvironmentData;
  public _map?: EncounterMap;

  public ImageTag: ImageTag = ImageTag.Map;
  public SaveController: SaveController;
  public PortraitController: PortraitController;
  public NarrativeController: NarrativeController;
  public FolderController: FolderController;

  public constructor(data?: IEncounterData) {
    this._id = data?.id || uuid();
    this._name = data?.name || 'New Encounter';
    this._note = data?.note || '';
    this._description = data?.description || '';
    this._gmDescription = data?.gmDescription || '';

    if (data?.sitrep) {
      this._sitrep = new SitrepInstance(this, new Sitrep(data.sitrep));
    }

    if (data?.environment) {
      this._environment = new EnvironmentInstance(this, new Environment(data.environment));
    }

    if (data?.map) {
      this._map = EncounterMap.Deserialize(data.map);
    }

    this.SaveController = new SaveController(this);
    this.PortraitController = new PortraitController(this);
    this.NarrativeController = new NarrativeController(this);
    this.FolderController = new FolderController(this);
  }

  public save(): void {
    this.SaveController.save();
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait;
  }

  public get ID(): string {
    return this._id;
  }

  public RenewID(): void {
    this._id = uuid();
    this.save();
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(val: string) {
    this._name = val;
    this.save();
  }

  public get Note(): string {
    return this._note;
  }

  public set Note(val: string) {
    this._note = val;
    this.save();
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(val: string) {
    this._description = val;
    this.save();
  }

  public get GmDescription(): string {
    return this._gmDescription;
  }

  public set GmDescription(val: string) {
    this._gmDescription = val;
    this.save();
  }

  public get Sitrep(): SitrepInstance {
    if (!this._sitrep) {
      this._sitrep = new SitrepInstance(this);
    }
    return this._sitrep;
  }

  public set Sitrep(val: SitrepInstance) {
    this._sitrep = val;
    this.save();
  }

  public get Environment(): EnvironmentInstance {
    if (!this._environment) {
      this._environment = new EnvironmentInstance(this);
    }

    return this._environment;
  }

  public set Environment(val: EnvironmentInstance) {
    this._environment = val;
    this.save();
  }

  public get Map(): EncounterMap | undefined {
    return this._map;
  }

  public set Map(val: EncounterMap | undefined) {
    this._map = val;
    this.save();
  }

  public static Serialize(enc: Encounter): IEncounterData {
    const data = {
      id: enc.ID,
      name: enc.Name,
      note: enc.Note,
      description: enc.Description,
      gmDescription: enc.GmDescription,
      sitrep: SitrepInstance.Serialize(enc.Sitrep),
      environment: EnvironmentInstance.Serialize(enc.Environment),
      map: enc.Map ? EncounterMap.Serialize(enc.Map) : undefined,
    } as IEncounterData;

    SaveController.Serialize(enc, data);
    PortraitController.Serialize(enc, data);
    NarrativeController.Serialize(enc, data);
    FolderController.Serialize(enc, data);

    return data as IEncounterData;
  }

  public Serialize(): IEncounterData {
    return Encounter.Serialize(this);
  }

  public Clone(): Encounter {
    return Encounter.Deserialize(Encounter.Serialize(this));
  }

  public static Deserialize(data: IEncounterData): Encounter {
    console.log(data);
    const encounter = new Encounter(data);
    SaveController.Deserialize(encounter, data.save);
    PortraitController.Deserialize(encounter, data.img);
    NarrativeController.Deserialize(encounter, data.narrative);
    FolderController.Deserialize(encounter, data.folder);
    return encounter;
  }
}

export { Encounter };
export type { IEncounterData };
