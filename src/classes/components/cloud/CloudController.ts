import type { IControllerStatic } from '@/classes/ISerializable'
import { ICloudSyncable } from './ICloudSyncable'
import { UserStore } from '@/user/store'
import { updateItem } from '@/io/apis/account'
import { type FieldTimestamps, type FieldHashMap } from './fieldMerge'
import { assertController } from '../../utility/assertController'
import { DbItemMetadata, type dbItemMeta, type ICloudData } from './CloudTypes'
import { CloudMetadataController } from './CloudMetadataController'
import { CloudSyncOrchestrator } from './CloudSyncOrchestrator'
import { CloudTransferController } from './CloudTransferController'

class CloudController {
  public readonly Parent: ICloudSyncable

  public MetadataController: CloudMetadataController
  public TransferController: CloudTransferController

  private _metadata!: DbItemMetadata

  public get _lastContentHash(): string | null { return this.TransferController._lastContentHash }
  public set _lastContentHash(v: string | null) { this.TransferController._lastContentHash = v }

  public get _lastFieldHashes(): FieldHashMap | null { return this.TransferController._lastFieldHashes }
  public set _lastFieldHashes(v: FieldHashMap | null) { this.TransferController._lastFieldHashes = v }

  public get _fieldTs(): FieldTimestamps { return this.TransferController._fieldTs }
  public set _fieldTs(v: FieldTimestamps) { this.TransferController._fieldTs = v }

  public get _lastUploadedItemModified(): number {
    return this.MetadataController._lastUploadedItemModified
  }
  public set _lastUploadedItemModified(val: number) {
    this.MetadataController._lastUploadedItemModified = val
  }

  public constructor(parent: ICloudSyncable) {
    this.Parent = parent
    this.MetadataController = new CloudMetadataController(this)
    this.TransferController = new CloudTransferController(this)
    this.GenerateMetadata()
  }

  public static stringifySafe(data: any): string {
    return CloudTransferController.stringifySafe(data)
  }

  public static computeContentHash(data: any): string {
    return CloudTransferController.computeContentHash(data)
  }

  public static prepareUpload(
    item: ICloudSyncable
  ): { savedata: any; newTs: FieldTimestamps; hash: string } | null {
    return CloudTransferController.prepareUpload(item.CloudController)
  }

  public static commitUpload(
    controller: CloudController,
    savedata: any,
    newTs: FieldTimestamps,
    hash: string,
    responseData: any
  ): void {
    CloudTransferController.commitUpload(controller, savedata, newTs, hash, responseData)
  }

  public GenerateSortKey(): string {
    return `${this.Parent.DataType}_${this.Parent.ItemType}_${this.Parent.ID}`
  }

  public SetItemSize(data: any) {
    if (this.Metadata) this.Metadata.Size = CloudTransferController.stringifySafe(data).length
  }

  public stampTombstone(key: string): void {
    this.TransferController._fieldTs[key] = Date.now()
  }

  public get isSynced(): boolean {
    if (!this._metadata?.Updated) return false
    if (!this._lastUploadedItemModified) return false
    if (this.Parent.SaveController?.IsDeleted && !this._metadata.Deleted) return false
    const sc = this.Parent.SaveController
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
    this._metadata = new DbItemMetadata(CloudController.GenerateMetadata(this))
  }

  public static GenerateMetadata(controller: CloudController) {
    const userId = UserStore().Cognito.userId ?? ''
    return {
      user_id: userId,
      author: UserStore().UserMetadata.Username || '',
      sortkey: controller.GenerateSortKey(),
      name: controller.Parent.Name,
      uri: `${userId}/${controller.GenerateSortKey()}.json`,
      item_modified: controller.Parent.SaveController.LastModified,
    }
  }

  public async UpdateCloud(scope = 'item') {
    return this.TransferController.UpdateCloud(scope)
  }

  public async syncFromCloud(): Promise<void> {
    return this.TransferController.syncFromCloud()
  }

  public static async BatchUpdateCloud(items: ICloudSyncable[]): Promise<any[]> {
    return CloudSyncOrchestrator.BatchUpdateCloud(items)
  }

  public static async MarkCloudDeleted(metadata: DbItemMetadata) {
    metadata.Deleted = Date.now()
    const res = await updateItem(metadata.Serialize())
    if (res.data) return res.data
    if (res.error) throw new Error(res.error)
  }

  public static async Undelete(metadata: DbItemMetadata) {
    metadata.Deleted = 0
    metadata.TTL = -1

    const res = await updateItem(metadata.Serialize())
    if (res.data) return res.data
    if (res.error) throw new Error(res.error)
  }

  public async Download() {
    return this.TransferController.Download()
  }

  public get UserID(): string {
    return this.Metadata?.UserId || ''
  }

  public get ShareCode(): string {
    return this.Metadata?.Code || ''
  }

  public get LastUpdateLocal(): number {
    return this.Parent.SaveController.LastModified
  }

  public static Serialize(parent: ICloudSyncable, target: any) {
    if (!target.cloud) target.cloud = {}
    const ts = parent.CloudController._fieldTs
    if (ts && Object.keys(ts).length > 0) target.cloud._ts = ts
    if (parent.CloudController._lastContentHash) {
      target.cloud._lastHash = parent.CloudController._lastContentHash
    }
    if (parent.CloudController._lastFieldHashes) {
      target.cloud._lastHashes = parent.CloudController._lastFieldHashes
    }
    if (parent.CloudController._lastUploadedItemModified) {
      target.cloud._lastUploadedItemModified = parent.CloudController._lastUploadedItemModified
    }
  }

  public static Deserialize(parent: ICloudSyncable, data: any) {
    assertController(parent.CloudController, 'CloudController')
    if (data?._ts) parent.CloudController._fieldTs = data._ts
    if (data?._lastHash) parent.CloudController._lastContentHash = data._lastHash
    if (data?._lastUploadedItemModified)
      parent.CloudController._lastUploadedItemModified = data._lastUploadedItemModified

    if (data?._lastHashes) {
      parent.CloudController._lastFieldHashes = data._lastHashes
    } else if (data?._lastSnapshot && typeof data._lastSnapshot === 'object') {
      const vals = Object.values(data._lastSnapshot)
      if (vals.length > 0 && vals.every(v => typeof v === 'string')) {
        parent.CloudController._lastFieldHashes = data._lastSnapshot
      }
    }
  }

  public setRemoteMetadata(meta: any) {
    this.TransferController.setRemoteMetadata(meta)
  }

  public static async UpdateRemote(item: any): Promise<void> {
    return CloudSyncOrchestrator.UpdateRemote(item)
  }

  public static NewByType(itemType: string, data: any): ICloudSyncable {
    return CloudSyncOrchestrator.NewByType(itemType, data)
  }

  public static async AddByType(itemType: string, item: any): Promise<void> {
    return CloudSyncOrchestrator.AddByType(itemType, item)
  }

  public static async ForceDownload(item: any): Promise<void> {
    return CloudSyncOrchestrator.ForceDownload(item)
  }

  public static async ForceUpload(item: ICloudSyncable): Promise<void> {
    return CloudSyncOrchestrator.ForceUpload(item)
  }

  public static ImageMetadata(filename: string, fileExt: string, size: number): any {
    return CloudSyncOrchestrator.ImageMetadata(filename, fileExt, size)
  }
}

const _checkController: IControllerStatic<ICloudSyncable, any> = CloudController
export { CloudController, DbItemMetadata }
export type { ICloudData, dbItemMeta }
