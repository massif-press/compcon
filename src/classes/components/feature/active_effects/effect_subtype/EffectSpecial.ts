import { EffectSave } from './EffectSave'
import { localize } from '@/i18n/localize'
import { keyPrefixes } from '@/i18n/contentKeys'
import { i18n } from '@/i18n'

interface IEffectSpecialData {
  attribute: string
  detail: string
  detailKey?: string
  save?: string | { stat: string; aoe?: boolean }
  aoe?: boolean
  duration?: string
  target?: 'self' | 'ally' | 'enemy' | 'any'
  attack?: 'melee' | 'ranged' | 'tech'
}

class EffectSpecial {
  public ID: string
  public readonly Attribute: string
  private readonly _detail: string
  private readonly _detailKey?: string
  private readonly _lkey?: string
  public readonly AoE: boolean
  public readonly Duration: string
  public readonly Target: 'self' | 'ally' | 'enemy' | 'any'
  public readonly Save?: EffectSave
  public readonly Attack?: 'melee' | 'ranged' | 'tech'

  public constructor(data: IEffectSpecialData) {
    this.ID = `effect_special_${Math.random().toString(36).substring(2, 15)}`
    this._lkey = keyPrefixes.get(data as object)
    this.Attribute = data.attribute
    this._detail = data.detail
    this._detailKey = data.detailKey
    this.AoE = data.aoe || false
    this.Duration = data.duration || 'End of Encounter'
    this.Target = data.target || 'any'
    if (data.save) this.Save = new EffectSave(data.save)
    if (data.attack) this.Attack = data.attack
  }

  public get Detail(): string {
    if (this._detailKey) return i18n.global.t(this._detailKey)
    return this._lkey ? localize(this._lkey, 'detail', this._detail) : this._detail
  }

  public static Serialize(effect: EffectSpecial): IEffectSpecialData {
    return {
      attribute: effect.Attribute,
      detail: effect.Detail,
      detailKey: effect._detailKey,
      aoe: effect.AoE,
      duration: effect.Duration,
      target: effect.Target,
      save: effect.Save ? EffectSave.Serialize(effect.Save) : undefined,
    }
  }

  public static Deserialize(data: IEffectSpecialData): EffectSpecial {
    return new EffectSpecial({
      attribute: data.attribute,
      detail: data.detail,
      detailKey: data.detailKey,
      aoe: data.aoe,
      duration: data.duration,
      target: data.target,
      save: data.save,
    })
  }
}

export { EffectSpecial }
export type { IEffectSpecialData }
