/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { Npc } from '@/class'
import { INpcData } from '@/interface'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ItemsMissingLcp, ItemsWithLcp } from '@/io/ContentEvaluator'
import { deletePermanent, storeSaveDelta } from '@/util/storeUtils'
import { SetItem, RemoveItem, GetAll } from '@/io/Storage'

export const SAVE_DATA = 'SAVE_DATA'
export const SET_DIRTY = 'SET_DIRTY'
export const ADD_NPC = 'ADD_NPC'
export const DELETE_NPC = 'DELETE_NPC'
export const RESTORE_NPC = 'RESTORE_NPC'
export const CLONE_NPC = 'CLONE_NPC'
export const LOAD_NPCS = 'LOAD_NPCS'
export const SORT_NPC = 'SORT_NPC'
export const DELETE_NPC_PERMANENT = 'DELETE_NPC_PERMANENT'
export const SET_MISSING_CONTENT = 'SET_MISSING_CONTENT'
export const DELETE_MISSING_NPC = 'DELETE_MISSING_NPC'

async function saveNpcData(npcs: Npc[]) {
  const dirty = npcs.filter(x => x.SaveController.IsDirty)
  Promise.all(dirty.map(x => SetItem('npcs', Npc.Serialize(x))))
    .then(() => console.info('NPC data saved'))
    .catch(err => console.error('Error while saving NPC data', err))
}

async function delete_npc(npc: Npc) {
  RemoveItem('npcs', npc.ID)
    .then(() => console.info('NPC permenently deleted'))
    .catch(err => console.error('Error while deleting NPC data', err))
}

@Module({
  name: 'npc',
})
export class NpcStore extends VuexModule {
  Npcs: Npc[] = []
  DeletedNpcs: Npc[] = []
  MissingNpcs: INpcData[] = []
  public Dirty = false

  public get AllNpcs(): Npc[] {
    return this.Npcs.concat(this.DeletedNpcs)
  }

  @Mutation
  private [LOAD_NPCS](payload: INpcData[]): void {
    const newNpcs: Npc[] = [...payload.map(x => Npc.Deserialize(x))]
    this.Npcs.splice(0, this.Npcs.length)
    const all = []
    newNpcs.forEach((npc: Npc) => {
      all.push(npc)
    })
    this.Npcs = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedNpcs = all.filter(x => x.SaveController.IsDeleted)

    //clean up deleted
    const del = []
    this.DeletedNpcs.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} Npcs marked for deletion`)
      del.forEach(p => {
        const dpIdx = this.DeletedNpcs.findIndex(x => x.ID === p.ID)
        if (dpIdx > -1) {
          this.DeletedNpcs.splice(dpIdx, 1)
        }
      })
      storeSaveDelta(this.Npcs.concat(this.DeletedNpcs))
    }
  }

  @Mutation
  private [SAVE_DATA](): void {
    saveNpcData(this.Npcs.concat(this.DeletedNpcs))
  }

  @Mutation
  private [SET_DIRTY](): void {
    if (this.Npcs.length) this.Dirty = true
  }

  @Mutation
  private [ADD_NPC](payload: Npc): void {
    payload.SaveController.IsDirty = true
    this.Npcs.push(payload)
    this.Dirty = true
    saveNpcData(this.Npcs)
  }

  @Mutation
  private [CLONE_NPC](payload: Npc): void {
    this.Npcs.push(payload.Clone())
    this.Dirty = true
  }

  @Mutation
  private [DELETE_NPC](payload: Npc): void {
    const idx = this.Npcs.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Npcs.splice(idx, 1)
      this.DeletedNpcs.push(payload)
    } else {
      throw console.error('NPC not loaded!')
    }
    this.Dirty = true
  }

  @Mutation
  private [DELETE_MISSING_NPC](payload: any): void {
    // for some reason missingnpcs is being set to the compendium missing property. Not sure why this is happening.
    if (Array.isArray(this.MissingNpcs)) {
      const idx = this.MissingNpcs.findIndex(x => x.id === payload.id)
      if (idx > -1) {
        this.MissingNpcs.splice(idx, 1)
        deletePermanent(payload)
      }
    } else {
      const idx = (this.MissingNpcs as any).npcs.findIndex(x => x.id === payload.id)
      if (idx > -1) {
        ;(this.MissingNpcs as any).npcs.splice(idx, 1)
        deletePermanent(payload)
      }
    }
  }

  @Mutation
  private [DELETE_NPC_PERMANENT](payload: Npc): void {
    const dpIdx = this.DeletedNpcs.findIndex(x => x.ID === payload.ID)
    if (dpIdx > -1) {
      this.DeletedNpcs.splice(dpIdx, 1)
      deletePermanent(payload)
    }
    this.Dirty = true
  }

  @Mutation
  private [RESTORE_NPC](payload: Npc): void {
    const NpcIndex = this.DeletedNpcs.findIndex(x => x.ID === payload.ID)
    if (NpcIndex > -1) {
      this.DeletedNpcs.splice(NpcIndex, 1)
      this.Npcs.push(payload)
    } else {
      throw console.error('NPC not loaded!')
    }
    this.Dirty = true
  }

  @Mutation [SET_MISSING_CONTENT](payload: INpcData[]): void {
    this.MissingNpcs = payload
  }

  get getNpcs(): Npc[] {
    return this.Npcs
  }

  get getNpc(): any {
    return (id: string) => {
      return this.Npcs.find(x => x.ID === id)
    }
  }

  @Action
  public setNpcOrder(payload: Npc[]): void {
    this.context.commit(SORT_NPC, payload)
  }

  @Action
  public set_npc_dirty(): void {
    this.context.commit(SET_DIRTY)
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
    this.context.commit(SAVE_DATA)
  }

  @Action
  public delete_npc(payload: Npc): void {
    this.context.commit(DELETE_NPC, payload)
    this.context.commit(SAVE_DATA)
  }

  @Action
  public deleteMissingNpc(payload: any): void {
    this.context.commit(DELETE_MISSING_NPC, payload)
  }

  @Action
  public restore_npc(payload: Npc): void {
    this.context.commit(RESTORE_NPC, payload)
  }

  @Action
  public deleteNpcPermanent(payload: Npc): void {
    if (!payload.SaveController.IsDeleted) this.context.commit(DELETE_NPC)
    this.context.commit(DELETE_NPC_PERMANENT, payload)
  }

  @Action({ rawError: true })
  public async loadNpcs() {
    const npcData = await GetAll('npcs')
    this.context.commit(LOAD_NPCS, ItemsWithLcp(npcData))
    this.context.commit(SET_MISSING_CONTENT, ItemsMissingLcp(npcData))
  }
}
