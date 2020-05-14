import { ItemEffect, IEffectData } from './ItemEffect'
import { ActivationType, EffectType } from '@/class'

interface IAIData extends IEffectData {
  size: number
  hp: number
  edef: number
  evasion: number
  detail: string
  abilities: IEffectData[]
}

class AIEffect extends ItemEffect {
  public readonly Detail: string
  public readonly Abilities: ItemEffect[]
  public readonly Name?: string

  public constructor(data: IAIData, err?: boolean) {
    super(err)
    this.Name = data.name
    this.Detail = data.detail
    this.Abilities = data.abilities.map(x => ItemEffect.Generate(x))
    this.activation = ActivationType.None
    this.effectType = EffectType.AI
    this.tags = data.tags || []
  }

  public toString(): string {
    return [
      'Type: ' + this.effectType,
      (this.Name || '').toUpperCase(),
      this.Tags.length ? 'Tags: ' + this.Tags : '',
      this.Detail,
      this.Abilities.map(a => a.toString()).join('\n'),
    ]
      .filter(el => el !== '')
      .join('\n')
  }
}

export { IAIData, AIEffect }
