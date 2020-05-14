import { IEffectData } from '@/interface'
import { ItemEffect } from './ItemEffect'
import { ActivationType, EffectType } from '@/class'

interface IReactionEffectData extends IEffectData {
  name: string
  detail: string
  frequency: string
  trigger: string
  init?: string
}

class ReactionEffect extends ItemEffect {
  public readonly Name?: string
  public readonly Init?: string
  public readonly Frequency: string
  public readonly Trigger: string
  public readonly Detail: string

  public constructor(data: IReactionEffectData, err?: boolean) {
    super(err)
    this.Name = data.name
    this.Init = data.init
    this.Detail = data.detail
    this.Frequency = data.frequency
    this.Trigger = data.trigger
    this.activation = ActivationType.Reaction
    this.effectType = EffectType.Reaction
    this.tags = data.tags || []
  }

  public toString(): string {
    return [
      'Activation: ' + this.activation,
      (this.Name || '').toUpperCase() + ' // ' + this.Frequency,
      this.Tags.length ? 'Tags: ' + this.Tags : '',
      this.Init,
      'Trigger: ' + this.Trigger,
      this.Detail,
    ]
      .filter(el => el !== '')
      .join('\n')
  }
}

export { IReactionEffectData, ReactionEffect }
