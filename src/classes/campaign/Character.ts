import { ItemType } from '../enums'
import { CollectionItem, ICollectionItemData } from './CollectionItem'
import { SaveController } from '../components'
import { NarrativeController } from '../components/narrative/NarrativeController'

interface ICharacterData extends ICollectionItemData {
  alias?: string
  title?: string
}

class Character extends CollectionItem {
  public Alias: string
  public Title: string

  public constructor() {
    super()
    this.Alias = ''
    this.Title = ''
    this.ItemType = ItemType.Character
  }

  public get SectionSuggestions(): string[] {
    return ['History', 'Personality', 'Skills', 'Motivations', 'Resources']
  }

  public static Serialize(c: Character): ICharacterData {
    const data = {
      id: c.ID,
      alias: c.Alias,
      title: c.Title,
      name: c.Name,
      description: c.Description,
      notes: c.Notes,
    }

    SaveController.Serialize(c, data)
    NarrativeController.Serialize(c, data)

    return data as ICharacterData
  }

  Serialize(): ICharacterData {
    return Character.Serialize(this)
  }

  Update(data: ICharacterData) {
    this.ID = data.id
    this.Name = data.name
    this.Description = data.description
    this.Notes = data.notes
    NarrativeController.Deserialize(this, data)
    SaveController.Deserialize(this, data)
  }

  public static Deserialize(data: ICharacterData): Character {
    const c = new Character()
    try {
      c.Update(data)
      c.SaveController.SetLoaded()
      return c
    } catch (err) {
      console.error(err)
    }
  }
}

export { Character, ICharacterData }
