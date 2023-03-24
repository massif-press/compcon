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

async function delete_npc(npc: Npc) {
  RemoveItem('npcs', npc.ID)
    .then(() => console.info('NPC permanently deleted'))
    .catch((err) => console.error('Error while deleting NPC data', err));
}

export default {
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
  mutations: {
    LOAD_NPCS(state: any, payload: INpcData[]): void {
      const newNpcs: Npc[] = [...payload.map((x) => Npc.Deserialize(x))];
      state.Npcs.splice(0, state.Npcs.length);
      const all = [] as Npc[];
      newNpcs.forEach((npc: Npc) => {
        all.push(npc);
      });
      state.Npcs = all.filter((x) => !x.SaveController.IsDeleted);
      state.DeletedNpcs = all.filter((x) => x.SaveController.IsDeleted);

      //clean up deleted
      const del = [] as Npc[];
      state.DeletedNpcs.forEach((dp: Npc) => {
        if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime))
          del.push(dp);
      });
      if (del.length) {
        console.info(`Cleaning up ${del.length} Npcs marked for deletion`);
        del.forEach((p) => {
          const dpIdx = state.DeletedNpcs.findIndex((x: Npc) => x.ID === p.ID);
          if (dpIdx > -1) {
            state.DeletedNpcs.splice(dpIdx, 1);
          }
        });
        storeSaveDelta(state.Npcs.concat(state.DeletedNpcs));
      }
    },

    SAVE_DATA(state: any): void {
      saveNpcData(state.Npcs.concat(state.DeletedNpcs));
    },

    SET_DIRTY(state: any): void {
      if (state.Npcs.length) state.Dirty = true;
    },

    ADD_NPC(state: any, payload: Npc): void {
      payload.SaveController.IsDirty = true;
      state.Npcs.push(payload);
      state.Dirty = true;
      saveNpcData(state.Npcs);
    },

    CLONE_NPC(state: any, payload: Npc): void {
      state.Npcs.push(payload.Clone());
      state.Dirty = true;
    },

    DELETE_NPC(state: any, payload: Npc): void {
      const idx = state.Npcs.findIndex((x: Npc) => x.ID === payload.ID);
      if (idx > -1) {
        state.Npcs.splice(idx, 1);
        state.DeletedNpcs.push(payload);
      } else {
        throw console.error('NPC not loaded!');
      }
      state.Dirty = true;
    },

    DELETE_MISSING_NPC(state: any, payload: Npc): void {
      // for some reason missing npcs is being set to the compendium missing property. Not sure why this is happening.
      if (Array.isArray(state.MissingNpcs)) {
        const idx = state.MissingNpcs.findIndex(
          (x: Npc) => x.ID === payload.ID
        );
        if (idx > -1) {
          state.MissingNpcs.splice(idx, 1);
          deletePermanent(payload);
        }
      } else {
        const idx = (state.MissingNpcs as any).npcs.findIndex(
          (x: Npc) => x.ID === payload.ID
        );
        if (idx > -1) {
          (state.MissingNpcs as any).npcs.splice(idx, 1);
          deletePermanent(payload);
        }
      }
    },

    DELETE_NPC_PERMANENT(state: any, payload: Npc): void {
      const dpIdx = state.DeletedNpcs.findIndex(
        (x: Npc) => x.ID === payload.ID
      );
      if (dpIdx > -1) {
        state.DeletedNpcs.splice(dpIdx, 1);
        deletePermanent(payload);
      }
      state.Dirty = true;
    },

    RESTORE_NPC(state: any, payload: Npc): void {
      const NpcIndex = state.DeletedNpcs.findIndex(
        (x: Npc) => x.ID === payload.ID
      );
      if (NpcIndex > -1) {
        state.DeletedNpcs.splice(NpcIndex, 1);
        state.Npcs.push(payload);
      } else {
        throw console.error('NPC not loaded!');
      }
      state.Dirty = true;
    },

    SET_MISSING_CONTENT(state: any, payload: INpcData[]): void {
      state.MissingNpcs = payload;
    },
  },
  actions: {
    setNpcOrder({ commit }: any, payload: Npc[]): void {
      commit('SORT_NPC', payload);
    },

    set_npc_dirty({ commit }: any): void {
      commit('SET_DIRTY');
    },

    saveNpcData({ commit }: any): void {
      commit('SAVE_DATA');
    },

    cloneNpc({ commit }: any, payload: Npc): void {
      commit('CLONE_NPC', payload);
    },

    addNpc({ commit }: any, payload: Npc): void {
      commit('ADD_NPC', payload);
      commit('SAVE_DATA');
    },

    delete_npc({ commit }: any, payload: Npc): void {
      commit('DELETE_NPC', payload);
      commit('SAVE_DATA');
    },

    deleteMissingNpc({ commit }: any, payload: any): void {
      commit('DELETE_MISSING_NPC', payload);
    },

    restore_npc({ commit }: any, payload: Npc): void {
      commit('RESTORE_NPC', payload);
    },

    deleteNpcPermanent({ commit }: any, payload: Npc): void {
      if (!payload.SaveController.IsDeleted) commit('DELETE_NPC');
      commit('DELETE_NPC_PERMANENT', payload);
    },

    async loadNpcs({ commit }: any) {
      const npcData = await GetAll('npcs');
      commit('LOAD_NPCS', ItemsWithLcp(npcData));
      commit('SET_MISSING_CONTENT', ItemsMissingLcp(npcData));
    },
  },
};
