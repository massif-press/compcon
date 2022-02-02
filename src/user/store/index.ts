/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import * as Sync from '../sync'
import * as Client from '../index'
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

  // @Mutation
  // private [SET_PATRON](state: boolean): void {
  //   this.IsPatron = state
  // }

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

  // @Mutation
  // private [SET_PATREON_TOKEN](data: any): void {
  //   this.PatreonToken = data
  // }

  // @Action
  // public clearOauth(): void {
  //   this.context.commit(SET_PATRON, false)
  // }

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
  }

  @Action({ rawError: true })
  public async loadUser(): Promise<void> {
    const localdata = await Client.getUser().then(data => data)
    this.context.commit(LOAD_USER, localdata)
  }

  @Action({ rawError: true })
  public async cloudSave(payload: { callback?: any; overwrite?: boolean }): Promise<void> {
    const user = await Auth.currentAuthenticatedUser().then(res => res.username)
    if (!user) {
      console.error('cannot cloud save: no user')
      return
    }

    localUpdateTime = new Date()
    Sync.CloudPush(this.UserProfile, payload.callback).then(() => this.UserProfile.MarkSync())
  }

  // @Action
  // public setPatron(payload: any): void {
  //   this.context.commit(SET_PATRON, payload)
  // }

  // @Action
  // public setPatreonToken(payload: any): void {
  //   this.context.commit(SET_PATREON_TOKEN, payload)
  // }
}
