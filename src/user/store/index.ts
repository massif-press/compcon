import { defineStore } from 'pinia';
import * as Client from '../index';
import { EncounterStore, NarrativeStore, NpcStore, PilotStore } from '@/stores';
import { Pilot } from '@/classes/pilot/Pilot';
import { Encounter } from '@/classes/encounter/Encounter';

export const UserStore = defineStore('cloud', {
  state: () => ({
    User: {} as Client.UserProfile,
    StorageWarning: false,
    StorageFull: false,
  }),
  actions: {
    async loadUser(): Promise<void> {
      this.User = await Client.getLocalProfile();

      const est = await navigator.storage.estimate();
      const currentPct = ((est.usage || 0) / (est.quota || 1)) * 100;
      if (currentPct > this.User.StorageWarning) {
        this.setStorageWarning(true);
      }
      if (currentPct > this.User.StorageMax) {
        this.setStorageFull(true);
      }
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
