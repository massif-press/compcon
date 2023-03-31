import { v4 as uuid } from 'uuid';
import { ISaveable, ISaveData, SaveController } from '../components';
import { ISectionData, Section } from './campaign_elements/Section';
import { Character, ICharacterData } from './Character';
import { Faction, IFactionData } from './Faction';
import { ILocationData, Location } from './Location';

enum CampaignStatus {
  Active = 'Active',
  Unpublished = 'Unpublished',
  Catalog = 'Catalog',
  Archived = 'Archived',
  Published = 'Published',
}

type ICampaignData = {
  id: string;
  name: string;
  image: string;
  author: string;
  description: string;
  contributors: string;
  license: string;
  sections: ISectionData[];
  characters: ICharacterData[];
  factions: IFactionData[];
  locations: ILocationData[];
  status: CampaignStatus;
  save: ISaveData;
};

class Campaign implements ISaveable {
  private _id: string;
  public Name: string;
  public Image: string;
  public Author: string;
  public Description: string;
  public Contributors: string;
  public License: string;
  public Sections: Section[];
  public Characters: Character[];
  public Locations: Location[];
  public Factions: Faction[];
  public Status: CampaignStatus;
  public ItemType: string;
  public SaveController: SaveController;

  constructor() {
    this._id = uuid();
    this.Name = 'New Campaign';
    this.Image = '';
    this.Author = '';
    this.Description = '';
    this.Contributors = '';
    this.License = '';
    this.Sections = [];
    this.Characters = [];
    this.Locations = [];
    this.Factions = [];
    this.Status = CampaignStatus.Unpublished;
    this.ItemType = 'Campaign';

    this.SaveController = new SaveController(this);
  }

  public get ID(): string {
    return this._id;
  }

  public RenewID(): void {
    this._id = uuid();
    this.SaveController.save();
  }

  public AddSection() {
    this.Sections.push(
      new Section({
        id: uuid(),
        title: 'New Section',
        item_number: (this.Sections.length + 1).toString(),
        content: [],
        children: [],
        item_type: 'Section',
      })
    );
    this.SaveController.save();
  }

  public MoveSection(from: number, to: number) {
    this.Sections = this.Sections.splice(
      to,
      0,
      this.Sections.splice(from, 1)[0]
    );
    this.SaveController.save();
  }

  public DeleteSection(s: Section) {
    const idx = this.Sections.findIndex((x) => x.ID === s.ID);
    if (idx === -1) return;
    this.Sections.splice(idx, 1);
    this.SaveController.save();
  }

  // public AddCharacter() {
  //   this.Characters.push(new Character({ name: 'New Character' }))
  // }

  // public AddFaction() {
  //   this.Factions.push(new Faction({ name: 'New Faction' }))
  // }

  // public AddLocation() {
  //   this.Locations.push(new Location({ name: 'New Location' }))
  // }

  public Count(type: string): number {
    return this.Sections.flatMap((x) =>
      x.Children.map((y) => y.ItemType === type)
    ).length;
  }

  public static Serialize(c: Campaign): ICampaignData {
    const data = {
      id: c.ID,
      name: c.Name,
      image: c.Image,
      author: c.Author,
      description: c.Description,
      contributors: c.Contributors,
      license: c.License,
      sections: c.Sections.map((s) => Section.Serialize(s)),
      characters: c.Characters.map((s) => Character.Serialize(s)),
      factions: c.Factions.map((s) => Faction.Serialize(s)),
      locations: c.Locations.map((s) => Location.Serialize(s)),
      status: c.Status,
    };

    SaveController.Serialize(c, data);
    return data as ICampaignData;
  }

  Serialize(): ICampaignData {
    return Campaign.Serialize(this);
  }

  Update(data: ICampaignData) {
    this.Name = data.name;
    this.Image = data.image;
    this.Author = data.author;
    this.Description = data.description;
    this.Contributors = data.contributors;
    this.License = data.license;
    this.Sections = data.sections.map((s) => Section.Deserialize(s));
    this.Characters = data.characters.map((s) => Character.Deserialize(s));
    this.Locations = data.locations.map((s) => Location.Deserialize(s));
    this.Factions = data.factions.map((s) => Faction.Deserialize(s));
    this.Status = data.status;
    SaveController.Deserialize(this, data.save);
  }

  public static Deserialize(data: ICampaignData): Campaign {
    const c = new Campaign();
    try {
      c.Update(data);
      c.SaveController.SetLoaded();
      return c;
    } catch (err) {
      throw err;
    }
  }

  public Clone(): Campaign {
    const itemData = Campaign.Serialize(this);
    const newItem = Campaign.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem;
  }
}

export { Campaign, CampaignStatus };
export type { ICampaignData };
