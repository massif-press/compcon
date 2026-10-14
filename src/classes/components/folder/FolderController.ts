import * as _ from 'lodash-es'
import { IFolderPlaceable } from './IFolderPlaceable'
import { assertController } from '../../utility/assertController'

interface IFolderData {
  folder: string
  sortIndex?: number
  folderIndex?: number
}

class FolderController {
  public readonly Parent: IFolderPlaceable

  private _folder: string
  private _sortIndex: number
  private _folderIndex: number

  public constructor(parent: IFolderPlaceable) {
    this.Parent = parent
    this._folder = ''
    this._sortIndex = 0
    this._folderIndex = -1
  }

  public get Folder(): string {
    return this._folder
  }

  public set Folder(folder: string) {
    if (folder !== this._folder) this._folderIndex = -1
    this._folder = folder
    this.Parent.SaveController.save()
  }

  public get SortIndex(): number {
    return this._sortIndex
  }

  public set SortIndex(v: number) {
    if (v === this._sortIndex) return
    this._sortIndex = v
    this.Parent.SaveController.save()
  }

  public get FolderIndex(): number {
    return this._folderIndex
  }

  public set FolderIndex(v: number) {
    if (v === this._folderIndex) return
    this._folderIndex = v
    this.Parent.SaveController.save()
  }

  public static Serialize(parent: IFolderPlaceable, target: any) {
    if (!target.folder) target.folder = {}
    target.folder.folder = parent.FolderController.Folder
    target.folder.sortIndex = parent.FolderController.SortIndex
    target.folder.folderIndex = parent.FolderController.FolderIndex
  }

  public static Deserialize(parent: IFolderPlaceable, data: IFolderData) {
    assertController(parent.FolderController, 'FolderController')

    parent.FolderController._folder = data?.folder || ''
    parent.FolderController._sortIndex = data?.sortIndex ?? 0
    parent.FolderController._folderIndex = data?.folderIndex ?? -1
  }
}
export { FolderController }
export type { IFolderData }
