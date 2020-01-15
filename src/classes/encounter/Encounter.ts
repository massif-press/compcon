import uuid from 'uuid/v1'
import { Npc, EncounterSide } from '@/class'
import { store } from '@/store'
import { INpcData } from '../npc/interfaces'
import { Capacitor } from '@capacitor/core'
import { getImagePath, ImageTag } from '@/io/ImageManagement'

export interface IEncounterData {
  name: string
  location: string
  npcs: INpcData[]
  reinforcements: INpcData[]
  labels: string[]
  sitrep: Sitrep
  campaign?: string
  gmNotes?: string
  narrativeNotes?: string
  environment?: string
  environmentDetails?: string
  cloud_map?: string
  local_map?: string
  round: number
}

export class Encounter {
  private _id: string
  private _name: string
  private _location: string
  private _labels: string[]
  private _npcs: Npc[]
  private _reinforcements: Npc[]
  private _gm_notes: string
  private _campaign: string
  private _narrative_notes: string
  private _environment: string
  private _environment_details: string
  private _sitrep: Sitrep
  private _cloud_map: string
  private _local_map: string
  private _round: number

  public constructor(data: IEncounterData) {
    this._id = uuid()
    this._name = data.name
    this._location = data.location
    this._labels = data.labels
    this._campaign = data.campaign || ''
    this._gm_notes = data.gmNotes || ''
    this._narrative_notes = data.narrativeNotes || ''
    this._environment = data.environment || 'Nominal'
    this._environment_details = data.environmentDetails || ''
    this._cloud_map = data.cloud_map || ''
    this._local_map = data.local_map || ''
    this._sitrep = data.sitrep
    this._npcs = data.npcs.map(x => Npc.Deserialize(x))
    this._reinforcements = data.reinforcements.map(x => Npc.Deserialize(x))
    this._round = data.round || 0
  }

  private save(): void {
    store.dispatch('encounter/saveEncounterData')
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get Type(): string {
    return 'Encounter'
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.save()
  }

  public get Round(): number {
    return this._round
  }

  public set Round(val: number) {
    this._round = val
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
  public get GmNotes(): string {
    return this._gm_notes
  }

  public set GmNotes(val: string) {
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
    return this._npcs
  }

  public AddNpc(npc: Npc): void {
    this._npcs.push(npc)
  }

  public RemoveNpc(npc: Npc): void {
    const idx = this._npcs.findIndex(x => x.ID === npc.ID)
    if (idx > -1) this._npcs.splice(idx, 1)
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
    return this._reinforcements
  }

  public set Reinforcements(npcs: Npc[]) {
    this._reinforcements = npcs
    this.save()
  }

  public AddReinforcement(n: Npc): void {
    this._reinforcements.push(n)
    this.save()
  }

  public RemoveReinforcement(n: Npc): void {
    const idx = this._reinforcements.findIndex(x => x.ID === n.ID)
    if (idx > -1) this._reinforcements.splice(idx, 1)
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
      name: enc.Name,
      npcs: enc.Npcs.map(x => Npc.Serialize(x)),
      reinforcements: enc.Reinforcements.map(x => Npc.Serialize(x)),
      gmNotes: enc.GmNotes,
      labels: enc.Labels,
      campaign: enc.Campaign,
      narrativeNotes: enc.NarrativeNotes,
      location: enc.Location,
      environment: enc.Environment,
      environmentDetails: enc.EnvironmentDetails,
      sitrep: enc.Sitrep,
      cloud_map: enc.CloudMap,
      local_map: enc.LocalMap,
      round: enc.Round,
    }
  }

  public static Deserialize(data: IEncounterData): Encounter {
    return new Encounter(data)
  }
}
