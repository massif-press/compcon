import { INpcClassData, NpcClass } from './NpcClass';
import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { Stats } from '@/classes/components/combat/stats/Stats';

interface INpcClassSaveData {
  class: { id: string; data: INpcClassData };
  tier: number;
}

class NpcClassController {
  public readonly Parent: Unit;
  private _class: NpcClass | null;
  private _tier: number;

  public constructor(parent: Unit) {
    this.Parent = parent;

    this._class = null;
    this._tier = 1;
  }

  public get HasClass(): boolean {
    return !!this._class?.ID;
  }

  public get Class(): NpcClass | null {
    return this._class;
  }

  public get Tier(): number {
    return this._tier;
  }

  private _setClassStats(tier: number): any {
    if (!this.HasClass) return;

    const c = this.Class as NpcClass;

    this.Parent.MandatoryStats.forEach((key) => {
      let statVal = c.Stats.Stat(key, tier);
      if (!statVal) statVal = Stats.DefaultStats[key];

      this.Parent.StatController.setMax(key, statVal);
    });
    let sizes = c?.Stats.Stat('sizes', tier) || 1;
    if (!Array.isArray(sizes)) sizes = [sizes];
    this.Parent.StatController.setMax('size', sizes[0]);
  }

  public get ChangedStats(): any {
    if (!this.HasClass) return;

    const c = this.Class as NpcClass;

    const changedStats = {};
    this.Parent.MandatoryStats.forEach((key) => {
      if (key === 'size' || key === 'sizes') return;
      if (this.Parent.StatController.getStat(key) !== c.Stats.Stat(key, this.Tier)) {
        changedStats[key] = c.Stats.Stat(key, this.Tier);
      }
    });
    return changedStats;
  }

  public ResetStats(tier?: number) {
    if (!tier) tier = this.Tier;
    if (!this.HasClass) return;
    this._setClassStats(tier);
  }

  public set Tier(newTier: number) {
    if (!this.HasClass) return;
    this._tier = newTier;

    this._setClassStats(newTier);
    this.Parent.save();
  }

  public SetClass(npcClass: NpcClass | null, tier: number) {
    if (!npcClass) {
      this._class = null;
      this.Parent.NpcFeatureController.ResetFeatures();
      return;
    }
    if (!this.HasClass) this.Parent.Tag = 'Mech';
    if (npcClass.Role.toLowerCase() === 'biological') this.Parent.Tag = 'Biological';
    if (npcClass.ForceTag) this.Parent.Tag = npcClass.ForceTag;
    this._class = npcClass;
    this.ResetStats(tier);
    this.Parent.NpcFeatureController.ResetFeatures();
    this.Parent.save();
  }

  public static Serialize(parent: Unit, target: any) {
    target.class = {
      id: parent.NpcClassController.Class?.ID || '',
      data: parent.NpcClassController.Class?.Data || {},
    };
    target.tier = parent.NpcClassController.Tier;
  }

  public static Deserialize(parent: Unit, data: INpcClassSaveData) {
    if (!parent.NpcClassController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcClassControllers must be instantiated in the parent's constructor method.`
      );

    parent.NpcClassController._class = CompendiumStore().has('NpcClasses', data.class.id)
      ? CompendiumStore().referenceByID('NpcClasses', data.class.id)
      : new NpcClass(data.class.data);

    parent.NpcClassController._tier = data.tier;
  }
}

export { NpcClassController };
export type { INpcClassSaveData };
