//  This is the local user profile class. Cloud/cognito user information should be stored in a new class.
import { v4 as uuid } from 'uuid'
import _ from 'lodash'

import logger from './logger'
import { CompendiumStore, UserStore } from '@/stores'
import itchMap from '@/assets/itchMap.json'
import { AchievementSaveData } from './achievements/Achievement'

const CONFIG_FILE_NAME = 'cc_user'

type PatreonData = {
  token: {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
    scope: string
    version: string
  }
  profile: {
    full_name: string
    thumb_url: string
    patron_status: string
    currently_entitled_amount_cents: number
    is_follower: boolean
    tierData: {
      amount_cents: number
      title: string
    }
  }
  hasPatreon: boolean
}

interface IUserOptions {
  views: any
  showExotics: boolean
}

interface IUserProfile {
  id: string
  read_messages: string[]
  theme: string
  font: string
  options: IUserOptions
  achievement_unlocks: AchievementSaveData[]
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  storage_warning: number
  storage_max: number
  auto_delete_days: number
  latest_change: number
  lcp_subscriptions: string[]
}

const defaultOptions = (): IUserOptions => ({
  views: {},
  showExotics: false,
})

class UserProfile {
  public readonly ID: string
  public latest_change: number
  public LcpSubscriptions: string[] = []

  private _readMessages: string[]
  private _theme: string
  private _font: string
  private _achievement_unlocks: AchievementSaveData[]
  private _options: IUserOptions
  private _logLevel: 'debug' | 'info' | 'warn' | 'error' = 'warn'
  private _storageWarning: number = 40
  private _storageMax: number = 60
  private _autoDeleteDays: number = 0

  public constructor(id?: string) {
    this.ID = id || uuid()
    this._theme = 'gms_dark'
    this._font = 'inter'
    this._readMessages = []
    this._options = defaultOptions()
    this._achievement_unlocks = []
    this.latest_change = Date.now()
    this.LcpSubscriptions = []
  }

  public save(): void {
    this.latest_change = Date.now()
    localStorage.setItem(CONFIG_FILE_NAME, JSON.stringify(UserProfile.Serialize(this)))
  }

  private localSave(item: string, value: any): void {
    localStorage.setItem(`cc_${item}`, JSON.stringify(value))
  }

  public get LogLevel(): 'debug' | 'info' | 'warn' | 'error' {
    return this._logLevel
  }

  public get LogLevelValue(): number {
    return _.get({ debug: 0, info: 1, warn: 2, error: 3 }, this._logLevel)
  }

  public set LogLevel(level: 'debug' | 'info' | 'warn' | 'error') {
    logger.level = level as any
    this._logLevel = level
    this.save()
  }

  public get ReadMessages(): string[] {
    return this._readMessages
  }

  public set ReadMessages(data: string[]) {
    this._readMessages = data
    this.save()
  }

  public SetMessageRead(id: string): void {
    if (!this._readMessages.includes(id)) {
      this._readMessages.push(id)
      this.save()
    }
  }

  public get StorageWarning(): number {
    return this._storageWarning
  }

  public set StorageWarning(value: number) {
    this._storageWarning = value
    this.save()
  }

  public get StorageMax(): number {
    return this._storageMax
  }

  public set StorageMax(value: number) {
    this._storageMax = value
    this.save()
  }

  public get AutoDeleteDays(): number {
    return this._autoDeleteDays
  }

  public set AutoDeleteDays(value: number) {
    this._autoDeleteDays = value
    this.save()
  }

  public get AchievementUnlocks(): AchievementSaveData[] {
    return this._achievement_unlocks
  }

  public set AchievementUnlocks(data: AchievementSaveData[]) {
    this._achievement_unlocks = data
    this.save()
  }

  public SaveAchievementUnlock(item: AchievementSaveData): void {
    const index = this._achievement_unlocks.findIndex(a => a.id === item.id)
    if (index !== -1) {
      this._achievement_unlocks[index] = item
    } else {
      this._achievement_unlocks.push(item)
    }
    this.save()
  }

  public SetOption(option: string, setting: string | boolean): void {
    if (!Object.keys(defaultOptions()).includes(option))
      throw new Error(`Invalid option set (${option}, ${setting}), did you mean to use SetView?`)
    this._options[option] = setting
    this.save()
  }

  public Option(option: string): string {
    if (Object.hasOwn(this._options, option)) return this._options[option]
    return defaultOptions()[option]
  }

  public SetView(view: string, setting: any): void {
    this._options.views[view] = setting
    this.save()
  }

  public View(view: string, fallback: any): any {
    if (this._options?.views[view] !== undefined) return this._options.views[view]
    return fallback
  }

  public get Patreon(): PatreonData {
    return UserStore().UserMetadata.PatreonData
  }

  public get PatreonTier(): string {
    return this.Patreon.profile?.tierData.title || ''
  }

  public get PatreonTierValue(): number {
    switch (this.PatreonTier.toLocaleLowerCase()) {
      case 'diasporan':
        return 1
      case 'cosmopolitan':
        return 2
      case 'lancer':
        return 3
      case 'nhp':
        return 4
      case 'monist':
        return 5
      default:
        return 0
    }
  }

  public get Itch(): any {
    return UserStore().UserMetadata.ItchData
  }

  public get ItchMap(): any {
    const map = [...itchMap]
    map.forEach((item: any) => {
      if (!item.paid) item.enabled = true
      else if (this.Itch.gamedata.some((g: any) => g.game_id === item.game_id)) item.enabled = true
      else item.enabled = false
    })
    return map
  }

  public get AllViews() {
    return this._options.views
  }

  public get Theme(): string {
    return this._theme
  }

  public set Theme(t: string) {
    this._theme = t
    this.localSave('theme', t)
    this.save()
  }

  public SwitchTheme(): void {
    this._theme = 'gms_dark'
    this.localSave('theme', this._theme)
    this.save()
  }

  public get Font(): string {
    return this._font
  }

  public set Font(t: string) {
    this._font = t
    this.localSave('font', t)
    this.save()
  }

  public SwitchFont(): void {
    this._font = 'gms_dark'
    this.localSave('font', this._font)
    this.save()
  }

  public Reset() {
    this._theme = 'gms_dark'
    this.localSave('theme', this._theme)
    this._font = 'inter'
    this.localSave('font', this._font)
    this._readMessages = []
    this._options = defaultOptions()
    this._logLevel = 'warn'
    this.save()
  }

  public static Serialize(data: UserProfile): IUserProfile {
    return {
      id: data.ID,
      theme: data.Theme,
      font: data.Font,
      read_messages: data._readMessages,
      achievement_unlocks: data._achievement_unlocks,
      options: data._options,
      logLevel: data.LogLevel,
      storage_warning: data.StorageWarning,
      storage_max: data.StorageMax,
      auto_delete_days: data.AutoDeleteDays,
      latest_change: data.latest_change,
      lcp_subscriptions: data.LcpSubscriptions,
    }
  }

  public static Deserialize(data: IUserProfile): UserProfile {
    const profile = new UserProfile(data.id)
    profile._readMessages = data.read_messages || []
    profile._theme = data.theme || 'gms_dark'
    profile._font = data.font || 'inter'
    profile._achievement_unlocks = data.achievement_unlocks || []
    profile._options = data.options ? data.options : defaultOptions()
    profile._logLevel = data.logLevel || 'warn'
    logger.level = profile._logLevel as any
    profile._storageWarning = data.storage_warning || 40
    profile._storageMax = data.storage_max || 60
    profile._autoDeleteDays = data.auto_delete_days || 30
    profile.latest_change = data.latest_change || Date.now()
    profile.LcpSubscriptions = data.lcp_subscriptions || []
    return profile
  }
}

async function getLocalProfile(): Promise<UserProfile> {
  let config = localStorage.getItem(CONFIG_FILE_NAME)

  if (!config) {
    try {
      localStorage.setItem(CONFIG_FILE_NAME, JSON.stringify(new UserProfile(uuid())))
      config = localStorage.getItem(CONFIG_FILE_NAME)
      logger.info('Created user profile')
    } catch (err) {
      logger.error('Critical Error: COMP/CON unable to create user profile', {}, err)
    }
  }

  const data = JSON.parse(config as string) as IUserProfile
  return UserProfile.Deserialize(data)
}

export { getLocalProfile, UserProfile }
export type { IUserProfile }
