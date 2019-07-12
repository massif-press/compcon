import Vue from 'vue'
import NPC from '../logic/NPC'
import io from '../../_shared/data_io'
import _ from 'lodash'

function saveNPCs(npcs: NPC[]) {
  const serialized = npcs.map(x => x.serialize())
  io.saveUserData(Vue.prototype.userDataPath, 'npcs.json', serialized, () => {
    console.info('Data Saved')
  })
}

export default {
  namespaced: true,
  state: {
    npcs: [],
  },
  mutations: {
    load(state: any) {
      state.npcs = io
        .loadUserData(Vue.prototype.userDataPath, 'npcs.json')
        .map(x => NPC.deserialize(x))
      saveNPCs(state.npcs)
    },
    delete(state: any, id: string) {
      _.remove(state.npcs, { id })
      saveNPCs(state.npcs)
    },
    add(state: any, npc: NPC) {
      state.npcs.push(npc)
      console.log(state.npcs)
      saveNPCs(state.npcs)
    },
    edit(state: any, newNpc: NPC) {
      const target = state.npcs.find((npc: NPC) => npc.id === newNpc.id)
      if (!target) throw new Error('npc does not exist')
      else {
        Object.assign(target, newNpc)
        _.debounce(saveNPCs, 300)(state.npcs)
      }
    },
  },
}
