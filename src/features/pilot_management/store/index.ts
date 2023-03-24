import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { Pilot } from '@/class';
import { PilotData } from '@/interface';
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils';

async function savePilots(pilots: Pilot[]) {
  const dirty = pilots.filter((x) => x.SaveController.IsDirty);
  Promise.all(dirty.map((x) => SetItem('pilots', Pilot.Serialize(x))))
    .then(() => console.info('Pilot data saved'))
    .catch((err) => console.error('Error while saving Pilot data', err));
  // await saveDelta('pilots_v2.json', serialized)
}

async function delete_pilot(pilot: Pilot) {
  RemoveItem('pilots', pilot.ID)
    .then(() => console.info('Pilot permanently deleted'))
    .catch((err) => console.error('Error while deleting Pilot data', err));
}

export interface PilotGroup {
  name: string;
  pilotIDs: string[];
  hidden: boolean;
}

export default {
  state: () => ({
    Pilots: [] as Pilot[],
    DeletedPilots: [] as Pilot[],
    PilotGroups: [] as PilotGroup[],
    MissingPilots: [] as PilotData[],
    LoadedMechID: '',
    ActivePilot: null as unknown as Pilot,
    printOptions: null as unknown as PrintOptions,
  }),
  getters: {
    AllPilots: (state: any) => state.Pilots.concat(state.DeletedPilots),
    getPilots: (state: any) => state.Pilots,
    unsavedCloudPilots: (state: any) =>
      state.Pilots.filter((p: Pilot) => p.SaveController.IsDirty),
    getActivePilot: (state: any) => state.ActivePilot,
    getPrintOptions: (state: any) => state.printOptions,
  },
  mutations: {
    SAVE_DATA(state: any): void {
      savePilots(state.Pilots.concat(state.DeletedPilots));
    },
    LOAD_PILOTS(
      state: any,
      payload: {
        pilotData: PilotData[];
        groupData: PilotGroup[];
      }
    ): void {
      const all = payload.pilotData.map((x) => Pilot.Deserialize(x));
      state.Pilots = all.filter((x) => !x.SaveController.IsDeleted);
      state.DeletedPilots = all.filter((x) => x.SaveController.IsDeleted);

      //clean up deleted
      const del = [] as Pilot[];
      state.DeletedPilots.forEach((dp: Pilot) => {
        if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime))
          del.push(dp);
      });
      if (del.length) {
        console.info(`Cleaning up ${del.length} pilots marked for deletion`);

        Promise.all(del.map((p) => deletePermanent(p)))
          .then(() => storeSaveDelta(state.Pilots.concat(state.DeletedPilots)))
          .then(() => console.info('Done'))
          .catch((err) =>
            console.error('Error in permanently deleting pilots:', err)
          );
      }
    },
    ADD_PILOT(state: any, payload: Pilot): void {
      payload.SaveController.IsDirty = true;
      state.Pilots.push(payload);
    },
    CLONE_PILOT(state: any, payload: { pilot: Pilot; quirk: boolean }): void {
      const pilotData = Pilot.Serialize(payload.pilot);
      const newPilot = Pilot.Deserialize(pilotData);
      newPilot.RenewID();
      newPilot.Name += ' (CLONE)';
      newPilot.Callsign += '*';
      for (const mech of newPilot.Mechs) {
        mech.RenewID();
      }
      state.Pilots.push(newPilot);
    },
    DELETE_PILOT(state: any, payload: Pilot): void {
      const pilotIndex = state.Pilots.findIndex(
        (x: Pilot) => x.ID === payload.ID
      );

      if (pilotIndex > -1) {
        state.Pilots.splice(pilotIndex, 1);
        state.DeletedPilots.push(payload);
      } else {
        throw console.error('Pilot not loaded!');
      }
    },
    DELETE_PILOT_PERMANENT(state: any, payload: Pilot): void {
      const dpIdx = state.DeletedPilots.findIndex(
        (x: Pilot) => x.ID === payload.ID
      );
      if (dpIdx > -1) {
        state.DeletedPilots.splice(dpIdx, 1);
        deletePermanent(payload);
      }
    },
    DELETE_MISSING_PILOT(state: any, payload: any): void {
      const idx = state.MissingPilots.findIndex(
        (x: Pilot) => x.ID === payload.ID
      );
      if (idx > -1) {
        state.MissingPilots.splice(idx, 1);
        deletePermanent(payload);
      }
    },
    RESTORE_PILOT(state: any, payload: Pilot): void {
      const pilotIndex = state.DeletedPilots.findIndex(
        (x: Pilot) => x.ID === payload.ID
      );
      if (pilotIndex > -1) {
        state.DeletedPilots.splice(pilotIndex, 1);
        state.Pilots.push(payload);
      } else {
        throw console.error('Pilot not loaded!');
      }
    },
    SET_LOADED_MECH(state: any, payload: string): void {
      state.LoadedMechID = payload;
    },

    SET_MISSING_PILOTS(state: any, payload: PilotData[]): void {
      state.MissingPilots = payload;
    },
  },
  actions: {
    setPilots({ commit }: any, payload: Pilot[]) {
      commit('SET_PILOTS', payload);
    },

    set_pilot_dirty({ commit }: any): void {
      commit('SET_DIRTY');
    },

    set_mech_dirty({ commit }: any): void {
      commit('SET_DIRTY');
    },

    savePilotData({ commit }: any): void {
      commit('SAVE_DATA');
    },

    async loadPilots({ commit }: any) {
      const pilotData = await GetAll('pilots');
      commit('LOAD_PILOTS', {
        pilotData: ItemsWithLcp(pilotData),
      });
      commit('SET_MISSING_PILOTS', ItemsMissingLcp(pilotData));
    },

    async loadCloudPilots({ commit }: any, payload: PilotData) {
      commit('LOAD_PILOTS', payload);
    },

    clonePilot({ commit }: any, payload: Pilot): void {
      commit('CLONE_PILOT', payload);
    },

    addPilot({ commit }: any, payload: Pilot): void {
      commit('ADD_PILOT', payload);
      commit('SAVE_DATA');
    },

    delete_pilot({ commit }: any, payload: Pilot): void {
      commit('DELETE_PILOT', payload);
    },

    deleteMissingPilot({ commit }: any, payload: any): void {
      commit('DELETE_MISSING_PILOT', payload);
    },

    deletePilotPermanent({ commit }: any, payload: Pilot): void {
      if (!payload.SaveController.IsDeleted) commit('DELETE_PILOT');
      commit('DELETE_PILOT_PERMANENT', payload);
    },

    restore_pilot({ commit }: any, payload: Pilot): void {
      commit('RESTORE_PILOT', payload);
    },

    setLoadedMech({ commit }: any, id: string): void {
      commit('SET_LOADED_MECH', id);
    },
  },
};
