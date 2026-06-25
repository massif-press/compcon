import { CompendiumStore } from '@/features/compendium/store'
import { CompendiumItem } from '../../../CompendiumItem'
import { MechSystem } from '../equipment/MechSystem'
import { MechWeapon } from '../equipment/MechWeapon'
import { IActionData, Action } from '../../../Action'
import { IBonusData, Bonus } from '../../../components/feature/bonus/Bonus'
import { ISynergyData, Synergy } from '../../../components/feature/synergy/Synergy'
import { ICounterData } from '../../../components/combat/counters/Counter'
import { MechEquipment } from '../equipment/MechEquipment'
import { Deployable, IDeployableData } from '../../../components/feature/deployable/Deployable'
import {
  ActiveEffect,
  IActiveEffectData,
} from '@/classes/components/feature/active_effects/ActiveEffect'
import { localize } from '@/i18n/localize'
import { keyPrefixes } from '@/i18n/contentKeys'

interface IFrameTraitData {
  name: string
  description: string
  actions?: IActionData[]
  bonuses?: IBonusData[]
  synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  integrated?: string[]
  special_equipment?: string[]
  active_effects?: IActiveEffectData[]
}

class FrameTrait {
  private readonly _name: string
  private readonly _description: string
  private readonly _lkey?: string
  public readonly ActiveEffects: ActiveEffect[]
  public readonly Actions: Action[]
  public readonly Bonuses: Bonus[]
  public readonly Synergies: Synergy[]
  public readonly Deployables: Deployable[]
  public readonly Counters: ICounterData[]
  private _integrated: string[]
  private _special_equipment: string[]

  public constructor(data: IFrameTraitData) {
    this._name = data.name
    this._description = data.description || ''
    this._lkey = keyPrefixes.get(data as object)
    this.ActiveEffects = data.active_effects
      ? data.active_effects.map(x => new ActiveEffect(x, this))
      : []
    this.Actions = data.actions ? data.actions.map(x => new Action(x)) : []
    this.Bonuses = data.bonuses
      ? data.bonuses.map(x => new Bonus(x, `${this._name} (Frame Trait)`))
      : []

    this.Synergies = data.synergies ? data.synergies.map(x => new Synergy(x, 'Frame Trait')) : []
    this.Deployables = data.deployables ? data.deployables.map(x => new Deployable(x)) : []
    if (data.deployables) {
      this.Actions = this.Actions.concat(
        data.deployables.map(d => Action.CreateDeployAction(d, this._name))
      )
    }
    this.Counters = data.counters ? data.counters : []
    this._integrated = data.integrated ? data.integrated : []
    this._special_equipment = data.special_equipment || []
  }

  public get Name(): string {
    return this._lkey ? localize(this._lkey, 'name', this._name) : this._name
  }

  public get Description(): string {
    return this._lkey ? localize(this._lkey, 'description', this._description) : this._description
  }

  public get SpecialEquipment(): CompendiumItem[] {
    if (!this._special_equipment) return []
    const res = this._special_equipment.map(x => {
      const w = CompendiumStore().MechWeapons.find(item => item.ID === x)
      if (w) return w
      const s = CompendiumStore().MechSystems.find(item => item.ID === x)
      if (s) return s
      const wm = CompendiumStore().WeaponMods.find(item => item.ID === x)
      if (wm) return wm
      const pg = CompendiumStore().PilotGear.find(item => item.ID === x)
      if (pg) return pg
      return false
    })
    return res as CompendiumItem[]
  }

  public get IntegratedEquipment(): MechEquipment[] {
    if (!this._integrated) return []
    return this._integrated.map(x => {
      const w = CompendiumStore().MechWeapons.find(item => item.ID === x)
      if (w) return w as MechEquipment
      return CompendiumStore().MechSystems.find(item => item.ID === x) as MechEquipment
    }) as MechEquipment[]
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._integrated
      .map(x => CompendiumStore().MechWeapons.find(item => item.ID === x))
      .filter(x => !!x) as MechWeapon[]
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._integrated
      .map(x => CompendiumStore().MechSystems.find(item => item.ID === x))
      .filter(x => !!x) as MechSystem[]
  }
}

export { FrameTrait }
export type { IFrameTraitData }
