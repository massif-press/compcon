// container for pilot-as-combatant data
import { v4 as uuid } from 'uuid'
import { Deployable, ItemType, Mech, Pilot } from '@/class'
import { CombatantData, Encounter } from '@/classes/encounter/Encounter'
import {
  CloudController,
  ICloudData,
  ICloudSyncable,
  ISaveable,
  ISaveData,
  SaveController,
} from '@/classes/components'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { DeployableInstance } from '@/classes/components/feature/deployable/DeployableInstance'

type PilotSheetData = {
  id: string
  combatant: any
  encounter: number
  archived: boolean
  round: number
  save: ISaveData
  cloud: ICloudData
  campaign?: string
  simple_tickbars?: boolean
  force_complex_tickbars?: boolean
  layout_columns?: boolean
  max_masonry_columns?: number
  autosave?: boolean
}

class PilotSheet implements ISaveable, ICloudSyncable {
  public readonly ID: string
  public readonly ItemType: ItemType = ItemType.PilotSheet
  public readonly DataType = 'savedata'
  public readonly StorageType = 'pilot_sheets'
  public Name: string
  public Combatant: CombatantData
  public Campaign?: string
  public Round: number = 1

  public Archived: boolean = false

  public SimpleTickbars: boolean = false
  public ForceComplexTickbars: boolean = false
  public LayoutColumns: boolean = true
  public MaxMasonryColumns: number = 1
  public Autosave: boolean = true

  public SaveController: SaveController
  public CloudController: CloudController
  public RollHistory: string[] = []

  constructor(data: PilotSheetData) {
    this.ID = data.id
    this.Name = data.combatant.actor.name
    this.Campaign = data.campaign
    this.Round = data.round

    this.Archived = data.archived

    this.SimpleTickbars = data.simple_tickbars || false
    this.ForceComplexTickbars = data.force_complex_tickbars || false
    this.LayoutColumns = !!data.layout_columns || true
    this.MaxMasonryColumns = data.max_masonry_columns || 1
    this.Autosave = data.autosave || true

    this.Combatant = Encounter.DeserializeCombatant(data.combatant)

    this.SaveController = new SaveController(this)
    SaveController.Deserialize(this, data.save)
    this.CloudController = new CloudController(this)
    CloudController.Deserialize(this, data.cloud)
  }

  public static FromPilot(pilot: Pilot, campaign?: string) {
    pilot.SetStats()
    pilot.FeatureController.BonusController.applyToStats(pilot.CombatController.StatController)
    pilot.CombatController.StatController.resetCurrentStats()
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
      round: 1,
      archived: false,
      save: {
        created: new Date().getTime(),
        lastModified: 0,
        deleteTime: 0,
      },
    } as PilotSheetData

    return new PilotSheet(data)
  }

  public Save() {
    this.SaveController.save()
  }

  public Archive() {
    this.Archived = true
    this.Save()
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
    this.Save()
  }

  public Deploy(deployable: Deployable, combatant: CombatantData): void {
    const deployableInstance = new DeployableInstance(deployable.ItemData, combatant)
    deployableInstance.SetStats()
    combatant.deployables.push(deployableInstance)
    combatant.actor.CombatController.toggleCombatAction(deployable.DeployAction.Activation)
  }

  public async EndRound(): Promise<void> {
    await this.Combatant.actor.CombatController.EndRound(this)
    await this.Pilot.ActiveMech!.CombatController.EndRound(this)

    if (this.Autosave) {
      this.Save()
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
    const data = {
      id: pilotSheet.ID,
      combatant: Encounter.SerializeCombatant(pilotSheet.Combatant),
      campaign: pilotSheet.Campaign,
      archived: pilotSheet.Archived,
      simple_tickbars: pilotSheet.SimpleTickbars,
      autosave: pilotSheet.Autosave,
      round: pilotSheet.Round,
      force_complex_tickbars: pilotSheet.ForceComplexTickbars,
      layout_columns: pilotSheet.LayoutColumns,
      max_masonry_columns: pilotSheet.MaxMasonryColumns,
    }

    SaveController.Serialize(pilotSheet, data)

    return data
  }

  public Serialize(): any {
    return PilotSheet.Serialize(this)
  }

  public Clone(): PilotSheet {
    return PilotSheet.Deserialize(structuredClone(PilotSheet.Serialize(this)))
  }

  public static Deserialize(data: any): PilotSheet {
    const pilotSheet = new PilotSheet(data)

    return pilotSheet
  }
}

export default PilotSheet
