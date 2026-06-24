import { v4 as uuid } from 'uuid'
import { snakeCase, kebabCase, cloneDeep } from 'lodash-es'
import { getActivePinia } from 'pinia'
import { localize } from '@/i18n/localize'
import { ItemType } from './enums'
import type { MechEquipment } from './mech/components/equipment/MechEquipment'
import type { MechSystem } from './mech/components/equipment/MechSystem'
import type { MechWeapon } from './mech/components/equipment/MechWeapon'
import Tag, { ITagData } from './Tag'
import { IActionData, Action } from './Action'
import { IBonusData, Bonus } from './components/feature/bonus/Bonus'
import { ISynergyData, Synergy } from './components/feature/synergy/Synergy'
import { Deployable, IDeployableData } from './components/feature/deployable/Deployable'
import { BrewInfo } from './components/brew/BrewController'
import type { ContentPack } from './ContentPack'
import { DEFAULT_LCP_NAME } from './LcpItemMixin'
import { ActiveEffect, IActiveEffectData } from './components/feature/active_effects/ActiveEffect'
import { ICounterData } from './components'

interface CompendiumLookup {
  MechWeapons: MechEquipment[]
  MechSystems: MechEquipment[]
  WeaponMods: MechEquipment[]
  PilotGear: CompendiumItem[]
}

function getCompendiumLookup(): CompendiumLookup | undefined {
  const pinia = getActivePinia()
  if (!pinia) return undefined
  // Access Pinia's internal store map to avoid importing the store (circular dep)
  const stores = (pinia as unknown as { _s: Map<string, unknown> })._s
  return stores?.get('compendium') as CompendiumLookup | undefined
}

interface ICompendiumItemData {
  id: string
  name: string
  description: string
  active_effects?: IActiveEffectData[]
  actions?: IActionData[]
  bonuses?: IBonusData[]
  synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  special_equipment?: string[]
  integrated?: string[]
  tags?: ITagData[]
  flavorDescription?: string
  brew?: BrewInfo
  deprecated?: boolean

  currentUses?: number
  maxUses?: number
  destroyed?: boolean
  isUsed?: boolean
}

abstract class CompendiumItem {
  public readonly InstanceID: string
  public readonly ItemData: ICompendiumItemData
  public FromInstance: boolean = false
  public ItemType: ItemType
  public readonly Brew: BrewInfo
  public readonly LcpName: string = ''
  public readonly LcpAuthor: string = ''
  public readonly InLcp: boolean = false
  public readonly ID: string
  public ActiveEffects: ActiveEffect[] = []
  public Actions: Action[] = []
  public Bonuses: Bonus[] = []
  public Synergies: Synergy[] = []
  public Deployables: Deployable[] = []
  public Counters: ICounterData[] = []
  public readonly Err: string = ''
  public IsHidden: boolean = false
  public IsDeprecated: boolean = false
  public IsExotic: boolean = false
  public IntegratedOrigin: CompendiumItem | null = null
  public HeatCost: number = 0
  public DangerZone: boolean = false
  protected _special_equipment: string[] = []
  protected _integrated: string[] = []
  protected _name: string = 'Compendium Item'
  protected _description: string = 'No description'
  protected _note: string = ''
  protected _flavor_name: string = ''
  protected _flavor_description: string = ''
  private _baseTags: Tag[] = []

  // combat props
  public MaxUses: number = 0
  public Uses: number = 0
  public Used: boolean = false
  public Destroyed: boolean = false

  public constructor(data?: ICompendiumItemData, lcp?: ContentPack) {
    this.InstanceID = uuid()
    this.ItemType = ItemType.None
    this.ItemData = data || ({} as ICompendiumItemData)
    if (data) {
      this.ID = data.id
      if (data.id && data.id.includes('missing_')) {
        this.IsHidden = true
      }
      this._name = data.name
      this._flavor_name = ''
      this._description = data.description || ''
      this._flavor_description = data.flavorDescription || ''
      this.Brew = {
        LcpId: '',
        LcpName: DEFAULT_LCP_NAME,
        LcpVersion: '',
        Website: '',
        Status: 'OK',
        V3: true,
      }
      if (data.brew) {
        this.Brew = data.brew
      }
      if (lcp) {
        this.Brew = {
          LcpId: lcp.ID,
          LcpName: lcp.Name,
          LcpVersion: lcp.Version,
          Website: lcp.Website || '',
          Status: 'OK',
          V3: lcp.v3 || false,
        }
        this.ItemData.brew = this.Brew
      }
      this.InLcp = !!lcp
      this.LcpName = lcp?.Name || DEFAULT_LCP_NAME
      this.LcpAuthor = lcp?.Author || 'Massif Press'
      this._baseTags = Tag.Deserialize(data.tags || [], lcp?.Data.tags || [], lcp?.Name || '')
      this.IsExotic = this._baseTags.some(x => x.IsExotic)
      this.DangerZone = this._baseTags.some(x => x.IsDangerZone)
      const heatTag = this.Tags.find(x => x.IsHeatCost)
      this.HeatCost = Number(heatTag ? heatTag.Value : 0)
      this.ActiveEffects = data.active_effects
        ? data.active_effects.map(x => new ActiveEffect(x, this))
        : []
      if (data.actions && !Array.isArray(data.actions)) data.actions = [data.actions]
      this.Actions = data.actions
        ? data.actions.map(x => new Action(x, data.name, this.HeatCost))
        : []
      this.Bonuses = data.bonuses ? data.bonuses.map(x => new Bonus(x, this._name)) : []
      this.Synergies = data.synergies ? data.synergies.map(x => new Synergy(x, data.name)) : []
      this.Deployables = data.deployables ? data.deployables.map(x => new Deployable(x)) : []
      if (data.deployables) {
        this.Actions = this.Actions.concat(
          data.deployables.map(d => Action.CreateDeployAction(d, this._name))
        )
      }
      this.Counters = data.counters ? data.counters : []
      this._integrated = data.integrated ? data.integrated : []
      this._special_equipment = data.special_equipment ? data.special_equipment : []
      this.Err = ''
      if (data.deprecated) {
        this.Name = `[Deprecated] ${this.Name}`
        this._description = `*This item is deprecated and can be safely removed.*\n\n${this.Description}`
        this.IsDeprecated = true
        this.IsHidden = true
      }

      // combat props
      if (data.maxUses) this.MaxUses = data.maxUses
      if (data.currentUses) this.Uses = data.currentUses
      if (data.destroyed) this.Destroyed = data.destroyed
      if (data.isUsed) this.Used = data.isUsed
    } else {
      this.ID = `err_${uuid()}`
      this._name = this._description = this._note = ''
      this.Brew = {} as BrewInfo
      this.Err = 'Item data not found!'
    }
  }

  public static Clone(item: CompendiumItem): CompendiumItem {
    return cloneDeep(item)
  }

  public Use(): void {
    if (!this.Used && this.Uses < this.MaxUses) {
      this.Uses++
    } else if (this.Used && this.Uses > 0) {
      this.Uses--
    }
    this.Used = !this.Used
  }

  public get Name(): string {
    return this._flavor_name ? this._flavor_name : localize(this.ID, 'name', this._name)
  }

  public set Name(val: string) {
    this._flavor_name = val
  }

  public set FlavorName(val: string) {
    this._flavor_name = val
  }

  public get FlavorName(): string {
    return this._flavor_name
  }

  public get TrueName(): string {
    return this._name
  }

  public get Description(): string {
    return localize(this.ID, 'description', this._description) || this.FlavorDescription || ''
  }

  public set FlavorDescription(val: string) {
    this._flavor_description = val
  }

  public get FlavorDescription(): string {
    return this._flavor_description
  }

  public get SpecialEquipment(): CompendiumItem[] {
    if (!this._special_equipment) return []
    const cs = getCompendiumLookup()
    if (!cs) return []
    return this._special_equipment
      .map(x => {
        return (
          cs.MechWeapons.find(item => item.ID === x) ||
          cs.MechSystems.find(item => item.ID === x) ||
          cs.WeaponMods.find(item => item.ID === x) ||
          cs.PilotGear.find(item => item.ID === x)
        )
      })
      .filter((x): x is CompendiumItem => !!x)
  }

  public get IntegratedEquipment(): MechEquipment[] {
    if (!this._integrated) return []
    const cs = getCompendiumLookup()
    if (!cs) return []
    const map = this._integrated
      .map(x => {
        return (
          cs.MechWeapons.find(item => item.ID === x) || cs.MechSystems.find(item => item.ID === x)
        )
      })
      .filter((x): x is MechEquipment => x != null)

    map.forEach(x => {
      x.IsIntegrated = true
      x.IntegratedOrigin = this
    })
    return map
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this.IntegratedEquipment.filter(x => x.ItemType === ItemType.MechWeapon) as MechWeapon[]
  }

  public get IntegratedSystems(): MechSystem[] {
    return this.IntegratedEquipment.filter(x => x.ItemType === ItemType.MechSystem) as MechSystem[]
  }

  public get Tags(): Tag[] {
    return [...this._baseTags, ...Tag.Populate(this)]
  }

  public get Note(): string {
    return this._note
  }

  public set Note(note: string) {
    this._note = note
  }

  public get Icon(): string {
    const name = snakeCase(this.ItemType.toLowerCase().replace(/mech|pilot/gm, ''))
    return 'cc:' + (name || 'generic_item')
  }

  public get Color(): string {
    return kebabCase(this.ItemType)
  }

  public get IsV2(): boolean {
    return !this.Brew.V3
  }
}

export { CompendiumItem }
export type { ICompendiumItemData }
