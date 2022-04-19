/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Location, ILocationData } from '@/classes/campaign/Location'
import { store } from '@/store'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_LOCATION = 'ADD_LOCATION'
export const DELETE_LOCATION = 'DELETE_LOCATION'
export const CLONE_LOCATION = 'CLONE_LOCATION'
export const LOAD_LOCATIONS = 'LOAD_LOCATIONS'

async function saveLocationData(locations: Location[]) {
  const serialized = locations.map(x => Location.Serialize(x))
  await saveData('locations.json', serialized)
}

@Module({
  namespaced: true,
})
export class LocationStore extends VuexModule {
  Locations: Location[] = []

  @Mutation
  private [LOAD_LOCATIONS](payload: ILocationData[]): void {
    this.Locations = [...payload.map(x => Location.Deserialize(x))]
    saveLocationData(this.Locations)
  }

  @Mutation
  private [SAVE_DATA](): void {
    if (this.Locations.length) _.debounce(saveLocationData, 1000)(this.Locations)
  }

  @Mutation
  private [ADD_LOCATION](payload: Location): void {
    this.Locations.push(payload)
    saveLocationData(this.Locations)
  }

  @Mutation
  private [CLONE_LOCATION](payload: Location): void {
    const locationData = Location.Serialize(payload)
    const newLocation = Location.Deserialize(locationData)
    newLocation.RenewID()
    newLocation.Name += ' (COPY)'
    this.Locations.push(newLocation)
    saveLocationData(this.Locations)
  }

  @Mutation
  private [DELETE_LOCATION](payload: Location): void {
    const idx = this.Locations.findIndex(x => x.ID === payload.ID)
    if (idx > -1) {
      this.Locations.splice(idx, 1)
    } else {
      throw console.error('LOCATION not loaded!')
    }
    saveLocationData(this.Locations)
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
    const locationData = await loadData<ILocationData>('locations.json')
    this.context.commit(LOAD_LOCATIONS, locationData)
  }

  get getLocations(): Location[] {
    return this.Locations
  }
}
