import Vue from 'vue'
import Vuex from 'vuex'
import Pilots from '../assets/data/pilots.json'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Pilots: Pilots
  },
  // getters: {
  //   pilot: (state) => (id) => {
  //     console.log(state)
  //     return state.Pilots.find(p => p.id === id)
  //   }
  // },
  modules,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
