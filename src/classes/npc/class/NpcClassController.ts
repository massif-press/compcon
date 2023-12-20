import { NpcClass } from './NpcClass';
import { CompendiumStore } from '@/stores';
import { StatController } from '@/classes/components/combat/stats/StatController';
import { Unit } from '../unit/Unit';

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

  public ClassStats(tier: number): object {
    if (!this.Class) return {};
    return {
      Activations: this.Class.Stats.Activations(tier),
      Structure: this.Class.Stats.Structure(tier),
      Stress: this.Class.Stats.Stress(tier),
      Armor: this.Class.Stats.Armor(tier),
      MaxHP: this.Class.Stats.HP(tier),
      Evasion: this.Class.Stats.Evade(tier),
      EDefense: this.Class.Stats.EDefense(tier),
      HeatCapacity: this.Class.Stats.HeatCapacity(tier),
      Speed: this.Class.Stats.Speed(tier),
      Sensor: this.Class.Stats.Sensor(tier),
      SaveTarget: this.Class.Stats.Save(tier),
      Hull: this.Class.Stats.Hull(tier),
      Agi: this.Class.Stats.Agility(tier),
      Sys: this.Class.Stats.Systems(tier),
      Eng: this.Class.Stats.Engineering(tier),
      Sizes: this.Class.Stats.Sizes(tier),
      Size: this.Class.Stats.Sizes(tier)[0],
    };
  }

  public set Tier(newTier: number) {
    this._tier = newTier;
    this.Parent.StatController = new StatController(this.Parent, this.ClassStats(newTier));
    // this.Parent.Items.forEach((i) => {
    //   i.Tier = newTier;
    // });
    // this.Parent.RecalcBonuses();
    this.Parent.SaveController.save();
  }

  public ResetStats(tier: number) {
    if (!this.HasClass) return;
    this.Parent.StatController = new StatController(this.Parent, this.ClassStats(tier));
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
