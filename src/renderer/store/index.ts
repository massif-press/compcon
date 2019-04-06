import Vue from 'vue'
import Vuex from 'vuex'
import io from './data_io'


import { createPersistedState } from 'vuex-electron'

import modules from './modules'

console.log(modules)

Vue.use(Vuex)

// this shit is a fuckin nightmare, hopefully typescript is worth it, look into making this make sense later if possible?
const pilotUpdateSubscriber = (store: any): void => {
  store.subscribe((mutation: { type: string; }, state: { pilots: { Pilots: object } }): void => {
    if (mutation.type === 'UPDATE_PILOT' || 'SPLICE_PILOT' || 'CLONE_PILOT' || 'ADD_PILOT' || 'DELETE_PILOT' || 'UPDATE_PILOT_CONFIG') {
      io.saveUserData(Vue.prototype.userDataPath, 'pilots.json', state.pilots.Pilots)
    }
  })
}

console.log('modules', modules)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    pilotUpdateSubscriber
  ],
  strict: process.env.NODE_ENV !== 'production'
})
