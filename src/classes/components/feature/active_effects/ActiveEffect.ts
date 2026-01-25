import { v4 as uuid } from 'uuid'
import { IRangeData } from '@/interface'
import { Bonus, IBonusData } from '../..'
import { Damage, IDamageData } from '../../../Damage'
import { Range } from '../../../Range'
import { IEffectResistData, EffectResist } from './effect_subtype/EffectResist'
import { IEffectSpecialData, EffectSpecial } from './effect_subtype/EffectSpecial'
import { IEffectOtherData, EffectOther } from './effect_subtype/EffectOther'
import { IEffectStatusData, EffectStatus } from './effect_subtype/EffectStatus'
import { EffectSave } from './effect_subtype/EffectSave'
import { BonusDamage, IBonusDamageData } from './BonusDamage'

interface IActiveEffectData {
  id?: string
  name: string
  detail: string
  condition?: string
  damage?: IDamageData[]
  range?: IRangeData[]
  bonuses?: IBonusData[]
  bonus_damage?: IBonusDamageData
  duration?: string
  frequency?: string
  save?: string | { stat: string; aoe: boolean }
  add_resist?: IEffectResistData[]
  add_special?: IEffectSpecialData[]
  remove_special?: string[]
  add_other?: IEffectOtherData[]
  add_status?: IEffectStatusData[] | string[]
  can_crit?: boolean
  attack?: 'melee' | 'ranged' | 'tech'
  applied?: boolean
}

class ActiveEffect {
  public readonly ID: string
  public readonly Origin: any
  public readonly Name: string
  public readonly Detail: string
  public readonly Condition: string
  public readonly Damage: Damage[]
  public readonly Range: Range[]
  public readonly Bonuses: Bonus[]
  public readonly Duration?: string
  public readonly Frequency?: string
  public readonly BonusDamage?: BonusDamage
  public readonly CanCrit?: boolean

  public readonly Attack?: 'melee' | 'ranged' | 'tech'
  public readonly Save?: EffectSave

  public readonly AddResist?: EffectResist[]
  public readonly AddSpecial?: EffectSpecial[]
  public readonly RemoveSpecial?: string[]
  public readonly AddOther?: EffectOther[]
  public readonly AddStatus?: EffectStatus[]

  public readonly Dismissible: boolean

  public Applied: boolean = false

  public constructor(
    data: IActiveEffectData,
    origin: any,
    dismissible?: boolean,
    fallbackName?: string
  ) {
    this.ID = data.id || uuid()
    this.Origin = origin

    this.Name = data.name || fallbackName || 'Unnamed Effect'
    this.Detail = data.detail || ''
    this.Condition = data.condition || ''
    this.Damage = []
    if (data.damage) {
      if (!Array.isArray(data.damage)) data.damage = [data.damage]
      this.Damage = data.damage ? data.damage.map(x => new Damage(x)) : []
    }
    this.Range = []
    if (data.range) {
      if (!Array.isArray(data.range)) data.range = [data.range]
      this.Range = data.range ? data.range.map(x => new Range(x)) : []
    }
    this.Bonuses = data.bonuses ? data.bonuses.map(b => new Bonus(b, this.Name)) : []
    this.Duration = data.duration
    this.Frequency = data.frequency
    if (data.bonus_damage) this.BonusDamage = new BonusDamage(data.bonus_damage, this.Name)
    if (data.save) {
      this.Save = new EffectSave(data.save)
    }
    if (data.add_resist) {
      if (!Array.isArray(data.add_resist)) data.add_resist = [data.add_resist]
      this.AddResist = data.add_resist.map(r => new EffectResist(r))
    }
    if (data.add_special) {
      if (!Array.isArray(data.add_special)) data.add_special = [data.add_special]
      this.AddSpecial = data.add_special.map(s => new EffectSpecial(s))
    }
    if (data.remove_special) {
      if (!Array.isArray(data.remove_special)) data.remove_special = [data.remove_special]
      this.RemoveSpecial = data.remove_special
    }
    if (data.add_other) {
      if (!Array.isArray(data.add_other)) data.add_other = [data.add_other]
      this.AddOther = data.add_other.map(o => new EffectOther(o))
    }
    if (data.add_status) {
      this.AddStatus = (Array.isArray(data.add_status) ? data.add_status : [data.add_status]).map(
        s => new EffectStatus(s)
      )
    }

    this.Attack = data.attack
    this.CanCrit = data.can_crit || false
    this.Dismissible = dismissible || false
    this.Applied = data.applied || false
  }

  get IsPassive(): boolean {
    return (
      !this.AddOther?.length &&
      !this.AddResist?.length &&
      !this.AddStatus?.length &&
      !this.AddSpecial?.length &&
      !this.Damage.length &&
      !this.Save &&
      !this.Frequency
    )
  }

  get IsAoE(): boolean {
    return (
      this.Save?.AoE ||
      this.Range.some(r => r.IsAoE) ||
      this.Damage.some(d => d.AoE) ||
      this.AddResist?.some(r => r.AoE) ||
      this.AddSpecial?.some(s => s.AoE) ||
      this.AddOther?.some(o => o.AoE) ||
      this.AddStatus?.some(st => st.AoE) ||
      false
    )
  }
}
export { ActiveEffect }
export type { IActiveEffectData }
