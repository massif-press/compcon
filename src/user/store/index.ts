import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { GetTotalStorageSize } from '@/io/Storage'
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
  getUserDataChanged,
  cloudDelete,
  bulkDelete,
  patchItem,
  GetFromCode,
  DownloadViaCode,
  downloadFromS3,
  getFromPresignDirect,
  UnauthorizedError,
  NotFoundError,
} from '@/io/apis/account'
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController'
import type { dbItemMeta } from '@/classes/components/cloud/CloudController'
import type { ICloudSyncable } from '@/classes/components/cloud/ICloudSyncable'
import { expandFilterTypes, normalizeItemType } from '@/classes/components/cloud/ItemTypeMap'
import { ImportStagedData, StageImport } from '@/io/Importer'
import { getItemDownloadLink } from '../api'
import { parseContentPack } from '@/io/ContentPackParser'
import logger from '../logger'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterArchive } from '@/classes/encounter/EncounterArchive'
import PilotSheet from '@/features/pilot_management/store/PilotSheet'
import { setSyncTimer as setSyncTimerService } from './SyncService'
import { pruneBackups, autoBackup } from './BackupService'
import * as OAuthService from './OAuthService'
import { checkV2CloudData, type V2CloudDetectResult } from '@/io/V2CloudImporter'
import { getV2Backups } from '@/io/V2Importer'

import type { PatreonData } from '../index'

export type SyncSettings = {
  frequency: string
  itemTypes: string[]
  includeSettings: boolean
  includeShared: boolean
  autoBackupFrequency: string
  autoBackupLimit: number
  autoBackupPrunePct: number
  lastBackupTime: number
  lastSyncTime: number
}

export type ItchData = {
  hasItch: boolean
  user: { id: number }
  gamedata: Array<{ game_id: number; [key: string]: unknown }>
  token?: string
  lastUpdate?: number
}

export type CloudNotification = {
  text: string
  type: string
}

export interface SyncableItem {
  ID: string
  Name: string
  ItemType: string
  CloudController: {
    Metadata: DbItemMetadata
    isSynced: boolean
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

let _pendingMetadataResolvers: Array<() => void> = []
let _lastUserMetadataFetch = 0
const USER_METADATA_TTL_MS = 30_000

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
        lcp_configs: userSettings.LcpConfigs,
        patreon_data: store.UserMetadata.PatreonData,
        itch_data: store.UserMetadata.ItchData,
        v2_cloud_import_status: store.UserMetadata.V2CloudImportStatus,
      }
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

const DefaultSyncSettings: SyncSettings = {
  frequency: 'manual',
  itemTypes: ['pilot', 'pilotgroup', 'npc', 'campaign', 'encounter', 'collectionitem'],
  includeSettings: true,
  includeShared: true,
  autoBackupFrequency: 'none',
  autoBackupLimit: 30,
  autoBackupPrunePct: 30,
  lastBackupTime: 0,
  lastSyncTime: 0,
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
  public SyncSettings: SyncSettings
  public UserSettingData: Client.IUserProfile
  public CollectionSubscriptionSettings: CollectionSubscriptionSettings
  public RemoteItems: string[]
  public V2CloudImportStatus: 'none' | 'pending' | 'complete' | 'error'
  public PatreonData: PatreonData & { lastUpdate?: number }
  public ItchData: ItchData
  public LcpConfigs: Client.LcpConfig[]

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
    this.V2CloudImportStatus = data.v2_cloud_import_status || 'none'
    this.PatreonData = data.patreon_data || { hasPatreon: false }
    this.ItchData = data.itch_data || { hasItch: false, user: { id: 1 }, gamedata: [] }
    this.LcpConfigs = data.lcp_configs || []
  }
}

export const UserStore = defineStore('cloud', {
  state: () => ({
    IsLoading: false,
    User: {} as Client.UserProfile,
    UserMetadata: new UserMetadata({}) as UserMetadata,
    Cognito: {} as { username?: string; userId?: string },
    CloudItems: [] as dbItemMeta[],
    CloudArchives: [] as dbItemMeta[],
    CloudImages: [] as dbItemMeta[],
    UserPublishedCollections: [] as dbItemMeta[],
    RemoteCollections: [] as dbItemMeta[],
    LastQuery: 0,
    SyncVersion: 0,
    CloudStorageUsed: 0,
    StorageWarning: false,
    StorageFull: false,
    IsLoggedIn: false,
    IsSyncing: false,
    CloudNotifications: [] as CloudNotification[],
    V2CloudDetectData: null as V2CloudDetectResult | null,
    V2BackupIds: [] as string[],
    BrokenRemoteCodes: [] as string[],
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
    SyncSettings: state => state.UserMetadata.SyncSettings as SyncSettings,
    ItemsRequiringUpdate(): SyncableItem[] {
      return this.AllSyncableItems.filter(item => {
        if (!item.CloudController) return true
        return !item.CloudController.isSynced
      })
    },
    AllItems(): SyncableItem[] {
      return [
        ...PilotStore().Pilots,
        ...PilotStore().PilotGroups.filter(x => x.ID !== 'no_group'),
        ...NpcStore().Npcs,
        ...NarrativeStore().CollectionItems,
        ...EncounterStore().Encounters,
        ...CampaignStore().Campaigns,
        ...EncounterStore().ActiveEncounters,
        ...EncounterStore().ArchivedEncounters,
        ...PilotStore().PilotSheets,
      ]
    },
    AllLocalItems(): SyncableItem[] {
      return this.AllItems.filter(x => !x.SaveController?.IsRemote)
    },
    AllRemoteItems(): SyncableItem[] {
      return this.AllItems.filter(x => x.SaveController?.IsRemote && !x.SaveController?.IsDeleted)
    },
    CloudOnlyItems(): SyncableItem[] {
      const raw = UserStore().CloudItems.filter(x => {
        if (x.deleted) return false
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
          isSynced: false,
          syncFromCloud: async () => {
            throw new Error('CloudOnly items cannot syncFromCloud')
          },
        },
      }))
    },
    UserCollections(): ReturnType<typeof CompendiumStore>['ContentCollections'] {
      const data = CompendiumStore().ContentCollections
      data.forEach(c => {
        const meta = this.UserPublishedCollections.find(x => x.sortkey.split('_')[1] === c.ID)
        if (meta) c.Metadata = meta as any
      })
      return data
    },
    // does not include remote items
    AllSyncableItems(): SyncableItem[] {
      // touch SyncVersion so this getter recomputes after sync completes
      void this.SyncVersion
      return this.AllLocalItems.concat(this.CloudOnlyItems)
    },
    AllItemsToSync(): SyncableItem[] {
      return this.AllSyncableItems.filter(x => {
        if (x.SaveController?.IsDeleted) return false
        if (this.V2BackupIds.includes(x.ID)) return false
        const t = normalizeItemType(x.ItemType)
        if (t === 'encounterarchive' || t === 'pilotsheet') return false
        return this.SyncItemTypes.includes(t)
      }).filter(x => !x.CloudController.isSynced)
    },
    AllRemoteItemsToSync(): SyncableItem[] {
      return this.AllRemoteItems.filter(x => {
        if (x.SaveController?.IsDeleted) return false
        if (this.V2BackupIds.includes(x.ID)) return false
        return this.SyncItemTypes.includes(normalizeItemType(x.ItemType))
      }).filter(x => !x.CloudController.isSynced)
    },
    BackupSpaceExceeded(): boolean {
      if (this.CloudStorageFull) return true
      const backups = this.CloudArchives
      const sizeTotal = backups.reduce((acc, obj) => acc + (obj.size ?? 0), 0)
      return sizeTotal > this.MaxCloudStorage * (this.SyncSettings.autoBackupPrunePct / 100)
    },
    BackupLimitExceeded(): boolean {
      if (this.CloudStorageFull) return true
      return this.CloudArchives.length > this.SyncSettings.autoBackupLimit
    },
    PrunableBackups(): dbItemMeta[] {
      const backups = this.CloudArchives.filter(x => !x.preserve)
      const sizeTotal = backups.reduce((acc, obj) => acc + (obj.size ?? 0), 0)
      const pruneSize = this.MaxCloudStorage * (this.SyncSettings.autoBackupPrunePct / 100)
      const pruneCount = this.SyncSettings.autoBackupLimit
      if (sizeTotal < pruneSize && backups.length < pruneCount) return []

      const sorted = backups.sort((a, b) => (a.created ?? 0) - (b.created ?? 0))

      const toDelete = [] as dbItemMeta[]
      let totalSize = 0
      let count = 0
      for (const idx in sorted) {
        const item = sorted[idx]
        totalSize += item.size ?? 0
        count++
        if (totalSize > pruneSize || count > pruneCount) toDelete.push(item)
      }

      return toDelete
    },
  },
  actions: {
    async refreshV2BackupIds(): Promise<void> {
      const backups = await getV2Backups()
      this.V2BackupIds = backups.map(b => b.id)
    },
    async loadUser(): Promise<void> {
      this.User = await Client.getLocalProfile()

      await this.setCognito()

      const est = await navigator.storage.estimate()
      const actualUsage = await GetTotalStorageSize()
      const currentPct = ((actualUsage || 0) / (est.quota || 1)) * 100
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
      if (this.Cognito.userId) {
        localStorage.removeItem(`cc_last_query_${this.Cognito.userId}`)
      }
      this.IsLoggedIn = false
      this.Cognito = {}
      this.LastQuery = 0
    },
    async refreshDbData(): Promise<void> {
      if (!this.IsLoggedIn) {
        logger.error('User is not logged in')
        return
      }
      await this.getUserMetadata()
      await this.setMetadataFromDynamo()
    },
    async getUserMetadata(force = false): Promise<void> {
      if (!force && Date.now() - _lastUserMetadataFetch < USER_METADATA_TTL_MS) return
      let data: any
      try {
        data = await getUser(this.Cognito.userId!)
      } catch (e) {
        if (e instanceof UnauthorizedError) {
          logger.warn('Unauthorized response from server, signing out')
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
      _lastUserMetadataFetch = Date.now()
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
      const cloudLcpConfigs = this.UserMetadata.LcpConfigs?.length
        ? this.UserMetadata.LcpConfigs
        : (this.UserMetadata.UserSettingData?.lcp_configs ?? [])
      if (cloudLcpConfigs.length) {
        this.User.LcpConfigs = cloudLcpConfigs
        this.User.save()
      }
    },
    async setUserMetadata(): Promise<void> {
      return new Promise<void>(resolve => {
        _pendingMetadataResolvers.push(resolve)
        _debouncedSetUserMetadata(this)
      })
    },
    async checkV2CloudMigration(): Promise<void> {
      if (!this.IsLoggedIn) return
      if (this.UserMetadata.V2CloudImportStatus === 'complete') return
      try {
        const detect = await checkV2CloudData(this.Cognito.userId!)
        this.V2CloudDetectData = detect
        if (this.UserMetadata.V2CloudImportStatus === 'none') {
          this.UserMetadata.V2CloudImportStatus = detect.hasV2Data ? 'pending' : 'complete'
          await this.setUserMetadata()
        }
      } catch (err) {
        console.warn('V2 cloud migration check skipped:', err)
      }
    },
    async resetV2CloudMigration(): Promise<void> {
      this.UserMetadata.V2CloudImportStatus = 'pending'
      await this.setUserMetadata()
    },
    async setMetadataFromDynamo(): Promise<void> {
      // on first load (LastQuery === 0), do full fetch then switch to delta sync
      if (this.LastQuery === 0) {
        this.CloudArchives = []
        this.CloudItems = []
        this.CloudImages = []
        this.UserPublishedCollections = []

        const result = await getUserDataChanged(this.Cognito.userId!, 0)
        this.LastQuery = result.serverTime
        if (this.Cognito.userId) {
          localStorage.setItem(`cc_last_query_${this.Cognito.userId}`, String(this.LastQuery))
        }
        let totalSizeBytes = 0
        result.items.forEach(item => {
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
        const result = await getUserDataChanged(this.Cognito.userId!, this.LastQuery)
        this.LastQuery = result.serverTime
        if (this.Cognito.userId) {
          localStorage.setItem(`cc_last_query_${this.Cognito.userId}`, String(this.LastQuery))
        }

        let totalSizeBytes = this.CloudStorageUsed
        result.items.forEach(item => {
          const localItem = this.getLocalItem(item.sortkey)
          if (item.deleted) {
            // evict from CloudItems cache if present
            this.CloudItems = this.CloudItems.filter(x => x.sortkey !== item.sortkey)
            if (localItem) {
              const raw = toRaw(localItem) as any
              if (raw.SaveController && !raw.SaveController.IsDeleted) {
                raw.SaveController.DeleteTime = item.deleted
                raw.SaveController.saveSilent?.()
                this.addCloudNotification(
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

      await this.setMetadataForRemotes()
      this.SyncVersion++
    },
    async setMetadataForRemotes(): Promise<void> {
      const remotes = this.UserMetadata.RemoteItems
      if (!remotes || remotes.length === 0) return

      // Reload persisted broken codes (24h TTL)
      const storedBroken = this.User.View('brokenRemoteCodes', null) as {
        codes: string[]
        expires: number
      } | null
      if (storedBroken && storedBroken.expires > Date.now()) {
        for (const code of storedBroken.codes) {
          if (!this.BrokenRemoteCodes.includes(code)) this.BrokenRemoteCodes.push(code)
        }
      }

      const requestedCodes = new Set(remotes)
      let data: any[] = []

      // Batch into chunks of 50 (API limit)
      const BATCH_SIZE = 50
      const chunks: string[][] = []
      for (let i = 0; i < remotes.length; i += BATCH_SIZE) {
        chunks.push(remotes.slice(i, i + BATCH_SIZE))
      }

      for (const chunk of chunks) {
        try {
          const result = await GetFromCode(chunk)
          const items = (Array.isArray(result) ? result : [result]).filter(item => {
            if (!requestedCodes.has(item.code)) {
              logger.warn(`setMetadataForRemotes: received unrequested code ${item.code}, skipping`)
              return false
            }
            return true
          })
          data = data.concat(items)
        } catch (e) {
          logger.error('Failed to batch-fetch remote item metadata:', e)
          // fall back to individual fetches to identify dead codes
          for (const code of chunk) {
            try {
              const item = await GetFromCode(code)
              if (item && requestedCodes.has(item.code)) {
                data.push(item)
              }
            } catch (e) {
              if (e instanceof NotFoundError) {
                logger.info(`Remote code ${code} not found (404), marking as broken link`)
                if (!this.BrokenRemoteCodes.includes(code)) {
                  this.BrokenRemoteCodes.push(code)
                }
              } else {
                logger.warn(
                  `Remote code ${code} temporarily unreachable (${e}), will retry next session`
                )
              }
            }
          }
        }
      }

      const toDownload: typeof data = []
      for (const item of data) {
        if (item.deleted) continue
        const localItem = this.getLocalItem(item.sortkey)
        if (localItem) {
          // if this sortkey belongs to the user's own cloud data, setMetadataFromDynamo
          // already set the correct URI. Overwriting here would poison it with a foreign user's URI.
          const isOwnCloudItem = this.CloudItems.some(ci => ci.sortkey === item.sortkey)
          if (!isOwnCloudItem) {
            toRaw(localItem).CloudController.Metadata = item
          }
        } else {
          toDownload.push(item)
        }
      }

      for (const item of toDownload) {
        try {
          const itemData = await DownloadViaCode(item.code)
          const itemType = item.sortkey.split('_')[1]
          const newItem = CloudController.NewByType(itemType, itemData)
          newItem.CloudController.setRemoteMetadata(item)
          await CloudController.AddByType(itemType, newItem)
          if (item.item_modified) {
            toRaw(newItem).SaveController.LastModified = item.item_modified
            toRaw(newItem).SaveController.saveSilent?.()
          }
        } catch (e) {
          logger.error(`Failed to download remote item ${item.code}:`, e)
        }
      }

      // detach items that have a RemoteCode matching a fetched code but whose ID doesn't
      // match what the server returned. These are extra pilots imported by the old
      // getItems
      const codeToExpectedId = new Map<string, string>()
      for (const item of data) {
        codeToExpectedId.set(item.code, item.sortkey.split('_')[2])
      }
      for (const localItem of this.AllItems as any[]) {
        const rc = localItem.SaveController?.RemoteCode
        if (!rc) continue
        const expectedId = codeToExpectedId.get(rc)
        if (!expectedId) continue
        if (localItem.ID !== expectedId) {
          logger.warn(
            `Detaching orphaned extra import: ${localItem.Name} (${localItem.ID}) was tracking code ${rc}, expected ID ${expectedId}`
          )
          toRaw(localItem).SaveController.ClearRemote()
        }
      }

      // clean up codes left behind when items are permanently deleted without calling deleteRemoteItem
      const trackedCodes = new Set(
        this.AllItems.map((x: any) => x.SaveController?.RemoteCode).filter(Boolean)
      )
      const orphaned = this.UserMetadata.RemoteItems.filter(code => !trackedCodes.has(code))
      if (orphaned.length > 0) {
        orphaned.forEach(code => this.deleteRemoteItem(code))
      }

      // Persist broken codes with a 24h TTL so they survive page reload
      if (this.BrokenRemoteCodes.length > 0) {
        this.User.SetView('brokenRemoteCodes', {
          codes: this.BrokenRemoteCodes,
          expires: Date.now() + 24 * 60 * 60 * 1000,
        })
      }
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
      await this.refreshV2BackupIds()
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
    getLocalItem(sortkey: string): SyncableItem | undefined {
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
        case 'pilotgroup':
          return PilotStore().PilotGroups.find(p => p.ID === id)

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
            logger.info('Unable to find local collection:', item)
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
      await this.refreshDbData()
      if (skipSync) return []
      if (!this.SyncSettings) return []
      if (isStartup) {
        const frequency = this.SyncSettings?.frequency?.toLowerCase() ?? ''
        if (!frequency.includes('start')) return []
      }
      const cloudLatestChange = this.UserMetadata?.UserSettingData?.latest_change ?? 0
      if (this.User.latest_change >= cloudLatestChange) {
        await this.setUserMetadata()
      }

      const items = this.AllItemsToSync
      const failures = [] as any[]

      if (overrideTo === 'download') {
        // Force download: fetch each item from cloud, merge into local, upload merged result
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
        // Force upload: push all local data to cloud unconditionally
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
        // Default LWW sync:
        // Cloud-only items → download and add to local store
        // Local items with cloud data → LWW merge (syncFromCloud) for items where cloud has
        //   changed since last known server time; batch-upload for locally-newer items
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

        // Items with existing cloud data: upload local changes.
        // If the server has a record newer than our last fetch (Updated > LastQuery),
        // another device has written since — merge first to preserve their changes.
        const toMerge: any[] = []
        const toUpload: any[] = []

        for (const item of localItems) {
          const cloudUpdated = item.CloudController.Metadata?.Updated ?? 0
          if (cloudUpdated > this.LastQuery) {
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

      for (const item of this.AllRemoteItems) {
        const code = (item as any).SaveController?.RemoteCode
        if (code && this.BrokenRemoteCodes.includes(code)) continue
        try {
          await CloudController.UpdateRemote(item)
        } catch (e) {
          logger.error('AutoSync remote update error:', e)
          failures.push({ item, error: e })
        }
      }

      await this.setMetadataFromDynamo()

      if (this.SyncSettings) this.SyncSettings.lastSyncTime = Date.now()

      if (failures.length === 0) {
        this.addCloudNotification(
          `Synced ${items.length} item${items.length !== 1 ? 's' : ''} successfully.`
        )
      }

      return failures
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
      logger.info(`addRemoteItem: tracking code ${code}`, new Error().stack)
      this.UserMetadata.RemoteItems.push(code)
      this.setUserMetadata()
    },
    deleteRemoteItem(code: string) {
      const idx = this.UserMetadata.RemoteItems.findIndex(x => x === code)
      if (idx === -1) return
      this.UserMetadata.RemoteItems.splice(idx, 1)
      this.setUserMetadata()
    },
    addBrokenRemote(code: string) {
      if (!this.BrokenRemoteCodes.includes(code)) this.BrokenRemoteCodes.push(code)
    },
    removeBrokenRemote(code: string) {
      const idx = this.BrokenRemoteCodes.indexOf(code)
      if (idx > -1) this.BrokenRemoteCodes.splice(idx, 1)
    },
    async retryBrokenRemote(code: string): Promise<boolean> {
      try {
        const item = await GetFromCode(code)
        if (!item || !item.code) return false
        this.removeBrokenRemote(code)
        await this.setMetadataForRemotes()
        return true
      } catch {
        return false
      }
    },
    convertBrokenRemoteToLocal(code: string) {
      const localItem = this.AllItems.find((x: any) => x.SaveController?.RemoteCode === code)
      if (localItem) {
        const raw = toRaw(localItem) as any
        raw.SaveController?.ClearRemote()
      }
      this.removeBrokenRemote(code)
      this.deleteRemoteItem(code)
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
    async permDeleteFlaggedItems(): Promise<number> {
      const flagged = this.CloudItems.filter(x => x.deleted)

      const BULK_SIZE = 25
      for (let i = 0; i < flagged.length; i += BULK_SIZE) {
        const batch = flagged.slice(i, i + BULK_SIZE)
        const sortkeys = batch.map(item => item.sortkey)
        const uris = batch.filter(item => item.uri).map(item => item.uri)
        try {
          const result = await bulkDelete(this.UserMetadata.UserID, sortkeys, uris)
          if (result.unprocessed > 0) {
            logger.warn(`permDeleteFlaggedItems: ${result.unprocessed} unprocessed items`)
          }
        } catch (e) {
          logger.error(
            'permDeleteFlaggedItems: bulk delete failed, falling back to individual deletes',
            e
          )
          await Promise.allSettled(
            batch.map(item => cloudDelete(this.UserMetadata.UserID, item.sortkey, item.uri))
          )
        }
      }

      const deletedSortkeys = new Set(flagged.map(x => x.sortkey))
      this.CloudItems = this.CloudItems.filter(x => !deletedSortkeys.has(x.sortkey))

      return flagged.length
    },
    async deleteAllCloudData(): Promise<void> {
      const allItems = [...this.CloudItems, ...this.CloudArchives, ...this.CloudImages]

      // groups of 25 (dynamoDB BatchWriteItem limit)
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
          // fallback to individual deletes
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
    async fetchLcp(dbItem: any): Promise<any> {
      const presign = await getItemDownloadLink(
        this.UserMetadata.ItchData.user.id,
        dbItem.game_id,
        dbItem.uri
      )
      const file = await getFromPresignDirect(presign)
      const fileData = await this.readAsBinaryStringAsync(file)
      const lcp = await parseContentPack(fileData as string)
      lcp.active = true
      return lcp
    },
    async downloadLcp(dbItem: any): Promise<void> {
      const lcp = await this.fetchLcp(dbItem)
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
