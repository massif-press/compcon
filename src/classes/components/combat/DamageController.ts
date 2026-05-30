import { DamageType } from '../../enums'
import { StatKey } from './stats/Stats'
import type { CombatController } from './CombatController'

class DamageController {
  private _parent: CombatController

  constructor(parent: CombatController) {
    this._parent = parent
  }

  private get _active(): CombatController {
    return this._parent.ActiveActor.CombatController
  }

  public CalculateArmorReduction(
    type: DamageType,
    value: number,
    ap: boolean,
    irreducible: boolean
  ): number {
    if (
      irreducible ||
      ap ||
      type === DamageType.Heat ||
      type === DamageType.Burn ||
      type === DamageType.AppliedBurn
    )
      return 0
    return this._parent.ActiveActor.StatController.getCurrent(StatKey.ARMOR) || 0
  }

  public CalculateDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    reliable = 0
  ): { total: number; resist: string[]; condition: string[] } {
    const out = { total: value, resist: [] as string[], condition: [] as string[] }

    if (reliable > 0 && out.total < reliable) {
      out.total = reliable
    }

    if (
      this._parent.HasStatus('exposed') &&
      type !== DamageType.Heat &&
      type !== DamageType.Burn &&
      type !== DamageType.AppliedBurn
    ) {
      out.total *= 2
      out.condition.push('exposed')
    }

    if (this._parent.HasStatus('shredded')) {
      out.condition.push('shredded')
      ap = true
    }

    if (irreducible) return out

    out.total = Math.max(0, out.total - this.CalculateArmorReduction(type, value, ap, irreducible))

    const resist = this._active.Resistances.find(r => r.type === type.toLowerCase())

    if (resist) {
      if (resist.condition === 'vulnerable') {
        out.total = Math.ceil(out.total * 2)
        out.resist.push('vulnerable')
      } else if (!this._parent.HasStatus('shredded') && resist.condition === 'resistance') {
        out.total = Math.ceil(out.total / 2)
        out.resist.push('resistance')
      } else if (!this._parent.HasStatus('shredded') && resist.condition === 'immunity') {
        out.total = 0
        out.resist.push('immunity')
      }
    }

    if (reliable > 0 && out.total < reliable) {
      out.total = reliable
    }

    return out
  }

  public TakeDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false
  ): void {
    if (this._parent.SaveLock) return

    if (
      type === DamageType.Heat.toLowerCase() &&
      !this._parent.ActiveActor.StatController.getMax(StatKey.STRESS)
    ) {
      type = DamageType.Energy
    }

    const damage = this.CalculateDamage(type, value, ap, irreducible)

    this.ApplyDamage(type, damage.total)

    this._parent.CombatLog.TakeDamage(value, type)
    this._parent.CombatLog.ArmorReduced(
      this.CalculateArmorReduction(type, value, ap, irreducible)
    )
    if (this._parent.IsDestroyed) this._parent.CombatLog.LoseMech()
  }

  public ApplyDamage(type: DamageType, value: number): void {
    const target = this._active

    if (type.toLowerCase() === DamageType.Heat.toLowerCase()) {
      target.ApplyHeat(value)
      return
    }
    if (type.toLowerCase() === DamageType.Burn.toLowerCase()) {
      target.StatController.setCurrentStat(
        StatKey.BURN,
        target.StatController.getCurrent(StatKey.BURN) + value
      )
    }

    if (target.StatController.getCurrent(StatKey.OVERSHIELD) > 0) {
      const overshield = target.StatController.getCurrent(StatKey.OVERSHIELD) || 0
      if (value <= overshield) {
        target.StatController.setCurrentStat(StatKey.OVERSHIELD, overshield - value)
        this._parent.log(`Overshield absorbed ${value} damage`)
        this._parent.CombatLog.StatChange(-value, 'overshield')
        return
      } else {
        target.StatController.setCurrentStat(StatKey.OVERSHIELD, 0)
        value -= overshield
        this._parent.log(`Overshield absorbed ${overshield} damage before breaking`)
        this._parent.CombatLog.StatChange(-overshield, 'overshield')
      }
    }

    this._parent.ActiveActor.StatController.setCurrentStat(
      StatKey.HP,
      this._parent.ActiveActor.StatController.getCurrent(StatKey.HP) - value
    )
    this._parent.log(`Took ${value} ${type} damage`)
    this._parent.CombatLog.StatChange(-value, 'hp')

    while (
      target.StatController.getCurrent(StatKey.HP) <= 0 &&
      target.StatController.getCurrent(StatKey.STRUCTURE) > 0
    ) {
      target.StatController.setCurrentStat(
        StatKey.STRUCTURE,
        target.StatController.getCurrent(StatKey.STRUCTURE) - 1
      )
      if (target.StatController.getCurrent(StatKey.STRUCTURE) >= 0)
        this._parent.log(
          `Structure damaged! Remaining structure: ${target.StatController.getCurrent(StatKey.STRUCTURE)}`
        )
      if (target.StatController.getCurrent(StatKey.STRUCTURE) > 0)
        this._parent.CombatLog.StatChange(-1, 'structure')
      target.StatController.setCurrentStat(
        StatKey.HP,
        target.StatController.getCurrent(StatKey.HP) + target.StatController.getMax(StatKey.HP)
      )
    }

    if (target.StatController.getCurrent(StatKey.STRUCTURE) < 0) {
      target.StatController.setCurrentStat(StatKey.STRUCTURE, 0)
    }
  }

  public ApplyHeat(value: number): void {
    const totalValue = value
    const target = this._active

    target.StatController.setCurrentStat(
      StatKey.HEATCAP,
      target.StatController.getCurrent(StatKey.HEATCAP) + totalValue
    )
    this._parent.log(`Gained ${totalValue} Heat`)
    this._parent.CombatLog.StatChange(value, 'heat')

    if (this._parent.IsInDangerZone)
      this._parent.log(
        `In Danger Zone! Current Heat: ${target.StatController.getCurrent(StatKey.HEATCAP)}`
      )

    while (
      target.StatController.getCurrent(StatKey.HEATCAP) >
      target.StatController.getMax(StatKey.HEATCAP)
    ) {
      target.StatController.setCurrentStat(
        StatKey.STRESS,
        target.StatController.getCurrent(StatKey.STRESS) - 1
      )
      if (target.StatController.getCurrent(StatKey.STRESS) >= 0)
        this._parent.log(
          `Reactor stressed! Remaining Reactor Stress: ${target.StatController.getCurrent(StatKey.STRESS)}`
        )
      if (target.StatController.getCurrent(StatKey.STRESS) > 0)
        this._parent.CombatLog.StatChange(-1, 'stress')
      target.StatController.setCurrentStat(
        StatKey.HEATCAP,
        target.StatController.getCurrent(StatKey.HEATCAP) -
          target.StatController.getMax(StatKey.HEATCAP)
      )
    }

    if (target.StatController.getCurrent(StatKey.STRESS) < 0) {
      target.StatController.setCurrentStat(StatKey.STRESS, 0)
    }

    if (target.StatController.getCurrent(StatKey.STRESS) === 0) {
      this._parent.ReactorDestroyed = true
      this._parent.log('Reactor destroyed!')
    }
  }
}

export { DamageController }
