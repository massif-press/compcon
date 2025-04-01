import { NpcClass } from './NpcClass';
import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { Stats } from '@/classes/components/combat/stats/Stats';

interface INpcClassSaveData {
  instance: boolean;
  class: string | { Name: string; ID: string; Role: string };
  tier: number;
}

class NpcClassProxy {
  public readonly ID: string;
  public readonly Name: string;
  public readonly Role: string;

  constructor(id: string, name: string, role: string) {
    this.ID = id;
    this.Name = name;
    this.Role = role;
  }

  public get Icon(): string {
    if (this.Role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
    return `cc:role_${this.Role.toLowerCase()}`;
  }

  public get Color(): string {
    return `role--${this.Role.toLowerCase()}`;
  }
}

class NpcClassController {
  public readonly Parent: Unit;
  private _class: NpcClass | NpcClassProxy | null;
  private _tier: number;

  public constructor(parent: Unit) {
    this.Parent = parent;
    this._class = null;
    this._tier = 1;
  }

  private get isInstance(): boolean {
    return this.Parent.IsInstance;
  }

  private get isLinked(): boolean {
    return (
      this.isInstance &&
      this.Parent.IsLinked &&
      CompendiumStore().NpcClasses.some((x) => x.ID === this._class?.ID)
    );
  }

  public get HasClass(): boolean {
    return !!this._class?.ID;
  }

  public get Class(): NpcClass | NpcClassProxy | null {
    if (this.isLinked) {
      const c = CompendiumStore().NpcClasses.find((x) => x.ID === this._class?.ID);
      if (c) return c;
    }
    return this._class;
  }

  public get Tier(): number {
    return this._tier;
  }

  private _setClassStats(tier: number): any {
    if (!this.HasClass || (this.isInstance && !this.isLinked)) return;

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
    if (!this.HasClass || (this.isInstance && !this.isLinked)) return;

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
    if (!this.HasClass || (this.isInstance && !this.isLinked)) return;
    this._setClassStats(tier);
  }

  public set Tier(newTier: number) {
    if (!this.HasClass || (this.isInstance && !this.isLinked)) return;
    this._tier = newTier;

    this._setClassStats(newTier);
    this.Parent.save();
  }

  public SetClass(npcClass: NpcClass | NpcClassProxy | null, tier: number) {
    if (this.isInstance && !this.isLinked) return;
    if (npcClass instanceof NpcClassProxy) return;
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
    if (target.instance) {
      target.class = {
        Name: parent.NpcClassController.Class?.Name || '',
        ID: (parent.NpcClassController.Class as NpcClass)?.ID || '',
        Role: (parent.NpcClassController.Class as NpcClass)?.Role || '',
      };
    } else {
      target.class = (parent.NpcClassController.Class as NpcClass)?.ID || '';
    }
    target.tier = parent.NpcClassController.Tier;
  }

  public static Deserialize(parent: Unit, data: INpcClassSaveData) {
    if (!parent.NpcClassController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcClassControllers must be instantiated in the parent's constructor method.`
      );

    if (data.instance) {
      parent.NpcClassController._class = new NpcClassProxy(
        (data.class as any).ID,
        (data.class as any).Name,
        (data.class as any).Role
      );
    } else if (!!data.class) {
      parent.NpcClassController._class = CompendiumStore().referenceByID('NpcClasses', data.class);
    }
    parent.NpcClassController._tier = data.tier;
  }
}

export { NpcClassController };
export type { INpcClassSaveData };
