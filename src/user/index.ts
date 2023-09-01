//  This is the local user profile class. Cloud/cognito user information should be stored in a new class.

import Vue from 'vue';

import { v4 as uuid } from 'uuid';
import _ from 'lodash';

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
  achievement_unlocks: { id: string; unlocked: number }[];
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
  private _achievement_unlocks: { id: string; unlocked: number }[];
  private _options: IUserOptions;

  public constructor(id?: string) {
    this.ID = id || uuid();
    this._theme = 'gms';
    this._welcome_hash = 'none';
    this._options = defaultOptions();
    this._achievement_unlocks = [];
  }

  private save(): void {
    logger.log('Saving user profile', 'debug', this);
    localForage.setItem(CONFIG_FILE_NAME, JSON.stringify(UserProfile.Serialize(this)));
  }

  private localSave(item: string, value: any): void {
    logger.log(`Saving user ${item}`, 'debug', this);
    localStorage.setItem(`cc_${item}`, JSON.stringify(value));
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
    this.save();
  }

  public static Serialize(data: UserProfile): IUserProfile {
    return {
      id: data.ID,
      theme: data.Theme,
      welcome_hash: data.WelcomeHash,
      achievement_unlocks: data._achievement_unlocks,
      view_options: JSON.stringify(data._options),
    };
  }

  public static Deserialize(data: IUserProfile): UserProfile {
    const profile = new UserProfile(data.id);
    profile._welcome_hash = data.welcome_hash || 'none';
    profile._theme = data.theme || 'gms';
    profile._achievement_unlocks = data.achievement_unlocks || [];
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
