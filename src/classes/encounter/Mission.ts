import uuid from 'uuid/v1'
import { store } from '@/store'
import { Encounter, Rest } from '@/class'
import { IEncounterData } from '@/interface'

export interface IMissionData {
  id?: string
  name: string
  note: string
  campaign: string
  labels: string[]
  steps: (IEncounterData | { note: string; isLong: boolean })[]
}

export class Mission {
  private _id: string
  private _name: string
  private _note: string
  private _campaign: string
  private _labels: string[]
  private _steps: (Encounter | Rest)[]

  public constructor(data: IMissionData) {
    this._id = data.id ? data.id : uuid()
    this._name = data.name
    this._note = data.note
    this._labels = data.labels
    this._campaign = data.campaign
    var s = []
    data.steps.forEach((e: any) => {
      if (e.name) s.push(Encounter.Deserialize(e as IEncounterData))
      else s.push(Rest.Deserialize(e))
    })
    this._steps = s
  }

  private save(): void {
    store.dispatch('mission/saveMissionData')
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
    this.save()
  }

  public get Campaign(): string {
    return this._campaign
  }

  public set Campaign(val: string) {
    this._campaign = val
    this.save()
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.save()
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.save()
  }

  public get Labels(): string[] {
    return this._labels
  }

  public set Labels(val: string[]) {
    this._labels = val
    this.save()
  }

  public get averagePower(): number {
    return this.Encounters.reduce((a, b) => +a + +b.Power, 0) / this.Encounters.length
  }

  public get maxPower(): number {
    return Math.max(...this.Encounters.map(x => x.Power))
  }

  public get Encounters(): Encounter[] {
    return this._steps.filter((x: any) => x.Name) as Encounter[]
  }

  public get Rests(): Rest[] {
    return this._steps.filter((x: any) => !x.Name) as Rest[]
  }

  public get Steps(): (Encounter | Rest)[] {
    return this._steps
  }

  public Step(idx: number): Encounter | Rest {
    return this.Steps[idx]
  }

  public StepType(idx: number): string {
    return (this._steps[idx] as any).Name ? 'Encounter' : 'Rest'
  }

  public MoveStepUp(idx): void {
    const e = this._steps[idx]
    const up = this._steps[idx - 1]
    this._steps.splice(idx, 1, up)
    this._steps.splice(idx - 1, 1, e)
  }

  public MoveStepDown(idx): void {
    const e = this._steps[idx]
    const down = this._steps[idx + 1]
    this._steps.splice(idx, 1, down)
    this._steps.splice(idx + 1, 1, e)
  }

  public AddEncounter(e: Encounter): void {
    this._steps.push(e)
    this.save()
  }

  public AddRest(): void {
    const r = new Rest('', false)
    this._steps.push(r)
    this.save()
  }

  public RemoveStep(index: number): void {
    this._steps.splice(index, 1)
    this.save()
  }

  public static Serialize(mission: Mission): IMissionData {
    var s = []
    mission.Steps.forEach((e: any) => {
      if (e.Name) s.push(Encounter.Serialize(e as Encounter))
      else s.push(Rest.Serialize(e))
    })
    return {
      id: mission.ID,
      name: mission._name,
      note: mission._note,
      campaign: mission._campaign,
      labels: mission._labels,
      steps: s,
    }
  }

  public static Deserialize(data: IMissionData): Mission {
    return new Mission(data)
  }
}
