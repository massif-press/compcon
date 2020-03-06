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
}

class InvadeOption {
  public readonly Name?: string
  public readonly Detail: string
  public readonly Activation: ActivationType

  public constructor(data: IInvadeOptionData) {
    this.Name = data.name
    this.Detail = data.detail
    this.Activation = data.activation || ActivationType.Quick
  }
}

class TechEffect extends ItemEffect {
  public readonly Name?: string
  public readonly Detail: string
  public readonly Options?: InvadeOption[]

  public constructor(data: ITechEffectData, err?: boolean) {
    super(err)
    this.Name = data.name
    this.Detail = data.detail
    this.Options = data.options ? data.options.map(x => new InvadeOption(x)) : []
    this.activation = data.activation || ActivationType.Quick
    this.effectType = EffectType.Tech
  }
}

export { IInvadeOptionData, ITechEffectData, TechEffect }
