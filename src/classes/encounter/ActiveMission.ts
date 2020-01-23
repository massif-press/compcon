import uuid from 'uuid/v4'
import { store } from '@/store'
import { Mission, Pilot, Npc, MissionStepType, Encounter } from '@/class'
import { IMissionData, INpcData } from '@/interface'
import { IMissionStep } from './IMissionStep'

export interface IActiveMissionData {
  mission: IMissionData
  pilotIDs: string[]
  activeNpcs: INpcData[]
  step: number
  round: number
  start: string
  end: string
  note: string
  result: string
}

export class ActiveMission {
  private _id: string
  private _mission: Mission
  private _step: number
  private _round: number
  private _pilotIDs: string[]
  private _activeNpcs: Npc[]
  private _start_date: string
  private _end_date: string
  private _note: string
  private _result: string

  public constructor(m: Mission, pilots: Pilot[]) {
    this._id = uuid()
    this._mission = m
    this._pilotIDs = pilots.map(x => x.ID)
    this._activeNpcs = []
    this._step = 0
    this._round = 0
    this._start_date = new Date().toISOString().slice(0, 10)
    this._note = ''
    this._result = ''
    this.spawnNpcs()
    console.log(this._activeNpcs)
  }

  private save(): void {
    store.dispatch('mission/saveActiveMissionData')
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
    this.save()
  }

  public get IsComplete(): boolean {
    return !!this.EndDate
  }

  public get Mission(): Mission {
    return this._mission
  }

  public get Campaign(): string {
    return this._mission.Campaign
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
    this.save()
  }

  public get Encounter(): IMissionStep {
    return this.Mission.Steps[this.Step]
  }

  public get ActiveNpcs(): Npc[] {
    return this._activeNpcs
  }

  public set ActiveNpcs(npcs: Npc[]) {
    this._activeNpcs = npcs
    this.save()
  }

  private spawnNpcs(): void {
    if (this.Encounter.StepType === MissionStepType.Rest) return
    const enc = this.Encounter as Encounter
    enc.Npcs.forEach(n => {
      const nn = Npc.Deserialize(Npc.Serialize(n))
      nn.RenewID()
      nn.Active = true
      this._activeNpcs.push(nn)
    })
    this.save()
  }

  public AddActiveNpc(n: Npc): void {
    const nn = Npc.Deserialize(Npc.Serialize(n))
    nn.RenewID()
    nn.Active = true
    this.ActiveNpcs.push(nn)
  }

  public RemoveActiveNpc(n: Npc): void {
    const idx = this.ActiveNpcs.findIndex(x => x.ID === n.ID)
    if (idx > -1) this.ActiveNpcs.splice(idx, 1)
  }

  public get Round(): number {
    return this._round
  }

  public set Round(val: number) {
    this._round = val
    this.save()
  }

  public EndStep(): void {
    if (this._step === this._mission.Steps.length - 1) {
      this.Complete()
    } else {
      this._step += 1
      this._round = 0
      this.spawnNpcs()
    }
  }

  public Complete(): void {
    this._end_date = new Date().toISOString().slice(0, 10)
    this._result = 'Victory'
    this.save()
  }

  public get Pilots(): Pilot[] {
    return store.getters['getPilots'].filter((x: Pilot) => this._pilotIDs.some(y => y === x.ID))
  }

  public set Pilots(val: Pilot[]) {
    this._pilotIDs = val.map(x => x.ID)
  }

  public AddPilot(p: Pilot): void {
    this._pilotIDs.push(p.ID)
  }

  public RemovePilot(p: Pilot): void {
    const idx = this._pilotIDs.indexOf(p.ID)
    if (idx > -1) this._pilotIDs.splice(idx, 1)
  }

  public get Npcs(): Npc[] {
    return this._mission.Encounters.flatMap(x => x.Npcs)
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
  }

  public get Result(): string {
    return this._result
  }

  public set Result(val: string) {
    this._result = val
  }

  public CurrentStep(): IMissionStep {
    return this._mission.Steps[this._step]
  }

  public static Serialize(m: ActiveMission): IActiveMissionData {
    return {
      mission: Mission.Serialize(m._mission),
      pilotIDs: m.Pilots.map(x => x.ID),
      step: m.Step,
      round: m.Round,
      activeNpcs: m.ActiveNpcs.map(x => Npc.Serialize(x)),
      start: m.StartDate,
      end: m.EndDate,
      note: m.Note,
      result: m.Result,
    }
  }

  public static Deserialize(data: IActiveMissionData): ActiveMission {
    const m = new ActiveMission(Mission.Deserialize(data.mission), [])
    m.Round = data.round
    m.Step = data.step
    m.ActiveNpcs = data.activeNpcs.map(x => Npc.Deserialize(x))
    m._pilotIDs = data.pilotIDs
    m._start_date = data.start
    m._end_date = data.end
    m._note = data.note
    m._result = data.result
    return m
  }
}
