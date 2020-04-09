/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Encounter } from '@/class'
import { IEncounterData } from '@/interface'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_ENCOUNTER = 'ADD_ENCOUNTER'
export const DELETE_ENCOUNTER = 'DELETE_ENCOUNTER'
export const CLONE_ENCOUNTER = 'CLONE_ENCOUNTER'
export const LOAD_ENCOUNTERS = 'LOAD_ENCOUNTERS'

async function saveEncounterData(encounters: Encounter[]) {
  const serialized = encounters.map(x => Encounter.Serialize(x))
  await saveData('encounters_v2.json', serialized)
}

@Module({
  name: 'encounter',
  namespaced: true,
})
export class EncounterStore extends VuexModule {
  Encounters: Encounter[] = []

  @Mutation
  private [LOAD_ENCOUNTERS](payload: IEncounterData[]): void {
    this.Encounters = [...payload.map(x => Encounter.Deserialize(x))]
    saveEncounterData(this.Encounters)
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Encounters.length) _.debounce(saveEncounterData, 1000)(this.Encounters)
  }

  @Mutation
  private [ADD_ENCOUNTER](payload: Encounter): void {
    this.Encounters.push(payload)
    saveEncounterData(this.Encounters)
  }

  @Mutation
  private [CLONE_ENCOUNTER](payload: Encounter): void {
    const encounterData = Encounter.Serialize(payload)
    const newEncounter = Encounter.Deserialize(encounterData)
    newEncounter.RenewID()
    newEncounter.Name += ' (COPY)'
    this.Encounters.push(newEncounter)
    saveEncounterData(this.Encounters)
  }

  @Mutation
  private [DELETE_ENCOUNTER](payload: Encounter): void {
    const idx = this.Encounters.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Encounters.splice(idx, 1)
    } else {
      throw console.error('ENCOUNTER not loaded!')
    }
    saveEncounterData(this.Encounters)
  }

  get getEncounters(): Encounter[] {
    return this.Encounters
  }

  @Action
  public saveEncounterData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public cloneEncounter(payload: Encounter): void {
    this.context.commit(CLONE_ENCOUNTER, payload)
  }

  @Action
  public addEncounter(payload: Encounter): void {
    this.context.commit(ADD_ENCOUNTER, payload)
  }

  @Action
  public deleteEncounter(payload: Encounter): void {
    this.context.commit(DELETE_ENCOUNTER, payload)
  }

  @Action({ rawError: true })
  public async loadEncounters() {
    const pilotData = await loadData<IEncounterData>('encounters_v2.json')
    this.context.commit(LOAD_ENCOUNTERS, pilotData)
  }
}
