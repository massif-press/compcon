import { toRaw } from 'vue'
import {
  downloadFromS3,
  invalidateETagCache,
  updateItem,
  uploadToS3,
  PresignExpiredError,
} from '@/io/apis/account'
import { UserStore } from '@/user/store'
import logger from '@/user/logger'
import { normalizeItemType } from './ItemTypeMap'
import {
  mergeFields,
  stampChangedFields,
  buildFieldHashMap,
  type FieldTimestamps,
  type FieldHashMap,
} from './fieldMerge'
import type { CloudController } from './CloudController'

class CloudTransferController {
  private readonly cc: CloudController

  public _lastContentHash: string | null = null
  public _lastFieldHashes: FieldHashMap | null = null
  public _fieldTs: FieldTimestamps = {}

  public constructor(cc: CloudController) {
    this.cc = cc
  }

  public static stringifySafe(data: any): string {
    if (typeof data === 'string') return data
    const seen = new WeakSet<object>()
    return JSON.stringify(data, (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]'
        seen.add(value)
      }
      return value
    })
  }

  private static sortKeys(obj: any): any {
    if (Array.isArray(obj)) return obj.map(v => CloudTransferController.sortKeys(v))
    if (obj !== null && typeof obj === 'object') {
      const sorted: Record<string, any> = {}
      for (const key of Object.keys(obj).sort()) {
        sorted[key] = CloudTransferController.sortKeys(obj[key])
      }
      return sorted
    }
    return obj
  }

  public static computeContentHash(data: any): string {
    let target = data
    if (target && typeof target === 'object') {
      const { _ts, cloud, save, ...rest } = target
      target = rest
    }
    const str = CloudTransferController.stringifySafe(CloudTransferController.sortKeys(target))
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      hash = (((hash << 5) + hash) ^ str.charCodeAt(i)) >>> 0
    }
    return `${str.length}:${hash}`
  }

  public static prepareUpload(
    cc: CloudController
  ): { savedata: any; newTs: FieldTimestamps; hash: string } | null {
    const rawItem = toRaw(cc.Parent)
    const savedata = rawItem.Serialize(false)
    const newTs = stampChangedFields(
      savedata,
      cc.TransferController._lastFieldHashes,
      cc.TransferController._fieldTs,
      rawItem.SaveController.LastModified
    )
    ;(savedata as any)._ts = newTs
    const hash = CloudTransferController.computeContentHash(savedata)
    if (cc.TransferController._lastContentHash && cc.TransferController._lastContentHash === hash) {
      return null
    }
    return { savedata, newTs, hash }
  }

  public static commitUpload(
    cc: CloudController,
    savedata: any,
    newTs: FieldTimestamps,
    hash: string,
    responseData: any
  ): void {
    cc.Metadata = { ...cc.Metadata.raw, ...responseData, updated: Date.now() }
    cc.TransferController._lastContentHash = hash
    cc.TransferController._fieldTs = newTs
    cc.TransferController._lastFieldHashes = buildFieldHashMap(savedata)
    const _sc = toRaw(cc.Parent).SaveController
    cc._lastUploadedItemModified = _sc.LastModified || _sc.Created
    CloudTransferController.pruneOldFieldTimestamps(cc)
    cc.Parent.SaveController.saveSilent()
  }

  private static readonly ITEM_LEVEL_SYNC_TYPES = new Set([
    'encounterinstance',
    'encounterarchive',
    'pilotsheet',
  ])

  private static pruneOldFieldTimestamps(cc: CloudController): void {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    cc.TransferController._fieldTs = Object.fromEntries(
      Object.entries(cc.TransferController._fieldTs).filter(([, v]) => v >= cutoff)
    )
  }

  public async UpdateCloud(scope = 'item'): Promise<any> {
    const prepared = CloudTransferController.prepareUpload(this.cc)
    if (!prepared) {
      logger.info('CloudController: content unchanged (hash match), skipping upload')
      const _sc0 = toRaw(this.cc.Parent).SaveController
      this.cc._lastUploadedItemModified = _sc0.LastModified || _sc0.Created
      this.cc.Parent.SaveController.saveSilent()
      return true
    }
    const { savedata, newTs, hash } = prepared

    const rawParent = toRaw(this.cc.Parent)
    this.cc.Metadata.ItemModified = rawParent.SaveController.LastModified
    this.cc.Metadata.Name = rawParent.Name
    this.cc.Metadata.Size = CloudTransferController.stringifySafe(savedata).length
    if (rawParent.SaveController?.IsDeleted) this.cc.Metadata.Deleted = rawParent.SaveController.DeleteTime

    const previousMetadata = this.cc.Metadata.raw ? { ...this.cc.Metadata.raw } : null

    const doUpload = async (retried = false): Promise<any> => {
      const res = await updateItem(this.cc.Metadata.Serialize(), scope)

      if (res.error) return res.error

      if (!res.presign?.upload) throw new Error('No presign returned.')

      try {
        const uploadResult = await uploadToS3(savedata, res.presign.upload)
        if (!uploadResult) {
          if (previousMetadata) this.cc.Metadata = previousMetadata
          updateItem(previousMetadata ?? this.cc.Metadata.Serialize(), scope).catch(err =>
            logger.warn('CloudController: DynamoDB compensation failed after S3 upload failure', err)
          )
          throw new Error('S3 upload failed. Metadata not committed.')
        }

        if (res.data) CloudTransferController.commitUpload(this.cc, savedata, newTs, hash, res.data)

        return uploadResult
      } catch (e) {
        if (e instanceof PresignExpiredError && !retried) {
          logger.info('Presigned URL expired, requesting fresh URL and retrying...')
          return doUpload(true)
        }
        if (previousMetadata) this.cc.Metadata = previousMetadata
        throw e
      }
    }

    return doUpload()
  }

  public async syncFromCloud(): Promise<void> {
    if (UserStore().LocalStorageFull) throw new Error('Storage full! Unable to download.')

    const { CloudSyncOrchestrator } = await import('./CloudSyncOrchestrator')
    const itemType = normalizeItemType(this.cc.Metadata.SortKey.split('_')[1])
    invalidateETagCache(this.cc.Metadata.Uri)
    const remoteData = await downloadFromS3(this.cc.Metadata.Uri)
    if (!remoteData) {
      logger.warn(
        `CloudController.syncFromCloud: no remote data for ${this.cc.Parent.Name}, uploading local`
      )
      await this.UpdateCloud()
      return
    }

    if (CloudTransferController.ITEM_LEVEL_SYNC_TYPES.has(itemType)) {
      const localModified = this.cc.Parent.SaveController.LastModified || this.cc.Parent.SaveController.Created
      const remoteModified = remoteData.item_modified ?? 0

      if (remoteModified > localModified) {
        const newItem = CloudSyncOrchestrator.NewByType(itemType, remoteData)
        toRaw(newItem).SaveController.LastModified = remoteModified
        newItem.CloudController.Metadata = { ...this.cc.Metadata.raw, item_modified: remoteModified }
        newItem.CloudController.TransferController._lastContentHash = CloudTransferController.computeContentHash(remoteData)
        newItem.CloudController._lastUploadedItemModified = remoteModified
        await CloudSyncOrchestrator.AddByType(itemType, newItem)
        toRaw(newItem).SaveController.saveSilent()
      } else {
        const localData = toRaw(this.cc.Parent).Serialize(false)
        const localHash = CloudTransferController.computeContentHash(localData)
        const remoteHash = CloudTransferController.computeContentHash(remoteData)
        if (localHash !== remoteHash) {
          await this.UpdateCloud()
        } else {
          this._lastContentHash = localHash
          this.cc._lastUploadedItemModified = localModified
        }
      }
      return
    }

    const localData = toRaw(this.cc.Parent).Serialize(false)

    const localBase = this.cc.Parent.SaveController.LastModified
    let localTs: FieldTimestamps
    if (this._lastFieldHashes !== null) {
      localTs = stampChangedFields(localData, this._lastFieldHashes, this._fieldTs, localBase)
    } else {
      localTs = { ...this._fieldTs }
      for (const key of Object.keys(localData)) {
        if (key === '_ts' || key in localTs) continue
        localTs[key] = localBase
      }
    }
    ;(localData as any)._ts = localTs

    const merged = mergeFields(localData, remoteData)

    if (merged?.save) {
      delete merged.save.remote_code
      delete merged.save.remote_author
      delete merged.save.remote_collection
    }

    const remoteHash = CloudTransferController.computeContentHash(remoteData)

    const newItem = CloudSyncOrchestrator.NewByType(itemType, merged)
    const originalMeta = { ...this.cc.Metadata.raw }
    newItem.CloudController.TransferController._lastFieldHashes = buildFieldHashMap(merged)
    newItem.CloudController.TransferController._fieldTs = merged._ts ?? {}

    const mergedHash = CloudTransferController.computeContentHash(toRaw(newItem).Serialize(false))

    if (mergedHash === remoteHash) {
      const serverItemModified = originalMeta.item_modified ?? 0
      toRaw(newItem).SaveController.LastModified = serverItemModified
      newItem.CloudController.Metadata = originalMeta
      newItem.CloudController.TransferController._lastContentHash = remoteHash
      newItem.CloudController._lastUploadedItemModified = serverItemModified
      await CloudSyncOrchestrator.AddByType(itemType, newItem)
      toRaw(newItem).SaveController.saveSilent()
    } else {
      const mergeTime = Date.now()
      toRaw(newItem).SaveController.LastModified = mergeTime
      newItem.CloudController.Metadata = { ...originalMeta, item_modified: mergeTime }
      await CloudSyncOrchestrator.AddByType(itemType, newItem)
      toRaw(newItem).SaveController.saveSilent()
      await newItem.CloudController.TransferController.UpdateCloud()
    }
  }

  public async Download(): Promise<any> {
    return downloadFromS3(this.cc.Metadata.Uri)
  }

  public setRemoteMetadata(meta: any): void {
    this.cc.Metadata = meta
    this.cc.Parent.SaveController.SetRemote(
      meta.code,
      meta.author || '',
      meta.collection || '',
      meta.item_modified
    )
  }
}

export { CloudTransferController }
export type { FieldTimestamps, FieldHashMap }
