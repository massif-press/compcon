import { toRaw } from 'vue'
import {
  downloadFromS3,
  getUploadPresigns,
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
  toServerTime,
  buildFieldHashMap,
  derivedKeysFor,
  FORCED_KEY,
  HASH_FORMAT_KEY,
  type FieldTimestamps,
  type FieldHashMap,
} from './fieldMerge'
import type { CloudController } from './CloudController'

class CloudTransferController {
  private readonly cc: CloudController

  public _lastContentHash: string | null = null
  public _lastFieldHashes: FieldHashMap | null = null
  public _fieldTs: FieldTimestamps = {}
  public _lastSyncedUpdated: number = 0

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

  private static sortKeys(obj: any, skip: Set<string>): any {
    if (Array.isArray(obj)) return obj.map(v => CloudTransferController.sortKeys(v, skip))
    if (obj !== null && typeof obj === 'object') {
      const sorted: Record<string, any> = {}
      for (const key of Object.keys(obj).sort()) {
        if (skip.has(key)) continue
        sorted[key] = CloudTransferController.sortKeys(obj[key], skip)
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
    const str = CloudTransferController.stringifySafe(
      CloudTransferController.sortKeys(target, derivedKeysFor(data))
    )
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      hash = (((hash << 5) + hash) ^ str.charCodeAt(i)) >>> 0
    }
    return `${str.length}:${hash}`
  }

  public static prepareUpload(
    cc: CloudController,
    force = false,
    authoritative = false
  ): { savedata: any; newTs: FieldTimestamps; hash: string } | null {
    const rawItem = toRaw(cc.Parent)
    const savedata = rawItem.Serialize(false)
    const stamped = stampChangedFields(
      savedata,
      cc.TransferController._lastFieldHashes,
      cc.TransferController._fieldTs,
      rawItem.SaveController.LastModified
    )
    const newTs = authoritative ? { ...stamped, [FORCED_KEY]: toServerTime(Date.now()) } : stamped
    ;(savedata as any)._ts = newTs
    const hash = CloudTransferController.computeContentHash(savedata)
    if (!force && cc.TransferController._lastContentHash === hash) {
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
    cc.Metadata = { ...cc.Metadata.raw, ...responseData }
    cc.TransferController._lastContentHash = hash
    cc.TransferController._fieldTs = newTs
    cc.TransferController._lastFieldHashes = buildFieldHashMap(savedata)
    cc.TransferController._lastSyncedUpdated = cc.Metadata.Updated ?? 0
    const _sc = toRaw(cc.Parent).SaveController
    cc._lastUploadedItemModified = _sc.LastModified || _sc.Created
    cc.Parent.SaveController.saveSilent()
  }

  private static readonly ITEM_LEVEL_SYNC_TYPES = new Set([
    'encounterinstance',
    'encounterarchive',
    'pilotsheet',
  ])

  public static readonly OpenItems = new Set<string>()

  public async UpdateCloud(scope = 'item', force = false, authoritative = false): Promise<any> {
    const sc = toRaw(this.cc.Parent).SaveController
    const pendingDelete = !!sc?.IsDeleted && !this.cc.Metadata?.Deleted
    const prepared = CloudTransferController.prepareUpload(
      this.cc,
      force || pendingDelete,
      authoritative
    )
    if (!prepared) {
      logger.info('CloudController: content unchanged (hash match), skipping upload')
      const _sc0 = toRaw(this.cc.Parent).SaveController
      this.cc._lastUploadedItemModified = _sc0.LastModified || _sc0.Created
      this.cc.Parent.SaveController.saveSilent()
      return true
    }
    const { savedata, newTs, hash } = prepared

    const rawParent = toRaw(this.cc.Parent)
    this.cc.ensureOwnedUri()
    this.cc.Metadata.ItemModified = rawParent.SaveController.LastModified
    this.cc.Metadata.Name = rawParent.Name
    this.cc.Metadata.Size = CloudTransferController.stringifySafe(savedata).length
    if (rawParent.SaveController?.IsDeleted)
      this.cc.Metadata.Deleted = rawParent.SaveController.DeleteTime

    const previousMetadata = this.cc.Metadata.raw ? { ...this.cc.Metadata.raw } : null
    const uri = this.cc.Metadata.Uri

    const putContent = async (retried = false): Promise<any> => {
      const presigns = await getUploadPresigns([uri])
      const upload = presigns[uri]
      if (!upload) throw new Error('No presign returned.')

      try {
        const uploadResult = await uploadToS3(savedata, upload)
        if (!uploadResult) throw new Error('S3 upload failed. Metadata not committed.')
        return uploadResult
      } catch (e) {
        if (e instanceof PresignExpiredError && !retried) {
          logger.info('Presigned URL expired, requesting fresh URL and retrying...')
          return putContent(true)
        }
        throw e
      }
    }

    try {
      const uploadResult = await putContent()

      const res = await updateItem(this.cc.Metadata.Serialize(), scope)
      if (res.error) throw new Error(res.error)

      if (res.data) CloudTransferController.commitUpload(this.cc, savedata, newTs, hash, res.data)

      return uploadResult
    } catch (e) {
      if (previousMetadata) this.cc.Metadata = previousMetadata
      throw e
    }
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
      await this.UpdateCloud('item', true)
      return
    }

    const sc = this.cc.Parent.SaveController
    const remoteForced: number = remoteData._ts?.[FORCED_KEY] ?? 0
    const replaced =
      remoteForced > Math.max(this._fieldTs[FORCED_KEY] ?? 0, toServerTime(sc.LastModified))

    if (CloudTransferController.ITEM_LEVEL_SYNC_TYPES.has(itemType)) {
      const localModified = sc.LastModified || sc.Created
      const remoteModified = remoteData.save?.lastModified ?? 0

      if (remoteModified > localModified || replaced) {
        if (CloudTransferController.OpenItems.has(this.cc.Parent.ID)) return
        const newItem = CloudSyncOrchestrator.NewByType(itemType, remoteData)
        toRaw(newItem).SaveController.LastModified = remoteModified
        newItem.CloudController.Metadata = {
          ...this.cc.Metadata.raw,
          item_modified: remoteModified,
        }
        newItem.CloudController.TransferController._lastContentHash =
          CloudTransferController.computeContentHash(toRaw(newItem).Serialize(false))
        newItem.CloudController._lastUploadedItemModified = remoteModified
        newItem.CloudController._lastSyncedUpdated = this.cc.Metadata.Updated ?? 0
        if (remoteForced) newItem.CloudController._fieldTs = { [FORCED_KEY]: remoteForced }
        await CloudSyncOrchestrator.AddByType(itemType, newItem)
        toRaw(newItem).SaveController.saveSilent()
      } else {
        const localData = toRaw(this.cc.Parent).Serialize(false)
        const localHash = CloudTransferController.computeContentHash(localData)
        const remoteHash = CloudTransferController.computeContentHash(remoteData)
        const sameVersion = remoteModified === localModified && localHash === this._lastContentHash
        if (localHash === remoteHash || sameVersion) {
          this._lastContentHash = localHash
          this.cc._lastUploadedItemModified = localModified
          this._lastSyncedUpdated = this.cc.Metadata.Updated ?? 0
          toRaw(this.cc.Parent).SaveController.saveSilent()
        } else {
          await this.UpdateCloud('item', true)
        }
      }
      return
    }

    const localData = toRaw(this.cc.Parent).Serialize(false)

    const localBase = sc.LastModified
    const edited = !replaced && this.cc._lastUploadedItemModified < (localBase || sc.Created)
    const hashes = replaced ? null : this._lastFieldHashes
    let localTs: FieldTimestamps
    if (hashes && (edited || HASH_FORMAT_KEY in hashes)) {
      localTs = stampChangedFields(localData, hashes, this._fieldTs, localBase)
    } else {
      localTs = { ...this._fieldTs }
      for (const key of edited ? Object.keys(localData) : []) {
        if (key === '_ts' || key in localTs) continue
        localTs[key] = localBase
      }
    }
    ;(localData as any)._ts = localTs

    remoteData.itemType ??= (localData as any).itemType
    const merged = mergeFields(localData, remoteData)

    if (merged?.save) {
      delete merged.save.remote_code
      delete merged.save.remote_author
      delete merged.save.remote_collection
    }

    const remoteHash = CloudTransferController.computeContentHash(remoteData)
    const mergedHash = CloudTransferController.computeContentHash(merged)

    const newItem = CloudSyncOrchestrator.NewByType(itemType, merged)
    const originalMeta = { ...this.cc.Metadata.raw }
    const savedata = toRaw(newItem).Serialize(false)
    newItem.CloudController.TransferController._lastFieldHashes = buildFieldHashMap(savedata)
    newItem.CloudController.TransferController._fieldTs = merged._ts ?? {}

    if (mergedHash === remoteHash) {
      const serverItemModified = originalMeta.item_modified ?? 0
      toRaw(newItem).SaveController.LastModified = serverItemModified
      newItem.CloudController.Metadata = originalMeta
      newItem.CloudController.TransferController._lastContentHash =
        CloudTransferController.computeContentHash(savedata)
      newItem.CloudController._lastUploadedItemModified = serverItemModified
      newItem.CloudController._lastSyncedUpdated = originalMeta.updated ?? 0
      await CloudSyncOrchestrator.AddByType(itemType, newItem)
      toRaw(newItem).SaveController.saveSilent()
    } else {
      const mergeTime = Date.now()
      toRaw(newItem).SaveController.LastModified = mergeTime
      newItem.CloudController.Metadata = { ...originalMeta, item_modified: mergeTime }
      await CloudSyncOrchestrator.AddByType(itemType, newItem)
      toRaw(newItem).SaveController.saveSilent()
      await newItem.CloudController.TransferController.UpdateCloud('item', true)
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
