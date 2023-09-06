import { ItemType } from '../enums';
import { CollectionItem, ICollectionItemData } from './CollectionItem';
import { PortraitController, SaveController } from '../components';
import { NarrativeController } from '../components/narrative/NarrativeController';

interface ICharacterData extends ICollectionItemData {
  alias?: string;
  title?: string;
  pronouns?: string;
}

class Character extends CollectionItem {
  private _alias!: string;
  private _title!: string;
  private _pronouns!: string;

  public constructor() {
    super();
    this.Alias = '';
    this.Title = '';
    this.Pronouns = '';
    this.ItemType = ItemType.Character;
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
    return ['History', 'Personality', 'Skills', 'Motivations', 'Resources'];
  }

  public get PronounSuggestions(): string[] {
    return ['He/Him', 'She/Her', 'They/Them'];
  }

  public static Serialize(c: Character): ICharacterData {
    const data = {
      id: c.ID,
      alias: c.Alias,
      title: c.Title,
      pronouns: c.Pronouns,
      name: c.Name,
      description: c.Description,
      notes: c.Notes,
    };

    SaveController.Serialize(c, data);
    PortraitController.Serialize(c, data);
    NarrativeController.Serialize(c, data);

    return data as ICharacterData;
  }

  Serialize(): ICharacterData {
    return Character.Serialize(this);
  }

  Update(data: ICharacterData) {
    this.ID = data.id;
    this.Name = data.name || '';
    this.Alias = data.alias || '';
    this.Title = data.title || '';
    this.Pronouns = data.pronouns || '';
    this.Description = data.description || '';
    this.Notes = data.notes || '';
    NarrativeController.Deserialize(this, data.narrative);
    PortraitController.Deserialize(this, data.img);
    SaveController.Deserialize(this, data.save);
  }

  public static Deserialize(data: ICharacterData): Character {
    const c = new Character();
    try {
      c.Update(data);
      return c;
    } catch (err) {
      throw err;
    }
  }

  public Clone(): Character {
    const itemData = Character.Serialize(this);
    const newItem = Character.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem;
  }
}

export { Character };
export type { ICharacterData };
