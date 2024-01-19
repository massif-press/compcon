import { v4 as uuid } from 'uuid';
import { ImageTag } from '@/io/ImageManagement';
import {
  CloudController,
  ICloudData,
  ICloudSyncable,
  IPortraitData,
  ISaveable,
  ISaveData,
  PortraitController,
  SaveController,
} from '../components';
import { IFeatureController } from '../components/feature/IFeatureController';
import { FeatureController } from '../components/feature/FeatureController';

import { BrewController, BrewInfo } from '../components/brew/BrewController';
import { IBrewable } from '../components/brew/IBrewable';
import { CompendiumItem } from '../CompendiumItem';
import { Label, NarrativeController, NarrativeElementData } from '../narrative/NarrativeController';
import { INarrativeElement } from '../narrative/INarrativeElement';

class NpcData {
  id!: string;
  save!: ISaveData;
  cloud!: ICloudData;
  brews!: BrewInfo[];
  img!: IPortraitData;
  narrative!: NarrativeElementData;

  name!: string;
  note!: string;
}

abstract class Npc
  implements IBrewable, IFeatureController, INarrativeElement, ICloudSyncable, ISaveable
{
  public readonly ItemType: string = 'npc';
  public readonly StorageType: string = 'npcs';

  public ImageTag!: ImageTag.NPC;
  public CloudController: CloudController;
  public SaveController: SaveController;
  public PortraitController: PortraitController;
  public BrewController: BrewController;
  public FeatureController: FeatureController;
  public NarrativeController: NarrativeController;

  private _id: string;
  protected _name: string = 'New NPC';
  private _note: string = '';
  static ID: string;
  static Name: string;

  public constructor(data?: NpcData) {
    this._id = data ? data.id : uuid();
    this.SaveController = new SaveController(this);
    this.PortraitController = new PortraitController(this);
    this.CloudController = new CloudController(this);
    this.BrewController = new BrewController(this);
    this.FeatureController = new FeatureController(this);
    this.NarrativeController = new NarrativeController(this);

    this.FeatureController.Register();
  }

  public Clone<T>(): T {
    throw new Error('Method inaccessible in abstract class.');
  }

  public Serialize<T>(): T {
    throw new Error('Method inaccessible in abstract class.');
  }

  public Deserialize<T>(): T {
    throw new Error('Method inaccessible in abstract class.');
  }

  // -- Passthroughs ------------------------------------------------------------------------------

  public get BrewableCollection(): CompendiumItem[] {
    // TODO!
    return [];
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait;
  }

  // -------------------------------------------------------------------------------------------------

  public get ID(): string {
    return this._id;
  }

  public RenewID(): void {
    this._id = uuid();
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(val: string) {
    this._name = val;
    this.SaveController.save();
  }

  public get Note(): string {
    return this._note;
  }

  public set Note(val: string) {
    this._note = val;
    this.SaveController.save();
  }
}

export { NpcData, Npc };
