import { toRaw } from 'vue'
import { UserStore } from '@/user/store'
import {
  downloadFromS3,
  getUploadPresigns,
  invalidateETagCache,
  updateItem,
  uploadToS3,
  batchUpsert,
} from '@/io/apis/account'
import logger from '@/user/logger'
import { allSyncableTypes, normalizeItemType } from './ItemTypeMap'
import { buildFieldHashMap } from './fieldMerge'
import { getItemRegistration } from './ItemRegistry'
import { ICloudSyncable } from './ICloudSyncable'
import { CloudController } from './CloudController'
import type { dbItemMeta } from './CloudTypes'

class CloudSyncOrchestrator {
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

      if (toRaw(item).SaveController?.IsDeleted && !item.CloudController.Metadata?.Deleted) {
        const sc = toRaw(item).SaveController
        const deletedMeta: dbItemMeta = {
          ...item.CloudController.Metadata.Serialize(),
          item_modified: sc.LastModified,
          deleted: sc.DeleteTime,
        }
        try {
          const res = await updateItem(deletedMeta, 'item')
          if (res.data) {
            item.CloudController.Metadata = { ...deletedMeta, ...res.data }
          }
          item.CloudController._lastUploadedItemModified = sc.LastModified
          toRaw(item).SaveController.saveSilent()
        } catch (e) {
          failures.push({ item, error: e })
        }
        continue
      }

      if (!item.CloudController._lastFieldHashes) {
        const hasPriorSync = Object.keys(item.CloudController._fieldTs).length > 0
        const hasServerRecord = !!item.CloudController.Metadata?.Updated
        if (hasPriorSync || hasServerRecord) {
          if (!toRaw(item).SaveController?.IsDeleted) {
            try {
              await item.CloudController.syncFromCloud()
            } catch (syncErr) {
              failures.push({ item, error: syncErr })
            }
          }
          continue
        }
      }

      const prepared = CloudController.prepareUpload(item)
      if (!prepared) {
        if (item.CloudController.serverVersionChanged && !toRaw(item).SaveController?.IsDeleted) {
          try {
            await item.CloudController.syncFromCloud()
          } catch (syncErr) {
            failures.push({ item, error: syncErr })
          }
        } else {
          const _sc1 = toRaw(item).SaveController
          item.CloudController._lastUploadedItemModified = _sc1.LastModified || _sc1.Created
          _sc1.saveSilent()
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

    try {
      for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
        const chunk = toUpload.slice(i, i + BATCH_SIZE)

        const chunkData = chunk.map(item => {
          item.CloudController.ensureOwnedUri()
          const baseMeta = item.CloudController.Metadata.Serialize()
          const savedata = (item as any).__pendingSavedata
          const sc = toRaw(item).SaveController
          const meta: dbItemMeta = {
            ...baseMeta,
            item_modified: sc.LastModified,
            name: item.Name,
            size: CloudController.stringifySafe(savedata).length,
            ...(sc?.IsDeleted ? { deleted: sc.DeleteTime } : {}),
          }
          ;(meta as any).itemScope = 'item'
          return { item, savedata, meta }
        })

        let presigns: Record<string, string>
        try {
          presigns = await getUploadPresigns(chunkData.map(p => p.meta.uri))
        } catch (e: any) {
          logger.error(`BatchUpdateCloud: presign failed (${e?.message})`)
          chunk.forEach(item => failures.push({ item, error: e }))
          continue
        }

        const uploaded: typeof chunkData = []
        for (let j = 0; j < chunkData.length; j += UPLOAD_CONCURRENCY) {
          const uploadBatch = chunkData.slice(j, j + UPLOAD_CONCURRENCY)
          const results = await Promise.allSettled(
            uploadBatch.map(async task => {
              const upload = presigns[task.meta.uri]
              if (!upload) throw new Error(`No presign URL for ${task.item.Name}`)
              const uploadOk = await uploadToS3(task.savedata, upload)
              if (!uploadOk) throw new Error(`S3 upload failed for ${task.item.Name}`)
            })
          )

          results.forEach((r, rIdx) => {
            const task = uploadBatch[rIdx]
            if (r.status === 'rejected') {
              logger.error(`BatchUpdateCloud upload failed: ${task.item.Name}`, r.reason)
              failures.push({ item: task.item, error: r.reason })
            } else {
              uploaded.push(task)
            }
          })
        }

        if (uploaded.length === 0) {
          chunkData.length = 0
          continue
        }

        let response: any
        try {
          response = await batchUpsert(uploaded.map(p => p.meta))
        } catch (e: any) {
          logger.error(
            `BatchUpdateCloud: chunk failed (${e?.message})`,
            uploaded.map(p => (p.meta as any).sortkey)
          )
          uploaded.forEach(p => failures.push({ item: p.item, error: e }))
          chunkData.length = 0
          continue
        }

        if (!response.results || !Array.isArray(response.results)) {
          logger.error('BatchUpdateCloud: unexpected batch response', response)
          uploaded.forEach(p => failures.push({ item: p.item, error: 'Bad batch response' }))
          chunkData.length = 0
          continue
        }

        uploaded.forEach((task, idx) => {
          const result = response.results[idx]
          if (!result?.data) {
            failures.push({ item: task.item, error: 'No metadata returned for uploaded item' })
            return
          }
          CloudController.commitUpload(
            task.item.CloudController,
            task.savedata,
            (task.item as any).__pendingTs,
            (task.item as any).__pendingHash,
            result.data
          )
        })

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

  public static async UpdateRemote(item: any): Promise<void> {
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
    const updatedItem = CloudSyncOrchestrator.NewByType(itemType, data)
    updatedItem.CloudController.setRemoteMetadata(meta)
    updatedItem.CloudController._lastContentHash = CloudController.computeContentHash(data)
    updatedItem.CloudController._lastFieldHashes = buildFieldHashMap(data)
    updatedItem.CloudController._fieldTs = data._ts ?? {}
    updatedItem.CloudController._lastUploadedItemModified = meta.item_modified ?? 0
    updatedItem.CloudController._lastSyncedUpdated = meta.updated ?? 0

    await CloudSyncOrchestrator.AddByType(itemType, updatedItem)

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

  public static async AddByType(itemType: string, item: any): Promise<void> {
    const reg = getItemRegistration(itemType)
    if (!reg) {
      logger.error(`CloudSyncOrchestrator: Unknown item type ${itemType}`, this)
      return
    }
    await reg.add(item)
  }

  public static async ForceDownload(item: any): Promise<void> {
    if (UserStore().LocalStorageFull) throw new Error('Storage full! Unable to download.')

    if (
      !item.CloudController?.Metadata?.SortKey ||
      !allSyncableTypes.includes(normalizeItemType(item.ItemType))
    ) {
      UserStore().addCloudNotification(`Unable to sync ${item.ItemType} ${item.Name}.`, 'error')
      logger.error(`CloudSyncOrchestrator: Unable to sync ${item.ItemType} ${item.Name}.`, this)
      return
    }
    const itemType = normalizeItemType(item.CloudController.Metadata.SortKey.split('_')[1])

    const originalMeta = item.CloudController?.Metadata?.raw
      ? { ...item.CloudController.Metadata.raw }
      : item.IsCloudOnly && item.raw
        ? { ...item.raw }
        : null

    const forceUri = item.IsCloudOnly ? item.raw.uri : item.CloudController.Metadata.Uri
    if (forceUri) invalidateETagCache(forceUri)
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

    const newItem = CloudSyncOrchestrator.NewByType(itemType, data)

    if (originalMeta) {
      newItem.CloudController.Metadata = { ...originalMeta }
      if (originalMeta.item_modified) {
        newItem.SaveController.LastModified = originalMeta.item_modified
        newItem.CloudController._lastContentHash = CloudController.computeContentHash(data)
        newItem.CloudController._lastFieldHashes = buildFieldHashMap(data)
        newItem.CloudController._fieldTs = data._ts ?? {}
        newItem.CloudController._lastUploadedItemModified = originalMeta.item_modified
        newItem.CloudController._lastSyncedUpdated = originalMeta.updated ?? 0
      }
    }

    await CloudSyncOrchestrator.AddByType(itemType, newItem)

    if (originalMeta?.item_modified) {
      toRaw(newItem).SaveController.LastModified = originalMeta.item_modified
      toRaw(newItem).SaveController.saveSilent?.()
    }
  }

  public static async ForceUpload(item: ICloudSyncable): Promise<void> {
    if ((item.SaveController as any)?.IsRemote) return
    if (UserStore().CloudStorageFull) throw new Error('Cloud storage full! Unable to sync.')

    if (!item.SaveController) {
      logger.error(`CloudSyncOrchestrator: Unable to sync ${item.ItemType} ${item.Name}.`, this)
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

export { CloudSyncOrchestrator }
