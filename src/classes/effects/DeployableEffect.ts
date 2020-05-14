import { ItemEffect, IEffectData } from './ItemEffect'
import { ActivationType, EffectType } from '@/class'

interface IDeployableData extends IEffectData {
  count?: number
  size?: number
  hp?: number
  evasion?: number
  edef?: number
  detail: string
}

class DeployableEffect extends ItemEffect {
  public readonly Name?: string
  public readonly Detail: string
  public readonly Count?: number
  public readonly Size?: number
  public readonly HP?: number
  public readonly Evasion?: number
  public readonly EDef?: number

  public constructor(data: IDeployableData, err?: boolean) {
    super(err)
    this.Name = data.name
    this.Detail = data.detail
    this.Count = data.count
    this.Size = data.size
    this.HP = data.hp
    this.Evasion = data.evasion
    this.EDef = data.edef
    this.activation = data.activation || ActivationType.Quick
    this.effectType = EffectType.Deployable
    this.tags = data.tags || []
  }

  public toString(): string {
    return [
      'Activation: ' + this.activation + '   Type: ' + this.effectType,
      (this.Name || '').toUpperCase(),
      [
        '//',
        this.Count ? 'Uses: ' + this.Count : '',
        this.Size ? 'Size: ' + this.Size : '',
        this.HP ? 'HP: ' + this.HP : '',
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

export { IDeployableData, DeployableEffect }
