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
  updateItem,
  uploadToS3,
  PresignExpiredError,
  batchUpsert,
  generateDeterministicKey,
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

interface ICloudData {
  metadata: dbItemMeta
  cloud_data: string
}

enum SyncStatus {
  LocalOnly = 'LocalOnly',
  LocalNewer = 'LocalNewer',
  CloudOnly = 'CloudOnly',
  CloudNewer = 'CloudNewer',
  Synced = 'Synced',
}

type dbItemMeta = {
  user_id: string
  sortkey: string
  name: string
  author: string
  item_modified: number // latest saveController lastModified
  uri: string
  size?: number
  created?: number
  updated?: number // latest db update. do not test against this. this may drift from item_modified
  deleted?: number
  code?: string
  ttl?: number // update on local delete/perm delete
  version?: number // optimistic concurrency counter

  preserve?: boolean // archive only
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
  public Code?: string
  public TTL?: number
  public Version?: number

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
    if (data.code) this.Code = data.code
    if (data.ttl) this.TTL = data.ttl
    if (data.version != null) this.Version = data.version
  }

  public Serialize(): dbItemMeta {
    return {
      user_id: this.UserId || UserStore().Cognito.userId,
      sortkey: this.SortKey,
      name: this.Name,
      author: this.Author || '',
      item_modified: this.ItemModified,
      uri: this.Uri,
      size: this.Size,
      created: this.Created,
      updated: this.Updated,
      deleted: this.Deleted,
      code: this.Code,
      ttl: this.TTL,
      version: this.Version,
    }
  }
}

class CloudController {
  public readonly Parent: ICloudSyncable

  private _metadata!: DbItemMetadata
  private _lastContentHash: string | null = null

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
    const str = CloudController.stringifySafe(data)
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

  public get SyncStatus(): SyncStatus {
    if (!this.Metadata || this.Metadata.ItemModified == null) return SyncStatus.LocalOnly
    if (this.Metadata.ItemModified < this.Parent.SaveController.LastModified)
      return SyncStatus.LocalNewer
    if (this.Metadata.ItemModified > this.Parent.SaveController.LastModified)
      return SyncStatus.CloudNewer
    return SyncStatus.Synced
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
    return {
      user_id: UserStore().Cognito.userId,
      author: UserStore().UserMetadata.Username || '',
      sortkey: controller.GenerateSortKey(),
      name: controller.Parent.Name,
      uri: `${UserStore().Cognito.userId}/${controller.GenerateSortKey()}.json`,
      item_modified: controller.Parent.SaveController.LastModified,
    }
  }

  public async UpdateCloud(scope = 'item') {
    const savedata = this.Parent.Serialize(this.Parent)
    const newHash = CloudController.computeContentHash(savedata)
    if (this._lastContentHash && this._lastContentHash === newHash) {
      logger.info('CloudController: content unchanged (hash match), skipping upload')
      return true
    }

    // called after we're sure cloud needs to be updated
    this.Metadata.ItemModified = this.Parent.SaveController.LastModified
    this.Metadata.Name = this.Parent.Name
    this.Metadata.Size = CloudController.stringifySafe(savedata).length

    // Save previous metadata so we can roll back if upload fails
    const previousMetadata = this.Metadata.raw ? { ...this.Metadata.raw } : null

    const doUpload = async (retried = false): Promise<any> => {
      const res = await updateItem(this.Metadata.Serialize(), scope)
      if (res.error) return res.error

      if (!res.presign?.upload) throw new Error('No presign returned.')

      try {
        const uploadResult = await uploadToS3(savedata, res.presign.upload)
        if (!uploadResult) {
          if (previousMetadata) this.Metadata = previousMetadata
          throw new Error('S3 upload failed. Metadata not committed.')
        }

        // Only commit metadata and persist after confirmed upload
        if (res.data) {
          this.Metadata = { ...this.Metadata.raw, ...res.data, updated: Date.now() }
          this._lastContentHash = newHash
          this.Parent.SaveController.saveSilent()
        }

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

  public static async BatchUpdateCloud(items: ICloudSyncable[]): Promise<any[]> {
    const UPLOAD_CONCURRENCY = 5
    const BATCH_SIZE = 25

    // items constructed before we get a userid (v2/no login) can have bad metadata
    for (const item of items) {
      await item.CloudController.repairMetadata()
    }

    const prepared: Array<{
      item: ICloudSyncable
      savedata: any
      hash: string
      meta: dbItemMeta
    }> = []

    for (const item of items) {
      // Fast path: skip items where timestamps confirm no changes since last upload
      if (
        item.CloudController._lastContentHash &&
        item.CloudController.SyncStatus === SyncStatus.Synced
      ) {
        logger.info(`BatchUpdateCloud: skipping synced item ${item.Name}`)
        continue
      }

      const savedata = item.Serialize(item)
      const hash = CloudController.computeContentHash(savedata)

      // skip if content hash matches
      if (item.CloudController._lastContentHash && item.CloudController._lastContentHash === hash) {
        logger.info(`BatchUpdateCloud: skipping unchanged item ${item.Name}`)
        continue
      }

      item.CloudController.Metadata.ItemModified = item.SaveController.LastModified
      item.CloudController.Metadata.Name = item.Name
      item.CloudController.Metadata.Size = CloudController.stringifySafe(savedata).length

      const meta = item.CloudController.Metadata.Serialize()
      // itemScope controls share code length on the backend
      ;(meta as any).itemScope = 'item'

      prepared.push({ item, savedata, hash, meta })
    }

    if (prepared.length === 0) {
      logger.info('BatchUpdateCloud: no items to sync (all unchanged)')
      return []
    }

    const failures: any[] = []

    const syncTimestamp = Date.now()
    const userId = UserStore().Cognito.userId
    let nextBatchPromise: Promise<any> | null = null

    for (let i = 0; i < prepared.length; i += BATCH_SIZE) {
      const chunk = prepared.slice(i, i + BATCH_SIZE)
      const batchItems = chunk.map(p => p.meta)

      const idempotencyKey = generateDeterministicKey(userId, `batch-${i}`, syncTimestamp)

      const response = await (nextBatchPromise ?? batchUpsert(batchItems, idempotencyKey))
      nextBatchPromise = null

      const nextOffset = i + BATCH_SIZE
      if (nextOffset < prepared.length) {
        const nextKey = generateDeterministicKey(userId, `batch-${nextOffset}`, syncTimestamp)
        nextBatchPromise = batchUpsert(
          prepared.slice(nextOffset, nextOffset + BATCH_SIZE).map(p => p.meta),
          nextKey
        )
      }

      if (!response.results || !Array.isArray(response.results)) {
        logger.error('BatchUpdateCloud: unexpected batch response', response)
        chunk.forEach(p => failures.push({ item: p.item, error: 'Bad batch response' }))
        continue
      }

      const uploadTasks = chunk.map((p, idx) => ({
        ...p,
        result: response.results[idx],
      }))

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
              task.item.CloudController._lastContentHash = task.hash
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

  public async repairMetadata(): Promise<void> {
    const uri = this.Metadata?.Uri
    if (!uri || !uri.startsWith('undefined/')) return

    const correctUserId = UserStore().Cognito.userId
    if (!correctUserId) return

    const sortkey = this.GenerateSortKey()
    const correctUri = `${correctUserId}/${sortkey}.json`

    let hasCloudData
    try {
      const data = await downloadFromS3(correctUri)
      hasCloudData = !!data
    } catch {
      hasCloudData = false
    }

    if (hasCloudData) {
      this.Metadata = { ...this.Metadata.raw, user_id: correctUserId, uri: correctUri }
    } else {
      this.GenerateMetadata()
    }
    this.Parent.SaveController.saveSilent()
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
  }

  public static Deserialize(parent: ICloudSyncable, data: ICloudData) {
    if (!parent.CloudController)
      throw new Error(
        `CloudController not found on parent (${typeof parent}). New CloudControllers must be instantiated in the parent's constructor method.`
      )
  }

  public static async AutoSync(item: any): Promise<void> {
    if (item.CloudController.SyncStatus === 'Synced') return
    const strategy = UserStore().SyncSettings.resolutionStrategy
    if (strategy === 'manual') return
    switch (strategy) {
      case 'local':
        if (item.IsCloudOnly) await CloudController.SyncToCloud(item)
        else await CloudController.SyncToLocal(item)
        break
      case 'cloud':
        await CloudController.SyncToCloud(item)
        break
      case 'newest':
        await CloudController.SyncToNewest(item)
        break
      default:
        logger.error('Unknown sync strategy:', this)
        break
    }
  }

  public static async SyncToNewest(item: any) {
    if (item.IsCloudOnly || item.CloudController.SyncStatus === 'CloudNewer')
      await CloudController.SyncToCloud(item)
    else await CloudController.SyncToLocal(item)
  }

  public static async UpdateRemote(item: any) {
    if (item.CloudController.SyncStatus === 'Synced') return

    const itemType = normalizeItemType(item.CloudController.Metadata.SortKey.split('_')[1])
    const meta = { ...item.CloudController.Metadata.raw }
    const data = await downloadFromS3(item.CloudController.Metadata.Uri)
    if (data?.save) {
      delete data.save.remote_code
      delete data.save.remote_author
      delete data.save.remote_collection
    }
    const updatedItem = CloudController.NewByType(itemType, data)
    updatedItem.CloudController.setRemoteMetadata(meta)

    await CloudController.AddByType(itemType, updatedItem)
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

  // download latest cloud data and sync local
  public static async SyncToCloud(item: any) {
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

    // capture the original cloud metadata before creating the new local item
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

    const newItem = this.NewByType(itemType, data)

    // transfer original cloud metadata so the item appears synced
    if (originalMeta) {
      const now = Date.now()
      newItem.CloudController.Metadata = { ...originalMeta, updated: now }
      // align local LastModified to cloud's item_modified so SyncStatus = Synced
      if (originalMeta.item_modified) {
        newItem.SaveController.LastModified = originalMeta.item_modified
      }
    }

    await CloudController.AddByType(itemType, newItem)
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

  // upload local data to cloud
  public static async SyncToLocal(item: ICloudSyncable) {
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
export type { ICloudData, dbItemMeta }
