import { store } from '@/store'
import { ItemType } from '../enums'
import { Clock } from './Clock'
import { CollectionItem, ICollectionItemData } from './CollectionItem'
import { RollableTable } from './RollableTable'

interface IFactionData extends ICollectionItemData {
  core_mission?: string[]
}

class Faction extends CollectionItem {
  public CoreMission: string[]

  public constructor(data?: IFactionData) {
    super(data)
    this.CoreMission = data?.core_mission || []
    this.ItemType = ItemType.Faction
  }

  public get SectionSuggestions(): string[] {
    return ['History', 'Goals']
  }

  public save() {
    store.dispatch('faction/saveFactionData')
  }

  public copy() {
    store.dispatch('faction/cloneFaction', this)
  }

  public delete() {
    store.dispatch('faction/deleteFaction', this)
  }

  public addNew() {
    store.dispatch('faction/addFaction', this)
  }

  public static Serialize(f: Faction): IFactionData {
    return {
      id: f.ID,
      core_mission: f.CoreMission,
      name: f.Name,
      description: f.Description,
      notes: f.Notes,
      image: f.img,
      sections: f.Sections,
      campaigns: f.Campaigns,
      locations: f.Locations,
      factions: f.Factions,
      npcs: f.NPCs,
      labels: f.Labels,
      clocks: f.Clocks.length ? f.Clocks.map(x => Clock.Serialize(x)) : [],
      tables: f.Tables.length ? f.Tables.map(x => RollableTable.Serialize(x)) : [],
    }
  }

  public static Deserialize(data: IFactionData): Faction {
    return new Faction(data)
  }
}

export { Faction, IFactionData }
