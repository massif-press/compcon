/* eslint-disable @typescript-eslint/explicit-function-return-type */
import _ from 'lodash'
import { loadData, saveData } from '@/io/Data'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Location, ILocationData } from '@/classes/campaign/Location'
import { GetAll, RemoveItem, SetItem } from '@/io/Storage'

export const SAVE_DATA = 'SAVE_DATA'
export const ADD_LOCATION = 'ADD_LOCATION'
export const DELETE_LOCATION = 'DELETE_LOCATION'
export const CLONE_LOCATION = 'CLONE_LOCATION'
export const LOAD_LOCATIONS = 'LOAD_LOCATIONS'

async function saveLocationData(locations: Location[]) {
  const dirty = locations.filter(x => x.SaveController.IsDirty)
  Promise.all(dirty.map(x => SetItem('locations', Location.Serialize(x))))
    .then(() => console.info('location data saved'))
    .catch(err => console.error('Error while saving location data', err))
}

async function delete_location(location: Location) {
  RemoveItem('locations', location.ID)
    .then(() => console.info('NPC permenently deleted'))
    .catch(err => console.error('Error while deleting NPC data', err))
}

@Module({
  name: 'location',
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
    const locationData = await GetAll('locations')
    this.context.commit(LOAD_LOCATIONS, locationData)
  }

  get getLocations(): Location[] {
    return this.Locations
  }
}
