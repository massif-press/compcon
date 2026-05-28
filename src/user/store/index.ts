import { defineStore } from 'pinia'
import { GetTotalStorageSize } from '@/io/Storage'
import * as Client from '../index'
import { getFromPresignDirect } from '@/io/apis/account'
import { parseContentPack } from '@/io/ContentPackParser'
import { getItemDownloadLink } from '../api'
import { ContentPackStore } from '@/features/compendium/store'
import * as OAuthService from './OAuthService'
import { AuthStore } from './AuthStore'
import { UserMetadataStore, setSaveUserProfileCallback } from './UserMetadataStore'
import type { SyncSettings, ItchData, UserMetadata } from './UserMetadataStore'
import { CloudDataStore } from './CloudDataStore'
import type { SyncableItem } from './CloudDataStore'
import { NotificationStore } from './NotificationStore'
import type { CloudNotification } from './NotificationStore'
import { RemoteItemStore } from './RemoteItemStore'
import { CollectionStore } from './CollectionStore'
import { BackupStore } from './BackupStore'
import { SyncStore } from './SyncStore'

export type { SyncSettings, ItchData, SyncableItem, CloudNotification, UserMetadata }

export const UserStore = defineStore('cloud', {
  state: () => ({
    User: {} as Client.UserProfile,
    IsLoading: false,
    StorageWarning: false,
    LocalStorageFull: false,
  }),
  getters: {
    IsLoggedIn: () => AuthStore().IsLoggedIn,
    Cognito: () => AuthStore().Cognito,
    UserMetadata: () => UserMetadataStore().UserMetadata,
    SyncSettings: () => UserMetadataStore().SyncSettings,
    V2CloudDetectData: () => UserMetadataStore().V2CloudDetectData,
    V2BackupIds: () => UserMetadataStore().V2BackupIds,
    CloudItems: () => CloudDataStore().CloudItems,
    CloudArchives: () => CloudDataStore().CloudArchives,
    CloudImages: () => CloudDataStore().CloudImages,
    UserPublishedCollections: () => CloudDataStore().UserPublishedCollections,
    RemoteCollections: () => CloudDataStore().RemoteCollections,
    LastQuery: () => CloudDataStore().LastQuery,
    SyncVersion: () => CloudDataStore().SyncVersion,
    CloudStorageUsed: () => CloudDataStore().CloudStorageUsed,
    MaxCloudStorage: () => CloudDataStore().MaxCloudStorage,
    CollectionPublishLimit: () => CloudDataStore().CollectionPublishLimit,
    CloudStorageFull: () => CloudDataStore().CloudStorageFull,
    UserCollections: () => CloudDataStore().UserCollections,
    CloudNotifications: () => NotificationStore().CloudNotifications,
    BrokenRemoteCodes: () => RemoteItemStore().BrokenRemoteCodes,
    IsSyncing: () => SyncStore().IsSyncing,
    AllItems: () => SyncStore().AllItems,
    AllLocalItems: () => SyncStore().AllLocalItems,
    AllRemoteItems: () => SyncStore().AllRemoteItems,
    AllSyncableItems: () => SyncStore().AllSyncableItems,
    CloudOnlyItems: () => SyncStore().CloudOnlyItems,
    AllItemsToSync: () => SyncStore().AllItemsToSync,
    AllRemoteItemsToSync: () => SyncStore().AllRemoteItemsToSync,
    ItemsRequiringUpdate: () => SyncStore().ItemsRequiringUpdate,
    SyncItemTypes: () => SyncStore().SyncItemTypes,
    BackupSpaceExceeded: () => BackupStore().BackupSpaceExceeded,
    BackupLimitExceeded: () => BackupStore().BackupLimitExceeded,
    PrunableBackups: () => BackupStore().PrunableBackups,
  },
  actions: {
    async setCognito() {
      return AuthStore().setCognito()
    },
    signOut() {
      AuthStore().signOut()
      CloudDataStore().resetLastQuery()
    },
    async getUserMetadata(force?: boolean) {
      return UserMetadataStore().getUserMetadata(force)
    },
    async setUserMetadata() {
      return UserMetadataStore().setUserMetadata()
    },
    async checkV2CloudMigration() {
      return UserMetadataStore().checkV2CloudMigration()
    },
    async resetV2CloudMigration() {
      return UserMetadataStore().resetV2CloudMigration()
    },
    async refreshV2BackupIds() {
      return UserMetadataStore().refreshV2BackupIds()
    },
    async setMetadataFromDynamo() {
      return CloudDataStore().setMetadataFromDynamo()
    },
    getLocalItem(sortkey: string) {
      return CloudDataStore().getLocalItem(sortkey)
    },
    setCloudDataItem(item: any) {
      return CloudDataStore().setCloudDataItem(item)
    },
    async permDeleteFlaggedItems() {
      return CloudDataStore().permDeleteFlaggedItems()
    },
    async deleteAllCloudData() {
      return CloudDataStore().deleteAllCloudData()
    },
    addCloudNotification(text: string, type?: string) {
      return NotificationStore().addCloudNotification(text, type)
    },
    clearCloudNotifications() {
      return NotificationStore().clearCloudNotifications()
    },
    removeCloudNotification(idx: number) {
      return NotificationStore().removeCloudNotification(idx)
    },
    addRemoteItem(code: string) {
      return RemoteItemStore().addRemoteItem(code)
    },
    deleteRemoteItem(code: string) {
      return RemoteItemStore().deleteRemoteItem(code)
    },
    addBrokenRemote(code: string) {
      return RemoteItemStore().addBrokenRemote(code)
    },
    removeBrokenRemote(code: string) {
      return RemoteItemStore().removeBrokenRemote(code)
    },
    async retryBrokenRemote(code: string) {
      return RemoteItemStore().retryBrokenRemote(code)
    },
    convertBrokenRemoteToLocal(code: string) {
      return RemoteItemStore().convertBrokenRemoteToLocal(code)
    },
    async setMetadataForRemotes() {
      return RemoteItemStore().setMetadataForRemotes()
    },
    async getRemoteCollectionMetadata(startup?: boolean) {
      return CollectionStore().getRemoteCollectionMetadata(startup)
    },
    async updateRemoteCollection(collection: any) {
      return CollectionStore().updateRemoteCollection(collection)
    },
    updateAllRemoteCollections() {
      return CollectionStore().updateAllRemoteCollections()
    },
    async addContentSubscription(metadata: any) {
      return CollectionStore().addContentSubscription(metadata)
    },
    async removeContentSubscription(collection: any) {
      return CollectionStore().removeContentSubscription(collection)
    },
    async PruneBackups() {
      return BackupStore().PruneBackups()
    },
    async AutoBackup(startup?: boolean) {
      return BackupStore().AutoBackup(startup)
    },
    async AutoSync(overrideTo?: 'upload' | 'download', isStartup?: boolean, skipSync?: boolean) {
      return SyncStore().AutoSync(overrideTo, isStartup, skipSync)
    },
    async _autoSyncImpl(
      overrideTo?: 'upload' | 'download',
      isStartup?: boolean,
      skipSync?: boolean
    ) {
      return SyncStore()._autoSyncImpl(overrideTo, isStartup, skipSync)
    },
    async OnUnload() {
      return SyncStore().OnUnload()
    },
    setSyncTimer() {
      return SyncStore().setSyncTimer()
    },
    async refreshDbData() {
      return SyncStore().refreshDbData()
    },
    async removeOldItems() {
      return SyncStore().removeOldItems()
    },
    async loadUser(): Promise<void> {
      this.User = await Client.getLocalProfile()
      setSaveUserProfileCallback(() => this.User.save())
      await AuthStore().setCognito()
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
    setStorageWarning(warning: boolean): void {
      this.StorageWarning = warning
    },
    setStorageFull(full: boolean): void {
      this.LocalStorageFull = full
    },
    async setPatreonData(data: any): Promise<void> {
      const umStore = UserMetadataStore()
      await OAuthService.setPatreonData(
        { UserMetadata: umStore.UserMetadata, setUserMetadata: () => umStore.setUserMetadata() },
        data
      )
    },
    async refreshPatreonData(): Promise<string> {
      const umStore = UserMetadataStore()
      return OAuthService.refreshPatreonData({
        UserMetadata: umStore.UserMetadata,
        setUserMetadata: () => umStore.setUserMetadata(),
      })
    },
    setItchData(access_token: string, data: any): void {
      const umStore = UserMetadataStore()
      OAuthService.setItchData(
        { UserMetadata: umStore.UserMetadata, setUserMetadata: () => umStore.setUserMetadata() },
        access_token,
        data
      )
    },
    async refreshItchData(): Promise<string> {
      const umStore = UserMetadataStore()
      return OAuthService.refreshItchData({
        UserMetadata: umStore.UserMetadata,
        setUserMetadata: () => umStore.setUserMetadata(),
      })
    },
    async fetchLcp(dbItem: any): Promise<any> {
      const presign = await getItemDownloadLink(
        UserMetadataStore().UserMetadata.ItchData.user.id,
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
      await ContentPackStore().installContentPack(lcp)
    },
    readAsBinaryStringAsync(file: Blob): Promise<string | ArrayBuffer | null> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(reader.error)
        reader.readAsBinaryString(file)
      })
    },
  },
})
