/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { API } from 'aws-amplify'
import { getUser } from './graphql'
import { createUserData } from '@/graphql/mutations'
import * as Sync from '../sync'
import * as Client from '../index'

export const SET_LOGGED_IN = 'SET_LOGGED_IN'
export const SET_AUTH_STATUS = 'SET_AUTH_STATUS'
export const SET_PATRON = 'SET_PATRON'
export const SET_PATREON_TOKEN = 'SET_PATREON_TOKEN'
export const LOAD_USER = 'LOAD_USER'
export const SET_USER = 'SET_USER'
export const SET_AWS_DATA = 'SET_AWS_DATA'

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
    console.log('setting user', payload)
    this.context.commit(SET_USER, payload)
    // sync data
  }

  get getUserProfile(): Client.UserProfile {
    return this.UserProfile
  }

  @Action({ rawError: true })
  public async setAws(payload: any): Promise<void> {
    this.context.commit(SET_LOGGED_IN, true)
    Sync.GetSync(payload.username)
      .then(res => console.log(res))
      .catch(err => {
        throw new Error(`Unable to sync userdata\n${err}`)
      })
  }

  @Action({ rawError: true })
  public async loadUser(): Promise<void> {
    const localdata = await Client.getUser().then(data => data)
    console.log('this.user vs localdata')
    console.log(this.User, localdata)
    //check if already logged in
    //if yes, get user data
    //check user data against saved user data
    //if local is later, check options and send to cloud
    //if remote is later, check options and pull from cloud
    this.context.commit(LOAD_USER, localdata)
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
