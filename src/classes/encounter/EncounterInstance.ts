import { v4 as uuid } from 'uuid';
import { ISaveData, ISaveable, SaveController } from '../components';
import { CombatantData, Encounter, IEncounterData } from './Encounter';
import { PilotData } from '@/interface';
import { Pilot } from '@/class';

interface IEncounterInstanceData {
  itemType: 'EncounterInstance';
  id: string;
  encounterData: IEncounterData;
  pilotData?: PilotData[]; // Optional, if pilots are part of the encounter
  save: ISaveData;
  round: number;
}

class EncounterInstance implements ISaveable {
  public readonly ItemType: string = 'EncounterInstance';
  public readonly DataType: string = 'savedata';
  public readonly StorageType: string = 'active_encounters';
  public readonly Name: string = 'encounter_instance';

  public Encounter: Encounter;
  public Pilots: Pilot[] = [];
  public Combatants: CombatantData[] = [];

  private _id: string;
  private _round: number = 0;

  public SaveController: SaveController;

  constructor(data: IEncounterInstanceData) {
    this._id = data.id || uuid();
    this._round = data.round;

    this.Encounter = Encounter.Deserialize(data.encounterData);
    this.Pilots = data.pilotData?.map((p) => Pilot.Deserialize(p)) || [];

    this.Combatants = [
      ...this.Encounter.Combatants,
      ...this.Pilots.map((p) => {
        return {
          id: p.ID,
          index: -1,
          number: -1,
          side: 'ally',
          type: 'pilot',
          actor: p,
        } as CombatantData;
      }),
    ];

    this.Combatants.sort((a, b) => a.index - b.index);

    this.Combatants.forEach((combatant, index) => {
      combatant.index = index;
    });

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
