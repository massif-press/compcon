//TODO: fix dispatches

import { ISaveable } from './ISaveable';
import { SetItem } from '@/io/Storage';
import { debounce } from 'lodash';

interface ISaveData {
  lastModified: number;
  deleteTime: number;
  created: number;
  remote_code?: string;
  remote_author?: string;
  remote_collection?: string;
}

class SaveController {
  public readonly Parent: ISaveable;

  public Created: number = new Date().getTime();
  public LastModified: number = 0;
  public DeleteTime: number;

  public IsDirty = false;
  public RemoteCode = '';
  public RemoteAuthor = '';
  public RemoteCollection = '';

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

    debounce(() => SetItem(this.Parent.StorageType, this.Parent.Serialize()));
  }

  public saveSilent() {
    this.save(true);
  }

  public Restore() {
    this.DeleteTime = 0;
    this.save();
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

  public SetRemote(code, author = '', collection = '', item_modified = 0) {
    this.RemoteCode = code;
    this.RemoteAuthor = author;
    this.RemoteCollection = collection;
    this.LastModified = item_modified;
  }

  public SetRemoteCollection(collection) {
    this.RemoteCollection = collection;
  }

  public ClearRemote() {
    this.RemoteCode = '';
    this.RemoteAuthor = '';
    this.RemoteCollection = '';
    this.save();
  }

  public get IsRemote() {
    return this.IsCollectionItem || this.RemoteCode.length > 0;
  }

  public get IsCollectionItem() {
    return !!this.RemoteCollection;
  }

  public static Serialize(parent: ISaveable, target: any) {
    if (!target.save) target.save = {};
    target.save.lastModified = parent.SaveController.LastModified;
    target.save.deleteTime = parent.SaveController.DeleteTime;
    target.save.created = parent.SaveController.Created;
    target.save.remote_code = parent.SaveController.RemoteCode;
    target.save.remote_author = parent.SaveController.RemoteAuthor;
    target.save.remote_collection = parent.SaveController.RemoteCollection;
  }

  public static Deserialize(parent: ISaveable, data: ISaveData) {
    if (!parent.SaveController)
      throw new Error(
        `SaveController not found on parent (${typeof parent}). New SaveControllers must be instantiated in the parent's constructor method.`
      );

    parent.SaveController.LastModified = data.lastModified;
    parent.SaveController.DeleteTime = data.deleteTime;
    parent.SaveController.Created = data.created;
    parent.SaveController.RemoteCode = data.remote_code || '';
    parent.SaveController.RemoteAuthor = data.remote_author || '';
    parent.SaveController.RemoteCollection = data.remote_collection || '';
  }
}

export { SaveController };
export type { ISaveData };
