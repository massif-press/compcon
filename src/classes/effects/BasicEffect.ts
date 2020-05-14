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
    this.tags = data.tags || []
  }

  public toString(): string {
    return [
      'Activation: ' + this.activation,
      (this.Name || '').toUpperCase(),
      this.Tags.length ? 'Tags: ' + this.Tags : '',
      this.Detail,
    ]
      .filter(el => el !== '')
      .join('\n')
  }
}

export { IBasicEffectData, BasicEffect }
