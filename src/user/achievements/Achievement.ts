import { notify } from '@/util/notify';

import { AchievementManager } from './AchievementManager';
import { AchievementEventSystem } from './AchievementEvent';
import logger from '../logger';

enum Rarity {
  Common = 1,
  Epic = 2,
  Legendary = 3,
  Mythic = 4,
}

interface AchievementData {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  labels?: string[];
  secret?: boolean;
  hidden?: boolean;
  goal?: number;
  icon?: string;
  author?: string;
}

interface AchievementSaveData {
  id: string;
  date: number;
  progress: number;
}

class Achievement {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly Hidden: boolean;
  public readonly Secret: boolean;
  public readonly Labels: string[] = [];
  public readonly Goal: number;
  public readonly Rarity: Rarity;
  public readonly Author?: string;
  public Progress: number;
  public Date?: number;

  private _icon?: string;

  public constructor(data: AchievementData, eventType: string, saveData?: AchievementSaveData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Description = data.description;
    this.Rarity = data.rarity;
    this.Hidden = data.hidden || false;
    this.Secret = data.secret || false;
    this.Author = data.author || '';
    this.Labels.push(...(data.labels || []));
    if (data.icon) this._icon = data.icon;
    this.Goal = Number(data.goal) || 1;
    if (saveData?.date) this.Date = new Date(saveData.date).getTime();
    this.Progress = saveData?.progress || 0;

    AchievementEventSystem.subscribe(eventType, this.onEvent.bind(this));
  }

  public get Unlocked(): boolean {
    return !!this.Date && this.Progress >= this.Goal;
  }

  public get Icon(): string {
    if (this._icon) return this._icon;
    else if (this.Secret) return 'mdi-clippy';
    return `cc:achievement_${this.Rarity}`;
  }

  public get SaveData(): AchievementSaveData {
    const data = {
      id: this.ID,
      progress: this.Progress,
    } as AchievementSaveData;
    if (this.Date) data.date = new Date().getTime();
    return data;
  }

  private onEvent(event: any) {
    this.update(event || 1);
  }

  update(amount: number) {
    if (this.Unlocked) return;
    this.Progress += amount;
    if (this.Progress >= this.Goal) {
      this.unlock();
    }
    AchievementManager.Instance.SaveUserAchievement(this.SaveData);
  }

  unlock() {
    if (this.Unlocked) return;
    logger.info(`Achievement Unlocked: ${this.Name}`);
    notify({
      title: 'Achievement Unlocked!',
      text: this.Name,
      color: '#d4af37',
      icon: this.Icon,
      achievement: true,
    });
    this.Date = Date.now();
    AchievementManager.Instance.UpdateUnlockStatus(this);
  }
}

export { Achievement, Rarity };
export type { AchievementData, AchievementSaveData };
