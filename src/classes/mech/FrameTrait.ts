import { store } from '@/store'
import { MechWeapon, Duration, MechSystem } from '@/class'
import { IActionData, Action } from '../Action'
import { IBonusData, Bonus } from '../Bonus'
import { ISynergyData, Synergy } from '../Synergy'
import { ICounterData } from '../Counter'
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

  public constructor(data: IFrameTraitData) {
    this.Name = data.name
    this.Description = data.description || ''
    this.Use = data.use ? (data.use as Duration) : Duration.Mission
    this.Actions = data.actions ? data.actions.map(x => new Action(x)) : []
    this.Bonuses = data.bonuses ? data.bonuses.map(x => new Bonus(x)) : []
    this.Synergies = data.synergies ? data.synergies.map(x => new Synergy(x)) : []
    this.Deployables = data.deployables ? data.deployables : []
    this.Counters = data.counters ? data.counters : []
    this._integrated = data.integrated ? data.integrated : []
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
}

export { FrameTrait, IFrameTraitData }
