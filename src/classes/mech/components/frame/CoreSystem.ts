import { CompendiumStore } from '@/features/compendium/store'
import { ActivationType, Duration } from '../../../enums'
import { MechSystem } from '../equipment/MechSystem'
import { MechWeapon } from '../equipment/MechWeapon'
import { resolveSpecialEquipment, resolveIntegratedEquipment } from '../../../components/_equipmentUtils'
import Tag, { ITagData } from '../../../Tag'
import { IActionData, Action } from '../../../Action'
import { IBonusData, Bonus } from '../../../components/feature/bonus/Bonus'
import { ISynergyData, Synergy } from '../../../components/feature/synergy/Synergy'
import { ICounterData } from '../../../components/combat/counters/Counter'
import { MechEquipment } from '../equipment/MechEquipment'
import { Deployable, IDeployableData } from '../../../components/feature/deployable/Deployable'
import { CompendiumItem } from '../../../CompendiumItem'
import {
  ActiveEffect,
  IActiveEffectData,
} from '@/classes/components/feature/active_effects/ActiveEffect'
import { localize } from '@/i18n/localize'
import { keyPrefixes } from '@/i18n/contentKeys'

interface ICoreData {
  name: string
  description: string
  active_name: string
  active_effect: string
  activation: ActivationType
  deactivation?: ActivationType
  use?: Duration
  duration?: string
  active_effects?: IActiveEffectData[]
  active_actions?: IActionData[]
  active_bonuses?: IBonusData[]
  active_synergies?: ISynergyData[]
  active_deployables?: IDeployableData[]
  active_counters?: ICounterData[]
  passive_name?: string
  passive_effects?: IActiveEffectData[]
  passive_effect?: string
  passive_actions?: IActionData[]
  passive_bonuses?: IBonusData[]
  passive_synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  integrated?: string[]
  special_equipment?: string[]
  tags: ITagData[]
}

class CoreSystem {
  private readonly _name: string
  private readonly _description: string
  private readonly _lkey?: string
  public readonly Activation: ActivationType
  public readonly ActivateAction: Action
  private readonly _activeName: string
  private readonly _activeEffect: string
  public readonly CoreActiveEffects: ActiveEffect[]
  public readonly ActiveActions: Action[]
  public readonly ActiveBonuses: Bonus[]
  public readonly ActiveSynergies: Synergy[]
  public readonly ActiveDeployables: Deployable[]
  public readonly ActiveCounters: ICounterData[]
  public readonly Deactivation?: ActivationType
  public Use: Duration
  public readonly Duration: Duration
  private readonly _passiveName: string
  private readonly _passiveEffect: string
  public readonly PassiveEffects: ActiveEffect[]
  public readonly PassiveActions: Action[]
  public readonly PassiveBonuses: Bonus[]
  public readonly PassiveSynergies: Synergy[]
  public readonly Deployables: Deployable[]
  public readonly DeployActions: Action[] = []
  public readonly Counters: ICounterData[]
  public readonly Actions: Action[]

  public Energy: number

  private _integrated: string[]
  private _special_equipment: string[]
  private _tags: ITagData[]

  public constructor(data: ICoreData) {
    this._name = data.name
    this._description = data.description || ''
    this._lkey = keyPrefixes.get(data as object)
    this._activeName = data.active_name
    this._activeEffect = data.active_effect
    this.Activation = data.activation
    this.CoreActiveEffects = data.active_effects
      ? data.active_effects.map(x => new ActiveEffect(x, this))
      : []
    this.ActiveActions = data.active_actions ? data.active_actions.map(x => new Action(x)) : []
    this.ActiveBonuses = data.active_bonuses
      ? data.active_bonuses.map(x => new Bonus(x, `${this._name} (ACTIVE)`))
      : []
    this.ActiveSynergies = data.active_synergies
      ? data.active_synergies.map(x => new Synergy(x, 'Frame CORE System (Active)'))
      : []
    this.ActiveDeployables = data.active_deployables
      ? data.active_deployables.map(x => new Deployable(x))
      : []
    this.ActiveCounters = data.active_counters ? data.active_counters : []
    if (data.deactivation) this.Deactivation = data.deactivation
    this.Duration = data.use ? (data.use as Duration) : Duration.Mission
    this._passiveName = data.passive_name || ''
    this._passiveEffect = data.passive_effect || ''
    this.PassiveEffects = data.passive_effects
      ? data.passive_effects.map(x => new ActiveEffect(x, this))
      : []
    this.PassiveActions = data.passive_actions ? data.passive_actions.map(x => new Action(x)) : []
    this.PassiveBonuses = data.passive_bonuses
      ? data.passive_bonuses.map(x => new Bonus(x, `${this._name} (PASSIVE)`))
      : []
    this.PassiveSynergies = data.passive_synergies
      ? data.passive_synergies.map(x => new Synergy(x, 'Frame CORE System (Passive)'))
      : []
    this.Actions = this.getActions()
    this.Deployables = data.deployables ? data.deployables.map(x => new Deployable(x)) : []
    if (data.deployables) {
      this.Actions = this.Actions.concat(
        data.deployables.map(d => Action.CreateDeployAction(d, this._name))
      )
    }
    this.Counters = data.counters ? data.counters : []
    this._integrated = data.integrated ? data.integrated : []
    this._special_equipment = data.special_equipment || []
    this._tags = data.tags
    this.ActivateAction = new Action(
      {
        id: `core_active_activate`,
        name: `Activate ${this._activeName}`,
        activation: this.Activation,
        detail: this._activeEffect,
        mech: true,
        hide_active: true,
      },
      'Frame CORE System'
    )
    this.Duration = (data.duration as Duration) || Duration.Mission
    this.Use = data.use ? (data.use as Duration) : Duration.Mission

    this.Energy = 1
  }

  public get Name(): string {
    return this._lkey ? localize(this._lkey, 'name', this._name) : this._name
  }
  public get Description(): string {
    return this._lkey ? localize(this._lkey, 'description', this._description) : this._description
  }
  public get ActiveName(): string {
    return this._lkey ? localize(this._lkey, 'active_name', this._activeName) : this._activeName
  }
  public get ActiveEffect(): string {
    return this._lkey
      ? localize(this._lkey, 'active_effect', this._activeEffect)
      : this._activeEffect
  }
  public get PassiveName(): string {
    return this._lkey ? localize(this._lkey, 'passive_name', this._passiveName) : this._passiveName
  }
  public get PassiveEffect(): string {
    return this._lkey
      ? localize(this._lkey, 'passive_effect', this._passiveEffect)
      : this._passiveEffect
  }

  // private activeFeatures(type: string): any[] {
  //   return this[`Passive${type}`].concat(this.IsActive ? this[`Active${type}`] : []);
  // }

  private Features(type: string): any[] {
    return []
  }

  public get Bonuses(): Bonus[] {
    return []
  }

  public get Synergies(): Synergy[] {
    return []
  }

  public getActions(): Action[] {
    const arr = this.Features('Actions')
    arr.push(this.ActivateAction)
    return arr
  }

  public get SpecialEquipment(): CompendiumItem[] {
    return resolveSpecialEquipment(this._special_equipment)
  }

  public get IntegratedEquipment(): MechEquipment[] {
    return resolveIntegratedEquipment(this._integrated)
  }

  public get PassiveIntegratedWeapons(): MechWeapon[] {
    return this.IntegratedWeapons
  }

  public get PassiveCounters(): ICounterData[] {
    return this.Counters
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated
      .map(x => CompendiumStore().MechWeapons.find(item => item.ID === x))
      .filter(x => !!x) as MechWeapon[]
  }

  public get PassiveIntegratedSystems(): MechSystem[] {
    return this.IntegratedSystems
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated
      .map(x => CompendiumStore().MechSystems.find(item => item.ID === x))
      .filter(x => !!x) as MechSystem[]
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this._tags)
  }
}

export { CoreSystem }
export type { ICoreData }
