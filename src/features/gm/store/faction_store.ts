/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { saveData, saveDelta, loadData, deleteDataById } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Faction, IFactionData } from '@/classes/campaign/Faction'
import { storeSaveDelta } from '@/util/storeUtils'

export const SAVE_DATA = 'SAVE_DATA'
export const SET_DIRTY = 'SET_DIRTY'
export const ADD_FACTION = 'ADD_FACTION'
export const DELETE_FACTION = 'DELETE_FACTION'
export const CLONE_FACTION = 'CLONE_FACTION'
export const LOAD_FACTIONS = 'LOAD_FACTIONS'

@Module({
  name: 'faction',
})
export class FactionStore extends VuexModule {
  Factions: Faction[] = []
  DeletedFactions: Faction[] = []
  public Dirty = false

  public get AllFactions(): Faction[] {
    return this.Factions.concat(this.DeletedFactions)
  }

  @Mutation
  private [LOAD_FACTIONS](payload: IFactionData[]): void {
    const newFactions: Faction[] = [...payload.map(x => Faction.Deserialize(x))]
    this.Factions.splice(0, this.Factions.length)
    const all = []
    newFactions.forEach((Faction: Faction) => {
      all.push(Faction)
    })
    this.Factions = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedFactions = all.filter(x => x.SaveController.IsDeleted)

    //clean up deleted
    const del = []
    this.DeletedFactions.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} Factions marked for deletion`)
      del.forEach(p => {
        const dpIdx = this.DeletedFactions.findIndex(x => x.ID === p.ID)
        if (dpIdx > -1) {
          this.DeletedFactions.splice(dpIdx, 1)
        }
      })
      storeSaveDelta(this.Factions.concat(this.DeletedFactions))
    }
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      storeSaveDelta(this.Factions)
      this.Dirty = false
    }
  }

  @Mutation
  private [SET_DIRTY](): void {
    if (this.Factions.length) this.Dirty = true
  }

  @Mutation
  private [ADD_FACTION](payload: Faction): void {
    payload.SaveController.IsDirty = true
    this.Factions.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [CLONE_FACTION](payload: Faction): void {
    this.Factions.push(payload.Clone())
    this.Dirty = true
  }

  @Mutation
  private [DELETE_FACTION](payload: Faction): void {
    const idx = this.Factions.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Factions.splice(idx, 1)
    } else {
      throw console.error('FACTION not loaded!')
    }
    this.Dirty = true
  }

  @Action
  public saveFactionData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public cloneFaction(payload: Faction): void {
    this.context.commit(CLONE_FACTION, payload)
  }

  @Action
  public addFaction(payload: Faction): void {
    this.context.commit(ADD_FACTION, payload)
  }

  @Action
  public deleteFaction(payload: Faction): void {
    this.context.commit(DELETE_FACTION, payload)
  }

  @Action({ rawError: true })
  public async loadFactions() {
    const factionData = await loadData<IFactionData>('factions')
    this.context.commit(LOAD_FACTIONS, factionData)
  }

  get getFactions(): Faction[] {
    return this.Factions
  }
}
