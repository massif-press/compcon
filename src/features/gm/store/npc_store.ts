import { defineStore } from 'pinia';
import { Npc } from '@/class';
import { INpcData } from '@/interface';

import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';

async function saveNpcData(npcs: Npc[]) {
  const dirty = npcs.filter((x) => x.SaveController.IsDirty);
  Promise.all(dirty.map((x) => SetItem('npcs', Npc.Serialize(x))))
    .then(() => console.info('NPC data saved'))
    .catch((err) => console.error('Error while saving NPC data', err));
}

// async function delete_npc(npc: Npc) {
//   RemoveItem('npcs', npc.ID)
//     .then(() => console.info('NPC permanently deleted'))
//     .catch((err) => console.error('Error while deleting NPC data', err));
// }

export const NpcStore = defineStore('npc', {
  state: () => ({
    Npcs: [] as Npc[],
    DeletedNpcs: [] as Npc[],
    MissingNpcs: [] as INpcData[],
    Dirty: false,
  }),
  getters: {
    AllNpcs: (state: any) => state.Npcs.concat(state.DeletedNpcs),
    getNpcs: (state: any) => state.Npcs,
    getNpc: (state: any) => (id: string) => {
      return state.Npcs.find((x: Npc) => x.ID === id);
    },
    unsavedCloudNpcs: (state: any) =>
      state.Npcs.filter((p: Npc) => p.SaveController.IsDirty),
  },
  actions: {
    _loadNpcs(payload: INpcData[]): void {
      const newNpcs: Npc[] = [...payload.map((x) => Npc.Deserialize(x))];
      this.Npcs.splice(0, this.Npcs.length);
      const all = [] as Npc[];
      newNpcs.forEach((npc: Npc) => {
        all.push(npc);
      });
      this.Npcs = all.filter((x) => !x.SaveController.IsDeleted);
      this.DeletedNpcs = all.filter((x) => x.SaveController.IsDeleted);

      //clean up deleted
      const del = [] as Npc[];
      (this.DeletedNpcs as any).forEach((dp: Npc) => {
        if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime))
          del.push(dp);
      });
      if (del.length) {
        console.info(`Cleaning up ${del.length} Npcs marked for deletion`);
        del.forEach((p) => {
          const dpIdx = (this.DeletedNpcs as any).findIndex(
            (x: Npc) => x.ID === p.ID
          );
          if (dpIdx > -1) {
            this.DeletedNpcs.splice(dpIdx, 1);
          }
        });
        storeSaveDelta((this.Npcs as any).concat(this.DeletedNpcs));
      }
    },
    SetDirty(): void {
      if (this.Npcs.length) this.Dirty = true;
    },

    AddNpc(payload: Npc): void {
      payload.SaveController.IsDirty = true;
      this.Npcs.push(payload);
      this.Dirty = true;
      saveNpcData(this.Npcs as Npc[]);
    },

    CloneNpc(payload: Npc): void {
      this.Npcs.push(payload.Clone());
      this.Dirty = true;
    },

    DeleteNpc(payload: Npc): void {
      const idx = (this.Npcs as Npc[]).findIndex(
        (x: Npc) => x.ID === payload.ID
      );
      if (idx > -1) {
        this.Npcs.splice(idx, 1);
        this.DeletedNpcs.push(payload);
      } else {
        throw console.error('NPC not loaded!');
      }
      this.Dirty = true;
      saveNpcData(this.Npcs as Npc[]);
    },

    DeleteMissingNpc(payload: Npc): void {
      // for some reason missing npcs is being set to the compendium missing property. Not sure why this is happening.
      if (Array.isArray(this.MissingNpcs)) {
        const idx = (this.MissingNpcs as any).findIndex(
          (x: Npc) => x.ID === payload.ID
        );
        if (idx > -1) {
          this.MissingNpcs.splice(idx, 1);
          deletePermanent(payload);
        }
      } else {
        const idx = (this.MissingNpcs as any).npcs.findIndex(
          (x: Npc) => x.ID === payload.ID
        );
        if (idx > -1) {
          (this.MissingNpcs as any).npcs.splice(idx, 1);
          deletePermanent(payload);
        }
      }
    },

    DeleteNpcPermanent(payload: Npc): void {
      const dpIdx = (this.DeletedNpcs as Npc[]).findIndex(
        (x: Npc) => x.ID === payload.ID
      );
      if (dpIdx > -1) {
        this.DeletedNpcs.splice(dpIdx, 1);
        deletePermanent(payload);
      }
      this.Dirty = true;
      saveNpcData(this.Npcs as Npc[]);
    },

    RestoreNpc(payload: Npc): void {
      const NpcIndex = (this.DeletedNpcs as Npc[]).findIndex(
        (x: Npc) => x.ID === payload.ID
      );
      if (NpcIndex > -1) {
        this.DeletedNpcs.splice(NpcIndex, 1);
        this.Npcs.push(payload);
      } else {
        throw console.error('NPC not loaded!');
      }
      this.Dirty = true;
      saveNpcData(this.Npcs as Npc[]);
    },

    SetMissingNpcContent(payload: INpcData[]): void {
      this.MissingNpcs = payload;
    },

    SaveNpcData(): void {
      saveNpcData((this.Npcs as any).concat(this.DeletedNpcs));
    },

    set_npc_dirty(): void {
      this.Dirty = true;
    },

    delete_npc(payload: Npc): void {
      this.DeleteNpc(payload);
    },

    restore_npc(payload: Npc): void {
      this.RestoreNpc(payload);
    },

    deleteNpcPermanent(payload: Npc): void {
      if (!payload.SaveController.IsDeleted) this.DeleteNpc(payload);
      this.DeleteNpcPermanent(payload);
    },

    async LoadNpcs() {
      const npcData = await GetAll('npcs');
      this._loadNpcs(ItemsWithLcp(npcData));
      this.SetMissingNpcContent(ItemsMissingLcp(npcData));
    },
  },
});
