import { store } from '@/store'
import uuid from 'uuid/v4'

interface IDeployableData {
  name: string
  type?: string
  source: string
  license: string
  size: number
  hp: number
  count?: number
  duration?: number
  armor?: number
  evasion: number
  edef: number
  detail: string
}

interface IDeployedData {
  id: string
  assigned_name: string
  current_hp: number
  current_duration?: number
  overshield?: number
  Destroyed?: boolean
}

class Deployable {
  public readonly ID: string
  public readonly BaseName: string
  public readonly Type: string
  public readonly Source: string
  public readonly License: string
  public readonly Detail: string
  public readonly Size: number
  public readonly MaxHP: number
  public readonly Armor: number
  public readonly Evasion: number
  public readonly EDefense: number
  private _name: string
  private _current_hp: number
  private _destroyed: boolean

  public constructor(data: IDeployableData, owner: IActor, n?: number) {
    this.ID = uuid()
    this.BaseName = `${owner ? `${owner.EncounterName}'s ` : ''}${data.name}${n ? ` (#${n})` : ''}`
    this.Type = data.type || 'Deployable'
    this.Source = data.source
    this.License = data.license
    this.Detail = data.detail
    this.Size = data.size
    this.MaxHP = data.hp
    this._current_hp = this.MaxHP
    this.Armor = data.armor || 0
    this.Evasion = data.evasion
    this.EDefense = data.edef
    this._destroyed = false
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
