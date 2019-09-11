import _ from 'lodash'
import Vue from 'vue'
import io from '../../_shared/data_io'
import { Pilot } from '@/class'
import validator from '../logic/validator'
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { PrintOptions } from '@/features/_shared/classes/Types'

function savePilots(pilots: Pilot[]): void {
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
  name: 'management',
})
export class PilotManagementStore extends VuexModule {
  public Pilots: Pilot[] = []
  public ActivePilot: Pilot = undefined
  public printOptions: PrintOptions = undefined

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Pilots.length) _.debounce(savePilots, 300)(this.Pilots)
  }

  @Mutation
  private [SET_PILOT](payload: Pilot): void {
    this.ActivePilot = payload
  }

  @Mutation
  private [UPDATE_PILOT](payload: Pilot): void {
    const index = this.Pilots.findIndex(x => x.ID === this.ActivePilot.ID)
    if (index > -1) {
      Vue.set(this.Pilots, index, payload)
      this.ActivePilot = payload
    }
  }

  @Mutation
  private [LOAD_PILOTS](): void {
    this.Pilots = validator
      .checkVersion(io.loadUserData(Vue.prototype.userDataPath, 'pilots.json') as IPilotData[])
      .map(x => Pilot.Deserialize(x))
    savePilots(this.Pilots)
  }

  @Mutation
  private [ADD_PILOT](payload: Pilot): void {
    this.Pilots.push(payload)
    savePilots(this.Pilots)
  }

  @Mutation
  private [CLONE_PILOT](payload: { pilot: Pilot; quirk: boolean }): void {
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
  private [DELETE_PILOT](payload: Pilot): void {
    const pilotIndex = this.Pilots.findIndex(x => x.ID === payload.ID)
    if (pilotIndex > -1) {
      this.Pilots.splice(pilotIndex, 1)
    } else {
      throw console.error('Pilot not loaded!')
    }
    savePilots(this.Pilots)
  }

  @Mutation
  private [SET_PRINT_OPTIONS](payload: PrintOptions): void {
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
  public saveData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action({ rawError: true })
  public loadPilots(): void {
    this.context.commit(LOAD_PILOTS)
  }

  @Action
  public loadPilot(pilotId: string): void {
    this.context.commit(SET_PILOT, pilotId)
  }

  @Action
  public updatePilot(payload: Pilot): void {
    this.context.commit(UPDATE_PILOT, payload)
  }

  @Action
  public clonePilot(payload: Pilot): void {
    this.context.commit(CLONE_PILOT, payload)
  }

  @Action
  public addPilot(payload: Pilot): void {
    this.context.commit(ADD_PILOT, payload)
  }

  @Action
  public deletePilot(payload: Pilot): void {
    this.context.commit(DELETE_PILOT, payload)
  }

  @Action
  public setPrintOptions(options: object): void {
    this.context.commit(SET_PRINT_OPTIONS, options)
  }
}
