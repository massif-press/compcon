import { getActivePinia } from 'pinia'
import { i18n } from '@/i18n'
import { ImageTag } from '@/io/ImageManagement'
import { v4 as uuid } from 'uuid'
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
} from '../components'
import { NarrativeController, NarrativeElementData } from './NarrativeController'
import { INarrativeElement } from './INarrativeElement'
import { FolderController, IFolderData } from '../components/folder/FolderController'
import { IFolderPlaceable } from '../components/folder/IFolderPlaceable'
import { ItemType } from '../enums'
interface ISectionData {
  header: string
  body: string
}

class ICollectionItemData {
  protected collectionItemType: string = 'collection-item'
  id!: string
  save!: ISaveData
  cloud!: ICloudData
  img!: IPortraitData
  narrative!: NarrativeElementData
  folder!: IFolderData
  name!: string
  note!: string
  description!: string
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
  public readonly StorageType: string = 'narrative'
  public readonly DataType: string = 'savedata'
  public ItemType: ItemType = ItemType.CollectionItem

  public ImageTag!: ImageTag.NPC
  public CloudController!: CloudController
  public SaveController: SaveController
  public PortraitController: PortraitController
  public NarrativeController: NarrativeController
  public FolderController: FolderController

  private _id: string
  protected _name: string = i18n.global.t('classes.newNarrativeItem')
  private _note: string = ''
  private _description: string = ''
  static ID: string
  static Name: string

  public constructor(data?: ICollectionItemData) {
    this._id = data?.id || uuid()
    this._note = data?.note || ''
    this._description = data?.description || ''
    this.SaveController = new SaveController(this)
    this.PortraitController = new PortraitController(this)
    this.NarrativeController = new NarrativeController(this)
    this.FolderController = new FolderController(this)
  }

  // -- Passthroughs ------------------------------------------------------------------------------

  public get Portrait(): string {
    return this.PortraitController.Portrait
  }

  public get Created(): number {
    return this.SaveController.Created
  }

  public get Updated(): number {
    return this.SaveController.LastModified
  }

  // -------------------------------------------------------------------------------------------------

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    // update NarrativeController.Relationships with this new name
    if (this.NarrativeController) {
      this.NarrativeController.Relationships.forEach(rel => {
        if (rel.id === this.ID) {
          rel.name = val
        }
      })
      // update any relationships in other NarrativeControllers that reference this item
      const pinia = getActivePinia()
      const narrativeStore = pinia ? (pinia as any)._s.get('narrative') : null
      if (narrativeStore) narrativeStore.CollectionItems.forEach((item: any) => {
        if (item.ID === this.ID) return
        item.NarrativeController.Relationships.forEach((rel: any) => {
          if (rel.id === this.ID) {
            rel.name = val
            item.SaveController.save()
          }
        })
      })
    }
    this.SaveController.save()
  }

  public get Description(): string {
    return this._description
  }

  public set Description(val: string) {
    this._description = val
    this.SaveController.save()
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.SaveController.save()
  }

  public abstract Clone<T>(): T

  public abstract Serialize<T>(): T
}

export { ICollectionItemData, CollectionItem }
export type { ISectionData }
