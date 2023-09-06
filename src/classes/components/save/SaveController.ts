//TODO: fix dispatches

import { ISaveable } from './ISaveable';
import { SaveAllLocalUpdates } from '@/io/BulkData';

interface ISaveData {
  lastModified: number;
  deleteTime: number;
}

class SaveController {
  public readonly Parent: ISaveable;

  public LastModified: number;
  public DeleteTime: number;
  public _isMissingContent: boolean;

  public IsDirty = false;

  public constructor(parent: ISaveable) {
    this.Parent = parent;
    this.LastModified = new Date().getTime();
    this._isMissingContent = false;
    this.DeleteTime = 0;
  }

  public static NewSaveData(): ISaveData {
    return {
      lastModified: 0,
      deleteTime: 0,
    };
  }

  public save(skip?: boolean) {
    this.IsDirty = true;
    this.LastModified = new Date().getTime();
    // store.dispatch(`set_${this.Parent.ItemType.toLowerCase()}_dirty`);
    // const sp = getModule(UserStore, store).UserProfile.IsSavePerformant
    // if (!sp) {
    SaveAllLocalUpdates();
    // }
  }

  public restore() {
    this.IsDeleted = false;
    // store.dispatch(`restore_${this.Parent.ItemType}`, this.Parent);
  }

  public get IsDeleted(): boolean {
    return this.DeleteTime > 0;
  }

  public set IsDeleted(val: boolean) {
    this.DeleteTime = new Date().getTime();
    this.save();
  }

  public get IsMissingContent(): boolean {
    return this._isMissingContent;
  }

  public set IsMissingContent(val: boolean) {
    this._isMissingContent = val;
  }

  public static Serialize(parent: ISaveable, target: any) {
    if (!target.save) target.save = {};
    target.save.lastModified = parent.SaveController.LastModified;
    target.save.deleteTime = parent.SaveController.DeleteTime;
  }

  public static Deserialize(parent: ISaveable, data: ISaveData) {
    if (!parent.SaveController)
      throw new Error(
        `SaveController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`
      );

    parent.SaveController.LastModified = data.lastModified;
    parent.SaveController.DeleteTime = data.deleteTime;
  }
}

export { SaveController };
export type { ISaveData };
