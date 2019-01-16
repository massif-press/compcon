import Vue from 'vue'
import Vuex from 'vuex'
import io from '../util/io'
import Pilots from '../assets/data/pilots.json'

import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Pilots: Pilots
  },
  mutations: {
    UPDATE_PILOT (state, payload) {
      var pIdx = state.Pilots.findIndex(x => x.id === payload.id)
      state.Pilots[pIdx] = payload.pilot
      console.log(io)
    }
  },
  modules,
  plugins: [
    createPersistedState()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
