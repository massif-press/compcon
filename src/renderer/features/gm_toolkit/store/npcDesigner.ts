import Vue from 'vue'
import NPC from '../logic/NPC'
import io from '../../_shared/data_io'
import _ from 'lodash'
import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

function saveNPCs(npcs: NPC[]) {
  const serialized = npcs.map(x => x.serialize())
  io.saveUserData(Vue.prototype.userDataPath, 'npcs.json', serialized, () => {
    console.info('Data Saved')
  })
}


@Module({
  name: "npcDesigner",
  namespaced: true,
})
export class NPCDesignerStore extends VuexModule {
  npcs: NPC[] = []

  @Mutation
  load() {
    this.npcs = io
      .loadUserData(Vue.prototype.userDataPath, 'npcs.json')
      .map(x => NPC.deserialize(x))
    saveNPCs(this.npcs)
  }

  @Mutation
  delete(id: string) {
    _.remove(this.npcs, { id })
    saveNPCs(this.npcs)
  }

  @Mutation
  add(npc: NPC) {
    this.npcs.push(npc)
    saveNPCs(this.npcs)
  }

  @Mutation
  edit(newNpc: NPC) {
    const target = this.npcs.find((npc: NPC) => npc.id === newNpc.id)
    if (!target) throw new Error('npc does not exist')
    else {
      Object.assign(target, newNpc)
      _.debounce(saveNPCs, 300)(this.npcs)
    }
  }
}
