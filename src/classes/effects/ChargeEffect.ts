import { IRangeData, IDamageData } from '@/interface'
import { ItemEffect, IEffectData } from './ItemEffect'
import { ActivationType, EffectType, Damage, Range } from '@/class'

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

  public constructor(data: IChargeData) {
    this.Name = data.name
    this.ChargeType = data.charge_type
    this.Range = data.range ? data.range.map(x => new Range(x)) : []
    this.Damage = data.damage ? data.damage.map(x => new Damage(x)) : []
    this.Detail = data.detail
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
  }
}

export { ChargeType, IChargeData, IChargeEffectData, Charge, ChargeEffect }
