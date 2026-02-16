import { v4 as uuid } from 'uuid'
import { ISaveData, ISaveable, SaveController } from '../components'
import { CombatantData, Encounter, IEncounterData } from './Encounter'
import { PilotData } from '@/interface'
import { Deployable, Pilot } from '@/class'
import { Placeholder } from './Placeholder'
import { DeployableInstance } from '../components/feature/deployable/DeployableInstance'
import { ActionSummary } from '../components/feature/active_effects/EffectActionSummary'

interface IEncounterInstanceData {
  itemType: 'EncounterInstance'
  id: string
  combatants: any[]
  round: number
  save: ISaveData
  encounter: IEncounterData
  isActive?: boolean
  autosave?: boolean
}

class EncounterInstance implements ISaveable {
  public readonly ItemType: string = 'EncounterInstance'
  public readonly DataType: string = 'savedata'
  public readonly StorageType: string = 'active_encounters'
  public readonly Name: string = 'encounter_instance'

  public Combatants: CombatantData[] = []
  public Encounter!: Encounter
  public Autosave: boolean = true

  private _id: string
  private _round: number = 0

  public IsActive: boolean = false
  public IsArchived: boolean = false

  public SaveController: SaveController

  public RollHistory: string[] = []

  constructor(
    data?: IEncounterInstanceData,
    encounter?: Encounter,
    pilots: Pilot[] = [],
    placeholders: Placeholder[] = []
  ) {
    this._id = data?.id || uuid()
    this._round = data?.round || 1
    this.IsActive = data?.isActive || false

    if (data) {
      this.Combatants = data.combatants.map(c => Encounter.DeserializeCombatant(c))
      this.Encounter = Encounter.Deserialize(data.encounter)
      this.Autosave = data.autosave || true
    } else {
      if (!encounter) {
        throw new Error(
          'EncounterInstance constructor requires encounter data if no serialized data is provided.'
        )
      }
      // store encounter without combatant data
      const eData = Encounter.Serialize(encounter)
      delete eData.combatants
      this.Encounter = Encounter.Deserialize(eData)

      this.Combatants = [
        ...encounter.Combatants,
        ...pilots.map(p => {
          // clear non-active mechs from instanced pilot
          const pData = p.Serialize() as PilotData
          pData.mechs = [pData.mechs[0]]
          const actor = Pilot.Deserialize(pData)

          return {
            id: p.ID,
            index: -1,
            number: -1,
            side: 'ally',
            type: 'pilot',
            actor,
            deployables: [],
          } as unknown as CombatantData
        }),
        ...placeholders.map(ph => {
          return {
            id: ph.ID,
            index: -1,
            number: -1,
            type: 'placeholder',
            side: ph.Side,
            actor: ph,
            deployables: [],
          } as unknown as CombatantData
        }),
      ]

      this.Combatants.sort((a, b) => a.index - b.index)

      this.Combatants.forEach((combatant, index) => {
        combatant.index = index
        combatant.actor.SetStats()
      })
    }

    // prevent saveControllers from creating new entries
    this.Combatants.forEach(c => {
      c.actor.IsEncounterInstance = true
    })

    this.SaveController = new SaveController(this)
  }

  public Deploy(deployable: Deployable, combatant: CombatantData): void {
    const deployableInstance = new DeployableInstance(deployable.ItemData, combatant)
    deployableInstance.SetStats()
    combatant.deployables.push(deployableInstance)
  }

  public EndRound(): void {
    this.Combatants.forEach(c => {
      c.actor.CombatController.EndRound(this)
      if ((c.actor as any).ActiveMech) (c.actor as any).ActiveMech.CombatController.EndRound(this)
    })
    this._round += 1
    if (this.Autosave) {
      this.Save()
    }
  }

  public Save(): void {
    this.SaveController.save()
  }

  public get Created(): number {
    return this.SaveController.Created
  }

  public get Updated(): number {
    return this.SaveController.LastModified
  }

  public get ID(): string {
    return this._id
  }

  public get Round(): number {
    return this._round
  }

  public set Round(value: number) {
    this._round = value
  }

  public getTargetsSorted(
    targetType: 'ally' | 'enemy' | 'self',
    originSide: 'ally' | 'enemy' | 'neutral',
    self_id?: string
  ): CombatantData[] {
    if (!['ally', 'enemy', 'self'].includes(targetType)) targetType = 'enemy'
    let targetSide = targetType
    if (originSide === 'enemy') {
      if (targetType === 'ally') targetSide = 'enemy'
      else if (targetType === 'enemy') targetSide = 'ally'
    }

    const allTargets: CombatantData[] = []

    this.Combatants.forEach(combatant => {
      allTargets.push(combatant)

      combatant.deployables.forEach(deployable => {
        allTargets.push({
          id: deployable.ID,
          index: -1,
          number: -1,
          type: 'placeholder',
          side: combatant.side, // Inherit parent's side
          deployables: [],
          actor: deployable,
        } as CombatantData)
      })
    })

    return allTargets.sort((a, b) => {
      // if targetType is self, make the combatant with the same ID as origin come first
      if (targetType === 'self' && self_id) {
        if (a.id === self_id) return -1
        if (b.id === self_id) return 1
      }

      // Sort by side first
      if (a.side !== b.side) {
        // Prioritize the target side
        if (a.side === targetSide) return -1
        if (b.side === targetSide) return 1

        // Then sort remaining sides alphabetically
        return a.side.localeCompare(b.side)
      }

      // If same side, sort by name
      return a.actor.Name.localeCompare(b.actor.Name)
    })
  }

  public static Serialize(instance: EncounterInstance): IEncounterInstanceData {
    const data = {
      itemType: 'EncounterInstance',
      id: instance.ID,
      combatants: instance.Combatants.map(c => Encounter.SerializeCombatant(c)),
      round: instance._round,
      encounter: Encounter.Serialize(instance.Encounter),
      isActive: instance.IsActive,
      autosave: instance.Autosave,
    } as IEncounterInstanceData

    SaveController.Serialize(instance, data)

    return data as IEncounterInstanceData
  }

  public Serialize(): IEncounterInstanceData {
    return EncounterInstance.Serialize(this)
  }

  public Clone(): EncounterInstance {
    return EncounterInstance.Deserialize(EncounterInstance.Serialize(this))
  }

  public static Deserialize(data: IEncounterInstanceData): EncounterInstance {
    const instance = new EncounterInstance(data)
    SaveController.Deserialize(instance, data.save)
    return instance
  }
}

export { EncounterInstance }
export type { IEncounterInstanceData }
