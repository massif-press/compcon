import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator';
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils';
import { SetItem, RemoveItem, GetAll } from '@/io/Storage';
import { Location, ILocationData } from '@/classes/campaign/Location';

async function saveLocationData(locations: Location[]) {
  const dirty = locations.filter((x) => x.SaveController.IsDirty);
  Promise.all(dirty.map((x) => SetItem('locations', Location.Serialize(x))))
    .then(() => console.info('LOCATION data saved'))
    .catch((err) => console.error('Error while saving LOCATION data', err));
}

async function delete_location(location: Location) {
  RemoveItem('locations', location.ID)
    .then(() => console.info('LOCATION permanently deleted'))
    .catch((err) => console.error('Error while deleting LOCATION data', err));
}

export default {
  state: () => ({
    Locations: [] as Location[],
    DeletedLocations: [] as Location[],
    Dirty: false,
  }),
  getters: {
    AllLocations: (state: any) =>
      state.Locations.concat(state.DeletedLocations),
    getLocations: (state: any) => state.Locations,
    getLocation: (state: any) => (id: string) => {
      return state.Locations.find((x: Location) => x.ID === id);
    },
    unsavedCloudLocations: (state: any) =>
      state.Locations.filter((p: Location) => p.SaveController.IsDirty),
  },
  mutations: {
    LOAD_LOCATIONS(state: any, payload: ILocationData[]): void {
      const newLocations: Location[] = [
        ...payload.map((x) => Location.Deserialize(x)),
      ];
      state.Locations.splice(0, state.Locations.length);
      const all = [] as Location[];
      newLocations.forEach((location: Location) => {
        all.push(location);
      });
      state.Locations = all.filter((x) => !x.SaveController.IsDeleted);
      state.DeletedLocations = all.filter((x) => x.SaveController.IsDeleted);

      //clean up deleted
      const del = [] as Location[];
      state.DeletedLocations.forEach((dp: Location) => {
        if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime))
          del.push(dp);
      });
      if (del.length) {
        console.info(`Cleaning up ${del.length} Locations marked for deletion`);
        del.forEach((p) => {
          const dpIdx = state.DeletedLocations.findIndex(
            (x: Location) => x.ID === p.ID
          );
          if (dpIdx > -1) {
            state.DeletedLocations.splice(dpIdx, 1);
          }
        });
        storeSaveDelta(state.Locations.concat(state.DeletedLocations));
      }
    },

    SAVE_DATA(state: any): void {
      saveLocationData(state.Locations.concat(state.DeletedLocations));
    },

    SET_DIRTY(state: any): void {
      if (state.Locations.length) state.Dirty = true;
    },

    ADD_LOCATION(state: any, payload: Location): void {
      payload.SaveController.IsDirty = true;
      state.Locations.push(payload);
      state.Dirty = true;
      saveLocationData(state.Locations);
    },

    CLONE_LOCATION(state: any, payload: Location): void {
      state.Locations.push(payload.Clone());
      state.Dirty = true;
    },

    DELETE_LOCATION(state: any, payload: Location): void {
      const idx = state.Locations.findIndex(
        (x: Location) => x.ID === payload.ID
      );
      if (idx > -1) {
        state.Locations.splice(idx, 1);
        state.DeletedLocations.push(payload);
      } else {
        throw console.error('LOCATION not loaded!');
      }
      state.Dirty = true;
    },

    DELETE_LOCATION_PERMANENT(state: any, payload: Location): void {
      const dpIdx = state.DeletedLocations.findIndex(
        (x: Location) => x.ID === payload.ID
      );
      if (dpIdx > -1) {
        state.DeletedLocations.splice(dpIdx, 1);
        deletePermanent(payload);
      }
      state.Dirty = true;
    },

    RESTORE_LOCATION(state: any, payload: Location): void {
      const LocationIndex = state.DeletedLocations.findIndex(
        (x: Location) => x.ID === payload.ID
      );
      if (LocationIndex > -1) {
        state.DeletedLocations.splice(LocationIndex, 1);
        state.Locations.push(payload);
      } else {
        throw console.error('LOCATION not loaded!');
      }
      state.Dirty = true;
    },
  },
  actions: {
    setLocationOrder({ commit }: any, payload: Location[]): void {
      commit('SORT_LOCATION', payload);
    },

    set_location_dirty({ commit }: any): void {
      commit('SET_DIRTY');
    },

    saveLocationData({ commit }: any): void {
      commit('SAVE_DATA');
    },

    cloneLocation({ commit }: any, payload: Location): void {
      commit('CLONE_LOCATION', payload);
    },

    addLocation({ commit }: any, payload: Location): void {
      commit('ADD_LOCATION', payload);
      commit('SAVE_DATA');
    },

    delete_location({ commit }: any, payload: Location): void {
      commit('DELETE_LOCATION', payload);
      commit('SAVE_DATA');
    },

    deleteMissingLocation({ commit }: any, payload: any): void {
      commit('DELETE_MISSING_LOCATION', payload);
    },

    restore_location({ commit }: any, payload: Location): void {
      commit('RESTORE_LOCATION', payload);
    },

    deleteLocationPermanent({ commit }: any, payload: Location): void {
      if (!payload.SaveController.IsDeleted) commit('DELETE_LOCATION');
      commit('DELETE_LOCATION_PERMANENT', payload);
    },
    async loadLocations({ commit }: any) {
      const locationData = await GetAll('locations');
      commit('LOAD_LOCATIONS', ItemsWithLcp(locationData));
      commit('SET_MISSING_CONTENT', ItemsMissingLcp(locationData));
    },
  },
};
