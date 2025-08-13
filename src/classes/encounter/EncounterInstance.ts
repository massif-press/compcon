import { v4 as uuid } from 'uuid';
import { ISaveData, ISaveable, SaveController } from '../components';
import { CombatantData, Encounter, IEncounterData } from './Encounter';
import { PilotData } from '@/interface';
import { Deployable, Pilot } from '@/class';
import { IPlaceholderData, Placeholder } from './Placeholder';
import { ICombatant } from '../components/combat/ICombatant';
import {
  DeployableInstance,
  IDeployableData,
} from '../components/feature/deployable/DeployableInstance';

interface IEncounterInstanceData {
  itemType: 'EncounterInstance';
  id: string;
  encounterData: IEncounterData;
  pilotData?: PilotData[];
  placeholderData?: IPlaceholderData[];
  round: number;
  save: ISaveData;
  isActive?: boolean;
  archived?: boolean;
}

class EncounterInstance implements ISaveable {
  public readonly ItemType: string = 'EncounterInstance';
  public readonly DataType: string = 'savedata';
  public readonly StorageType: string = 'active_encounters';
  public readonly Name: string = 'encounter_instance';

  public Encounter: Encounter;
  public Pilots: Pilot[] = [];
  public Placeholders: Placeholder[] = [];
  public Combatants: CombatantData[] = [];

  private _id: string;
  private _round: number = 0;

  public IsActive: boolean = false;
  public IsArchived: boolean = false;

  public SaveController: SaveController;

  constructor(data: IEncounterInstanceData) {
    this._id = data.id || uuid();
    this._round = data.round;

    this.Encounter = Encounter.Deserialize(data.encounterData);
    this.Pilots = data.pilotData?.map((p) => Pilot.Deserialize(p)) || [];
    this.Placeholders = data.placeholderData?.map((ph) => Placeholder.Deserialize(ph)) || [];

    this.IsActive = data.isActive || false;
    this.IsArchived = data.archived || false;

    console.log(this.Placeholders);

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
          deployables: [],
        } as unknown as CombatantData;
      }),
      ...this.Placeholders.map((ph) => {
        return {
          id: ph.ID,
          index: -1,
          number: -1,
          type: 'placeholder',
          side: ph.Side,
          actor: ph,
          deployables: [],
        } as unknown as CombatantData;
      }),
    ];

    this.Combatants.sort((a, b) => a.index - b.index);

    this.Combatants.forEach((combatant, index) => {
      combatant.index = index;
      combatant.actor.SetStats();
    });

    this.SaveController = new SaveController(this);
  }

  public Deploy(deployable: Deployable, combatant: CombatantData): void {
    const deployableInstance = new DeployableInstance(deployable.ItemData, combatant);
    combatant.deployables.push(deployableInstance);

    this.save();
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

  public get Round(): number {
    return this._round;
  }

  public set Round(value: number) {
    this._round = value;
    this.save();
  }

  public static Serialize(instance: EncounterInstance): IEncounterInstanceData {
    const data = {
      itemType: 'EncounterInstance',
      id: instance.ID,
      encounterData: Encounter.Serialize(instance.Encounter),
      pilotData: instance.Pilots.map((p) => p.Serialize()),
      placeholderData: instance.Placeholders.map((ph) => ph.Serialize()),
      round: instance._round,
      isActive: instance.IsActive,
      archived: instance.IsArchived,
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
