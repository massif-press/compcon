import { defineStore } from 'pinia';
import * as Client from '../index';
import { CampaignStore, EncounterStore, NarrativeStore, NpcStore, PilotStore } from '@/stores';
import { Pilot } from '@/classes/pilot/Pilot';
import { Encounter } from '@/classes/encounter/Encounter';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { getUser, updateUser, getUserData, downloadFromS3 } from '@/io/apis/account';
import { GetAll, SetItem } from '@/io/Storage';

const DefaultSyncSettings = {
  frequency: 'start',
  itemTypes: ['pilot', 'npc', 'campaign', 'encounter', 'narrative'],
  includeSettings: true,
  resolutionStrategy: 'newest',
  itemRetention: 30,
  autoBackupFrequency: 'none',
};

export const UserStore = defineStore('cloud', {
  state: () => ({
    User: {} as Client.UserProfile,
    UserMetadata: {} as any,
    Cognito: {} as any,
    CloudItems: [] as any[],
    LastQuery: 0,
    CloudStorageUsed: 0,
    MaxCloudStorage: 5000000, //TODO: set based on patreon tier
    StorageWarning: false,
    StorageFull: false,
    IsLoggedIn: false,
  }),
  getters: {
    SyncSettings: (state) => state.UserMetadata.SyncSettings,
    ItemsRequiringUpdate: (state) => {
      return state.CloudItems.filter((item) => {
        if (!item.CloudController) return true;
        return item.CloudController.SyncStatus !== 'Synced';
      });
    },
  },
  actions: {
    async loadUser(): Promise<void> {
      this.User = await Client.getLocalProfile();

      await this.setCognito();

      if (this.IsLoggedIn) {
        await this.getUserMetadata();
        if (!this.UserMetadata.SyncSettings)
          this.UserMetadata.SyncSettings = { ...DefaultSyncSettings };
      }

      const est = await navigator.storage.estimate();
      const currentPct = ((est.usage || 0) / (est.quota || 1)) * 100;
      if (currentPct > this.User.StorageWarning) {
        this.setStorageWarning(true);
      }
      if (currentPct > this.User.StorageMax) {
        this.setStorageFull(true);
      }

      await this.loadCloudDataItems();
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
      await this.getUserMetadata();
      await this.setMetadataFromDynamo();
    },
    async getUserMetadata(): Promise<void> {
      this.UserMetadata = await getUser(this.Cognito.userId);
    },
    async setUserMetadata(payload: any): Promise<void> {
      await updateUser(this.Cognito.userId, payload);
    },
    async setMetadataFromDynamo(): Promise<void> {
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
    },
    getLocalItem(sortkey: string): any {
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
    async loadCloudDataItems(): Promise<void> {
      this.CloudItems = await GetAll('cloud_data');
    },
    setCloudDataItem(item: any): void {
      let idx = this.CloudItems.findIndex((i) => i.sortkey === item.sortkey);
      if (idx > -1) this.CloudItems[idx] = { ...this.CloudItems[idx], ...item };
      else idx = this.CloudItems.push(item) - 1;
    },
    setStorageWarning(warning: boolean): void {
      this.StorageWarning = warning;
    },
    setStorageFull(full: boolean): void {
      this.StorageFull = full;
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
