import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController'
import type { ICloudSyncable } from '@/classes/components/cloud/ICloudSyncable'
import { normalizeItemType } from '@/classes/components/cloud/ItemTypeMap'
import { setSyncTimer as setSyncTimerService } from './SyncService'
import { AuthStore } from './AuthStore'
import { UserMetadataStore } from './UserMetadataStore'
import { CloudDataStore } from './CloudDataStore'
import { RemoteItemStore } from './RemoteItemStore'
import { NotificationStore } from './NotificationStore'
import { PilotStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import { EncounterStore } from '@/features/gm/store/encounter_store'
import { CampaignStore } from '@/features/gm/store/campaign_store'
import type { SyncableItem } from './CloudDataStore'
import logger from '../logger'

export type { SyncableItem }

export const SyncStore = defineStore('sync', {
  state: () => ({
    IsSyncing: false,
  }),
  getters: {
    AllItems(): SyncableItem[] {
      return [
        ...PilotStore().Pilots,
        ...PilotStore().PilotGroups.filter((x: any) => x.ID !== 'no_group'),
        ...NpcStore().Npcs,
        ...NarrativeStore().CollectionItems,
        ...EncounterStore().Encounters,
        ...CampaignStore().Campaigns,
        ...EncounterStore().ActiveEncounters,
        ...EncounterStore().ArchivedEncounters,
        ...PilotStore().PilotSheets,
      ] as SyncableItem[]
    },
    AllLocalItems(): SyncableItem[] {
      return this.AllItems.filter(x => !x.SaveController?.IsRemote)
    },
    AllRemoteItems(): SyncableItem[] {
      return this.AllItems.filter(x => x.SaveController?.IsRemote && !x.SaveController?.IsDeleted)
    },
    CloudOnlyItems(): SyncableItem[] {
      const cdStore = CloudDataStore()
      const localIds = new Set(this.AllLocalItems.map(y => y.ID))
      const raw = cdStore.CloudItems.filter(x => {
        if (x.deleted) return false
        const itemId = x.sortkey.split('_')[2]
        return !localIds.has(itemId)
      })

      return raw.map(x => ({
        raw: x,
        IsCloudOnly: true,
        Name: x.name,
        ID: x.sortkey.split('_')[2],
        ItemType: x.sortkey.split('_')[1],
        CloudController: {
          Metadata: new DbItemMetadata(x),
          isSynced: false,
          serverVersionChanged: false,
          syncFromCloud: async () => {
            throw new Error('CloudOnly items cannot syncFromCloud')
          },
        },
      })) as unknown as SyncableItem[]
    },
    AllSyncableItems(): SyncableItem[] {
      void CloudDataStore().SyncVersion
      return this.AllLocalItems.concat(this.CloudOnlyItems)
    },
    SyncItemTypes(): string[] {
      return CloudDataStore().SyncItemTypes
    },
    AllItemsToSync(): SyncableItem[] {
      const cdStore = CloudDataStore()
      const umStore = UserMetadataStore()
      return this.AllSyncableItems.filter(x => {
        if (x.SaveController?.IsDeleted) {
          return !!x.CloudController.Metadata?.Updated && !x.CloudController.Metadata?.Deleted
        }
        if (umStore.V2BackupIds.includes(x.ID)) return false
        const t = normalizeItemType(x.ItemType)
        if (t === 'encounterarchive') return false
        if (t === 'pilotsheet' && (x as any).Archived) {
          return cdStore.CloudItems.some(ci => ci.sortkey === x.CloudController.Metadata.SortKey)
        }
        return cdStore.SyncItemTypes.includes(t)
      }).filter(x => !x.CloudController.isSynced)
    },
    AllRemoteItemsToSync(): SyncableItem[] {
      const cdStore = CloudDataStore()
      const umStore = UserMetadataStore()
      return this.AllRemoteItems.filter(x => {
        if (x.SaveController?.IsDeleted) return false
        if (umStore.V2BackupIds.includes(x.ID)) return false
        return cdStore.SyncItemTypes.includes(normalizeItemType(x.ItemType))
      }).filter(x => !x.CloudController.isSynced)
    },
    ItemsRequiringUpdate(): SyncableItem[] {
      return this.AllSyncableItems.filter(item => {
        if (!item.CloudController) return true
        return !item.CloudController.isSynced
      })
    },
  },
  actions: {
    async refreshDbData(): Promise<void> {
      if (!AuthStore().IsLoggedIn) {
        logger.error('User is not logged in')
        return
      }
      if (this.IsSyncing) return
      await UserMetadataStore().getUserMetadata()
      await CloudDataStore().setMetadataFromDynamo()
    },
    async AutoSync(
      overrideTo?: 'upload' | 'download',
      isStartup = false,
      skipSync = false
    ): Promise<any[]> {
      if (this.IsSyncing) return []
      this.IsSyncing = true
      try {
        return await this._autoSyncImpl(overrideTo, isStartup, skipSync)
      } finally {
        this.IsSyncing = false
      }
    },
    async _autoSyncImpl(
      overrideTo?: 'upload' | 'download',
      isStartup = false,
      skipSync = false
    ): Promise<any[]> {
      const umStore = UserMetadataStore()
      const notifStore = NotificationStore()
      await umStore.getUserMetadata()
      await CloudDataStore().setMetadataFromDynamo()
      if (skipSync) return []
      if (!umStore.SyncSettings) return []
      if (isStartup) {
        const frequency = umStore.SyncSettings?.frequency?.toLowerCase() ?? ''
        if (!frequency.includes('start')) return []
      }

      const { UserStore } = await import('./index')
      const uStore = UserStore()
      const cloudLatestChange = umStore.UserMetadata?.UserSettingData?.latest_change ?? 0
      if (uStore.User.latest_change >= cloudLatestChange) {
        await umStore.setUserMetadata()
      }

      const items = this.AllItemsToSync
      const failures: any[] = []

      if (overrideTo === 'download') {
        for (const item of items) {
          try {
            if (item.IsCloudOnly) {
              await CloudController.ForceDownload(item)
            } else {
              await item.CloudController.syncFromCloud()
            }
          } catch (e) {
            logger.error('AutoSync force-download error:', e)
            failures.push({ item, error: e })
          }
        }
      } else if (overrideTo === 'upload') {
        const localItems = items.filter(x => !x.IsCloudOnly)
        try {
          const batchFailures = await CloudController.BatchUpdateCloud(
            localItems as unknown as ICloudSyncable[]
          )
          failures.push(...batchFailures)
        } catch (e) {
          logger.error('AutoSync force-upload batch error:', e)
          localItems.forEach(item => failures.push({ item, error: e }))
        }
      } else {
        const cloudOnly = items.filter(x => x.IsCloudOnly)
        const localItems = items.filter(x => !x.IsCloudOnly)

        for (const item of cloudOnly) {
          try {
            await CloudController.ForceDownload(item)
          } catch (e) {
            logger.error('AutoSync cloud-only download error:', e)
            failures.push({ item, error: e })
          }
        }

        const toMerge: any[] = []
        const toUpload: any[] = []

        for (const item of localItems) {
          if (item.CloudController.serverVersionChanged) {
            toMerge.push(item)
          } else {
            toUpload.push(item)
          }
        }

        for (const item of toMerge) {
          try {
            await item.CloudController.syncFromCloud()
          } catch (e) {
            logger.error('AutoSync merge error:', e)
            failures.push({ item, error: e })
          }
        }

        if (toUpload.length > 0) {
          try {
            const batchFailures = await CloudController.BatchUpdateCloud(
              toUpload as unknown as ICloudSyncable[]
            )
            failures.push(...batchFailures)
          } catch (e) {
            logger.error('AutoSync batch upload error:', e)
            toUpload.forEach(item => failures.push({ item, error: e }))
          }
        }
      }

      const remoteStore = RemoteItemStore()
      for (const item of this.AllRemoteItems) {
        const code = (item as any).SaveController?.RemoteCode
        if (code && remoteStore.BrokenRemoteCodes.includes(code)) continue
        try {
          await CloudController.UpdateRemote(item)
        } catch (e) {
          logger.error('AutoSync remote update error:', e)
          failures.push({ item, error: e })
        }
      }

      await CloudDataStore().setMetadataFromDynamo()

      if (umStore.SyncSettings) umStore.SyncSettings.lastSyncTime = Date.now()

      const succeeded = items.length - failures.length
      if (items.length > 0) {
        if (failures.length === 0) {
          notifStore.addCloudNotification(
            `Synced ${items.length} item${items.length !== 1 ? 's' : ''} successfully.`
          )
        } else if (succeeded > 0) {
          notifStore.addCloudNotification(
            `Synced ${succeeded} of ${items.length} item${items.length !== 1 ? 's' : ''}. ${failures.length} failed.`,
            'warning'
          )
        }
      }

      return failures
    },
    async OnUnload(): Promise<void> {
      if (!UserMetadataStore().SyncSettings?.frequency?.toLowerCase().includes('close')) return
      await this.AutoSync()
    },
    setSyncTimer(): void {
      const freq = UserMetadataStore().SyncSettings?.frequency ?? ''
      setSyncTimerService(freq, async () => {
        logger.info('AutoSync Timer Triggered')
        await this.AutoSync()
      })
    },
    async removeOldItems(): Promise<string> {
      const [{ UserStore }, { allRegistrations }] = await Promise.all([
        import('./index'),
        import('@/classes/components/cloud/ItemRegistry'),
      ])
      const user = UserStore().User
      if (!user.AutoDeleteDays || user.AutoDeleteDays <= 0) {
        return 'Auto-delete is disabled.\n'
      }
      const threshold = Date.now() - user.AutoDeleteDays * 86_400_000
      const deleted: string[] = []
      const promises: Promise<void>[] = []

      for (const [type, reg] of allRegistrations()) {
        if (type === 'campaign' || type === 'pilotgroup') continue
        for (const item of reg.getAll() as any[]) {
          if (item.SaveController?.IsDeleted && item.SaveController.DeleteTime < threshold) {
            promises.push(
              reg.deleteLocal(item).then(() => {
                deleted.push(`Permanently Deleted ${type}: ${item.Name ?? item.Title ?? item.ID}`)
              })
            )
          }
        }
      }

      await Promise.all(promises)
      return deleted.length ? deleted.join('\n') + '\n' : 'No items to remove\n'
    },
  },
})
