import { getImagePath, ImageTag } from '@/io/ImageManagement'
import uuid from 'uuid/v4'
import { ItemType } from '../enums'
import { IRollableTableData, RollableTable } from '../components/narrative/elements/RollableTable'
import { Clock, IClockData } from '../components/narrative/elements/Clock'
import {
  IPortraitContainer,
  IPortraitData,
  ISaveable,
  ISaveData,
  PortraitController,
  SaveController,
} from '../components'
import {
  NarrativeController,
  NarrativeElementData,
} from '../components/narrative/NarrativeController'
import { INarrativeElement } from '../components/narrative/INarrativeElement'

interface ISectionData {
  header: string
  body: string
}

class ICollectionItemData implements ISaveData, NarrativeElementData, IPortraitData {
  campaign: string
  portrait: string
  cloud_portrait: string
  clocks: IClockData[]
  tables: IRollableTableData[]
  lastModified: string
  isDeleted: boolean
  expireTime: string
  deleteTime: string
  textItems: { title: string; body: string }[]
  id: string
  name: string
  description: string
  notes: string
  image: string
  campaigns: string[]
  labels: string[]
}

abstract class CollectionItem implements ISaveable, INarrativeElement, IPortraitContainer {
  public ID: string
  public Name: string
  public Description: string
  public Notes: string
  public ItemType: ItemType
  public SaveController: SaveController
  public ImageTag: ImageTag
  public NarrativeController: NarrativeController
  public PortraitController: PortraitController

  public constructor() {
    this.ID = uuid()
    this.Name = ''
    this.Description = ''
    this.Notes = ''
    this.SaveController = new SaveController(this)
    this.NarrativeController = new NarrativeController(this)
    this.PortraitController = new PortraitController(this)
  }

  public RenewID() {
    this.ID = uuid()
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait
  }
}

export { ICollectionItemData, CollectionItem }
