/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { saveData, saveDelta, loadData, deleteDataById } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Eidolon, EidolonData } from '@/classes/npc/eidolons/Eidolon'
import { storeSaveDelta } from '@/util/storeUtils'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_EIDOLON = 'ADD_EIDOLON'
export const DELETE_EIDOLON = 'DELETE_EIDOLON'
export const CLONE_EIDOLON = 'CLONE_EIDOLON'
export const LOAD_EIDOLONS = 'LOAD_EIDOLONS'

@Module({
  name: 'eidolon',
})
export class EidolonStore extends VuexModule {
  Eidolons: Eidolon[] = []
  DeletedEidolons: Eidolon[] = []
  public Dirty = false

  public get AllEidolons(): Eidolon[] {
    return this.Eidolons.concat(this.DeletedEidolons)
  }

  @Mutation
  private [LOAD_EIDOLONS](payload: EidolonData[]): void {
    const newEidolons: Eidolon[] = [...payload.map(x => Eidolon.Deserialize(x))]
    this.Eidolons.splice(0, this.Eidolons.length)
    const all = []
    newEidolons.forEach((Eidolon: Eidolon) => {
      all.push(Eidolon)
    })
    this.Eidolons = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedEidolons = all.filter(x => x.SaveController.IsDeleted)

    //clean up deleted
    const del = []
    this.DeletedEidolons.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} Eidolons marked for deletion`)
      del.forEach(p => {
        const dpIdx = this.DeletedEidolons.findIndex(x => x.ID === p.ID)
        if (dpIdx > -1) {
          this.DeletedEidolons.splice(dpIdx, 1)
        }
      })
      storeSaveDelta(this.Eidolons.concat(this.DeletedEidolons))
    }
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      storeSaveDelta(this.Eidolons)
      this.Dirty = false
    }
  }

  @Mutation
  private [ADD_EIDOLON](payload: Eidolon): void {
    payload.SaveController.IsDirty = true
    this.Eidolons.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [CLONE_EIDOLON](payload: Eidolon): void {
    this.Eidolons.push(payload.Clone())
    this.Dirty = true
  }

  @Mutation
  private [DELETE_EIDOLON](payload: Eidolon): void {
    const idx = this.Eidolons.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Eidolons.splice(idx, 1)
    } else {
      throw console.error('EIDOLON not loaded!')
    }
    this.Dirty = true
  }

  @Action({ rawError: true })
  public saveEidolonData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public cloneEidolon(payload: Eidolon): void {
    this.context.commit(CLONE_EIDOLON, payload)
  }

  @Action
  public addEidolon(payload: Eidolon): void {
    this.context.commit(ADD_EIDOLON, payload)
  }

  @Action
  public deleteEidolon(payload: Eidolon): void {
    this.context.commit(DELETE_EIDOLON, payload)
  }

  @Action({ rawError: true })
  public async loadEidolons() {
    const eidolonData = await loadData<EidolonData>('eidolons')
    this.context.commit(LOAD_EIDOLONS, eidolonData)
  }

  get getEidolons(): Eidolon[] {
    return this.Eidolons
  }

  get getEidolon() {
    return id => this.Eidolons.find(x => x.ID === id)
  }
}
