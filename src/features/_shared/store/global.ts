import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const OPEN_SNACKBAR = 'OPEN_SNACKBAR'
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR'

@Module({
  name: 'global',
})
export class Global extends VuexModule {
  private _snackbar = {
    text: '',
    multiline: false,
    timeout: 6000,
    color: 'primary',
    visible: true,
  }

  @Mutation
  private [OPEN_SNACKBAR](payload: ISnackbarSettings): void {
    this._snackbar.text = payload.text
    this._snackbar.multiline = payload.multiline || false
    this._snackbar.timeout = payload.timeout || 6000
    this._snackbar.color = payload.color ? payload.color : 'primary'
    this._snackbar.visible = true
  }

  @Mutation
  private [CLOSE_SNACKBAR](): void {
    this._snackbar.visible = false
    this._snackbar.multiline = false
    this._snackbar.timeout = 6000
    this._snackbar.text = null
    this._snackbar.color = 'primary'
  }

  public get snackbar(): ISnackbarSettings {
    console.log('getting snackbar:', this._snackbar)
    return this._snackbar
  }

  @Action
  public openSnackbar(payload: ISnackbarSettings): void {
    this.context.commit(OPEN_SNACKBAR, payload)
  }

  @Action
  public closeSnackbar(): void {
    this.context.commit(CLOSE_SNACKBAR)
  }
}
