import { Damage } from '../../../../Damage'
import { i18n } from '@/i18n'
import { enumLabel } from '@/i18n/enumLabel'
import { DamageRollResult } from '../../../../dice/DiceRoller'
import { DamageType } from '../../../../enums'
import { ActiveEffectEvent } from '../ActiveEffectEvent'
import { ActiveEventTarget } from './eventTarget'
import {
  incomingDamage,
  overkillHeatFor,
  reliableIncoming,
} from '@/classes/components/combat/flows/WeaponAttackFlow'
export { reliableIncoming }

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
    const value = rawValue.includes('/') ? rawValue.split('/')[Math.min(tier - 1, 2)] : rawValue
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

  public ApplyRoll(rollResult: any): void {
    ;(this as any).DamageRollResult = rollResult
    this.DamageRolledValue = rollResult?.total ?? 0
    this.OverkillHeat = overkillHeatFor(
      this.Overkill,
      rollResult?.overkillHeat ?? rollResult?.overkillRerolls ?? 0
    )
  }

  public ClearRoll(): void {
    ;(this as any).DamageRollResult = undefined
    this.DamageRolledValue = undefined
    this.OverkillHeat = 0
  }

  public get IncomingSummary(): string {
    const t = i18n.global.t
    if (!this.DamageRolledValue) return t('combat.summary.rollPending')

    let str
    if (this.DamageRollString.includes('d')) {
      const crit = this.IsCrit ? `${t('ui.combat.crit').toUpperCase()} ` : ''
      str = `(${crit}${this.DamageRollString}) → ${this.DamageRolledValue}`
    } else {
      str = `${this.DamageRolledValue}`
    }

    if (this.Overkill) str += ` ${t('combat.summary.overkillHeat', { n: this.OverkillHeat })}`

    if (this.Bonus && this.BonusDamageEvent) {
      str += ` ${t('combat.summary.bonusDamage', { roll: this.BonusDamageEvent.DamageRollString })}`
    }

    str += this.tags
    if (this.Reliable && this.DamageRolledValue < this.Reliable)
      str += ` ${t('combat.summary.reliable', { n: this.Reliable })}`

    return str
  }

  private get tags(): string {
    let str = ''
    if (this.AP) str += ` ${i18n.global.t('combat.summary.apTag')}`
    if (this.Irreducible) str += ` ${i18n.global.t('combat.summary.irreducibleTag')}`
    return str
  }

  public get Summary(): string {
    let tags = this.tags
    if ((this.Reliable && this.DamageRolledValue) || 0 < this.Reliable)
      tags += ` ${i18n.global.t('combat.summary.reliable', { n: this.Reliable })}`

    return i18n.global.t('combat.summary.damageTotal', {
      value: this.DamageRolledValue,
      type: enumLabel('damageType', this.DamageType),
      tags,
    })
  }

  public CalcFinalDamageValues(
    event: ActiveEffectEvent,
    target: ActiveEventTarget
  ): { finalDamage: number; armorReduction: number; tookDamage: boolean } {
    const incoming = incomingDamage({
      hitResult: target.HitResult,
      rolled: this.DamageRolledValue || 0,
      bonus: this.BonusDamageEvent?.DamageRolledValue || 0,
      reliable: this.Reliable,
      isAoE: !!event.AoE,
      savedHalf: !!target.SavedHalf,
    })

    const calculated = target.Combatant?.actor.CombatController.CalculateDamage(
      this.DamageType,
      incoming,
      this.AP,
      this.Irreducible
    )

    const finalDamage = calculated?.total ?? incoming
    const negated = calculated ? !calculated.tookDamage : false
    const tookDamage = incoming > 0 && !negated

    const armorReduction =
      target.Combatant?.actor.CombatController.CalculateArmorReduction(
        this.DamageType,
        incoming,
        this.AP,
        this.Irreducible
      ) || 0

    return { finalDamage, armorReduction, tookDamage }
  }

  public CalcFinalDamage(event: ActiveEffectEvent, target: ActiveEventTarget) {
    const { finalDamage, armorReduction, tookDamage } = this.CalcFinalDamageValues(event, target)
    target.FinalDamageValue = finalDamage
    target.TotalArmorReduction = armorReduction
    target.TookDamage = tookDamage
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
