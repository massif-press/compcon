import uuid from 'uuid/v4'
import { Npc, EncounterSide, MissionStepType } from '@/class'
import { store } from '@/store'
import { Capacitor } from '@capacitor/core'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import { IMissionStep } from './IMissionStep'

interface IEncounterData {
  id: string
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

class Encounter implements IMissionStep {
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

  public Npcs(side: EncounterSide): Npc[] {
    const npcs = []
    this.npcIDBySide(side).forEach(id => {
      const n = store.getters['npc/getNpcs'].find((x: Npc) => x.ID === id)
      if (n) npcs.push(n)
    })
    return npcs
  }

  private npcIDBySide(side: EncounterSide): string[] {
    return this._npcs.filter(x => x.side === side).map(x => x.id)
  }

  public AddNpc(npc: Npc, side: EncounterSide): void {
    this._npcs.push({ id: npc.ID, side: side })
    this.save()
  }

  public RemoveNpc(npc: Npc, side: EncounterSide): void {
    const idx = this._npcs.findIndex(x => x.id === npc.ID && x.side === side)
    if (idx > -1) this._npcs.splice(idx, 1)
    this.save()
  }

  public get Power(): number {
    const enemy = this.Npcs(EncounterSide.Enemy)
      .concat(this.Reinforcements(EncounterSide.Enemy))
      .reduce((a, b) => +a + +b.Power, 0)
    const ally = this.Npcs(EncounterSide.Ally)
      .concat(this.Reinforcements(EncounterSide.Enemy))
      .reduce((a, b) => +a + +b.Power, 0)
    return enemy - ally
  }

  public Reinforcements(side: EncounterSide): Npc[] {
    const npcs = []
    this.reinforcementIDBySide(side).forEach(id => {
      const n = store.getters['npc/getNpcs'].find((x: Npc) => x.ID === id)
      if (n) npcs.push(n)
    })
    return npcs
  }

  private reinforcementIDBySide(side: EncounterSide): string[] {
    return this._reinforcements.filter(x => x.side === side).map(x => x.id)
  }

  public AddReinforcement(n: Npc, side: EncounterSide): void {
    this._reinforcements.push({ id: n.ID, side: side })
    this.save()
  }

  public RemoveReinforcement(n: Npc, side: EncounterSide): void {
    const idx = this._reinforcements.findIndex(x => x.id === n.ID && x.side === side)
    if (idx > -1) this._reinforcements.splice(idx, 1)
    this.save()
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
    this.save()
  }

  public get CloudImage(): string {
    return this._cloud_map
  }

  public SetLocalImage(src: string): void {
    this._local_map = src
    this.save()
  }

  public get LocalImage(): string {
    return this._local_map
  }

  public get Map(): string {
    if (this._cloud_map) return this._cloud_map
    else if (Capacitor.platform !== 'web' && this._local_map)
      return getImagePath(ImageTag.Map, this._local_map)
    else return getImagePath(ImageTag.Map, 'nodata.png', true)
  }

  public static Serialize(enc: Encounter): IEncounterData {
    return {
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
    e._npcs = data.npcs
    e._reinforcements = data.reinforcements
    return e
  }
}

export { Encounter, IEncounterData }
