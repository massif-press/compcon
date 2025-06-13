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
import { NarrativeController, NarrativeElementData } from '../narrative/NarrativeController';
import { INarrativeElement } from '../narrative/INarrativeElement';
import { FolderController, IFolderData } from '../components/folder/FolderController';
import { IFolderPlaceable } from '../components/folder/IFolderPlaceable';
import logger from '@/user/logger';
import { IInstanceableData } from '../components/instance/IInstancableData';

class NpcData implements IInstanceableData {
  id!: string;
  save!: ISaveData;
  cloud!: ICloudData;
  folder!: IFolderData;
  brews!: BrewInfo[];
  img!: IPortraitData;
  narrative!: NarrativeElementData;

  // instance fields
  instance: boolean = false;
  instanceId: string = '';
  originId: string = '';

  name!: string;
  note!: string;
  description!: string;
  gmDescription!: string;
}

abstract class Npc
  implements
    IBrewable,
    IFeatureController,
    INarrativeElement,
    ICloudSyncable,
    ISaveable,
    IFolderPlaceable
{
  public readonly IsInstance: boolean = false;
  public readonly ItemType: string = 'npc';
  public readonly DataType: string = 'savedata';
  public readonly StorageType: string = 'npcs';

  public ImageTag!: ImageTag.NPC;
  public CloudController!: CloudController;
  public SaveController: SaveController;
  public PortraitController: PortraitController;
  public BrewController: BrewController;
  public FeatureController: FeatureController;
  public NarrativeController: NarrativeController;
  public FolderController: FolderController;

  private _id: string;
  protected _name: string = 'New NPC';
  private _note: string;
  private _description: string;
  private _gmDescription: string;

  public constructor(data?: NpcData) {
    if ((data as any)?.is_instance) this.IsInstance = true;

    this._id = data ? data.id : uuid();
    this._note = data ? data.note : '';
    this._description = data ? data.description : '';
    this._gmDescription = data ? data.gmDescription : '';

    this.SaveController = new SaveController(this);
    this.PortraitController = new PortraitController(this);
    this.BrewController = new BrewController(this);
    this.NarrativeController = new NarrativeController(this);
    this.FeatureController = new FeatureController(this);
    this.FolderController = new FolderController(this);

    this.FeatureController.Register();
  }

  save(): void {
    // if (this.IsInstance) return;
    this.SaveController.save();
  }

  public Clone(): ISaveable {
    throw new Error('Method inaccessible in abstract class.');
  }

  public Serialize(): Object {
    throw new Error('Method inaccessible in abstract class.');
  }

  public Deserialize() {
    throw new Error('Method inaccessible in abstract class.');
  }

  public CreateInstance() {
    throw new Error('Method inaccessible in abstract class.');
  }

  public static LoadError(self: Npc, err: any, message: string): void {
    logger.error(`Error loading NPC ${self.Name}: ${message}; ${err}`, this);
    self.BrewController.MissingContent = true;
  }

  // -- Passthroughs ------------------------------------------------------------------------------

  public get BrewableCollection(): CompendiumItem[] {
    return this.FeatureController.AllItems;
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait;
  }

  public get Created(): number {
    return this.SaveController.Created;
  }

  public get Updated(): number {
    return this.SaveController.LastModified;
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
    this.save();
  }

  public get Note(): string {
    return this._note;
  }

  public set Note(val: string) {
    this._note = val;
    this.save();
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(val: string) {
    this._description = val;
    this.save();
  }

  public get GmDescription(): string {
    return this._gmDescription;
  }

  public set GmDescription(val: string) {
    this._gmDescription = val;
    this.save();
  }

  public get Readonly(): boolean {
    return this.SaveController.IsRemote;
  }

  // Instance Utilities
  public abstract get IsLinked(): boolean;

  public abstract GetLinkedItem<Npc>(): Npc;
}

export { NpcData, Npc };
