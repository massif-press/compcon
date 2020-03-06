import { ItemEffect, IEffectData } from './ItemEffect'
import { ActivationType, EffectType } from '@/class'

interface IBasicEffectData extends IEffectData {
  detail: string
}

class BasicEffect extends ItemEffect {
  public readonly Detail: string
  public readonly Name?: string

  public constructor(data: IBasicEffectData, err?: boolean) {
    super(err)
    this.Name = data.name
    this.Detail = data.detail
    this.activation = data.activation || ActivationType.None
    this.effectType = EffectType.Basic
  }
}

export { IBasicEffectData, BasicEffect }
