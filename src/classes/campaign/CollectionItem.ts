import { getImagePath, ImageTag } from '@/io/ImageManagement'
import uuid from 'uuid/v4'
import { ItemType } from "../enums"
import { Clock, IClockData } from './Clock'
import { IRollableTableData, RollableTable } from './RollableTable'

interface ISectionData {
  header: string
  body: string
}

interface ICollectionItemData {
  id?: string
  name?: string
  description?: string
  notes?: string
  image?: string
  sections?: ISectionData[]
  campaigns?: string[]
  locations?: string[]
  factions?: string[]
  npcs?: string[]
  labels?: string[]
  clocks?: IClockData[]
  tables?: IRollableTableData[]
}

abstract class CollectionItem {
  public ID: string
  protected img: string
  public Name: string
  public Description: string
  public Notes: string
  public Sections: ISectionData[]
  public Campaigns: string[]
  public Locations: string[]
  public Factions: string[]
  public NPCs: string[]
  public Labels: string[]
  public Clocks: Clock[]
  public Tables: RollableTable[]
  public ItemType: ItemType

  public constructor(data?: ICollectionItemData) {
    this.ID = data?.id || uuid()
    this.img = data?.image || ''
    this.Name = data?.name || ''
    this.Description = data?.description || ''
    this.Notes = data?.notes || ''
    this.Sections = data?.sections || []
    this.Campaigns = data?.campaigns || []
    this.Locations = data?.locations || []
    this.Factions = data?.factions || []
    this.NPCs = data?.npcs || []
    this.Labels = data?.labels || []
    this.Clocks = data?.clocks ? data.clocks.map(c => new Clock(c)) : []
    this.Tables = data?.tables ? data.tables.map(t => new RollableTable(t)) : []
  }

  public RenewID() {
    this.ID = uuid()
  }

  public get Image(): string {
    if (this.img) return this.img
    else return getImagePath(ImageTag.Pilot, 'nodata.png')
  }

  public set Image(src: string) {
    this.img = src
  }
}

export {
  ICollectionItemData,
  CollectionItem
}