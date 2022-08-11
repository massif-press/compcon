import { ISaveable } from './ISaveable'
import { store } from '@/store'
import { SaveAllLocalUpdates } from '@/io/BulkData'

interface ISaveData {
  lastModified: string
  isDeleted: boolean
  expireTime: string
  deleteTime: string
}

class SaveController {
  public readonly Parent: ISaveable

  public LastModified: string
  public _isDeleted: boolean
  public DeleteTime: string
  public ExpireTime: string

  public IsDirty = false
  private _isLoaded = false

  public constructor(parent: ISaveable) {
    this.Parent = parent
    this.LastModified = new Date().toString()
    this._isDeleted = false
    this.ExpireTime = ''
    this.DeleteTime = ''
  }

  public save(skip?: boolean) {
    if (skip || !this._isLoaded) return
    this.IsDirty = true
    this.LastModified = new Date().toString()
    store.dispatch(`set_${this.Parent.ItemType}_dirty`)
    // const sp = getModule(UserStore, store).UserProfile.IsSavePerformant
    // if (!sp) {
    SaveAllLocalUpdates()
    // }
  }

  public delete() {
    this.DeleteTime = new Date().toString()
    this.ExpireTime = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toString()
    this.IsDeleted = true
    store.dispatch(`delete_${this.Parent.ItemType}`, this.Parent)
  }

  public restore() {
    this.IsDeleted = false
    store.dispatch(`restore_${this.Parent.ItemType}`, this.Parent)
  }

  public get IsDeleted(): boolean {
    return this._isDeleted
  }

  public set IsDeleted(val: boolean) {
    this._isDeleted = val
    this.save()
  }

  public SetLoaded(): void {
    this._isLoaded = true
  }

  public get Loaded(): boolean {
    return this._isLoaded
  }

  public static Serialize(parent: ISaveable, target: any) {
    if (!target.save) target.save = {}
    target.save.lastModified = parent.SaveController.LastModified
    target.save.isDeleted = parent.SaveController.IsDeleted
    target.save.expireTime = parent.SaveController.ExpireTime
    target.save.deleteTime = parent.SaveController.DeleteTime
  }

  public static Deserialize(parent: ISaveable, data: ISaveData) {
    if (!parent.SaveController)
      throw new Error(
        `SaveController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`
      )

    parent.SaveController.LastModified = data.lastModified
    parent.SaveController._isDeleted = data.isDeleted
    parent.SaveController.ExpireTime = data.expireTime
    parent.SaveController.DeleteTime = data.deleteTime
    parent.SaveController._isLoaded = false
  }
}

export { ISaveData, SaveController }
