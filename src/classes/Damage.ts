import { DamageType, Mech, MechWeapon, Range, RangeType, Tag } from '@/class'
import { Bonus } from './components/feature/bonus/Bonus'
import { EffectSave } from './components/feature/active_effects/effect_subtype/EffectSave'
import { FeatureController } from './components/feature/FeatureController'

//TODO: getDamage(mech?: Mech, mount?: Mount) to collect all relevant bonuses

interface IDamageData {
  type: DamageType
  val: string | number
  override?: boolean
  bonus?: string | number
  aoe?: string | boolean
  save?: string | { stat: string; aoe?: boolean }
  save_half?: boolean
  ap?: boolean
  irreducible?: boolean
  overkill?: boolean
  reliable?: number
  target?: string
  attack?: 'melee' | 'ranged' | 'tech'
}

class Damage {
  public readonly Type: DamageType
  public readonly Value: string
  public readonly Bonus: string
  public readonly Override: boolean
  public readonly Save?: EffectSave
  public readonly SaveHalf?: boolean
  public readonly Attack?: 'melee' | 'ranged' | 'tech'

  public AoE: string | boolean = false
  public AP: boolean = false
  public Irreducible: boolean = false
  public Overkill: boolean = false
  public Reliable: number = 0
  public Target: string = 'enemy'

  public _raw_value: string | number

  public constructor(damage: IDamageData) {
    this.Type = this.getDamageType(damage.type)
    this._raw_value = damage.val

    if (Array.isArray(damage.val)) {
      this.Value = damage.val.map(v => (typeof v === 'number' ? v.toString() : v)).join(' / ')
    } else if (typeof damage.val === 'number') {
      if (!damage.bonus) this.Value = damage.val.toString()
      else if (typeof damage.bonus === 'number') this.Value = (damage.val + damage.bonus).toString()
      else this.Value = `${damage.val} + ${damage.bonus}`
    } else {
      const str = FeatureController.RenderSpecialString(String(damage.val))
      if (damage.bonus) this.Value = str + damage.bonus ? ` + ${damage.bonus.toString()}` : ''
      else this.Value = str
    }
    this.Bonus = damage.bonus
      ? typeof damage.bonus === 'number'
        ? damage.bonus.toString()
        : damage.bonus
      : ''
    this.Override = damage.override || false

    if (damage.aoe) this.AoE = damage.aoe
    if (damage.ap) this.AP = damage.ap
    if (damage.irreducible) this.Irreducible = damage.irreducible
    if (damage.overkill) this.Overkill = damage.overkill
    if (damage.reliable) this.Reliable = damage.reliable
    if (damage.save) this.Save = new EffectSave(damage.save)
    if (damage.save_half) this.SaveHalf = damage.save_half
    if (damage.target) this.Target = damage.target
    if (damage.attack) this.Attack = damage.attack
  }

  public setDamageAttributes(obj: any) {
    if (!obj.Range) return
    const nonAoeTypes = [RangeType.Range, RangeType.Threat, RangeType.Thrown]
    if (!this.AoE) {
      if (obj.RangeData)
        this.AoE = (obj.RangeData as Range[]).some(r => nonAoeTypes.includes(r.Type)) ? false : true
      else this.AoE = (obj.Range as Range[]).some(r => nonAoeTypes.includes(r.Type)) ? false : true
    }
    if (!this.AP && obj.Tags) this.AP = (obj.Tags as Tag[]).some(t => t.ID === 'tg_ap')
    if (!this.Overkill && obj.Tags)
      this.Overkill = (obj.Tags as Tag[]).some(t => t.ID === 'tg_overkill')
    if (!this.Irreducible && obj.Tags)
      this.Irreducible = (obj.Tags as Tag[]).some(t => t.ID === 'tg_irreducible')
    if (!this.Reliable && obj.Tags) {
      this.Reliable = Number((obj.Tags as Tag[]).find(t => t.ID === 'tg_reliable')?.Value) || 0
    }
  }

  private getDamageType(str?: string): DamageType {
    switch (str?.toLowerCase()) {
      case 'kinetic':
        return DamageType.Kinetic
      case 'energy':
        return DamageType.Energy
      case 'explosive':
        return DamageType.Explosive
      case 'heat':
        return DamageType.Heat
      case 'burn':
        return DamageType.Burn
    }
    return DamageType.Variable
  }

  public get IsRollable(): boolean {
    if (Array.isArray(this._raw_value))
      return this._raw_value.some(v => typeof v === 'string' && v.includes('d'))
    return typeof this._raw_value === 'string' && this._raw_value.includes('d')
  }

  public TieredDamage(tier: number): string {
    if (this.Override) return this.Value
    if (Array.isArray(this._raw_value)) {
      if (tier - 1 < this._raw_value.length) return this._raw_value[tier - 1].toString()
      else return this._raw_value[this._raw_value.length - 1].toString()
    } else return this.Value
  }

  public get Max(): number {
    if (typeof this._raw_value === 'number') return this._raw_value
    else {
      let bonus = 0
      if (this._raw_value.split('+').length === 2) bonus = parseInt(this._raw_value.split('+')[1])
      const split = this._raw_value.split('d')
      // (qty * size) + bonus
      return parseInt(split[0]) * parseInt(split[1]) + bonus
    }
  }

  public static CalculateDamage(item: MechWeapon, mech: Mech): Damage[] {
    if (!item || !mech) return []
    if (!Bonus.get('damage', mech) || item.NoCoreBonus || item.NoBonuses) return item.Damage
    const bonuses = mech.FeatureController.Bonuses.filter(x => x.ID === 'damage')
    const output = [] as Damage[]
    item.Damage.forEach(d => {
      if (d.Override) return
      let bonus = 0
      bonuses.forEach(b => {
        if (b.WeaponTypes.length && !b.WeaponTypes.some(wt => item.WeaponTypes.includes(wt))) return
        if (b.WeaponSizes.length && !b.WeaponSizes.some(ws => item.Size === ws)) return
        if (b.RangeTypes.length && !b.RangeTypes.some(rt => item.RangeType.some(x => x === rt)))
          return
        if (!b.DamageTypes.length || b.DamageTypes.some(rt => d.Type === rt)) {
          bonus += Bonus.Evaluate(b, mech.Pilot)
        }
      })
      let val =
        typeof d._raw_value === 'string'
          ? mech.FeatureController.EvaluateSpecial(d._raw_value)
          : d._raw_value
      output.push(
        new Damage({
          type: d.Type,
          val: val,
          bonus: bonus,
        })
      )
    })
    return output
  }

  public get Icon(): string {
    return `cc:${this.Type.toLowerCase()}`
  }

  public get AoeIcon(): string {
    if (!this.AoE || this.AoE === 'false') return 'cc:range'
    if (typeof this.AoE !== 'string') return 'cc:sword_array'
    return Damage.getAoeIcon(this.AoE)
  }

  public static getAoeIcon(str: string): string {
    if (!str || str === 'false') return 'cc:range'
    if (str.includes('cone')) return 'cc:cone'
    if (str.includes('line')) return 'cc:line'
    if (str.includes('burst')) return 'cc:burst'
    if (str.includes('blast')) return 'cc:blast'
    return 'cc:sword_array'
  }

  public get DiscordEmoji(): string {
    return `:cc_damage_${this.Type.toLowerCase()}:`
  }

  public get Color(): string {
    return `damage--${this.Type.toLowerCase()}`
  }

  public get Text(): string {
    if (this.Override) return this.Value
    return `${this.Value} ${this.Type} Damage`
  }

  public ToNumber(type?: DamageType): number {
    if (!type) return this.Max
    if (this.Type === type) return this.Max
    return 0
  }

  public static Serialize(damage: Damage): IDamageData {
    return {
      type: damage.Type,
      val: damage.Value,
      override: damage.Override,
      bonus: damage.Bonus,
      aoe: damage.AoE,
      ap: damage.AP,
      irreducible: damage.Irreducible,
      overkill: damage.Overkill,
      reliable: damage.Reliable,
      target: damage.Target,
      attack: damage.Attack,
      save: damage.Save
        ? {
            stat: damage.Save.Stat,
            aoe: damage.Save.AoE,
          }
        : undefined,
      save_half: damage.SaveHalf,
    }
  }
}

export { Damage }
export type { IDamageData }
