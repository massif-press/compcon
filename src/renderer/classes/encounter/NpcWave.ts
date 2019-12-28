import { Npc } from '@/class'
import { store } from '@/store'
import { INpcData } from '../npc'

interface INpcWaveData {
  round: number
  npcs: INpcData[]
}

class NpcWave {
  private _round: number
  private _npcs: Npc[]

  public constructor(data: INpcWaveData) {
    this._round = data.round
    this._npcs = data.npcs.map(x => Npc.Deserialize(x))
  }

  private save(): void {
    store.dispatch('saveData')
  }

  public get Round(): number {
    return this._round
  }

  public set Round(val: number) {
    this._round = val
  }

  public get NPCs(): Npc[] {
    return this._npcs
  }

  public set NPCs(npcs: Npc[]) {
    this._npcs = npcs
    this.save()
  }

  public AddNpc(n: Npc): void {
    this._npcs.push(n)
    this.save()
  }

  public RemoveNpc(n: Npc): void {
    const idx = this._npcs.findIndex(x => x.ID === n.ID)
    if (idx > -1) this._npcs.splice(idx, 1)
    this.save()
  }

  public static Serialize(wave: NpcWave): INpcWaveData {
    return {
      round: wave.Round,
      npcs: wave.NPCs.map(x => Npc.Serialize(x)),
    }
  }

  public static Deserialize(data: INpcWaveData): NpcWave {
    return new NpcWave(data)
  }
}

export { INpcWaveData, NpcWave }
