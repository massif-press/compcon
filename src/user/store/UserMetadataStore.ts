import { defineStore } from 'pinia'
import { debounce } from 'lodash-es'
import * as Client from '../index'
import { getUser, patchItem, UnauthorizedError } from '@/io/apis/account'
import { signOut } from 'aws-amplify/auth'
import { AuthStore } from './AuthStore'
import { NotificationStore } from './NotificationStore'
import { checkV2CloudData, type V2CloudDetectResult } from '@/io/V2CloudImporter'
import { getV2Backups } from '@/io/V2Importer'
import logger from '../logger'
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

export const DefaultSyncSettings: SyncSettings = {
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

export class UserMetadata {
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

let _pendingMetadataResolvers: Array<() => void> = []
let _lastUserMetadataFetch = 0
const USER_METADATA_TTL_MS = 30_000

export function setSaveUserProfileCallback(fn: () => void): void {
  _saveUserProfileCb = fn
}
let _saveUserProfileCb: (() => void) | null = null

const _debouncedSetUserMetadata = debounce(
  async () => {
    try {
      _saveUserProfileCb?.()
      const userSettings = await Client.getLocalProfile()
      const umStore = UserMetadataStore()
      const payload: Record<string, any> = {
        username: umStore.UserMetadata.Username,
        collection_subscription_settings: umStore.UserMetadata.CollectionSubscriptionSettings,
        remote_items: [...new Set(umStore.UserMetadata.RemoteItems)],
        sync_settings: umStore.UserMetadata.SyncSettings,
        user_setting_data: Client.UserProfile.Serialize(userSettings),
        lcp_configs: userSettings.LcpConfigs,
        patreon_data: umStore.UserMetadata.PatreonData,
        itch_data: umStore.UserMetadata.ItchData,
        v2_cloud_import_status: umStore.UserMetadata.V2CloudImportStatus,
      }
      await patchItem('meta', payload)
    } catch (e) {
      logger.error('setUserMetadata: failed to patch cloud metadata', e)
    } finally {
      const resolvers = _pendingMetadataResolvers
      _pendingMetadataResolvers = []
      resolvers.forEach(r => r())
    }
  },
  2000,
  { leading: false, trailing: true }
)

export const UserMetadataStore = defineStore('userMetadata', {
  state: () => ({
    UserMetadata: new UserMetadata({}) as UserMetadata,
    V2CloudDetectData: null as V2CloudDetectResult | null,
    V2BackupIds: [] as string[],
  }),
  getters: {
    SyncSettings: state => state.UserMetadata.SyncSettings as SyncSettings,
  },
  actions: {
    async getUserMetadata(force = false): Promise<void> {
      if (!force && Date.now() - _lastUserMetadataFetch < USER_METADATA_TTL_MS) return
      const authStore = AuthStore()
      let data: any
      try {
        data = await getUser(authStore.Cognito.userId!)
      } catch (e) {
        if (e instanceof UnauthorizedError) {
          logger.warn('Unauthorized response from server, signing out')
          try {
            await signOut()
          } catch (_) {}
          authStore.signOut()
          throw e
        }
        throw e
      }
      _lastUserMetadataFetch = Date.now()
      this.UserMetadata = new UserMetadata(data)

      const { UserStore } = await import('./index')
      const uStore = UserStore()
      if (this.UserMetadata.UserSettingData) {
        if (
          this.UserMetadata.SyncSettings.includeSettings &&
          this.UserMetadata.UserSettingData.latest_change > uStore.User.latest_change
        ) {
          uStore.User = Client.UserProfile.Deserialize(this.UserMetadata.UserSettingData)
          NotificationStore().addCloudNotification('Settings updated from another device.')
        }
        if (
          this.UserMetadata.UserSettingData.achievement_unlocks.length >
          uStore.User.AchievementUnlocks.length
        )
          uStore.User.AchievementUnlocks = this.UserMetadata.UserSettingData.achievement_unlocks
      }
      const cloudLcpConfigs = this.UserMetadata.LcpConfigs?.length
        ? this.UserMetadata.LcpConfigs
        : (this.UserMetadata.UserSettingData?.lcp_configs ?? [])
      if (
        cloudLcpConfigs.length &&
        (this.UserMetadata.UserSettingData?.latest_change ?? 0) > uStore.User.latest_change
      ) {
        uStore.User.LcpConfigs = cloudLcpConfigs
        uStore.User.save()
      }
    },
    async setUserMetadata(): Promise<void> {
      return new Promise<void>(resolve => {
        _pendingMetadataResolvers.push(resolve)
        _debouncedSetUserMetadata()
      })
    },
    async checkV2CloudMigration(): Promise<void> {
      const authStore = AuthStore()
      if (!authStore.IsLoggedIn) return
      if (this.UserMetadata.V2CloudImportStatus === 'complete') return
      try {
        const detect = await checkV2CloudData(authStore.Cognito.userId!)
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
    async refreshV2BackupIds(): Promise<void> {
      const backups = await getV2Backups()
      this.V2BackupIds = backups.map((b: any) => b.id)
    },
  },
})
