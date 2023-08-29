//  This is the local user profile class. Cloud/cognito user information should be stored in a new class.

import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { UpdateUserData } from '@/cloud/user_sync';

import { UserStore } from '@/stores';
import localForage from 'localforage';
import logger from './logger';

const CONFIG_FILE_NAME = 'cc_user';

interface IUserOptions {
  views: { view: string; setting: string | boolean }[];
  showExotics: boolean;
  quickstart: boolean;
}

interface IUserProfile {
  id: string;
  welcome_hash: string;
  theme: string;
  view_options: string;
  achievements: string[];
}

const defaultOptions = (): IUserOptions => ({
  views: [],
  showExotics: false,
  quickstart: false,
});

class UserProfile {
  public readonly ID: string;
  private _welcome_hash: string;
  private _theme: string;
  private _achievements: string[];
  private _options: IUserOptions;

  public constructor(id: string) {
    this.ID = id || uuid();
    this._theme = 'gms';
    this._welcome_hash = 'none';
    this._options = defaultOptions();
    this._achievements = [];
  }

  private save(): void {
    console.dir(this);
    logger.log('Saving user profile', 'debug', this);
    localForage.setItem(CONFIG_FILE_NAME, JSON.stringify(UserProfile.Serialize(this)));
  }

  public get Achievements(): string[] {
    return this._achievements;
  }

  public set Achievements(data: string[]) {
    this._achievements = data;
    this.save();
  }

  public SetOption(option: string, setting: string | boolean): void {
    if (!Object.keys(defaultOptions()).includes(option))
      throw new Error('Invalid option, did you mean to use SetView?');
    this._options[option] = setting;
    this.save();
  }

  public Option(option: string): string {
    if (this._options[option]) return this._options[option];
    return defaultOptions()[option];
  }

  public SetView(view: string, setting: string | boolean): void {
    this._options.views[view] = setting;
    this.save();
  }

  public View(view: string): string {
    if (this._options.views[view]) return this._options.views[view];
    return '';
  }

  public get Theme(): string {
    return this._theme;
  }

  public set Theme(t: string) {
    this._theme = t;
    this.save();
  }

  public get WelcomeHash(): string {
    return this._welcome_hash || 'none';
  }

  public set WelcomeHash(id: string) {
    this._welcome_hash = id;
    this.save();
  }

  public static Serialize(data: UserProfile): IUserProfile {
    return {
      id: data.ID,
      theme: data.Theme,
      welcome_hash: data.WelcomeHash,
      achievements: data._achievements,
      view_options: JSON.stringify(data._options),
    };
  }

  public static Deserialize(data: IUserProfile): UserProfile {
    const profile = new UserProfile(data.id);
    profile.WelcomeHash = data.welcome_hash || 'none';
    profile.Theme = data.theme || 'gms';
    profile.Achievements = data.achievements || [];
    profile._options = data.view_options ? JSON.parse(data.view_options) : defaultOptions();
    return profile;
  }
}

async function getLocalProfile(): Promise<UserProfile> {
  let config = await localForage.getItem(CONFIG_FILE_NAME);

  if (!config) {
    try {
      localForage.setItem(CONFIG_FILE_NAME, JSON.stringify(new UserProfile(uuid())));
      config = localForage.getItem(CONFIG_FILE_NAME);
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
