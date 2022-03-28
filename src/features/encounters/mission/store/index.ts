/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Mission, ActiveMission } from '@/class'
import { IMissionData, IActiveMissionData } from '@/interface'
import { loadData, saveDelta, deleteDataById, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const SAVE_DATA = 'SAVE_DATA'
export const SET_DIRTY = 'SET_DIRTY'
export const ADD_MISSION = 'ADD_MISSION'
export const ADD_ACTIVE_MISSION = 'ADD_ACTIVE_MISSION'
export const DELETE_MISSION = 'DELETE_MISSION'
export const RESTORE_MISSION = 'RESTORE_MISSION'
export const DELETE_ACTIVE_MISSION = 'DELETE_ACTIVE_MISSION'
export const RESTORE_ACTIVE_MISSION = 'RESTORE_ACTIVE_MISSION'
export const CLONE_MISSION = 'CLONE_MISSION'
export const LOAD_MISSIONS = 'LOAD_MISSIONS'
export const LOAD_ACTIVE_MISSIONS = 'LOAD_ACTIVE_MISSIONS'
export const DELETE_ACTIVE_MISSION_PERMANENT = 'DELETE_ACTIVE_MISSION_PERMANENT'
export const DELETE_MISSION_PERMANENT = 'DELETE_MISSION_PERMANENT'
export const SAVE_ALL = 'SAVE_ALL'

async function saveOverwrite(missions: Mission[], activeMissions: ActiveMission[]) {
  const sm = missions.map(x => Mission.Serialize(x))
  const sam = activeMissions.map(x => ActiveMission.Serialize(x))
  await saveData('missions_v2.json', sm)
  await saveData('active_missions_v2.json', sam)
}

async function saveMissionData(missions: Mission[]) {
  console.log('saving missions')
  const serialized = missions.filter(x => x.SaveController.IsDirty).map(x => Mission.Serialize(x))
  await saveDelta('missions_v2.json', serialized)
}

async function saveActiveMissionData(activeMissions: ActiveMission[]) {
  console.log('saving mission data')
  const serialized = activeMissions
    .filter(x => x.SaveController.IsDirty)
    .map(x => ActiveMission.Serialize(x))
  await saveDelta('active_missions_v2.json', serialized)
}

async function deleteMission(mission: Mission) {
  console.log('deleting mission permanently: ', mission.Name)
  await deleteDataById('missions_v2.json', [mission.ID])
}

async function deleteActiveMission(activemission: ActiveMission) {
  console.log('deleting activemission permanently: ', activemission.Name)
  await deleteDataById('active_missions_v2.json', [activemission.ID])
}

@Module({
  name: 'mission',
})
export class MissionStore extends VuexModule {
  Missions: Mission[] = []
  ActiveMissions: ActiveMission[] = []
  DeletedMissions: Mission[] = []
  DeletedActiveMissions: ActiveMission[] = []
  Dirty = false

  public get AllMissions(): Mission[] {
    return this.Missions.concat(this.DeletedMissions)
  }

  public get AllActiveMissions(): ActiveMission[] {
    return this.ActiveMissions.concat(this.DeletedActiveMissions)
  }

  @Mutation
  private [LOAD_MISSIONS](payload: IMissionData[]): void {
    const all = [...payload.map(x => Mission.Deserialize(x))]
    this.Missions = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedMissions = all.filter(x => x.SaveController.IsDeleted)

    //clean up deleted
    const del = []
    this.DeletedMissions.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.DeleteTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} Missions marked for deletion`)
      del.forEach(p => {
        const dpIdx = this.DeletedMissions.findIndex(x => x.ID === p.ID)
        if (dpIdx > -1) {
          this.DeletedMissions.splice(dpIdx, 1)
        }
      })
      saveMissionData(this.Missions.concat(this.DeletedMissions))
    }
  }

  @Mutation
  private [LOAD_ACTIVE_MISSIONS](payload: IActiveMissionData[]): void {
    const all = [...payload.map(x => ActiveMission.Deserialize(x))]
    this.ActiveMissions = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedActiveMissions = all.filter(x => x.SaveController.IsDeleted)

    //clean up deleted
    const del = []
    this.DeletedActiveMissions.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.DeleteTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} ActiveMissions marked for deletion`)
      del.forEach(p => {
        const dpIdx = this.DeletedActiveMissions.findIndex(x => x.ID === p.ID)
        if (dpIdx > -1) {
          this.DeletedActiveMissions.splice(dpIdx, 1)
        }
      })
      saveActiveMissionData(this.ActiveMissions.concat(this.DeletedActiveMissions))
    }
  }

  @Mutation
  private [SET_DIRTY](): void {
    if (this.Missions.length || this.ActiveMissions.length) this.Dirty = true
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      saveMissionData(this.Missions.concat(this.DeletedMissions))
      saveActiveMissionData(this.ActiveMissions.concat(this.DeletedActiveMissions))
      this.Dirty = false
    }
  }

  @Mutation
  private [SAVE_ALL](): void {
    saveOverwrite(
      this.Missions.concat(this.DeletedMissions),
      this.ActiveMissions.concat(this.DeletedActiveMissions)
    )
    this.Dirty = false
  }

  @Mutation
  private [ADD_MISSION](payload: Mission): void {
    payload.SaveController.IsDirty = true
    this.Missions.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [ADD_ACTIVE_MISSION](payload: ActiveMission): void {
    payload.SaveController.IsDirty = true
    this.ActiveMissions.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [CLONE_MISSION](payload: Mission): void {
    const missionData = Mission.Serialize(payload)
    const newMission = Mission.Deserialize(missionData)
    newMission.RenewID()
    newMission.Name += ' (COPY)'
    this.Missions.push(newMission)
    this.Dirty = true
  }

  @Mutation
  private [DELETE_MISSION](payload: Mission): void {
    const idx = this.Missions.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Missions.splice(idx, 1)
      this.DeletedMissions.push(payload)
    } else {
      throw console.error('MISSION not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [DELETE_MISSION_PERMANENT](payload: Mission): void {
    const dpIdx = this.DeletedMissions.findIndex(x => x.ID === payload.ID)
    if (dpIdx > -1) {
      this.DeletedMissions.splice(dpIdx, 1)
      deleteMission(payload)
    }
    this.Dirty = true
  }

  @Mutation
  private [DELETE_ACTIVE_MISSION_PERMANENT](payload: ActiveMission): void {
    const dpIdx = this.DeletedActiveMissions.findIndex(x => x.ID === payload.ID)
    if (dpIdx > -1) {
      this.DeletedActiveMissions.splice(dpIdx, 1)
      deleteActiveMission(payload)
    }
    this.Dirty = true
  }

  @Mutation
  private [RESTORE_MISSION](payload: Mission): void {
    const MissionIndex = this.DeletedMissions.findIndex(x => x.ID === payload.ID)
    if (MissionIndex > -1) {
      this.DeletedMissions[MissionIndex].SaveController.restore()
      this.DeletedMissions.splice(MissionIndex, 1)
      this.Missions.push(payload)
    } else {
      throw console.error('Mission not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [DELETE_ACTIVE_MISSION](payload: ActiveMission): void {
    const idx = this.ActiveMissions.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.ActiveMissions.splice(idx, 1)
      this.DeletedActiveMissions.push(payload)
    } else {
      throw console.error('ACTIVE MISSION not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [RESTORE_ACTIVE_MISSION](payload: ActiveMission): void {
    const ActiveMissionIndex = this.DeletedActiveMissions.findIndex(x => x.ID === payload.ID)
    if (ActiveMissionIndex > -1) {
      this.DeletedActiveMissions[ActiveMissionIndex].SaveController.restore()
      this.DeletedActiveMissions.splice(ActiveMissionIndex, 1)
      this.ActiveMissions.push(payload)
    } else {
      throw console.error('ActiveMission not loaded!')
    }
    this.Dirty = true
  }

  @Action
  public setMissionsDirty(): void {
    this.context.commit(SET_DIRTY)
  }

  @Action
  public set_mission_dirty(): void {
    this.context.commit(SET_DIRTY)
  }

  @Action
  public saveMissionData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public saveAllMissionData(): void {
    this.context.commit(SAVE_ALL)
  }

  @Action
  public cloneMission(payload: Mission): void {
    this.context.commit(CLONE_MISSION, payload)
  }

  @Action
  public addMission(payload: Mission): void {
    this.context.commit(ADD_MISSION, payload)
  }

  @Action
  public addActiveMission(payload: ActiveMission): void {
    this.context.commit(ADD_ACTIVE_MISSION, payload)
  }

  @Action
  public deleteMission(payload: Mission): void {
    payload.SaveController.delete()
    this.context.commit(DELETE_MISSION, payload)
  }

  @Action
  public restoreMission(payload: Mission): void {
    payload.SaveController.restore()
    this.context.commit(RESTORE_MISSION, payload)
  }

  @Action
  public deleteMissionPermanent(payload: Mission): void {
    if (!payload.SaveController.IsDeleted) this.context.commit(DELETE_MISSION)
    this.context.commit(DELETE_MISSION_PERMANENT, payload)
  }

  @Action
  public deleteActiveMission(payload: ActiveMission): void {
    payload.SaveController.delete()
    this.context.commit(DELETE_ACTIVE_MISSION, payload)
  }

  @Action
  public restoreActiveMission(payload: Mission): void {
    payload.SaveController.restore()
    this.context.commit(RESTORE_ACTIVE_MISSION, payload)
  }

  @Action
  public deleteActiveMissionPermanent(payload: ActiveMission): void {
    if (!payload.SaveController.IsDeleted) this.context.commit(DELETE_ACTIVE_MISSION)
    this.context.commit(DELETE_ACTIVE_MISSION_PERMANENT, payload)
  }

  @Action({ rawError: true })
  public async loadMissions() {
    const missionData = await loadData<IMissionData>('missions_v2.json')
    this.context.commit(LOAD_MISSIONS, missionData)
  }

  @Action({ rawError: true })
  public async loadActiveMissions() {
    const missionData = await loadData<IActiveMissionData>('active_missions_v2.json')
    this.context.commit(LOAD_ACTIVE_MISSIONS, missionData)
  }

  get getMissions(): Mission[] {
    return this.Missions
  }

  get getActiveMissions(): ActiveMission[] {
    return this.ActiveMissions
  }
}
