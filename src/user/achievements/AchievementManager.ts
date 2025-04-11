import * as dict from './achievementsDict.json';
import * as eventMap from './eventParameterMap.json';
import { decrypt } from '@/util/Decode';
import { Achievement, AchievementData, AchievementSaveData } from './Achievement';
import { UserStore } from '../store';

class AchievementManager {
  public static Instance: AchievementManager;
  private _achievements: Achievement[];
  private _eventMap: any[] = (eventMap as any).default;

  public constructor() {
    this._achievements = (dict as any).default.map((x) => {
      x.id = decrypt(x.id);
      x.name = decrypt(x.name);
      x.description = decrypt(x.description);
      const userAch = UserStore().User.AchievementUnlocks.find((y) => y.id === x.id);
      return new Achievement(
        x as AchievementData,
        this.getEventType(x.id),
        userAch as AchievementSaveData
      );
    });

    console.log(`Achievements Loaded: ${this._achievements.length}`);
  }

  private getEventType(id): string {
    const event = this._eventMap.find((x) => x.achievement_ids.includes(id));
    return event?.event || '';
  }

  public static Instantiate(): void {
    AchievementManager.Instance = new AchievementManager();
  }

  public get Achievements(): Achievement[] {
    return this._achievements;
  }

  public get UserUnlockedAchievements(): Achievement[] {
    return this._achievements.filter((x) => x.Unlocked);
  }

  public UpdateUnlockStatus(ach: Achievement) {
    const idx = this._achievements.findIndex((x) => x.ID === ach.ID);
    if (idx > -1) {
      this._achievements[idx] = ach;
    }
  }

  public SaveUserAchievement(ach: AchievementSaveData) {
    UserStore().User.SaveAchievementUnlock(ach);
  }

  public Unlock(id: string) {
    const ach = this._achievements.find((x) => x.ID === id);
    if (ach) {
      if (ach.Unlocked) return true;
      else ach.update(1);
    }
  }
}

export { AchievementManager };
