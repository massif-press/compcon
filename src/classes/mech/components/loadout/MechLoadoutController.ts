import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { Mech } from '../../Mech';
import { MechLoadout } from './MechLoadout';
import { IMechLoadoutData } from './MechLoadout';

interface IMechLoadoutSaveData {
  loadouts: IMechLoadoutData[];
  active_loadout_index: number;
}

class MechLoadoutController implements IFeatureContainer {
  public readonly Parent: Mech;
  private _loadouts!: MechLoadout[];
  private _active_loadout!: MechLoadout;

  constructor(parent: Mech) {
    this.Parent = parent;
    this._init();
  }

  private _init() {
    this._loadouts = [new MechLoadout(this.Parent)];
    this._active_loadout = this._loadouts[0];
  }

  public get FeatureSource(): any[] {
    return this.ActiveLoadout.Equipment.filter((i) => !!i);
  }

  public get Loadouts(): MechLoadout[] {
    return this._loadouts;
  }

  public set Loadouts(loadouts: MechLoadout[]) {
    this._loadouts = loadouts;
    this.Parent.SaveController.save();
  }

  public get ActiveLoadout(): MechLoadout {
    if (!this._active_loadout) this._init();
    return this._active_loadout;
  }

  public set ActiveLoadout(loadout: MechLoadout) {
    this._active_loadout = loadout;
    this.Parent.SaveController.save();
  }

  public AddLoadout(): void {
    this._loadouts.push(new MechLoadout(this.Parent));
    this.ActiveLoadout = this._loadouts[this._loadouts.length - 1];
    this.Parent.SaveController.save();
  }

  public RemoveLoadout(): void {
    if (this._loadouts.length === 1) {
      console.error(`Cannot remove last Mech Loadout`);
    } else {
      const index = this._loadouts.findIndex((x) => x.ID === this.ActiveLoadout.ID);
      this._active_loadout = this._loadouts[index + (index === 0 ? 1 : -1)];
      this._loadouts.splice(index, 1);
      this.Parent.SaveController.save();
    }
  }

  public CloneLoadout(): void {
    const index = this._loadouts.findIndex((x) => x.ID === this.ActiveLoadout.ID);
    const newLoadout = MechLoadout.Deserialize(
      MechLoadout.Serialize(this.ActiveLoadout),
      this.Parent
    );
    newLoadout.RenewID();
    newLoadout.Name += ' (Copy)';
    this._loadouts.splice(index + 1, 0, newLoadout);
    this._active_loadout = this._loadouts[index + 1];
    this.Parent.SaveController.save();
  }

  public UpdateLoadouts(): void {
    this._loadouts.forEach((x) => {
      x.SetAllIntegrated();
    });
  }

  public static Serialize(parent: Mech, target: any) {
    target.loadouts = parent.MechLoadoutController.Loadouts.map((x) => MechLoadout.Serialize(x));
    target.active_loadout_index = parent.MechLoadoutController.Loadouts.findIndex(
      (x) => x.ID === parent.MechLoadoutController.ActiveLoadout.ID
    );
  }

  public static Deserialize(parent: Mech, data: IMechLoadoutSaveData) {
    if (!parent.MechLoadoutController)
      throw new Error(
        `MechLoadoutController not found on parent (${typeof parent}). New MechLoadoutControllers must be instantiated in the parent's constructor method.`
      );
    if (
      data.active_loadout_index === null ||
      data.active_loadout_index === undefined ||
      !data.loadouts.length
    ) {
      parent.MechLoadoutController._loadouts = [new MechLoadout(parent)];
      parent.MechLoadoutController._active_loadout = parent.MechLoadoutController._loadouts[0];
    } else {
      parent.MechLoadoutController._loadouts = data.loadouts.map((x: IMechLoadoutData) =>
        MechLoadout.Deserialize(x, parent)
      );
      parent.MechLoadoutController._active_loadout = data.active_loadout_index
        ? parent.MechLoadoutController._loadouts[data.active_loadout_index]
        : parent.MechLoadoutController._loadouts[0];
    }
  }
}

export { MechLoadoutController };
export type { IMechLoadoutSaveData };
