import { DamageType, DamageRollResult, Damage } from '@/class'
import { ActiveEffectEvent } from '../ActiveEffectEvent'
import { ActiveEventTarget } from './eventTarget'

// details of damage applied to target. These can be multiple based on effect (weapon action, etc). May include multiple but apply to all targets
class DamageEvent {
  public DamageType: DamageType = DamageType.Kinetic
  public DamageRollString = '' // dice string or static
  public DamageRollResult?: DamageRollResult
  public DamageRolledValue?: number // after roll
  public AP: boolean = false
  public IsCrit: boolean = false
  public Irreducible: boolean = false
  public Overkill: boolean = false
  public OverkillHeat: number = 0
  public Reliable: number = 0
  public Bonus: boolean = false
  public BonusDamageEvent?: DamageEvent

  constructor(damage: Damage, tier: number, isChild: boolean = false) {
    this.DamageType = damage.Type
    const rawValue = String(damage.Value)
    const value = rawValue.includes('/')
      ? rawValue.split('/')[Math.min(tier - 1, 2)]
      : rawValue
    this.DamageRollString = value
    if (typeof damage.Value === 'number' || !value.includes('d')) {
      this.DamageRolledValue = Number(value)
    }
    this.AP = damage.AP || false
    this.Irreducible = damage.Irreducible || false
    this.Overkill = damage.Overkill || false
    this.OverkillHeat = 0
    this.Reliable = damage.Reliable || 0
    if (!isChild)
      this.BonusDamageEvent = new DamageEvent(
        new Damage({
          type: damage.Type,
          val: damage.Bonus || 0,
        }),
        tier,
        true
      )
  }

  public get IncomingSummary(): string {
    if (!this.DamageRolledValue) return 'roll pending'

    let str
    if (this.DamageRollString.includes('d')) {
      str = `(${this.IsCrit ? 'CRIT ' : ''}${this.DamageRollString}) → ${this.DamageRolledValue}`
    } else {
      str = `${this.DamageRolledValue}`
    }

    if (this.Overkill) str += ` + ${this.OverkillHeat} Overkill`

    if (this.Bonus && this.BonusDamageEvent) {
      str += ` + ${this.BonusDamageEvent.DamageRollString} Bonus`
    }

    if (this.AP) str += ' (AP)'
    if (this.Irreducible) str += ' (Irreducible)'
    if (this.Reliable && this.DamageRolledValue < this.Reliable)
      str += ` (Reliable ${this.Reliable})`

    return str
  }

  public get Summary(): string {
    let str = `${this.DamageRolledValue} ${this.DamageType}`
    if (this.AP) str += ' (AP)'
    if (this.Irreducible) str += ' (Irreducible)'
    if ((this.Reliable && this.DamageRolledValue) || 0 < this.Reliable)
      str += ` (Reliable ${this.Reliable})`

    return str + ' Damage'
  }

  public CalcFinalDamageValues(
    event: ActiveEffectEvent,
    target: ActiveEventTarget
  ): { finalDamage: number; armorReduction: number } {
    let incoming = 0
    let bonus = 0

    if (target.HitResult !== 'miss') {
      incoming += this.DamageRolledValue || 0
      if (this.BonusDamageEvent) bonus = this.BonusDamageEvent.DamageRolledValue || 0
      if (event.AoE) bonus = Math.floor(bonus / 2)
      incoming += bonus
      if (target.SavedHalf) {
        incoming = Math.floor(incoming / 2)
      }
    }

    const finalDamage =
      target.Combatant?.actor.CombatController.CalculateDamage(
        this.DamageType,
        incoming,
        this.AP,
        this.Irreducible,
        this.Reliable
      ).total || incoming

    const armorReduction =
      target.Combatant?.actor.CombatController.CalculateArmorReduction(
        this.DamageType,
        incoming,
        this.AP,
        this.Irreducible
      ) || 0

    return { finalDamage, armorReduction }
  }

  public CalcFinalDamage(event: ActiveEffectEvent, target: ActiveEventTarget) {
    const { finalDamage, armorReduction } = this.CalcFinalDamageValues(event, target)
    target.FinalDamageValue = finalDamage
    target.TotalArmorReduction = armorReduction
  }

  public ToJSON() {
    return {
      DamageType: this.DamageType,
      DamageRollString: this.DamageRollString,
      DamageRolledValue: this.DamageRolledValue,
      AP: this.AP,
      Irreducible: this.Irreducible,
      IsCrit: this.IsCrit,
      OverkillHeat: this.OverkillHeat,
      Reliable: this.Reliable,
      BonusDamageEvent:
        this.Bonus && this.BonusDamageEvent ? this.BonusDamageEvent.ToJSON() : undefined,
    }
  }
}
export { DamageEvent }
