import Vue from 'vue'
import EncounterBase from '../logic/EncounterBase'
import _ from 'lodash'
import npcDesigner from './npcDesigner'
import io from '../../_shared/data_io'

function saveEncounters(encounters: EncounterBase[]) {
  const serialized = encounters.map(x => x.serialize())
  io.saveUserData(Vue.prototype.userDataPath, 'encounters.json', serialized, () => {
    console.info('Data Saved')
  })
}

export default {
  namespaced: true,
  state: {
    encounters: [],
  },
  mutations: {
    load(state: any) {
      state.encounters = io
        .loadUserData(Vue.prototype.userDataPath, 'encounters.json')
        .map(x => EncounterBase.deserialize(x, npcDesigner.state.npcs))
      saveEncounters(state.encounters)
    },
    add(state: any, enc: EncounterBase) {
      state.encounters.push(enc)
      saveEncounters(state.encounters)
    },
    delete(state: any, id: string) {
      _.remove(state.encounters, { id })
      saveEncounters(state.encounters)
    },
    edit(state: any, newEncounter: EncounterBase) {
      const target = state.encounters.find((enc: EncounterBase) => enc.id === newEncounter.id)
      if (!target) throw new Error('encounter does not exist')
      else {
        Object.assign(target, newEncounter)
        _.debounce(saveEncounters, 300)(state.encounters)
      }
    },
  },
}
