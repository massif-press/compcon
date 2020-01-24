import uuid from 'uuid/v4'
import { Npc, EncounterSide, MissionStepType } from '@/class'
import { store } from '@/store'
import { Capacitor } from '@capacitor/core'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { IMissionStep } from './IMissionStep'

export interface IEncounterData {
  id: string
  name: string
  location: string
  npc_ids: string[]
  reinforcement_ids: string[]
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

export class Encounter implements IMissionStep {
  private _id: string
  private _name: string
  private _location: string
  private _labels: string[]
  private _npc_ids: string[]
  private _reinforcement_ids: string[]
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
    this._npc_ids = []
    this._reinforcement_ids = []
  }

  private save(): void {
    store.dispatch('encounter/saveEncounterData')
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
    this.save()
  }

  public get StepType(): MissionStepType {
    return MissionStepType.Encounter
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.save()
  }

  public get Sitrep(): Sitrep {
    return this._sitrep
  }

  public set Sitrep(val: Sitrep) {
    this._sitrep = val
    this.save()
  }

  public get Location(): string {
    return this._location
  }

  public set Location(val: string) {
    this._location = val
    this.save()
  }

  public get Environment(): string {
    return this._environment
  }

  public set Environment(val: string) {
    this._environment = val
    this.save()
  }

  public get EnvironmentDetails(): string {
    return this._environment_details
  }

  public set EnvironmentDetails(val: string) {
    this._environment_details = val
    this.save()
  }

  public get Note(): string {
    return this._gm_notes
  }

  public set Note(val: string) {
    this._gm_notes = val
    this.save()
  }

  public get Labels(): string[] {
    return this._labels
  }

  public set Labels(val: string[]) {
    this._labels = val
    this.save()
  }

  public get Campaign(): string {
    return this._campaign
  }

  public set Campaign(val: string) {
    this._campaign = val
    this.save()
  }

  public get NarrativeNotes(): string {
    return this._narrative_notes
  }

  public set NarrativeNotes(val: string) {
    this._narrative_notes = val
    this.save()
  }

  public get Npcs(): Npc[] {
    const npcs = []
    this._npc_ids.forEach(id => {
      const n = store.getters['npc/getNpcs'].find(x => x.ID === id)
      if (n) npcs.push(n)
    })
    return npcs
  }

  public AddNpc(npc: Npc): void {
    this._npc_ids.push(npc.ID)
    this.save()
  }

  public RemoveNpc(npc: Npc): void {
    const idx = this._npc_ids.indexOf(npc.ID)
    if (idx > -1) this._npc_ids.splice(idx, 1)
    this.save()
  }

  public get Power(): number {
    const enemy = this.Npcs.filter(x => x.Side === EncounterSide.Enemy).reduce(
      (a, b) => +a + +b.Power,
      0
    )
    const ally = this.Npcs.filter(x => x.Side === EncounterSide.Ally).reduce(
      (a, b) => +a + +b.Power,
      0
    )
    return enemy - ally
  }

  public get Reinforcements(): Npc[] {
    return store.getters['npc/getNpcs'].filter(x => this._reinforcement_ids.some(y => y === x.ID))
  }

  public set Reinforcements(npcs: Npc[]) {
    this._reinforcement_ids = npcs.map(x => x.ID)
    this.save()
  }

  public AddReinforcement(n: Npc): void {
    this._reinforcement_ids.push(n.ID)
    this.save()
  }

  public RemoveReinforcement(n: Npc): void {
    const idx = this._reinforcement_ids.indexOf(n.ID)
    if (idx > -1) this._reinforcement_ids.splice(idx, 1)
    this.save()
  }

  public MoveReinforcement(n: Npc): void {
    const idx = this.Reinforcements.findIndex(x => x.ID === n.ID)
    if (idx > -1) {
      this.Reinforcements.splice(idx, 1)
      this.Npcs.push(n)
    }
  }

  public SetCloudMap(src: string): void {
    this._cloud_map = src
    this.save()
  }

  public get CloudMap(): string {
    return this._cloud_map
  }

  public SetLocalMap(src: string): void {
    this._local_map = src
    this.save()
  }

  public get LocalMap(): string {
    return this._local_map
  }

  public get Map(): string {
    if (this._cloud_map) return this._cloud_map
    else if (Capacitor.platform !== 'web' && this._local_map)
      return getImagePath(ImageTag.Map, this._local_map)
    else return getImagePath(ImageTag.Frame, 'nodata.png', true)
  }

  public static Serialize(enc: Encounter): IEncounterData {
    return {
      id: enc.ID,
      name: enc.Name,
      npc_ids: enc._npc_ids,
      reinforcement_ids: enc._reinforcement_ids,
      gmNotes: enc.Note,
      labels: enc.Labels,
      campaign: enc.Campaign,
      narrativeNotes: enc.NarrativeNotes,
      location: enc.Location,
      environment: enc.Environment,
      environmentDetails: enc.EnvironmentDetails,
      sitrep: enc.Sitrep,
      cloud_map: enc.CloudMap,
      local_map: enc.LocalMap,
    }
  }

  public static Deserialize(data: IEncounterData): Encounter {
    const e = new Encounter()
    e._id = data.id
    e._name = data.name
    e._location = data.location
    e._labels = data.labels
    e._campaign = data.campaign
    e._gm_notes = data.gmNotes
    e._narrative_notes = data.narrativeNotes
    e._environment = data.environment
    e._environment_details = data.environmentDetails
    e._cloud_map = data.cloud_map
    e._local_map = data.local_map
    e._sitrep = data.sitrep
    e._npc_ids = data.npc_ids
    e._reinforcement_ids = data.reinforcement_ids
    return e
  }
}
