import { ActivationType } from '@/class'
import { ICounterData, ISynergyData } from '@/interface'
import uuid from 'uuid/v4'
import { IActionData } from './Action'
import { IBonusData } from './Bonus'
import { ICompendiumItemData, CompendiumItem } from './CompendiumItem'

interface IDeployableData extends ICompendiumItemData {
  name: string
  detail: string
  type: string // this is for UI furnishing only
  activation: ActivationType
  deactivation?: ActivationType
  recall?: ActivationType
  redeploy?: ActivationType
  size: number
  cost?: number
  armor?: number
  hp?: number
  evasion?: number
  edef?: number
  heatcap?: number
  repcap?: number
  sensor_range?: number
  tech_attack?: number
  save?: number
  speed?: number
  actions?: IActionData[]
  bonuses?: IBonusData[]
  synergies?: ISynergyData[]
  counters?: ICounterData[]
  tags?: ITagData[]
}

interface IDeployedData {
  id: string
  assigned_name: string
  current_hp: number
  current_duration?: number
  overshield?: number
  Destroyed?: boolean
}

class Deployable extends CompendiumItem {
  public readonly BaseName: string
  public readonly Type: string
  public readonly Detail: string
  public readonly Size: number
  public readonly MaxHP: number
  public readonly Armor: number
  public readonly Evasion: number
  public readonly EDefense: number
  public readonly Heatcap: number
  public readonly Repcap: number
  public readonly Sensors: number
  public readonly TechAttack: number
  public readonly Save: number
  public readonly Speed: number
  private _current_hp: number
  private _current_heat: number
  private _overshield: number
  private _destroyed: boolean
  private _activation: ActivationType

  public constructor(data: IDeployableData, owner: IActor, n?: number) {
    data.id = `deployable_${uuid()}`
    super(data)
    this.BaseName = `${owner ? `${owner.EncounterName}'s ` : ''}${data.name}${n ? ` (#${n})` : ''}`
    this.Type = data.type || 'Deployable'
    this.Detail = data.detail
    this.Size = data.size
    this.MaxHP = data.hp
    this._current_hp = this.MaxHP
    this.Armor = data.armor || 0
    this.Evasion = data.evasion || 5
    this.EDefense = data.edef || 5
    this.Heatcap = data.heatcap || 0
    this.Repcap = data.repcap || 0
    this.Sensors = data.sensor_range || 0
    this.TechAttack = data.tech_attack || 0
    this.Save = data.save || 0
    this.Speed = data.speed || 0
    this._overshield = 0
    this._current_heat = 0
    this._destroyed = false
    this._activation = data.activation || ActivationType.Quick
  }

  public get Name(): string {
    return this._name ? this._name : this.BaseName
  }

  public set Name(name: string) {
    this._name = name
    this.save()
  }

  public get CurrentHP(): number {
    if (this._current_hp > this.MaxHP) this.CurrentHP = this.MaxHP
    return this._current_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this._current_hp = this.MaxHP
    else if (hp <= 0) {
      this.Destroyed = true
    } else this._current_hp = hp
    this.save()
  }

  public get Overshield(): number {
    return this._overshield
  }

  public set Overshield(val: number) {
    this._overshield = val
    this.save()
  }

  public get CurrentHeat(): number {
    if (this._current_heat > this.Heatcap) this.CurrentHeat = this.Heatcap
    return this._current_heat
  }

  public set CurrentHeat(heat: number) {
    if (heat > this.Heatcap) this._current_heat = this.Heatcap
    else this._current_heat = heat
    this.save()
  }

  public get Destroyed(): boolean {
    return this._destroyed
  }

  public set Destroyed(val: boolean) {
    this._destroyed = val
    this.save()
  }

  public static Serialize(deployable: Deployable): IDeployedData {
    return {
      id: deployable.ID,
      assigned_name: deployable.Name,
      current_hp: deployable.CurrentHP,
      Destroyed: deployable.Destroyed,
    }
  }

  public static Deserialize(base: IDeployableData, owner: IActor, data: IDeployedData): Deployable {
    const d = new Deployable(base, owner)
    d.Name = data.assigned_name
    d.CurrentHP = data.current_hp
    d.Destroyed = data.Destroyed
    return d
  }
}

export { IDeployableData, IDeployedData, Deployable }
