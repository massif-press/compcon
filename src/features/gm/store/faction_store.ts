/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Faction, IFactionData } from '@/classes/campaign/Faction'
import { store } from '@/store'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_FACTION = 'ADD_FACTION'
export const DELETE_FACTION = 'DELETE_FACTION'
export const CLONE_FACTION = 'CLONE_FACTION'
export const LOAD_FACTIONS = 'LOAD_FACTIONS'

async function saveFactionData(factions: Faction[]) {
  const serialized = factions.map(x => Faction.Serialize(x))
  await saveData('factions.json', serialized)
}

@Module({
  store: store,
  namespaced: true,
})
export class FactionStore extends VuexModule {
  Factions: Faction[] = []

  @Mutation
  private [LOAD_FACTIONS](payload: IFactionData[]): void {
    this.Factions = [...payload.map(x => Faction.Deserialize(x))]
    saveFactionData(this.Factions)
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Factions.length) _.debounce(saveFactionData, 1000)(this.Factions)
  }

  @Mutation
  private [ADD_FACTION](payload: Faction): void {
    this.Factions.push(payload)
    saveFactionData(this.Factions)
  }

  @Mutation
  private [CLONE_FACTION](payload: Faction): void {
    const factionData = Faction.Serialize(payload)
    const newFaction = Faction.Deserialize(factionData)
    newFaction.RenewID()
    newFaction.Name += ' (COPY)'
    this.Factions.push(newFaction)
    saveFactionData(this.Factions)
  }

  @Mutation
  private [DELETE_FACTION](payload: Faction): void {
    const idx = this.Factions.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Factions.splice(idx, 1)
    } else {
      throw console.error('FACTION not loaded!')
    }
    saveFactionData(this.Factions)
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
    const factionData = await loadData<IFactionData>('factions.json')
    this.context.commit(LOAD_FACTIONS, factionData)
  }

  get getFactions(): Faction[] {
    return this.Factions
  }
}
