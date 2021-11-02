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

async function savePilotGroups(pilotGroups: PilotGroup[]) {
  await saveData('pilot_groups.json', pilotGroups)
}

export interface PilotGroup {
  name: string
  pilotIDs: string[]
  hidden: boolean
}

function createPilotGroups(pilots: Pilot[]): PilotGroup[] {
  const pilotGroups: PilotGroup[] = []
  pilotGroups.push({"name": '', "pilotIDs": [], "hidden": false})
  console.info("Creating pilot groups from existing pilots")
  pilots.forEach(p => {
    const group = pilotGroups.filter(g => g.name === p.Group)[0]
    if (group) {
      group.pilotIDs.push(p.ID)
    } else {
      pilotGroups.push({"name": p.Group, "pilotIDs": [p.ID], "hidden": false})
    }
  })
  savePilotGroups(pilotGroups)
  return pilotGroups
}

function getPilotGroup(groupName: string, groups: PilotGroup[]): PilotGroup {
  const groupNames = groups.map(x => x.name)
  const idx = groupNames.indexOf(groupName)
  return groups[idx]
}

function addPilotIdToGroups(pilot: Pilot, groups: PilotGroup[]): void {
  const pilotGroup = getPilotGroup(pilot.Group, groups)
  pilotGroup.pilotIDs.push(pilot.ID)
}

function deletePilotIdFromGroups(pilot: Pilot, groups: PilotGroup[]): void {
  const pilotGroup = getPilotGroup(pilot.Group, groups)
  const idx = pilotGroup.pilotIDs.indexOf(pilot.ID)
  if (idx === -1) return
  pilotGroup.pilotIDs.splice(idx, 1)
}

export const SAVE_DATA = 'SAVE_DATA'
export const SET_PILOT = 'SET_PILOT'
export const ADD_GROUP = 'ADD_GROUP'
export const REORDER_GROUPS = 'REORDER_GROUPS'
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
  public PilotGroups: PilotGroup[] = []
  public LoadedMechID = ''
  public ActivePilot: Pilot = null
  public printOptions: PrintOptions = null

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Pilots.length) _.debounce(savePilots, 1000)(this.Pilots)
  }

  @Mutation
  private [LOAD_PILOTS](payload: {pilotData: IPilotData[], pilotGroupData: PilotGroup[]}): void {
    const allPilots = [...payload.pilotData.map(x => Pilot.Deserialize(x)).filter(x => x)]
    this.Pilots = allPilots
    this.PilotGroups = payload.pilotGroupData.length ? payload.pilotGroupData : createPilotGroups(this.Pilots)
  }

  @Mutation
  private [ADD_PILOT](payload: Pilot): void {
    payload.SortIndex = this.Pilots.length
    this.Pilots.push(payload)
    savePilots(this.Pilots)

    addPilotIdToGroups(payload, this.PilotGroups)
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [MOVE_PILOT](payload: { fromIndex: number, toIndex: number, g: string }): void {
    const splicePilot = this.Pilots.splice(payload.fromIndex, 1)[0]
    splicePilot.Group = payload.g
    const groupIndex = this.Pilots.findIndex( p => p.Group === payload.g )
    const toIndex = groupIndex + payload.toIndex
    this.Pilots.splice(toIndex, 0, splicePilot)
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
    addPilotIdToGroups(newPilot, this.PilotGroups)
    savePilots(this.Pilots)
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [DELETE_PILOT](payload: Pilot): void {
    const pilotIndex = this.Pilots.findIndex(x => x.ID === payload.ID)
    if (pilotIndex > -1) {
      this.Pilots.splice(pilotIndex, 1)
    } else {
      throw console.error('Pilot not loaded!')
    }

    deletePilotIdFromGroups(payload, this.PilotGroups)
    savePilots(this.Pilots)
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [ADD_GROUP](payload: string): void {
    if (this.PilotGroups.map(x => x.name).indexOf(payload) === -1) {
      const newGroup: PilotGroup = {
        "name": payload,
        "pilotIDs": [],
        "hidden": false
      }
      this.PilotGroups.push(newGroup)
      savePilotGroups(this.PilotGroups)
    }
  }

  @Mutation
  private [REORDER_GROUPS](payload: PilotGroup[]): void {
    this.PilotGroups = payload
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [DELETE_GROUP](payload: PilotGroup): void {
    const ungroupedGroup = getPilotGroup("", this.PilotGroups)
    this.Pilots.forEach((p: Pilot) => {
      if (p.Group === payload.name) {
        p.Group = ''
        ungroupedGroup.pilotIDs.push(p.ID)
      }
    })
    savePilots(this.Pilots)

    const idx = this.PilotGroups.indexOf(payload)
    if (idx === -1) return
    this.PilotGroups.splice(idx, 1)
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [SET_GROUP_NAME](payload: {g: PilotGroup; newName: string}): void {
    const oldName = payload.g.name
    const newName = payload.newName
    this.Pilots.forEach((p: Pilot) => {
      if (p.Group === oldName) p.Group = newName
    })

    payload.g.name = newName
    savePilotGroups(this.PilotGroups)
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
    const pilotGroupData = await loadData<PilotGroup>('pilot_groups.json')
    const pilotData = await loadData<IPilotData>('pilots_v2.json')
    this.context.commit(LOAD_PILOTS, {'pilotData': pilotData, 'pilotGroupData': pilotGroupData})
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
  public reorderGroups(payload: PilotGroup[]): void {
    this.context.commit(REORDER_GROUPS, payload)
  }

  @Action
  public deletePilot(payload: { pilot: Pilot; update: boolean }): void {
    this.context.commit(DELETE_PILOT, payload.pilot)
    if (payload.update)
      this.context.dispatch('cloudSync', { callback: null, condition: 'pilotDelete' })
  }

  @Action
  public deleteGroup(payload: PilotGroup): void {
    this.context.commit(DELETE_GROUP, payload)
  }

  @Action
  public setGroupName(payload: {g: PilotGroup; newName: string}): void {
    this.context.commit(SET_GROUP_NAME, payload)
  }

  @Action
  public setLoadedMech(id: string): void {
    this.context.commit(SET_LOADED_MECH, id)
  }
}
