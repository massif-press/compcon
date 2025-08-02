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

  public getClassStats(): any {
    const c = this.Class as NpcClass;
    const kvps = [] as { key: string; val: number }[];

    const allStats = Object.keys({
      ...this.Parent.StatController.MaxStats,
      ...Stats.DefaultStats,
    });

    allStats.forEach((key) => {
      let statVal = c?.Stats.Stat(key, this.Tier) || Stats.DefaultStats[key];
      if (key === 'sizes') {
        statVal = c?.Stats.Stat('size', this.Tier) || 1;
      }
      kvps.push({ key, val: statVal });

      // this.Parent.StatController.setMax(key, statVal);
    });
    kvps.push({ key: 'burn', val: 0 });
    // let sizes = c?.Stats.Stat('sizes', this.Tier) || 1;
    // if (!Array.isArray(sizes)) sizes = [sizes];
    // this.Parent.StatController.setMax('size', sizes[0]);
    return kvps;
  }

  public get ChangedStats(): any {
    if (!this.HasClass) return;

    const c = this.Class as NpcClass;

    const changedStats = {};
    this.Parent.CombatController.StatController.MaxStats.forEach((key) => {
      if (key === 'size' || key === 'sizes') return;
      if (
        this.Parent.CombatController.StatController.getStat(key) !== c.Stats.Stat(key, this.Tier)
      ) {
        changedStats[key] = c.Stats.Stat(key, this.Tier);
      }
    });
    return changedStats;
  }

  public ResetStats() {
    this.Parent.SetStats();
  }

  public set Tier(newTier: number) {
    this._tier = newTier;

    this.ResetStats();
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
    this.Tier = tier;
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

    let id;
    try {
      id = typeof data.class === 'string' ? data.class : data.class.id;
    } catch (e) {
      console.error(e);
    }

    parent.NpcClassController._class = CompendiumStore().has('NpcClasses', id)
      ? CompendiumStore().referenceByID('NpcClasses', id)
      : data?.class?.data && Object.keys(data.class.data).length
        ? new NpcClass(data.class.data)
        : null;

    parent.NpcClassController._tier = data.tier;
  }
}

export { NpcClassController };
export type { INpcClassSaveData };
