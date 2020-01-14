import uuid from 'uuid/v1'
import { store } from '@/store'
import { Mission, Pilot, Encounter, Rest } from '@/class'
import { IMissionData } from '@/interface'

export interface IActiveMissionData {
  mission: IMissionData
  pilots: IPilotData[]
  step: number
  round: number
  start: string
  end: string
}

export class ActiveMission {
  private _id: string
  private _mission: Mission
  private _step: number
  private _round: number
  private _pilots: Pilot[]
  private _start_date: string
  private _end_date: string

  public constructor(m: Mission, pilots: Pilot[]) {
    this._id = uuid()
    this._mission = m
    this._pilots = pilots
    this._step = 0
    this._round = 0
    this._start_date = new Date().toISOString().slice(0, 10)
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

  public get Mission(): Mission {
    return this._mission
  }

  public get StartDate(): string {
    return this._start_date
  }

  public get EndDate(): string {
    return this._end_date
  }

  public get Step(): number {
    return this._step
  }

  public set Step(val: number) {
    this._step = val
  }

  public get Round(): number {
    return this._round
  }

  public set Round(val: number) {
    this._round = val
  }

  public get Pilots(): Pilot[] {
    return this._pilots
  }

  public set Pilots(val: Pilot[]) {
    this._pilots = val
  }

  public CurrentStep(): Encounter | Rest {
    return this._mission.Steps[this._step]
  }

  public static Serialize(m: ActiveMission): IActiveMissionData {
    return {
      mission: Mission.Serialize(m._mission),
      pilots: m.Pilots.map(x => Pilot.Serialize(x)),
      step: m.Step,
      round: m.Round,
      start: m.StartDate,
      end: m.EndDate,
    }
  }

  public static Deserialize(data: IActiveMissionData): ActiveMission {
    const m = new ActiveMission(
      Mission.Deserialize(data.mission),
      data.pilots.map(x => Pilot.Deserialize(x))
    )
    m.Round = data.round
    m.Step = data.step
    m._start_date = data.start
    m._end_date = data.end
    return m
  }
}
