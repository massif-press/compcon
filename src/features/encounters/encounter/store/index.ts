/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Encounter } from '@/class'
import { IEncounterData } from '@/interface'
import { loadData, saveDelta, deleteDataById, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const SET_DIRTY = 'SET_DIRTY'
export const SAVE_DATA = 'SAVE_DATA'
export const ADD_ENCOUNTER = 'ADD_ENCOUNTER'
export const DELETE_ENCOUNTER = 'DELETE_ENCOUNTER'
export const RESTORE_ENCOUNTER = 'RESTORE_ENCOUNTER'
export const CLONE_ENCOUNTER = 'CLONE_ENCOUNTER'
export const LOAD_ENCOUNTERS = 'LOAD_ENCOUNTERS'
export const DELETE_ENCOUNTER_PERMANENT = 'DELETE_ENCOUNTER_PERMANENT'

async function saveEncounterData(encounters: Encounter[]) {
  const serialized = encounters
    .filter(x => x.SaveController.IsDirty)
    .map(x => Encounter.Serialize(x))
  await saveDelta('encounters_v2.json', serialized)
}

async function delete_encounter(encounter: Encounter) {
  console.log('deleting encounter permanently: ', encounter.Name)
  await deleteDataById('encounters_v2.json', [encounter.ID])
}

@Module({
  name: 'encounter',
})
export class EncounterStore extends VuexModule {
  Encounters: Encounter[] = []
  DeletedEncounters: Encounter[] = []
  Dirty = false

  public get AllEncounters(): Encounter[] {
    return this.Encounters.concat(this.DeletedEncounters)
  }

  @Mutation
  private [LOAD_ENCOUNTERS](payload: IEncounterData[]): void {
    const all = [...payload.map(x => Encounter.Deserialize(x))]
    this.Encounters = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedEncounters = all.filter(x => x.SaveController.IsDeleted)

    //clean up deleted
    const del = []
    this.DeletedEncounters.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} Encounters marked for deletion`)
      del.forEach(p => {
        const dpIdx = this.DeletedEncounters.findIndex(x => x.ID === p.ID)
        if (dpIdx > -1) {
          this.DeletedEncounters.splice(dpIdx, 1)
        }
      })
      saveEncounterData(this.Encounters.concat(this.DeletedEncounters))
    }
  }

  @Mutation
  private [SET_DIRTY](): void {
    if (this.Encounters.length) this.Dirty = true
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      saveEncounterData(this.Encounters.concat(this.DeletedEncounters))
      this.Dirty = false
    }
  }

  @Mutation
  private [ADD_ENCOUNTER](payload: Encounter): void {
    payload.SaveController.IsDirty = true
    this.Encounters.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [CLONE_ENCOUNTER](payload: Encounter): void {
    const encounterData = Encounter.Serialize(payload)
    const newEncounter = Encounter.Deserialize(encounterData)
    newEncounter.RenewID()
    newEncounter.Name += ' (COPY)'
    this.Encounters.push(newEncounter)
    this.Dirty = true
  }

  @Mutation
  private [DELETE_ENCOUNTER](payload: Encounter): void {
    const idx = this.Encounters.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Encounters.splice(idx, 1)
      this.DeletedEncounters.push(payload)
    } else {
      throw console.error('ENCOUNTER not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [DELETE_ENCOUNTER_PERMANENT](payload: Encounter): void {
    const dpIdx = this.DeletedEncounters.findIndex(x => x.ID === payload.ID)
    if (dpIdx > -1) {
      this.DeletedEncounters.splice(dpIdx, 1)
      delete_encounter(payload)
    }
    this.Dirty = true
  }

  @Mutation
  private [RESTORE_ENCOUNTER](payload: Encounter): void {
    const EncounterIndex = this.DeletedEncounters.findIndex(x => x.ID === payload.ID)
    if (EncounterIndex > -1) {
      this.DeletedEncounters.splice(EncounterIndex, 1)
      this.Encounters.push(payload)
    } else {
      throw console.error('Encounter not loaded!')
    }
    this.Dirty = true
  }

  get getEncounters(): Encounter[] {
    return this.Encounters
  }

  @Action
  public setEncountersDirty(): void {
    this.context.commit(SET_DIRTY)
  }

  @Action
  public set_encounter_dirty(): void {
    this.context.commit(SET_DIRTY)
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
  public delete_encounter(payload: Encounter): void {
    this.context.commit(DELETE_ENCOUNTER, payload)
  }

  @Action
  public deleteEncounterPermanent(payload: Encounter): void {
    if (!payload.SaveController.IsDeleted) this.context.commit(DELETE_ENCOUNTER)
    this.context.commit(DELETE_ENCOUNTER_PERMANENT, payload)
  }

  @Action
  public restore_encounter(payload: Encounter): void {
    this.context.commit(RESTORE_ENCOUNTER, payload)
  }

  @Action({ rawError: true })
  public async loadEncounters() {
    const data = await loadData<IEncounterData>('encounters_v2.json')
    this.context.commit(LOAD_ENCOUNTERS, data)
  }
}
