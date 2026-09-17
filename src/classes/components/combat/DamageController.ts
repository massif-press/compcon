import { DamageType } from '../../enums'
import { StatKey } from './stats/Stats'
import {
  DamageCalculationFlow,
  DamageApplicationFlow,
  HeatFlow,
  armorReduction,
} from './flows/DamageFlow'
import type { IDamageCalcState, IDamageResult } from './flows/DamageFlow'
import type { CombatController } from './CombatController'
import { withLogGroup } from './log/CombatLogRecorder'

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
      ap,
      irreducible,
      armorReduction: 0,
      out: { total: value, resist: [], condition: [], tookDamage: true },
    }
  }

  private _calculate(
    type: DamageType,
    value: number,
    ap: boolean,
    irreducible: boolean,
    direct: boolean
  ): IDamageCalcState {
    return DamageCalculationFlow.Begin(this._calcState(type, value, ap, irreducible, direct)).state
  }

  public CalculateDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    direct = false
  ): IDamageResult {
    return this._calculate(type, value, ap, irreducible, direct).out
  }

  public TakeDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    direct = false
  ): void {
    withLogGroup(() => this._takeDamage(type, value, ap, irreducible, direct))
  }

  private _takeDamage(
    type: DamageType,
    value: number,
    ap: boolean,
    irreducible: boolean,
    direct: boolean
  ): void {
    if (this._parent.SaveLock) return

    const target = this.resolveTarget(direct)

    if (
      type.toLowerCase() === DamageType.Heat.toLowerCase() &&
      !target.StatController.getMax(StatKey.HEATCAP)
    ) {
      type = DamageType.Energy
    }

    const calc = this._calculate(type, value, ap, irreducible, direct)
    const damage = calc.out
    const wasDestroyed = this._parent.IsDestroyed

    this._parent.Record('damage', {
      targetId: target.RootActor?.ID ?? target.Parent.ID,
      damageType: type,
      incoming: value,
      armorReduced: calc.armorReduction,
      resisted: damage.resist,
      conditions: damage.condition,
      final: damage.total,
      ap,
      irreducible,
      taken: damage.tookDamage,
    })

    this.ApplyDamage(type, damage.total, direct)

    if (wasDestroyed || !this._parent.IsDestroyed) return

    const deployable: any =
      (target.Parent as any)?.ItemType === 'Deployable' ? target.Parent : undefined
    if (!deployable) {
      this._parent.Record('mech.status', { to: 'destroyed' })
      return
    }
    const owner = (deployable as any).Owner?.actor?.CombatController
    const payload = { deployable: { id: deployable.ID, name: deployable.Name } }
    if (owner) owner.Record('deployable.destroy', payload)
    else this._parent.Record('deployable.destroy', payload)
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
