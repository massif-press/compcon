import { defineStore } from 'pinia'
import type { dbItemMeta } from '@/classes/components/cloud/CloudController'
import { CloudDataStore } from './CloudDataStore'
import { UserMetadataStore } from './UserMetadataStore'
import { NotificationStore } from './NotificationStore'
import { pruneBackups, autoBackup } from './BackupService'

export const BackupStore = defineStore('backups', {
  getters: {
    BackupSpaceExceeded(): boolean {
      const cdStore = CloudDataStore()
      if (cdStore.CloudStorageFull) return true
      const sizeTotal = cdStore.CloudArchives.reduce(
        (acc: number, obj: dbItemMeta) => acc + (obj.size ?? 0),
        0
      )
      const umStore = UserMetadataStore()
      return sizeTotal > cdStore.MaxCloudStorage * (umStore.SyncSettings.autoBackupPrunePct / 100)
    },
    BackupLimitExceeded(): boolean {
      const cdStore = CloudDataStore()
      if (cdStore.CloudStorageFull) return true
      return cdStore.CloudArchives.length > UserMetadataStore().SyncSettings.autoBackupLimit
    },
    PrunableBackups(): dbItemMeta[] {
      const cdStore = CloudDataStore()
      const umStore = UserMetadataStore()
      const backups = cdStore.CloudArchives.filter((x: dbItemMeta) => !x.preserve)
      const sizeTotal = backups.reduce((acc: number, obj: dbItemMeta) => acc + (obj.size ?? 0), 0)
      const pruneSize = cdStore.MaxCloudStorage * (umStore.SyncSettings.autoBackupPrunePct / 100)
      const pruneCount = umStore.SyncSettings.autoBackupLimit
      if (sizeTotal < pruneSize && backups.length < pruneCount) return []

      const sorted = [...backups].sort(
        (a: dbItemMeta, b: dbItemMeta) => (a.created ?? 0) - (b.created ?? 0)
      )

      const toDelete: dbItemMeta[] = []
      let totalSize = 0
      let count = 0
      for (const item of sorted) {
        totalSize += item.size ?? 0
        count++
        if (totalSize > pruneSize || count > pruneCount) toDelete.push(item)
      }

      return toDelete
    },
  },
  actions: {
    async PruneBackups(): Promise<void> {
      await pruneBackups(this)
    },
    async AutoBackup(startup = false): Promise<void> {
      await autoBackup(this, startup)
    },
  },
})
