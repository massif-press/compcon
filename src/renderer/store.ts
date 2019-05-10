import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import { createPersistedState } from 'vuex-electron'
import io from "./features/_shared/data_io";
import datastore from "./features/_shared/store/";
import management from "./features/pilot_management/store/";
import compendium from "./features/compendium/store/";

Vue.use(Vuex);

const pilotUpdateMutations = [
  "UPDATE_PILOT",
  "SPLICE_PILOT",
  "CLONE_PILOT",
  "ADD_PILOT",
  "DELETE_PILOT",
  "UPDATE_PILOT_CONFIG"
];

const pilotUpdateSubscriber = (store: any) => {
  store.subscribe((mutation: any, state: any) => {
    if (_.includes(pilotUpdateMutations, mutation.type)) {
      io.saveUserData(
        Vue.prototype.userDataPath,
        "pilots.json",
        state.pilots.Pilots,
        () => {
          console.info("Data Saved");
        }
      );
    }
  });
};

export default new Vuex.Store({
  modules: {
    datastore,
    management,
    compendium
  },
  plugins: [createPersistedState(), pilotUpdateSubscriber],
  strict: process.env.NODE_ENV !== "production"
});
