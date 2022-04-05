/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { saveData, saveDelta, loadData, deleteDataById } from '@/io/Data'
import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator'
import { Pilot } from '@/class'
import { PilotData } from '@/interface'
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

async function saveOverwrite(pilots: Pilot[], pilotGroups: PilotGroup[]) {
  const serialized = pilots.map(x => Pilot.Serialize(x))
  await saveData('pilots_v2.json', serialized)
  await savePilotGroups(pilotGroups)
}

async function savePilots(pilots: Pilot[]) {
  const serialized = pilots.filter(x => x.SaveController.IsDirty).map(x => Pilot.Serialize(x))
  await saveDelta('pilots_v2.json', serialized)
}

async function savePilotGroups(pilotGroups: PilotGroup[]) {
  await saveData('pilot_groups_v2.json', pilotGroups)
}

async function delete_pilot(pilot: Pilot) {
  console.log('deleting pilot permanently: ', pilot.Name)
  await deleteDataById('pilots_v2.json', [pilot.ID])
}

export interface PilotGroup {
  name: string
  pilotIDs: string[]
  hidden: boolean
}

function createPilotGroups(pilots: Pilot[]): PilotGroup[] {
  const pilotGroups: PilotGroup[] = []
  pilotGroups.push({ name: '', pilotIDs: [], hidden: false })
  savePilotGroups(pilotGroups)
  return pilotGroups
}

export const SAVE_DATA = 'SAVE_DATA'
export const SET_DIRTY = 'SET_DIRTY'
export const SET_PILOT = 'SET_PILOT'
export const ADD_GROUP = 'ADD_GROUP'
export const MOVE_GROUP = 'MOVE_GROUP'
export const UPDATE_PILOT = 'UPDATE_PILOT'
export const LOAD_PILOTS = 'LOAD_PILOTS'
export const ADD_PILOT = 'ADD_PILOT'
export const MOVE_PILOT = 'MOVE_PILOT'
export const CLONE_PILOT = 'CLONE_PILOT'
export const DELETE_PILOT = 'DELETE_PILOT'
export const RESTORE_PILOT = 'RESTORE_PILOT'
export const DELETE_GROUP = 'DELETE_GROUP'
export const SET_GROUP_NAME = 'SET_GROUP_NAME'
export const SET_PRINT_OPTIONS = 'SET_PRINT_OPTIONS'
export const SET_LOADED_MECH = 'SET_LOADED_MECH'
export const DELETE_PILOT_PERMANENT = 'DELETE_PILOT_PERMANENT'
export const SAVE_ALL = 'SAVE_ALL'
export const SET_MISSING_CONTENT = 'SET_MISSING_CONTENT'

@Module({
  name: 'management',
})
export class PilotManagementStore extends VuexModule {
  public Pilots: Pilot[] = []
  public DeletedPilots: Pilot[] = []
  public PilotGroups: PilotGroup[] = []
  public MissingContent: PilotData[] = []
  public LoadedMechID = ''
  public ActivePilot: Pilot = null
  public printOptions: PrintOptions = null
  public Dirty = false

  public get AllPilots(): Pilot[] {
    return this.Pilots.concat(this.DeletedPilots)
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      savePilots(this.Pilots.concat(this.DeletedPilots))
      savePilotGroups(this.PilotGroups)
      this.Dirty = false
    }
  }

  @Mutation
  private [SAVE_ALL](): void {
    saveOverwrite(this.Pilots.concat(this.DeletedPilots), this.PilotGroups)
    this.Dirty = false
  }

  @Mutation
  private [SET_DIRTY](): void {
    if (this.Pilots.length) this.Dirty = true
  }

  @Mutation
  private [LOAD_PILOTS](payload: { pilotData: PilotData[]; groupData: PilotGroup[] }): void {
    const all = [...payload.pilotData.map(x => Pilot.Deserialize(x)).filter(x => x)]
    this.Pilots = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedPilots = all.filter(x => x.SaveController.IsDeleted)
    const groupDataEmpty = payload.groupData.length === 0
    const ungroupedOnlyEmpty =
      payload.groupData.length === 1 &&
      payload.groupData[0].name === ''

    if (groupDataEmpty || ungroupedOnlyEmpty) {
      console.info('Recreating groups')
      this.PilotGroups = createPilotGroups(this.Pilots)
    } else {
      console.info('Using existing groups')
      this.PilotGroups = payload.groupData
    }

    //clean up deleted
    const del = []
    this.DeletedPilots.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.DeleteTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} pilots marked for deletion`)
      del.forEach(p => {})
      savePilots(this.Pilots.concat(this.DeletedPilots))
    }
  }

  @Mutation
  private [ADD_PILOT](payload: Pilot): void {
    payload.SaveController.IsDirty = true
    const index = payload.GroupController.SortIndex
    if (index === null || index === undefined || index < 0) {
      payload.GroupController.SortIndex = this.Pilots.filter(p => p.GroupController.Group === payload.GroupController.Group).length
    }
    this.Pilots.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [MOVE_PILOT](): void {
    savePilots(this.Pilots.concat(this.DeletedPilots))
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
    this.Dirty = true
  }

  @Mutation
  private [DELETE_PILOT](payload: Pilot): void {
    const pilotIndex = this.Pilots.findIndex(x => x.ID === payload.ID)

    if (pilotIndex > -1) {
      this.Pilots.splice(pilotIndex, 1)
      this.DeletedPilots.push(payload)
    } else {
      throw console.error('Pilot not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [DELETE_PILOT_PERMANENT](payload: Pilot): void {
    const dpIdx = this.DeletedPilots.findIndex(x => x.ID === payload.ID)
    if (dpIdx > -1) {
      this.DeletedPilots.splice(dpIdx, 1)
      delete_pilot(payload)
    }
    this.Dirty = true
  }

  @Mutation
  private [RESTORE_PILOT](payload: Pilot): void {
    const pilotIndex = this.DeletedPilots.findIndex(x => x.ID === payload.ID)
    if (pilotIndex > -1) {
      this.DeletedPilots.splice(pilotIndex, 1)
      this.Pilots.push(payload)
    } else {
      throw console.error('Pilot not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [ADD_GROUP](payload: string): void {
    payload = payload ? payload : ''
    if (this.PilotGroups.map(x => x.name).indexOf(payload) === -1) {
      const newGroup: PilotGroup = {
        name: payload,
        pilotIDs: [],
        hidden: false,
      }
      this.PilotGroups.push(newGroup)
      savePilotGroups(this.PilotGroups)
    }
  }

  @Mutation
  private [MOVE_GROUP](): void {
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [DELETE_GROUP](payload: PilotGroup): void {
    this.Pilots.forEach((p: Pilot) => {
      if (p.GroupController.Group === payload.name) p.GroupController.Group = ''
    })
    this.Dirty = true

    const idx = this.PilotGroups.indexOf(payload)
    if (idx !== -1) this.PilotGroups.splice(idx, 1)
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [SET_GROUP_NAME](payload: { g: PilotGroup; newName: string }): void {
    const oldName = payload.g.name
    const newName = payload.newName
    this.Pilots.forEach((p: Pilot) => {
      if (p.GroupController.Group === oldName) p.GroupController.Group = newName
    })
    this.Dirty = true

    payload.g.name = newName
    savePilotGroups(this.PilotGroups)
  }

  @Mutation
  private [SET_LOADED_MECH](payload: string): void {
    this.LoadedMechID = payload
  }

  @Mutation [SET_MISSING_CONTENT](payload: PilotData[]): void {
    this.MissingContent = payload
  }

  get getPilots(): Pilot[] {
    return this.Pilots
  }

  get unsavedCloudPilots(): Pilot[] {
    return this.Pilots.filter(x => x.SaveController.IsDirty)
  }

  @Action
  public setPilots(payload: Pilot[]) {
    this.context.commit('SET_PILOTS', payload)
  }

  @Action
  public set_pilot_dirty(): void {
    this.context.commit(SET_DIRTY)
  }

  @Action
  public set_mech_dirty(): void {
    this.context.commit(SET_DIRTY)
  }

  @Action
  public savePilotData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public saveAllPilotData(): void {
    this.context.commit(SAVE_ALL)
  }

  @Action({ rawError: true })
  public async loadPilots() {
    const pilotData = await loadData<PilotData>('pilots_v2.json')
    const pilotGroupData = await loadData<PilotGroup>('pilot_groups_v2.json')
    this.context.commit(LOAD_PILOTS, {
      pilotData: ItemsWithLcp(pilotData),
      groupData: pilotGroupData,
    })
    this.context.commit(SET_MISSING_CONTENT, ItemsMissingLcp(pilotData))
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
  public addPilot(payload: Pilot): void {
    this.context.commit(ADD_PILOT, payload)
    this.context.commit(ADD_GROUP, payload.GroupController.Group)
  }

  @Action
  public movePilot(): void {
    this.context.commit(MOVE_PILOT)
  }

  @Action
  public addGroup(payload: string): void {
    this.context.commit(ADD_GROUP, payload)
  }

  @Action
  public moveGroup(): void {
    this.context.commit(MOVE_GROUP)
  }

  @Action
  public delete_pilot(payload: Pilot): void {
    this.context.commit(DELETE_PILOT, payload)
  }

  @Action
  public deletePilotPermanent(payload: Pilot): void {
    if (!payload.SaveController.IsDeleted) this.context.commit(DELETE_PILOT)
    this.context.commit(DELETE_PILOT_PERMANENT, payload)
  }

  @Action
  public restore_pilot(payload: Pilot): void {
    this.context.commit(RESTORE_PILOT, payload)
  }

  @Action
  public deleteGroup(payload: PilotGroup): void {
    this.context.commit(DELETE_GROUP, payload)
  }

  @Action
  public setGroupName(payload: { g: PilotGroup; newName: string }): void {
    this.context.commit(SET_GROUP_NAME, payload)
  }

  @Action
  public setLoadedMech(id: string): void {
    this.context.commit(SET_LOADED_MECH, id)
  }
}
