/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import * as Sync from '@/cloud/user_sync'
import { AutoSyncAll } from '@/cloud/item_sync'
import { SyncLCPs } from '@/cloud/lcp_sync'
import * as Client from '../index'
import { Auth } from 'aws-amplify'
import _ from 'lodash'

export const SET_LOGGED_IN = 'SET_LOGGED_IN'
export const SET_AUTH_STATUS = 'SET_AUTH_STATUS'
export const SET_PATRON = 'SET_PATRON'
export const SET_PATREON_TOKEN = 'SET_PATREON_TOKEN'
export const LOAD_USER_PROFILE = 'LOAD_USER_PROFILE'
export const SET_COGNITO_USER = 'SET_USER'
export const SET_AWS_DATA = 'SET_AWS_DATA'
export const SET_USER_PROFILE = 'SET_USER_PROFILE'

let localUpdateTime = null

@Module({
  name: 'cloud',
})
export class UserStore extends VuexModule {
  public AuthStatus = 'No User'
  public IsLoggedIn = false
  public CognitoUser = ''
  public UserProfile: Client.UserProfile = {} as any
  public PatreonToken = {}
  public AwsData = {}
  public IsPatron = false

  @Mutation
  private [LOAD_USER_PROFILE](payload: Client.UserProfile): void {
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
  private [SET_COGNITO_USER](data: any): void {
    this.CognitoUser = data
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
  public setCognitoUser(payload: any): void {
    this.context.commit(SET_COGNITO_USER, payload)
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
  public async setAws(payload: { cognitoUser: any }): Promise<void> {
    const syncedUser = await Sync.GetCloudProfile(payload.cognitoUser.user_id)

    this.setUserProfile(syncedUser)
    this.setLoggedIn(true)
    this.UserProfile.Username = payload.cognitoUser.attributes.email

    if (this.UserProfile.SyncFrequency.cloudSync_v2) {
      console.info('auto-sync ON')
      try {
        await SyncLCPs()
        await AutoSyncAll()
      } catch (error) {
        console.error('error in auto-sync:', error)
      }
    }
  }

  @Action({ rawError: true })
  public async loadUser(): Promise<void> {
    const localdata = await Client.getLocalProfile()
    this.context.commit(LOAD_USER_PROFILE, localdata)
  }

  @Action({ rawError: true })
  public async updateUserData(): Promise<void> {
    console.info('Updating User Info before unload event')
    Sync.UpdateUserData(this.UserProfile)
  }
}
