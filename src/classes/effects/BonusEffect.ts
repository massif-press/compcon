import { ItemEffect, IEffectData } from './ItemEffect'
import { ActivationType, EffectType } from '@/class'

interface IBonusEffectData extends IEffectData {
  detail: string
  size?: number
  hp?: number
  armor?: number
  evasion?: number
  edef?: number
}

class BonusEffect extends ItemEffect {
  public readonly Name?: string
  public readonly Detail: string
  public readonly Size?: number
  public readonly HP?: number
  public readonly Armor?: number
  public readonly Evasion?: number
  public readonly EDef?: number

  public constructor(data: IBonusEffectData, err?: boolean) {
    super(err)
    this.Name = data.name
    this.Detail = data.detail
    this.Size = data.size || 0
    this.HP = data.hp || 0
    this.Armor = data.armor || 0
    this.Evasion = data.evasion || 0
    this.EDef = data.edef || 0
    this.activation = ActivationType.None
    this.effectType = EffectType.Bonus
    this.tags = data.tags || []
  }

  public toString(): string {
    return [
      'Activation: ' + this.activation + '   Type: ' + this.effectType,
      (this.Name || '').toUpperCase(),
      [
        '//',
        this.Size ? 'Size: ' + this.Size : '',
        this.HP ? 'HP: ' + this.HP : '',
        this.Armor ? 'Armor: ' + this.Armor : '',
        this.Evasion ? 'Evasion: ' + this.Evasion : '',
        this.EDef ? 'E-defense: ' + this.EDef : '',
      ]
        .filter(el => el !== '')
        .join('   '),
      this.Tags.length ? 'Tags: ' + this.Tags : '',
      this.Detail,
    ]
      .filter(el => el !== '')
      .join('\n')
  }
}

export { IBonusEffectData, BonusEffect }
