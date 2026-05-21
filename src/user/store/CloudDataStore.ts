import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import {
  getUserDataChanged,
  bulkDelete,
  cloudDelete,
} from '@/io/apis/account'
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController'
import type { dbItemMeta } from '@/classes/components/cloud/CloudController'
import { getItemRegistration } from '@/classes/components/cloud/ItemRegistry'
import { normalizeItemType, expandFilterTypes } from '@/classes/components/cloud/ItemTypeMap'
import { setServerTimeOffset } from '@/classes/components/cloud/fieldMerge'
import { AuthStore } from './AuthStore'
import { UserMetadataStore } from './UserMetadataStore'
import { NotificationStore } from './NotificationStore'
import { CompendiumStore } from '@/features/compendium/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import logger from '../logger'

export interface SyncableItem {
  ID: string
  Name: string
  ItemType: string
  CloudController: {
    Metadata: DbItemMetadata
    isSynced: boolean
    serverVersionChanged: boolean
    syncFromCloud(): Promise<void>
  }
  SaveController?: {
    IsDeleted: boolean
    IsRemote: boolean
    RemoteCode?: string
    DeleteTime?: number
  }
  IsCloudOnly?: boolean
}

let _isFirstMetadataLoad = true

export const CloudDataStore = defineStore('cloudData', {
  state: () => ({
    CloudItems: [] as dbItemMeta[],
    CloudArchives: [] as dbItemMeta[],
    CloudImages: [] as dbItemMeta[],
    UserPublishedCollections: [] as dbItemMeta[],
    RemoteCollections: [] as dbItemMeta[],
    LastQuery: 0,
    CloudStorageUsed: 0,
    SyncVersion: 0,
  }),
  getters: {
    MaxCloudStorage(): number {
      const tier =
        UserMetadataStore().UserMetadata?.PatreonData?.profile?.tierData?.title?.toLowerCase() ??
        ''
      let baseMbVal = 100
      if (tier === 'diasporan') baseMbVal = 1000
      else if (tier === 'cosmopolitan') baseMbVal = 5000
      else if (tier === 'lancer' || tier === 'nhp' || tier === 'monist') baseMbVal = 10000
      return baseMbVal * 1024 * 1024
    },
    CollectionPublishLimit(): number {
      const tier =
        UserMetadataStore().UserMetadata?.PatreonData?.profile?.tierData?.title?.toLowerCase() ??
        ''
      if (tier === 'diasporan') return 3
      if (
        tier === 'cosmopolitan' ||
        tier === 'lancer' ||
        tier === 'nhp' ||
        tier === 'monist'
      )
        return -1
      return 0
    },
    CloudStorageFull(): boolean {
      return this.CloudStorageUsed > this.MaxCloudStorage
    },
    UserCollections(): ReturnType<typeof CompendiumStore>['ContentCollections'] {
      const data = CompendiumStore().ContentCollections
      data.forEach(c => {
        const meta = this.UserPublishedCollections.find(x => x.sortkey.split('_')[1] === c.ID)
        if (meta) c.Metadata = meta as any
      })
      return data
    },
    SyncItemTypes(): string[] {
      return expandFilterTypes(UserMetadataStore().UserMetadata.SyncSettings.itemTypes)
    },
  },
  actions: {
    resetLastQuery(): void {
      this.LastQuery = 0
      this.CloudItems = []
      this.CloudArchives = []
      this.CloudImages = []
      this.UserPublishedCollections = []
      _isFirstMetadataLoad = true
    },
    getLocalItem(sortkey: string): SyncableItem | undefined {
      const parts = sortkey.split('_')
      const datatype = parts[0]
      if (
        datatype === 'meta' ||
        datatype === 'archive' ||
        datatype === 'image' ||
        datatype === 'collection'
      )
        return undefined
      const rawType = parts[1]
      const id = parts[2]
      const normalized = normalizeItemType(rawType)

      const reg = getItemRegistration(normalized)
      if (reg) {
        return reg.getAll().find((item: any) => item.ID === id) as SyncableItem | undefined
      }

      if (normalized === 'npc') {
        return NpcStore().Npcs.find((n: any) => n.ID === id) as SyncableItem | undefined
      }
      if (normalized === 'collectionitem' || normalized === 'narrative') {
        return NarrativeStore().CollectionItems.find((n: any) => n.ID === id) as SyncableItem | undefined
      }

      logger.error('getLocalItem / unknown item type:', rawType)
      return undefined
    },
    setCloudDataItem(item: any): void {
      if (item.sortkey === 'meta') return

      const datatype = item.sortkey.split('_')[0]
      let arrType = ''
      switch (datatype) {
        case 'savedata':
          arrType = 'CloudItems'
          break
        case 'archive':
          arrType = 'CloudArchives'
          break
        case 'image':
          arrType = 'CloudImages'
          break
        case 'collection': {
          const localOwnedCollection = CompendiumStore().ContentCollections.find(
            x => x.ID === item.sortkey.split('_')[1]
          )
          if (localOwnedCollection) {
            localOwnedCollection.Metadata = item
          } else {
            logger.info('Unable to find local collection:', item)
          }
          arrType = 'UserPublishedCollections'
          break
        }
      }

      const idx = (this as any)[arrType].findIndex((i: any) => i.sortkey === item.sortkey)
      if (idx > -1) (this as any)[arrType][idx] = { ...(this as any)[arrType][idx], ...item }
      else (this as any)[arrType].push(item)
    },
    async setMetadataFromDynamo(): Promise<void> {
      const authStore = AuthStore()
      const umStore = UserMetadataStore()
      const notifStore = NotificationStore()

      if (this.LastQuery === 0 && authStore.Cognito.userId) {
        const stored = localStorage.getItem(`cc_last_query_${authStore.Cognito.userId}`)
        if (stored) this.LastQuery = parseInt(stored, 10) || 0
      }
      const doFullFetch = this.LastQuery === 0 || _isFirstMetadataLoad
      _isFirstMetadataLoad = false

      if (doFullFetch) {
        this.CloudArchives = []
        this.CloudItems = []
        this.CloudImages = []
        this.UserPublishedCollections = []

        const result = await getUserDataChanged(authStore.Cognito.userId!, 0)
        this.LastQuery = result.serverTime
        setServerTimeOffset(result.serverTime)
        if (authStore.Cognito.userId) {
          localStorage.setItem(
            `cc_last_query_${authStore.Cognito.userId}`,
            String(this.LastQuery)
          )
        }
        let totalSizeBytes = 0
        result.items.forEach((item: any) => {
          if (item.deleted) return
          const localItem = this.getLocalItem(item.sortkey)
          if (item.size && !isNaN(item.size)) totalSizeBytes += item.size
          if (localItem) {
            toRaw(localItem).CloudController.Metadata = item
          } else {
            this.setCloudDataItem(item)
          }
        })
        this.CloudStorageUsed = totalSizeBytes
      } else {
        const result = await getUserDataChanged(authStore.Cognito.userId!, this.LastQuery)
        this.LastQuery = result.serverTime
        setServerTimeOffset(result.serverTime)
        if (authStore.Cognito.userId) {
          localStorage.setItem(
            `cc_last_query_${authStore.Cognito.userId}`,
            String(this.LastQuery)
          )
        }

        let totalSizeBytes = this.CloudStorageUsed
        result.items.forEach((item: any) => {
          const localItem = this.getLocalItem(item.sortkey)
          if (item.deleted) {
            this.CloudItems = this.CloudItems.filter(x => x.sortkey !== item.sortkey)
            if (localItem) {
              const raw = toRaw(localItem) as any
              if (raw.SaveController && !raw.SaveController.IsDeleted) {
                raw.SaveController.DeleteTime = item.deleted
                raw.SaveController.saveSilent?.()
                notifStore.addCloudNotification(
                  `"${item.name}" was deleted on another device.`,
                  'warning'
                )
              }
            }
            return
          }
          if (localItem) {
            const oldSize = localItem.CloudController?.Metadata?.Size || 0
            const newSize = item.size && !isNaN(item.size) ? item.size : 0
            totalSizeBytes += newSize - oldSize
            toRaw(localItem).CloudController.Metadata = item
          } else {
            if (item.size && !isNaN(item.size)) totalSizeBytes += item.size
            this.setCloudDataItem(item)
          }
        })
        this.CloudStorageUsed = totalSizeBytes
      }

      const { RemoteItemStore } = await import('./RemoteItemStore')
      await RemoteItemStore().setMetadataForRemotes()

      umStore.UserMetadata  // touch to keep reactive
      this.SyncVersion++
    },
    async permDeleteFlaggedItems(): Promise<number> {
      const umStore = UserMetadataStore()
      const flagged = this.CloudItems.filter(x => x.deleted)

      const BULK_SIZE = 25
      for (let i = 0; i < flagged.length; i += BULK_SIZE) {
        const batch = flagged.slice(i, i + BULK_SIZE)
        const sortkeys = batch.map(item => item.sortkey)
        const uris = batch.filter(item => item.uri).map(item => item.uri)
        try {
          const result = await bulkDelete(umStore.UserMetadata.UserID, sortkeys, uris)
          if (result.unprocessed > 0) {
            logger.warn(`permDeleteFlaggedItems: ${result.unprocessed} unprocessed items`)
          }
        } catch (e) {
          logger.error(
            'permDeleteFlaggedItems: bulk delete failed, falling back to individual deletes',
            e
          )
          await Promise.allSettled(
            batch.map((item: any) =>
              cloudDelete(umStore.UserMetadata.UserID, item.sortkey, item.uri)
            )
          )
        }
      }

      const deletedSortkeys = new Set(flagged.map(x => x.sortkey))
      this.CloudItems = this.CloudItems.filter(x => !deletedSortkeys.has(x.sortkey))

      return flagged.length
    },
    async deleteAllCloudData(): Promise<void> {
      const umStore = UserMetadataStore()
      const allItems = [...this.CloudItems, ...this.CloudArchives, ...this.CloudImages]

      const BULK_SIZE = 25
      for (let i = 0; i < allItems.length; i += BULK_SIZE) {
        const batch = allItems.slice(i, i + BULK_SIZE)
        const sortkeys = batch.map(item => item.sortkey)
        const uris = batch.filter(item => item.uri).map(item => item.uri)

        try {
          const result = await bulkDelete(umStore.UserMetadata.UserID, sortkeys, uris)
          if (result.unprocessed > 0) {
            logger.warn(`Bulk delete had ${result.unprocessed} unprocessed items`)
          }
        } catch (e) {
          logger.error('Bulk delete failed, falling back to individual deletes:', e)
          await Promise.allSettled(
            batch.map((item: any) =>
              cloudDelete(umStore.UserMetadata.UserID, item.sortkey, item.uri)
            )
          )
        }
      }

      this.CloudItems = []
      this.CloudArchives = []
      this.CloudImages = []
      this.UserPublishedCollections = []
      umStore.UserMetadata.RemoteItems = []
      await umStore.setUserMetadata()
    },
  },
})
