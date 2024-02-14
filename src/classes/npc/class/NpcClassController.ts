import { NpcClass } from './NpcClass';
import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { Stats } from '@/classes/components/combat/stats/Stats';

interface INpcClassSaveData {
  class: string;
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
    return !!this.Class?.ID;
  }

  public get Class(): NpcClass | null {
    return this._class;
  }

  public get Tier(): number {
    return this._tier;
  }

  private _setClassStats(tier: number): any {
    this.Parent.MandatoryStats.forEach((key) => {
      let statVal = this.Class?.Stats.Stat(key, tier);
      if (!statVal) statVal = Stats.DefaultStats[key];

      this.Parent.StatController.setMax(key, statVal);
    });
  }

  public get ChangedStats(): any {
    const changedStats = {};
    this.Parent.MandatoryStats.forEach((key) => {
      if (this.Parent.StatController.getMax(key) !== this.Class?.Stats.Stat(key, this.Tier)) {
        changedStats[key] = this.Class?.Stats.Stat(key, this.Tier);
      }
    });
    return changedStats;
  }

  public set Tier(newTier: number) {
    if (!this.HasClass) return;
    this._tier = newTier;

    this._setClassStats(newTier);

    // this.Parent.Items.forEach((i) => {
    //   i.Tier = newTier;
    // });
    // this.Parent.RecalcBonuses();
    this.Parent.SaveController.save();
  }

  public ResetStats(tier: number) {
    if (!this.HasClass) return;
    this._setClassStats(tier);
  }

  public SetClass(npcClass: NpcClass, tier: number) {
    if (!this.HasClass) this.Parent.Tag = 'Mech';
    if (npcClass.Role.toLowerCase() === 'biological') this.Parent.Tag = 'Biological';
    this._class = npcClass;
    this.ResetStats(tier);
    this.Parent.NpcFeatureController.ResetFeatures();
  }

  public static Serialize(parent: Unit, target: any) {
    target.class = parent.NpcClassController.Class?.ID || '';
    target.tier = parent.NpcClassController.Tier;
  }

  public static Deserialize(parent: Unit, data: INpcClassSaveData) {
    if (!parent.NpcClassController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcClassControllers must be instantiated in the parent's constructor method.`
      );

    parent.NpcClassController._class = CompendiumStore().referenceByID('NpcClasses', data.class);
    parent.NpcClassController._tier = data.tier;
  }
}

export { NpcClassController };
export type { INpcClassSaveData };
