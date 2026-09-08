import type { CombatController } from './CombatController'
import { StatKey } from './stats/Stats'
import type { IStatWriteOpts } from './stats/StatController'
import type { CheckKind, IPendingCheck } from './StructureCheck'
import type { HeatChangeReason } from './log/events'

class PendingCheckController {
  private _parent: CombatController

  public PendingChecks: IPendingCheck[] = []
  public SuppressChecks: boolean = false

  constructor(parent: CombatController) {
    this._parent = parent
  }

  public Add(kind: CheckKind): void {
    if (this.SuppressChecks) return
    this.PendingChecks.push({ id: crypto.randomUUID(), kind })
  }

  public Remove(id: string): void {
    this.PendingChecks = this.PendingChecks.filter(p => p.id !== id)
  }

  public get RollsStructureChart(): boolean {
    return this._parent.StatController.getMax(StatKey.STRUCTURE) > 1
  }

  public get RollsStressChart(): boolean {
    return this._parent.StatController.getMax(StatKey.STRESS) > 1
  }

  public onStatDecrease(key: string, prev = 0, next = 0, opts: IStatWriteOpts = {}): void {
    const cc = this._parent
    if (key === StatKey.SPEED) {
      if (!opts.silent) cc.Record('move', { spent: prev - next, mode: 'move' })
      return
    }
    if (key === StatKey.HEATCAP) {
      if (!opts.silent)
        cc.Record('heat', {
          amount: prev - next,
          cleared: true,
          reason: (opts.heatReason as HeatChangeReason) ?? 'manual',
          current: next,
          cap: cc.StatController.getMax(StatKey.HEATCAP),
          dangerZone: cc.IsInDangerZone,
        })
      return
    }
    if (key === StatKey.STRUCTURE) {
      if (this.RollsStructureChart) this.Add('structure')
    } else if (key === StatKey.STRESS) {
      if (this.RollsStressChart) this.Add('stress')
    } else if (key === StatKey.HP) {
      this._checkDownAndOut()
    }
  }

  private _checkDownAndOut(): void {
    const cc = this._parent
    if (!cc.IsPilot) return
    if (cc.StatController.getCurrent(StatKey.HP) > 0) return
    if (cc.IsDead) return
    if (cc.HasStatus('downandout')) {
      cc.Kill()
      return
    }
    cc.AddStatus('downandout')
  }

  public Serialize(target: any): void {
    target.pending_checks = this.PendingChecks.map(p => ({ ...p }))
  }

  public Deserialize(data: any): void {
    this.PendingChecks = data?.pending_checks || []
  }
}

export { PendingCheckController }
