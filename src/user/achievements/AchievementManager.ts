import * as dict from '@/assets/achievementsDict.json';
import { decrypt } from '@/util/Decode';

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
  type: string;
  secret: boolean;
  hidden: boolean;
}

class Achievement {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Description: string;
  public readonly Type: string;
  public readonly Hidden: boolean;
  public readonly Secret: boolean;
  public readonly Date: string;

  public constructor(data: AchievementData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Description = data.description;
    this.Type = data.type;
    this.Hidden = data.hidden;
    this.Secret = data.secret;
    this.Date = '';
  }
}

class AchievementManager {
  private _achievements: Achievement[];

  public constructor() {
    this._achievements = [];
  }

  public static AllAchievements(): Achievement[] {
    return [];
  }

  public get Achievements(): Achievement[] {
    return this._achievements;
  }

  public set Achievements(data: Achievement[]) {
    this._achievements = data;
  }
}

export { Achievement, AchievementManager };
