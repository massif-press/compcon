import { store } from '@/store'
import { MechWeapon, Duration, MechSystem, CompendiumItem } from '@/class'
import { IActionData, Action } from '../Action'
import { IBonusData, Bonus } from '../Bonus'
import { ISynergyData, Synergy } from '../Synergy'
import { ICounterData } from '../components/counters/Counter'
import { MechEquipment } from './MechEquipment'
import { IDeployableData } from '../Deployable'

interface IFrameTraitData {
  name: string
  description: string
  use?: Duration
  actions?: IActionData[]
  bonuses?: IBonusData[]
  synergies?: ISynergyData[]
  deployables?: IDeployableData[]
  counters?: ICounterData[]
  integrated?: string[]
  special_equipment?: string[]
}

class FrameTrait {
  public readonly Name: string
  public readonly Description: string
  public readonly Use: Duration
  public readonly Actions: Action[]
  public readonly Bonuses: Bonus[]
  public readonly Synergies: Synergy[]
  public readonly Deployables: IDeployableData[]
  public readonly Counters: ICounterData[]
  private _integrated: string[]
  private _special_equipment: string[]

  public constructor(data: IFrameTraitData) {
    this.Name = data.name
    this.Description = data.description || ''
    this.Use = data.use ? (data.use as Duration) : Duration.Mission
    this.Actions = data.actions ? data.actions.map(x => new Action(x)) : []
    this.Bonuses = data.bonuses ? data.bonuses.map(x => new Bonus(x)) : []
    this.Synergies = data.synergies ? data.synergies.map(x => new Synergy(x, 'Frame Trait')) : []
    this.Deployables = data.deployables ? data.deployables : []
    this.Counters = data.counters ? data.counters : []
    this._integrated = data.integrated ? data.integrated : []
    this._special_equipment = data.special_equipment || []
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
}

export { FrameTrait, IFrameTraitData }
