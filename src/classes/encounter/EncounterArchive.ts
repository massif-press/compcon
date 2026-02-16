import { v4 as uuid } from 'uuid'
import { ISaveData, ISaveable, SaveController } from '../components'
import { CombatantData, Encounter, IEncounterData } from './Encounter'
import { CombatLogEntry } from '../components/combat/CombatLog'
import { EncounterInstance } from './EncounterInstance'

interface IEncounterArchiveData {
  itemType: 'EncounterArchive'
  id: string
  name: string
  start: number
  end: number
  round: number
  encounter: IEncounterData
  history: ArchivedCombatLogs
  report: string
  save: ISaveData
}

type ArchivedCombatLogs = {
  combatantName: string
  log: CombatLogEntry[]
  telemetry: any
}[]

class EncounterArchive implements ISaveable {
  public readonly ID: string
  public readonly ItemType: string = 'EncounterArchive'
  public readonly DataType: string = 'savedata'
  public readonly StorageType: string = 'active_encounter_archive'
  public readonly Name: string = ''
  public readonly Start: number = 0
  public readonly End: number = 0
  public readonly Round: number = 0
  public readonly EncounterData: IEncounterData = {} as IEncounterData
  public readonly History: ArchivedCombatLogs = []
  public readonly AfterActionReport: string = ''

  public SaveController: SaveController

  constructor(data: IEncounterArchiveData) {
    this.ID = data.id
    this.Round = data.round
    this.EncounterData = data.encounter

    this.SaveController = new SaveController(this)
  }

  public static FromInstance(instance: EncounterInstance, report: string): EncounterArchive {
    const data = {
      itemType: 'EncounterArchive',
      id: uuid(),
      name: instance.Encounter.Name,
      start: instance.Created,
      end: Date.now(),
      round: instance.Round,
      encounter: Encounter.Serialize(instance.Encounter),
      history: instance.Combatants.map(c => ({
        combatantName: c.actor.CombatController.RootActor.CombatController.CombatName,
        log: c.actor.CombatController.CombatLog.History,
        telemetry: c.actor.CombatController.CombatLog.Telemetry,
      })),
      report,
    }

    return new EncounterArchive(data as IEncounterArchiveData)
  }

  public static Serialize(instance: EncounterArchive): IEncounterArchiveData {
    const data = {
      itemType: instance.ItemType,
      id: instance.ID,
      round: instance.Round,
      encounter: instance.EncounterData,
    } as IEncounterArchiveData

    SaveController.Serialize(instance, data)

    return data as IEncounterArchiveData
  }

  public Clone(): EncounterArchive {
    return {} as EncounterArchive
  }

  public Serialize(): IEncounterArchiveData {
    return EncounterArchive.Serialize(this)
  }

  public static Deserialize(data: IEncounterArchiveData): EncounterArchive {
    const instance = new EncounterArchive(data)

    SaveController.Deserialize(instance, data.save)
    return instance
  }
}

export { EncounterArchive }
export type { IEncounterArchiveData }
