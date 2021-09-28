import { ActivationType, Mech, Pilot } from '@/class'
import { ICounterData, ISynergyData } from '@/interface'
import uuid from 'uuid/v4'
import { IActionData } from './Action'
import { Bonus, IBonusData } from './Bonus'
import { ICompendiumItemData, CompendiumItem } from './CompendiumItem'

interface IDeployableData extends ICompendiumItemData {
  name: string
  detail: string
  type: string // this is for UI furnishing only
  activation: ActivationType
  instances?: number
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
  pilot?: boolean
  mech?: boolean
}

interface IDeployedData {
  // id: string
  data: IDeployableData
  assigned_name: string
  current_hp: number
  current_duration?: number
  overshield?: number
  Destroyed?: boolean
}

class Deployable extends CompendiumItem {
  public readonly ID: string
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
  public readonly IsPilotDeployable: boolean
  public readonly IsMechDeployable: boolean
  public readonly Recall: ActivationType | null
  public readonly Redeploy: ActivationType | null
  public readonly Instances: number
  private _missing_hp: number
  private _current_heat: number
  private _current_repairs: number
  private _overshield: number
  private _destroyed: boolean
  private _recalled: boolean
  private _data: IDeployableData

  public constructor(data: IDeployableData, owner: Mech, n?: number) {
    data.id = `${data.type || 'deployable'}_${uuid()}`
    super(data)
    this.ID = data.id
    this._data = data
    this.BaseName = `${owner ? `${owner.EncounterName}'s ` : ''}${data.name}${n ? ` (#${n})` : ''}`
    this.Type = data.type || 'Deployable'
    this.Detail = data.detail
    this.Recall = data.recall || null
    this.Redeploy = data.redeploy || null
    this.Size = this.collect(data.size, owner, 'size')
    this.MaxHP = this.collect(data.hp, owner, 'hp')
    this._missing_hp = 0
    this.Armor = this.collect(data.armor, owner, 'armor')
    this.Evasion = this.collect(
      data.evasion,
      owner,
      'evasion',
      data.type.toLowerCase() !== 'mine' ? 5 : 0
    )
    this.EDefense = this.collect(
      data.edef,
      owner,
      'edef',
      data.type.toLowerCase() !== 'mine' ? 8 : 0
    )
    this.Heatcap = this.collect(data.heatcap, owner, 'heatcap')
    this.Repcap = this.collect(data.repcap, owner, 'repcap')
    this.Sensors = this.collect(data.sensor_range, owner, 'sensor_range')
    this.TechAttack = this.collect(data.tech_attack, owner, 'tech_attack')
    this.Save = this.collect(data.save, owner, 'save')
    this.Speed = this.collect(data.speed, owner, 'speed')
    this.Instances = data.instances || 1
    this._overshield = 0
    this._current_heat = 0
    this._current_repairs = 0
    this._destroyed = false
    this.IsPilotDeployable = data.pilot
    this.IsMechDeployable = data.mech || !data.pilot
  }

  private collect(val: string | number, owner: Mech, bonusID: string, mineVal?: number): number {
    const prefix = this.Type.toLowerCase() === 'drone' ? 'drone' : 'deployable'
    let out = val ? val : 0
    if (!out && mineVal) return mineVal
    if (owner && owner.Pilot) {
      out = owner.Pilot.SpecialEval(out)
      out += Bonus.get(`${prefix}_${bonusID}`, owner)
    }
    return Number(out)
  }

  public get Name(): string {
    return this._name ? this._name : this.BaseName
  }

  public set Name(name: string) {
    this._name = name
    this.save()
  }

  public get CurrentHP(): number {
    if (this._missing_hp < 0) this.CurrentHP = this.MaxHP
    return this.MaxHP - this._missing_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this._missing_hp = 0
    else if (hp <= 0) {
      this.Destroyed = true
    } else this._missing_hp = this.MaxHP - hp
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
  public get CurrentRepairs(): number {
    if (this._current_heat > this.Repcap) this.CurrentRepairs = this.Repcap
    return this._current_heat
  }

  public set CurrentRepairs(heat: number) {
    if (heat > this.Repcap) this._current_heat = this.Repcap
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

  public get IsRecalled(): boolean {
    return this._recalled
  }

  public set IsRecalled(val: boolean) {
    this._recalled = val
  }

  public Repair(): void {
    this.CurrentHP = this.MaxHP
    this.CurrentHeat = 0
    this.Destroyed = false
  }

  public get Icon(): string {
    if (this.Type.toLowerCase() === 'mine') return 'cci-mine'
    if (this.Type.toLowerCase() === 'drone') return 'cci-drone'
    return 'cci-deployable'
  }

  public static Serialize(deployable: Deployable): IDeployedData {
    return {
      // id: deployable.ID,
      data: deployable._data,
      assigned_name: deployable.Name,
      current_hp: deployable.CurrentHP,
      Destroyed: deployable.Destroyed,
    }
  }

  public static Deserialize(d: IDeployedData, owner: Mech): Deployable {
    if (!d.data) return
    const dep = new Deployable(d.data, owner)
    dep.Name = d.assigned_name
    dep.CurrentHP = d.current_hp
    dep.Destroyed = d.Destroyed
    return dep
  }
}

export { IDeployableData, IDeployedData, Deployable }
