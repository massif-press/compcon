import _ from 'lodash';
import { IFolderPlaceable } from './IFolderPlaceable';

interface IFolderData {
  folder: string;
}

class FolderController {
  public readonly Parent: IFolderPlaceable;

  private _folder: string;

  public constructor(parent: IFolderPlaceable) {
    this.Parent = parent;
    this._folder = '';
  }

  public get Folder(): string {
    return this._folder;
  }

  public set Folder(folder: string) {
    this._folder = folder;
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: IFolderPlaceable, target: any) {
    if (!target.folder) target.folder = {};
    target.folder.folder = parent.FolderController.Folder;
  }

  public static Deserialize(parent: IFolderPlaceable, data: IFolderData) {
    if (!parent.FolderController)
      throw new Error(
        `FolderController not found on parent (${typeof parent}). New FolderControllers must be instantiated in the parent's constructor method.`
      );

    parent.FolderController._folder = data?.folder || '';
  }
}
export { FolderController };
export type { IFolderData };
