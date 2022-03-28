import { store } from '../../../store'
import { ISaveable } from './ISaveable'

interface ISaveData {
  lastModified: string
  isDeleted: boolean
  deleteTime: string
}

class SaveController {
  public readonly Parent: ISaveable

  public LastModified: string
  public _isDeleted: boolean
  public DeleteTime: string

  public IsDirty = false
  private _isLoaded = false

  public constructor(parent: ISaveable) {
    this.Parent = parent
  }

  public save(skip?: boolean) {
    if (skip || !this._isLoaded) return
    this.IsDirty = true
    this.LastModified = new Date().toString()
    store.dispatch(`set_${this.Parent.ItemType}_dirty`)
  }

  public delete() {
    console.log('delete npc 2')
    this.IsDeleted = true
  }

  public restore() {
    this.IsDeleted = false
  }

  public get IsDeleted(): boolean {
    return this._isDeleted
  }

  public set IsDeleted(val: boolean) {
    this._isDeleted = val
    this.DeleteTime = val
      ? new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toString()
      : ''
    this.save()
  }

  public SetLoaded(): void {
    this._isLoaded = true
  }

  public get Loaded(): boolean {
    return this._isLoaded
  }

  public static Serialize(parent: ISaveable, target: any) {
    target.lastModified = parent.SaveController.LastModified
    target.isDeleted = parent.SaveController.IsDeleted
    target.deleteTime = parent.SaveController.DeleteTime
  }

  public static Deserialize(parent: ISaveable, data: ISaveData) {
    if (!parent.SaveController)
      throw new Error(
        `SaveController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`
      )

    parent.SaveController.LastModified = data.lastModified
    parent.SaveController._isDeleted = data.isDeleted
    parent.SaveController.DeleteTime = data.deleteTime
  }
}

export { ISaveData, SaveController }
