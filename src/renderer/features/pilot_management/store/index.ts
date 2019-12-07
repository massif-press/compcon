import _ from 'lodash'
import Vue from 'vue'
import { saveData, loadData } from '@/io/Data'
import { Pilot } from '@/class'
import validator from '../../../io/validator'
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
// import { PrintOptions } from '@/classes/Types'

async function savePilots(pilots: Pilot[]) {
  console.log(pilots)
  const serialized = pilots.map(x => Pilot.Serialize(x))
  await saveData('pilots.json', serialized)
}

export const SAVE_DATA = 'SAVE_DATA'
export const SET_PILOT = 'SET_PILOT'
export const UPDATE_PILOT = 'UPDATE_PILOT'
export const LOAD_PILOTS = 'LOAD_PILOTS'
export const ADD_PILOT = 'ADD_PILOT'
export const CLONE_PILOT = 'CLONE_PILOT'
export const DELETE_PILOT = 'DELETE_PILOT'
export const SET_PRINT_OPTIONS = 'SET_PRINT_OPTIONS'
export const SET_LOADED_MECH = 'SET_LOADED_MECH'

@Module({
  name: 'management',
})
export class PilotManagementStore extends VuexModule {
  public Pilots: Pilot[] = []
  public LoadedMechID: string = ''
  public ActivePilot: Pilot = null
  public printOptions: PrintOptions = null

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
  private [LOAD_PILOTS](payload: IPilotData[]): void {
    console.log(payload)
    this.Pilots = validator.checkVersion(payload).map(x => Pilot.Deserialize(x))
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

  @Mutation
  private [SET_LOADED_MECH](payload: string): void {
    this.LoadedMechID = payload
  }

  @Action
  public saveData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action({ rawError: true })
  public async loadPilots() {
    const pilotData = await loadData<IPilotData>('pilots.json')
    this.context.commit(LOAD_PILOTS, pilotData)
  }

  @Action
  public loadPilot(pilot: Pilot): void {
    this.context.commit(SET_PILOT, pilot)
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

  @Action
  public setLoadedMech(id: string): void {
    this.context.commit(SET_LOADED_MECH, id)
  }
}
