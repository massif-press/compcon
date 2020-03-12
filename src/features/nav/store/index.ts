/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

export const SET_NAV_MODE = 'SET_NAV_MODE'

@Module({
  name: 'nav',
})
export class NavStore extends VuexModule {
  public NavMode = ''

  @Mutation
  private [SET_NAV_MODE](mode: string): void {
    this.NavMode = mode
  }

  @Action
  public setNavMode(payload: string): void {
    this.context.commit(SET_NAV_MODE, payload)
  }
}
