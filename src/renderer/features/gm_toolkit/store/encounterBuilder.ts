import Vue from 'vue'
import EncounterBase from '../logic/EncounterBase'
import _ from 'lodash'
import { NPCDesignerStore } from './npcDesigner'
import io from '../../_shared/data_io'
import { VuexModule, Module, Mutation } from 'vuex-module-decorators';

function saveEncounters(encounters: EncounterBase[]) {
  const serialized = encounters.map(x => x.serialize())
  io.saveUserData(Vue.prototype.userDataPath, 'encounters.json', serialized, () => {
    console.info('Data Saved')
  })
}


@Module({
  name: "encounterBuilder",
  namespaced: true,
})
export class EncounterBuilderStore extends VuexModule {
  encounters: EncounterBase[] = []

  @Mutation
  load() {
    this.encounters = io
      .loadUserData(Vue.prototype.userDataPath, 'encounters.json')
      .map(x => EncounterBase.deserialize(x, NPCDesignerStore.state.npcs))
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
}
