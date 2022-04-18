import uuid from 'uuid/v4'
import { ISectionData, Section } from './campaign_elements/Section'
import { Character, ICharacterData } from './Character'
import { Faction, IFactionData } from './Faction'
import { ILocationData, Location } from './Location'
import { store } from '@/store'

enum CampaignStatus {
  Active = "Active",
  Unpublished = "Unpublished",
  Catalog = "Catalog"
}

interface ICampaignData {
  id?: string
  name?: string
  image?: string
  author?: string
  description?: string
  contributors?: string
  license?: string
  sections: ISectionData[]
  characters: ICharacterData[]
  factions: IFactionData[]
  locations: ILocationData[]
  status?: CampaignStatus
}

class Campaign {
  public readonly ID: string
  public Name: string
  public Image: string
  public Author: string
  public Description: string
  public Contributors: string
  public License: string
  public Sections: Section[]
  public Characters: Character[]
  public Locations: Location[]
  public Factions: Faction[]
  public Status: CampaignStatus

  constructor(data?: ICampaignData) {
    this.ID = data.id || uuid()
    this.Name = data.name || 'New Campaign'
    this.Image = data.image || ''
    this.Author = data.author || ''
    this.Description = data.description || ''
    this.Contributors = data.contributors || ''
    this.License = data.license || ''
    this.Sections = data.sections.map(s => Section.Deserialize(s))
    this.Characters = data.characters.map(c => Character.Deserialize(c))
    this.Locations = data.locations.map(l => Location.Deserialize(l))
    this.Factions = data.factions.map(f => Faction.Deserialize(f))
    this.Status = data.status || CampaignStatus.Unpublished
  }

  public save() {
    store.dispatch('campaign/saveCampaignData')
  }

  public load() {
    store.dispatch('campaign/setEditCampaign', this)
  }

  public copy() {
    store.dispatch('campaign/cloneCampaign', this)
  }

  public delete() {
    store.dispatch('campaign/deleteCampaign', this)
  }

  public addNew() {
    store.dispatch('campaign/addCampaign', this)
  }

  public AddSection() {
    this.Sections.push(new Section({
      id: uuid(),
      title: 'New Section',
      item_number: (this.Sections.length + 1).toString(),
      content: [],
      children: [],
      item_type: 'Section'
    }))
  }

  public MoveSection(from: number, to: number) {
    this.Sections = this.Sections.splice(to, 0, this.Sections.splice(from, 1)[0]);
  }

  public DeleteSection(s: Section) {
    const idx = this.Sections.findIndex(x => x.ID === s.ID)
    if (idx === -1) return
    this.Sections.splice(idx, 1)
  }

  public AddCharacter() {
    this.Characters.push(new Character({ name: 'New Character' }))
  }

  public AddFaction() {
    this.Factions.push(new Faction({ name: 'New Faction' }))
  }

  public AddLocation() {
    this.Locations.push(new Location({ name: 'New Location' }))
  }

  public Count(type: string): number {
    return this.Sections.flatMap(x => x.Children.map(y => y.ItemType === type)).length
  }

  public static Serialize(c: Campaign): ICampaignData {
    return {
      id: c.ID,
      name: c.Name,
      author: c.Author,
      description: c.Description,
      contributors: c.Contributors,
      license: c.License,
      sections: c.Sections.map(s => Section.Serialize(s)),
      characters: c.Characters.map(s => Character.Serialize(s)),
      locations: c.Locations.map(s => Location.Serialize(s)),
      factions: c.Factions.map(s => Faction.Serialize(s)),
      status: c.Status
    }
  }

  public static Deserialize(data: ICampaignData): Campaign {
    return new Campaign(data)
  }
}

export { ICampaignData, Campaign, CampaignStatus }