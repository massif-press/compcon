/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

export const SET_NAV_MODE = 'SET_NAV_MODE'
export const SET_DARK_MODE = 'SET_DARK_MODE'
export const SET_THEME = 'SET_THEME'
export const LOG_ERROR = 'LOG_ERROR'

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

  public Errors: IErrorReport[] = []

  @Mutation
  public [LOG_ERROR](error: IErrorReport) {
    this.Errors = [error, ...this.Errors]
  }

  @Action({ commit: LOG_ERROR })
  public logError(error: IErrorReport) {
    return error
  }
}
