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
} from '@/io/apis/account';
import { CloudController, DbItemMetadata } from '@/classes/components/cloud/CloudController';
import { PostCloudArchive } from '@/classes/components/cloud/CloudArchive';

const DefaultSyncSettings = {
  frequency: 'manual',
  itemTypes: ['pilot', 'npc', 'campaign', 'encounter', 'narrative'],
  includeSettings: true,
  includeShared: true,
  resolutionStrategy: 'newest',
  itemRetention: 30,
  autoBackupFrequency: 'none',
  autoBackupLimit: 30,
  autoBackupPrunePct: 30,
  lastBackupTime: 0,
};

type CollectionSubscriptionSettings = {
  updateOn: string;
  items: { code: string; auto: boolean }[];
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
  }
}

export const UserStore = defineStore('cloud', {
  state: () => ({
    User: {} as Client.UserProfile,
    UserMetadata: {} as UserMetadata,
    Cognito: {} as any,
    CloudItems: [] as any[],
    CloudArchives: [] as any[],
    CloudImages: [] as any[],
    UserPublishedCollections: [] as any[],
    LastQuery: 0,
    CloudStorageUsed: 0,
    MaxCloudStorage: 100 * 1024 * 1024, //TODO: set based on patreon tier
    CollectionPublishLimit: 3, //TODO: set based on patreon tier
    StorageWarning: false,
    StorageFull: false,
    IsLoggedIn: false,
  }),
  getters: {
    CloudStorageFull: (state) => state.CloudStorageUsed >= state.MaxCloudStorage,
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
        console.error(e);
        this.IsLoggedIn = false;
      }
    },
    signOut(): void {
      this.IsLoggedIn = false;
      this.Cognito = {};
    },
    async refreshDbData(): Promise<void> {
      if (!this.IsLoggedIn) {
        console.error('User is not logged in');
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
          this.User.Achievements.length
        )
          this.User.Achievements = this.UserMetadata.UserSettingData.achievement_unlocks;
      }
    },
    async setUserMetadata(): Promise<void> {
      const userSettings = await Client.getLocalProfile();
      const payload = {
        collection_subscription_settings: this.UserMetadata.CollectionSubscriptionSettings,
        remote_items: [...new Set(this.UserMetadata.RemoteItems)],
        sync_settings: this.UserMetadata.SyncSettings,
        user_setting_data: Client.UserProfile.Serialize(userSettings),
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
        totalSizeBytes += item.size;
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
      console.log('remotes:', remotes);
      const promises = [] as Promise<any>[];

      remotes.forEach((r) => {
        promises.push(GetFromCode(r));
      });

      const missingItemPromises = [] as Promise<any>[];

      const data = await Promise.all(promises);

      for (const idx in data) {
        const item = data[idx];
        let localItem = this.getLocalItem(item.sortkey);
        if (localItem) {
          localItem.CloudController.Metadata = item;
        } else {
          console.log(item);
          const itemData = await downloadFromS3(item.uri);
          const itemType = item.sortkey.split('_')[1];
          const newItem = CloudController.NewByType(itemType, itemData);
          newItem.CloudController.setRemoteMetadata(item);

          await CloudController.AddByType(itemType, newItem);
        }
      }
    },
    getLocalItem(sortkey: string): any {
      const datatype = sortkey.split('_')[0];
      if (datatype.includes('meta')) return;
      if (datatype.includes('archive')) return;
      if (datatype.includes('image')) return;

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
          console.error('Get Local Item/Unknown item type:', itemType);
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
          console.error('AutoSync Error:', e);
          failures.push({ item, error: e });
        }
      }

      if (this.SyncSettings.includeShared)
        for (const idx in this.AllRemoteItems) {
          const item = this.AllRemoteItems[idx];
          try {
            await CloudController.UpdateRemote(item);
          } catch (e) {
            console.error('AutoSync Error:', e);
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
      this.SyncSettings.lastBackupTime = new Date().getTime();
      await this.setUserMetadata();
    },
    setSyncTimer(): void {
      const frequency = this.SyncSettings.frequency.toLowerCase();
      if (!frequency.includes('minutes')) return;
      const minutes = parseInt(frequency.split('_').pop());
      console.info('Setting sync timer for', minutes, 'minutes');
      const ms = minutes * 60 * 1000;

      setInterval(() => {
        console.info('AutoSync Timer Triggered');
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
  },
});
