import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { Mech } from '@/class';
import { ImageTag } from '@/io/ImageManagement';
import {
  IMechLoadoutData,
  MechLoadout,
} from '../../mech/components/loadout/MechLoadout';
import { ISaveable, ISaveData, SaveController } from '..';
import { PilotInstance } from './PilotInstance';
import {
  ActiveStatController,
  IActiveStatData,
} from './stats/ActiveStatController';
import { IStatData, StatController } from './stats/StatController';

class IMechInstanceData {
  id: string;
  link_id: string;
  name: string;
  notes: string;
  loadout: IMechLoadoutData;

  core_energy: number;
  meltdown_imminent: boolean;
  reactor_destroyed: boolean;
  core_active: boolean;

  save: ISaveData;
  stats: IStatData;
  current_stats: IActiveStatData;
}

class MechInstance implements ISaveable {
  public readonly ItemType: string = 'mech';

  public SaveController: SaveController;
  public ImageTag = ImageTag.Mech;
  public ActiveStatController: ActiveStatController;
  public StatController: StatController;

  public ID: string;
  public LinkedID: string;
  public Parent: PilotInstance;
  public Name: string;

  public CoreEnergy: number;

  public Loadout: MechLoadout;

  public _notes: string;

  private _reactor_destroyed: boolean;
  private _meltdown_imminent: boolean;
  private _core_active: boolean;

  public constructor(parent: PilotInstance, mech?: Mech) {
    this.ID = uuid();
    this.Parent = parent;
    this.SaveController = new SaveController(this);
    this.StatController = new StatController(this, mech);
    this.ActiveStatController = new ActiveStatController(this);

    this._notes = '';
    this._reactor_destroyed = false;
    this._meltdown_imminent = false;
    this._core_active = false;

    if (mech) {
      this.LinkedID = mech.ID;
      this.Name = mech.Name;
      this.CoreEnergy = mech.Frame.CoreSystem.Energy;
      this.Loadout = mech.MechLoadoutController.ActiveLoadout;
    }
  }

  // -- Info --------------------------------------------------------------------------------------
  public get Notes(): string {
    return this._notes;
  }

  public set Notes(notes: string) {
    this._notes = notes;
    this.SaveController.save();
  }

  public get IsCascading(): boolean {
    if (!this.Loadout.AICount) return false;
    return !!this.Loadout.Equipment.filter((x) => x.IsCascading).length;
  }

  // -- Stats -------------------------------------------------------------------------------------

  public get IsCoreActive(): boolean {
    return this._core_active;
  }

  public set IsCoreActive(val: boolean) {
    this._core_active = val;
    this.SaveController.save();
  }

  public get ReactorDestroyed(): boolean {
    return this._reactor_destroyed;
  }

  public set ReactorDestroyed(destroyed: boolean) {
    this._meltdown_imminent = false;
    this._reactor_destroyed = destroyed;
    this.SaveController.save();
  }

  // -- I/O ---------------------------------------------------------------------------------------
  public static Serialize(m: MechInstance): IMechInstanceData {
    const data = {
      id: m.ID,
      link_id: m.LinkedID,
      name: m.Name,
      notes: m.Notes,
      loadout: MechLoadout.Serialize(m.Loadout),
      core_energy: m.CoreEnergy,
      core_active: m.IsCoreActive,
      meltdown_imminent: m._meltdown_imminent,
      reactor_destroyed: m.ReactorDestroyed,
    };

    SaveController.Serialize(m, data);
    StatController.Serialize(m, data);
    ActiveStatController.Serialize(m, data);

    return data as IMechInstanceData;
  }

  public static Deserialize(
    data: IMechInstanceData,
    p: PilotInstance
  ): MechInstance {
    const m = new MechInstance(p);

    m.Update(data, p);

    SaveController.Deserialize(m, data.save);

    m.SaveController.SetLoaded();

    return m;
  }

  Clone(): ISaveable {
    const itemData = MechInstance.Serialize(this);
    const newItem = MechInstance.Deserialize(itemData, this.Parent);
    newItem.ID = uuid();
    newItem.Name += ' (COPY)';
    return newItem;
  }

  public Update(data: IMechInstanceData, parent: PilotInstance) {
    this.ID = data.id;
    this.Parent = parent;
    this.LinkedID = data.link_id;
    this.Name = data.name;
    this._notes = data.notes;
    this._reactor_destroyed = data.reactor_destroyed || false;
    this._core_active = data.core_active || false;

    StatController.Deserialize(this, data.stats);
    ActiveStatController.Deserialize(this, data.current_stats);
  }
}

export { MechInstance, IMechInstanceData };
