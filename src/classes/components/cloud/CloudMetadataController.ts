import { updateItem } from '@/io/apis/account'
import { UserStore } from '@/user/store'
import { DbItemMetadata, type dbItemMeta } from './CloudTypes'
import type { CloudController } from './CloudController'

class CloudMetadataController {
  private _parent: CloudController

  private _metadata!: DbItemMetadata
  public _lastUploadedItemModified: number = 0

  constructor(parent: CloudController) {
    this._parent = parent
  }

  public GenerateSortKey(): string {
    return `${this._parent.Parent.DataType}_${this._parent.Parent.ItemType}_${this._parent.Parent.ID}`
  }

  public SetItemSize(data: any, stringifySafe: (d: any) => string): void {
    if (this._metadata) this._metadata.Size = stringifySafe(data).length
  }

  public stampTombstone(key: string): void {
    this._parent._fieldTs[key] = Date.now()
  }

  public get isSynced(): boolean {
    if (!this._metadata?.Updated) return false
    if (!this._lastUploadedItemModified) return false
    if (this._parent.Parent.SaveController?.IsDeleted && !this._metadata.Deleted) return false
    const sc = this._parent.Parent.SaveController
    const localModified = sc?.LastModified || sc?.Created || 0
    return (
      this._lastUploadedItemModified >= this._metadata.ItemModified &&
      this._lastUploadedItemModified >= localModified
    )
  }

  public get serverVersionChanged(): boolean {
    if (!this._metadata?.Updated) return false
    if (!this._lastUploadedItemModified) return true
    return this._metadata.ItemModified > this._lastUploadedItemModified
  }

  public get Metadata(): DbItemMetadata {
    return this._metadata
  }

  public set Metadata(data: dbItemMeta) {
    this._metadata = new DbItemMetadata(data)
  }

  public GenerateMetadata(): void {
    const userId = UserStore().Cognito.userId ?? ''
    const meta: dbItemMeta = {
      user_id: userId,
      author: UserStore().UserMetadata.Username || '',
      sortkey: this.GenerateSortKey(),
      name: this._parent.Parent.Name,
      uri: `${userId}/${this.GenerateSortKey()}.json`,
      item_modified: this._parent.Parent.SaveController.LastModified,
    }
    this._metadata = new DbItemMetadata(meta)
  }

  public get UserID(): string {
    return this._metadata?.UserId || ''
  }

  public get ShareCode(): string {
    return this._metadata?.Code || ''
  }

  public get LastUpdateLocal(): number {
    return this._parent.Parent.SaveController.LastModified
  }

  public static async MarkCloudDeleted(metadata: DbItemMetadata): Promise<any> {
    metadata.Deleted = Date.now()
    const res = await updateItem(metadata.Serialize())
    if (res.data) return res.data
    if (res.error) throw new Error(res.error)
  }

  public static async Undelete(metadata: DbItemMetadata): Promise<any> {
    metadata.Deleted = 0
    metadata.TTL = -1
    const res = await updateItem(metadata.Serialize())
    if (res.data) return res.data
    if (res.error) throw new Error(res.error)
  }
}

export { CloudMetadataController }
