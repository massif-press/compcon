import { DamageType, Mech, MechWeapon } from '@/class'
import { Bonus } from './Bonus'

//TODO: getDamage(mech?: Mech, mount?: Mount) to collect all relevant bonuses

interface IDamageData {
  type: DamageType
  val: string | number
  override?: boolean
  bonus?: string | number
}

class Damage {
  public readonly Type: DamageType
  public readonly Value: string
  public readonly Bonus: string
  public readonly Override: boolean
  private _raw_value: string | number

  public constructor(damage: IDamageData) {
    this.Type = this.getDamageType(damage.type)
    if (typeof damage.val === 'number') {
      if (!damage.bonus) this.Value = damage.val.toString()
      else if (typeof damage.bonus === 'number') this.Value = (damage.val + damage.bonus).toString()
      else this.Value = `${damage.val} + ${damage.bonus}`
    } else {
      if (damage.bonus)
        this.Value = damage.val + damage.bonus ? ` + ${damage.bonus.toString()}` : ''
      else this.Value = damage.val
    }
    this.Bonus = damage.bonus
      ? typeof damage.bonus === 'number'
        ? damage.bonus.toString()
        : damage.bonus
      : ''
    this.Override = damage.override || false
    this._raw_value = damage.val
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

  //TODO: replace with dicemath
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
    const bonuses = mech.Bonuses.filter(x => x.ID === 'damage')
    const output = []
    item.Damage.forEach(d => {
      if (d.Override) return
      let bonus = 0
      bonuses.forEach(b => {
        if (b.WeaponTypes.length && !b.WeaponTypes.some(wt => item.WeaponType === wt)) return
        if (b.WeaponSizes.length && !b.WeaponSizes.some(ws => item.Size === ws)) return
        if (b.RangeTypes.length && !b.RangeTypes.some(rt => item.RangeType.some(x => x === rt)))
          return
        if (!b.DamageTypes.length || b.DamageTypes.some(rt => d.Type === rt)) {
          bonus += Bonus.Evaluate(b, mech.Pilot)
        }
      })
      output.push(
        new Damage({
          type: d.Type,
          val: d._raw_value,
          bonus: bonus,
        })
      )
    })
    return output
  }

  public get Icon(): string {
    return `cci-${this.Type.toLowerCase()}`
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

  public static Serialize(damage: Damage): IDamageData {
    return {
      type: damage.Type,
      val: damage.Value,
      override: damage.Override,
      bonus: damage.Bonus
    }
  }
}

export { Damage, IDamageData }
