import { ISaveable } from './ISaveable'
import { SetItem, RemoveItem } from '@/io/Storage'
import logger from '@/user/logger'
import * as _ from 'lodash-es'
import { assertController } from '../../utility/assertController'
import type { IControllerStatic } from '@/classes/ISerializable'

interface ISaveData {
  lastModified: number
  deleteTime: number
  created: number
  remote_code?: string
  remote_author?: string
  remote_collection?: string
}

class SaveController {
  public readonly Parent: ISaveable

  public Created: number = new Date().getTime()
  public LastModified: number = 0
  public DeleteTime: number

  public IsDirty = false
  public RemoteCode = ''
  public RemoteAuthor = ''
  public RemoteCollection = ''

  public constructor(parent: ISaveable) {
    this.Parent = parent
    this.DeleteTime = 0

    this.save = _.throttle(this._save, 1500).bind(this)
  }

  public static NewSaveData(): ISaveData {
    return {
      created: new Date().getTime(),
      lastModified: 0,
      deleteTime: 0,
    }
  }

  public markModified(): void {
    this.LastModified = new Date().getTime()
    this.IsDirty = true
  }

  public save(silent = false) {
    if (!this.Parent) {
      throw new Error(
        `SaveController parent is not defined. Ensure SaveController is instantiated in the parent's constructor.`
      )
    }

    this._save(silent)
  }

  private async _save(silent = false) {
    // instance entities (encounter NPCs) live in encounter data and must never
    // write themselves to their own storage type independently.
    if ((this.Parent as any).IsInstance) return

    if (!silent) {
      this.IsDirty = true
      this.LastModified = new Date().getTime()
    }

    SetItem(this.Parent.StorageType, this.Parent.Serialize())
  }

  public saveSilent() {
    this.save(true)
  }

  public Restore() {
    this.DeleteTime = 0
    this.LastModified = new Date().getTime()
    this.save()
  }

  public get IsDeleted(): boolean {
    return this.DeleteTime > 0 && !this.IsRemote
  }

  public get DeleteTimeFormatted(): string {
    return new Date(this.DeleteTime).toLocaleString()
  }

  public Delete() {
    if (this.RemoteCode) {
      this.DeleteRemote()
      return
    }
    this.DeleteTime = new Date().getTime()
    this.LastModified = this.DeleteTime
    this.save()
  }

  private DeleteRemote() {
    const code = this.RemoteCode
    const parent = this.Parent

    void (async () => {
      try {
        const [{ getItemRegistration }, { RemoteItemStore }] = await Promise.all([
          import('@/classes/components/cloud/ItemRegistry'),
          import('@/user/store/RemoteItemStore'),
        ])
        RemoteItemStore().deleteRemoteItem(code)
        const cc = (parent as any).CloudController
        if (cc?.Metadata) cc.Metadata.Code = ''
        const reg = getItemRegistration(parent.ItemType)
        if (reg) await reg.deleteLocal(parent as any)
        else await RemoveItem(parent.StorageType, parent.ID)
      } catch (e) {
        logger.error('SaveController.DeleteRemote: failed to permanently delete remote item', e)
      }
    })()
  }

  public SetRemote(code, author = '', collection = '', item_modified = 0) {
    this.RemoteCode = code
    this.RemoteAuthor = author
    this.RemoteCollection = collection
    this.LastModified = item_modified
  }

  public SetRemoteCollection(collection) {
    this.RemoteCollection = collection
  }

  public ClearRemote() {
    this.RemoteCode = ''
    this.RemoteAuthor = ''
    this.RemoteCollection = ''
    this.save()
  }

  public get IsRemote() {
    return this.IsCollectionItem || this.RemoteCode.length > 0
  }

  public get IsCollectionItem() {
    return !!this.RemoteCollection
  }

  public static Serialize(parent: ISaveable, target: any) {
    if (!target.save) target.save = {}
    target.save.lastModified = parent.SaveController.LastModified
    target.save.deleteTime = parent.SaveController.DeleteTime
    target.save.created = parent.SaveController.Created
    target.save.remote_code = parent.SaveController.RemoteCode
    target.save.remote_author = parent.SaveController.RemoteAuthor
    target.save.remote_collection = parent.SaveController.RemoteCollection
  }

  public static Deserialize(parent: ISaveable, data: ISaveData) {
    assertController(parent.SaveController, 'SaveController')

    if (!data) return

    parent.SaveController.LastModified = data.lastModified
    parent.SaveController.DeleteTime = data.deleteTime
    parent.SaveController.Created = data.created
    parent.SaveController.RemoteCode = data.remote_code || ''
    parent.SaveController.RemoteAuthor = data.remote_author || ''
    parent.SaveController.RemoteCollection = data.remote_collection || ''
  }
}

const _checkController: IControllerStatic<ISaveable, ISaveData> = SaveController
export { SaveController }
export type { ISaveData }
