import Vue from 'vue'
import Vuex from 'vuex'
import io from './pilot_io'

import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

const pilotUpdateSubscriber = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'UPDATE_PILOT' || 'SPLICE_PILOT' || 'CLONE_PILOT' || 'ADD_PILOT' || 'DELETE_PILOT') {
      io.saveUserData(Vue.prototype.userDataPath, 'pilots.json', state.pilots.Pilots, function (err) {
        if (err) console.error(err)
      })
    }
  })
}

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    pilotUpdateSubscriber
  ],
  strict: process.env.NODE_ENV !== 'production'
})
