import { DamageType } from '@/class'
import { v4 as uuid } from 'uuid'

interface ITimedEffectAction {
  status?: string[]
  resist?: { type: string; value: string }[]
  special?: { attribute: string; detail: string }[]
  damage?: { type: DamageType; value: number }[]
  other?: any
}

interface ITimedEffectData {
  round: number
  id?: string
  name: string
  origin?: string
  detail: string
  duration?: string
  apply?: ITimedEffectAction
  remove?: ITimedEffectAction
}

class TimedEffect {
  public readonly ID: string
  private _data: ITimedEffectData

  public constructor(data: ITimedEffectData) {
    this.ID = data.id || uuid()
    this._data = data
  }

  public get Name(): string {
    return this._data.name
  }
  public get Origin(): string {
    return this._data.origin || ''
  }
  public get Detail(): string {
    return this._data.detail
  }
  public get Duration(): string {
    return this._data.duration || ''
  }
  public get Round(): number {
    return this._data.round
  }

  public get Apply(): ITimedEffectAction | undefined {
    return this._data.apply
  }
  public get Remove(): ITimedEffectAction | undefined {
    return this._data.remove
  }

  public static Serialize(effect: TimedEffect): ITimedEffectData {
    return { ...effect._data }
  }

  public static Deserialize(data: ITimedEffectData): TimedEffect {
    return new TimedEffect(data)
  }
}
export { TimedEffect }
export type { ITimedEffectData, ITimedEffectAction }
