import { store } from '@/store'

interface ISitrepData {
  name: string
  description: string
  conditions: { title: string; condition: string }[]
  deployment?: string
  objective?: string
  controlZone?: string
  extraction?: string
}

class SitrepData {
  Name: string
  Conditions: { title: string; condition: string }[]
  Description = ''
  Deployment = ''
  Objective = ''
  ControlZone = ''
  Extraction = ''

  constructor(id?: string, hydrate?: boolean) {
    if (hydrate) return
    let s
    if (id) {
      s = store.getters.referenceByID('Sitreps', id) as Sitrep
    } else {
      s = store.getters.getItemCollection('Sitreps')[0] as Sitrep
    }
    this.Name = s.name
    this.Description = s.description
    this.Conditions.push({ title: 'PC Victory', condition: s.pcVictory })
    this.Conditions.push({ title: 'Enemy Victory', condition: s.enemyVictory })
    if (s.noVictory) this.Conditions.push({ title: 'Stalemate', condition: s.noVictory })
    this.Deployment = s.deployment || ''
    this.Objective = s.objective || ''
    this.ControlZone = s.controlZone || ''
    this.Extraction = s.extraction || ''
  }

  public static Serialize(s: SitrepData): ISitrepData {
    return {
      name: s.Name,
      conditions: s.Conditions,
      description: s.Description,
      deployment: s.Deployment,
      objective: s.Objective,
      controlZone: s.ControlZone,
      extraction: s.Extraction,
    }
  }

  public static Deserialize(data: ISitrepData): SitrepData {
    const s = new SitrepData('', true)
    s.Name = data.name
    s.Conditions = data.conditions
    s.Description = data.description
    s.Deployment = data.deployment
    s.Objective = data.objective
    s.ControlZone = data.controlZone
    s.Extraction = data.extraction
    return s
  }
}

export { ISitrepData, SitrepData }
