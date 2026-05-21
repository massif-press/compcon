import { toRaw } from 'vue'
import { ICloudSyncable } from './ICloudSyncable'
import { UserStore } from '@/user/store'
import {
  downloadFromS3,
  invalidateETagCache,
  updateItem,
  uploadToS3,
  PresignExpiredError,
  batchUpsert,
} from '@/io/apis/account'
import logger from '@/user/logger'
import { allSyncableTypes, normalizeItemType } from './ItemTypeMap'
import {
  mergeFields,
  stampChangedFields,
  buildFieldHashMap,
  type FieldTimestamps,
  type FieldHashMap,
} from './fieldMerge'
import { getItemRegistration } from './ItemRegistry'

interface ICloudData {
  metadata: dbItemMeta
  cloud_data: string
  _ts?: FieldTimestamps
}

export type dbItemMeta = {
  user_id: string
  sortkey: string
  name: string
  author: string
  item_modified: number
  uri: string
  size?: number
  created?: number
  updated?: number
  deleted?: number
  version?: number
  code?: string
  ttl?: number
  preserve?: boolean
  _ts?: FieldTimestamps
}

class DbItemMetadata {
  public raw: dbItemMeta
  public UserId: string
  public SortKey: string
  public Name: string
  public Author: string
  public ItemModified: number
  public Uri: string
  public Size?: number
  public Created?: number
  public Updated?: number
  public Deleted?: number
  public Version?: number
  public Code?: string
  public TTL?: number

  public constructor(data: dbItemMeta) {
    this.raw = data
    this.UserId = data.user_id
    this.SortKey = data.sortkey
    this.Name = data.name
    this.Author = data.author || ''
    this.Uri = data.uri
    this.ItemModified = data.item_modified
    if (data.size) this.Size = data.size
    if (data.created) this.Created = data.created
    if (data.updated) this.Updated = data.updated
    if (data.deleted) this.Deleted = data.deleted
    if (data.version !== undefined) this.Version = data.version
    if (data.code) this.Code = data.code
    if (data.ttl) this.TTL = data.ttl
  }

  public Serialize(): dbItemMeta {
    return {
      user_id: this.UserId || UserStore().Cognito.userId || '',
      sortkey: this.SortKey,
      name: this.Name,
      author: this.Author || '',
      item_modified: this.ItemModified,
      uri: this.Uri,
      size: this.Size,
      created: this.Created,
      updated: this.Updated,
      deleted: this.Deleted,
      version: this.Version,
      code: this.Code,
      ttl: this.TTL,
    }
  }
}

class CloudController {
  public readonly Parent: ICloudSyncable

  private _metadata!: DbItemMetadata
  private _lastContentHash: string | null = null
  private _lastFieldHashes: FieldHashMap | null = null
  private _fieldTs: FieldTimestamps = {}
  private _lastUploadedItemModified: number = 0

  public constructor(parent: ICloudSyncable) {
    this.Parent = parent
    this.GenerateMetadata()
  }

  private static stringifySafe(data: any): string {
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
    if (Array.isArray(obj)) return obj.map(v => CloudController.sortKeys(v))
    if (obj !== null && typeof obj === 'object') {
      const sorted: Record<string, any> = {}
      for (const key of Object.keys(obj).sort()) {
        sorted[key] = CloudController.sortKeys(obj[key])
      }
      return sorted
    }
    return obj
  }

  public static computeContentHash(data: any): string {
    let target = data
    if (target && typeof target === 'object') {
      const { _ts, cloud, ...rest } = target
      target = rest
    }
    const str = CloudController.stringifySafe(CloudController.sortKeys(target))
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      hash = (((hash << 5) + hash) ^ str.charCodeAt(i)) >>> 0
    }
    return `${str.length}:${hash}`
  }

  private static prepareUpload(
    item: ICloudSyncable
  ): { savedata: any; newTs: FieldTimestamps; hash: string } | null {
    const rawItem = toRaw(item)
    const savedata = rawItem.Serialize(false)
    const newTs = stampChangedFields(
      savedata,
      item.CloudController._lastFieldHashes,
      item.CloudController._fieldTs,
      rawItem.SaveController.LastModified
    )
    ;(savedata as any)._ts = newTs
    const hash = CloudController.computeContentHash(savedata)
    if (item.CloudController._lastContentHash && item.CloudController._lastContentHash === hash) {
      return null
    }
    return { savedata, newTs, hash }
  }

  private static commitUpload(
    controller: CloudController,
    savedata: any,
    newTs: FieldTimestamps,
    hash: string,
    responseData: any
  ): void {
    controller.Metadata = { ...controller.Metadata.raw, ...responseData, updated: Date.now() }
    controller._lastContentHash = hash
    controller._fieldTs = newTs
    controller._lastFieldHashes = buildFieldHashMap(savedata)
    controller._lastUploadedItemModified = toRaw(controller.Parent).SaveController.LastModified
    CloudController.pruneOldFieldTimestamps(controller)
    controller.Parent.SaveController.saveSilent()
  }

  public GenerateSortKey(): string {
    return `${this.Parent.DataType}_${this.Parent.ItemType}_${this.Parent.ID}`
  }

  public SetItemSize(data: any) {
    if (this.Metadata) this.Metadata.Size = CloudController.stringifySafe(data).length
  }

  public stampTombstone(key: string): void {
    this._fieldTs[key] = Date.now()
  }

  public get isSynced(): boolean {
    if (!this._metadata?.Updated) return false
    if (!this._lastUploadedItemModified) return false
    return this._lastUploadedItemModified >= this._metadata.ItemModified
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
    const prepared = CloudController.prepareUpload(this.Parent)
    if (!prepared) {
      logger.info('CloudController: content unchanged (hash match), skipping upload')
      return true
    }
    const { savedata, newTs, hash } = prepared

    const rawParent = toRaw(this.Parent)
    this.Metadata.ItemModified = rawParent.SaveController.LastModified
    this.Metadata.Name = rawParent.Name
    this.Metadata.Size = CloudController.stringifySafe(savedata).length

    const previousMetadata = this.Metadata.raw ? { ...this.Metadata.raw } : null

    const doUpload = async (retried = false): Promise<any> => {
      const res = await updateItem(this.Metadata.Serialize(), scope)

      if (res.error) return res.error

      if (!res.presign?.upload) throw new Error('No presign returned.')

      try {
        const uploadResult = await uploadToS3(savedata, res.presign.upload)
        if (!uploadResult) {
          if (previousMetadata) this.Metadata = previousMetadata
          updateItem(previousMetadata ?? this.Metadata.Serialize(), scope).catch(err =>
            logger.warn('CloudController: DynamoDB compensation failed after S3 upload failure', err)
          )
          throw new Error('S3 upload failed. Metadata not committed.')
        }

        if (res.data) CloudController.commitUpload(this, savedata, newTs, hash, res.data)

        return uploadResult
      } catch (e) {
        if (e instanceof PresignExpiredError && !retried) {
          logger.info('Presigned URL expired, requesting fresh URL and retrying...')
          return doUpload(true)
        }
        if (previousMetadata) this.Metadata = previousMetadata
        throw e
      }
    }

    return doUpload()
  }

  private static readonly ITEM_LEVEL_SYNC_TYPES = new Set([
    'encounterinstance',
    'encounterarchive',
    'pilotsheet',
    'pilotgroup',
  ])

  public async syncFromCloud(): Promise<void> {
    if (UserStore().LocalStorageFull) throw new Error('Storage full! Unable to download.')

    const itemType = normalizeItemType(this.Metadata.SortKey.split('_')[1])
    invalidateETagCache(this.Metadata.Uri)
    const remoteData = await downloadFromS3(this.Metadata.Uri)
    if (!remoteData) {
      logger.warn(
        `CloudController.syncFromCloud: no remote data for ${this.Parent.Name}, uploading local`
      )
      await this.UpdateCloud()
      return
    }

    if (CloudController.ITEM_LEVEL_SYNC_TYPES.has(itemType)) {
      const localModified = this.Parent.SaveController.LastModified
      const remoteModified = remoteData.item_modified ?? 0

      if (remoteModified > localModified) {
        const newItem = CloudController.NewByType(itemType, remoteData)
        toRaw(newItem).SaveController.LastModified = remoteModified
        newItem.CloudController.Metadata = { ...this.Metadata.raw, item_modified: remoteModified }
        newItem.CloudController._lastContentHash = CloudController.computeContentHash(remoteData)
        newItem.CloudController._lastUploadedItemModified = remoteModified
        await CloudController.AddByType(itemType, newItem)
        toRaw(newItem).SaveController.saveSilent()
      } else {
        const localData = toRaw(this.Parent).Serialize(false)
        const localHash = CloudController.computeContentHash(localData)
        const remoteHash = CloudController.computeContentHash(remoteData)
        if (localHash !== remoteHash) {
          await this.UpdateCloud()
        } else {
          this._lastContentHash = localHash
          this._lastUploadedItemModified = localModified
        }
      }
      return
    }

    const localData = toRaw(this.Parent).Serialize(false)

    const localBase = this.Parent.SaveController.LastModified
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

    const remoteHash = CloudController.computeContentHash(remoteData)

    const newItem = CloudController.NewByType(itemType, merged)
    const originalMeta = { ...this.Metadata.raw }
    newItem.CloudController._lastFieldHashes = buildFieldHashMap(merged)
    newItem.CloudController._fieldTs = merged._ts ?? {}

    const mergedHash = CloudController.computeContentHash(toRaw(newItem).Serialize(false))

    if (mergedHash === remoteHash) {
      const serverItemModified = originalMeta.item_modified ?? 0
      toRaw(newItem).SaveController.LastModified = serverItemModified
      newItem.CloudController.Metadata = originalMeta
      newItem.CloudController._lastContentHash = remoteHash
      newItem.CloudController._lastUploadedItemModified = serverItemModified
      await CloudController.AddByType(itemType, newItem)
      toRaw(newItem).SaveController.saveSilent()
    } else {
      const mergeTime = Date.now()
      toRaw(newItem).SaveController.LastModified = mergeTime
      newItem.CloudController.Metadata = { ...originalMeta, item_modified: mergeTime }
      await CloudController.AddByType(itemType, newItem)
      toRaw(newItem).SaveController.saveSilent()
      await newItem.CloudController.UpdateCloud()
    }
  }

  public static async BatchUpdateCloud(items: ICloudSyncable[]): Promise<any[]> {
    const UPLOAD_CONCURRENCY = 5
    const BATCH_SIZE = 5

    const toUpload: ICloudSyncable[] = []
    const failures: any[] = []

    for (const item of items) {
      if (item.CloudController._lastContentHash && item.CloudController.isSynced) {
        logger.info(`BatchUpdateCloud: skipping synced item ${item.Name}`)
        continue
      }

      if (!item.CloudController._lastFieldHashes) {
        const hasPriorSync = Object.keys(item.CloudController._fieldTs).length > 0
        const hasServerRecord = !!item.CloudController._metadata?.Updated
        if (hasPriorSync || hasServerRecord) {
          try {
            await item.CloudController.syncFromCloud()
          } catch (syncErr) {
            failures.push({ item, error: syncErr })
          }
          continue
        }
      }

      const prepared = CloudController.prepareUpload(item)
      if (!prepared) {
        if (item.CloudController.serverVersionChanged) {
          try {
            await item.CloudController.syncFromCloud()
          } catch (syncErr) {
            failures.push({ item, error: syncErr })
          }
        }
        continue
      }
      ;(item as any).__pendingHash = prepared.hash
      ;(item as any).__pendingTs = prepared.newTs
      ;(item as any).__pendingSavedata = prepared.savedata
      toUpload.push(item)
    }

    if (toUpload.length === 0) {
      logger.info('BatchUpdateCloud: no items to sync (all unchanged)')
      return failures
    }

    const userId = UserStore().Cognito.userId

    try {
      for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
        const chunk = toUpload.slice(i, i + BATCH_SIZE)

        const chunkData = chunk.map(item => {
          const previousMeta = item.CloudController.Metadata.Serialize()
          const savedata = (item as any).__pendingSavedata
          const meta: dbItemMeta = {
            ...previousMeta,
            item_modified: toRaw(item).SaveController.LastModified,
            name: item.Name,
            size: CloudController.stringifySafe(savedata).length,
          }
          ;(meta as any).itemScope = 'item'
          return { item, previousMeta, savedata, meta }
        })

        let response: any
        try {
          response = await batchUpsert(chunkData.map(p => p.meta))
        } catch (e: any) {
          logger.error(
            `BatchUpdateCloud: chunk failed (${e?.message})`,
            chunkData.map(p => (p.meta as any).sortkey)
          )
          chunk.forEach(item => failures.push({ item, error: e }))
          continue
        }

        if (!response.results || !Array.isArray(response.results)) {
          logger.error('BatchUpdateCloud: unexpected batch response', response)
          chunk.forEach(item => failures.push({ item, error: 'Bad batch response' }))
          continue
        }

        const uploadTasks = chunkData.map((p, idx) => ({ ...p, result: response.results[idx] }))

        for (let j = 0; j < uploadTasks.length; j += UPLOAD_CONCURRENCY) {
          const uploadBatch = uploadTasks.slice(j, j + UPLOAD_CONCURRENCY)
          const results = await Promise.allSettled(
            uploadBatch.map(async task => {
              if (!task.result?.presign?.upload) {
                throw new Error(`No presign URL for ${task.item.Name}`)
              }

              const uploadOk = await uploadToS3(task.savedata, task.result.presign.upload)
              if (!uploadOk) throw new Error(`S3 upload failed for ${task.item.Name}`)

              if (task.result.data) {
                CloudController.commitUpload(
                  task.item.CloudController,
                  task.savedata,
                  (task.item as any).__pendingTs,
                  (task.item as any).__pendingHash,
                  task.result.data
                )
              }
            })
          )

          const compensations: Promise<any>[] = []
          results.forEach((r, rIdx) => {
            if (r.status === 'rejected') {
              const task = uploadBatch[rIdx]
              logger.error(`BatchUpdateCloud upload failed: ${task.item.Name}`, r.reason)
              failures.push({ item: task.item, error: r.reason })
              compensations.push(
                updateItem(task.previousMeta).catch(err =>
                  logger.warn(
                    `BatchUpdateCloud: DynamoDB compensation failed for ${task.item.Name}`,
                    err
                  )
                )
              )
            }
          })
          if (compensations.length > 0) await Promise.allSettled(compensations)
        }

        chunkData.length = 0
      }
    } finally {
      for (const item of toUpload) {
        delete (item as any).__pendingHash
        delete (item as any).__pendingTs
        delete (item as any).__pendingSavedata
      }
    }

    return failures
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
    return await downloadFromS3(this.Metadata.Uri)
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

  private static pruneOldFieldTimestamps(controller: CloudController): void {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    controller._fieldTs = Object.fromEntries(
      Object.entries(controller._fieldTs).filter(([, v]) => v >= cutoff)
    )
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
    if (!parent.CloudController)
      throw new Error(
        `CloudController not found on parent (${typeof parent}). New CloudControllers must be instantiated in the parent's constructor method.`
      )
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
      // else: old full-object snapshot — discard, re-derives cleanly on next sync
    }
  }

  public setRemoteMetadata(meta: any) {
    this.Metadata = meta
    this.Parent.SaveController.SetRemote(
      meta.code,
      meta.author || '',
      meta.collection || '',
      meta.item_modified
    )
  }

  public static async UpdateRemote(item: any) {
    if (item.CloudController.isSynced) return

    const itemType = normalizeItemType(item.CloudController.Metadata.SortKey.split('_')[1])
    const meta = { ...item.CloudController.Metadata.raw }
    let data: any
    try {
      data = await downloadFromS3(item.CloudController.Metadata.Uri)
    } catch (e: any) {
      if (e?.message?.includes('404')) {
        logger.warn(`UpdateRemote: cloud file not found for ${item.Name}, skipping`)
        return
      }
      throw e
    }
    if (data?.save) {
      delete data.save.remote_code
      delete data.save.remote_author
      delete data.save.remote_collection
    }
    const updatedItem = CloudController.NewByType(itemType, data)
    updatedItem.CloudController.setRemoteMetadata(meta)
    updatedItem.CloudController._lastContentHash = CloudController.computeContentHash(data)
    updatedItem.CloudController._lastFieldHashes = buildFieldHashMap(data)
    updatedItem.CloudController._fieldTs = data._ts ?? {}
    updatedItem.CloudController._lastUploadedItemModified = meta.item_modified ?? 0

    await CloudController.AddByType(itemType, updatedItem)

    if (meta.item_modified) {
      toRaw(updatedItem).SaveController.LastModified = meta.item_modified
      toRaw(updatedItem).SaveController.saveSilent?.()
    }
  }

  public static NewByType(itemType: string, data: any): ICloudSyncable {
    const reg = getItemRegistration(itemType)
    if (!reg) throw new Error('Unknown item type: ' + itemType)
    return reg.construct(data)
  }

  public static async AddByType(itemType: string, item: any) {
    const reg = getItemRegistration(itemType)
    if (!reg) {
      logger.error(`CloudController: Unknown item type ${itemType}`, this)
      return
    }
    await reg.add(item)
  }

  public static async ForceDownload(item: any) {
    if (UserStore().LocalStorageFull) throw new Error('Storage full! Unable to download.')

    if (
      !item.CloudController?.Metadata?.SortKey ||
      !allSyncableTypes.includes(normalizeItemType(item.ItemType))
    ) {
      UserStore().addCloudNotification(`Unable to sync ${item.ItemType} ${item.Name}.`, 'error')
      logger.error(`CloudController: Unable to sync ${item.ItemType} ${item.Name}.`, this)
      return
    }
    const itemType = normalizeItemType(item.CloudController.Metadata.SortKey.split('_')[1])

    const originalMeta = item.CloudController?.Metadata?.raw
      ? { ...item.CloudController.Metadata.raw }
      : item.IsCloudOnly && item.raw
        ? { ...item.raw }
        : null

    const data = item.IsCloudOnly
      ? await downloadFromS3(item.raw.uri)
      : await item.CloudController.Download()

    if (!data) {
      UserStore().addCloudNotification(
        `Unable to sync "${item.Name}": no cloud data found. Upload the item first.`,
        'error'
      )
      return
    }

    if (item.IsCloudOnly)
      UserStore().addCloudNotification(`Added ${item.ItemType} "${item.Name}" from cloud data.`)

    if (data?.save) {
      delete data.save.remote_code
      delete data.save.remote_author
      delete data.save.remote_collection
    }

    const newItem = this.NewByType(itemType, data)

    if (originalMeta) {
      const now = Date.now()
      newItem.CloudController.Metadata = { ...originalMeta, updated: now }
      if (originalMeta.item_modified) {
        newItem.SaveController.LastModified = originalMeta.item_modified
        newItem.CloudController._lastContentHash = CloudController.computeContentHash(data)
        newItem.CloudController._lastFieldHashes = buildFieldHashMap(data)
        newItem.CloudController._fieldTs = data._ts ?? {}
        newItem.CloudController._lastUploadedItemModified = originalMeta.item_modified
      }
    }

    await CloudController.AddByType(itemType, newItem)

    if (originalMeta?.item_modified) {
      toRaw(newItem).SaveController.LastModified = originalMeta.item_modified
      toRaw(newItem).SaveController.saveSilent?.()
    }
  }

  public static async ForceUpload(item: ICloudSyncable) {
    if ((item.SaveController as any)?.IsRemote) return
    if (UserStore().CloudStorageFull) throw new Error('Cloud storage full! Unable to sync.')

    if (!item.SaveController) {
      logger.error(`CloudController: Unable to sync ${item.ItemType} ${item.Name}.`, this)
      return
    }

    await item.CloudController.UpdateCloud()
  }

  public static ImageMetadata(filename: string, fileExt: string, size: number): any {
    const cleanedFilename = filename.replace(/[^a-zA-Z0-9]/g, '')
    return {
      user_id: UserStore().Cognito.userId,
      sortkey: `image_${cleanedFilename}.${fileExt}`,
      name: cleanedFilename,
      uri: `${UserStore().Cognito.userId}/images/${cleanedFilename}.${fileExt}`,
      size: size,
    }
  }
}

export { CloudController, DbItemMetadata }
export type { ICloudData }
