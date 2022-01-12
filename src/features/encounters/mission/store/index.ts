/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Mission, ActiveMission } from '@/class'
import { IMissionData, IActiveMissionData } from '@/interface'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const SAVE_DATA = 'SAVE_DATA'
export const SET_DIRTY = 'SET_DIRTY'
export const ADD_MISSION = 'ADD_MISSION'
export const ADD_ACTIVE_MISSION = 'ADD_ACTIVE_MISSION'
export const DELETE_MISSION = 'DELETE_MISSION'
export const DELETE_ACTIVE_MISSION = 'DELETE_ACTIVE_MISSION'
export const CLONE_MISSION = 'CLONE_MISSION'
export const LOAD_MISSIONS = 'LOAD_MISSIONS'
export const LOAD_ACTIVE_MISSIONS = 'LOAD_ACTIVE_MISSIONS'

async function saveMissionData(missions: Mission[]) {
  console.log('saving missions')
  const serialized = missions.map(x => Mission.Serialize(x))
  await saveData('missions_v2.json', serialized)
}

async function saveActiveMissionData(activeMissions: ActiveMission[]) {
  console.log('saving mission data')
  const serialized = activeMissions.map(x => ActiveMission.Serialize(x))
  await saveData('active_missions_v2.json', serialized)
}

@Module({
  name: 'mission',
})
export class MissionStore extends VuexModule {
  Missions: Mission[] = []
  ActiveMissions: ActiveMission[] = []
  Dirty = false

  @Mutation
  private [LOAD_MISSIONS](payload: IMissionData[]): void {
    this.Missions = [...payload.map(x => Mission.Deserialize(x))]
  }

  @Mutation
  private [LOAD_ACTIVE_MISSIONS](payload: IActiveMissionData[]): void {
    this.ActiveMissions = [...payload.map(x => ActiveMission.Deserialize(x))]
  }

  @Mutation
  private [SET_DIRTY](): void {
    if (this.Missions.length || this.ActiveMissions.length) this.Dirty = true
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      saveMissionData(this.Missions)
      saveActiveMissionData(this.ActiveMissions)
      this.Dirty = false
    }
  }

  @Mutation
  private [ADD_MISSION](payload: Mission): void {
    this.Missions.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [ADD_ACTIVE_MISSION](payload: ActiveMission): void {
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
    } else {
      throw console.error('MISSION not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [DELETE_ACTIVE_MISSION](payload: Mission): void {
    const idx = this.ActiveMissions.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.ActiveMissions.splice(idx, 1)
    } else {
      throw console.error('ACTIVE MISSION not loaded!')
    }
    this.Dirty = true
  }

  @Action
  public setMissionsDirty(): void {
    this.context.commit(SET_DIRTY)
  }

  @Action
  public saveMissionData(): void {
    this.context.commit(SAVE_DATA)
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
    this.context.commit(DELETE_MISSION, payload)
  }

  @Action
  public deleteActiveMission(payload: ActiveMission): void {
    this.context.commit(DELETE_ACTIVE_MISSION, payload)
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
