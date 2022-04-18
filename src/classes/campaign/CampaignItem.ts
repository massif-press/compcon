import { ItemType } from "../enums"
import { Clock, IClockData } from './Clock'
import { IRollableTableData, RollableTable } from './RollableTable'

interface ISectionData {
  header: string
  body: string
}

interface IRelationshipData {
  link_id: string,
  name: string,
  relationship: string
}

interface ICampaignItemData {
  notes?: string
  sections?: ISectionData[]
  links?: IRelationshipData[]
  labels?: string[]
  clocks?: IClockData[]
  tables?: IRollableTableData[]
}

abstract class CampaignItem {
  public Notes: string
  public Sections: ISectionData[]
  public Links: IRelationshipData[]
  public Locations: IRelationshipData[]
  public Factions: IRelationshipData[]
  public NPCs: IRelationshipData[]
  public Labels: string[]
  public Clocks: Clock[]
  public Tables: RollableTable[]

  public constructor(data?: ICampaignItemData) {
    this.UpdateCampaignData(data)
  }

  public UpdateCampaignData(data?: ICampaignItemData) {
    this.Notes = data?.notes || ''
    this.Sections = data?.sections || []
    this.Links = data?.links || []
    this.Labels = data?.labels || []
    this.Clocks = data?.clocks ? data.clocks.map(c => new Clock(c)) : []
    this.Tables = data?.tables ? data.tables.map(t => new RollableTable(t)) : []
  }

  public AddSection(s: ISectionData) {
    this.Sections.push(s)
  }

  public DeleteSection(s: ISectionData) {
    const idx = this.Sections.findIndex(x => x.body === s.body && x.header === s.header)
    if (idx === -1) return
    this.Sections.splice(idx, 1)
  }

  public AddClock(c?: IClockData) {
    this.Clocks.push(new Clock(c ? c : { title: 'New Clock' }))
  }

  public DeleteClock(c: Clock) {
    const idx = this.Clocks.findIndex(x => x.ID === c.ID)
    if (idx === -1) return
    this.Clocks.splice(idx, 1)
  }

  public AddTable(t?: IRollableTableData) {
    this.Tables.push(new RollableTable(t ? t : { title: 'New Table' }))
  }

  public DeleteTable(t: RollableTable) {
    const idx = this.Tables.findIndex(x => x.ID === t.ID)
    if (idx === -1) return
    this.Tables.splice(idx, 1)
  }

  public AddRelationship(type: string, r: IRelationshipData) {
    if (!Array.isArray(this[type])) return
    this[type].push(r)
  }

  public DeleteRelationship(type: string, r: IRelationshipData) {
    if (!Array.isArray(this[type])) return
    const idx = this[type].findIndex(x => r.name === x.name && r.relationship === x.relationship)
    if (idx === -1) return
    this[type].splice(idx, 1)
  }

  public static Serialize(item: CampaignItem): ICampaignItemData {
    return {
      notes: item.Notes,
      sections: item.Sections,
      links: item.Links,
      labels: item.Labels,
      clocks: item.Clocks.map(x => Clock.Serialize(x)),
      tables: item.Tables.map(x => RollableTable.Serialize(x)),
    }
  }

}

export {
  ICampaignItemData,
  CampaignItem
}