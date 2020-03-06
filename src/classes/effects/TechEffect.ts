import { IEffectData, ItemEffect, ActivationType } from './ItemEffect'
import { EffectType } from '@/class'

interface IInvadeOptionData {
  name: string
  detail: string
  activation?: ActivationType
}

interface ITechEffectData extends IEffectData {
  detail: string
  options?: IInvadeOptionData[]
  option_set?: string
}

class InvadeOption {
  public readonly Name?: string
  public readonly Detail: string
  public readonly Activation: ActivationType

  public constructor(data: IInvadeOptionData, activation: ActivationType) {
    this.Name = data.name
    this.Detail = data.detail
    this.Activation = activation || ActivationType.Quick
  }
}

class TechEffect extends ItemEffect {
  public readonly Name?: string
  public readonly Detail: string
  public readonly OptionSet?: string
  public readonly Options?: InvadeOption[]

  public constructor(data: ITechEffectData, err?: boolean) {
    super(err)
    this.Name = data.name
    this.Detail = data.detail
    this.OptionSet = data.option_set
    this.Options = data.options ? data.options.map(x => new InvadeOption(x, data.activation)) : []
    this.activation = data.activation || ActivationType.Quick
    this.effectType = EffectType.Tech
  }
}

export { IInvadeOptionData, ITechEffectData, TechEffect }
