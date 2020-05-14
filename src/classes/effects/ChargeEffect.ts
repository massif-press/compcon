import { IRangeData, IDamageData } from '@/interface'
import { ItemEffect, IEffectData } from './ItemEffect'
import { ActivationType, EffectType, Damage, Range, Tag } from '@/class'

enum ChargeType {
  Grenade = 'Grenade',
  Mine = 'Mine',
}

interface IChargeData {
  name: string
  charge_type: ChargeType
  detail: string
  range?: IRangeData[]
  damage?: IDamageData[]
  tags?: ITagData[]
}

interface IChargeEffectData extends IEffectData {
  charges: IChargeData[]
}

class Charge {
  public readonly Name?: string
  public readonly ChargeType: ChargeType
  public readonly Range?: Range[]
  public readonly Damage?: Damage[]
  public readonly Detail: string
  public readonly tags?: ITagData[]

  public constructor(data: IChargeData) {
    this.Name = data.name
    this.ChargeType = data.charge_type
    this.Range = data.range ? data.range.map(x => new Range(x)) : []
    this.Damage = data.damage ? data.damage.map(x => new Damage(x)) : []
    this.Detail = data.detail
    this.tags = data.tags || []
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this.tags)
  }

  public toString(): string {
    return [
      (this.Name || '').toUpperCase(),
      [
        '//',
        this.Range ? 'Range: ' + this.Range.map(d => d.Text).join(', ') : '',
        this.Damage ? 'Damage: ' + this.Damage.map(d => d.Text).join(', ') : '',
      ]
        .filter(el => el !== '')
        .join('   '),
      this.Detail,
    ]
      .filter(el => el !== '')
      .join('\n')
  }
}

class ChargeEffect extends ItemEffect {
  public readonly Name?: string
  public readonly Charges: Charge[]

  public constructor(data: IChargeEffectData) {
    super()
    this.Name = data.name
    this.Charges = data.charges.map(x => new Charge(x))
    this.activation = data.activation || ActivationType.Quick
    this.effectType = EffectType.Charge
    this.tags = data.tags || []
  }

  public toString(): string {
    return [
      'Activation: ' + this.activation + '   Type: ' + this.effectType,
      (this.Name || '').toUpperCase(),
      this.Tags.length ? 'Tags: ' + this.Tags : '',
      this.Charges.map(charge => charge.toString()).join('\n'),
    ]
      .filter(el => el !== '')
      .join('\n')
  }
}

export { ChargeType, IChargeData, IChargeEffectData, Charge, ChargeEffect }
