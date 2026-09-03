import { DamageType } from '../../enums'
import { StatKey } from './stats/Stats'
import { DamageCalculationFlow, DamageApplicationFlow, HeatFlow, armorReduction } from './flows/DamageFlow'
import type { IDamageCalcState, IDamageResult } from './flows/DamageFlow'
import type { CombatController } from './CombatController'

class DamageController {
  private _parent: CombatController

  constructor(parent: CombatController) {
    this._parent = parent
  }

  private get _active(): CombatController {
    return this._parent.ActiveActor.CombatController
  }

  private resolveTarget(direct: boolean): CombatController {
    return direct ? this._parent : this._parent.ActiveActor.CombatController
  }

  public CalculateArmorReduction(
    type: DamageType,
    value: number,
    ap: boolean,
    irreducible: boolean,
    direct = false
  ): number {
    return armorReduction(this._calcState(type, value, ap, irreducible, direct))
  }

  private _calcState(
    type: DamageType,
    value: number,
    ap: boolean,
    irreducible: boolean,
    direct: boolean
  ): IDamageCalcState {
    return {
      cc: this._parent,
      target: this.resolveTarget(direct),
      type,
      value,
      ap,
      irreducible,
      armorReduction: 0,
      out: { total: value, resist: [], condition: [], tookDamage: true },
    }
  }

  public CalculateDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    direct = false
  ): IDamageResult {
    return DamageCalculationFlow.Begin(this._calcState(type, value, ap, irreducible, direct)).state
      .out
  }

  public TakeDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    direct = false
  ): void {
    if (this._parent.SaveLock) return

    const target = this.resolveTarget(direct)

    if (
      type.toLowerCase() === DamageType.Heat.toLowerCase() &&
      !target.StatController.getMax(StatKey.HEATCAP)
    ) {
      type = DamageType.Energy
    }

    const damage = this.CalculateDamage(type, value, ap, irreducible, direct)

    this.ApplyDamage(type, damage.total, direct)

    this._parent.CombatLog.TakeDamage(value, type)
    this._parent.CombatLog.ArmorReduced(
      this.CalculateArmorReduction(type, value, ap, irreducible, direct)
    )
    if (this._parent.IsDestroyed) this._parent.CombatLog.LoseMech()
  }

  public ApplyDamage(type: DamageType, value: number, direct = false): void {
    DamageApplicationFlow.Begin({
      cc: this._parent,
      target: this.resolveTarget(direct),
      type,
      value,
    })
  }

  public ApplyHeat(value: number, opts: { external?: boolean } = {}): void {
    HeatFlow.Begin({
      cc: this._parent,
      target: this._active,
      value,
      external: !!opts.external,
    })
  }
}

export { DamageController }
