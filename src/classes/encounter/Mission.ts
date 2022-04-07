import uuid from 'uuid/v4'
import { MissionStore, store } from '@/store'
import { Encounter, Rest } from '@/class'
import { IMissionStep } from './IMissionStep'
import { ICloudSyncable } from '../components/cloud/ICloudSyncable'
import { CloudController, ICloudData, ISaveData, SaveController } from '../components'
import { getModule } from 'vuex-module-decorators'

enum MissionStepType {
  Encounter = 'Encounter',
  Rest = 'Rest',
}

class IMissionData implements ICloudData, ISaveData {
  deleteTime: string
  expireTime: string
  lastUpdate_cloud: string
  resourceUri: string
  isDeleted: boolean
  id?: string
  cloudID: string
  cloudOwnerID: string
  isLocal: boolean
  lastSync: string
  lastModified: string
  name: string
  note: string
  campaign: string
  labels: string[]
  step_ids: string[]
  rests: { id: string; note: string }[]
}

class Mission implements ICloudSyncable {
  public readonly ItemType: string = 'mission'
  public readonly SyncIgnore: string[] = ['group', 'sortIndex', 'isLocal']
  public CloudController: CloudController
  public SaveController: SaveController
  public IsLocallyOwned: boolean
  public LastSync: string
  public CloudID: string
  public CloudOwnerID: string
  public IsDirty: boolean
  public LastModified: string

  private _id: string
  private _name: string
  private _note: string
  private _campaign: string
  private _labels: string[]
  private _rests: Rest[]
  private _step_ids: string[]

  public constructor() {
    this._id = uuid()
    this.SaveController = new SaveController(this)
    this.CloudController = new CloudController(this)
    this._name = 'New Mission'
    this._note = ''
    this._campaign = ''
    this._labels = []
    this._rests = []
    this._step_ids = []
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
    this.SaveController.save()
  }

  public get Campaign(): string {
    return this._campaign
  }

  public set Campaign(val: string) {
    this._campaign = val
    this.SaveController.save()
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.SaveController.save()
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.SaveController.save()
  }

  public get Labels(): string[] {
    return this._labels
  }

  public set Labels(val: string[]) {
    this._labels = val
    this.SaveController.save()
  }

  public get Encounters(): Encounter[] {
    const ids = this._step_ids.filter(x => !this.Rests.map(r => r.ID).some(y => y === x))
    const enc = store.getters['getEncounters']
    return ids.map(x => enc.find(y => y.ID === x))
  }

  public get Rests(): Rest[] {
    return this._rests
  }

  public ValidateSteps(): void {
    const ids = store.getters['getEncounters']
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
    const enc = store.getters['getEncounters']
    const rIdx = this._step_ids.indexOf(id)
    if (rIdx == -1) this.RemoveStep(rIdx)
    return enc.find(x => x.ID === id)
  }

  public MoveStepUp(idx): void {
    const e = this._step_ids[idx]
    const up = this._step_ids[idx - 1]
    this._step_ids.splice(idx, 1, up)
    this._step_ids.splice(idx - 1, 1, e)
    this.SaveController.save()
  }

  public MoveStepDown(idx): void {
    const e = this._step_ids[idx]
    const down = this._step_ids[idx + 1]
    this._step_ids.splice(idx, 1, down)
    this._step_ids.splice(idx + 1, 1, e)
    this.SaveController.save()
  }

  public AddEncounter(e: Encounter): void {
    this._step_ids.push(e.ID)
    this.SaveController.save()
  }

  public AddRest(): void {
    const r = new Rest()
    this._rests.push(r)
    this._step_ids.push(r.ID)
    this.SaveController.save()
  }

  public RemoveStep(index: number): void {
    this._step_ids.splice(index, 1)
    this.SaveController.save()
  }

  public static Serialize(mission: Mission): IMissionData {
    const data = {
      id: mission.ID,
      isLocal: mission.IsLocallyOwned,
      cloudID: mission.CloudID,
      cloudOwnerID: mission.CloudOwnerID,
      lastSync: mission.LastSync,
      lastModified: mission.LastModified || '',
      name: mission._name,
      note: mission._note,
      campaign: mission._campaign,
      labels: mission._labels,
      step_ids: mission._step_ids,
      rests: mission.Rests.map(x => ({ id: x.ID, note: x.Note })),
    }
    SaveController.Serialize(mission, data)
    CloudController.Serialize(mission, data)
    return data as IMissionData
  }

  public Serialize(): IMissionData {
    return Mission.Serialize(this)
  }

  public static AddNew(data: IMissionData, sync?: boolean): Mission {
    const m = Mission.Deserialize(data)
    if (sync) m.CloudController.MarkSync()
    getModule(MissionStore, store).addMission(m)
    return m
  }

  public Update(data: IMissionData, ignoreProps?: boolean): void {
    if (ignoreProps) {
      for (const key in data) {
        if (this.SyncIgnore.includes(key)) data[key] = null
      }
    }

    this._id = data.id
    this.IsLocallyOwned = data.isLocal || true
    this.CloudID = data.cloudID || ''
    this.CloudOwnerID = data.cloudOwnerID || ''
    this.LastSync = data.lastSync || ''
    this.LastModified = data.lastModified || ''

    this._name = data.name
    this._note = data.note
    this._labels = data.labels
    this._campaign = data.campaign || ''
    this._rests = data.rests ? data.rests.map(x => Rest.Deserialize(x)) : []
    this._step_ids = data.step_ids
  }

  public static Deserialize(data: IMissionData): Mission {
    const m = new Mission()
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

export { IMissionData, MissionStepType, Mission }
