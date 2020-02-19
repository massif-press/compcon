import { store } from '@/store'
import { ReserveType } from '@/class'
import { reserves } from 'lancer-data'

class Reserve {
  private _id: string
  protected type: ReserveType
  private _name: string
  private _label: string
  private _resource_name: string
  private _resource_note: string
  private _resource_cost: string
  private _description: string
  private _used: boolean

  public constructor(data: IReserveData) {
    this._id = data.id
    this.type = (data.type as ReserveType) || ReserveType.Resources
    this._name = data.name || ''
    this._label = data.label || ''
    this._resource_name = data.resource_name || ''
    this._resource_note = data.resource_note || ''
    this._resource_cost = data.resource_cost || ''
    this._description = data.description || ''
    this._used = false
  }

  protected save(): void {
    store.dispatch('saveData')
  }

  public get ID(): string {
    return this._id
  }

  public get Type(): ReserveType {
    return this.type
  }

  public get Color(): string {
    return this._used ? 'grey darken-1' : `reserve--${this.type.toLowerCase()}`
  }

  public get Name(): string {
    return this._name
  }

  public set Name(n: string) {
    this._name = n
  }

  public get ResourceLabel(): string {
    return this._label
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
      type: reserve.type,
      name: reserve.Name,
      label: reserve._label,
      description: reserve.Description,
      resource_name: reserve.ResourceName,
      resource_note: reserve.Note,
      resource_cost: reserve.ResourceCost,
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

export default Reserve
