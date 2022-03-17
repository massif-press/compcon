import uuid from 'uuid/v4'
import { MissionStore, store } from '@/store'
import { Mission, Pilot, Npc, MissionStepType, Encounter } from '@/class'
import { IMissionData, INpcData } from '@/interface'
import { IMissionStep } from './IMissionStep'
import { EncounterSide } from '../enums'
import { ICloudSyncable } from '../components/cloud/ICloudSyncable'
import { CloudController, ICloudData, ISaveData, SaveController } from '../components'
import { getModule } from 'vuex-module-decorators'

class IActiveMissionData implements ICloudData, ISaveData {
  deleteTime: string
  isDeleted: boolean
  lastUpdate_cloud: string
  resourceUri: string
  id: string
  lastSync: string
  lastModified: string
  mission: IMissionData
  pilotIDs: string[]
  activeNpcs: INpcData[]
  activeReinforcements: INpcData[]
  step: number
  round: number
  start: string
  end: string
  note: string
  result: string
}

class ActiveMission implements ICloudSyncable {
  public readonly ItemType: string = 'mission'
  public readonly TypePrefix: string = 'activemission'
  public readonly SyncIgnore: string[] = ['group', 'sortIndex', 'isLocal']
  public SaveController: SaveController
  public CloudController: CloudController
  public IsLocallyOwned: boolean
  public LastSync: string
  public CloudID: string
  public CloudOwnerID: string
  public IsDirty: boolean
  public IsDeleted: boolean
  public LastModified: string

  private _id: string
  private _mission: Mission
  private _step: number
  private _round: number
  private _pilotIDs: string[]
  private _activeNpcs: Npc[]
  private _activeReinforcements: Npc[]
  private _start_date: string
  private _end_date: string
  private _note: string
  private _result: string

  public constructor(m: Mission, pilots: Pilot[]) {
    this._id = uuid()
    this.SaveController = new SaveController(this)
    this.CloudController = new CloudController(this)
    this._mission = m
    this._pilotIDs = pilots.map(x => x.ID)
    this._activeNpcs = []
    this._activeReinforcements = []
    this._step = 0
    this._round = 1
    this._start_date = new Date().toISOString().slice(0, 10)
    this._note = ''
    this._result = ''
    this.spawnNpcs()
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this.Mission.Name
  }

  public RenewID(): void {
    this._id = uuid()
    this.SaveController.save()
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
    this.SaveController.save()
  }

  public get Encounter(): IMissionStep {
    return this.Mission.Steps[this.Step]
  }

  public get ActiveNpcs(): Npc[] {
    return this._activeNpcs
  }

  public set ActiveNpcs(npcs: Npc[]) {
    this._activeNpcs = npcs
    this.SaveController.save()
  }

  private instantiateNpc(n: Npc, s: EncounterSide): Npc {
    const nn = Npc.Deserialize(Npc.Serialize(n))
    nn.RenewID()
    nn.Active = true
    nn.Side = s
    const aCount = this._activeNpcs
      .map(x => x.Name.replace(/ #[\d]*/, ''))
      .filter(x => x === nn.Name).length
    const rCount = this._activeReinforcements
      .map(x => x.Name.replace(/ #[\d]*/, ''))
      .filter(x => x === nn.Name).length
    nn.Name += ` #${aCount + rCount + 1}`
    return nn
  }

  private spawnNpcs(): void {
    if (this.Encounter.StepType === MissionStepType.Rest) return
    this._activeNpcs.splice(0, this._activeNpcs.length)
    const enc = this.Encounter as Encounter
    const sides = [EncounterSide.Ally, EncounterSide.Enemy, EncounterSide.Neutral]
    sides.forEach(s => {
      enc.Npcs(s).forEach(n => {
        this._activeNpcs.push(this.instantiateNpc(n, s))
      })
      enc.Reinforcements(s).forEach(n => {
        this._activeReinforcements.push(this.instantiateNpc(n, s))
      })
    })
    this.SaveController.save()
  }

  public AddActiveNpc(n: Npc): void {
    const nn = Npc.Deserialize(Npc.Serialize(n))
    nn.RenewID()
    nn.Active = true
    const count = this._activeNpcs
      .map(x => x.Name.replace(/ #[\d]*/, ''))
      .filter(x => x === nn.Name).length
    nn.Name += ` #${count}`
    this.ActiveNpcs.push(nn)
  }

  public RemoveActiveNpc(n: Npc): void {
    const idx = this.ActiveNpcs.findIndex(x => x.ID === n.ID)
    if (idx > -1) this.ActiveNpcs.splice(idx, 1)
  }

  public get ActiveReinforcements(): Npc[] {
    return this._activeReinforcements
  }

  public set ActiveReinforcements(npcs: Npc[]) {
    this._activeReinforcements = npcs
    this.SaveController.save()
  }

  public AddActiveReinforcement(n: Npc, s: EncounterSide): void {
    const nn = Npc.Deserialize(Npc.Serialize(n))
    nn.RenewID()
    nn.Active = true
    nn.Side = s
    this.ActiveReinforcements.push(nn)
  }

  public RemoveActiveReinforcement(n: Npc): void {
    const idx = this.ActiveReinforcements.findIndex(x => x.ID === n.ID)
    if (idx > -1) this.ActiveReinforcements.splice(idx, 1)
  }

  public MoveReinforcement(n: Npc): void {
    const r = this._activeReinforcements.find(x => x.ID === n.ID)
    const idx = this._activeReinforcements.findIndex(x => x.ID === n.ID)
    if (idx > -1) {
      this._activeReinforcements.splice(idx, 1)
      this._activeNpcs.push(r)
    }
  }

  public get Round(): number {
    return this._round
  }

  public set Round(val: number) {
    this._round = val
    this.SaveController.save()
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
    this.SaveController.save()
  }

  public get Pilots(): Pilot[] {
    return store.getters['getPilots'].filter((x: Pilot) => this._pilotIDs.some(y => y === x.ID))
  }

  public set Pilots(val: Pilot[]) {
    this._pilotIDs = val.map(x => x.ID)
    this.SaveController.save()
  }

  public AddPilot(p: Pilot): void {
    this._pilotIDs.push(p.ID)
    this.SaveController.save()
  }

  public RemovePilot(p: Pilot): void {
    const idx = this._pilotIDs.indexOf(p.ID)
    if (idx > -1) this._pilotIDs.splice(idx, 1)
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.SaveController.save()
  }

  public get Result(): string {
    return this._result
  }

  public set Result(val: string) {
    this._result = val
    this.SaveController.save()
  }

  public CurrentStep(): IMissionStep {
    return this._mission.Steps[this._step]
  }

  public static Serialize(m: ActiveMission): IActiveMissionData {
    const data = {
      id: m.ID,
      mission: Mission.Serialize(m._mission),
      pilotIDs: m.Pilots.map(x => x.ID),
      step: m.Step,
      round: m.Round,
      activeNpcs: m.ActiveNpcs.map(x => Npc.Serialize(x)),
      activeReinforcements: m.ActiveReinforcements.map(x => Npc.Serialize(x)),
      start: m.StartDate,
      end: m.EndDate,
      note: m.Note,
      result: m.Result,
    }
    SaveController.Serialize(m, data)
    CloudController.Serialize(m, data)
    return data as IActiveMissionData
  }

  public Serialize(): IActiveMissionData {
    return ActiveMission.Serialize(this)
  }

  public static AddNew(data: IActiveMissionData, sync?: boolean): ActiveMission {
    const m = ActiveMission.Deserialize(data)
    if (sync) m.CloudController.MarkSync()
    getModule(MissionStore, store).addActiveMission(m)
    return m
  }

  public Update(data: IActiveMissionData, ignoreProps?: boolean): void {
    if (ignoreProps) {
      for (const key in data) {
        if (this.SyncIgnore.includes(key)) data[key] = null
      }
    }
    this._id = data.id || uuid()
    this.Round = data.round
    this.Step = data.step
    this.ActiveNpcs = data.activeNpcs.map(x => Npc.Deserialize(x))
    this.ActiveNpcs.forEach(n => {
      n.Active = true
    })
    this.ActiveReinforcements = data.activeReinforcements.map(x => Npc.Deserialize(x))
    this.ActiveReinforcements.forEach(n => {
      n.Active = true
    })
    this._pilotIDs = data.pilotIDs
    this._start_date = data.start
    this._end_date = data.end
    this._note = data.note
    this._result = data.result
  }

  public static Deserialize(data: IActiveMissionData): ActiveMission {
    const m = new ActiveMission(Mission.Deserialize(data.mission), [])
    try {
      m.Update(data)
      SaveController.Deserialize(m, data)
      CloudController.Deserialize(m, data)
      m.SaveController.SetLoaded()
      return m
    } catch (err) {
      console.error(err)
    }
  }
}

export { IActiveMissionData, ActiveMission }
