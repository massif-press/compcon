import { ItemType } from '../enums';
import { CollectionItem, ICollectionItemData } from './CollectionItem';
import { CloudController, PortraitController, SaveController } from '../components';
import { NarrativeController } from './NarrativeController';

class CharacterData extends ICollectionItemData {
  collectionItemType: string = 'character';
  alias?: string;
  title?: string;
  pronouns?: string;
}

class Character extends CollectionItem {
  public ItemType: string = ItemType.Character;

  private _alias!: string;
  private _title!: string;
  private _pronouns!: string;

  public constructor(data?: CharacterData) {
    super(data);
    this._name = data?.name || 'New Character';
    this._alias = data?.alias || '';
    this._title = data?.title || '';
    this._pronouns = data?.pronouns || 'They/Them';
  }

  public get Alias(): string {
    return this._alias;
  }

  public set Alias(val: string) {
    this._alias = val;
    this.SaveController.save();
  }

  public get Title(): string {
    return this._title;
  }

  public set Title(val: string) {
    this._title = val;
    this.SaveController.save();
  }

  public get Pronouns(): string {
    return this._pronouns;
  }

  public set Pronouns(val: string) {
    this._pronouns = val;
    this.SaveController.save();
  }

  public get SectionSuggestions(): string[] {
    return [
      'Early Life',
      'Personality',
      'Skills',
      'Motivations',
      'Resources',
      'Appearance',
      'Beliefs',
      'Education and Career',
      'Personal Life',
      'Habits and Quirks',
      'Goals and Achievements',
      'Notable Works',
      'Controversies',
      'Relationships and Family',
      'Health',
      'Public Image and Reception',
      'Quotes',
      'Trivia',
    ];
  }

  public GetRelationshipSuggestions(connectionType: string): string[] {
    const s = connectionType.toLowerCase();
    switch (s) {
      case 'character':
        return [
          'Family',
          'Friend',
          'Enemy',
          'Family',
          'Romantic Partner',
          'Colleague',
          'Mentor',
          'Student',
          'Rival',
        ];
      case 'location':
        return ['Resident', 'Visitor', 'Regular', 'Tourist', 'Exile', 'Local'];
      case 'faction':
        return [
          'Member',
          'Leader',
          'Employee',
          'Patron',
          'Supporter',
          'Stakeholder',
          'Affiliate',
          'Rival',
        ];
    }
    return [];
  }

  public static Serialize(character: Character): CharacterData {
    let data = {
      collectionItemType: 'character',
      id: character.ID,
      name: character.Name,
      note: character.Note,
      alias: character.Alias,
      title: character.Title,
      pronouns: character.Pronouns,
    };

    SaveController.Serialize(character, data);
    CloudController.Serialize(character, data);
    PortraitController.Serialize(character, data);
    NarrativeController.Serialize(character, data);

    return data as CharacterData;
  }

  public Serialize<CharacterData>(): CharacterData {
    return Character.Serialize(this) as CharacterData;
  }

  public static Deserialize(data: CharacterData): Character {
    const character = new Character(data);
    SaveController.Deserialize(character, data.save);
    PortraitController.Deserialize(character, data.img);
    NarrativeController.Deserialize(character, data.narrative);
    return character;
  }

  public Clone<Character>(): Character {
    const itemData = Character.Serialize(this);
    const newItem = Character.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Character;
  }
}

export { Character, CharacterData };
