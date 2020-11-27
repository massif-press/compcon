import { store } from '@/store'
import { ReserveType, Synergy, MechEquipment, MechWeapon, MechSystem } from '@/class'
import { reserves } from 'lancer-data'
import { IActionData, Action } from '@/classes/Action'
import { IBonusData, Bonus } from '@/classes/Bonus'
import { ISynergyData, ICounterData } from '@/interface'
import { IDeployableData } from '@/classes/Deployable'

declare interface IReserveData {
  id: string
  type?: string
  name?: string
  label?: string
  description?: string
  resource_name: string
  resource_note: string
  resource_cost: string
  used: boolean
  consumable: boolean
  actions?: IActionData[]
  bonuses?: IBonusData[]
  synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  integrated?: string[]
}

class Reserve {
  public readonly ID: string
  public readonly ResourceLabel: string
  public readonly Consumable: boolean
  public readonly Type: ReserveType
  public readonly Actions: Action[]
  public readonly Bonuses: Bonus[]
  public readonly Synergies: Synergy[]
  public readonly Deployables: IDeployableData[]
  public readonly Counters: ICounterData[]
  private _name: string
  private _resource_name: string
  private _resource_note: string
  private _resource_cost: string
  private _description: string
  private _integrated: string[]
  private _used: boolean

  public constructor(data: IReserveData) {
    this.ID = data.id
    this.ResourceLabel = data.label || ''
    this.Consumable = data.consumable
    this.Type = (data.type as ReserveType) || ReserveType.Resources
    this._name = data.name || ''
    this._resource_name = data.resource_name || ''
    this._resource_note = data.resource_note || ''
    this._resource_cost = data.resource_cost || ''
    this._description = data.description || ''
    this.Actions = data.actions ? data.actions.map(x => new Action(x)) : []
    this.Bonuses = data.bonuses ? data.bonuses.map(x => new Bonus(x)) : []
    this.Synergies = data.synergies
      ? data.synergies.map(x => new Synergy(x, `Reserve: ${data.name}`))
      : []
    this.Deployables = data.deployables ? data.deployables : []
    this.Counters = data.counters ? data.counters : []
    this._integrated = data.integrated ? data.integrated : []
    this._used = false
  }

  protected save(): void {
    store.dispatch('saveData')
  }

  public get Icon(): string {
    if (this.Type === ReserveType.Organization) return 'mdi-account-group'
    if (this.Type === ReserveType.Project) return 'cci-orbital'
    return `cci-reserve-${this.Type.toString().toLowerCase()}`
  }

  public get IntegratedEquipment(): MechEquipment[] {
    if (!this._integrated) return []
    return this._integrated.map(x => {
      const w = store.getters.referenceByID('MechWeapons', x)
      if (w) return w
      return store.getters.referenceByID('MechSystems', x)
    })
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated.map(x => store.getters.referenceByID('MechWeapons', x))
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated.map(x => store.getters.referenceByID('MechSystems', x))
  }

  public get Color(): string {
    return this._used ? 'grey darken-1' : `reserve--${this.Type.toLowerCase()}`
  }

  public get Name(): string {
    return this._name
  }

  public set Name(n: string) {
    this._name = n
  }

  public get ResourceName(): string {
    return this._resource_name
  }

  public set ResourceName(name: string) {
    this._resource_name = name
    this.save()
  }

  public get ResourceCost(): string {
    return this._resource_cost
  }

  public set ResourceCost(cost: string) {
    this._resource_cost = cost
    this.save()
  }

  public get Description(): string {
    return this._description
  }

  public get Note(): string {
    return this._resource_note
  }

  public set Note(note: string) {
    this._resource_note = note
    this.save()
  }

  public get Used(): boolean {
    return this._used
  }

  public set Used(b: boolean) {
    this._used = b
  }

  public static Serialize(reserve: Reserve): IReserveData {
    return {
      id: reserve.ID,
      type: reserve.Type,
      name: reserve.Name,
      label: reserve.ResourceLabel,
      description: reserve.Description,
      resource_name: reserve.ResourceName,
      resource_note: reserve.Note,
      resource_cost: reserve.ResourceCost,
      consumable: reserve.Consumable,
      used: reserve.Used,
    }
  }

  public static Deserialize(rData: IReserveData): Reserve {
    let data = reserves.find(x => x.id === rData.id)
    if (!data)
      data = {
        id: rData.id,
        type: rData.type,
        name: rData.name,
        label: rData.label,
        description: rData.description,
      }
    const r = new Reserve(data)
    r._resource_name = rData.resource_name
    r._resource_note = rData.resource_note
    r._resource_cost = rData.resource_cost
    r._used = rData.used
    return r
  }
}

export { Reserve, IReserveData }
