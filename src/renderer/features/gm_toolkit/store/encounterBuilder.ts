import Vue from 'vue'
import EncounterBase, { IEncounterBaseData } from '../logic/EncounterBase'
import _ from 'lodash'
import { NPCDesignerStore } from './npcDesigner'
import { loadData, saveData } from '@/io/Data'
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

// TODO: use constants & actions

function saveEncounters(encounters: EncounterBase[]) {
  const serialized = encounters.map(x => x.serialize())
  saveData('encounters.json', serialized)
}

@Module({
  name: 'encounterBuilder',
  namespaced: true,
})
export class EncounterBuilderStore extends VuexModule {
  encounters: EncounterBase[] = []

  @Mutation
  load(payload: IEncounterBaseData[]) {
    this.encounters = payload.map(x => EncounterBase.deserialize(x, NPCDesignerStore.state.npcs))
    saveEncounters(this.encounters)
  }

  @Mutation
  add(enc: EncounterBase) {
    this.encounters.push(enc)
    saveEncounters(this.encounters)
  }

  @Mutation
  delete(id: string) {
    _.remove(this.encounters, { id })
    saveEncounters(this.encounters)
  }

  @Mutation
  edit(newEncounter: EncounterBase) {
    const target = this.encounters.find((enc: EncounterBase) => enc.id === newEncounter.id)
    if (!target) throw new Error('encounter does not exist')
    else {
      Object.assign(target, newEncounter)
      _.debounce(saveEncounters, 300)(this.encounters)
    }
  }

  @Action
  async loadEncounters() {
    const encounterData = await loadData<IEncounterBaseData>('encounters.json')
    this.context.commit('load', encounterData)
  }
}
