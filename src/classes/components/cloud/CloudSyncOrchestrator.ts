import { toRaw } from 'vue'
import { UserStore } from '@/user/store'
import {
  downloadFromS3,
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
          const previousMeta = item.CloudController.Metadata.Serialize()
          const savedata = (item as any).__pendingSavedata
          const sc = toRaw(item).SaveController
          const meta: dbItemMeta = {
            ...previousMeta,
            item_modified: sc.LastModified,
            name: item.Name,
            size: CloudController.stringifySafe(savedata).length,
            ...(sc?.IsDeleted ? { deleted: sc.DeleteTime } : {}),
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
                updateItem(
                  toRaw(task.item).SaveController?.IsDeleted ? task.meta : task.previousMeta
                ).catch(err =>
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
