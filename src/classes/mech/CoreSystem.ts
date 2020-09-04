import { store } from '@/store'
import { MechWeapon, Tag, ActivationType, Duration, MechSystem } from '@/class'
import { IActionData, Action } from '../Action'
import { IBonusData, Bonus } from '../Bonus'
import { ISynergyData, Synergy } from '../Synergy'
import { ICounterData } from '../Counter'
import { MechEquipment } from './MechEquipment'
import { IDeployableData } from '../Deployable'

interface ICoreData {
  name: string
  description: string
  active_name: string
  active_effect: string
  activation: ActivationType
  deactivation?: ActivationType
  use?: Duration
  active_actions?: IActionData[]
  active_bonuses?: IBonusData[]
  active_synergies?: ISynergyData[]
  passive_name?: string
  passive_effect?: string
  passive_actions?: IActionData[]
  passive_bonuses?: IBonusData[]
  passive_synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  integrated?: string[]
  tags: ITagData[]
}

class CoreSystem {
  public readonly Name: string
  public readonly Description: string
  public readonly Activation: ActivationType
  public readonly ActiveName: string
  public readonly ActiveEffect: string
  public readonly ActiveActions: Action[]
  public readonly ActiveBonuses: Bonus[]
  public readonly ActiveSynergies: Synergy[]
  public readonly Deactivation?: ActivationType
  public readonly Use: Duration
  public readonly PassiveName: string
  public readonly PassiveEffect: string
  public readonly PassiveActions: Action[]
  public readonly PassiveBonuses: Bonus[]
  public readonly PassiveSynergies: Synergy[]
  public readonly Deployables: IDeployableData[]
  public readonly Counters: ICounterData[]
  private _integrated: string[]
  private _tags: ITagData[]

  public constructor(data: ICoreData) {
    this.Name = data.name
    this.Description = data.description || ''
    this.ActiveName = data.active_name
    this.ActiveEffect = data.active_effect
    this.Activation = data.activation
    this.ActiveActions = data.active_actions ? data.active_actions.map(x => new Action(x)) : []
    this.ActiveBonuses = data.active_bonuses ? data.active_bonuses.map(x => new Bonus(x)) : []
    this.ActiveSynergies = data.active_synergies
      ? data.active_synergies.map(x => new Synergy(x))
      : []
    if (data.deactivation) this.Deactivation = data.deactivation
    this.Use = data.use ? (data.use as Duration) : Duration.Mission
    this.PassiveName = data.passive_name || ''
    this.PassiveEffect = data.passive_effect || ''
    this.PassiveActions = data.passive_actions ? data.passive_actions.map(x => new Action(x)) : []
    this.PassiveBonuses = data.passive_bonuses ? data.passive_bonuses.map(x => new Bonus(x)) : []
    this.PassiveSynergies = data.passive_synergies
      ? data.passive_synergies.map(x => new Synergy(x))
      : []
    this.Deployables = data.deployables ? data.deployables : []
    this.Counters = data.counters ? data.counters : []
    this._integrated = data.integrated ? data.integrated : []
    this._tags = data.tags
  }

  public get IntegratedEquipment(): MechEquipment[] {
    if (!this._integrated) return []
    return this._integrated.map(x => {
      const w = store.getters.referenceByID('MechWeapons', x)
      if (w) return w
      return store.getters.referenceByID('MechSystems', x)
    })
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated.map(x => store.getters.referenceByID('MechWeapons', x))
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated.map(x => store.getters.referenceByID('MechSystems', x))
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }
}

export { CoreSystem, ICoreData }
