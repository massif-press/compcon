import uuid from 'uuid/v4'
import { Npc, EncounterSide, MissionStepType } from '@/class'
import { EncounterStore, store } from '@/store'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { IMissionStep } from './IMissionStep'
import { ICloudSyncable } from '../components/cloud/ICloudSyncable'
import { CloudController, ICloudData, ISaveData, SaveController } from '../components'
import { getModule } from 'vuex-module-decorators'

class IEncounterData implements ICloudData, ISaveData {
  deleteTime: string
  expireTime: string
  lastUpdate_cloud: string
  resourceUri: string
  isDeleted: boolean
  id: string
  lastSync: string
  lastModified: string
  name: string
  location: string
  npcs: { id: string; side: EncounterSide }[]
  reinforcements: { id: string; side: EncounterSide }[]
  labels: string[]
  sitrep: Sitrep
  campaign?: string
  gmNotes?: string
  narrativeNotes?: string
  environment?: string
  environmentDetails?: string
  cloud_map?: string
  local_map?: string
}

class Encounter implements IMissionStep, ICloudSyncable {
  public readonly ItemType: string = 'encounter'
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
  private _location: string
  private _labels: string[]
  private _npcs: { id: string; side: EncounterSide }[]
  private _reinforcements: { id: string; side: EncounterSide }[]
  private _gm_notes: string
  private _campaign: string
  private _narrative_notes: string
  private _environment: string
  private _environment_details: string
  private _sitrep: Sitrep
  private _cloud_map: string
  private _local_map: string

  public constructor() {
    this._id = uuid()
    this.SaveController = new SaveController(this)
    this.CloudController = new CloudController(this)
    this._name = 'New Encounter'
    this._location = ''
    this._labels = []
    this._campaign = ''
    this._gm_notes = ''
    this._narrative_notes = ''
    this._environment = 'Nominal'
    this._environment_details = ''
    this._cloud_map = ''
    this._local_map = ''
    this._sitrep = store.getters.getItemCollection('Sitreps')[0]
    this._npcs = []
    this._reinforcements = []
    this.LastSync = new Date('1-1-1000').toJSON()
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
    this.SaveController.save()
  }

  public get StepType(): MissionStepType {
    return MissionStepType.Encounter
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.SaveController.save()
  }

  public get Sitrep(): Sitrep {
    return this._sitrep
  }

  public set Sitrep(val: Sitrep) {
    this._sitrep = val
    this.SaveController.save()
  }

  public get Location(): string {
    return this._location
  }

  public set Location(val: string) {
    this._location = val
    this.SaveController.save()
  }

  public get Environment(): string {
    return this._environment
  }

  public set Environment(val: string) {
    this._environment = val
    this.SaveController.save()
  }

  public get EnvironmentDetails(): string {
    return this._environment_details
  }

  public set EnvironmentDetails(val: string) {
    this._environment_details = val
    this.SaveController.save()
  }

  public get Note(): string {
    return this._gm_notes
  }

  public set Note(val: string) {
    this._gm_notes = val
    this.SaveController.save()
  }

  public get Labels(): string[] {
    return this._labels
  }

  public set Labels(val: string[]) {
    this._labels = val
    this.SaveController.save()
  }

  public get Campaign(): string {
    return this._campaign
  }

  public set Campaign(val: string) {
    this._campaign = val
    this.SaveController.save()
  }

  public get NarrativeNotes(): string {
    return this._narrative_notes
  }

  public set NarrativeNotes(val: string) {
    this._narrative_notes = val
    this.SaveController.save()
  }

  public Npcs(side: EncounterSide): Npc[] {
    const npcs = []
    this.npcIDBySide(side).forEach(id => {
      const n = store.getters['getNpcs'].find((x: Npc) => x.ID === id)
      if (n) npcs.push(n)
    })
    return npcs
  }

  private npcIDBySide(side: EncounterSide): string[] {
    return this._npcs.filter(x => x.side === side).map(x => x.id)
  }

  public AddNpc(npc: Npc, side: EncounterSide): void {
    this._npcs.push({ id: npc.ID, side: side })
    this.SaveController.save()
  }

  public RemoveNpc(npc: Npc, side: EncounterSide): void {
    const idx = this._npcs.findIndex(x => x.id === npc.ID && x.side === side)
    if (idx > -1) this._npcs.splice(idx, 1)
    this.SaveController.save()
  }

  public Reinforcements(side: EncounterSide): Npc[] {
    const npcs = []
    this.reinforcementIDBySide(side).forEach(id => {
      const n = store.getters['getNpcs'].find((x: Npc) => x.ID === id)
      if (n) npcs.push(n)
    })
    return npcs
  }

  private reinforcementIDBySide(side: EncounterSide): string[] {
    return this._reinforcements.filter(x => x.side === side).map(x => x.id)
  }

  public AddReinforcement(n: Npc, side: EncounterSide): void {
    this._reinforcements.push({ id: n.ID, side: side })
    this.SaveController.save()
  }

  public RemoveReinforcement(n: Npc, side: EncounterSide): void {
    const idx = this._reinforcements.findIndex(x => x.id === n.ID && x.side === side)
    if (idx > -1) this._reinforcements.splice(idx, 1)
    this.SaveController.save()
  }

  public MoveReinforcement(n: Npc): void {
    const r = this._reinforcements.find(x => x.id === n.ID)
    const idx = this._reinforcements.findIndex(x => x.id === n.ID)
    if (idx > -1) {
      this._reinforcements.splice(idx, 1)
      this._npcs.push({ id: r.id, side: r.side })
    }
  }

  public SetCloudImage(src: string): void {
    this._cloud_map = src
    this.SaveController.save()
  }

  public get CloudImage(): string {
    return this._cloud_map
  }

  public SetLocalImage(src: string): void {
    this._local_map = src
    this.SaveController.save()
  }

  public get LocalImage(): string {
    return this._local_map
  }

  public get Map(): string {
    if (this._cloud_map) return this._cloud_map
    else return getImagePath(ImageTag.Map, 'nodata.png')
  }

  public static Serialize(enc: Encounter): IEncounterData {
    const data = {
      id: enc.ID,
      name: enc.Name,
      npcs: enc._npcs,
      reinforcements: enc._reinforcements,
      gmNotes: enc.Note,
      labels: enc.Labels,
      campaign: enc.Campaign,
      narrativeNotes: enc.NarrativeNotes,
      location: enc.Location,
      environment: enc.Environment,
      environmentDetails: enc.EnvironmentDetails,
      sitrep: enc.Sitrep,
      cloud_map: enc.CloudImage,
      local_map: enc.LocalImage,
    }
    SaveController.Serialize(enc, data)
    CloudController.Serialize(enc, data)
    return data as IEncounterData
  }

  public Serialize(): IEncounterData {
    return Encounter.Serialize(this)
  }

  public static AddNew(data: IEncounterData, sync?: boolean): Encounter {
    const e = Encounter.Deserialize(data)
    if (sync) e.CloudController.MarkSync()
    getModule(EncounterStore, store).addEncounter(e)
    return e
  }

  public Update(data: IEncounterData, ignoreProps?: boolean): void {
    if (ignoreProps) {
      for (const key in data) {
        if (this.SyncIgnore.includes(key)) data[key] = null
      }
    }

    this._id = data.id
    this._name = data.name
    this._location = data.location
    this._labels = data.labels
    this._campaign = data.campaign
    this._gm_notes = data.gmNotes
    this._narrative_notes = data.narrativeNotes
    this._environment = data.environment
    this._environment_details = data.environmentDetails
    this._cloud_map = data.cloud_map
    this._local_map = data.local_map
    this._sitrep = data.sitrep
    this._npcs = data.npcs
    this._reinforcements = data.reinforcements
  }

  public static Deserialize(data: IEncounterData): Encounter {
    const e = new Encounter()
    try {
      e.Update(data)
      SaveController.Deserialize(e, data)
      CloudController.Deserialize(e, data)
      e.SaveController.SetLoaded()
      return e
    } catch (err) {
      console.error(err)
    }
  }
}

export { Encounter, IEncounterData }
