import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import datastore from "./features/_shared/store/";
import management from "./features/pilot_management/store/";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    datastore,
    management,
  },
});
