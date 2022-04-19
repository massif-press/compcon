import { store } from '@/store'
import { ItemType } from '../enums'
import { CollectionItem, ICollectionItemData } from './CollectionItem'
import { RollableTable } from '../components/narrative/elements/RollableTable'
import { Clock } from '../components/narrative/elements/Clock'

interface ILocationData extends ICollectionItemData {}

class Location extends CollectionItem {
  public constructor(data?: ILocationData) {
    super(data)
    this.ItemType = ItemType.Location
  }

  public get SectionSuggestions(): string[] {
    return ['History', 'Climate', 'Geography', 'Flora and Fauna', 'Resources']
  }

  public save() {
    store.dispatch('location/saveLocationData')
  }

  public copy() {
    store.dispatch('location/cloneLocation', this)
  }

  public delete() {
    store.dispatch('location/deleteLocation', this)
  }

  public addNew() {
    store.dispatch('location/addLocation', this)
  }

  public static Serialize(l: Location): ILocationData {
    return {
      id: l.ID,
      name: l.Name,
      description: l.Description,
      notes: l.Notes,
      image: l.img,
      sections: l.Sections,
      campaigns: l.Campaigns,
      locations: l.Locations,
      factions: l.Factions,
      npcs: l.NPCs,
      labels: l.Labels,
      clocks: l.Clocks.length ? l.Clocks.map(x => Clock.Serialize(x)) : [],
      tables: l.Tables.length ? l.Tables.map(x => RollableTable.Serialize(x)) : [],
    }
  }

  public static Deserialize(data: ILocationData): Location {
    return new Location(data)
  }
}

export { Location, ILocationData }
