import { markRaw } from 'vue'
import { Mech } from '../../mech/Mech'
import { Pilot } from '../../pilot/Pilot'
import { StatKey } from './stats/Stats'
import { TimedEffect } from '../feature/active_effects/TimedEffect'
import type { CombatController } from './CombatController'

const DEFAULT_COMBAT_ACTIONS = {
  Protocol: true,
  Full: true,
  Quick1: true,
  Quick2: true,
  Overcharge: true,
  Reaction: true,
}

export { DEFAULT_COMBAT_ACTIONS }

class ActionPoolController {
  private _parent: CombatController

  public _combatActions: any = { ...DEFAULT_COMBAT_ACTIONS }

  private _usedActions: string[] = []

  public IsInSelfDestruct = false
  public ReactorDestroyed: boolean = false
  public IsDead: boolean = false

  constructor(parent: CombatController) {
    this._parent = parent
  }

  public get CombatActions(): any {
    if (this._parent.Parent instanceof Mech && this._parent.IsAIControlled)
      return this._combatActions
    return this._parent.RootActor.CombatController.ActionPoolController._combatActions
  }

  public set CombatActions(value: any) {
    this._parent.RootActor.CombatController.ActionPoolController._combatActions = value
  }

  public get HasRemainingActions(): boolean {
    return (
      this._parent.CanActivate('protocol') ||
      this._parent.CanActivate('full') ||
      this._parent.CanActivate('quick')
    )
  }

  public CanActivate(action: string): boolean {
    const str = action.toLowerCase().replace(' ', '')
    switch (str) {
      case 'free':
      case 'none':
        return true
      case 'protocol':
        return (
          this.CombatActions.Protocol &&
          this.CombatActions.Quick1 &&
          this.CombatActions.Quick2 &&
          this.CombatActions.Full
        )
      case 'ordnance':
        return (
          this.CombatActions.Quick1 &&
          this.CombatActions.Quick2 &&
          this.CombatActions.Full &&
          this.CombatActions.Overcharge &&
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
        return this.CombatActions.Quick1 || this.CombatActions.Quick2
      case 'overcharge':
        return this.CombatActions.Overcharge
      case 'reaction':
        return this.CombatActions.Reaction
      case 'move':
        return this._parent.StatController.getCurrent(StatKey.SPEED) > 0
      default:
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
    const str = action.toLowerCase()
    switch (str) {
      case 'protocol':
        break
      case 'full':
      case 'full tech':
        this.CombatActions.Full = value
        this.CombatActions.Quick1 = this.CombatActions.Full
        this.CombatActions.Quick2 = this.CombatActions.Full
        if (!value) this.CombatActions.Protocol = !value
        break
      case 'quick':
      case 'quicktech':
      case 'quick tech':
      case 'invade':
        if (this.CombatActions.Quick1 && !value) this.CombatActions.Quick1 = false
        else if (this.CombatActions.Quick2 && !value) this.CombatActions.Quick2 = false
        else if (!this.CombatActions.Quick1 && value) this.CombatActions.Quick1 = true
        else if (!this.CombatActions.Quick2 && value) this.CombatActions.Quick2 = true
        if (!value) this.CombatActions.Protocol = !value
        break
      case 'overcharge':
        this.CombatActions.Overcharge = value
        break
      case 'reaction':
        this.CombatActions.Reaction = value
        break
      default:
        break
    }
  }

  public ResetActivation(action: string, propagate = true): void {
    const str = action.toLowerCase()
    switch (str) {
      case 'protocol':
        this.CombatActions.Protocol = true
        break
      case 'full':
        this.CombatActions.Full = true
        this.CombatActions.Quick1 = true
        this.CombatActions.Quick2 = true
        break
      case 'quick':
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
      if (this._parent.Parent instanceof Pilot) {
        this._parent.Parent.ActiveMech?.CombatController.ResetActivation(action, false)
      } else if (this._parent.Parent instanceof Mech)
        this._parent.Parent.Pilot?.CombatController.ResetActivation(action, false)
    }
  }

  public MarkActionUsed(actionId: string): void {
    if (!this._usedActions.includes(actionId)) this._usedActions.push(actionId)
  }

  public IsActionUsed(actionId: string): boolean {
    return this._usedActions.includes(actionId)
  }

  public ClearActionUsed(actionId: string): void {
    const index = this._usedActions.indexOf(actionId)
    if (index !== -1) this._usedActions.splice(index, 1)
  }

  public clearAllUsedActions(): void {
    this._usedActions = []
  }

  public get usedActions(): string[] {
    return this._usedActions
  }

  public set usedActions(val: string[]) {
    this._usedActions = val
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

  public StartSelfDestruct(): void {
    if (this.IsInSelfDestruct) return
    this.IsInSelfDestruct = true
    this._parent.TimedEffects.push(
      markRaw(
        new TimedEffect({
          name: 'Self Destruct',
          detail: `This mech will explode as though it suffered a reactor meltdown. The explosion will annihilate this mech, killing everyone inside and dealing 4d6 explosive damage to all targets in a burst 2 area around it.`,
          round: this._parent.Round + 3,
          apply: { other: 'self_destruct' },
        })
      )
    )
    this._parent.log('Self Destruct sequence initiated!')
  }

  public CommitSelfDestruct(): void {
    this._parent.StatController.setCurrentStat(StatKey.STRUCTURE, 0)
    this._parent.StatController.setCurrentStat(StatKey.HP, 0)
    this._parent.StatController.setCurrentStat(StatKey.HEATCAP, 0)
    this._parent.StatController.setCurrentStat(StatKey.STRESS, 0)
    this.ReactorDestroyed = true
    this.IsInSelfDestruct = false
    if (this._parent.Mounted && this._parent.Parent instanceof Mech) {
      const pilot = this._parent.Parent.Parent
      pilot.CombatController.Kill()
    }
    this._parent.log('Mech has self-destructed!')
  }

  public Kill(): void {
    this._parent.StatController.setCurrentStat(StatKey.HP, 0)
    this.IsDead = true
    this._parent.log('Pilot registered as KIA')
  }
}

export { ActionPoolController }
