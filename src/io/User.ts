import path from 'path'
import extlog from './ExtLog'
import uuid from 'uuid/v4'
import { writeFile, readFile, exists, USER_DATA_PATH } from './Data'

const CONFIG_FILE_NAME = 'user.config'

interface IUserProfile {
  id: string
  selectorView: string
  npcView: string
  rosterView: string
  hangarView: string
  pilotSheetView: string
  theme: string
}

class UserProfile {
  private _id: string
  private _selectorView: string
  private _npcView: string
  private _rosterView: string
  private _hangarView: string
  private _pilotSheetView: string
  private _theme: string

  public constructor(id: string) {
    this._id = id
    this._selectorView = 'split'
    this._npcView = 'list'
    this._rosterView = 'list'
    this._hangarView = 'cards'
    this._pilotSheetView = 'tabbed'
    this._theme = 'light'
  }

  private save(): void {
    const data: IUserProfile = {
      id: this.ID,
      selectorView: this.SelectorView,
      npcView: this.NpcView,
      rosterView: this.RosterView,
      hangarView: this.HangarView,
      pilotSheetView: this.PilotSheetView,
      theme: this.Theme,
    }

    writeFile(CONFIG_FILE_NAME, JSON.stringify(data, null, 2))
  }

  public get ID(): string {
    return this._id
  }

  public set ID(id: string) {
    this._id = id
    this.save()
  }

  public get RosterView(): string {
    return this._rosterView
  }

  public set RosterView(view: string) {
    this._rosterView = view
    this.save()
  }

  public get SelectorView(): string {
    return this._selectorView
  }

  public set SelectorView(view: string) {
    this._selectorView = view
    this.save()
  }

  public get NpcView(): string {
    return this._npcView
  }

  public set NpcView(view: string) {
    this._npcView = view
    this.save()
  }

  public get HangarView(): string {
    return this._hangarView
  }

  public set HangarView(view: string) {
    this._hangarView = view
    this.save()
  }

  public get PilotSheetView(): string {
    return this._pilotSheetView
  }

  public set PilotSheetView(view: string) {
    this._pilotSheetView = view
    this.save()
  }

  public get Theme(): string {
    return this._theme
  }

  public set Theme(t: string) {
    this._theme = t
    this.save()
  }

  public static Deserialize(data: IUserProfile): UserProfile {
    const profile = new UserProfile(data.id)
    profile._id = data.id || uuid()
    profile.SelectorView = data.selectorView || 'split'
    profile.NpcView = data.npcView || 'list'
    profile.RosterView = data.rosterView || 'list'
    profile.HangarView = data.hangarView || 'cards'
    profile.PilotSheetView = data.pilotSheetView || 'tabbed'
    profile.Theme = data.theme || 'light'
    return profile
  }
}

async function getUser(): Promise<UserProfile> {
  const configFileExists = await exists(CONFIG_FILE_NAME)
  if (!configFileExists) {
    try {
      await writeFile(CONFIG_FILE_NAME, JSON.stringify(new UserProfile(uuid())))
      extlog('Created user profile')
    } catch (err) {
      extlog(
        `Critical Error: COMP/CON unable to create user profile at ${path.join(
          USER_DATA_PATH,
          CONFIG_FILE_NAME
        )}: \n ${err}`
      )
      return
    }
  }

  const data = JSON.parse(await readFile(CONFIG_FILE_NAME)) as IUserProfile
  return UserProfile.Deserialize(data)
}

export { getUser, UserProfile }
