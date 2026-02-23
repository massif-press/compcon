// container for pilot-as-combatant data
import { v4 as uuid } from 'uuid'
import { Deployable, Mech, Pilot } from '@/class'
import { CombatantData, Encounter } from '@/classes/encounter/Encounter'
import { ISaveData, SaveController } from '@/classes/components'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { DeployableInstance } from '@/classes/components/feature/deployable/DeployableInstance'

type PilotSheetData = {
  id: string
  combatant: any
  encounter: number
  archived: boolean
  save: ISaveData
  campaign?: string
  simple_tickbars?: boolean
  autosave?: boolean
}

class PilotSheet {
  public readonly ID: string
  public readonly ItemType = 'PilotSheet'
  public readonly StorageType = 'pilot_sheets'
  public Name: string
  public Combatant: CombatantData
  public Campaign?: string

  public Archived: boolean = false

  public SimpleTickbars: boolean = false
  public Autosave: boolean = true

  public SaveController: SaveController
  public RollHistory: string[] = []

  constructor(data: PilotSheetData) {
    this.ID = data.id
    this.Name = data.combatant.actor.name
    this.Campaign = data.campaign

    this.Archived = data.archived

    this.SimpleTickbars = data.simple_tickbars || false
    this.Autosave = data.autosave || true

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

  public get Pilot(): Pilot {
    return <Pilot>this.Combatant.actor
  }

  public get Combatants(): CombatantData[] {
    return [this.Combatant]
  }
  public get Encounter(): Encounter {
    return { NarrativeController: { Tables: [] as any[] } } as Encounter
  }

  public SetActiveMech(mech: Mech) {
    this.Pilot.ActiveMech = mech
    this.SaveController.save()
  }

  public Deploy(deployable: Deployable, combatant: CombatantData): void {
    const deployableInstance = new DeployableInstance(deployable.ItemData, combatant)
    deployableInstance.SetStats()
    combatant.deployables.push(deployableInstance)
  }

  public EndRound(): void {
    this.Combatant.actor.CombatController.EndRound(this)
    this.Pilot.ActiveMech!.CombatController.EndRound(this)

    if (this.Autosave) {
      this.SaveController.save()
    }
  }

  public getTargetsSorted(): CombatantData[] {
    return [this.Combatant]
  }

  // this mocks the encounter instance for the pilot sheet, so that we can use the same components for both
  public get EncounterInstance(): EncounterInstance {
    return this as any as EncounterInstance
  }

  public static Serialize(pilotSheet: PilotSheet): any {
    let data = {
      id: pilotSheet.ID,
      combatant: Encounter.SerializeCombatant(pilotSheet.Combatant),
      campaign: pilotSheet.Campaign,
      archived: pilotSheet.Archived,
      simple_tickbars: pilotSheet.SimpleTickbars,
      autosave: pilotSheet.Autosave,
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
