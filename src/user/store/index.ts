import { defineStore } from 'pinia'
import { debounce } from 'lodash-es'
import * as Client from '../index'
import {
  CampaignStore,
  CompendiumStore,
  EncounterStore,
  NarrativeStore,
  NpcStore,
  PilotStore,
} from '@/stores'
import { Pilot } from '@/classes/pilot/Pilot'
import { Encounter } from '@/classes/encounter/Encounter'
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth'
import {
  getUser,
  updateUser,
  getUserData,
  getUserDataChanged,
  cloudDelete,
  bulkDelete,
  patchItem,
  GetFromCode,
  downloadFromS3,
  getFromPresignDirect,
  VersionConflictError,
  UnauthorizedError,
} from '@/io/apis/account'
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController'
import { expandFilterTypes, normalizeItemType } from '@/classes/components/cloud/ItemTypeMap'
import { ImportStagedData, StageImport } from '@/io/Importer'
import { getItemDownloadLink } from '../api'
import { parseContentPack } from '@/io/ContentPackParser'
import logger from '../logger'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterArchive } from '@/classes/encounter/EncounterArchive'
import PilotSheet from '@/features/pilot_management/store/PilotSheet'
import { withSyncLock, isSyncLocked, setSyncTimer as setSyncTimerService } from './SyncService'
import { pruneBackups, autoBackup } from './BackupService'
import * as OAuthService from './OAuthService'
import { SyncQueue } from './SyncQueue'

let _pendingMetadataResolvers: Array<() => void> = []

const _debouncedSetUserMetadata = debounce(
  async (store: any) => {
    try {
      store.User.save()
      const userSettings = await Client.getLocalProfile()
      const payload: Record<string, any> = {
        username: store.UserMetadata.Username,
        collection_subscription_settings: store.UserMetadata.CollectionSubscriptionSettings,
        remote_items: [...new Set(store.UserMetadata.RemoteItems)],
        sync_settings: store.UserMetadata.SyncSettings,
        user_setting_data: Client.UserProfile.Serialize(userSettings),
        patreon_data: store.UserMetadata.PatreonData,
        itch_data: store.UserMetadata.ItchData,
      }
      // Use PATCH semantics: only send changed fields to avoid full-replace overwrites
      await patchItem('meta', payload)
    } finally {
      const resolvers = _pendingMetadataResolvers
      _pendingMetadataResolvers = []
      resolvers.forEach(r => r())
    }
  },
  2000,
  { leading: false, trailing: true }
)

const DefaultSyncSettings = {
  frequency: 'manual',
  itemTypes: ['pilot', 'npc', 'campaign', 'encounter', 'collectionitem'],
  includeSettings: true,
  includeShared: true,
  resolutionStrategy: 'newest',
  autoBackupFrequency: 'none',
  autoBackupLimit: 30,
  autoBackupPrunePct: 30,
  lastBackupTime: 0,
}

type CollectionSubscriptionSettings = {
  updateOn: string
  items: { code: string; metadata: any }[]
}

const DefaultCollectionSettings = {
  updateOn: 'manual',
  items: [] as any[],
}

class UserMetadata {
  public static readonly Sortkey = 'meta'
  public UserID: string
  public Username: string
  public CreatedAt: number
  public UpdatedAt: number
  public SyncSettings: any
  public UserSettingData: Client.IUserProfile
  public CollectionSubscriptionSettings: CollectionSubscriptionSettings
  public RemoteItems: string[]
  public UserMigrated: boolean
  public PatreonData: any
  public ItchData: any

  public constructor(data: any) {
    this.UserID = data.user_id
    this.Username = data.username
    this.CreatedAt = data.created_at
    this.UpdatedAt = data.updated_at
    if (!data.sync_settings) this.SyncSettings = DefaultSyncSettings
    else this.SyncSettings = data.sync_settings
    if (!data.collection_subscription_settings)
      this.CollectionSubscriptionSettings = DefaultCollectionSettings
    else this.CollectionSubscriptionSettings = data.collection_subscription_settings
    this.UserSettingData = data.user_setting_data
    this.RemoteItems = data.remote_items || []
    this.UserMigrated = data.user_migrated || false
    this.PatreonData = data.patreon_data || { hasPatreon: false }
    this.ItchData = data.itch_data || { hasItch: false, user: { id: 1 }, gamedata: [] }
  }
}

export const UserStore = defineStore('cloud', {
  state: () => ({
    IsLoading: false,
    User: {} as Client.UserProfile,
    UserMetadata: {} as UserMetadata,
    Cognito: {} as any,
    CloudItems: [] as any[],
    CloudArchives: [] as any[],
    CloudImages: [] as any[],
    UserPublishedCollections: [] as any[],
    RemoteCollections: [] as any[],
    LastQuery: 0,
    CloudStorageUsed: 0,
    StorageWarning: false,
    StorageFull: false,
    IsLoggedIn: false,
    IsSyncing: false,
    CloudNotifications: [] as any[],
  }),
  getters: {
    MaxCloudStorage: state => {
      let baseMbVal
      switch (state.User.PatreonTierValue) {
        case 1:
          baseMbVal = 1000
          break
        case 2:
          baseMbVal = 5000
          break
        case 3:
        case 4:
        case 5:
          baseMbVal = 10000
          break
        default:
          baseMbVal = 100
          break
      }
      return baseMbVal * 1024 * 1024
    },
    CollectionPublishLimit: state => {
      switch (state.User.PatreonTierValue) {
        case 1:
          return 3
        case 2:
        case 3:
        case 4:
        case 5:
          return -1
        default:
          return 0
      }
    },
    CloudStorageFull(): boolean {
      return this.CloudStorageUsed > this.MaxCloudStorage
    },
    SyncItemTypes: state => {
      return expandFilterTypes(state.UserMetadata.SyncSettings.itemTypes)
    },
    SyncSettings: state => state.UserMetadata.SyncSettings,
    ItemsRequiringUpdate(): any[] {
      return this.AllSyncableItems.filter(item => {
        if (!item.CloudController) return true
        return item.CloudController.SyncStatus !== 'Synced'
      })
    },
    AllItems(): any[] {
      return [
        ...PilotStore().Pilots,
        ...NpcStore().Npcs,
        ...NarrativeStore().CollectionItems,
        ...EncounterStore().Encounters,
        ...CampaignStore().Campaigns,
        ...EncounterStore().ActiveEncounters,
        ...EncounterStore().ArchivedEncounters,
        ...PilotStore().PilotSheets,
      ].filter(x => !x.SaveController.IsDeleted)
    },
    AllLocalItems(): any[] {
      return this.AllItems.filter(x => !x.SaveController.IsDeleted && !x.SaveController.IsRemote)
    },
    AllRemoteItems(): any[] {
      return this.AllItems.filter(x => !x.SaveController.IsDeleted && x.SaveController.IsRemote)
    },
    CloudOnlyItems(): any[] {
      const raw = UserStore().CloudItems.filter(x => {
        const itemId = x.sortkey.split('_')[2]
        return !this.AllLocalItems.some(y => !!y && y.ID === itemId)
      })

      return raw.map(x => ({
        raw: x,
        IsCloudOnly: true,
        Name: x.name,
        ID: x.sortkey.split('_')[2],
        ItemType: x.sortkey.split('_')[1],
        CloudController: {
          Metadata: new DbItemMetadata(x),
          SyncStatus: 'CloudOnly',
        },
      }))
    },
    UserCollections(): any[] {
      const data = CompendiumStore().ContentCollections
      data.forEach(c => {
        const meta = this.UserPublishedCollections.find(x => x.sortkey.split('_')[1] === c.ID)
        if (meta) c.Metadata = meta
      })
      return data
    },
    // does not include remote items
    AllSyncableItems(): any[] {
      return this.AllLocalItems.concat(this.CloudOnlyItems)
    },
    AllItemsToSync(): any[] {
      return this.AllSyncableItems.filter(x => {
        return this.SyncItemTypes.includes(normalizeItemType(x.ItemType))
      }).filter(x => x.CloudController.SyncStatus !== 'Synced')
    },
    AllRemoteItemsToSync(): any[] {
      return this.AllRemoteItems.filter(x => {
        return this.SyncItemTypes.includes(normalizeItemType(x.ItemType))
      }).filter(x => x.CloudController.SyncStatus !== 'Synced')
    },
    BackupSpaceExceeded(): boolean {
      if (this.CloudStorageFull) return true
      const backups = this.CloudArchives
      const sizeTotal = backups.reduce((acc, obj) => acc + obj.size, 0)
      return sizeTotal > this.MaxCloudStorage * (this.SyncSettings.autoBackupPrunePct / 100)
    },
    BackupLimitExceeded(): boolean {
      if (this.CloudStorageFull) return true
      return this.CloudArchives.length > this.SyncSettings.autoBackupLimit
    },
    PrunableBackups(): any[] {
      const backups = this.CloudArchives.filter(x => !x.preserve)
      const sizeTotal = backups.reduce((acc, obj) => acc + obj.size, 0)
      const pruneSize = this.MaxCloudStorage * (this.SyncSettings.autoBackupPrunePct / 100)
      const pruneCount = this.SyncSettings.autoBackupLimit
      if (sizeTotal < pruneSize && backups.length < pruneCount) return []

      const sorted = backups.sort((a, b) => a.created - b.created)

      const toDelete = [] as any[]
      let totalSize = 0
      let count = 0
      for (const idx in sorted) {
        const item = sorted[idx]
        totalSize += item.size
        count++
        if (totalSize > pruneSize || count > pruneCount) toDelete.push(item)
      }

      return toDelete
    },
  },
  actions: {
    async loadUser(): Promise<void> {
      this.User = await Client.getLocalProfile()

      await this.setCognito()

      const est = await navigator.storage.estimate()
      const currentPct = ((est.usage || 0) / (est.quota || 1)) * 100
      if (currentPct > this.User.StorageWarning) {
        this.setStorageWarning(true)
      }
      if (currentPct > this.User.StorageMax) {
        this.setStorageFull(true)
      }
    },
    async setCognito(): Promise<void> {
      try {
        this.Cognito = await getCurrentUser()
        // refresh session if necessary
        await fetchAuthSession()
        this.IsLoggedIn = true
      } catch (e) {
        logger.warn(`User not logged in or cannot autologin`)
        this.IsLoggedIn = false
      }
    },
    signOut(): void {
      this.IsLoggedIn = false
      this.Cognito = {}
    },
    async refreshDbData(): Promise<void> {
      if (!this.IsLoggedIn) {
        logger.error('User is not logged in')
        return
      }
      await this.getUserMetadata()
      await this.setMetadataFromDynamo()
    },
    async getUserMetadata(): Promise<void> {
      let data: any
      try {
        data = await getUser(this.Cognito.userId)
      } catch (e) {
        if (e instanceof UnauthorizedError) {
          logger.warn('Unauthorized response from server — signing out')
          try {
            await signOut()
          } catch (_) {
            // ignore signOut errors
          }
          this.signOut()
          throw e
        }
        throw e
      }
      this.UserMetadata = new UserMetadata(data)
      if (this.UserMetadata.UserSettingData) {
        if (
          this.UserMetadata.SyncSettings.includeSettings &&
          this.UserMetadata.UserSettingData.latest_change > this.User.latest_change
        ) {
          this.User = Client.UserProfile.Deserialize(this.UserMetadata.UserSettingData)
        }
        if (
          this.UserMetadata.UserSettingData.achievement_unlocks.length >
          this.User.AchievementUnlocks.length
        )
          this.User.AchievementUnlocks = this.UserMetadata.UserSettingData.achievement_unlocks
      }
    },
    async setUserMetadata(): Promise<void> {
      return new Promise<void>(resolve => {
        _pendingMetadataResolvers.push(resolve)
        _debouncedSetUserMetadata(this)
      })
    },
    async setMetadataFromDynamo(): Promise<void> {
      // On first load (LastQuery === 0), do full fetch then switch to delta sync
      if (this.LastQuery === 0) {
        // Full sync
        this.CloudArchives = []
        this.CloudItems = []
        this.CloudImages = []
        this.UserPublishedCollections = []

        const data = await getUserData(this.Cognito.userId)
        this.LastQuery = Date.now()
        let totalSizeBytes = 0
        data.forEach(item => {
          const localItem = this.getLocalItem(item.sortkey)
          if (item.size && !isNaN(item.size)) totalSizeBytes += item.size
          if (localItem) {
            localItem.CloudController.Metadata = item
          } else {
            this.setCloudDataItem(item)
          }
        })
        this.CloudStorageUsed = totalSizeBytes
      } else {
        // Delta sync: only fetch items changed since last query
        const result = await getUserDataChanged(this.Cognito.userId, this.LastQuery)
        this.LastQuery = result.serverTime

        let totalSizeBytes = this.CloudStorageUsed
        result.items.forEach(item => {
          const localItem = this.getLocalItem(item.sortkey)
          if (localItem) {
            // Update size delta
            const oldSize = localItem.CloudController?.Metadata?.Size || 0
            const newSize = item.size && !isNaN(item.size) ? item.size : 0
            totalSizeBytes += newSize - oldSize
            localItem.CloudController.Metadata = item
          } else {
            if (item.size && !isNaN(item.size)) totalSizeBytes += item.size
            this.setCloudDataItem(item)
          }
        })
        this.CloudStorageUsed = totalSizeBytes
      }

      await this.setMetadataForRemotes()
    },
    async setMetadataForRemotes(): Promise<void> {
      const remotes = this.UserMetadata.RemoteItems
      if (!remotes || remotes.length === 0) return

      let data
      try {
        const result = await GetFromCode(remotes)
        data = Array.isArray(result) ? result : [result]
      } catch (e) {
        logger.error('Failed to batch-fetch remote item metadata:', e)
        return
      }

      const downloadPromises: Promise<void>[] = []
      for (const item of data) {
        const localItem = this.getLocalItem(item.sortkey)
        if (localItem) {
          localItem.CloudController.Metadata = item
        } else {
          downloadPromises.push(
            (async () => {
              const itemData = await downloadFromS3(item.uri)
              const itemType = item.sortkey.split('_')[1]
              const newItem = CloudController.NewByType(itemType, itemData)
              newItem.CloudController.setRemoteMetadata(item)
              await CloudController.AddByType(itemType, newItem)
            })()
          )
        }
      }

      await Promise.allSettled(downloadPromises)
    },
    async getRemoteCollectionMetadata(startup = false): Promise<void> {
      const collectionSettings = this.UserMetadata.CollectionSubscriptionSettings
      if (!collectionSettings?.items?.length) return

      const uniqueCodes = [...new Set(collectionSettings.items.map(i => i.code))]

      let data
      try {
        const result = await GetFromCode(uniqueCodes)
        data = Array.isArray(result) ? result : [result]
      } catch (e) {
        logger.error('Unable to batch-fetch remote collection metadata', e)
        return
      }

      this.RemoteCollections = data

      if (startup && collectionSettings.updateOn === 'startup') {
        for (const item of this.RemoteCollections) {
          try {
            await this.updateRemoteCollection(item)
          } catch (e) {
            logger.error(`Unable to update remote collection ${item.code}`, e)
          }
        }
      }
    },
    async updateRemoteCollection(collection): Promise<string[]> {
      const uri = collection.uri
      if (!uri) {
        throw new Error('Collection has no uri:', collection)
      }

      const data = await downloadFromS3(uri)
      const staged = await StageImport(data)
      const errors = await ImportStagedData(staged, collection)
      const settingsIndex = this.UserMetadata.CollectionSubscriptionSettings.items.findIndex(
        item => item.code === collection.code
      )
      if (settingsIndex > -1) {
        this.UserMetadata.CollectionSubscriptionSettings.items[settingsIndex].metadata = collection
        await this.setUserMetadata()
      }
      this.addCloudNotification(
        `Updated Collection: ${collection.name} to version ${collection.version}`
      )
      return errors
    },
    updateAllRemoteCollections(): void {
      for (const item of this.UserMetadata.CollectionSubscriptionSettings.items) {
        const localSubscription = this.UserMetadata.CollectionSubscriptionSettings.items.find(
          x => x.metadata.id === item.metadata.id
        )

        if (localSubscription && localSubscription.metadata.version === item.metadata.version) {
          logger.info('Collection is up to date:', item)
        } else {
          this.updateRemoteCollection(item)
        }
      }
    },
    getLocalItem(sortkey: string): any {
      const datatype = sortkey.split('_')[0]
      if (datatype.includes('meta')) return
      if (datatype.includes('archive')) return
      if (datatype.includes('image')) return
      if (datatype.includes('collection')) return

      const itemType = sortkey.split('_')[1]
      const id = sortkey.split('_')[2]
      switch (normalizeItemType(itemType)) {
        case 'pilot':
          return PilotStore().Pilots.find(p => p.ID === id)
        case 'npc':
        case 'unit':
        case 'doodad':
        case 'eidolon':
          return NpcStore().Npcs.find(n => n.ID === id)
        case 'encounter':
          return EncounterStore().Encounters.find(e => e.ID === id)
        case 'collectionitem':
        case 'narrative':
        case 'character':
        case 'faction':
        case 'location':
          return NarrativeStore().CollectionItems.find(n => n.ID === id)
        case 'campaign':
          return CampaignStore().Campaigns.find(n => n.ID === id)
        case 'encounterinstance':
          return EncounterStore().ActiveEncounters.find(n => n.ID === id)
        case 'encounterarchive':
          return EncounterStore().ArchivedEncounters.find(n => n.ID === id)
        case 'pilotsheet':
          return PilotStore().PilotSheets.find(p => p.ID === id)
        default:
          logger.error('Get Local Item/Unknown item type:', itemType)
          break
      }
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
            logger.error('Unable to find local collection:', item)
          }
          arrType = 'UserPublishedCollections'
          break
        }
      }

      const idx = this[arrType].findIndex(i => i.sortkey === item.sortkey)
      if (idx > -1) this[arrType][idx] = { ...this[arrType][idx], ...item }
      else this[arrType].push(item)
    },
    async AutoSync(
      overrideTo?: 'cloud' | 'local' | 'newest',
      isStartup = false,
      skipSync = false
    ): Promise<any[]> {
      return withSyncLock(async () => {
        await this.refreshDbData()
        if (skipSync) return []
        if (!this.SyncSettings) return []
        if (isStartup) {
          const frequency = this.SyncSettings?.frequency?.toLowerCase() ?? ''
          if (!frequency.includes('start')) return []
        }
        const strategy = this.SyncSettings.resolutionStrategy
        if (strategy === 'manual') return []
        const items = this.AllItemsToSync
        const failures = [] as any[]
        const queue = await SyncQueue.getInstance()

        // Determine which items need to be pushed to cloud vs pulled from cloud
        const toCloud: any[] = []
        const toLocal: any[] = []
        const toNewest: any[] = []

        for (const item of items) {
          if (overrideTo === 'cloud') {
            toCloud.push(item)
          } else if (overrideTo === 'local') {
            toLocal.push(item)
          } else if (overrideTo === 'newest') {
            toNewest.push(item)
          } else {
            // Use strategy
            switch (strategy) {
              case 'local':
                if (item.IsCloudOnly) toCloud.push(item)
                else toLocal.push(item)
                break
              case 'cloud':
                toCloud.push(item)
                break
              case 'newest':
                toNewest.push(item)
                break
            }
          }
        }

        // Separate newest into cloud/local based on status
        for (const item of toNewest) {
          if (item.IsCloudOnly || item.CloudController.SyncStatus === 'CloudNewer')
            toCloud.push(item)
          else toLocal.push(item)
        }

        // Handle items to pull from cloud (can't batch these — each is a separate download)
        for (const item of toCloud) {
          const sortKey = item.CloudController?.Metadata?.sortkey
          try {
            if (sortKey) await queue.enqueue(sortKey)
            await CloudController.SyncToCloud(item)
            if (sortKey) await queue.dequeue(sortKey)
          } catch (e) {
            logger.error('AutoSync SyncToCloud Error:', e)
            if (sortKey) await queue.recordFailure(sortKey, String(e))
            failures.push({ item, error: e })
          }
        }

        // Handle items to push to local (cloud) — use batch upload
        if (toLocal.length > 0) {
          // Enqueue all
          for (const item of toLocal) {
            const sortKey = item.CloudController?.Metadata?.sortkey
            if (sortKey) await queue.enqueue(sortKey)
          }

          try {
            const batchFailures = await CloudController.BatchUpdateCloud(toLocal)
            failures.push(...batchFailures)
          } catch (e) {
            logger.error('AutoSync batch upload error:', e)
            // If batch fails entirely, record failures for all
            for (const item of toLocal) {
              const sortKey = item.CloudController?.Metadata?.sortkey
              if (sortKey) await queue.recordFailure(sortKey, String(e))
              failures.push({ item, error: e })
            }
          }

          // Dequeue successful items
          for (const item of toLocal) {
            const sortKey = item.CloudController?.Metadata?.sortkey
            const failed = failures.some(f => f.item === item)
            if (sortKey && !failed) await queue.dequeue(sortKey)
          }
        }

        if (this.SyncSettings.includeShared)
          for (const idx in this.AllRemoteItems) {
            const item = this.AllRemoteItems[idx]
            try {
              await CloudController.UpdateRemote(item)
            } catch (e) {
              logger.error('AutoSync Error:', e)
              failures.push({ item, error: e })
            }
          }

        await this.setMetadataFromDynamo()
        return failures
      })
    },
    async OnUnload(): Promise<void> {
      if (!this.SyncSettings?.frequency?.toLowerCase().includes('close')) return
      await this.AutoSync()
    },
    async PruneBackups(): Promise<void> {
      await pruneBackups(this)
    },
    async AutoBackup(startup = false): Promise<void> {
      await autoBackup(this, startup)
    },
    setSyncTimer(): void {
      setSyncTimerService(this.SyncSettings?.frequency ?? '', async () => {
        logger.info('AutoSync Timer Triggered')
        await this.AutoSync()
      })
    },
    setStorageWarning(warning: boolean): void {
      this.StorageWarning = warning
    },
    setStorageFull(full: boolean): void {
      this.StorageFull = full
    },
    addRemoteItem(code: string) {
      this.UserMetadata.RemoteItems.push(code)
      this.setUserMetadata()
    },
    deleteRemoteItem(code: string) {
      const idx = this.UserMetadata.RemoteItems.findIndex(x => x === code)
      if (idx === -1) return
      this.UserMetadata.RemoteItems.splice(idx, 1)
      this.setUserMetadata()
    },
    async addContentSubscription(metadata: any) {
      this.UserMetadata.CollectionSubscriptionSettings.items.push({
        code: metadata.code,
        metadata,
      })
      this.RemoteCollections.push(metadata)
      await this.setUserMetadata()
    },
    async removeContentSubscription(collection: any) {
      const idx = this.UserMetadata.CollectionSubscriptionSettings.items.findIndex(
        x => x.code === collection.code
      )
      if (idx === -1) return
      this.UserMetadata.CollectionSubscriptionSettings.items.splice(idx, 1)
      this.RemoteCollections = this.RemoteCollections.filter(x => x.code !== collection.code)
      await this.setUserMetadata()
    },
    async removeOldItems(): Promise<string> {
      if (!this.User.AutoDeleteDays || this.User.AutoDeleteDays <= 0) {
        return 'Auto-delete is disabled.\n'
      }
      const removeThreshold = new Date().setDate(new Date().getDate() - this.User.AutoDeleteDays)
      let out = `removing items older than ${new Date(removeThreshold).toLocaleString()}...\n`
      const outArr = [] as string[]
      const promises = [] as Promise<void>[]

      PilotStore().Pilots.forEach(p => {
        if (p.SaveController.IsDeleted && p.SaveController.DeleteTime < removeThreshold) {
          promises.push(PilotStore().DeletePilotPermanent(p as Pilot))
          outArr.push(`Permanently Deleted Pilot: ${p.Name}\n`)
        }
      })

      NpcStore().Npcs.forEach(n => {
        if (n.SaveController.IsDeleted && n.SaveController.DeleteTime < removeThreshold) {
          promises.push(NpcStore().DeleteNpcPermanent(n as any))
          outArr.push(`Permanently Deleted NPC: ${n.Name}\n`)
        }
      })

      NarrativeStore().CollectionItems.forEach(n => {
        if (n.SaveController.IsDeleted && n.SaveController.DeleteTime < removeThreshold) {
          promises.push(NarrativeStore().DeleteItemPermanent(n))
          outArr.push(`Permanently Deleted Narrative: ${n.Title}\n`)
        }
      })

      EncounterStore().Encounters.forEach(e => {
        if (e.SaveController.IsDeleted && e.SaveController.DeleteTime < removeThreshold) {
          promises.push(EncounterStore().DeleteEncounterPermanent(e as Encounter))
          outArr.push(`Permanently Deleted Encounter: ${e.Name}\n`)
        }
      })

      EncounterStore().ActiveEncounters.forEach(e => {
        if (e.SaveController.IsDeleted && e.SaveController.DeleteTime < removeThreshold) {
          promises.push(EncounterStore().RemoveEncounterInstance(e as EncounterInstance))
          outArr.push(`Permanently Deleted Active Encounter: ${e.Name}\n`)
        }
      })

      EncounterStore().ArchivedEncounters.forEach(e => {
        if (e.SaveController.IsDeleted && e.SaveController.DeleteTime < removeThreshold) {
          promises.push(EncounterStore().RemoveEncounterArchive(e as EncounterArchive))
          outArr.push(`Permanently Deleted Archived Encounter: ${e.Name}\n`)
        }
      })

      PilotStore().PilotSheets.forEach(p => {
        if (p.SaveController.IsDeleted && p.SaveController.DeleteTime < removeThreshold) {
          promises.push(PilotStore().RemovePilotSheet(p as PilotSheet))
          outArr.push(`Permanently Deleted Pilot Sheet: ${p.Name}\n`)
        }
      })

      await Promise.all(promises)

      if (outArr.length) out += outArr.join('')
      else out += 'No items to remove\n'

      return out
    },
    async deleteAllCloudData(): Promise<void> {
      const allItems = [...this.CloudItems, ...this.CloudArchives, ...this.CloudImages]

      // Bulk delete in groups of 25 (DynamoDB BatchWriteItem limit)
      const BULK_SIZE = 25
      for (let i = 0; i < allItems.length; i += BULK_SIZE) {
        const batch = allItems.slice(i, i + BULK_SIZE)
        const sortkeys = batch.map(item => item.sortkey)
        const uris = batch.filter(item => item.uri).map(item => item.uri)

        try {
          const result = await bulkDelete(this.UserMetadata.UserID, sortkeys, uris)
          if (result.unprocessed > 0) {
            logger.warn(`Bulk delete had ${result.unprocessed} unprocessed items`)
          }
        } catch (e) {
          logger.error('Bulk delete failed, falling back to individual deletes:', e)
          // Fallback to individual deletes
          await Promise.allSettled(
            batch.map(item => cloudDelete(this.UserMetadata.UserID, item.sortkey, item.uri))
          )
        }
      }

      this.CloudItems = []
      this.CloudArchives = []
      this.CloudImages = []
      this.UserPublishedCollections = []
      this.UserMetadata.RemoteItems = []
      this.setUserMetadata()
    },
    async setPatreonData(data: any): Promise<void> {
      await OAuthService.setPatreonData(this, data)
    },

    async refreshPatreonData(): Promise<string> {
      return OAuthService.refreshPatreonData(this)
    },
    setItchData(access_token: string, data: any): void {
      OAuthService.setItchData(this, access_token, data)
    },

    async refreshItchData(): Promise<string> {
      return OAuthService.refreshItchData(this)
    },
    async downloadLcp(dbItem: any): Promise<void> {
      const presign = await getItemDownloadLink(
        this.UserMetadata.ItchData.user.id,
        dbItem.game_id,
        dbItem.uri
      )
      const file = await getFromPresignDirect(presign)
      const fileData = await this.readAsBinaryStringAsync(file)
      const lcp = await parseContentPack(fileData as string)
      lcp.active = true
      await CompendiumStore().installContentPack(lcp)
    },
    readAsBinaryStringAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(reader.error)
        reader.readAsBinaryString(file)
      })
    },
    addCloudNotification(text: string, type = 'success'): void {
      this.CloudNotifications.push({ text, type })
    },
    clearCloudNotifications(): void {
      this.CloudNotifications = []
    },
    removeCloudNotification(idx: number): void {
      this.CloudNotifications.splice(idx, 1)
    },
  },
})
