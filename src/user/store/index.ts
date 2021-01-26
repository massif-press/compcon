/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import * as Sync from '../sync'
import * as Client from '../index'
import { Pilot } from '@/class'

export const SET_LOGGED_IN = 'SET_LOGGED_IN'
export const SET_AUTH_STATUS = 'SET_AUTH_STATUS'
export const SET_PATRON = 'SET_PATRON'
export const SET_PATREON_TOKEN = 'SET_PATREON_TOKEN'
export const LOAD_USER = 'LOAD_USER'
export const SET_USER = 'SET_USER'
export const SET_AWS_DATA = 'SET_AWS_DATA'
export const SET_USER_PROFILE = 'SET_USER_PROFILE'

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
  public async setAws(payload: any): Promise<void> {
    await Sync.GetSync(payload.username)
      .then(res => {
        this.context.commit(SET_LOGGED_IN, true)
        this.setUserProfile(res)
      })
      .then(() => {
        Sync.ContentPull().then(() => {
          this.context.dispatch('loadExtraContent')
        })
      })
      .then(() => {
        Sync.CloudPull((pilot: Pilot) => this.context.dispatch('addPilot', pilot))
      })
      .then(() => this.UserProfile.MarkSync())
      .catch(err => {
        console.error(err)
        throw new Error(`Unable to sync userdata\n${err}`)
      })
  }

  @Action({ rawError: true })
  public async loadUser(): Promise<void> {
    const localdata = await Client.getUser().then(data => data)
    this.context.commit(LOAD_USER, localdata)
  }

  @Action({ rawError: true })
  public async cloudSync(callback: any): Promise<void> {
    Sync.CloudPush(this.UserProfile, callback).then(() => this.UserProfile.MarkSync())
  }

  @Action
  public setPatron(payload: any): void {
    console.log('setting oauth', payload)
    this.context.commit(SET_PATRON, payload)
  }

  @Action
  public setPatreonToken(payload: any): void {
    this.context.commit(SET_PATREON_TOKEN, payload)
  }
}
