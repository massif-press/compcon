import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState } from 'vuex-electron'
import _ from 'lodash'
import io from './data_io'
import modules from './modules'

Vue.use(Vuex)

// the following mutations trigger an fs write on pilots.json
const pilotUpdateMutations = [
  'UPDATE_PILOT',
  'SPLICE_PILOT',
  'CLONE_PILOT',
  'ADD_PILOT',
  'DELETE_PILOT',
  'UPDATE_PILOT_CONFIG',
]

const pilotUpdateSubscriber = (store: any) => {
  store.subscribe((mutation: any, state: any) => {
    if (_.includes(pilotUpdateMutations, mutation.type)) {
      io.saveUserData(Vue.prototype.userDataPath, 'pilots.json', state.pilots.Pilots, () => {
        console.log('Data Saved')
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
