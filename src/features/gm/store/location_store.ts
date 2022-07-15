/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { saveData, saveDelta, loadData, deleteDataById } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Location, ILocationData } from '@/classes/campaign/Location'
import { store } from '@/store'
import { storeSaveDelta } from '@/util/storeUtils'

export const SAVE_DATA = 'SAVE_DATA'
export const SET_DIRTY = 'SET_DIRTY'
export const ADD_LOCATION = 'ADD_LOCATION'
export const DELETE_LOCATION = 'DELETE_LOCATION'
export const CLONE_LOCATION = 'CLONE_LOCATION'
export const LOAD_LOCATIONS = 'LOAD_LOCATIONS'

@Module({
  name: 'location',
})
export class LocationStore extends VuexModule {
  Locations: Location[] = []
  DeletedLocations: Location[] = []
  public Dirty = false

  public get AllLocations(): Location[] {
    return this.Locations.concat(this.DeletedLocations)
  }

  @Mutation
  private [LOAD_LOCATIONS](payload: ILocationData[]): void {
    const newLocations: Location[] = [...payload.map(x => Location.Deserialize(x))]
    this.Locations.splice(0, this.Locations.length)
    const all = []
    newLocations.forEach((Location: Location) => {
      all.push(Location)
    })
    this.Locations = all.filter(x => !x.SaveController.IsDeleted)
    this.DeletedLocations = all.filter(x => x.SaveController.IsDeleted)

    //clean up deleted
    const del = []
    this.DeletedLocations.forEach(dp => {
      if (new Date().getTime() > Date.parse(dp.SaveController.ExpireTime)) del.push(dp)
    })
    if (del.length) {
      console.info(`Cleaning up ${del.length} Locations marked for deletion`)
      del.forEach(p => {
        const dpIdx = this.DeletedLocations.findIndex(x => x.ID === p.ID)
        if (dpIdx > -1) {
          this.DeletedLocations.splice(dpIdx, 1)
        }
      })
      storeSaveDelta(this.Locations.concat(this.DeletedLocations))
    }
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Dirty) {
      storeSaveDelta(this.Locations)
      this.Dirty = false
    }
  }

  @Mutation
  private [SET_DIRTY](): void {
    if (this.Locations.length) this.Dirty = true
  }

  @Mutation
  private [ADD_LOCATION](payload: Location): void {
    payload.SaveController.IsDirty = true
    this.Locations.push(payload)
    this.Dirty = true
  }

  @Mutation
  private [CLONE_LOCATION](payload: Location): void {
    this.Locations.push(payload.Clone())
    this.Dirty = true
  }

  @Mutation
  private [DELETE_LOCATION](payload: Location): void {
    const idx = this.Locations.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Locations.splice(idx, 1)
    } else {
      throw console.error('LOCATION not loaded!')
    }
    this.Dirty = true
  }

  @Action
  public saveLocationData(): void {
    this.context.commit(SAVE_DATA)
  }

  @Action
  public cloneLocation(payload: Location): void {
    this.context.commit(CLONE_LOCATION, payload)
  }

  @Action
  public addLocation(payload: Location): void {
    this.context.commit(ADD_LOCATION, payload)
  }

  @Action
  public deleteLocation(payload: Location): void {
    this.context.commit(DELETE_LOCATION, payload)
  }

  @Action({ rawError: true })
  public async loadLocations() {
    const locationData = await loadData<ILocationData>('locations')
    this.context.commit(LOAD_LOCATIONS, locationData)
  }

  get getLocations(): Location[] {
    return this.Locations
  }
}
