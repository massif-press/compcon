import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { Rules, Pilot, PilotLoadout, CompendiumItem, PilotEquipment } from '@/class';

import { IPilotLoadoutData } from './PilotLoadout';
import { Bonus } from '@/classes/components';
import logger from '@/user/logger';

interface IPilotLoadoutSaveData {
  loadouts?: IPilotLoadoutData[];
  loadout?: IPilotLoadoutData;
  active_index?: number;
}

class PilotLoadoutController implements IFeatureContainer {
  public readonly Parent: Pilot;
  private _loadouts: PilotLoadout[];
  private _activeIndex: number = 0;

  constructor(parent: Pilot) {
    this.Parent = parent;
    this._loadouts = [new PilotLoadout(this)];
  }

  public get ActiveLoadout(): PilotLoadout {
    const active = this.Loadouts[this._activeIndex];
    if (!active) {
      logger.error(
        `PilotLoadoutController: No active loadout found at index ${this._activeIndex}`,
        this
      );
      return this.Loadouts[0];
    }
    return active;
  }

  public set ActiveLoadout(loadout: PilotLoadout) {
    this._activeIndex = this.Loadouts.indexOf(loadout);
    if (this._activeIndex === -1) {
      logger.error(`PilotLoadoutController: Loadout not found in loadouts`, this);
      return;
    }
    this.Parent.SaveController.save();
  }

  public RemoveBrewable(item: PilotEquipment): void {
    this.ActiveLoadout.Remove(item);
    this.Parent.SaveController.save();
  }

  public get MaxArmorSlots(): number {
    return Bonus.Int(Rules.MaxPilotArmor, 'pilot_armor_slots', this.Parent);
  }

  public get MaxWeaponSlots(): number {
    return Bonus.Int(Rules.MaxPilotWeapons, 'pilot_weapon_slots', this.Parent);
  }

  public get MaxGearSlots(): number {
    return Bonus.Int(Rules.MaxPilotGear, 'pilot_gear_slots', this.Parent);
  }

  public get FeatureSource(): any[] {
    return this.ActiveLoadout.Items.filter((i) => !!i);
  }

  public get Loadouts(): PilotLoadout[] {
    return this._loadouts;
  }

  public set Loadouts(l: PilotLoadout[]) {
    this._loadouts = l;
    this.Parent.SaveController.save();
  }

  public AddLoadout(): void {
    const newLoadout = new PilotLoadout(this);
    newLoadout.Name = `Loadout ${this.Loadouts.length + 1}`;
    this.Loadouts.push(newLoadout);
    this.Parent.SaveController.save();
  }

  public RemoveLoadout(index: number): void {
    if (this.Loadouts.length <= 1) return;
    this.Loadouts.splice(index, 1);
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: Pilot, target: any, asInstance = false) {
    if (asInstance) {
      // only save active loadout details
      target.loadouts = [PilotLoadout.Serialize(parent.PilotLoadoutController.ActiveLoadout)];
      target.active_index = 0;
      // iterate through activeLoadout  and set usage/current uses/destroyed
    } else {
      target.loadouts = parent.PilotLoadoutController.Loadouts.map((x) =>
        PilotLoadout.Serialize(x)
      );
      target.active_index = parent.PilotLoadoutController._activeIndex;
    }
  }

  public static Deserialize(parent: Pilot, data: IPilotLoadoutSaveData) {
    if (!parent.PilotLoadoutController)
      throw new Error(
        `PilotLoadoutController not found on parent (${typeof parent}). New PilotLoadoutControllers must be instantiated in the parent's constructor method.`
      );

    if (data.loadouts) {
      parent.PilotLoadoutController._loadouts = data.loadouts.map((x) =>
        PilotLoadout.Deserialize(x, parent.PilotLoadoutController)
      );
    } else if (data.loadout) {
      parent.PilotLoadoutController._loadouts = [
        PilotLoadout.Deserialize(data.loadout, parent.PilotLoadoutController),
      ];
    } else {
      parent.PilotLoadoutController._loadouts = [new PilotLoadout(parent.PilotLoadoutController)];
    }

    parent.PilotLoadoutController._activeIndex = data.active_index || 0;
  }
}

export { PilotLoadoutController };
export type { IPilotLoadoutSaveData };
