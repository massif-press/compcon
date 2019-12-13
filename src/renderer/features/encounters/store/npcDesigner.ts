import Vue from 'vue'
import NPC, { INPCData } from '../logic/NPC'
import { loadData, saveData } from '@/io/Data'
import _ from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

// TODO: use constants & actions

function saveNPCs(npcs: NPC[]) {
  const serialized = npcs.map(x => x.serialize())
  saveData('npcs.json', serialized)
}

@Module({
  name: 'npcDesigner',
  namespaced: true,
})
export class NPCDesignerStore extends VuexModule {
  npcs: NPC[] = []

  @Mutation
  load(payload: INPCData[]) {
    this.npcs = payload.map(x => NPC.deserialize(x))
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

  @Action
  async loadNPCs() {
    const npcData = await loadData<INPCData>('npcs.json')
    this.context.commit('load', npcData)
  }
}
