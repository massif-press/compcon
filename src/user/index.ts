//  This is the local user profile class. Cloud/cognito user information should be stored in a new class.
import { v4 as uuid } from 'uuid';
import _ from 'lodash';

import logger from './logger';

const CONFIG_FILE_NAME = 'cc_user';

interface IUserOptions {
  views: any;
  showExotics: boolean;
  quickstart: boolean;
}

interface IUserProfile {
  id: string;
  welcome_hash: string;
  theme: string;
  options: IUserOptions;
  achievement_unlocks: { id: string; unlocked: number }[];
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  storage_warning: number;
  storage_max: number;
  auto_delete_days: number;
}

const defaultOptions = (): IUserOptions => ({
  views: {},
  showExotics: false,
  quickstart: false,
});

class UserProfile {
  public readonly ID: string;
  private _welcome_hash: string;
  private _theme: string;
  private _achievement_unlocks: { id: string; unlocked: number }[];
  private _options: IUserOptions;
  private _logLevel: 'debug' | 'info' | 'warn' | 'error' = 'warn';
  private _storageWarning: number = 40;
  private _storageMax: number = 60;
  private _autoDeleteDays: number = 30;

  public constructor(id?: string) {
    this.ID = id || uuid();
    this._theme = 'gms';
    this._welcome_hash = 'none';
    this._options = defaultOptions();
    this._achievement_unlocks = [];
  }

  private save(): void {
    logger.log('Saving user profile', 'debug', this);
    localStorage.setItem(CONFIG_FILE_NAME, JSON.stringify(UserProfile.Serialize(this)));
  }

  private localSave(item: string, value: any): void {
    logger.log(`Saving user ${item}`, 'debug', this);
    localStorage.setItem(`cc_${item}`, JSON.stringify(value));
  }

  public get LogLevel(): 'debug' | 'info' | 'warn' | 'error' {
    return this._logLevel;
  }

  public get LogLevelValue(): number {
    return _.get({ debug: 0, info: 1, warn: 2, error: 3 }, this._logLevel);
  }

  public set LogLevel(level: 'debug' | 'info' | 'warn' | 'error') {
    logger.level = level as any;
    this._logLevel = level;
    this.save();
  }

  public get StorageWarning(): number {
    return this._storageWarning;
  }

  public set StorageWarning(value: number) {
    this._storageWarning = value;
    this.save();
  }

  public get StorageMax(): number {
    return this._storageMax;
  }

  public set StorageMax(value: number) {
    this._storageMax = value;
    this.save();
  }

  public get AutoDeleteDays(): number {
    return this._autoDeleteDays;
  }

  public set AutoDeleteDays(value: number) {
    this._autoDeleteDays = value;
    this.save();
  }

  public get Achievements(): { id: string; unlocked: number }[] {
    return this._achievement_unlocks;
  }

  public AddAchievement(id: string): void {
    // TODO: call global achievement notifier

    // Vue.prototype.$notify({
    //   title: 'Achievement Unlocked!',
    //   text: `Achievement Name and Description Here`,
    //   data: { icon: 'mdi-trophy' },
    // });

    if (!this._achievement_unlocks.find((a) => a.id === id)) {
      this._achievement_unlocks.push({ id, unlocked: Date.now() });
      this.save();
    }
  }

  public set Achievements(data: { id: string; unlocked: number }[]) {
    this._achievement_unlocks = data;
    this.save();
  }

  public SetOption(option: string, setting: string | boolean): void {
    if (!Object.keys(defaultOptions()).includes(option))
      throw new Error(`Invalid option set (${option}, ${setting}), did you mean to use SetView?`);
    this._options[option] = setting;
    this.save();
  }

  public Option(option: string): string {
    if (Object.hasOwn(this._options, option)) return this._options[option];
    return defaultOptions()[option];
  }

  public SetView(view: string, setting: any): void {
    this._options.views[view] = setting;
    this.save();
  }

  public View(view: string, fallback: any): any {
    if (this._options?.views[view]) return this._options.views[view];
    return fallback;
  }

  public get AllViews() {
    return this._options.views;
  }

  public get Theme(): string {
    return this._theme;
  }

  public set Theme(t: string) {
    this._theme = t;
    this.localSave('theme', t);
    this.save();
  }

  public get WelcomeHash(): string {
    return this._welcome_hash || 'none';
  }

  public set WelcomeHash(id: string) {
    this._welcome_hash = id;
    this.save();
  }

  public Reset() {
    this._theme = 'gms';
    this.localSave('theme', this._theme);
    this._welcome_hash = 'none';
    this._options = defaultOptions();
    this._logLevel = 'warn';
    this.save();
  }

  public static Serialize(data: UserProfile): IUserProfile {
    return {
      id: data.ID,
      theme: data.Theme,
      welcome_hash: data.WelcomeHash,
      achievement_unlocks: data._achievement_unlocks,
      options: data._options,
      logLevel: data.LogLevel,
      storage_warning: data.StorageWarning,
      storage_max: data.StorageMax,
      auto_delete_days: data.AutoDeleteDays,
    };
  }

  public static Deserialize(data: IUserProfile): UserProfile {
    const profile = new UserProfile(data.id);
    profile._welcome_hash = data.welcome_hash || 'none';
    profile._theme = data.theme || 'gms';
    profile._achievement_unlocks = data.achievement_unlocks || [];
    profile._options = data.options ? data.options : defaultOptions();
    profile._logLevel = data.logLevel || 'warn';
    logger.level = profile._logLevel as any;
    profile._storageWarning = data.storage_warning || 40;
    profile._storageMax = data.storage_max || 60;
    profile._autoDeleteDays = data.auto_delete_days || 30;
    return profile;
  }
}

async function getLocalProfile(): Promise<UserProfile> {
  let config = localStorage.getItem(CONFIG_FILE_NAME);

  if (!config) {
    try {
      localStorage.setItem(CONFIG_FILE_NAME, JSON.stringify(new UserProfile(uuid())));
      config = localStorage.getItem(CONFIG_FILE_NAME);
      console.info('Created user profile');
    } catch (err) {
      console.error('Critical Error: COMP/CON unable to create user profile', err);
    }
  }

  const data = JSON.parse(config as string) as IUserProfile;
  return UserProfile.Deserialize(data);
}

export { getLocalProfile, UserProfile };
export type { IUserProfile };
