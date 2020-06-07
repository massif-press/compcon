/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { saveData, loadData } from '@/io/Data'
import { Pilot } from '@/class'
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

async function savePilots(pilots: Pilot[]) {
  const serialized = pilots.map(x => Pilot.Serialize(x))
  await saveData('pilots_v2.json', serialized)
}

async function savePilotGroups(groups: string[]) {
  await saveData('pilot_groups.json', groups)
}

export const SAVE_DATA = 'SAVE_DATA'
export const SET_PILOT = 'SET_PILOT'
export const ADD_GROUP = 'ADD_GROUP'
export const UPDATE_PILOT = 'UPDATE_PILOT'
export const LOAD_PILOTS = 'LOAD_PILOTS'
export const ADD_PILOT = 'ADD_PILOT'
export const CLONE_PILOT = 'CLONE_PILOT'
export const DELETE_PILOT = 'DELETE_PILOT'
export const DELETE_GROUP = 'DELETE_GROUP'
export const SET_PRINT_OPTIONS = 'SET_PRINT_OPTIONS'
export const SET_LOADED_MECH = 'SET_LOADED_MECH'

@Module({
  name: 'management',
})
export class PilotManagementStore extends VuexModule {
  public Pilots: Pilot[] = []
  public PilotGroups: string[] = []
  public LoadedMechID = ''
  public ActivePilot: Pilot = null
  public printOptions: PrintOptions = null

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Pilots.length) _.debounce(savePilots, 1000)(this.Pilots)
    if (this.PilotGroups.length) _.debounce(savePilotGroups, 1000)(this.PilotGroups)
  }

  @Mutation
  private [LOAD_PILOTS](payload: { pilotData: IPilotData[]; groupData: string[] }): void {
    // TODO: bring back validator?
    // should maybe validate in the action instead of the mutator...
    // this.Pilots = validator.checkVersion(payload).map(x => Pilot.Deserialize(x))
    this.Pilots = [...payload.pilotData.map(x => Pilot.Deserialize(x))]
    // savePilots(this.Pilots)
    this.PilotGroups = _.uniq(payload.pilotData.map(x => x.group).concat(payload.groupData))
  }

  @Mutation
  private [ADD_PILOT](payload: Pilot): void {
    this.Pilots.push(payload)
    savePilots(this.Pilots)
  }

  @Mutation
  private [ADD_GROUP](payload: string): void {
    this.PilotGroups.push(payload)
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [DELETE_GROUP](payload: string): void {
    this.PilotGroups.splice(this.PilotGroups.indexOf(payload), 1)
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [CLONE_PILOT](payload: { pilot: Pilot; quirk: boolean }): void {
    const pilotData = Pilot.Serialize(payload.pilot)
    const newPilot = Pilot.Deserialize(pilotData)
    newPilot.RenewID()
    newPilot.Name += ' (CLONE)'
    newPilot.Callsign += '*'
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
  private [SET_LOADED_MECH](payload: string): void {
    this.LoadedMechID = payload
  }

  get getPilots(): Pilot[] {
    return this.Pilots
  }

  @Action
  public setPilots(payload: Pilot[]) {
    this.context.commit('SET_PILOTS', payload)
  }

  @Action
  public saveData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action({ rawError: true })
  public async loadPilots() {
    const pilotData = await loadData<IPilotData>('pilots_v2.json')
    const groupData = await loadData<string>('pilot_groups.json')
    this.context.commit(LOAD_PILOTS, { pilotData, groupData })
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
  public addGroup(payload: string): void {
    this.context.commit(ADD_GROUP, payload)
  }

  @Action
  public deletePilot(payload: Pilot): void {
    this.context.commit(DELETE_PILOT, payload)
  }

  @Action
  public deleteGroup(payload: string): void {
    this.context.commit(DELETE_GROUP, payload)
  }

  @Action
  public setLoadedMech(id: string): void {
    this.context.commit(SET_LOADED_MECH, id)
  }
}
