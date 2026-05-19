import { toRaw } from 'vue'
import { ICloudSyncable } from './ICloudSyncable'
import {
  CampaignStore,
  EncounterStore,
  NarrativeStore,
  NpcStore,
  PilotStore,
  UserStore,
} from '@/stores'
import {
  downloadFromS3,
  invalidateETagCache,
  updateItem,
  uploadToS3,
  PresignExpiredError,
  batchUpsert,
  generateDeterministicKey,
  getUserDataChanged,
} from '@/io/apis/account'
import { Pilot } from '@/class'
import { Doodad } from '@/classes/npc/doodad/Doodad'
import { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { Unit } from '@/classes/npc/unit/Unit'
import { Encounter } from '@/classes/encounter/Encounter'
import { Campaign } from '@/classes/campaign/Campaign'
import { Character } from '@/classes/narrative/Character'
import { Faction } from '@/classes/narrative/Faction'
import { Location } from '@/classes/narrative/Location'
import logger from '@/user/logger'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterArchive } from '@/classes/encounter/EncounterArchive'
import PilotSheet from '@/features/pilot_management/store/PilotSheet'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { allSyncableTypes, normalizeItemType } from './ItemTypeMap'
import { mergeFields, stampChangedFields, type FieldTimestamps } from './fieldMerge'

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
  private _lastSyncedSnapshot: Record<string, any> | null = null
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

  public static computeContentHash(data: any): string {
    let target = data
    if (target && typeof target === 'object') {
      const { _ts, ...rest } = target
      target = rest
    }
    const str = CloudController.stringifySafe(target)
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      hash = (((hash << 5) + hash) ^ str.charCodeAt(i)) >>> 0
    }
    return `${str.length}:${hash}`
  }

  public GenerateSortKey(): string {
    return `${this.Parent.DataType}_${this.Parent.ItemType}_${this.Parent.ID}`
  }

  public SetItemSize(data: any) {
    if (this.Metadata) this.Metadata.Size = CloudController.stringifySafe(data).length
  }

  public get isSynced(): boolean {
    if (!this._metadata?.ItemModified) return false
    // Updated is only set after a successful upload or by setMetadataFromDynamo.
    // GenerateMetadata never sets it, so a missing Updated means the item has no server record
    // and must be uploaded regardless of whether the timestamps happen to match.
    if (!this._metadata.Updated) return false
    return this.Metadata.ItemModified === this.Parent.SaveController.LastModified
  }

  public get serverVersionChanged(): boolean {
    if (!this._metadata?.Updated) return false
    if (!this._lastUploadedItemModified) return true
    return this._metadata.ItemModified !== this._lastUploadedItemModified
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
    const rawParent = toRaw(this.Parent)
    const savedata = rawParent.Serialize(false)

    const newTs = stampChangedFields(
      savedata,
      this._lastSyncedSnapshot,
      this._fieldTs,
      rawParent.SaveController.LastModified
    )

    ;(savedata as any)._ts = newTs

    const newHash = CloudController.computeContentHash(savedata)
    if (this._lastContentHash && this._lastContentHash === newHash) {
      logger.info('CloudController: content unchanged (hash match), skipping upload')
      return true
    }

    this.Metadata.ItemModified = rawParent.SaveController.LastModified
    this.Metadata.Name = rawParent.Name
    this.Metadata.Size = CloudController.stringifySafe(savedata).length

    const previousMetadata = this.Metadata.raw ? { ...this.Metadata.raw } : null

    const doUpload = async (retried = false, conflictRetried = false): Promise<any> => {
      const res = await updateItem(this.Metadata.Serialize(), scope)

      if (res.error) return res.error

      if (!res.presign?.upload) throw new Error('No presign returned.')

      try {
        const uploadResult = await uploadToS3(savedata, res.presign.upload)
        if (!uploadResult) {
          if (previousMetadata) this.Metadata = previousMetadata
          throw new Error('S3 upload failed. Metadata not committed.')
        }

        if (res.data) {
          this.Metadata = { ...this.Metadata.raw, ...res.data, updated: Date.now() }
          this._lastContentHash = newHash
          this._fieldTs = newTs
          this._lastSyncedSnapshot = JSON.parse(CloudController.stringifySafe(savedata))
          this._lastUploadedItemModified = rawParent.SaveController.LastModified
          this.Parent.SaveController.saveSilent()
        }

        return uploadResult
      } catch (e) {
        if (e instanceof PresignExpiredError && !retried) {
          logger.info('Presigned URL expired, requesting fresh URL and retrying...')
          return doUpload(true, conflictRetried)
        }
        if (previousMetadata) this.Metadata = previousMetadata
        throw e
      }
    }

    return doUpload()
  }

  public async syncFromCloud(): Promise<void> {
    if (UserStore().StorageFull) throw new Error('Storage full! Unable to download.')

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

    const localData = toRaw(this.Parent).Serialize(false)

    const localBase = this.Parent.SaveController.LastModified
    let localTs: FieldTimestamps
    if (this._lastSyncedSnapshot !== null) {
      localTs = stampChangedFields(localData, this._lastSyncedSnapshot, this._fieldTs, localBase)
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

    const newItem = CloudController.NewByType(itemType, merged)
    const originalMeta = { ...this.Metadata.raw }
    // use a fresh timestamp for item_modified so the upload isn't rejected for being stale
    // overriding this persistent 409s because backend checks that incoming updated === stored updated before accepting the write.
    const mergeTime = Date.now()
    newItem.SaveController.LastModified = mergeTime
    newItem.CloudController.Metadata = { ...originalMeta, item_modified: mergeTime }
    newItem.CloudController._lastSyncedSnapshot = JSON.parse(CloudController.stringifySafe(merged))
    newItem.CloudController._fieldTs = merged._ts ?? {}

    await CloudController.AddByType(itemType, newItem)
    // persist so it survives a reload even if the upload fails
    // some store update paths (e.g. AddEncounter) skip the SetItem call
    toRaw(newItem).SaveController.saveSilent()

    await newItem.CloudController.UpdateCloud()
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

      // if we have no sync snapshot but the item has prior cloud state (stored field timestamps or an existing server record), we cannot know which fields changed locally
      if (!item.CloudController._lastSyncedSnapshot) {
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

      const rawItem = toRaw(item)
      const savedata = rawItem.Serialize(false)
      const newTs = stampChangedFields(
        savedata,
        item.CloudController._lastSyncedSnapshot,
        item.CloudController._fieldTs,
        rawItem.SaveController.LastModified
      )
      ;(savedata as any)._ts = newTs

      const hash = CloudController.computeContentHash(savedata)
      if (item.CloudController._lastContentHash && item.CloudController._lastContentHash === hash) {
        if (item.CloudController.serverVersionChanged) {
          try {
            await item.CloudController.syncFromCloud()
          } catch (syncErr) {
            failures.push({ item, error: syncErr })
          }
        }
        continue
      }
      ;(item as any).__pendingHash = hash
      ;(item as any).__pendingTs = newTs
      toUpload.push(item)
    }

    if (toUpload.length === 0) {
      logger.info('BatchUpdateCloud: no items to sync (all unchanged)')
      return failures
    }

    const syncTimestamp = Date.now()
    const userId = UserStore().Cognito.userId

    try {
      for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
        const chunk = toUpload.slice(i, i + BATCH_SIZE)

        const chunkData = chunk.map(item => {
          const rawItem = toRaw(item)
          const savedata = rawItem.Serialize(false)
          ;(savedata as any)._ts = (item as any).__pendingTs
          const meta: dbItemMeta = {
            ...item.CloudController.Metadata.Serialize(),
            item_modified: rawItem.SaveController.LastModified,
            name: rawItem.Name,
            size: CloudController.stringifySafe(savedata).length,
          }
          ;(meta as any).itemScope = 'item'
          return { item, savedata, meta }
        })

        const idempotencyKey = generateDeterministicKey(userId ?? '', `batch-${i}`, syncTimestamp)
        let response: any
        try {
          response = await batchUpsert(
            chunkData.map(p => p.meta),
            idempotencyKey
          )
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
                task.item.CloudController.Metadata = {
                  ...task.item.CloudController.Metadata.raw,
                  ...task.result.data,
                  updated: Date.now(),
                }
                task.item.CloudController._lastContentHash = (task.item as any).__pendingHash
                task.item.CloudController._fieldTs = (task.item as any).__pendingTs
                task.item.CloudController._lastSyncedSnapshot = JSON.parse(
                  CloudController.stringifySafe(task.savedata)
                )
                task.item.CloudController._lastUploadedItemModified = toRaw(
                  task.item
                ).SaveController.LastModified
                task.item.SaveController.saveSilent()
              }
            })
          )

          results.forEach((r, rIdx) => {
            if (r.status === 'rejected') {
              const task = uploadBatch[rIdx]
              logger.error(`BatchUpdateCloud upload failed: ${task.item.Name}`, r.reason)
              failures.push({ item: task.item, error: r.reason })
            }
          })
        }

        chunkData.length = 0
      }
    } finally {
      for (const item of toUpload) {
        delete (item as any).__pendingHash
        delete (item as any).__pendingTs
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

  public static Serialize(parent: ICloudSyncable, target: any) {
    if (!target.cloud) target.cloud = {}
    const ts = parent.CloudController._fieldTs
    if (ts && Object.keys(ts).length > 0) target.cloud._ts = ts
    if (parent.CloudController._lastContentHash) {
      target.cloud._lastHash = parent.CloudController._lastContentHash
    }
    if (parent.CloudController._lastSyncedSnapshot) {
      target.cloud._lastSnapshot = parent.CloudController._lastSyncedSnapshot
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
    if (data?._lastSnapshot) parent.CloudController._lastSyncedSnapshot = data._lastSnapshot
    if (data?._lastUploadedItemModified)
      parent.CloudController._lastUploadedItemModified = data._lastUploadedItemModified
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

    await CloudController.AddByType(itemType, updatedItem)

    if (meta.item_modified) {
      toRaw(updatedItem).SaveController.LastModified = meta.item_modified
      toRaw(updatedItem).SaveController.saveSilent?.()
    }
  }

  public static NewByType(itemType: string, data: any): ICloudSyncable {
    switch (normalizeItemType(itemType)) {
      case 'pilot':
        return new Pilot(data)
      case 'pilotgroup':
        return PilotGroup.Deserialize(data)
      case 'unit':
        return Unit.Deserialize(data)
      case 'doodad':
        return Doodad.Deserialize(data)
      case 'eidolon':
        return Eidolon.Deserialize(data)
      case 'character':
        return Character.Deserialize(data)
      case 'faction':
        return Faction.Deserialize(data)
      case 'location':
        return Location.Deserialize(data)
      case 'encounter':
        return Encounter.Deserialize(data)
      case 'encounterinstance':
        return EncounterInstance.Deserialize(data)
      case 'encounterarchive':
        return EncounterArchive.Deserialize(data)
      case 'pilotsheet':
        return PilotSheet.Deserialize(data)
      case 'campaign':
        return Campaign.Deserialize(data)
      default:
        throw new Error('Unknown item type: ' + itemType)
    }
  }

  public static async AddByType(itemType: string, item: any) {
    switch (normalizeItemType(itemType)) {
      case 'pilot':
        PilotStore().AddPilot(item)
        break
      case 'pilotgroup':
        await PilotStore().AddGroup(item)
        break
      case 'unit':
        await NpcStore().AddNpc(item)
        break
      case 'doodad':
        await NpcStore().AddNpc(item)
        break
      case 'eidolon':
        await NpcStore().AddNpc(item)
        break
      case 'character':
      case 'faction':
      case 'location':
        await NarrativeStore().AddItem(item)
        break
      case 'encounter':
        await EncounterStore().AddEncounter(item)
        break
      case 'encounterinstance':
        await EncounterStore().AddEncounterInstance(item)
        break
      case 'encounterarchive':
        await EncounterStore().AddEncounterArchive(item)
        break
      case 'pilotsheet':
        await PilotStore().ImportPilotSheet(item)
        break
      case 'campaign':
        await CampaignStore().AddCampaign(item)
        break
      default:
        logger.error(`CloudController: Unknown item type ${itemType}`, this)
        break
    }
  }

  // Download cloud data and replace the local item (force overwrite, no merge)
  public static async ForceDownload(item: any) {
    if (UserStore().StorageFull) throw new Error('Storage full! Unable to download.')

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
      }
    }

    await CloudController.AddByType(itemType, newItem)

    if (originalMeta?.item_modified) {
      toRaw(newItem).SaveController.LastModified = originalMeta.item_modified
      toRaw(newItem).SaveController.saveSilent?.()
    }
  }

  // Upload local data to cloud unconditionally (force overwrite)
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
