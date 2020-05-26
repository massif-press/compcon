import uuid from 'uuid/v4'
import { store } from '@/store'
import { Encounter, Rest } from '@/class'
import { IMissionStep } from './IMissionStep'

enum MissionStepType {
  Encounter = 'Encounter',
  Rest = 'Rest',
}

interface IMissionData {
  id?: string
  name: string
  note: string
  campaign: string
  labels: string[]
  step_ids: string[]
  rests: { id: string; note: string }[]
}

class Mission {
  private _id: string
  private _name: string
  private _note: string
  private _campaign: string
  private _labels: string[]
  private _rests: Rest[]
  private _step_ids: string[]

  public constructor() {
    this._id = uuid()
    this._name = 'New Mission'
    this._note = ''
    this._campaign = ''
    this._labels = []
    this._rests = []
    this._step_ids = []
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
    const ids = this._step_ids.filter(x => !this.Rests.map(r => r.ID).some(y => y === x))
    const enc = store.getters['encounter/getEncounters']
    return ids.map(x => enc.find(y => y.ID === x))
  }

  public get Rests(): Rest[] {
    return this._rests
  }

  public ValidateSteps(): void {
    const ids = store.getters['encounter/getEncounters']
      .map((x: Encounter) => x.ID)
      .concat(this._rests.map(x => x.ID))
    this._step_ids = this._step_ids.filter(x => ids.some(y => y === x))
  }

  public get Steps(): IMissionStep[] {
    return this._step_ids.map(x => this.Step(x))
  }

  public Step(id: string): IMissionStep {
    const r = this._rests.find(x => x.ID === id)
    if (r) return r
    const enc = store.getters['encounter/getEncounters']
    const rIdx = this._step_ids.indexOf(id)
    if (rIdx == -1) this.RemoveStep(rIdx)
    return enc.find(x => x.ID === id)
  }

  public MoveStepUp(idx): void {
    const e = this._step_ids[idx]
    const up = this._step_ids[idx - 1]
    this._step_ids.splice(idx, 1, up)
    this._step_ids.splice(idx - 1, 1, e)
    this.save()
  }

  public MoveStepDown(idx): void {
    const e = this._step_ids[idx]
    const down = this._step_ids[idx + 1]
    this._step_ids.splice(idx, 1, down)
    this._step_ids.splice(idx + 1, 1, e)
    this.save()
  }

  public AddEncounter(e: Encounter): void {
    this._step_ids.push(e.ID)
    this.save()
  }

  public AddRest(): void {
    const r = new Rest()
    this._rests.push(r)
    this._step_ids.push(r.ID)
    this.save()
  }

  public RemoveStep(index: number): void {
    this._step_ids.splice(index, 1)
    this.save()
  }

  public static Serialize(mission: Mission): IMissionData {
    return {
      id: mission.ID,
      name: mission._name,
      note: mission._note,
      campaign: mission._campaign,
      labels: mission._labels,
      step_ids: mission._step_ids,
      rests: mission.Rests.map(x => ({ id: x.ID, note: x.Note })),
    }
  }

  public static Deserialize(data: IMissionData): Mission {
    const m = new Mission()
    m._id = data.id
    m._name = data.name
    m._note = data.note
    m._labels = data.labels
    m._campaign = data.campaign || ''
    m._rests = data.rests.map(x => Rest.Deserialize(x))
    m._step_ids = data.step_ids
    return m
  }
}

export { IMissionData, MissionStepType, Mission }
