import { CollectionItem, ICollectionItemData } from './CollectionItem';
import { CloudController, PortraitController, SaveController } from '../components';
import { NarrativeController } from './NarrativeController';
import { ItemType } from '../enums';
import { FolderController } from '../components/folder/FolderController';

class LocationData extends ICollectionItemData {
  collectionItemType: string = 'location';
}

class Location extends CollectionItem {
  public ItemType: string = ItemType.Location;

  public constructor(data?: LocationData) {
    super(data);
    this._name = data?.name || 'New Location';

    this.CloudController = new CloudController(this);
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
    ];
  }

  public GetRelationshipSuggestions(connectionType: string): string[] {
    const s = connectionType.toLowerCase();
    switch (s) {
      case 'character':
        return ['Resident', 'Visitor', 'Regular', 'Tourist', 'Exile', 'Local'];
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
        ];
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
        ];
    }
    return [];
  }

  public static Serialize(location: Location): LocationData {
    let data = {
      collectionItemType: 'location',
      id: location.ID,
      name: location.Name,
      note: location.Note,

      description: location.Description,
    };

    SaveController.Serialize(location, data);
    CloudController.Serialize(location, data);
    PortraitController.Serialize(location, data);
    NarrativeController.Serialize(location, data);
    FolderController.Serialize(location, data);

    return data as LocationData;
  }

  public Serialize<LocationData>(): LocationData {
    return Location.Serialize(this) as LocationData;
  }

  public static Deserialize(data: LocationData): Location {
    const location = new Location(data);
    SaveController.Deserialize(location, data.save);
    PortraitController.Deserialize(location, data.img);
    NarrativeController.Deserialize(location, data.narrative);
    FolderController.Deserialize(location, data.folder);
    return location;
  }

  public Clone<Location>(): Location {
    const itemData = Location.Serialize(this);
    const newItem = Location.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Location;
  }
}

export { Location, LocationData };
