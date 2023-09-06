import { v4 as uuid } from 'uuid';
import { Pilot } from '@/class';
import {
  ISaveData,
  IPortraitData,
  PortraitController,
  SaveController,
  IPortraitContainer,
  ISaveable,
} from '@/classes/components';
import { ImageTag } from '@/classes/enums';
import { PilotData } from '@/interface';

class PilotGroupData {
  id!: string;
  save!: ISaveData;
  img!: IPortraitData;
  name!: string;
  pilots!: PilotData[];
  description!: string;
  history!: string;
}

class PilotGroup implements ISaveable, IPortraitContainer {
  save!: ISaveData;
  img!: IPortraitData;

  public SaveController: SaveController;
  public PortraitController: PortraitController;

  private _id: string;
  private _name: string;
  private _pilots: Pilot[];
  private _description: string;
  private _history: string;
  public readonly ImageTag: ImageTag = ImageTag.Emblem;
  public readonly ItemType: string = 'pilot_group';

  constructor(data?: PilotGroupData) {
    this._id = data?.id || uuid();

    this.SaveController = new SaveController(this);
    this.PortraitController = new PortraitController(this);

    this._name = data?.name || 'New Group';
    this._pilots = data?.pilots.map((x) => Pilot.Deserialize(x)) || ([] as Pilot[]);
    this._description = data?.description || '';
    this._history = data?.history || '';
  }

  public get ID(): string {
    return this._id;
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait;
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(val: string) {
    this._name = val;
  }

  public get Pilots(): Pilot[] {
    return this._pilots;
  }

  public set Pilots(val: Pilot[]) {
    this._pilots = val;
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(val: string) {
    this._description = val;
  }

  public get History(): string {
    return this._history;
  }

  public set History(val: string) {
    this._history = val;
  }

  public static Serialize = (group: PilotGroup): PilotGroupData => {
    const data = {
      id: group.ID,
      name: group.Name,
      description: group.Description,
      history: group.History,
      pilots: group.Pilots.length ? group.Pilots.map((x) => Pilot.Serialize(x)) : [],
    };

    SaveController.Serialize(group, data);
    PortraitController.Serialize(group, data);

    return data as PilotGroupData;
  };

  public static Deserialize = (data: PilotGroupData): PilotGroup => {
    const group = new PilotGroup(data);
    PortraitController.Deserialize(group, data.img);
    SaveController.Deserialize(group, data.save);

    return group;
  };

  public Clone = (): PilotGroup => {
    throw new Error('Cannot clone PilotGroup');
  };
}

export { PilotGroup, PilotGroupData };
