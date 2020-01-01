/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Npc } from '@/class'
import { INpcData } from '@/interface'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_NPC = 'ADD_NPC'
export const DELETE_NPC = 'DELETE_NPC'
export const CLONE_NPC = 'CLONE_NPC'
export const LOAD_NPCS = 'LOAD_NPCS'

async function saveNpcData(npcs: Npc[]) {
  const serialized = npcs.map(x => Npc.Serialize(x))
  await saveData('npcs.json', serialized)
}

@Module({
  name: 'npc',
  namespaced: true,
})
export class NpcStore extends VuexModule {
  Npcs: Npc[] = []

  @Mutation
  private [LOAD_NPCS](payload: INpcData[]): void {
    this.Npcs = [...payload.map(x => Npc.Deserialize(x))]
    saveNpcData(this.Npcs)
  }

  // @Mutation
  // edit(newNpc: Npc) {
  //   const target = this.Npcs.find((npc: Npc) => npc.ID === newNpc.ID)
  //   if (!target) throw new Error('npc does not exist')
  //   else {
  //     Object.assign(target, newNpc)
  //     _.debounce(saveNpcData, 300)(this.Npcs)
  //   }
  // }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Npcs.length) _.debounce(saveNpcData, 1000)(this.Npcs)
  }

  @Mutation
  private [ADD_NPC](payload: Npc): void {
    this.Npcs.push(payload)
    saveNpcData(this.Npcs)
  }

  @Mutation
  private [CLONE_NPC](payload: Npc): void {
    let npcData = Npc.Serialize(payload)
    let newNpc = Npc.Deserialize(npcData)
    newNpc.RenewID()
    newNpc.Name += ' (COPY)'
    this.Npcs.push(newNpc)
    saveNpcData(this.Npcs)
  }

  @Mutation
  private [DELETE_NPC](payload: Npc): void {
    const idx = this.Npcs.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Npcs.splice(idx, 1)
    } else {
      throw console.error('NPC not loaded!')
    }
    saveNpcData(this.Npcs)
  }

  @Action
  public saveNpcData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public cloneNpc(payload: Npc): void {
    this.context.commit(CLONE_NPC, payload)
  }

  @Action
  public addNpc(payload: Npc): void {
    this.context.commit(ADD_NPC, payload)
  }

  @Action
  public deleteNpc(payload: Npc): void {
    this.context.commit(DELETE_NPC, payload)
  }

  @Action({ rawError: true })
  public async loadNpcs() {
    const pilotData = await loadData<INpcData>('npcs.json')
    this.context.commit(LOAD_NPCS, pilotData)
  }
}
