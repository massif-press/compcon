import { getImagePath, ImageTag } from '@/io/ImageManagement';
import { v4 as uuid } from 'uuid';
import { ItemType } from '../enums';
import {
  IRollableTableData,
  RollableTable,
} from '../components/narrative/elements/RollableTable';
import { Clock, IClockData } from '../components/narrative/elements/Clock';
import {
  IPortraitContainer,
  IPortraitData,
  ISaveable,
  ISaveData,
  PortraitController,
  SaveController,
} from '../components';
import {
  NarrativeController,
  NarrativeElementData,
} from '../components/narrative/NarrativeController';
import { INarrativeElement } from '../components/narrative/INarrativeElement';

interface ISectionData {
  header: string;
  body: string;
}

class ICollectionItemData {
  save!: ISaveData;
  img!: IPortraitData;
  narrative!: NarrativeElementData;

  campaign!: string;
  id!: string;
  name!: string;
  description!: string;
  notes!: string;
  campaigns!: string[];
  labels!: string[];
}

abstract class CollectionItem
  implements ISaveable, INarrativeElement, IPortraitContainer
{
  public ID: string;
  private _name: string;
  private _description: string;
  private _notes: string;
  public ItemType!: ItemType;
  public SaveController: SaveController;
  public ImageTag!: ImageTag;
  public NarrativeController: NarrativeController;
  public PortraitController: PortraitController;

  public constructor() {
    this.ID = uuid();
    this._name = '';
    this._description = '';
    this._notes = '';
    this.SaveController = new SaveController(this);
    this.NarrativeController = new NarrativeController(this);
    this.PortraitController = new PortraitController(this);
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

  public get Notes(): string {
    return this._notes;
  }

  public set Notes(val: string) {
    this._notes = val;
    this.SaveController.save();
  }

  public RenewID() {
    this.ID = uuid();
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait;
  }

  public Clone(): ISaveable {
    return null as any;
  }
}

export { ICollectionItemData, CollectionItem };
