/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

export const SET_AUTH_STATUS = 'SET_AUTH_STATUS'
export const SET_PATRON = 'SET_PATRON'
export const SET_PATREON_TOKEN = 'SET_PATREON_TOKEN'
export const SET_USER = 'SET_USER'

@Module({
  name: 'cloud',
})
export class CloudStore extends VuexModule {
  public AuthStatus = 'No User'
  public User = ''
  public PatreonToken = {}
  public IsPatron = false

  @Mutation
  private [SET_PATRON](state: boolean): void {
    this.IsPatron = state
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
