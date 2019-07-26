import store from '@/store'
import { ReserveType } from '@/class'
import { reserves } from 'lancer-data'

class Reserve {
  private id: string
  private type: ReserveType
  private name: string
  private label: string
  private resource_name: string
  private resource_note: string
  private resource_cost: string
  private description: string
  private roll_min: number
  private roll_max: number
  private used: boolean

  constructor(reserveData: any) {
    this.id = reserveData.id
    this.type = reserveData.type
    this.name = reserveData.name
    this.label = reserveData.label
    this.resource_name = ''
    this.resource_note = ''
    this.resource_cost = ''
    this.description = reserveData.description
    this.roll_min = reserveData.roll_min
    this.roll_max = reserveData.roll_max
    this.used = false
  }

  private save() {
    store.dispatch('saveData')
  }

  public get ID(): string {
    return this.id
  }

  public get Type(): ReserveType {
    return this.type
  }

  public get Name(): string {
    return this.name
  }

  public get ResourceLabel(): string {
    return this.label
  }

  public get ResourceName(): string {
    return this.resource_name
  }

  public set ResourceName(name: string) {
    this.resource_name = name
    this.save()
  }

  public get ResourceCost(): string {
    return this.resource_cost
  }

  public set ResourceCost(cost: string) {
    this.resource_cost = cost
    this.save()
  }

  public get Description(): string {
    return this.description
  }

  public get Min(): number {
    return this.roll_min
  }

  public get Max(): number {
    return this.roll_max
  }

  public IsRolled(roll: number): boolean {
    return roll >= this.roll_min && roll <= this.roll_max
  }

  public get Note(): string {
    return this.resource_note
  }

  public set Note(note: string) {
    this.resource_note = note
    this.save()
  }

  public get Used(): boolean {
    return this.used
  }

  public set Used(b: boolean) {
    this.used = b
  }

  public static Serialize(reserve: Reserve): IReserveData {
    return {
      id: reserve.ID,
      resource_name: reserve.ResourceName,
      resource_note: reserve.Note,
      resource_cost: reserve.ResourceCost,
      used: reserve.Used,
    }
  }

  public static Deserialize(rData: IReserveData): Reserve {
    let r = new Reserve(reserves.find(x => x.id === rData.id))
    r.ResourceName = rData.resource_name
    r.Note = rData.resource_note
    r.ResourceCost = rData.resource_cost
    r.Used = rData.used
    return r
  }
}

export default Reserve
