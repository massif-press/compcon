import { SaveController } from '../components'
import { NarrativeController } from '../components/narrative/NarrativeController'
import { ItemType } from '../enums'
import { CollectionItem, ICollectionItemData } from './CollectionItem'

interface IFactionData extends ICollectionItemData {
  core_mission: string[]
}

class Faction extends CollectionItem {
  public CoreMission: string[]

  public constructor() {
    super()
    this.CoreMission = []
    this.ItemType = ItemType.Faction
  }

  public get SectionSuggestions(): string[] {
    return ['History', 'Goals']
  }

  public static Serialize(c: Faction): IFactionData {
    const data = {
      id: c.ID,
      name: c.Name,
      description: c.Description,
      notes: c.Notes,
      core_mission: c.CoreMission,
    }

    SaveController.Serialize(c, data)
    NarrativeController.Serialize(c, data)

    return data as IFactionData
  }

  Serialize(): IFactionData {
    return Faction.Serialize(this)
  }

  Update(data: IFactionData) {
    this.ID = data.id
    this.Name = data.name
    this.Description = data.description
    this.Notes = data.notes
    this.CoreMission = data.core_mission
    NarrativeController.Deserialize(this, data)
    SaveController.Deserialize(this, data)
  }

  public static Deserialize(data: IFactionData): Faction {
    const c = new Faction()
    try {
      c.Update(data)
      c.SaveController.SetLoaded()
      return c
    } catch (err) {
      console.error(err)
    }
  }
}

export { Faction, IFactionData }
