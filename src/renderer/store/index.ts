import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import io from './data_io'

import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

const pilotUpdateSubscriber = (store: any) => {
  store.subscribe((mutation: any, state: any) => {
    if (mutation.type === 'UPDATE_PILOT' || 'SPLICE_PILOT' || 'CLONE_PILOT' || 'ADD_PILOT' || 'DELETE_PILOT' || 'UPDATE_PILOT_CONFIG') {
      io.saveUserData(Vue.prototype.userDataPath, 'pilots.json', state.pilots.Pilots, () => {
        console.log('in save')
        console.log(state.pilots.Pilots)
      })
    }
  })
}

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    pilotUpdateSubscriber,
  ],
  strict: process.env.NODE_ENV !== 'production',
})
