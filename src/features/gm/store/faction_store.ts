import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { Faction, IFactionData } from '@/classes/campaign/Faction';

async function saveFactionData(factions: Faction[]) {
  const dirty = factions.filter((x) => x.SaveController.IsDirty);
  Promise.all(dirty.map((x) => SetItem('factions', Faction.Serialize(x))))
    .then(() => console.info('FACTION data saved'))
    .catch((err) => console.error('Error while saving FACTION data', err));
}

async function delete_faction(faction: Faction) {
  RemoveItem('factions', faction.ID)
    .then(() => console.info('FACTION permanently deleted'))
    .catch((err) => console.error('Error while deleting FACTION data', err));
}

export default {
  state: () => ({
    Factions: [] as Faction[],
    DeletedFactions: [] as Faction[],
    Dirty: false,
  }),
  getters: {
    AllFactions: (state: any) => state.Factions.concat(state.DeletedFactions),
    getFactions: (state: any) => state.Factions,
    getFaction: (state: any) => (id: string) => {
      return state.Factions.find((x: Faction) => x.ID === id);
    },
    unsavedCloudFactions: (state: any) =>
      state.Factions.filter((p: Faction) => p.SaveController.IsDirty),
  },
  mutations: {
    LOAD_FACTIONS(state: any, payload: IFactionData[]): void {
      const newFactions: Faction[] = [
        ...payload.map((x) => Faction.Deserialize(x)),
      ];
      state.Factions.splice(0, state.Factions.length);
      const all = [] as Faction[];
      newFactions.forEach((faction: Faction) => {
        all.push(faction);
      });
      state.Factions = all.filter((x) => !x.SaveController.IsDeleted);
      state.DeletedFactions = all.filter((x) => x.SaveController.IsDeleted);

      //clean up deleted
      const del = [] as Faction[];
      state.DeletedFactions.forEach((dp: Faction) => {
        if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime))
          del.push(dp);
      });
      if (del.length) {
        console.info(`Cleaning up ${del.length} Factions marked for deletion`);
        del.forEach((p) => {
          const dpIdx = state.DeletedFactions.findIndex(
            (x: Faction) => x.ID === p.ID
          );
          if (dpIdx > -1) {
            state.DeletedFactions.splice(dpIdx, 1);
          }
        });
        storeSaveDelta(state.Factions.concat(state.DeletedFactions));
      }
    },

    SAVE_DATA(state: any): void {
      saveFactionData(state.Factions.concat(state.DeletedFactions));
    },

    SET_DIRTY(state: any): void {
      if (state.Factions.length) state.Dirty = true;
    },

    ADD_FACTION(state: any, payload: Faction): void {
      payload.SaveController.IsDirty = true;
      state.Factions.push(payload);
      state.Dirty = true;
      saveFactionData(state.Factions);
    },

    CLONE_FACTION(state: any, payload: Faction): void {
      state.Factions.push(payload.Clone());
      state.Dirty = true;
    },

    DELETE_FACTION(state: any, payload: Faction): void {
      const idx = state.Factions.findIndex((x: Faction) => x.ID === payload.ID);
      if (idx > -1) {
        state.Factions.splice(idx, 1);
        state.DeletedFactions.push(payload);
      } else {
        throw console.error('FACTION not loaded!');
      }
      state.Dirty = true;
    },

    DELETE_FACTION_PERMANENT(state: any, payload: Faction): void {
      const dpIdx = state.DeletedFactions.findIndex(
        (x: Faction) => x.ID === payload.ID
      );
      if (dpIdx > -1) {
        state.DeletedFactions.splice(dpIdx, 1);
        deletePermanent(payload);
      }
      state.Dirty = true;
    },

    RESTORE_FACTION(state: any, payload: Faction): void {
      const FactionIndex = state.DeletedFactions.findIndex(
        (x: Faction) => x.ID === payload.ID
      );
      if (FactionIndex > -1) {
        state.DeletedFactions.splice(FactionIndex, 1);
        state.Factions.push(payload);
      } else {
        throw console.error('FACTION not loaded!');
      }
      state.Dirty = true;
    },
  },
  actions: {
    setFactionOrder({ commit }: any, payload: Faction[]): void {
      commit('SORT_FACTION', payload);
    },

    set_faction_dirty({ commit }: any): void {
      commit('SET_DIRTY');
    },

    saveFactionData({ commit }: any): void {
      commit('SAVE_DATA');
    },

    cloneFaction({ commit }: any, payload: Faction): void {
      commit('CLONE_FACTION', payload);
    },

    addFaction({ commit }: any, payload: Faction): void {
      commit('ADD_FACTION', payload);
      commit('SAVE_DATA');
    },

    delete_faction({ commit }: any, payload: Faction): void {
      commit('DELETE_FACTION', payload);
      commit('SAVE_DATA');
    },

    deleteMissingFaction({ commit }: any, payload: any): void {
      commit('DELETE_MISSING_FACTION', payload);
    },

    restore_faction({ commit }: any, payload: Faction): void {
      commit('RESTORE_FACTION', payload);
    },

    deleteFactionPermanent({ commit }: any, payload: Faction): void {
      if (!payload.SaveController.IsDeleted) commit('DELETE_FACTION');
      commit('DELETE_FACTION_PERMANENT', payload);
    },
    async loadFactions({ commit }: any) {
      const factionData = await GetAll('factions');
      commit('LOAD_FACTIONS', ItemsWithLcp(factionData));
      commit('SET_MISSING_CONTENT', ItemsMissingLcp(factionData));
    },
  },
};
