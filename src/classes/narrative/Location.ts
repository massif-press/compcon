import { CollectionItem, ICollectionItemData } from './CollectionItem'
import { CloudController, PortraitController, SaveController } from '../components'
import { NarrativeController } from './NarrativeController'
import { ItemType } from '../enums'
import { FolderController } from '../components/folder/FolderController'
import { i18n } from '@/i18n'

class LocationData extends ICollectionItemData {
  collectionItemType: string = 'location'
}

class Location extends CollectionItem {
  public ItemType: ItemType = ItemType.Location

  public constructor(data?: LocationData) {
    super(data)
    this._name = data?.name || i18n.global.t('classes.newLocation')

    this.CloudController = new CloudController(this)
  }

  public get SectionSuggestions(): string[] {
    return [
      'Geography',
      'History',
      'Demographics',
      'Economy',
      'Culture',
      'Tourism',
      'Landmarks',
      'Education',
      'Transportation',
      'Government and Politics',
      'Sports',
      'Notable People',
      'Climate',
      'Flora and Fauna',
      'Infrastructure',
    ]
  }

  public GetRelationshipSuggestions(connectionType: string): string[] {
    const s = connectionType.toLowerCase()
    switch (s) {
      case 'character':
        return ['Resident', 'Visitor', 'Regular', 'Tourist', 'Exile', 'Local']
      case 'location':
        return [
          'Subregion',
          'Trade partners',
          'Connected',
          'Shared culture',
          'Collaborative regions',
          'Economic interdependence',
          'Geographic proximity',
          'Political alliance',
        ]
      case 'faction':
        return [
          'Headquarters',
          'Branch or satellite',
          'Outpost',
          'Venue',
          'Holding',
          'Base',
          'Territory',
          'Disputed Area',
        ]
    }
    return []
  }

  public static Serialize(location: Location): LocationData {
    const data = {
      collectionItemType: 'location',
      id: location.ID,
      name: location.Name,
      note: location.Note,

      description: location.Description,
    }

    SaveController.Serialize(location, data)
    CloudController.Serialize(location, data)
    PortraitController.Serialize(location, data)
    NarrativeController.Serialize(location, data)
    FolderController.Serialize(location, data)

    return data as LocationData
  }

  public Serialize<LocationData>(): LocationData {
    return Location.Serialize(this) as LocationData
  }

  public static Deserialize(data: LocationData): Location {
    const location = new Location(data)
    SaveController.Deserialize(location, data.save)
    CloudController.Deserialize(location, data.cloud)
    PortraitController.Deserialize(location, data.img)
    NarrativeController.Deserialize(location, data.narrative)
    FolderController.Deserialize(location, data.folder)
    return location
  }

  public Clone<Location>(): Location {
    const itemData = structuredClone(Location.Serialize(this))
    const newItem = Location.Deserialize(itemData)
    newItem.RenewID()
    newItem.Name += ' (COPY)'
    return newItem as Location
  }
}

export { Location, LocationData }
