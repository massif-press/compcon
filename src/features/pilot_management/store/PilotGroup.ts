import { v4 as uuid } from 'uuid';
import {
  ISaveData,
  IPortraitData,
  PortraitController,
  SaveController,
  IPortraitContainer,
  ISaveable,
} from '@/classes/components';
import { ImageTag } from '@/classes/enums';

type PilotGroupData = {
  id: string;
  sortIndex: number;
  save: ISaveData;
  img: IPortraitData;
  name: string;
  pilots: PilotIndexItem[];
  description: string;
  history: string;
  expanded: boolean;
};

type PilotIndexItem = {
  id: string;
  index: number;
};

class PilotGroup implements ISaveable, IPortraitContainer {
  save!: ISaveData;
  img!: IPortraitData;

  public SortIndex: number;

  public SaveController: SaveController;
  public PortraitController: PortraitController;

  private _id: string;
  private _name: string;
  private _pilots: PilotIndexItem[];
  private _description: string;
  private _history: string;
  public readonly ImageTag: ImageTag = ImageTag.Emblem;
  public readonly ItemType: string = 'pilot_group';
  public readonly StorageType: string = 'pilot_groups';

  // controls whether the group is expanded in the UI
  public Expanded: boolean = true;

  constructor(data?: PilotGroupData) {
    this._id = data?.id || uuid();
    this.SortIndex = data && !isNaN(data.sortIndex) ? data.sortIndex : -1;

    this.SaveController = new SaveController(this);
    this.PortraitController = new PortraitController(this);

    this._name = data?.name || 'New Group';
    this._pilots = data?.pilots || ([] as PilotIndexItem[]);
    this._description = data?.description || '';
    this._history = data?.history || '';
    this.Expanded = data?.expanded || true;
  }

  private Save(): void {
    this.SaveController.save();
  }

  public get ID(): string {
    return this._id;
  }

  public RenewID(): string {
    this._id = uuid();
    this.Save();
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
    this.Save();
  }

  public get Pilots(): PilotIndexItem[] {
    return this._pilots.sort((a, b) => a.index - b.index);
  }

  public set Pilots(val: PilotIndexItem[]) {
    this._pilots = val;
    this.Save();
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(val: string) {
    this._description = val;
    this.Save();
  }

  public get History(): string {
    return this._history;
  }

  public set History(val: string) {
    this._history = val;
    this.Save();
  }

  public static Serialize = (group: PilotGroup): PilotGroupData => {
    const data = {
      id: group.ID,
      name: group.Name,
      description: group.Description,
      history: group.History,
      pilots: group._pilots,
      sortIndex: group.SortIndex,
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

  public Serialize(): PilotGroupData {
    return PilotGroup.Serialize(this);
  }

  public Clone = (): PilotGroup => {
    throw new Error('Cannot clone PilotGroup');
  };
}

export { PilotGroup };
export type { PilotGroupData };
