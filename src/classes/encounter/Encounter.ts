import { v4 as uuid } from 'uuid';
import {
  IPortraitData,
  ISaveData,
  ISaveable,
  PortraitController,
  SaveController,
} from '../components';
import { ISitrepData, Sitrep } from './Sitrep';
import { EncounterMap, IMapData } from './Map';
import { FolderController, IFolderData } from '../components/folder/FolderController';
import { NarrativeController, NarrativeElementData } from '../narrative/NarrativeController';
import { IFolderPlaceable } from '../components/folder/IFolderPlaceable';
import { INarrativeElement } from '../narrative/INarrativeElement';
import { ImageTag } from '@/io/ImageManagement';
import { IEnvironmentData } from '../Environment';

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
  sitrep: ISitrepData;
  environment: IEnvironmentData;
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

  // public Sitrep: Sitrep;
  // public EnvironmentData: EnvironmentData;
  public Map?: EncounterMap;

  public ImageTag: ImageTag = ImageTag.Map;
  public SaveController: SaveController;
  public PortraitController: PortraitController;
  public NarrativeController: NarrativeController;
  public FolderController: FolderController;

  public constructor(data?: IEncounterData) {
    this._id = data?.id || uuid();
    this._note = data?.note || '';
    this._description = data?.description || '';
    this._gmDescription = data?.gmDescription || '';

    // this.Sitrep = new Sitrep(data?.sitrep);
    // this.EnvironmentData = new EnvironmentData(data?.environment);
    // this.Map = data?.map ? new EncounterMap(data.map) : undefined;

    this.SaveController = new SaveController(this);
    this.PortraitController = new PortraitController(this);
    this.NarrativeController = new NarrativeController(this);
    this.FolderController = new FolderController(this);
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait;
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

  public get Note(): string {
    return this._note;
  }

  public set Note(val: string) {
    this._note = val;
    this.SaveController.save();
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(val: string) {
    this._description = val;
    this.SaveController.save();
  }

  public get GmDescription(): string {
    return this._gmDescription;
  }

  public set GmDescription(val: string) {
    this._gmDescription = val;
    this.SaveController.save();
  }

  public static Serialize(enc: Encounter): IEncounterData {
    const data = {
      id: enc.ID,
      name: enc.Name,
      note: enc.Note,
      description: enc.Description,
      gmDescription: enc.GmDescription,
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
    return new Encounter(data);
  }
}

export { Encounter };
export type { IEncounterData };
