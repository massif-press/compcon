import { Npc, NpcWave } from '@/class'
import { INpcWaveData } from '@/interface'
import { store } from '@/store'

interface IEncounterData {
  name: string
  waves: INpcWaveData[]
  reinforcements: string[]
  gmNotes?: string
  narrativeNotes?: string
  objectives?: string
  conditions?: string
}

class Encounter {
  private _name: string
  private _waves: NpcWave[]
  private _reinforcements: Npc[]
  private _gm_notes: string
  private _narrative_notes: string
  private _objectives: string
  private _conditions: string

  public constructor(data: IEncounterData) {
    this._name = data.name
    this._gm_notes = data.gmNotes || ''
    this._narrative_notes = data.narrativeNotes || ''
    this._objectives = data.objectives || ''
    this._conditions = data.conditions || ''
    this._waves = data.waves.map(w => NpcWave.Deserialize(w))
    // load reinforcements by id
  }

  private save(): void {
    store.dispatch('saveData')
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.save()
  }

  public get GmNotes(): string {
    return this._gm_notes
  }

  public set GmNotes(val: string) {
    this._gm_notes = val
    this.save()
  }

  public get NarrativeNotes(): string {
    return this._narrative_notes
  }

  public set NarrativeNotes(val: string) {
    this._narrative_notes = val
    this.save()
  }

  public get Objectives(): string {
    return this._objectives
  }

  public set Objectives(val: string) {
    this._objectives = val
    this.save()
  }

  public get Conditions(): string {
    return this._conditions
  }

  public set Conditions(val: string) {
    this._conditions = val
    this.save()
  }

  public get Waves(): NpcWave[] {
    return this._waves
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

  public static Serialize(enc: Encounter): IEncounterData {
    return {
      name: enc.Name,
      waves: enc.Waves.map(x => NpcWave.Serialize(x)),
      reinforcements: enc.Reinforcements.map(x => x.ID),
      gmNotes: enc.GmNotes,
      narrativeNotes: enc.NarrativeNotes,
    }
  }

  public static Deserialize(data: IEncounterData): Encounter {
    return new Encounter(data)
  }
}

export { IEncounterData, Encounter }
