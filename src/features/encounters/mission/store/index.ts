/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Mission } from '@/class'
import { IMissionData } from '@/interface'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_MISSION = 'ADD_MISSION'
export const DELETE_MISSION = 'DELETE_MISSION'
export const CLONE_MISSION = 'CLONE_MISSION'
export const LOAD_MISSIONS = 'LOAD_MISSIONS'

async function saveMissionData(missions: Mission[]) {
  const serialized = missions.map(x => Mission.Serialize(x))
  await saveData('missions.json', serialized)
}

@Module({
  name: 'mission',
  namespaced: true,
})
export class MissionStore extends VuexModule {
  Missions: Mission[] = []

  @Mutation
  private [LOAD_MISSIONS](payload: IMissionData[]): void {
    this.Missions = [...payload.map(x => Mission.Deserialize(x))]
    saveMissionData(this.Missions)
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Missions.length) _.debounce(saveMissionData, 1000)(this.Missions)
  }

  @Mutation
  private [ADD_MISSION](payload: Mission): void {
    this.Missions.push(payload)
    saveMissionData(this.Missions)
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
  public deleteMission(payload: Mission): void {
    this.context.commit(DELETE_MISSION, payload)
  }

  @Action({ rawError: true })
  public async loadMissions() {
    const pilotData = await loadData<IMissionData>('missions.json')
    this.context.commit(LOAD_MISSIONS, pilotData)
  }
}
