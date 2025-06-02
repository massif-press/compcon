import { v4 as uuid } from 'uuid';
import { ISaveData, ISaveable, SaveController } from '../components';
import { Encounter, IEncounterData } from './Encounter';

interface IEncounterInstanceData {
  itemType: 'EncounterInstance';
  id: string;
  encounterData: IEncounterData;
  save: ISaveData;
  round: number;
}

class EncounterInstance implements ISaveable {
  public readonly ItemType: string = 'EncounterInstance';
  public readonly DataType: string = 'savedata';
  public readonly StorageType: string = 'active_encounters';
  public readonly Name: string = 'encounter_instance';

  public Encounter: Encounter;

  private _id: string;
  private _round: number = 0;

  public SaveController: SaveController;

  constructor(data: IEncounterInstanceData) {
    this._id = data.id || uuid();
    this._round = data.round;

    this.Encounter = Encounter.Deserialize(data.encounterData);

    this.SaveController = new SaveController(this);
  }

  public save(): void {
    this.SaveController.save();
  }

  public get Created(): number {
    return this.SaveController.Created;
  }

  public get Updated(): number {
    return this.SaveController.LastModified;
  }

  public get ID(): string {
    return this._id;
  }

  public static Serialize(instance: EncounterInstance): IEncounterInstanceData {
    const data = {
      itemType: 'EncounterInstance',
      id: instance.ID,
      encounterData: Encounter.Serialize(instance.Encounter),
      round: instance._round,
    };

    SaveController.Serialize(instance, data);

    return data as IEncounterInstanceData;
  }

  public Serialize(): IEncounterInstanceData {
    return EncounterInstance.Serialize(this);
  }

  public Clone(): EncounterInstance {
    return EncounterInstance.Deserialize(EncounterInstance.Serialize(this));
  }

  public static Deserialize(data: IEncounterInstanceData): EncounterInstance {
    const instance = new EncounterInstance(data);
    SaveController.Deserialize(instance, data.save);
    return instance;
  }
}

export { EncounterInstance };
export type { IEncounterInstanceData };
