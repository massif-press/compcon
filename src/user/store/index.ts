import { defineStore } from 'pinia';
import * as Client from '../index';
import {
  CampaignStore,
  CompendiumStore,
  EncounterStore,
  NarrativeStore,
  NpcStore,
  PilotStore,
} from '@/stores';
import { Pilot } from '@/classes/pilot/Pilot';
import { Encounter } from '@/classes/encounter/Encounter';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import {
  getUser,
  updateUser,
  getUserData,
  cloudDelete,
  GetFromCode,
  downloadFromS3,
  getFromPresignDirect,
} from '@/io/apis/account';
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController';
import { PostCloudArchive } from '@/classes/components/cloud/CloudArchive';
import { ImportStagedData, StageImport } from '@/io/Importer';
import { getPatronProfile, authItch } from '../oauth';
import { getItemDownloadLink } from '../api';
import { parseContentPack } from '@/io/ContentPackParser';
import logger from '../logger';

const DefaultSyncSettings = {
  frequency: 'manual',
  itemTypes: ['pilot', 'npc', 'campaign', 'encounter', 'narrative'],
  includeSettings: true,
  includeShared: true,
  resolutionStrategy: 'newest',
  autoBackupFrequency: 'none',
  autoBackupLimit: 30,
  autoBackupPrunePct: 30,
  lastBackupTime: 0,
};

type CollectionSubscriptionSettings = {
  updateOn: string;
  items: { code: string; metadata: any }[];
};

const DefaultCollectionSettings = {
  updateOn: 'manual',
  items: [] as any[],
};

class UserMetadata {
  public static readonly Sortkey = 'meta';
  public UserID: string;
  public Username: string;
  public CreatedAt: Number;
  public UpdatedAt: Number;
  public SyncSettings: any;
  public UserSettingData: Client.IUserProfile;
  public CollectionSubscriptionSettings: CollectionSubscriptionSettings;
  public RemoteItems: string[];
  public UserMigrated: boolean;
  public PatreonData: any;
  public ItchData: any;

  public constructor(data: any) {
    this.UserID = data.user_id;
    this.Username = data.username;
    this.CreatedAt = data.created_at;
    this.UpdatedAt = data.updated_at;
    if (!data.sync_settings) this.SyncSettings = DefaultSyncSettings;
    else this.SyncSettings = data.sync_settings;
    if (!data.collection_subscription_settings)
      this.CollectionSubscriptionSettings = DefaultCollectionSettings;
    else this.CollectionSubscriptionSettings = data.collection_subscription_settings;
    this.UserSettingData = data.user_setting_data;
    this.RemoteItems = data.remote_items || [];
    this.UserMigrated = data.user_migrated || false;
    this.PatreonData = data.patreon_data || { hasPatreon: false };
    this.ItchData = data.itch_data || { hasItch: false, user: { id: 1 }, gamedata: [] };
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
    CollectionPublishLimit: 3,
    StorageWarning: false,
    StorageFull: false,
    IsLoggedIn: false,
    IsSyncing: false,
    CloudNotifications: [] as any[],
  }),
  getters: {
    MaxCloudStorage: (state) => {
      let baseMbVal;
      switch (state.User.PatreonTierValue) {
        case 1:
          baseMbVal = 1000;
          break;
        case 2:
          baseMbVal = 5000;
          break;
        case 3:
        case 4:
        case 5:
          baseMbVal = 10000;
          break;
        default:
          baseMbVal = 100;
          break;
      }
      return baseMbVal * 1024 * 1024;
    },
    CollectionPublishLimit: (state) => {
      switch (state.User.PatreonTierValue) {
        case 1:
          return 3;
        case 2:
        case 3:
        case 4:
        case 5:
          return -1;
        default:
          return 0;
      }
    },
    CloudStorageFull(): boolean {
      return this.CloudStorageUsed > this.MaxCloudStorage;
    },
    SyncItemTypes: (state) => {
      const types = [...state.UserMetadata.SyncSettings.itemTypes];
      if (types.includes('npc')) types.push('unit', 'doodad', 'eidolon');
      if (types.includes('collectionitem')) types.push('character', 'faction', 'location');
      return types;
    },
    SyncSettings: (state) => state.UserMetadata.SyncSettings,
    ItemsRequiringUpdate(): any[] {
      return this.AllSyncableItems.filter((item) => {
        if (!item.CloudController) return true;
        return item.CloudController.SyncStatus !== 'Synced';
      });
    },
    AllItems(): any[] {
      return [
        ...PilotStore().Pilots,
        ...NpcStore().Npcs,
        ...NarrativeStore().CollectionItems,
        ...EncounterStore().Encounters,
        ...CampaignStore().Campaigns,
      ].filter((x) => !x.SaveController.IsDeleted);
    },
    AllLocalItems(): any[] {
      return this.AllItems.filter((x) => !x.SaveController.IsDeleted && !x.SaveController.IsRemote);
    },
    AllRemoteItems(): any[] {
      return this.AllItems.filter((x) => !x.SaveController.IsDeleted && x.SaveController.IsRemote);
    },
    CloudOnlyItems(): any[] {
      const raw = UserStore().CloudItems.filter((x) => {
        const itemId = x.sortkey.split('_')[2];
        return !this.AllLocalItems.some((y) => !!y && y.ID === itemId);
      });

      return raw.map((x) => ({
        raw: x,
        IsCloudOnly: true,
        Name: x.name,
        ID: x.sortkey.split('_')[2],
        ItemType: x.sortkey.split('_')[1],
        CloudController: {
          Metadata: new DbItemMetadata(x),
          SyncStatus: 'CloudOnly',
        },
      }));
    },
    UserCollections(): any[] {
      const data = CompendiumStore().ContentCollections;
      data.forEach((c) => {
        const meta = this.UserPublishedCollections.find((x) => x.sortkey.split('_')[1] === c.ID);
        if (meta) c.Metadata = meta;
      });
      return data;
    },
    // does not include remote items
    AllSyncableItems(): any[] {
      return this.AllLocalItems.concat(this.CloudOnlyItems);
    },
    AllItemsToSync(): any[] {
      return this.AllSyncableItems.filter((x) => {
        return this.SyncItemTypes.includes(x.ItemType.toLowerCase());
      }).filter((x) => x.CloudController.SyncStatus !== 'Synced');
    },
    AllRemoteItemsToSync(): any[] {
      return this.AllRemoteItems.filter((x) => {
        return this.SyncItemTypes.includes(x.ItemType.toLowerCase());
      }).filter((x) => x.CloudController.SyncStatus !== 'Synced');
    },
    BackupSpaceExceeded(): boolean {
      if (this.CloudStorageFull) return true;
      const backups = this.CloudArchives;
      const sizeTotal = backups.reduce((acc, obj) => acc + obj.size, 0);
      return sizeTotal > this.MaxCloudStorage * (this.SyncSettings.autoBackupPrunePct / 100);
    },
    BackupLimitExceeded(): boolean {
      if (this.CloudStorageFull) return true;
      return this.CloudArchives.length > this.SyncSettings.autoBackupLimit;
    },
    PrunableBackups(): any[] {
      const backups = this.CloudArchives.filter((x) => !x.preserve);
      const sizeTotal = backups.reduce((acc, obj) => acc + obj.size, 0);
      const pruneSize = this.MaxCloudStorage * (this.SyncSettings.autoBackupPrunePct / 100);
      const pruneCount = this.SyncSettings.autoBackupLimit;
      if (sizeTotal < pruneSize && backups.length < pruneCount) return [];

      const sorted = backups.sort((a, b) => a.created - b.created);

      const toDelete = [] as any[];
      let totalSize = 0;
      let count = 0;
      for (const idx in sorted) {
        const item = sorted[idx];
        totalSize += item.size;
        count++;
        if (totalSize > pruneSize || count > pruneCount) toDelete.push(item);
      }

      return toDelete;
    },
  },
  actions: {
    async loadUser(): Promise<void> {
      this.User = await Client.getLocalProfile();

      await this.setCognito();

      const est = await navigator.storage.estimate();
      const currentPct = ((est.usage || 0) / (est.quota || 1)) * 100;
      if (currentPct > this.User.StorageWarning) {
        this.setStorageWarning(true);
      }
      if (currentPct > this.User.StorageMax) {
        this.setStorageFull(true);
      }
    },
    async setCognito(): Promise<void> {
      try {
        this.Cognito = await getCurrentUser();
        // refresh session if necessary
        await fetchAuthSession();
        this.IsLoggedIn = true;
      } catch (e) {
        logger.warn('User not logged in or cannot autologin');
        this.IsLoggedIn = false;
      }
    },
    signOut(): void {
      this.IsLoggedIn = false;
      this.Cognito = {};
    },
    async refreshDbData(): Promise<void> {
      if (!this.IsLoggedIn) {
        logger.error('User is not logged in');
        return;
      }
      await this.getUserMetadata();
      await this.setMetadataFromDynamo();
    },
    async getUserMetadata(): Promise<void> {
      const data = await getUser(this.Cognito.userId);
      this.UserMetadata = new UserMetadata(data);
      if (this.UserMetadata.UserSettingData) {
        if (
          this.UserMetadata.SyncSettings.includeSettings &&
          this.UserMetadata.UserSettingData.latest_change > this.User.latest_change
        ) {
          this.User = Client.UserProfile.Deserialize(this.UserMetadata.UserSettingData);
        }
        if (
          this.UserMetadata.UserSettingData.achievement_unlocks.length >
          this.User.AchievementUnlocks.length
        )
          this.User.AchievementUnlocks = this.UserMetadata.UserSettingData.achievement_unlocks;
      }
    },
    async setUserMetadata(): Promise<void> {
      this.User.save();
      const userSettings = await Client.getLocalProfile();
      const payload = {
        username: this.UserMetadata.Username,
        collection_subscription_settings: this.UserMetadata.CollectionSubscriptionSettings,
        remote_items: [...new Set(this.UserMetadata.RemoteItems)],
        sync_settings: this.UserMetadata.SyncSettings,
        user_setting_data: Client.UserProfile.Serialize(userSettings),
        patreon_data: this.UserMetadata.PatreonData,
        itch_data: this.UserMetadata.ItchData,
      };

      await updateUser(this.Cognito.userId, payload);
    },
    async setMetadataFromDynamo(): Promise<void> {
      this.CloudArchives = [];
      this.CloudItems = [];
      this.CloudImages = [];
      this.UserPublishedCollections = [];

      const data = await getUserData(this.Cognito.userId);
      this.LastQuery = Date.now();
      const dynamo = data;
      let totalSizeBytes = 0;
      dynamo.forEach((item) => {
        let localItem = this.getLocalItem(item.sortkey);
        if (item.size && !isNaN(item.size)) totalSizeBytes += item.size;
        if (localItem) {
          localItem.CloudController.Metadata = item;
        } else {
          this.setCloudDataItem(item);
        }
      });

      this.CloudStorageUsed = totalSizeBytes;
      await this.setMetadataForRemotes();
    },
    async setMetadataForRemotes(): Promise<void> {
      const remotes = this.UserMetadata.RemoteItems;
      const promises = [] as Promise<any>[];

      remotes.forEach((r) => {
        promises.push(GetFromCode(r));
      });

      const results = await Promise.allSettled(promises);
      const data = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);

      for (const idx in data) {
        const item = data[idx];
        let localItem = this.getLocalItem(item.sortkey);
        if (localItem) {
          localItem.CloudController.Metadata = item;
        } else {
          const itemData = await downloadFromS3(item.uri);
          const itemType = item.sortkey.split('_')[1];
          const newItem = CloudController.NewByType(itemType, itemData);
          newItem.CloudController.setRemoteMetadata(item);

          await CloudController.AddByType(itemType, newItem);
        }
      }
    },
    async getRemoteCollectionMetadata(startup = false): Promise<void> {
      const collectionSettings = this.UserMetadata.CollectionSubscriptionSettings;
      const data = [] as any[];
      const seen = [] as string[];

      for (const item of collectionSettings.items) {
        if (seen.includes(item.code)) return;
        seen.push(item.code);
        try {
          const e = await GetFromCode(item.code);
          data.push(e);
        } catch (e) {
          logger.error(`Unable to get remote collection metadata for ${item.code}`, e);
        }
      }

      this.RemoteCollections = data;

      if (startup && collectionSettings.updateOn === 'startup') {
        for (const idx in this.RemoteCollections) {
          const item = this.RemoteCollections[idx];
          try {
            await this.updateRemoteCollection(item);
          } catch (e) {
            logger.error(`Unable to update remote collection ${item.code}`, e);
          }
        }
      }
    },
    async updateRemoteCollection(collection): Promise<string[]> {
      const uri = collection.uri;
      if (!uri) {
        throw new Error('Collection has no uri:', collection);
      }

      const data = await downloadFromS3(uri);
      const staged = await StageImport(data);
      const errors = await ImportStagedData(staged, collection);
      const settingsIndex = this.UserMetadata.CollectionSubscriptionSettings.items.findIndex(
        (item) => item.code === collection.code
      );
      if (settingsIndex > -1) {
        this.UserMetadata.CollectionSubscriptionSettings.items[settingsIndex].metadata = collection;
        await this.setUserMetadata();
      }
      this.addCloudNotification(
        `Updated Collection: ${collection.name} to version ${collection.version}`
      );
      return errors;
    },
    updateAllRemoteCollections(): void {
      for (let item of this.UserMetadata.CollectionSubscriptionSettings.items) {
        const localSubscription = this.UserMetadata.CollectionSubscriptionSettings.items.find(
          (x) => x.metadata.id === item.metadata.id
        );

        if (localSubscription && localSubscription.metadata.version === item.metadata.version) {
          logger.info('Collection is up to date:', item);
        } else {
          this.updateRemoteCollection(item);
        }
      }
    },
    getLocalItem(sortkey: string): any {
      const datatype = sortkey.split('_')[0];
      if (datatype.includes('meta')) return;
      if (datatype.includes('archive')) return;
      if (datatype.includes('image')) return;
      if (datatype.includes('collection')) return;

      const itemType = sortkey.split('_')[1];
      const id = sortkey.split('_')[2];
      switch (itemType.toLowerCase()) {
        case 'pilot':
          return PilotStore().Pilots.find((p) => p.ID === id);
        case 'npc':
        case 'unit':
        case 'doodad':
        case 'eidolon':
          return NpcStore().Npcs.find((n) => n.ID === id);
        case 'encounter':
          return EncounterStore().Encounters.find((e) => e.ID === id);
        case 'collectionitem':
        case 'narrative':
        case 'character':
        case 'faction':
        case 'location':
          return NarrativeStore().CollectionItems.find((n) => n.ID === id);
        case 'campaign':
          return CampaignStore().Campaigns.find((n) => n.ID === id);
        default:
          logger.error('Get Local Item/Unknown item type:', itemType);
          break;
      }
    },
    setCloudDataItem(item: any): void {
      if (item.sortkey === 'meta') return;

      const datatype = item.sortkey.split('_')[0];
      let arrType = '';
      switch (datatype) {
        case 'savedata':
          arrType = 'CloudItems';
          break;
        case 'archive':
          arrType = 'CloudArchives';
          break;
        case 'image':
          arrType = 'CloudImages';
          break;
        case 'collection':
          const localOwnedCollection = CompendiumStore().ContentCollections.find(
            (x) => x.ID === item.sortkey.split('_')[1]
          );
          if (localOwnedCollection) {
            localOwnedCollection.Metadata = item;
          } else {
            logger.error('Unable to find local collection:', item);
          }
          arrType = 'UserPublishedCollections';
          break;
      }

      let idx = this[arrType].findIndex((i) => i.sortkey === item.sortkey);
      if (idx > -1) this[arrType][idx] = { ...this[arrType][idx], ...item };
      else idx = this[arrType].push(item) - 1;
    },
    async AutoSync(
      overrideTo?: 'cloud' | 'local' | 'newest',
      isStartup = false,
      skipSync = false
    ): Promise<any[]> {
      await this.refreshDbData();
      if (skipSync) return [];
      if (isStartup) {
        const frequency = this.SyncSettings.frequency.toLowerCase();
        if (!frequency.includes('start')) return [];
      }
      const strategy = this.SyncSettings.resolutionStrategy;
      if (strategy === 'manual') return [];
      const items = this.AllItemsToSync;
      const failures = [] as any[];
      for (const idx in items) {
        const item = items[idx];
        try {
          if (overrideTo) {
            if (overrideTo === 'cloud') await CloudController.SyncToCloud(item);
            else if (overrideTo === 'local') await CloudController.SyncToLocal(item);
            else await CloudController.SyncToNewest(item);
          } else await CloudController.AutoSync(item);
        } catch (e) {
          logger.error('AutoSync Error:', e);
          failures.push({ item, error: e });
        }
      }

      if (this.SyncSettings.includeShared)
        for (const idx in this.AllRemoteItems) {
          const item = this.AllRemoteItems[idx];
          try {
            await CloudController.UpdateRemote(item);
          } catch (e) {
            logger.error('AutoSync Error:', e);
            failures.push({ item, error: e });
          }
        }

      await this.setMetadataFromDynamo();
      return failures;
    },
    async OnUnload(): Promise<void> {
      if (!this.SyncSettings.frequency.toLowerCase().includes('close')) return;
      await this.AutoSync();
    },
    async PruneBackups(): Promise<void> {
      const toDelete = this.PrunableBackups;

      const promises = [] as Promise<any>[];
      toDelete.forEach((b) => {
        promises.push(cloudDelete(this.UserMetadata.UserID, b.sortkey, b.uri));
        UserStore().addCloudNotification(`Pruned cloud backup "${b.name}".`);
      });

      await Promise.all(promises);
      await this.setMetadataFromDynamo();
    },
    async AutoBackup(startup = false): Promise<void> {
      if (this.BackupSpaceExceeded) return;
      if (this.BackupLimitExceeded) return;

      let shouldRun = false;
      const backupFrequency = UserStore().SyncSettings?.autoBackupFrequency;
      const lastBackup = UserStore().SyncSettings?.lastBackupTime;

      switch (backupFrequency) {
        case 'appstart':
          shouldRun = startup;
          break;
        case 'daily':
          shouldRun = new Date().getTime() - new Date(lastBackup).getTime() > 86400000;
          break;
        case 'weekly':
          shouldRun = new Date().getTime() - new Date(lastBackup).getTime() > 604800000;
          break;
        case 'monthly':
          shouldRun = new Date().getTime() - new Date(lastBackup).getTime() > 2592000000;
          break;
      }
      if (!shouldRun) return;

      await PostCloudArchive('Automatic');
      UserStore().addCloudNotification(`Uploaded new cloud backup.`);

      this.SyncSettings.lastBackupTime = new Date().getTime();
      await this.setUserMetadata();
    },
    setSyncTimer(): void {
      const frequency = this.SyncSettings.frequency.toLowerCase();
      if (!frequency.includes('minutes')) return;
      const minutes = parseInt(frequency.split('_').pop());
      logger.info(`Setting sync timer to ${minutes} minutes`);
      const ms = minutes * 60 * 1000;

      setInterval(() => {
        logger.info('AutoSync Timer Triggered');
        this.AutoSync();
      }, ms);
    },
    setStorageWarning(warning: boolean): void {
      this.StorageWarning = warning;
    },
    setStorageFull(full: boolean): void {
      this.StorageFull = full;
    },
    addRemoteItem(code: string) {
      this.UserMetadata.RemoteItems.push(code);
      this.setUserMetadata();
    },
    deleteRemoteItem(code: string) {
      const idx = this.UserMetadata.RemoteItems.findIndex((x) => x === code);
      if (idx === -1) return;
      this.UserMetadata.RemoteItems.splice(idx, 1);
      this.setUserMetadata();
    },
    async addContentSubscription(metadata: any) {
      this.UserMetadata.CollectionSubscriptionSettings.items.push({
        code: metadata.code,
        metadata,
      });
      this.RemoteCollections.push(metadata);
      await this.setUserMetadata();
    },
    async removeContentSubscription(collection: any) {
      const idx = this.UserMetadata.CollectionSubscriptionSettings.items.findIndex(
        (x) => x.code === collection.code
      );
      if (idx === -1) return;
      this.UserMetadata.CollectionSubscriptionSettings.items.splice(idx, 1);
      this.RemoteCollections = this.RemoteCollections.filter((x) => x.code !== collection.code);
      await this.setUserMetadata();
    },
    async removeOldItems(): Promise<string> {
      const removeThreshold = new Date().setDate(new Date().getDate() - this.User.AutoDeleteDays);
      let out = `removing items older than ${new Date(removeThreshold).toLocaleString()}...\n`;
      const outArr = [] as string[];
      const promises = [] as Promise<void>[];

      PilotStore().Pilots.forEach((p) => {
        if (p.SaveController.IsDeleted && p.SaveController.DeleteTime < removeThreshold) {
          promises.push(PilotStore().DeletePilotPermanent(p as Pilot));
          outArr.push(`Permanently Deleted Pilot: ${p.Name}\n`);
        }
      });

      NpcStore().Npcs.forEach((n) => {
        if (n.SaveController.IsDeleted && n.SaveController.DeleteTime < removeThreshold) {
          promises.push(NpcStore().DeleteNpcPermanent(n as any));
          outArr.push(`Permanently Deleted NPC: ${n.Name}\n`);
        }
      });

      NarrativeStore().CollectionItems.forEach((n) => {
        if (n.SaveController.IsDeleted && n.SaveController.DeleteTime < removeThreshold) {
          promises.push(NarrativeStore().DeleteItemPermanent(n));
          outArr.push(`Permanently Deleted Narrative: ${n.Title}\n`);
        }
      });

      EncounterStore().Encounters.forEach((e) => {
        if (e.SaveController.IsDeleted && e.SaveController.DeleteTime < removeThreshold) {
          promises.push(EncounterStore().DeleteEncounterPermanent(e as Encounter));
          outArr.push(`Permanently Deleted Encounter: ${e.Name}\n`);
        }
      });

      await Promise.all(promises);

      if (outArr.length) out += outArr.join('');
      else out += 'No items to remove\n';

      return out;
    },
    async deleteAllCloudData(): Promise<void> {
      const promises = [] as Promise<any>[];
      this.CloudItems.forEach((item) => {
        promises.push(cloudDelete(this.UserMetadata.UserID, item.sortkey, item.uri));
      });
      this.CloudArchives.forEach((item) => {
        promises.push(cloudDelete(this.UserMetadata.UserID, item.sortkey, item.uri));
      });
      this.CloudImages.forEach((item) => {
        promises.push(cloudDelete(this.UserMetadata.UserID, item.sortkey, item.uri));
      });

      await Promise.all(promises);
      this.CloudItems = [];
      this.CloudArchives = [];
      this.CloudImages = [];
      this.UserPublishedCollections = [];
      this.UserMetadata.RemoteItems = [];
      this.setUserMetadata();
    },
    async setPatreonData(data: any): Promise<void> {
      this.UserMetadata.PatreonData.token = data;
      const profile = await getPatronProfile(data.access_token);
      this.UserMetadata.PatreonData.profile = profile;
      this.UserMetadata.PatreonData.hasPatreon = true;

      this.setUserMetadata();
    },

    async refreshPatreonData(): Promise<string> {
      if (!this.UserMetadata.PatreonData.token) return '';
      try {
        await this.setPatreonData(this.UserMetadata.PatreonData.token);
        return 'success';
      } catch (err) {
        logger.error('Error refreshing Patreon data:', err);
        this.UserMetadata.PatreonData = { hasPatreon: false };
        this.setUserMetadata();
        return 'error';
      }
    },
    setItchData(access_token: string, data: any): void {
      this.UserMetadata.ItchData = data;
      this.UserMetadata.ItchData.hasItch = true;
      this.UserMetadata.ItchData.token = access_token;
      this.UserMetadata.ItchData.lastUpdate = Date.now();
      this.setUserMetadata();
    },

    async refreshItchData(): Promise<string> {
      try {
        if (!this.UserMetadata.ItchData.token) throw new Error('No itch.io token found');
        const data = await authItch(this.UserMetadata.ItchData.token);
        this.setItchData(this.UserMetadata.ItchData.token, data);
        return 'success';
      } catch (err) {
        logger.error('Error refreshing Itch data:', err);
        this.UserMetadata.ItchData = { hasItch: false, user: { id: 1 }, gamedata: [] };
        this.setUserMetadata();
        return 'error';
      }
    },
    async downloadLcp(dbItem: any): Promise<void> {
      const presign = await getItemDownloadLink(
        this.UserMetadata.ItchData.user.id,
        dbItem.game_id,
        dbItem.uri
      );
      const file = await getFromPresignDirect(presign);
      const fileData = await this.readAsBinaryStringAsync(file);
      const lcp = await parseContentPack(fileData as string);
      lcp.active = true;
      await CompendiumStore().installContentPack(lcp);
    },
    readAsBinaryStringAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsBinaryString(file);
      });
    },
    addCloudNotification(text: string, type = 'success'): void {
      this.CloudNotifications.push({ text, type });
    },
    clearCloudNotifications(): void {
      this.CloudNotifications = [];
    },
    removeCloudNotification(idx: number): void {
      this.CloudNotifications.splice(idx, 1);
    },
  },
});
