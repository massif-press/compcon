import { markRaw } from 'vue'
import { StatKey } from './stats/Stats'
import { TimedEffect } from '../feature/active_effects/TimedEffect'
import { ActivePeriod, regainsOn, type Frequency } from '../../Frequency'
import { ActivationType } from '../../enums'
import type { CombatController } from './CombatController'

const DEFAULT_COMBAT_ACTIONS = {
  Protocol: true,
  Full: true,
  Quick1: true,
  Quick2: true,
  Overcharge: true,
  Reaction: true,
  InOvercharge: false,
}

const QUICK_ACTIVATIONS = ['quick', 'quicktech', 'invade']

const normalizeActivation = (activation: string): string =>
  (activation || '').toLowerCase().replace(/\s+/g, '')

const isQuickActivation = (activation: string): boolean =>
  QUICK_ACTIVATIONS.includes(normalizeActivation(activation))

export { DEFAULT_COMBAT_ACTIONS, isQuickActivation, normalizeActivation }

interface IActionUseRecord {
  used: number
  max: number
  period: ActivePeriod
}

class ActionPoolController {
  private _parent: CombatController

  public _combatActions: any = { ...DEFAULT_COMBAT_ACTIONS }

  private _actionUses: Record<string, IActionUseRecord> = {}

  public IsInSelfDestruct = false
  public ReactorDestroyed: boolean = false
  public IsDead: boolean = false

  constructor(parent: CombatController) {
    this._parent = parent
  }

  public get CombatActions(): any {
    if (this._parent.IsMech && this._parent.IsAIControlled) return this._combatActions
    return this._parent.RootActor.CombatController.ActionPoolController._combatActions
  }

  public set CombatActions(value: any) {
    if (this._parent.IsMech && this._parent.IsAIControlled) {
      this._combatActions = value
      return
    }
    this._parent.RootActor.CombatController.ActionPoolController._combatActions = value
  }

  public ReactionsUsed: string[] = []

  public get ReactionOptions(): string[] {
    const granted = this._parent.AllActions(ActivationType.Reaction).map(a => a.ID.toLowerCase())
    return [...new Set(['brace', 'overwatch', ...granted])]
  }

  public get AvailableReactions(): string[] {
    return this.ReactionOptions.filter(id => this._parent.CanActivate(id))
  }

  public CanUseReaction(id: string): boolean {
    return this.CombatActions.Reaction && !this.ReactionsUsed.includes(id.toLowerCase())
  }

  public UseReaction(id: string): void {
    if (!this.CanUseReaction(id)) return
    this.ReactionsUsed.push(id.toLowerCase())
    this._parent.SetCombatAction('reaction', false)
  }

  public RestoreReaction(id: string): void {
    const key = id.toLowerCase()
    if (!this.ReactionsUsed.includes(key)) return
    this.ReactionsUsed = this.ReactionsUsed.filter(r => r !== key)
    this._parent.SetCombatAction('reaction', true)
  }

  public RefreshReactions(): void {
    this.CombatActions.Reaction = true
  }

  public ClearReactionUses(): void {
    this.ReactionsUsed = []
  }

  public get InOvercharge(): boolean {
    if (this._parent.DeniesActivation('overcharge')) return false
    return !!this.CombatActions.InOvercharge
  }

  public get OverchargeApplies(): boolean {
    return this.InOvercharge && this._parent.ActiveActor?.CombatController?.IsMech
  }

  public set InOvercharge(value: boolean) {
    this.CombatActions.InOvercharge = value
  }

  public get HasRemainingActions(): boolean {
    return (
      this._parent.CanActivate('protocol') ||
      this._parent.CanActivate('full') ||
      this._parent.CanActivate('quick')
    )
  }

  public CanActivate(action: string, actionId?: string): boolean {
    const str = normalizeActivation(action)
    if (this._parent.DeniesActivation(str, actionId)) return false
    if (
      this._parent.IsNpc &&
      (str === 'brace' || str === 'overcharge') &&
      !this._parent.GrantsAction(str)
    )
      return false
    switch (str) {
      case 'free':
      case 'none':
        return true
      case 'protocol':
        return (
          this.CombatActions.Protocol &&
          this.CombatActions.Quick1 &&
          this.CombatActions.Quick2 &&
          this.CombatActions.Full &&
          this._parent.StatController.getCurrent(StatKey.SPEED) >=
            this._parent.StatController.getMax(StatKey.SPEED)
        )
      case 'ordnance':
        return (
          this.CombatActions.Quick1 &&
          this.CombatActions.Quick2 &&
          this.CombatActions.Full &&
          this._parent.StatController.getCurrent(StatKey.SPEED) >=
            this._parent.StatController.getMax(StatKey.SPEED)
        )
      case 'full':
      case 'fulltech':
      case 'jockey':
        return this.CombatActions.Full && this.CombatActions.Quick1 && this.CombatActions.Quick2
      case 'quick':
      case 'quicktech':
      case 'invade':
        return this.OverchargeApplies || this.CombatActions.Quick1 || this.CombatActions.Quick2
      case 'quick1':
        return this.CombatActions.Quick1
      case 'quick2':
        return this.CombatActions.Quick2
      case 'overcharge':
        return this.CombatActions.Overcharge
      case 'reaction':
        return this.CombatActions.Reaction
      case 'move':
        return this._parent.StatController.getCurrent(StatKey.SPEED) > 0
      case 'boost':
        return (
          this._parent.StatController.getCurrent(StatKey.SPEED) > 0 &&
          (this.OverchargeApplies || this.CombatActions.Quick1 || this.CombatActions.Quick2)
        )
      case 'fight':
      case 'mount':
      case 'dismount':
      case 'disengage':
      case 'improvised_attack':
      case 'jockey_action':
        return this.CombatActions.Full && this.CombatActions.Quick1 && this.CombatActions.Quick2
      case 'eject':
      case 'grapple':
      case 'ram':
      case 'activate':
      case 'search':
      case 'prepare':
      case 'hide':
      case 'shutdown':
      case 'shut_down':
        return this.OverchargeApplies || this.CombatActions.Quick1 || this.CombatActions.Quick2
      case 'brace':
      case 'overwatch':
        return this._parent.CanUseReaction(str)
      default:
        if (this.ReactionOptions.includes(str)) return this._parent.CanUseReaction(str)
        return false
    }
  }

  public ResetCombatActions(): void {
    this.CombatActions = { ...DEFAULT_COMBAT_ACTIONS }
  }

  public toggleCombatAction(action: string): void {
    const str = action.toLowerCase()
    this._parent.SetCombatAction(str, !this._parent.CanActivate(str))
  }

  public SetCombatAction(action: string, value: boolean): void {
    this._parent.CombatLogVersion++
    const str = normalizeActivation(action)
    switch (str) {
      case 'protocol':
        this.CombatActions.Protocol = value
        break
      case 'full':
      case 'fulltech':
      case 'jockey':
        this.CombatActions.Full = value
        this.CombatActions.Quick1 = this.CombatActions.Full
        this.CombatActions.Quick2 = this.CombatActions.Full
        if (!value) {
          this.CombatActions.Protocol = false
          this.InOvercharge = false
        }
        break
      case 'quick':
      case 'quicktech':
      case 'invade':
        if (!value && this.OverchargeApplies) {
          this.InOvercharge = false
          break
        }
        if (this.CombatActions.Quick1 && !value) this.CombatActions.Quick1 = false
        else if (this.CombatActions.Quick2 && !value) this.CombatActions.Quick2 = false
        else if (!this.CombatActions.Quick1 && value) this.CombatActions.Quick1 = true
        else if (!this.CombatActions.Quick2 && value) this.CombatActions.Quick2 = true
        if (!value) this.CombatActions.Protocol = false
        break
      case 'quick1':
      case 'quick2': {
        if (!value && this.OverchargeApplies) {
          this.InOvercharge = false
          break
        }
        this.CombatActions[str === 'quick1' ? 'Quick1' : 'Quick2'] = value
        if (!value) this.CombatActions.Protocol = false
        break
      }
      case 'overcharge':
        this.CombatActions.Overcharge = value
        if (value) this.InOvercharge = false
        break
      case 'reaction':
        this.CombatActions.Reaction = value
        if (!value) this.InOvercharge = false
        break
      default:
        break
    }
  }

  public ResetActivation(action: string, propagate = true): void {
    const str = normalizeActivation(action)
    switch (str) {
      case 'protocol':
        this.CombatActions.Protocol = true
        break
      case 'full':
      case 'fulltech':
      case 'jockey':
        this.CombatActions.Full = true
        this.CombatActions.Quick1 = true
        this.CombatActions.Quick2 = true
        break
      case 'quick':
      case 'quicktech':
      case 'invade':
        if (!this.CombatActions.Quick1) this.CombatActions.Quick1 = true
        else if (!this.CombatActions.Quick2) this.CombatActions.Quick2 = true
        break
      case 'overcharge':
        this.CombatActions.Overcharge = true
        break
      case 'reaction':
        this.CombatActions.Reaction = true
        break
      default:
        break
    }
    if (propagate) {
      this._parent.Counterpart?.ResetActivation(action, false)
    }
  }

  public MarkActionUsed(actionId: string, frequency?: Frequency): void {
    const limited = frequency && !frequency.Unlimited ? frequency : undefined
    const record = this._actionUses[actionId] ?? {
      used: 0,
      max: limited?.Uses ?? 1,
      period: limited?.Duration ?? ActivePeriod.Turn,
    }
    if (record.used >= record.max) return
    record.used++
    this._actionUses[actionId] = record
    this._parent.CombatLogVersion++
  }

  public UsedCount(actionId: string): number {
    return this._actionUses[actionId]?.used ?? 0
  }

  public RemainingUses(actionId: string): number {
    const record = this._actionUses[actionId]
    return record ? record.max - record.used : 1
  }

  public IsActionUsed(actionId: string): boolean {
    return this.RemainingUses(actionId) <= 0
  }

  public ClearActionUsed(actionId: string): void {
    if (!this._actionUses[actionId]) return
    delete this._actionUses[actionId]
    this._parent.CombatLogVersion++
  }

  public RestoreUse(actionId: string): void {
    const record = this._actionUses[actionId]
    if (!record) return
    record.used--
    if (record.used < 1) delete this._actionUses[actionId]
    this._parent.CombatLogVersion++
  }

  public ClearUses(event: ActivePeriod): void {
    for (const [id, record] of Object.entries(this._actionUses)) {
      if (regainsOn(record.period, event)) delete this._actionUses[id]
    }
  }

  public get ActionUses(): Record<string, IActionUseRecord> {
    return this._actionUses
  }

  public set ActionUses(val: Record<string, IActionUseRecord>) {
    this._actionUses = val
  }

  public UseAttackAction(actionId: string, weaponInstanceId?: string): void {
    this._parent.MarkActionUsed(actionId)
    if (weaponInstanceId) this._parent.MarkActionUsed(weaponInstanceId)
    this._parent.DropAttackRevealedStatuses()
  }

  public CanTakeAction(actionId: string, activation: string, useId?: string): boolean {
    if (this.CanRepeatAsOvercharge(actionId, activation)) return true
    return this.RemainingUses(actionId) > 0 && this.RemainingUses(useId ?? actionId) > 0
  }

  public CanRepeatAsOvercharge(actionId: string, activation: string): boolean {
    if (!this.OverchargeApplies) return false
    if (!isQuickActivation(activation)) return false
    const action = this._parent.FindAction(actionId)
    if (action?.IsPilotAction) return false
    const freq = action?.Frequency
    if (freq && !freq.Unlimited) return this.RemainingUses(actionId) > 0
    const record = this._actionUses[actionId]
    if (record && (record.max > 1 || record.period !== ActivePeriod.Turn))
      return record.max - record.used > 0
    return true
  }

  public StartOvercharge(): void {
    this.CombatActions.Overcharge = false
    this.InOvercharge = true
    this._parent.log('Overcharged: any quick action may be taken as a free action')
  }

  public get OverchargeTrack(): any[] {
    return (this._parent.Parent as any).OverchargeTrack || []
  }

  public get OverchargeLevel(): number {
    return this._parent.StatController.getCurrent(StatKey.OVERCHARGE) || 0
  }

  public get OverchargeCost(): string | number {
    const track = (this._parent.Parent as any).OverchargeTrack || []
    return track[this.OverchargeLevel]
  }

  public IncreaseOverchargeLevel(): void {
    if (this.OverchargeLevel < this.OverchargeTrack.length - 1) {
      this._parent.StatController.setCurrentStat(
        StatKey.OVERCHARGE,
        this._parent.StatController.getCurrent(StatKey.OVERCHARGE) + 1
      )
      this._parent.log(
        `Increased overcharge to level ${this.OverchargeLevel} (${this.OverchargeCost} Heat)`
      )
    }
  }

  public StartSelfDestruct(fireOnRound?: number): void {
    if (this.IsInSelfDestruct) return
    this.IsInSelfDestruct = true
    this._parent.TimedEffects.push(
      markRaw(
        new TimedEffect({
          name: 'Self Destruct',
          detail: `This mech will explode as though it suffered a reactor meltdown. The explosion will annihilate this mech, killing everyone inside and dealing 4d6 explosive damage to all targets in a burst 2 area around it.`,
          round: fireOnRound ?? this._parent.SelfDestructWindow[0],
          apply: { other: 'self_destruct' },
        })
      )
    )
    this._parent.log('Self Destruct sequence initiated!')
  }

  public CommitReactorMeltdown(): void {
    this._parent.StatController.setCurrentStat(StatKey.STRUCTURE, 0)
    this._parent.StatController.setCurrentStat(StatKey.HP, 0)
    this._parent.StatController.setCurrentStat(StatKey.HEATCAP, 0)
    this._parent.StatController.setCurrentStat(StatKey.STRESS, 0)
    this.ReactorDestroyed = true
    this.IsInSelfDestruct = false
    if (this._parent.Mounted && this._parent.IsMech) this._parent.RootActor.CombatController.Kill()
  }

  public CommitSelfDestruct(): void {
    this.CommitReactorMeltdown()
    this._parent.log('Mech has self-destructed!')
  }

  public Kill(): void {
    this._parent.StatController.setCurrentStat(StatKey.HP, 0)
    this.IsDead = true
    this._parent.log('Pilot registered as KIA')
  }
}

export { ActionPoolController }
export type { IActionUseRecord }
