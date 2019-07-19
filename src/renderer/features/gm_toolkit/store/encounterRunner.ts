import Vue from 'vue'
import ActiveEncounter from '../logic/ActiveEncounter'
import _ from 'lodash'
import io from '../../_shared/data_io'
import EncounterBase from '../logic/EncounterBase'

function saveEncounters(encounters: ActiveEncounter[]) {
  const serialized = encounters.map(x => x.serialize())
  io.saveUserData(Vue.prototype.userDataPath, 'active_encounters.json', serialized, () => {
    console.info('Data Saved')
  })
}

export default {
  namespaced: true,
  state: {
    activeEncounters: [],
  },
  mutations: {
    load(state: any) {
      state.activeEncounters = io
        .loadUserData(Vue.prototype.userDataPath, 'active_encounters.json')
        .map(x => new ActiveEncounter(x))
      saveEncounters(state.activeEncounters)
    },
    add(state: any, enc: ActiveEncounter) {
      state.activeEncounters.push(enc)
      saveEncounters(state.activeEncounters)
    },
    delete(state: any, id: string) {
      _.remove(state.activeEncounters, { id })
      saveEncounters(state.activeEncounters)
    },
    edit(state: any, newEncounter: ActiveEncounter) {
      const target = state.activeEncounters.find(
        (enc: ActiveEncounter) => enc.id === newEncounter.id
      )
      if (!target) throw new Error('encounter does not exist')
      else {
        Object.assign(target, newEncounter)
        _.debounce(saveEncounters, 300)(state.activeEncounters)
      }
    },
  },
  actions: {
    runEncounter({ state, commit }: any, baseEnc: EncounterBase) {
      const activeEnc = new ActiveEncounter(baseEnc)
      commit('add', activeEnc)
      return activeEnc
    },
  },
}
