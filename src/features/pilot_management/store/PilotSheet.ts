// container for pilot-as-combatant data
import { v4 as uuid } from 'uuid'
import { Pilot } from '@/class'
import { CombatantData, Encounter } from '@/classes/encounter/Encounter'
import { ISaveData, SaveController } from '@/classes/components'

type PilotSheetData = {
  id: string
  combatant: any
  encounter: number
  archived: boolean
  save: ISaveData
  campaign?: string
}

class PilotSheet {
  public readonly ID: string
  public readonly ItemType = 'PilotSheet'
  public readonly StorageType = 'pilot_sheets'
  public Name: string
  public Combatant: CombatantData
  public Campaign?: string
  public Encounter: number = 1

  public Archived: boolean = false

  public SaveController: SaveController

  constructor(data: PilotSheetData) {
    this.ID = data.id
    this.Name = data.combatant.actor.name
    this.Campaign = data.campaign
    this.Encounter = data.encounter

    this.Archived = data.archived

    this.Combatant = Encounter.DeserializeCombatant(data.combatant)

    this.SaveController = new SaveController(this)
    SaveController.Deserialize(this, data.save)
  }

  public static FromPilot(pilot: Pilot, campaign?: string) {
    const data = {
      id: uuid(),
      combatant: {
        id: pilot.ID,
        index: -1,
        number: -1,
        side: 'ally',
        type: 'pilot',
        actor: Pilot.Serialize(pilot),
        deployables: [],
      },
      campaign: campaign,
      encounter: 1,
      archived: false,
      save: {
        created: new Date().getTime(),
        lastModified: 0,
        deleteTime: 0,
      },
    }

    return new PilotSheet(data)
  }

  public Archive() {
    this.Archived = true
    this.SaveController.save()
  }

  public get Created(): number {
    return this.SaveController.Created
  }

  public get Updated(): number {
    return this.SaveController.LastModified
  }

  public static Serialize(pilotSheet: PilotSheet): any {
    let data = {
      id: pilotSheet.ID,
      combatant: Encounter.SerializeCombatant(pilotSheet.Combatant),
      campaign: pilotSheet.Campaign,
      encounter: pilotSheet.Encounter,
      archived: pilotSheet.Archived,
    }

    SaveController.Serialize(pilotSheet, data)

    return data
  }

  public Serialize(): any {
    return PilotSheet.Serialize(this)
  }

  public Clone(): PilotSheet {
    return PilotSheet.Deserialize(PilotSheet.Serialize(this))
  }

  public static Deserialize(data: any): PilotSheet {
    let pilotSheet = new PilotSheet(data)

    return pilotSheet
  }
}

export default PilotSheet
