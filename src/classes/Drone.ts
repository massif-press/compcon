import { store } from '@/store'
import uuid from 'uuid/v4'

interface IDroneData {
  name: string
  source: string
  license: string
  size: number
  hp: number
  armor?: number
  evasion: number
  edef: number
  heat?: number
  detail: string
}

interface IDeployedDroneData {
  id: string
  assigned_name: string
  current_hp: number
  current_heat?: number
  overshield?: number
  isDestroyed?: boolean
}

class Drone {
  public readonly ID: string
  public readonly BaseName: string
  private _name: string
  public readonly Source: string
  public readonly License: string
  public readonly Detail: string
  public readonly Size: number
  public readonly MaxHP: number
  private _current_hp: number
  private _overshield: number
  public readonly Armor: number
  public readonly Evasion: number
  public readonly EDefense: number
  public readonly MaxHeat: number
  private _current_heat: number
  private _isDestroyed: boolean

  public constructor(data: IDroneData, owner?: string, n?: number) {
    this.ID = uuid()
    this.BaseName = `${owner ? `${owner}'s ` : ''}${data.name}${n ? ` (#${n})` : ''}`
    this.Source = data.source
    this.License = data.license
    this.Detail = data.detail
    this.Size = data.size
    this.MaxHP = data.hp
    this._current_hp = this.MaxHP
    this.Armor = data.armor || 0
    this.Evasion = data.evasion
    this.EDefense = data.edef
    this.MaxHeat = data.heat || 0
    this._current_heat = this.MaxHeat
    this._isDestroyed = false
  }

  private save(): void {
    store.dispatch('saveData')
  }

  public get Name(): string {
    return this._name ? this._name : this.BaseName
  }

  public set Name(name: string) {
    this._name = name
    this.save()
  }

  public get Overshield(): number {
    return this._overshield
  }

  public set Overshield(val: number) {
    this._overshield = val
    this.save()
  }

  public get CurrentHP(): number {
    if (this._current_hp > this.MaxHP) this.CurrentHP = this.MaxHP
    return this._current_hp
  }

  public set CurrentHP(hp: number) {
    if (hp > this.MaxHP) this._current_hp = this.MaxHP
    else if (hp <= 0) {
      this.IsDestroyed = true
    } else this._current_hp = hp
    this.save()
  }

  public get CurrentHeat(): number {
    if (this._current_heat > this.MaxHeat) this.CurrentHeat = this.MaxHeat
    return this._current_heat
  }

  public set CurrentHeat(heat: number) {
    if (heat > this.MaxHeat) this._current_heat = this.MaxHeat
    else this._current_heat = heat
    this.save()
  }

  public get IsDestroyed(): boolean {
    return this._isDestroyed
  }

  public set IsDestroyed(val: boolean) {
    this._isDestroyed = val
    this.save()
  }

  public static Serialize(drone: Drone): IDeployedDroneData {
    return {
      id: drone.ID,
      assigned_name: drone.Name,
      current_hp: drone.CurrentHP,
      current_heat: drone.CurrentHeat,
      overshield: drone.Overshield,
      isDestroyed: drone.IsDestroyed,
    }
  }

  public static Deserialize(base: IDroneData, data: IDeployedDroneData): Drone {
    const d = new Drone(base)
    d.Name = data.assigned_name
    d.CurrentHP = data.current_hp
    d.CurrentHeat = data.current_heat || 0
    d.Overshield = data.overshield || 0
    d.IsDestroyed = data.isDestroyed
    return d
  }
}

export { IDroneData, IDeployedDroneData, Drone }
