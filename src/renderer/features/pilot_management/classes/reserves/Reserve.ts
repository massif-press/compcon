import store from '@/store'
import { ReserveType } from '@/class'
import { reserves } from 'lancer-data'

class Reserve {
  private id: string
  protected type: ReserveType
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
    this.type = reserveData.type || ReserveType.Narrative
    this.name = reserveData.name || ''
    this.label = reserveData.label || ''
    this.resource_name = reserveData.resource_name || ''
    this.resource_note = reserveData.resource_note || ''
    this.resource_cost = reserveData.resource_cost || ''
    this.description = reserveData.description || ''
    this.roll_min = reserveData.roll_min || 0
    this.roll_max = reserveData.roll_max || 0
    this.used = false
  }

  protected save() {
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
      type: reserve.type,
      name: reserve.name,
      label: reserve.label,
      description: reserve.description,
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
    let r = new Reserve(data)
    r.ResourceName = rData.resource_name
    r.Note = rData.resource_note
    r.ResourceCost = rData.resource_cost
    r.Used = rData.used
    return r
  }
}

class Project extends Reserve {
  private complicated: boolean
  private can_finish: boolean
  private finished: boolean
  private progress: string[]
  private requirements: string[]

  constructor(projectData: any) {
    super(projectData)
    this.type = ReserveType.Project
    this.complicated = projectData.complicated
    this.can_finish = projectData.can_finish
    this.finished = projectData.finished
    this.progress = projectData.progress_history
    this.requirements = projectData.requirements
  }

  public get IsComplicated(): boolean {
    return this.complicated
  }

  public get CanFinish(): boolean {
    return this.can_finish
  }

  public set CanFinish(b: boolean) {
    this.can_finish = b
  }

  public get IsFinished(): boolean {
    return this.finished
  }

  public set IsFinished(b: boolean) {
    this.finished = b
  }

  public get Progress(): string[] {
    return this.progress
  }

  public set Progress(p: string[]) {
    this.progress = p
  }

  public get Requirements(): string[] {
    return this.requirements
  }

  public set Requirements(r: string[]) {
    this.requirements = r
  }

  public static Serialize
}

class Organization extends Reserve {
  constructor(orgData: any) {
    super(orgData)
  }
}

export default Reserve
