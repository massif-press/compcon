/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Module, VuexModule, Action, Mutation, MutationAction } from 'vuex-module-decorators'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore, store } from '@/store'

export const SET_NAV_MODE = 'SET_NAV_MODE'
export const SET_DARK_MODE = 'SET_DARK_MODE'
export const LOG_ERROR = 'LOG_ERROR'

@Module({
  name: 'nav',
})
export class NavStore extends VuexModule {
  public NavMode = ''
  public DarkMode = false

  @Mutation
  private [SET_NAV_MODE](mode: string): void {
    this.NavMode = mode
  }

  @Action
  public setNavMode(payload: string): void {
    this.context.commit(SET_NAV_MODE, payload)
  }

  @Mutation
  private [SET_DARK_MODE](mode: string): void {
    this.DarkMode = mode === 'dark'
  }

  @Action
  public setDarkMode(payload: string): void {
    this.context.commit(SET_DARK_MODE, payload)
  }

  @Action
  public initDarkMode(): void {
    // TODO: fix this bad hack -- seems like app mounting is getting in before the user info resolves. Works fine on route, but fails on startup because UserProfile resolves to its awaiting observer. It might make the most sense to store theme selection elsewhere and deal with it in main.js
    const ls = JSON.parse(localStorage.getItem('user.config'))
    const mode = getModule(CompendiumStore, store).UserProfile.Theme
      ? getModule(CompendiumStore, store).UserProfile.Theme
      : ls && ls.theme
      ? ls.theme
      : 'light'
    this.context.commit(SET_DARK_MODE, mode)
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
