/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { saveData, loadData } from '@/io/Data'
import { Pilot } from '@/class'
import { IPilotData } from '@/interface'
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

async function savePilots(pilots: Pilot[]) {
  const serialized = pilots.map(x => Pilot.Serialize(x))
  await saveData('pilots_v2.json', serialized)
}

function sortPilotsByGroup(pilots: Pilot[], pilotGroups: string[]) {
  const cmp = function(a, b) {
    if (a > b) return +1;
    if (a < b) return -1;
    return 0;
  }
  pilots.sort((a, b) => {
    return cmp(pilotGroups.indexOf(a.Group), pilotGroups.indexOf(b.Group)) || cmp(a.SortIndex, b.SortIndex)
  })
}

function reindexPilots(pilots: Pilot[]) {
  pilots.forEach((p, i) => p.SortIndex = i)
}

export const SAVE_DATA = 'SAVE_DATA'
export const SET_PILOT = 'SET_PILOT'
export const ADD_GROUP = 'ADD_GROUP'
export const UPDATE_PILOT = 'UPDATE_PILOT'
export const LOAD_PILOTS = 'LOAD_PILOTS'
export const ADD_PILOT = 'ADD_PILOT'
export const MOVE_PILOT = 'MOVE_PILOT'
export const CLONE_PILOT = 'CLONE_PILOT'
export const DELETE_PILOT = 'DELETE_PILOT'
export const DELETE_GROUP = 'DELETE_GROUP'
export const SET_GROUP_NAME = 'SET_GROUP_NAME'
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
  }

  @Mutation
  private [LOAD_PILOTS](payload: IPilotData[]): void {
    const allPilots = [...payload.map(x => Pilot.Deserialize(x)).filter(x => x)]
    this.Pilots = allPilots
    this.PilotGroups = _.uniq(this.PilotGroups.concat(this.Pilots.map(x => x.Group)).concat(['']))
    sortPilotsByGroup(this.Pilots, this.PilotGroups)
    reindexPilots(this.Pilots)
  }

  @Mutation
  private [ADD_PILOT](payload: Pilot): void {
    payload.SortIndex = this.Pilots.length
    this.Pilots.push(payload)
    sortPilotsByGroup(this.Pilots, this.PilotGroups)
    reindexPilots(this.Pilots)
    savePilots(this.Pilots)
  }

  @Mutation
  private [MOVE_PILOT](payload: { fromIndex: number, toIndex: number, g: string }): void {
    const splicePilot = this.Pilots.splice(payload.fromIndex, 1)[0]
    splicePilot.Group = payload.g
    const groupIndex = this.Pilots.findIndex( p => p.Group === payload.g )
    const toIndex = groupIndex + payload.toIndex
    this.Pilots.splice(toIndex, 0, splicePilot)
    reindexPilots(this.Pilots)
    savePilots(this.Pilots)
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
    sortPilotsByGroup(this.Pilots, this.PilotGroups)
    reindexPilots(this.Pilots)
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
    reindexPilots(this.Pilots)
    savePilots(this.Pilots)
  }

  @Mutation
  private [ADD_GROUP](payload: string): void {
    this.PilotGroups.indexOf(payload) === -1 ? this.PilotGroups.push(payload) : null
  }

  @Mutation
  private [DELETE_GROUP](payload: string): void {
    this.Pilots.forEach((p: Pilot, i) => {
      if (p.Group === payload) {
        p.Group = ''
        p.SortIndex = this.Pilots.length + i
      }
    })
    const idx = this.PilotGroups.indexOf(payload)
    if (idx === -1) return
    this.PilotGroups.splice(idx, 1)
    sortPilotsByGroup(this.Pilots, this.PilotGroups)
    reindexPilots(this.Pilots)
  }

  @Mutation
  private [SET_GROUP_NAME](payload: {oldName: string; newName: string}): void {
    const oldName = payload.oldName
    const newName = payload.newName
    this.Pilots.forEach((p: Pilot) => {
      if (p.Group === oldName) p.Group = newName
    })
    const idx = this.PilotGroups.indexOf(oldName)
    if (idx === -1) return
    this.PilotGroups.splice(idx, 1, newName)
  }

  @Mutation
  private [SET_LOADED_MECH](payload: string): void {
    this.LoadedMechID = payload
  }

  get getPilots(): Pilot[] {
    return this.Pilots
  }

  get unsavedCloudPilots(): Pilot[] {
    return this.Pilots.filter(x => x.IsDirty)
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
    this.context.commit(LOAD_PILOTS, pilotData)
  }

  @Action({ rawError: true })
  public async loadCloudPilots(pilotData) {
    this.context.commit(LOAD_PILOTS, pilotData)
  }

  @Action
  public clonePilot(payload: Pilot): void {
    this.context.commit(CLONE_PILOT, payload)
  }

  @Action
  public addPilot(payload: { pilot: Pilot; update: boolean }): void {
    this.context.commit(ADD_PILOT, payload.pilot)
    if (payload.update)
      this.context.dispatch('cloudSync', { callback: null, condition: 'pilotCreate' })
  }

  @Action
  public movePilot(payload: {fromIndex: number; toIndex: number; g: string}): void {
    this.context.commit(MOVE_PILOT, payload)
  }

  @Action
  public addGroup(payload: string): void {
    this.context.commit(ADD_GROUP, payload)
  }

  @Action
  public deletePilot(payload: { pilot: Pilot; update: boolean }): void {
    this.context.commit(DELETE_PILOT, payload.pilot)
    if (payload.update)
      this.context.dispatch('cloudSync', { callback: null, condition: 'pilotDelete' })
  }

  @Action
  public deleteGroup(payload: string): void {
    this.context.commit(DELETE_GROUP, payload)
  }

  @Action
  public setGroupName(payload: {oldName: string; newName: string}): void {
    this.context.commit(SET_GROUP_NAME, payload)
  }

  @Action
  public setLoadedMech(id: string): void {
    this.context.commit(SET_LOADED_MECH, id)
  }
}
