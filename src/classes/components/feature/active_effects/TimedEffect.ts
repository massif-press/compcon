import { DamageType } from '../../../enums'
import { markRaw } from 'vue'
import { i18n } from '@/i18n'

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
  name?: string
  nameKey?: string
  origin?: string
  detail?: string
  detailKey?: string
  detailParams?: Record<string, unknown>
  duration?: string
  apply?: ITimedEffectAction
  remove?: ITimedEffectAction
}

class TimedEffect {
  public readonly ID: string
  private _data: ITimedEffectData

  public constructor(data: ITimedEffectData) {
    this.ID = data.id || crypto.randomUUID()
    this._data = data
  }

  public get Name(): string {
    return this._data.nameKey ? i18n.global.t(this._data.nameKey) : this._data.name || ''
  }
  public get Origin(): string {
    return this._data.origin || ''
  }
  public get Detail(): string {
    return this._data.detailKey
      ? i18n.global.t(this._data.detailKey, this._data.detailParams || {})
      : this._data.detail || ''
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
    return markRaw(new TimedEffect(data))
  }
}
export { TimedEffect }
export type { ITimedEffectData, ITimedEffectAction }
