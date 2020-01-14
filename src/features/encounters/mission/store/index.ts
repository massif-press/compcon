/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Mission, ActiveMission } from '@/class'
import { IMissionData, IActiveMissionData } from '@/interface'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_MISSION = 'ADD_MISSION'
export const ADD_ACTIVE_MISSION = 'ADD_ACTIVE_MISSION'
export const DELETE_MISSION = 'DELETE_MISSION'
export const DELETE_ACTIVE_MISSION = 'DELETE_ACTIVE_MISSION'
export const CLONE_MISSION = 'CLONE_MISSION'
export const LOAD_MISSIONS = 'LOAD_MISSIONS'
export const LOAD_ACTIVE_MISSIONS = 'LOAD_ACTIVE_MISSIONS'

async function saveMissionData(missions: Mission[]) {
  const serialized = missions.map(x => Mission.Serialize(x))
  await saveData('missions.json', serialized)
}

async function saveActiveMissionData(activeMissions: ActiveMission[]) {
  const serialized = activeMissions.map(x => ActiveMission.Serialize(x))
  await saveData('active_missions.json', serialized)
}

@Module({
  name: 'mission',
  namespaced: true,
})
export class MissionStore extends VuexModule {
  Missions: Mission[] = []
  ActiveMissions: ActiveMission[] = []

  @Mutation
  private [LOAD_MISSIONS](payload: IMissionData[]): void {
    this.Missions = [...payload.map(x => Mission.Deserialize(x))]
    saveMissionData(this.Missions)
  }

  @Mutation
  private [LOAD_ACTIVE_MISSIONS](payload: IActiveMissionData[]): void {
    this.ActiveMissions = [...payload.map(x => ActiveMission.Deserialize(x))]
    saveActiveMissionData(this.ActiveMissions)
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Missions.length) _.debounce(saveMissionData, 1000)(this.Missions)
    if (this.ActiveMissions.length) _.debounce(saveActiveMissionData, 1000)(this.ActiveMissions)
  }

  @Mutation
  private [ADD_MISSION](payload: Mission): void {
    this.Missions.push(payload)
    saveMissionData(this.Missions)
  }

  @Mutation
  private [ADD_ACTIVE_MISSION](payload: ActiveMission): void {
    this.ActiveMissions.push(payload)
    saveActiveMissionData(this.ActiveMissions)
  }

  @Mutation
  private [CLONE_MISSION](payload: Mission): void {
    let missionData = Mission.Serialize(payload)
    let newMission = Mission.Deserialize(missionData)
    newMission.RenewID()
    newMission.Name += ' (COPY)'
    this.Missions.push(newMission)
    saveMissionData(this.Missions)
  }

  @Mutation
  private [DELETE_MISSION](payload: Mission): void {
    const idx = this.Missions.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Missions.splice(idx, 1)
    } else {
      throw console.error('MISSION not loaded!')
    }
    saveMissionData(this.Missions)
  }

  @Mutation
  private [DELETE_ACTIVE_MISSION](payload: Mission): void {
    const idx = this.ActiveMissions.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.ActiveMissions.splice(idx, 1)
    } else {
      throw console.error('ACTIVE MISSION not loaded!')
    }
    saveActiveMissionData(this.ActiveMissions)
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
    const missionData = await loadData<IMissionData>('missions.json')
    this.context.commit(LOAD_MISSIONS, missionData)
  }

  @Action({ rawError: true })
  public async loadActiveMissions() {
    const missionData = await loadData<IActiveMissionData>('active_missions.json')
    this.context.commit(LOAD_ACTIVE_MISSIONS, missionData)
  }
}
