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
  }
}

export { IReactionEffectData, ReactionEffect }
