import { CompendiumItem, EncounterSide } from '@/class'
import { BrewController, BrewInfo, IBrewData } from '@/classes/components/brew/BrewController'
import { IBrewable } from '@/classes/components/brew/IBrewable'
import { FeatureController } from '@/classes/components/feature/FeatureController'
import { IFeatureController } from '@/classes/components/feature/IFeatureController'
import { IClockData } from '@/classes/components/narrative/elements/Clock'
import { IRollableTableData } from '@/classes/components/narrative/elements/RollableTable'
import { EidolonLayer } from './EidolonLayer'
import uuid from 'uuid/v4'

class EidolonShardData implements IBrewData {
  brews: BrewInfo[]
  id: string
  name: string
  active: boolean
  note: string
  statuses: string[]
  conditions: string[]
  resistances: string[]
  burn: number
  overshield: number
  destroyed: boolean
  defeat: string
  actions: number
}

class EidolonShard implements IBrewable, IFeatureController {
  public readonly ItemType: string = 'eidolonshard'
  public readonly Parent: EidolonLayer
  public BrewController: BrewController
  public BrewableCollection: CompendiumItem[]
  public FeatureController: FeatureController

  private _active: boolean
  private _id: string
  private _name: string
  private _subtitle: string
  private _note: string

  private _side: EncounterSide
  private _statuses: string[]
  private _conditions: string[]
  private _resistances: string[]
  private _burn: number
  private _overshield: number
  private _turn_actions: number
  private _destroyed: boolean
  private _defeat: string

  public constructor(parent: EidolonLayer) {
    this._id = uuid()
    this.Parent = parent
    this.BrewController = new BrewController(this)
    this.FeatureController = new FeatureController(this)

    this.FeatureController.Register()

    this._name = `New Eidolon Shard`
    this._subtitle = ''
    this._note = ''
    this._burn = 0
    this._overshield = 0
    this._turn_actions = 2
    this._destroyed = false
    this._defeat = ''
    this._statuses = []
    this._conditions = []
    this._resistances = []
  }

  public get Active(): boolean {
    return this._active
  }

  public set Active(val: boolean) {
    this._active = val
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get EncounterName(): string {
    return this._name
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.Parent.Parent.SaveController.save()
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.Parent.Parent.SaveController.save()
  }

  public static Serialize(e: EidolonShard): EidolonShardData {
    let data = {
      active: e.Active,
      id: e.ID,
      name: e._name,
      note: e._note,
      statuses: e._statuses,
      conditions: e._conditions,
      resistances: e._resistances,
      burn: e._burn,
      overshield: e._overshield,
      destroyed: e._destroyed,
      defeat: e._defeat,
      actions: e._turn_actions,
    }

    BrewController.Serialize(e, data)

    return data as EidolonShardData
  }

  public Serialize(): EidolonShardData {
    return EidolonShard.Serialize(this)
  }

  public Update(data: EidolonShardData): void {
    this._active = data.active
    this._id = data.id
    this._name = data.name
    this._note = data.note
    this._statuses = data.statuses || []
    this._conditions = data.conditions || []
    this._resistances = data.resistances || []
    this._burn = data.burn || 0
    this._overshield = data.overshield || 0
    this._turn_actions = data.actions || 1
    this._destroyed = data.destroyed || false
    this._defeat = data.defeat || ''
  }

  public static Deserialize(data: EidolonShardData, parent: EidolonLayer): EidolonShard {
    const e = new EidolonShard(parent)
    try {
      e.Update(data)
      BrewController.Deserialize(e, data)
      return e
    } catch (err) {
      console.error(err)
    }
    return e
  }

  public Clone(parent: EidolonLayer): EidolonShard {
    const itemData = EidolonShard.Serialize(this)
    const newItem = EidolonShard.Deserialize(itemData, parent)
    newItem.RenewID()
    newItem.Name += ' (COPY)'
    return newItem
  }
}

export { EidolonShard, EidolonShardData }
