//TODO: fix dispatches

import { ISaveable } from './ISaveable';
import { SetItem } from '@/io/Storage';

interface ISaveData {
  lastModified: number;
  deleteTime: number;
  created: number;
}

class SaveController {
  public readonly Parent: ISaveable;

  public Created: number = new Date().getTime();
  public LastModified: number = 0;
  public DeleteTime: number;

  public IsDirty = false;

  public constructor(parent: ISaveable) {
    this.Parent = parent;
    this.DeleteTime = 0;
  }

  public static NewSaveData(): ISaveData {
    return {
      created: new Date().getTime(),
      lastModified: 0,
      deleteTime: 0,
    };
  }

  public save(silent = false) {
    if (!silent) {
      this.IsDirty = true;
      this.LastModified = new Date().getTime();
      console.log('LastModified:', this.LastModified, new Date(this.LastModified).toLocaleString());
      console.trace();
    }

    SetItem(this.Parent.StorageType, this.Parent.Serialize());
  }

  public saveSilent() {
    this.save(true);
  }

  public Restore() {
    this.DeleteTime = 0;
    // store.dispatch(`restore_${this.Parent.ItemType}`, this.Parent);
  }

  public get IsDeleted(): boolean {
    return this.DeleteTime > 0;
  }

  public get DeleteTimeFormatted(): string {
    return new Date(this.DeleteTime).toLocaleString();
  }

  public Delete() {
    this.DeleteTime = new Date().getTime();
    this.save();
  }

  public static Serialize(parent: ISaveable, target: any) {
    if (!target.save) target.save = {};
    target.save.lastModified = parent.SaveController.LastModified;
    target.save.deleteTime = parent.SaveController.DeleteTime;
    target.save.created = parent.SaveController.Created;
  }

  public static Deserialize(parent: ISaveable, data: ISaveData) {
    if (!parent.SaveController)
      throw new Error(
        `SaveController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`
      );

    parent.SaveController.LastModified = data.lastModified;
    parent.SaveController.DeleteTime = data.deleteTime;
    parent.SaveController.Created = data.created;
  }
}

export { SaveController };
export type { ISaveData };
