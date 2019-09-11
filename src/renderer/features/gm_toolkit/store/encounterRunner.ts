import Vue from 'vue'
import ActiveEncounter from '../logic/ActiveEncounter'
import _ from 'lodash'
import io from '../../_shared/data_io'
import EncounterBase from '../logic/EncounterBase'
import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators';

function saveEncounters(encounters: ActiveEncounter[]) {
  const serialized = encounters.map(x => x.serialize())
  io.saveUserData(Vue.prototype.userDataPath, 'active_encounters.json', serialized, () => {
    console.info('Data Saved')
  })
}


@Module({
  name: "encounterRunner",
  namespaced: true,
})
export class EncounterRunnerStore extends VuexModule {
  activeEncounters: ActiveEncounter[] = []

  @Mutation
  load() {
    this.activeEncounters = io
      .loadUserData(Vue.prototype.userDataPath, 'active_encounters.json')
      .map(x => new ActiveEncounter(x))
    saveEncounters(this.activeEncounters)
  }

  @Mutation
  add(enc: ActiveEncounter) {
    this.activeEncounters.push(enc)
    saveEncounters(this.activeEncounters)
  }

  @Mutation
  delete(id: string) {
    _.remove(this.activeEncounters, { id })
    saveEncounters(this.activeEncounters)
  }

  @Mutation
  edit(newEncounter: ActiveEncounter) {
    const target = this.activeEncounters.find(
      (enc: ActiveEncounter) => enc.id === newEncounter.id
    )
    if (!target) throw new Error('encounter does not exist')
    else {
      Object.assign(target, newEncounter)
      _.debounce(saveEncounters, 300)(this.activeEncounters)
    }
  }

  @Action
  runEncounter(baseEnc: EncounterBase) {
    const activeEnc = new ActiveEncounter(baseEnc)
    this.context.commit('add', activeEnc)
    return activeEnc
  }
}
