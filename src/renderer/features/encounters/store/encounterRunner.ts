import Vue from 'vue'
import ActiveEncounter, { IActiveEncounterData } from '../logic/ActiveEncounter'
import _ from 'lodash'
import { loadData, saveData } from '@/io/Data'
import EncounterBase from '../logic/EncounterBase'
import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators'

function saveEncounters(encounters: ActiveEncounter[]) {
  const serialized = encounters.map(x => x.serialize())
  saveData('active_encounters.json', serialized)
}

@Module({
  name: 'encounterRunner',
  namespaced: true,
})
export class EncounterRunnerStore extends VuexModule {
  activeEncounters: ActiveEncounter[] = []

  @Mutation
  load(payload: IActiveEncounterData[]) {
    // TODO: currently doing `x as any` because overloads don't work as i thought apparently, so i get a type error
    // in future, instead of using constructors for ActiveEncounter, have deserialize and fromEncounter static methods
    this.activeEncounters = payload.map(x => new ActiveEncounter(x as any))
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
    const target = this.activeEncounters.find((enc: ActiveEncounter) => enc.id === newEncounter.id)
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

  @Action
  async loadActiveEncounters() {
    const activeEncounterData = await loadData<IActiveEncounterData>('active_encounters.json')
    this.context.commit('load', activeEncounterData)
  }
}
