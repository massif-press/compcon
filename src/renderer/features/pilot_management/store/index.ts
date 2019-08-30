import _ from 'lodash'
import Vue from 'vue'
import io from '../../_shared/data_io'
import { Pilot } from '@/class'
import validator from '../logic/validator';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { PrintOptions } from '@/features/_shared/classes/Types';

function savePilots(pilots: Pilot[]) {
  const serialized = pilots.map(x => Pilot.Serialize(x))
  io.saveUserData(Vue.prototype.userDataPath, 'pilots.json', serialized, () => {
    console.info('Data Saved')
  })
}

export const SAVE_DATA = 'SAVE_DATA'
export const SET_PILOT = 'SET_PILOT'
export const UPDATE_PILOT = 'UPDATE_PILOT'
export const LOAD_PILOTS = 'LOAD_PILOTS'
export const ADD_PILOT = 'ADD_PILOT'
export const CLONE_PILOT = 'CLONE_PILOT'
export const DELETE_PILOT = 'DELETE_PILOT'
export const SET_PRINT_OPTIONS = 'SET_PRINT_OPTIONS'

@Module({
  name: "PilotManagementStore",
})
export class PilotManagementStore extends VuexModule {
  Pilots: Pilot[] = []
  ActivePilot: Pilot = undefined
  printOptions: PrintOptions = undefined

  @Mutation
  [SAVE_DATA]() {
    if (this.Pilots.length) _.debounce(savePilots, 300)(this.Pilots)
  }

  @Mutation
  [SET_PILOT](payload: Pilot) {
    this.ActivePilot = payload
  }

  @Mutation
  [UPDATE_PILOT](payload: Pilot) {
    const index = this.Pilots.findIndex(x => x.ID === this.ActivePilot.ID)
    if (index > -1) {
      Vue.set(this.Pilots, index, payload)
      this.ActivePilot = payload
    }
  }

  @Mutation
  [LOAD_PILOTS]() {
    this.Pilots = validator.checkVersion(io
      .loadUserData(Vue.prototype.userDataPath, 'pilots.json') as IPilotData[])
      .map(x => Pilot.Deserialize(x))
    savePilots(this.Pilots)
  }

  @Mutation
  [ADD_PILOT](payload: Pilot) {
    this.Pilots.push(payload)
    savePilots(this.Pilots)
  }

  @Mutation
  [CLONE_PILOT](payload: { pilot: Pilot; quirk: boolean }) {
    let pilotData = Pilot.Serialize(payload.pilot)
    let newPilot = Pilot.Deserialize(pilotData)
    newPilot.RenewID()
    newPilot.Name += ' (CLONE)'
    newPilot.Callsign += '*'
    if (payload.quirk) newPilot.RollQuirk()
    for (const mech of newPilot.Mechs) {
      mech.RenewID()
    }
    this.Pilots.push(newPilot)
    savePilots(this.Pilots)
  }

  @Mutation
  [DELETE_PILOT](payload: Pilot) {
    const pilotIndex = this.Pilots.findIndex(x => x.ID === payload.ID)
    if (pilotIndex > -1) {
      this.Pilots.splice(pilotIndex, 1)
    } else {
      throw console.error('Pilot not loaded!')
    }
    savePilots(this.Pilots)
  }

  @Mutation
  [SET_PRINT_OPTIONS](payload: PrintOptions) {
    this.printOptions = payload
  }

  /**
   * @deprecated Now that type info is preserved, 
   * just access `ActivePilot` directly instead. 
   */
  get getPilot(): Pilot {
    return this.ActivePilot
  }
  get getAllPilots(): Pilot[] {
    return this.Pilots || []
  }
  /**
   * @deprecated Now that type info is preserved, 
   * just access `printOptions` directly instead. 
   */
  get getPrintOptions(): PrintOptions {
    return this.printOptions
  }

  @Action
  saveData() {
    this.context.commit(SAVE_DATA)
  }

  @Action({ rawError: true })
  loadPilots() {
    this.context.commit(LOAD_PILOTS)
  }

  @Action
  loadPilot(pilotId: string) {
    this.context.commit(SET_PILOT, pilotId)
  }

  @Action
  updatePilot(payload: Pilot) {
    this.context.commit(UPDATE_PILOT, payload)
  }

  @Action
  clonePilot(payload: Pilot) {
    this.context.commit(CLONE_PILOT, payload)
  }

  @Action
  addPilot(payload: Pilot) {
    this.context.commit(ADD_PILOT, payload)
  }

  @Action
  deletePilot(payload: Pilot) {
    this.context.commit(DELETE_PILOT, payload)
  }

  @Action
  setPrintOptions(options: object) {
    this.context.commit(SET_PRINT_OPTIONS, options)
  }
}
