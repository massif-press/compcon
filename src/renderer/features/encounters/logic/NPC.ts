import NPCClass from './interfaces/NPCClass'
import { NPCSystem } from './interfaces/NPCSystem'
import NPCTemplate from './interfaces/NPCTemplate'
import NPCStats from './NPCStats'
import data from 'lancer-data'

import _ from 'lodash'

export interface INPCData {
  id: string
  class: string
  tier: number
  name?: string
  templates: string[]
  systems: string[]
  size?: number
  stats?: {
    hp: number
    evade: number
    edef: number
    heatcap: number
    hull: number
    agility: number
    systems: number
    engineering: number
    armor: number
    speed: number
    sensor: number
    save: number
    structure: number
    stress: number
    statcaps: { [key: string]: number }
  }
}

const npcClasses: NPCClass[] = data.npc_classes
const systems: NPCSystem.Any[] = data.npc_systems
const genericSystems: NPCSystem.Any[] = data.npc_generic_systems
const templates: NPCTemplate[] = require('./templates').default
const templateSystems: NPCSystem.Any[] = data.npc_template_systems

export default class NPC {
  id: string
  npcClass: NPCClass
  tier: 0 | 1 | 2
  _name?: string
  notes?: string
  size: number
  stats: NPCStats
  static allSystems = systems.concat(genericSystems).concat(templateSystems)

  private _pickedSystems: NPCSystem.Any[] = []
  _templates: string[] = []

  constructor(npcClass: NPCClass, stats?: NPCStats, tier?: 0 | 1 | 2, id?: string) {
    if (id) {
      this.id = id
    } else {
      this.id = Math.random()
        .toString(36)
        .substr(2, 12)
    }
    this.npcClass = npcClass
    this.tier = tier || 0
    this.size = this.npcClass.size[0]

    if (stats) {
      this.stats = stats
    } else {
      this.stats = (_.cloneDeep(this.npcClass.stats[this.tier]) as unknown) as any
      this.stats.structure = 1
      this.stats.stress = 1
      this.defaultCaps()
    }

    for (const stat in this.stats) {
      if (
        this.stats.statcaps.hasOwnProperty(stat) &&
        this.stats.statcaps[stat] < (this.stats as any)[stat]
      ) {
        this.stats = {
          ...this.stats,
          [stat]: this.stats.statcaps[stat],
        }
      }
    }
  }

  get classSystems() {
    return systems.filter(s => s.class === this.npcClass.name)
  }

  get baseClassSystems() {
    return this.classSystems.filter(s => s.base)
  }

  get optionalClassSystems() {
    return this.classSystems.filter(s => !s.base)
  }

  get genericSystemsAvailable() {
    return genericSystems.filter(s => !this.pickedSystems.includes(s))
  }

  get templateSystemsAvailable() {
    return _.groupBy(
      templateSystems
        .filter(s => this._templates.includes(s.class))
        .filter(s => !this.pickedSystems.includes(s)),
      'class'
    )
  }

  get name() {
    return this._name || this.npcClass.name
  }
  set name(name: string) {
    this._name = name
  }

  defaultCaps() {
    this.stats.statcaps = {
      armor: 4,
      hull: 6,
      agility: 6,
      systems: 6,
      engineering: 6,
    }
  }
  get pickedSystems() {
    return this._pickedSystems
  }
  pickSystem(system: NPCSystem.Any) {
    this._pickedSystems.push(system)
    if (system.hasOwnProperty('stat_bonuses')) {
      const sb = (system as NPCSystem.NonWeapon).stat_bonuses
      for (const stat in sb) {
        this.stats[stat] += sb[stat]
      }
    }
  }
  removeSystem(system: NPCSystem.Any) {
    if (system.hasOwnProperty('stat_bonuses')) {
      const sb = (system as NPCSystem.NonWeapon).stat_bonuses
      for (const stat in sb) {
        this.stats[stat] -= sb[stat]
      }
    }
    this._pickedSystems = this._pickedSystems.filter(sys => sys.name !== system.name)
  }

  get systems() {
    // turn the bare template traits into real trait objects
    const templateTraits: NPCSystem.NonWeapon[] = _.flatten(
      this.templates.map(template =>
        template.traits.map(trait => ({
          ...trait,
          class: template.name,
          type: 'trait',
          base: true,
        }))
      )
    )
    const preSort = this.baseClassSystems.concat(this.pickedSystems).concat(templateTraits)
    return _.orderBy(preSort, ['base', 'type', 'name'], ['desc', 'desc', 'asc'])
  }

  get templates() {
    return _.compact(
      this._templates.map(templateName => _.find(templates, t => t.name === templateName))
    )
  }
  get incompatibleTemplateNames() {
    return _.uniq(_.flatten(this.templates.map(t => t.incompatibleTemplates)))
  }
  incompatibleList(templateName: string) {
    return _.uniq(
      this.templates
        .filter(t => t.incompatibleTemplates.includes(templateName))
        .map(t => t.name)
        .concat(
          templates
            .find(t => t.name === templateName)
            .incompatibleTemplates.filter(t => this._templates.includes(t))
        )
    )
  }

  get availableTemplates(): NPCTemplate[] {
    return _.difference(templates, this.templates)
  }

  addTemplate(templateName: string) {
    if (this.incompatibleTemplateNames.includes(templateName))
      throw new Error(`incompatible template "${templateName}"!`)
    if (this._templates.includes(templateName))
      throw new Error(`NPC already has template "${templateName}"!`)
    const template = _.find(templates, t => t.name === templateName)
    if (!template) throw new Error(`invalid template name "${templateName}"!`)
    if (template.statTransform) {
      for (const stat in template.statTransform) {
        this.stats[stat] += template.statTransform[stat]
      }
    }
    if (template.statCaps) {
      for (const stat in template.statCaps) {
        const cap = template.statCaps[stat]
        if (!this.stats.statcaps[stat] || cap < this.stats.statcaps[stat]) {
          this.stats.statcaps[stat] = cap
        }
        if (this.stats[stat] > this.stats.statcaps[stat]) {
          this.stats[stat] = this.stats.statcaps[stat]
        }
      }
    }
    this._templates.push(templateName)
  }
  removeTemplate(templateName: string) {
    const template = _.find(templates, t => t.name === templateName)
    if (template.statTransform) {
      for (const stat in template.statTransform) {
        this.stats[stat] -= template.statTransform[stat]
      }
    }
    this._templates = _.without(this._templates, templateName)
    this._pickedSystems = this._pickedSystems.filter(sys => sys.class !== templateName)
    // Remove stat caps for the removed template, and search for higher stat caps
    // among remaining templates.
    if (template.statCaps) {
      this.defaultCaps()
      // Check all templates for stat caps.
      for (const t of this.templates) {
        if (t.statCaps) {
          for (const stat in t.statCaps) {
            const cap = template.statCaps[stat]
            if (cap === undefined || t.statCaps[stat] < cap) {
              this.stats.statcaps[stat] = cap
            }
          }
        }
      }
    }
  }

  templateIsIncompatible(templateName: string) {
    const template = templates.find(t => t.name === templateName)
    const incompatibleNpcTemplates = (template && template.incompatibleTemplates) || []
    return (
      (this.incompatibleTemplateNames.includes(templateName) ||
        this._templates.some(tn => incompatibleNpcTemplates.includes(tn))) &&
      this.incompatibleList(templateName)
    )
  }

  hasTemplate(templateName: string) {
    return this._templates.includes(templateName)
  }

  get features() {
    return _.uniqBy(_.flatten(this.templates.map(t => t.features)), 'name')
  }

  public serialize(): INPCData {
    return {
      id: this.id,
      class: this.npcClass.name,
      tier: this.tier,
      name: this._name,
      size: this.size,
      stats: this.stats,
      templates: this._templates,
      systems: this._pickedSystems.map(s => s.name),
    }
  }

  static deserialize(obj: INPCData): NPC {
    const cl = npcClasses.find(c => c.name === obj.class)
    if (!cl) throw new Error('invalid class')
    let npc: NPC = null
    let stats = null
    if (obj.hasOwnProperty('stats')) {
      stats = new NPCStats(obj.stats)
      npc = new NPC(cl, stats, obj.tier as 0 | 1 | 2, obj.id)
    } else {
      npc = new NPC(cl, null, obj.tier as 0 | 1 | 2, obj.id)
      stats = npc.stats
    }
    if (obj.name) npc.name = obj.name
    npc._templates = obj.templates
    for (const sysName of obj.systems) {
      const sys = systems
        .concat(genericSystems)
        .concat(templateSystems)
        .find(s => s.name === sysName)
      if (!sys) throw new Error(`invalid system ${sysName}`)
      npc.pickSystem(sys)
    }
    npc.stats = stats
    if (obj.size) npc.size = obj.size
    return npc
  }
}
