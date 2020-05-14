import { ItemEffect, IEffectData } from './ItemEffect'
import { ActivationType, EffectType } from '@/class'

interface IOffensiveEffectData extends IEffectData {
  attack?: string
  hit?: string
  critical?: string
  detail?: string
  abilities?: IEffectData[]
}

class OffensiveEffect extends ItemEffect {
  public readonly Name?: string
  public readonly Detail?: string
  public readonly OnAttack?: string
  public readonly OnHit?: string
  public readonly OnCrit?: string
  public readonly Abilities?: ItemEffect[]

  public constructor(data: IOffensiveEffectData, err?: boolean) {
    super(err)
    this.Name = data.name
    this.Detail = data.detail
    this.OnAttack = data.attack
    this.OnHit = data.hit
    this.OnCrit = data.critical
    this.Abilities = data.abilities ? data.abilities.map(x => ItemEffect.Generate(x)) : []
    this.activation = data.activation || ActivationType.None
    this.effectType = EffectType.Offensive
    this.tags = data.tags || []
  }
}

export { IOffensiveEffectData, OffensiveEffect }
