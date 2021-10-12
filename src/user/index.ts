import path from 'path'
import uuid from 'uuid/v4'
import { writeFile, readFile, exists, USER_DATA_PATH } from '../io/Data'

const CONFIG_FILE_NAME = 'user.config'

interface IViewOptions {
  selector: string
  npc: string
  roster: string
  hangar: string
  pilotSheet: string
  showExotics: boolean
  quickstart: boolean
}

interface ISyncFrequency {
  onAppLoad: boolean
  onLogIn: boolean
  onBulkDelete: boolean
  onAppExit: boolean
  onThemeChange: boolean
  onPilotLevel: boolean
  onPilotCreate: boolean
  onPilotDelete: boolean
  onMechCreate: boolean
  onMechDelete: boolean
  onNpcCreate: boolean
  onNpcDelete: boolean
  onEncounterCreate: boolean
  onEncounterDelete: boolean
  onMissionCreate: boolean
  onMissionDelete: boolean
  onMissionStart: boolean
  onTurnEnd: boolean
}

interface ISyncOptions {
  promptLocal: boolean
  promptCloud: boolean
}

interface IUserProfile {
  id: string
  user_id: string
  welcome_hash: string
  theme: string
  view_options: string
  sync_frequency: string
  sync_options: string
  achievements: string[]
  pilots: string[]
  lcp_data: string
  npcs: string[]
  encounters: string[]
  missions: string[]
  active_missions: string[]
  _version: number
  last_sync: string
  username: string
}

const defaultViewOptions = (): IViewOptions => ({
  selector: 'split',
  npc: 'list',
  roster: 'list',
  hangar: 'cards',
  pilotSheet: 'tabbed',
  showExotics: false,
  quickstart: false,
})

const defaultSyncFrequency = (): ISyncFrequency => ({
  onAppLoad: true,
  onLogIn: true,
  onBulkDelete: true,
  onAppExit: true,
  onThemeChange: true,
  onPilotLevel: true,
  onPilotCreate: true,
  onPilotDelete: true,
  onMechCreate: true,
  onMechDelete: true,
  onNpcCreate: true,
  onNpcDelete: true,
  onEncounterCreate: true,
  onEncounterDelete: true,
  onMissionCreate: true,
  onMissionDelete: true,
  onMissionStart: true,
  onTurnEnd: false,
})

const defaultSyncOptions = (): ISyncOptions => ({
  promptLocal: true,
  promptCloud: false,
})

class UserProfile {
  private _user_id: string
  private _username: string
  private _welcome_hash: string
  private _theme: string
  private _viewOptions: IViewOptions
  private _syncFrequency: ISyncFrequency
  private _syncOptions: ISyncOptions
  private _achievements: string[]
  private _pilots: string[]
  private _lcp_data: string
  private _npcs: string[]
  private _encounters: string[]
  private _missions: string[]
  private _active_missions: string[]
  public id: string
  public _version: number
  public LastSync: string
  public Username: string

  public constructor(id: string) {
    this._user_id = id
    this._username = 'No Cloud Account'
    this._theme = 'gms'
    this._welcome_hash = 'none'
    this._viewOptions = defaultViewOptions()
    this._syncFrequency = defaultSyncFrequency()
    this._syncOptions = defaultSyncOptions()
    this._achievements = []
    this._pilots = []
    this._lcp_data = ''
    this._npcs = []
    this._encounters = []
    this._missions = []
    this._active_missions = []
    this.LastSync = 'Never'
  }

  private save(): void {
    const data: IUserProfile = {
      id: this.id,
      user_id: this.UserID,
      username: this.Username,
      theme: this.Theme,
      welcome_hash: this.WelcomeHash,
      achievements: this._achievements,
      view_options: JSON.stringify(this._viewOptions),
      sync_frequency: JSON.stringify(this._syncFrequency),
      sync_options: JSON.stringify(this._syncOptions),
      pilots: this._pilots,
      lcp_data: this._lcp_data,
      npcs: this._npcs,
      encounters: this._encounters,
      missions: this._missions,
      active_missions: this._active_missions,
      _version: this._version,
      last_sync: this.LastSync,
    }

    writeFile(CONFIG_FILE_NAME, JSON.stringify(data, null, 2))
  }

  public get UserID(): string {
    return this._user_id
  }

  public set UserID(id: string) {
    this._user_id = id
    this.save()
  }

  public get SyncFrequency(): ISyncFrequency {
    return this._syncFrequency
  }

  public set SyncFrequency(data: ISyncFrequency) {
    this._syncFrequency = data
    this.save()
  }

  public get Achievements(): string[] {
    return this._achievements
  }

  public set Achievements(data: string[]) {
    this._achievements = data
    this.save()
  }

  public get Pilots(): string[] {
    return this._pilots
  }

  public set Pilots(data: string[]) {
    this._pilots = data
    this.save()
  }

  public get Npcs(): string[] {
    return this._npcs
  }

  public set Npcs(data: string[]) {
    this._npcs = data
    this.save()
  }

  public get Encounters(): string[] {
    return this._encounters
  }

  public set Encounters(data: string[]) {
    this._encounters = data
    this.save()
  }

  public get Missions(): string[] {
    return this._missions
  }

  public set Missions(data: string[]) {
    this._missions = data
    this.save()
  }

  public get ActiveMissions(): string[] {
    return this._active_missions
  }

  public set ActiveMissions(data: string[]) {
    this._active_missions = data
    this.save()
  }

  public SetView(view: string, setting: string | boolean): void {
    this._viewOptions[view] = setting
    this.save()
  }

  public GetView(view: string): string | boolean {
    if (this._viewOptions[view]) return this._viewOptions[view]
    return ''
  }

  public get Theme(): string {
    return this._theme
  }

  public set Theme(t: string) {
    this._theme = t
    this.save()
  }

  public get WelcomeHash(): string {
    return this._welcome_hash || 'none'
  }

  public set WelcomeHash(id: string) {
    this._welcome_hash = id
    this.save()
  }

  public async MarkSync(): Promise<void> {
    const now = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

    this.LastSync = `${now.toLocaleTimeString()}, ${now.toLocaleDateString(undefined, options)}`
  }

  public static Serialize(data: UserProfile): IUserProfile {
    return {
      id: data.id || '',
      user_id: data.UserID,
      theme: data.Theme,
      welcome_hash: data.WelcomeHash,
      achievements: data._achievements,
      view_options: JSON.stringify(data._viewOptions),
      sync_frequency: JSON.stringify(data._syncFrequency),
      sync_options: JSON.stringify(data._syncOptions),
      pilots: data._pilots,
      lcp_data: data._lcp_data,
      npcs: data._npcs,
      encounters: data._encounters,
      missions: data._missions,
      active_missions: data._active_missions,
      _version: data._version,
      last_sync: data.LastSync,
      username: data.Username,
    }
  }

  public static Deserialize(data: IUserProfile): UserProfile {
    const profile = new UserProfile(data.user_id)
    profile.id = data.id || ''
    profile._user_id = data.user_id || uuid()
    profile.WelcomeHash = data.welcome_hash || 'none'
    profile.Theme = data.theme || 'gms'
    profile.Achievements = data.achievements || []
    profile._viewOptions = data.view_options ? JSON.parse(data.view_options) : defaultViewOptions()
    profile._syncFrequency = data.sync_frequency
      ? JSON.parse(data.sync_frequency)
      : defaultSyncFrequency()
    profile._syncOptions = data.sync_options ? JSON.parse(data.sync_options) : defaultSyncOptions()
    profile._pilots = data.pilots || []
    profile._lcp_data = data.lcp_data || ''
    profile._npcs = data.npcs || []
    profile._encounters = data.encounters || []
    profile._missions = data.missions || []
    profile._active_missions = data.active_missions || []
    profile._version = data._version || 0
    profile.LastSync = data.last_sync
    return profile
  }
}

async function getUser(): Promise<UserProfile> {
  const configFileExists = await exists(CONFIG_FILE_NAME)
  if (!configFileExists) {
    try {
      await writeFile(CONFIG_FILE_NAME, JSON.stringify(new UserProfile(uuid())))
      console.info('Created user profile')
    } catch (err) {
      console.error(
        `Critical Error: COMP/CON unable to create user profile at ${path.join(
          USER_DATA_PATH,
          CONFIG_FILE_NAME
        )}: \n ${err}`
      )
    }
  }

  const data = JSON.parse(await readFile(CONFIG_FILE_NAME)) as IUserProfile
  return UserProfile.Deserialize(data)
}

export { getUser, UserProfile, IUserProfile }
