import fs from 'fs'
import path from 'path'
import extlog from './ExtLog'
import uuid from 'uuid/v1'
import { CompendiumStore } from '@/store'
import { getModule } from 'vuex-module-decorators'

interface IUserProfile {
  id: string
  rosterView: string
  hangarView: string
  pilotSheetView: string
}

class UserProfile {
  private _id: string
  private _rosterView: string
  private _hangarView: string
  private _pilotSheetView: string

  public constructor(id: string) {
    this._id = id
    this._rosterView = 'list'
    this._hangarView = 'cards'
    this._pilotSheetView = 'tabbed'
  }

  private save(): void {
    const store = getModule(CompendiumStore)
    const configfile = path.join(store.UserDataPath, 'user.config')
    const data: IUserProfile = {
      id: this.ID,
      rosterView: this.RosterView,
      hangarView: this.HangarView,
      pilotSheetView: this.PilotSheetView,
    }

    fs.writeFileSync(configfile, JSON.stringify(data, null, 2), 'utf8')
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

  public static Deserialize(data: IUserProfile): UserProfile {
    let profile = new UserProfile(data.id)
    profile.RosterView = data.rosterView || 'list'
    profile.HangarView = data.hangarView || 'cards'
    profile.PilotSheetView = data.pilotSheetView || 'tabbed'
    return profile
  }
}

function getUser(): UserProfile {
  const store = getModule(CompendiumStore)
  const configfile = path.join(store.UserDataPath, 'user.config')

  if (!fs.existsSync(configfile)) {
    try {
      fs.writeFileSync(configfile, JSON.stringify(new UserProfile(uuid())))
      extlog('Created user profile')
    } catch (err) {
      extlog(`Critical Error: COMP/CON unable to create user profile at ${configfile}: \n ${err}`)
      return
    }
  }

  const data = JSON.parse(fs.readFileSync(configfile, 'utf-8')) as IUserProfile
  return UserProfile.Deserialize(data)
}

export { getUser, UserProfile }
