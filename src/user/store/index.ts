/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import * as Sync from '../sync'
import * as Client from '../index'
import { ActiveMission, Encounter, Mission, Npc, Pilot } from '@/class'
import { Auth } from 'aws-amplify'
import _ from 'lodash'

export const SET_LOGGED_IN = 'SET_LOGGED_IN'
export const SET_AUTH_STATUS = 'SET_AUTH_STATUS'
export const SET_PATRON = 'SET_PATRON'
export const SET_PATREON_TOKEN = 'SET_PATREON_TOKEN'
export const LOAD_USER = 'LOAD_USER'
export const SET_USER = 'SET_USER'
export const SET_AWS_DATA = 'SET_AWS_DATA'
export const SET_USER_PROFILE = 'SET_USER_PROFILE'

let localUpdateTime = null

@Module({
  name: 'cloud',
})
export class UserStore extends VuexModule {
  public AuthStatus = 'No User'
  public IsLoggedIn = false
  public User = ''
  public UserProfile: Client.UserProfile = {} as any
  public PatreonToken = {}
  public AwsData = {}
  public IsPatron = false

  @Mutation
  private [LOAD_USER](payload: Client.UserProfile): void {
    this.UserProfile = payload
  }

  @Mutation
  private [SET_PATRON](state: boolean): void {
    this.IsPatron = state
  }

  @Mutation
  private [SET_LOGGED_IN](state: boolean): void {
    this.IsLoggedIn = state
  }

  @Mutation
  private [SET_AUTH_STATUS](status: string): void {
    this.AuthStatus = status
  }

  @Mutation
  private [SET_USER](data: any): void {
    this.User = data
  }

  @Mutation
  private [SET_USER_PROFILE](data: any): void {
    this.UserProfile = data
  }

  @Mutation
  private [SET_AWS_DATA](data: any): void {
    this.AwsData = data
  }

  @Mutation
  private [SET_PATREON_TOKEN](data: any): void {
    this.PatreonToken = data
  }

  @Action
  public clearOauth(): void {
    this.context.commit(SET_PATRON, false)
  }

  @Action
  public setUser(payload: any): void {
    this.context.commit(SET_USER, payload)
  }

  @Action
  public setUserProfile(payload: any): void {
    this.context.commit(SET_USER_PROFILE, payload)
  }

  @Action
  public setLoggedIn(payload: boolean): void {
    this.context.commit(SET_LOGGED_IN, payload)
  }

  get getUserProfile(): Client.UserProfile {
    return this.UserProfile
  }

  @Action({ rawError: true })
  public async setAws(payload: { user: any, condition?: string, noSync?: boolean }): Promise<void> {
    let sync = !payload.noSync
    if (localUpdateTime) {
      const diff = (new Date().getTime() - localUpdateTime.getTime()) / 1000
      if (diff < 3) {
        console.info(`Sync rate exceeded, please wait ${(3 - diff).toFixed(2)} seconds before syncing again`)
        sync = false
        return
      }
    }
    localUpdateTime = new Date()

    const syncedUser = await Sync.GetSync(payload.user.username)

    this.setUserProfile(syncedUser)
    this.setLoggedIn(true)
    this.UserProfile.Username = payload.user.attributes.email
    if (payload.condition === 'appLoad' && !this.UserProfile.SyncFrequency.onAppLoad) sync = false
    if (payload.condition === 'logIn' && !this.UserProfile.SyncFrequency.onLogIn) sync = false
    if (sync) {
      Sync.ContentPull()
        .then(() => {
          this.context.dispatch('refreshExtraContent')
        })
        .then(() => {
          Sync.CloudPull(this.UserProfile, e => {
            if (e instanceof Pilot)
              this.context.dispatch('addPilot', { pilot: e, update: false })
            if (e instanceof Npc) this.context.dispatch('addNpc', e)
            if (e instanceof Encounter) this.context.dispatch('addEncounter', e)
            if (e instanceof Mission) this.context.dispatch('addMission', e)
            if (e instanceof ActiveMission) this.context.dispatch('addActiveMission', e)
          })
        })
        .then(() => {
          this.UserProfile.MarkSync()
        })
        .catch(err => {
          console.error('unable to sync extra content: ', err)
        })
    }
  }

  @Action({ rawError: true })
  public async loadUser(): Promise<void> {
    const localdata = await Client.getUser().then(data => data)
    this.context.commit(LOAD_USER, localdata)
  }

  @Action({ rawError: true })
  public async cloudSync(payload: { callback?: any; condition?: string }): Promise<void> {
    const user = await Auth.currentAuthenticatedUser().then(res => res.username)
    if (!user) {
      console.info('no user')
      return
    }

    let sync = true
    if (payload.condition === 'bulkDelete' && !this.UserProfile.SyncFrequency.onBulkDelete)
      sync = false
    if (payload.condition === 'themeChange' && !this.UserProfile.SyncFrequency.onThemeChange)
      sync = false
    if (payload.condition === 'pilotLevel' && !this.UserProfile.SyncFrequency.onPilotLevel)
      sync = false
    if (payload.condition === 'pilotCreate' && !this.UserProfile.SyncFrequency.onPilotCreate)
      sync = false
    if (payload.condition === 'pilotDelete' && !this.UserProfile.SyncFrequency.onPilotDelete)
      sync = false
    if (payload.condition === 'mechCreate' && !this.UserProfile.SyncFrequency.onMechCreate)
      sync = false
    if (payload.condition === 'mechDelete' && !this.UserProfile.SyncFrequency.onMechDelete)
      sync = false
    if (payload.condition === 'npcCreate' && !this.UserProfile.SyncFrequency.onNpcCreate)
      sync = false
    if (payload.condition === 'npcDelete' && !this.UserProfile.SyncFrequency.onNpcDelete)
      sync = false
    if (
      payload.condition === 'encounterCreate' &&
      !this.UserProfile.SyncFrequency.onEncounterCreate
    )
      sync = false
    if (
      payload.condition === 'encounterDelete' &&
      !this.UserProfile.SyncFrequency.onEncounterDelete
    )
      sync = false
    if (payload.condition === 'missionCreate' && !this.UserProfile.SyncFrequency.onMissionCreate)
      sync = false
    if (payload.condition === 'missionDelete' && !this.UserProfile.SyncFrequency.onMissionDelete)
      sync = false
    if (payload.condition === 'missionStart' && !this.UserProfile.SyncFrequency.onMissionStart)
      sync = false
    if (payload.condition === 'turnEnd' && !this.UserProfile.SyncFrequency.onTurnEnd) sync = false

    if (localUpdateTime) {
      const diff = (new Date().getTime() - localUpdateTime.getTime()) / 1000
      if (diff < 3) {
        console.info(`Sync rate exceeded, please wait ${(3 - diff).toFixed(2)} seconds before syncing again`)
        sync = false
      }
    }

    if (sync) {
      localUpdateTime = new Date()
      Sync.CloudPush(this.UserProfile, payload.callback).then(() => this.UserProfile.MarkSync())
    }
  }

  @Action
  public setPatron(payload: any): void {
    this.context.commit(SET_PATRON, payload)
  }

  @Action
  public setPatreonToken(payload: any): void {
    this.context.commit(SET_PATREON_TOKEN, payload)
  }
}
