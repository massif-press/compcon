import { ImageTag } from '@/io/ImageManagement';
import { v4 as uuid } from 'uuid';
import {
  CloudController,
  ICloudData,
  ICloudSyncable,
  IPortraitContainer,
  IPortraitData,
  ISaveable,
  ISaveData,
  PortraitController,
  SaveController,
} from '../components';
import { NarrativeController, NarrativeElementData } from './NarrativeController';
import { INarrativeElement } from './INarrativeElement';
import { FolderController, IFolderData } from '../components/folder/FolderController';
import { IFolderPlaceable } from '../components/folder/IFolderPlaceable';

interface ISectionData {
  header: string;
  body: string;
}

class ICollectionItemData {
  protected collectionItemType: string = 'collection-item';
  id!: string;
  save!: ISaveData;
  cloud!: ICloudData;
  img!: IPortraitData;
  narrative!: NarrativeElementData;
  folder!: IFolderData;
  name!: string;
  note!: string;
  description!: string;
}

abstract class CollectionItem
  implements
    INarrativeElement,
    ICloudSyncable,
    ISaveable,
    IPortraitContainer,
    IFolderPlaceable,
    ICloudSyncable
{
  public readonly StorageType: string = 'narrative';
  public readonly DataType: string = 'savedata';
  public ItemType: string = 'collectionitem';

  public ImageTag!: ImageTag.NPC;
  public CloudController!: CloudController;
  public SaveController: SaveController;
  public PortraitController: PortraitController;
  public NarrativeController: NarrativeController;
  public FolderController: FolderController;

  private _id: string;
  protected _name: string = 'New Narrative Item';
  private _note: string = '';
  private _description: string = '';
  static ID: string;
  static Name: string;

  public constructor(data?: ICollectionItemData) {
    this._id = data?.id || uuid();
    this._note = data?.note || '';
    this._description = data?.description || '';
    this.SaveController = new SaveController(this);
    this.PortraitController = new PortraitController(this);
    this.NarrativeController = new NarrativeController(this);
    this.FolderController = new FolderController(this);
  }

  // -- Passthroughs ------------------------------------------------------------------------------

  public get Portrait(): string {
    return this.PortraitController.Portrait;
  }

  // -------------------------------------------------------------------------------------------------

  public get ID(): string {
    return this._id;
  }

  public RenewID(): void {
    this._id = uuid();
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(val: string) {
    this._name = val;
    this.SaveController.save();
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(val: string) {
    this._description = val;
    this.SaveController.save();
  }

  public get Note(): string {
    return this._note;
  }

  public set Note(val: string) {
    this._note = val;
    this.SaveController.save();
  }

  public Clone<T>(): T {
    throw new Error('Method inaccessible in abstract class.');
  }

  public Serialize<T>(): T {
    throw new Error('Method inaccessible in abstract class.');
  }

  public Deserialize<T>(): T {
    throw new Error('Method inaccessible in abstract class.');
  }
}

export { ICollectionItemData, CollectionItem };
export type { ISectionData };
