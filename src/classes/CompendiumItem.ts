import { store } from '@/store'
import { ItemType, MechEquipment, MechWeapon, MechSystem, Tag } from '@/class'
import { ICounterData, ITagCompendiumData } from '@/interface'
import _ from 'lodash'
import { IActionData, Action } from './Action'
import { IBonusData, Bonus } from './Bonus'
import { ISynergyData, Synergy } from './Synergy'
import { IDeployableData } from './Deployable'

interface ICompendiumItemData {
  id: string
  name: string
  description: string
  actions?: IActionData[]
  bonuses?: IBonusData[]
  synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  special_equipment?: string[]
  integrated?: string[]
  brew?: string
  tags?: ITagData[]
}

abstract class CompendiumItem {
  public ItemType: ItemType
  public readonly Brew: string
  public readonly LcpName: string
  public readonly InLcp: boolean
  public readonly ID: string
  public readonly Actions: Action[]
  public readonly Bonuses: Bonus[]
  public readonly Synergies: Synergy[]
  public readonly Deployables: IDeployableData[]
  public readonly Counters: ICounterData[]
  // public readonly Tags: Tag[]
  public readonly Err: string
  public IsHidden: boolean
  public IsExotic: boolean
  private _integrated: string[]
  private _special_equipment: string[]
  private _baseTags: Tag[]
  protected _name: string
  protected _description: string
  protected _note: string
  protected _flavor_name: string
  protected _flavor_description: string

  public constructor(
    data?: ICompendiumItemData,
    packTags?: ITagCompendiumData[],
    packName?: string
  ) {
    this.ItemType = ItemType.None
    if (data) {
      this.ID = data.id
      if (data.id && data.id.includes('missing_')) {
        this.IsHidden = true
      }
      this._name = data.name
      this._description = data.description || ''
      this.Brew = data.brew || 'Core'
      this.LcpName = packName || 'LANCER Core Book'
      this.InLcp = packName ? true : false
      this._baseTags = Tag.Deserialize(data.tags, packTags)
      this.IsExotic = this._baseTags.some(x => x.IsExotic)
      const heatTag = this.Tags.find(x => x.IsHeatCost)
      const heatCost = Number(heatTag ? heatTag.Value : 0)
      this.Actions = data.actions
        ? data.actions.map(x => new Action(x, data.name, heatCost))
        : []
      this.Bonuses = data.bonuses ? data.bonuses.map(x => new Bonus(x)) : []
      this.Synergies = data.synergies ? data.synergies.map(x => new Synergy(x, data.name)) : []
      this.Deployables = data.deployables ? data.deployables : []
      if (data.deployables) {
        this.Actions = this.Actions.concat(
          data.deployables.map(d => Action.CreateDeployAction(d, this._name))
        )
      }
      this.Counters = data.counters ? data.counters : []
      this._integrated = data.integrated ? data.integrated : []
      this._special_equipment = data.special_equipment ? data.special_equipment : []
      this.Err = ''
    } else {
      this.ID = `err_${Math.random()
        .toString(36)
        .substring(2)}`
      this._name = this._description = this._note = this.Brew = ''
      this.Actions = this.Bonuses = this.Synergies = this.Deployables = this.Counters = this._baseTags = []
      this.Err = 'Item data not found!'
    }
  }

  protected save(): void {
    store.dispatch('saveData')
  }

  public get Name(): string {
    return this._flavor_name ? this._flavor_name : this._name
  }

  public set Name(val: string) {
    this._flavor_name = val
    this.save()
  }

  public get FlavorName(): string {
    return this._flavor_name
  }

  public get TrueName(): string {
    return this._name
  }

  public get Description(): string {
    return this._flavor_description ? this._flavor_description : this._description
  }

  public set Description(val: string) {
    this._flavor_description = val
    this.save()
  }

  public get SpecialEquipment(): CompendiumItem[] {
    if (!this._special_equipment) return []
    const res = this._special_equipment.map(x => {
      const w = store.getters.referenceByID('MechWeapons', x)
      if (w && !w.err) return w
      const s = store.getters.referenceByID('MechSystems', x)
      if (s && !s.err) return s
      const wm = store.getters.referenceByID('WeaponMods', x)
      if (wm && !wm.err) return wm
      const pg = store.getters.referenceByID('PilotGear', x)
      if (pg && !pg.err) return pg
      return false
    })
    return res.filter(x => x)
  }

  public get IntegratedEquipment(): MechEquipment[] {
    if (!this._integrated) return []
    return this._integrated.map(x => {
      const w = store.getters.referenceByID('MechWeapons', x)
      if (w.Name) return w
      return store.getters.referenceByID('MechSystems', x)
    })
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated
      .map(x => store.getters.referenceByID('MechWeapons', x))
      .filter(x => !x.err)
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated
      .map(x => store.getters.referenceByID('MechSystems', x))
      .filter(x => !x.err)
  }

  public get Tags(): Tag[] {
    return this._baseTags.concat(Tag.Populate(this))
  }

  public get Note(): string {
    return this._note
  }

  public set Note(note: string) {
    this._note = note
    this.save()
  }

  public get Icon(): string {
    return 'cci-' + _.kebabCase(this.ItemType)
  }

  public get Color(): string {
    return _.kebabCase(this.ItemType)
  }
}

export { CompendiumItem, ICompendiumItemData }
