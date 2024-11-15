import { CloudController, PortraitController, SaveController } from '../components';
import { NarrativeController } from './NarrativeController';
import { CollectionItem, ICollectionItemData } from './CollectionItem';
import { ItemType } from '../enums';
import { FolderController } from '../components/folder/FolderController';

class FactionData extends ICollectionItemData {
  collectionItemType: string = 'faction';
  factionType: string = '';
}

class Faction extends CollectionItem {
  public ItemType: string = ItemType.Faction;
  private _factionType: string;

  public constructor(data?: FactionData) {
    super(data);
    this._factionType = data?.factionType || '';
    this._name = data?.name || 'New Faction';

    this.CloudController = new CloudController(this);
  }

  public get TypeSuggestions(): string[] {
    return [
      'Government',
      'Political Group',
      'Corporation',
      'Military',
      'Criminal Organization',
      'Team',
      'Club',
      'Media Group',
      'Professional Association',
      'Religious Sect',
      'Academic Society',
      'Cultural Association',
      'Collective',
      'Social Movement',
    ];
  }

  public get FactionType(): string {
    return this._factionType;
  }

  public set FactionType(val: string) {
    this._factionType = val;
    this.SaveController.save();
  }

  public get SectionSuggestions(): string[] {
    return [
      'Formation and Origins',
      'Resources and Holdings',
      'Objectives and Mission',
      'Key Leaders and Members',
      'Historical Background and Context',
      'Activities and Initiatives',
      'Structure and Organization',
      'Achievements and Milestones',
      'Challenges Faced',
      'Ideology and Beliefs',
      'Notable Events',
      'Relationships and Alliances',
      'Controversies and Criticisms',
      'Influence and Extents',
      'Current Status and Impact',
    ];
  }

  public GetRelationshipSuggestions(connectionType: string): string[] {
    const s = connectionType.toLowerCase();
    switch (s) {
      case 'character':
        return [
          'Member',
          'Leader',
          'Employee',
          'Patron',
          'Supporter',
          'Stakeholder',
          'Affiliate',
          'Opponent',
        ];
      case 'location':
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
      case 'faction':
        return [
          'Allies',
          'Enemies',
          'Collaborators',
          'Suppliers',
          'Client',
          'Competitors',
          'Rivals',
          'Subsidiary',
          'Parent Organization',
        ];
    }
    return [];
  }

  public static Serialize(faction: Faction): FactionData {
    let data = {
      collectionItemType: 'faction',
      id: faction.ID,
      name: faction.Name,
      description: faction.Description,
      note: faction.Note,
      factionType: faction.FactionType,
    };

    SaveController.Serialize(faction, data);
    CloudController.Serialize(faction, data);
    PortraitController.Serialize(faction, data);
    NarrativeController.Serialize(faction, data);
    FolderController.Serialize(faction, data);

    return data as FactionData;
  }

  public Serialize<FactionData>(): FactionData {
    return Faction.Serialize(this) as FactionData;
  }

  public static Deserialize(data: FactionData): Faction {
    const faction = new Faction(data);
    SaveController.Deserialize(faction, data.save);
    PortraitController.Deserialize(faction, data.img);
    NarrativeController.Deserialize(faction, data.narrative);
    FolderController.Deserialize(faction, data.folder);
    return faction;
  }

  public Clone<Faction>(): Faction {
    const itemData = Faction.Serialize(this);
    const newItem = Faction.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Faction;
  }
}

export { Faction, FactionData };
