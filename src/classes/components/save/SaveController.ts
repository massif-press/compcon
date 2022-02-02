import { store } from '../../../store'
import { ISaveable } from './ISaveable'

interface ISaveData {
  lastModified: string
  isDeleted: boolean
}

class SaveController {
  public readonly Parent: ISaveable

  public LastModified: string
  public IsDeleted: boolean

  public IsDirty = false
  private _isLoaded = false

  public constructor(parent: ISaveable) {
    this.Parent = parent
  }

  public save(skip?: boolean) {
    if (skip) return
    this.IsDirty = true
    this.LastModified = new Date().toString()
    store.dispatch(`set_${this.Parent.ItemType}_dirty`)
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
  }

  public static Deserialize(parent: ISaveable, data: ISaveData) {
    if (!parent.SaveController) throw new Error(`SaveController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`);

    parent.SaveController.LastModified = data.lastModified
    parent.SaveController.IsDeleted = data.isDeleted
  }
}

export {
  ISaveData,
  SaveController
}
