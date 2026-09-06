import { markRaw } from 'vue'
import type { IControllerStatic } from '@/classes/ISerializable'
import { Counter } from './counters/Counter'
import { ActivationType, DamageType } from '../../enums'
import { Mech } from '../../mech/Mech'
import { Pilot } from '../../pilot/Pilot'
import { ICombatant } from './ICombatant'
import { IStatData, StatController } from './stats/StatController'
import { StatKey } from './stats/Stats'
import { CounterController, ICounterCollection } from './counters/CounterController'
import { SaveController } from '../save/SaveController'
import { ICounterContainer } from './counters/ICounterContainer'
import { IStatContainer } from './stats/IStatContainer'
import { Status } from '@/classes/Status'
import { ActiveEffect } from '../feature/active_effects/ActiveEffect'
import {
  ITimedEffectAction,
  ITimedEffectData,
  TimedEffect,
} from '../feature/active_effects/TimedEffect'
import * as _ from 'lodash-es'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import {
  EffectSpecial,
  IEffectSpecialData,
} from '../feature/active_effects/effect_subtype/EffectSpecial'
import { Action } from '@/classes/Action'
import { ActivePeriod, Frequency } from '@/classes/Frequency'
import { BonusController } from '../feature/bonus/BonusController'
import { CompendiumStore } from '@/features/compendium/store'
import { expiration } from './Expiration'
import { CombatLogRecorder } from './log/CombatLogRecorder'
import type { IRecorderData } from './log/CombatLogRecorder'
import { statusRef, itemRef } from './log/refs'
import type { BlockedReason, HeatChangeReason, ILogPayloads, LogEventKind } from './log/events'
import type { IStatWriteOpts } from './stats/StatController'
import { groupOf } from './flows/logHooks'
import { Bonus } from '../feature/bonus/Bonus'
import { assertController } from '../../utility/assertController'
import { StatusController } from './StatusController'
import {
  ActionPoolController,
  DEFAULT_COMBAT_ACTIONS,
  normalizeActivation,
  type IActionUseRecord,
} from './ActionPoolController'
import { DamageController } from './DamageController'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { ruleFor, customRuleFor, kindsFor } from './StatusRules'
import { ActivationFlow, BraceFlow, OverwatchFlow, activationBlock } from './flows/ActivationFlow'
import { EndTurnFlow, EndRoundFlow } from './flows/LifecycleFlow'
import type { IEndTurnState } from './flows/LifecycleFlow'
import type { IFlowResult } from './flows/Flow'
import type { IActivationState } from './flows/ActivationFlow'
import type { IStatusRule } from './StatusRules'
import type { CheckKind, IPendingCheck } from './StructureCheck'
import { TAG, hasTag } from '@/classes/TagRules'
import { expiredIn, isDue, roundsRemaining } from './Duration'
import type { IDurationContext } from './Duration'

enum CoverType {
  None = 'none',
  Soft = 'soft',
  Hard = 'hard',
}

interface CombatData {
  resistances: { type: DamageType; condition: string }[]
  statuses: { status: string; expires: string }[]
  customStatuses: { status: IEffectSpecialData; expires: string }[]
  counters: ICounterCollection
  cover: CoverType
  corePower: boolean

  mounted: boolean
  overwatch: boolean
  braced: boolean
  prepared: boolean
  disengaged?: boolean
  boostBonus?: number
  carrying?: 'drag' | 'lift' | 'none'
  coreActive: boolean
  aiControl: boolean

  isInSelfDestruct: boolean
  reactorDestroyed: boolean
  rechargeRolledRound?: number
  reactionsUsed?: string[]
  braceGranted?: string[]
  isDead: boolean

  stats: IStatData

  timed_effects: ITimedEffectData[]

  combatActions: any
  usedActions: string[]
  actionUses: Record<string, IActionUseRecord>

  combat_log: IRecorderData
  round: number
  turn: number

  pending_checks: IPendingCheck[]
}

interface IPerformOpts {
  target?: any
  success?: boolean
  smaller?: any
  willing?: boolean
  options?: string[]
  value?: number
  force?: boolean
}

interface IBaseActionRule {
  activation: string
  needsTarget?: boolean
  contested?: boolean
  melee?: boolean
  reason?: BlockedReason
  can?: (cc: CombatController, opts: IPerformOpts) => boolean
  run: (cc: CombatController, opts: IPerformOpts) => boolean
}

const BASE_ACTIONS: Record<string, IBaseActionRule> = {
  act_shut_down: {
    activation: 'quick',
    reason: 'shut_down',
    can: cc => !cc.HasStatus('shut-down'),
    run: cc => {
      cc.ShutDown()
      return true
    },
  },
  act_boot_up: {
    activation: 'full',
    reason: 'unavailable',
    can: cc => cc.HasStatus('shut-down'),
    run: cc => cc.BootUp(),
  },
  act_hide: {
    activation: 'quick',
    reason: 'engaged',
    can: cc => !cc.HasStatus('engaged'),
    run: cc => cc.Hide(),
  },
  act_disengage: { activation: 'full', run: cc => cc.Disengage() },
  act_eject: {
    activation: 'quick',
    reason: 'unmounted',
    can: cc => cc.Mounted,
    run: cc => cc.Eject(),
  },
  act_dismount: {
    activation: 'full',
    reason: 'unmounted',
    can: cc => cc.Mounted,
    run: cc => cc.Dismount(),
  },
  act_mount: {
    activation: 'full',
    reason: 'mounted',
    can: cc => !cc.Mounted,
    run: cc => {
      cc.ToggleMounted()
      return true
    },
  },
  act_prepare: {
    activation: 'quick',
    reason: 'unavailable',
    can: cc => !cc.Prepared,
    run: cc => {
      cc.Prepare()
      return true
    },
  },
  act_stand_up: {
    activation: 'free',
    reason: 'prone',
    can: cc => cc.HasStatus('prone') && !cc.HasStatus('immobilized'),
    run: cc => cc.StandUp(),
  },
  act_self_destruct: {
    activation: 'quick',
    reason: 'unavailable',
    can: cc => !cc.IsInSelfDestruct,
    run: cc => {
      cc.StartSelfDestruct()
      return true
    },
  },
  act_grapple: {
    activation: 'grapple',
    needsTarget: true,
    melee: true,
    run: (cc, o) => cc.Grapple(o.target, { hit: o.success !== false, smaller: o.smaller }),
  },
  act_ram: {
    activation: 'ram',
    needsTarget: true,
    melee: true,
    run: (cc, o) => cc.Ram(o.target, { hit: o.success !== false }),
  },
  act_boost: {
    activation: 'boost',
    reason: 'unavailable',
    run: cc => cc.Boost(),
  },
  act_search: {
    activation: 'quick',
    needsTarget: true,
    contested: true,
    run: (cc, o) => cc.Search(o.target, { success: o.success !== false }),
  },
  act_jockey: {
    activation: 'jockey',
    run: (cc, o) => (o.target ? cc.Jockey(o.target, { success: o.success !== false }) : true),
  },
  act_lockon: {
    activation: 'quicktech',
    needsTarget: true,
    run: (cc, o) => cc.LockOn(o.target),
  },
  act_bolster: {
    activation: 'quicktech',
    needsTarget: true,
    run: (cc, o) => {
      o.target.Bolster()
      return true
    },
  },
  act_invade: {
    activation: 'quicktech',
    run: (cc, o) => {
      if (!o.target) return true
      if (cc.IsNpc) {
        cc.NpcInvade(o.target)
        return true
      }
      return cc.Invade(o.target, { willing: o.willing }).automatic
    },
  },
  act_full_tech: { activation: 'fulltech', run: (cc, o) => cc.UseFullTech(o.options ?? []) },
  act_stabilize: {
    activation: 'full',
    run: (cc, o) => {
      ;(o.options ?? []).forEach(choice => cc.Stabilize(choice as any))
      return true
    },
  },
  act_stabilize_npc: {
    activation: 'full',
    run: cc => {
      cc.Stabilize('npc')
      return true
    },
  },
  act_reload: {
    activation: 'quick',
    reason: 'no_uses',
    can: cc => cc.ReloadOptions().length > 0,
    run: (cc, o) => cc.Reload(o.target),
  },
  act_brace: {
    activation: 'brace',
    reason: 'unavailable',
    run: cc => cc.SetBraced(true, true),
  },
  act_overwatch: {
    activation: 'overwatch',
    reason: 'unavailable',
    run: cc => cc.SetOverwatch(true, true),
  },
  act_overcharge: {
    activation: 'free',
    reason: 'unavailable',
    can: cc => cc.CanActivate('overcharge'),
    run: (cc, o) => {
      cc.Overcharge(typeof o.value === 'number' ? o.value : undefined)
      return true
    },
  },
}

BASE_ACTIONS.act_lock_on = BASE_ACTIONS.act_lockon
BASE_ACTIONS.act_grapple_npc = BASE_ACTIONS.act_grapple
BASE_ACTIONS.act_ram_npc = BASE_ACTIONS.act_ram

class CombatController implements ICounterContainer, IStatContainer {
  public readonly Parent: ICombatant

  public StatusController: StatusController
  public Counters: Counter[] = []

  public get Resistances(): { type: string; condition: string }[] {
    return this.StatusController.Resistances
  }
  public set Resistances(val: { type: string; condition: string }[]) {
    this.StatusController.Resistances = val
  }

  public get Statuses(): { status: Status; expires: expiration; selfInflicted?: boolean }[] {
    return this.StatusController.Statuses
  }
  public set Statuses(val: { status: Status; expires: expiration; selfInflicted?: boolean }[]) {
    this.StatusController.Statuses = val
  }

  public get CustomStatuses(): { status: EffectSpecial; expires: expiration }[] {
    return this.StatusController.CustomStatuses
  }
  public set CustomStatuses(val: { status: EffectSpecial; expires: expiration }[]) {
    this.StatusController.CustomStatuses = val
  }
  public Cover: CoverType = CoverType.None
  public TimedEffects: TimedEffect[] = []
  public CorePower = true

  public Mounted = true
  public Overwatch = false
  public Braced = false
  public BraceGranted: string[] = []
  public Prepared = false
  public Disengaged = false
  public Carrying: 'drag' | 'lift' | 'none' = 'none'
  public CoreActive = false
  public AIControl = false

  public ActionPoolController: ActionPoolController
  public DamageController: DamageController

  public get IsInSelfDestruct(): boolean {
    return this.ActionPoolController.IsInSelfDestruct
  }
  public set IsInSelfDestruct(val: boolean) {
    this.ActionPoolController.IsInSelfDestruct = val
  }

  public get ReactorDestroyed(): boolean {
    return this.ActionPoolController.ReactorDestroyed
  }
  public set ReactorDestroyed(val: boolean) {
    this.ActionPoolController.ReactorDestroyed = val
  }

  public get IsDead(): boolean {
    return this.ActionPoolController.IsDead
  }
  public set IsDead(val: boolean) {
    this.ActionPoolController.IsDead = val
  }

  public StatController: StatController
  public CounterController: CounterController

  public CombatLog: CombatLogRecorder
  public CombatLogVersion: number = 0
  public Round: number = 1
  public Turn: number = 1

  public SaveLock: boolean = false

  public get CombatActions(): any {
    return this.ActionPoolController.CombatActions
  }

  public set CombatActions(value: any) {
    this.ActionPoolController.CombatActions = value
  }

  public get InOvercharge(): boolean {
    return this.ActionPoolController.InOvercharge
  }

  public set InOvercharge(value: boolean) {
    this.ActionPoolController.InOvercharge = value
  }

  constructor(parent: ICombatant) {
    this.Parent = parent
    this.StatusController = new StatusController(this)
    this.ActionPoolController = new ActionPoolController(this)
    this.DamageController = new DamageController(this)
    this.StatController = new StatController(this, parent.IsEncounterInstance)
    this.CounterController = new CounterController(this)
    this.CombatLog = markRaw(new CombatLogRecorder(this.RootActor))
  }

  public get SaveController(): SaveController {
    return this.Parent.SaveController
  }

  public get Grit(): number {
    return this.RootActor.Grit || 0
  }

  public get AttackBonus(): number {
    if (this.IsNpc) return this.StatController.getCurrent(StatKey.ATTACK_BONUS) || 0
    return (this.Parent as Mech | Pilot).AttackBonus || 0
  }

  public get TechAttackBonus(): number {
    if (this.IsNpc) return this.StatController.getCurrent(StatKey.TECH_ATTACK) || 0
    return (this.Parent as Mech | Pilot).TechAttack || 0
  }

  public AllActions(activation: `${ActivationType}`): Action[] {
    return this.Parent.FeatureController.Actions.filter(a => a.Activation === activation)
  }

  public get AllEquipment(): any[] {
    const p = this.Parent as any
    const byKind: Record<string, () => any[]> = {
      mech: () => p.MechLoadoutController.ActiveLoadout.Equipment,
      pilot: () => p.PilotLoadoutController.ActiveLoadout.Items,
      npc: () => p.NpcFeatureController?.Features ?? [],
    }
    return (byKind[this.Kind]() ?? []).filter(Boolean)
  }

  public get RootActor(): any {
    return this.IsMech ? (this.Parent as Mech).Parent : this.Parent
  }

  public get ActiveActor(): any {
    if ((this.Parent as Pilot).ActiveMech && this.Mounted) return (this.Parent as Pilot).ActiveMech
    return this.Parent
  }

  public get CombatName(): string {
    return this.Parent.Callsign || this.Parent.Name
  }

  public get Tier(): number {
    if (this.Parent.NpcClassController) return this.Parent.NpcClassController.Tier
    return 1
  }

  public get LimitedBonus(): number {
    if ((this.Parent as any).LimitedBonus !== undefined) return (this.Parent as any).LimitedBonus
    return 0
  }

  public get CurrentStructure(): number {
    return this.StatController.getCurrent(StatKey.STRUCTURE) || 0
  }

  public get CurrentStress(): number {
    return this.StatController.getCurrent(StatKey.STRESS) || 0
  }

  public RechargeRolledRound: number = -1

  public get CanRollRecharge(): boolean {
    return this.RechargeRolledRound !== this.Round
  }

  public PendingChecks: IPendingCheck[] = []
  public SuppressChecks: boolean = false

  public AddPendingCheck(kind: CheckKind): void {
    if (this.SuppressChecks) return
    this.PendingChecks.push({ id: crypto.randomUUID(), kind })
  }

  public RemovePendingCheck(id: string): void {
    this.PendingChecks = this.PendingChecks.filter(p => p.id !== id)
  }

  public get RollsStructureChart(): boolean {
    return this.StatController.getMax(StatKey.STRUCTURE) > 1
  }

  public get RollsStressChart(): boolean {
    return this.StatController.getMax(StatKey.STRESS) > 1
  }

  public ClearHeat(reason: HeatChangeReason, to = 0): void {
    this.StatController.setCurrentStat(StatKey.HEATCAP, to, { heatReason: reason })
  }

  public onStatDecrease(key: string, prev = 0, next = 0, opts: IStatWriteOpts = {}): void {
    if (key === StatKey.SPEED) {
      if (!opts.silent) this.Record('move', { spent: prev - next, mode: 'move' })
      return
    }
    if (key === StatKey.HEATCAP) {
      if (!opts.silent)
        this.Record('heat', {
          amount: prev - next,
          cleared: true,
          reason: (opts.heatReason as HeatChangeReason) ?? 'manual',
          current: next,
          cap: this.StatController.getMax(StatKey.HEATCAP),
          dangerZone: this.IsInDangerZone,
        })
      return
    }
    if (key === StatKey.STRUCTURE) {
      if (this.RollsStructureChart) this.AddPendingCheck('structure')
    } else if (key === StatKey.STRESS) {
      if (this.RollsStressChart) this.AddPendingCheck('stress')
    } else if (key === StatKey.HP) {
      this._checkDownAndOut()
    }
  }

  private _checkDownAndOut(): void {
    if (!this.IsPilot) return
    if (this.StatController.getCurrent(StatKey.HP) > 0) return
    if (this.IsDead) return
    if (this.HasStatus('downandout')) {
      this.Kill()
      return
    }
    this.AddStatus('downandout')
  }

  public Record<K extends LogEventKind>(kind: K, payload: ILogPayloads[K]): void {
    this.CombatLog.Record(kind, payload)
    this.CombatLogVersion++
  }

  public BoostBonus = 0

  public Boost(): boolean {
    const bonus = Number(this.StatController.getMax(StatKey.SPEED)) || 0
    if (bonus <= 0) return false
    this.BoostBonus += bonus
    this.StatController.bumpCurrentStat(StatKey.SPEED, bonus, { silent: true })
    this.Record('move', { spent: 0, mode: 'boost', granted: bonus })
    this.DropHostileActionStatuses()
    return true
  }

  public get BoostedSpeed(): number {
    return (Number(this.StatController.getMax(StatKey.SPEED)) || 0) + this.BoostBonus
  }

  public ClearBoost(): void {
    if (!this.BoostBonus) return
    this.BoostBonus = 0
    const max = Number(this.StatController.getMax(StatKey.SPEED)) || 0
    if (this.StatController.getCurrent(StatKey.SPEED) > max)
      this.StatController.setCurrentStat(StatKey.SPEED, max, { silent: true })
  }

  public SpendMovement(spent: number, mode: 'move' | 'boost' | 'other' = 'move'): void {
    if (spent <= 0) return
    const from = this.StatController.getCurrent(StatKey.SPEED)
    this.StatController.setCurrentStat(StatKey.SPEED, Math.max(0, from - spent), { silent: true })
    this.Record('move', { spent: Math.min(spent, from), mode })
  }
  public get Activations(): number {
    return this.StatController.getMax(StatKey.ACTIVATIONS)
  }

  public get ActiveEffects(): ActiveEffect[] {
    const fx = this.Parent.FeatureController?.ActiveEffects || []
    if (this.IsPilot) return fx.filter(e => e.Pilot)
    return fx.filter(e => !e.Pilot)
  }

  public get Bonuses(): Bonus[] {
    return this.Parent.FeatureController?.Bonuses || []
  }

  public get Name(): string {
    if (this.Parent.Callsign) return `${this.Parent.Callsign} (${this.Parent.Name})`
    return this.Parent.Name
  }

  public EndTurn(encounter?: any): IFlowResult<IEndTurnState> {
    return EndTurnFlow.Begin({ cc: this, encounter, burnResolved: false })
  }

  public ResumeEndTurn(
    result: IFlowResult<IEndTurnState>,
    input?: unknown
  ): IFlowResult<IEndTurnState> {
    return EndTurnFlow.Resume(result, input)
  }

  public RefreshTurnReactions(encounter?: any): void {
    const combatants = encounter?.Combatants
    if (!combatants) return
    combatants.forEach((c: any) => c?.actor?.CombatController?.RefreshReactions())
  }

  public get HasRemainingActions(): boolean {
    return this.ActionPoolController.HasRemainingActions
  }

  public SortedActiveEffects(sort: string, dir: 'asc' | 'desc'): ActiveEffect[] {
    const effects = [...this.ActiveEffects]
    switch (sort) {
      case '':
        return _.orderBy(effects, ['Name'], [dir])
      case 'name':
        return _.orderBy(effects, ['Name'], [dir])
      case 'usage':
        return _.orderBy(effects, [ae => (ae.Applied ? 1 : 0)], [dir])
      default:
        return effects
    }
  }

  public get SaveTarget(): number {
    if ((this.ActiveActor as any).SaveTarget !== undefined)
      return (this.ActiveActor as any).SaveTarget
    return this.StatController.getCurrent(StatKey.SAVE_TARGET)
  }

  public get IsAIControlled(): boolean {
    return !this.IsDestroyed && this.AIControl && (this.HasAISystems || !this.Mounted)
  }

  public get HasAISystems(): boolean {
    return (this.Parent as Mech).MechLoadoutController?.ActiveLoadout.AISystems.some(
      x => !x.Destroyed
    )
  }

  public SetAIControl(value: boolean): void {
    if (this.AIControl === value) return
    const spender = this.RootActor.CombatController
    spender.SetCombatAction('protocol', false)
    spender.CombatActions.Protocol = false
    this.AIControl = value
    this.Record('ai.control', { active: value })
  }

  public ToggleMounted(): void {
    this.Mounted = !this.Mounted
    this.Record('mount', { mounted: this.Mounted })
    if (!this.Mounted && this.HasAISystems) this.SetAIControl(true)
  }

  public CanActivate(action: string, actionId?: string): boolean {
    return this.ActionPoolController.CanActivate(action, actionId)
  }

  private _isOrdnance(weapon?: any): boolean {
    return hasTag(weapon?.ActiveTags || weapon?.Tags || [], TAG.Ordnance)
  }

  public CanFireWeapon(weapon: any): boolean {
    if (!this._isOrdnance(weapon)) return true
    return this.CanActivate('ordnance')
  }

  public ResolveBurn(success: boolean, rolled?: number): void {
    const burn = this.StatController.getCurrent(StatKey.BURN)
    if (!burn) return
    if (success) {
      this.StatController.setCurrentStat(StatKey.BURN, 0)
      this.Record('save', { stat: 'eng', target: 10, rolled, result: 'success' })
      return
    }
    this.Record('save', { stat: 'eng', target: 10, rolled, result: 'failure' })
    this.DamageController.ApplyDamage(DamageType.AppliedBurn, burn)
  }

  private static readonly BRACE_RESIST = ['kinetic', 'energy', 'explosive', 'heat', 'burn']

  public ApplyBraceEffects(): void {
    this.Braced = true
    this.BraceGranted = CombatController.BRACE_RESIST.filter(
      t => !this.Resistances.some(r => r.type === t)
    )
    this.BraceGranted.forEach(t => this.AddResist(t, 'resistance'))
  }

  public Brace(force = false): boolean {
    return (
      BraceFlow.Begin(this._activationState('brace', { reaction: 'brace', force })).outcome ===
      'complete'
    )
  }

  public SetBraced(value: boolean, force = false): boolean {
    if (value === this.Braced) return false
    if (value) return this.Brace(force)
    this.Braced = false
    this.ClearBraceResistance()
    return true
  }

  public SetOverwatch(value: boolean, force = false): boolean {
    if (value === this.Overwatch) return false
    if (value) return this.TakeOverwatch(undefined, force)
    this.Overwatch = false
    return true
  }

  private _activations = new Map<string, { state: IActivationState; completed: string[] }>()

  public Activate(
    activation: string,
    opts: {
      actionId?: string
      useId?: string
      frequency?: Frequency
      heat?: number
      force?: boolean
    } = {}
  ): boolean {
    const state = this._activationState(activation, opts)
    const result = ActivationFlow.Begin(state)
    if (result.outcome !== 'complete') return false
    this._activations.set(opts.actionId ?? normalizeActivation(activation), {
      state,
      completed: result.completed,
    })
    return true
  }

  public UndoActivation(
    activation: string,
    opts: { actionId?: string; useId?: string; heat?: number; reaction?: string } = {}
  ): string[] {
    const key = opts.actionId ?? normalizeActivation(activation)
    const held = this._activations.get(key)
    const state = held?.state ?? this._activationState(normalizeActivation(activation), opts)
    const irreversible = ActivationFlow.UndoAll(state, held?.completed)
    if (held) {
      this._activations.delete(key)
      if (this.CombatLog.Rollback(groupOf(state))) this.CombatLogVersion++
    }
    return irreversible
  }

  public RemoveHeat(value: number, reason: HeatChangeReason = 'effect'): void {
    this.ClearHeat(reason, Math.max(0, this.StatController.getCurrent(StatKey.HEATCAP) - value))
  }

  public GrantsAction(id: string): boolean {
    const key = id.toLowerCase()
    return !!this.Parent.FeatureController?.Actions.some(
      a => a.ID.toLowerCase() === key || a.ID.toLowerCase() === `act_${key}`
    )
  }

  public BlockedReasonFor(
    activation: string,
    opts: { actionId?: string; useId?: string; reaction?: string } = {}
  ): BlockedReason | undefined {
    return activationBlock(this._activationState(activation, opts))
  }

  public get ReactionOptions(): string[] {
    return this.ActionPoolController.ReactionOptions
  }

  public get AvailableReactions(): string[] {
    return this.ActionPoolController.AvailableReactions
  }

  private _activationState(
    activation: string,
    opts: Partial<IActivationState> = {}
  ): IActivationState {
    return { cc: this, activation, legal: false, ...opts }
  }

  public ClearBraceResistance(): void {
    this.BraceGranted.forEach(t => this.RemoveResist(t))
    this.BraceGranted = []
  }

  public CanOverwatch(weapon?: any): boolean {
    if (!this.CanUseReaction('overwatch')) return false
    return !this._isOrdnance(weapon)
  }

  public TakeOverwatch(weapon?: any, force = false): boolean {
    return (
      OverwatchFlow.Begin(
        this._activationState('overwatch', { reaction: 'overwatch', weapon, force })
      ).outcome === 'complete'
    )
  }

  public get CanTakeTechActions(): boolean {
    return !this.IsBiological
  }

  public CanUseQuickTech(option: string): boolean {
    if (!this.CanTakeTechActions) return false
    return this.CanActivate('quicktech') && !this.IsActionUsed(`quicktech:${option.toLowerCase()}`)
  }

  public UseQuickTech(option: string): boolean {
    if (!this.CanUseQuickTech(option)) return false
    this.MarkActionUsed(`quicktech:${option.toLowerCase()}`)
    this.SetCombatAction('quicktech', false)
    return true
  }

  public CanUseReaction(id: string): boolean {
    if (this.Carrying !== 'none') return false
    return this.ActionPoolController.CanUseReaction(id)
  }

  public UseReaction(id: string): void {
    this.ActionPoolController.UseReaction(id)
    this.DropHostileActionStatuses()
  }

  public RestoreReaction(id: string): void {
    this.ActionPoolController.RestoreReaction(id)
  }

  public RefreshReactions(): void {
    this.ActionPoolController.RefreshReactions()
  }

  public ResetCombatActions(): void {
    this.ActionPoolController.ResetCombatActions()
  }

  public toggleCombatAction(action: string): void {
    this.ActionPoolController.toggleCombatAction(action)
  }

  public SetCombatAction(action: string, value: boolean): void {
    this.ActionPoolController.SetCombatAction(action, value)
  }

  public ResetActivation(action: string, propagate = true): void {
    this.ActionPoolController.ResetActivation(action, propagate)
  }

  public UseAttackAction(actionId: string, weaponInstanceId?: string): void {
    this.ActionPoolController.UseAttackAction(actionId, weaponInstanceId)
  }

  public CanTakeAction(actionId: string, activation: string, useId?: string): boolean {
    return this.ActionPoolController.CanTakeAction(actionId, activation, useId)
  }

  public CanRepeatAsOvercharge(actionId: string, activation: string): boolean {
    return this.ActionPoolController.CanRepeatAsOvercharge(actionId, activation)
  }

  public StartOvercharge(): void {
    this.ActionPoolController.StartOvercharge()
  }

  public FindAction(actionId: string): Action | undefined {
    return (
      this.Parent.FeatureController?.Actions.find(a => a.ID === actionId) ??
      CompendiumStore().Actions.find((a: Action) => a.ID === actionId)
    )
  }

  public MarkActionUsed(actionId: string, frequency?: Frequency): void {
    const action = this.FindAction(actionId)
    const freq = frequency ?? action?.Frequency
    this.ActionPoolController.MarkActionUsed(actionId, freq)
    if (freq && !freq.Unlimited && freq.Uses > 1)
      this.Record('action', {
        action: { id: actionId, name: action?.Name ?? actionId },
        activation: String(action?.Activation ?? ''),
        usesSpent: this.UsedCount(actionId),
        usesRemaining: this.RemainingUses(actionId),
      })
  }

  public IsActionUsed(actionId: string): boolean {
    return this.ActionPoolController.IsActionUsed(actionId)
  }

  public ClearActionUsed(actionId: string): void {
    this.ActionPoolController.ClearActionUsed(actionId)
  }

  public UsedCount(actionId: string): number {
    return this.ActionPoolController.UsedCount(actionId)
  }

  public RemainingUses(actionId: string): number {
    return this.ActionPoolController.RemainingUses(actionId)
  }

  public RestoreUse(actionId: string): void {
    this.ActionPoolController.RestoreUse(actionId)
  }

  public ClearUses(event: ActivePeriod): void {
    this.ActionPoolController.ClearUses(event)
  }

  public setStats(statArr: { key: string; val: number }[]): void {
    statArr.forEach(kvp => {
      this.StatController.setMax(kvp.key, kvp.val)
    })
    this.StatController.applyRegisteredCustomStats()
    this.StatController.resetCurrentStats()
  }

  public get BonusController(): BonusController {
    return this.Parent.FeatureController.BonusController
  }

  public SetResistance(type: string, condition?: string, thisActor = false): void {
    this.StatusController.SetResistance(type, condition, thisActor)
  }

  public AddResist(type: string, condition = 'vulnerable'): void {
    this.StatusController.AddResist(type, condition)
  }

  public RemoveResist(type: string): void {
    this.StatusController.RemoveResist(type)
  }

  public GetResistance(damageType: string): string {
    return this.StatusController.GetResistance(damageType)
  }

  public HasStatus(statusID: string): boolean {
    return this.StatusController.HasStatus(statusID)
  }

  public HasCondition(id: string): boolean {
    return this.StatusController.HasCondition(id)
  }

  private get _activeStatusRules(): IStatusRule[] {
    return [
      ...this.Statuses.map(s => ruleFor(s.status.ID)),
      ...this.CustomStatuses.map(s => customRuleFor(s.status.Attribute || '')),
    ].filter(Boolean) as IStatusRule[]
  }

  public DifficultyFor(kind: string): number {
    const kinds = kindsFor(kind)
    return this._activeStatusRules.reduce(
      (sum, r) => sum + kinds.reduce((k, key) => k + (r.difficulty?.[key] ?? 0), 0),
      0
    )
  }

  public AccuracyAgainst(): number {
    return this._activeStatusRules.reduce((sum, r) => sum + (r.accuracyAgainst ?? 0), 0)
  }

  public DifficultyAgainst(kind = 'ranged'): number {
    const fromStatuses = this._activeStatusRules.reduce(
      (sum, r) => sum + (r.difficultyAgainst ?? 0),
      0
    )
    const cover =
      kindsFor(kind).includes('ranged') && this.Cover !== CoverType.None
        ? this.Cover === CoverType.Hard
          ? 2
          : 1
        : 0
    return fromStatuses + cover + (this.Braced ? 1 : 0)
  }

  public Carry(mode: 'drag' | 'lift' | 'none'): void {
    const status = { drag: 'slow', lift: 'immobilized' } as const
    if (this.Carrying !== 'none') this.RemoveStatus(status[this.Carrying])
    this.Carrying = mode
    this.Record('carry', { mode })
    if (mode === 'none') return
    this.AddStatus(status[mode], undefined, { selfInflicted: true })
  }

  public static RepairCost(kind: 'hp' | 'item' | 'structure' | 'stress' | 'destroyed'): number {
    return { hp: 1, item: 1, structure: 2, stress: 2, destroyed: 4 }[kind]
  }

  public SetUnlicensed(unlicensed: boolean): void {
    if (unlicensed) {
      this.AddStatus('impaired', undefined, { selfInflicted: true })
      this.AddStatus('slow', undefined, { selfInflicted: true })
      return
    }
    this.RemoveStatus('impaired')
    this.RemoveStatus('slow')
  }

  public Bolster(): void {
    if (this.HasCustomStatus('Bolster')) return
    this.ApplyCustomStatus(
      new EffectSpecial({ attribute: 'Bolster', detail: '+2 accuracy on the next roll.' }),
      '',
      this,
      this,
      undefined as any
    )
  }

  public AccuracyFrom(source: string): number {
    if (source.toLowerCase() === 'bolster') return this.HasCustomStatus('Bolster') ? 2 : 0
    return 0
  }

  public get SelfDestructWindow(): number[] {
    return [this.Round + 1, this.Round + 2, this.Round + 3]
  }

  public EndOfTurnEffects(): { effect: TimedEffect; fromOther: boolean }[] {
    const own = this.Parent.ID
    return this.TimedEffects.filter(t => isDue(t, this.Round))
      .map(t => ({ effect: t, fromOther: !!t.Origin && t.Origin !== own }))
      .sort((a, b) => Number(b.fromOther) - Number(a.fromOther))
  }

  public get MeltdownCountdown(): number {
    return roundsRemaining(this._pendingTimed('self_destruct', 'reactor_meltdown'), this.Round)
  }

  public ClearableConditions(): { status: Status; expires: expiration; selfInflicted?: boolean }[] {
    return this.Statuses.filter(s => s.status.StatusType === 'Condition' && !s.selfInflicted)
  }

  public AutoFails(check: string): boolean {
    const key = check.toLowerCase()
    return this._activeStatusRules.some(r => r.autoFail?.includes(key as any))
  }

  public DeniesActivation(action: string, actionId?: string): boolean {
    const keys = [normalizeActivation(action), (actionId || '').toLowerCase()].filter(Boolean)
    return this._activeStatusRules.some(r => {
      if (r.permits?.some(p => keys.includes(p))) return false
      if (r.denies?.includes('*')) return true
      return !!r.denies?.some(d => keys.includes(d))
    })
  }

  public StatCap(stat: string): number | undefined {
    const key = stat.toLowerCase()
    const caps = this._activeStatusRules
      .map(r => r.caps?.[key])
      .filter((v): v is number => typeof v === 'number')
    return caps.length ? Math.min(...caps) : undefined
  }

  public get CanBeTargeted(): boolean {
    return !this._activeStatusRules.some(r => r.untargetable)
  }

  public get InvisibilityMissChance(): number {
    return Math.max(0, ...this._activeStatusRules.map(r => r.missChance ?? 0))
  }

  private _dropStatuses(flag: 'dropsOnAttack' | 'dropsOnHostileAction' | 'fromTechAction'): void {
    this.Statuses.filter(s => ruleFor(s.status.ID)?.[flag]).forEach(s =>
      this.RemoveStatus(s.status.ID)
    )
  }

  public DropAttackRevealedStatuses(): void {
    this._dropStatuses('dropsOnAttack')
  }

  public DropHostileActionStatuses(): void {
    this._dropStatuses('dropsOnHostileAction')
  }

  public get ImmuneToTech(): boolean {
    return this._activeStatusRules.some(r => r.immuneToTech)
  }

  public ShutDown(): void {
    if (this.HasStatus('shut-down')) return
    this.ClearHeat('shutdown')
    this.RemoveStatus('exposed')
    if (this.InCascade) {
      this.RemoveCustomStatus(StatusController.CASCADE_ATTRIBUTE)
      this.AIControl = false
    }
    this._dropStatuses('fromTechAction')
    this.AddStatus('shut-down')
  }

  public BootUp(): boolean {
    if (!this.HasStatus('shut-down')) return false
    this.RemoveStatus('shut-down')
    this.RemoveStatus('stunned')
    return true
  }

  public ConsumeLockOn(): number {
    if (!this.HasStatus('lockon')) return 0
    this.RemoveStatus('lockon', 'consumed')
    return 1
  }

  public Ram(target: any, outcome: { hit: boolean }): boolean {
    if (!outcome.hit) return false
    target.AddStatus('prone')
    return true
  }

  public Grapple(target: any, outcome: { hit: boolean; smaller?: any }): boolean {
    if (!outcome.hit) return false
    this.AddStatus('engaged')
    target.AddStatus('engaged')
    ;(outcome.smaller ?? target).AddStatus('immobilized')
    return true
  }

  public Invade(
    target: any,
    opts: { willing?: boolean } = {}
  ): {
    automatic: boolean
    isAttack: boolean
  } {
    if (target?.ImmuneTo('tech', 'invade')) return { automatic: false, isAttack: false }
    if (opts.willing) return { automatic: true, isAttack: false }
    return { automatic: false, isAttack: true }
  }

  public Eject(): boolean {
    if (!this.Mounted) return false
    this.Record('mount', { mounted: false, ejected: true })
    this.ToggleMounted()
    this.AddStatus('impaired')
    return true
  }

  public Dismount(): boolean {
    if (!this.Mounted) return false
    this.ToggleMounted()
    return true
  }

  public Prepare(): void {
    if (this.Prepared) return
    this.Prepared = true
    this.CombatActions.Quick1 = false
    this.CombatActions.Quick2 = false
    this.CombatActions.Full = false
    this.CombatActions.Reaction = false
    this.StatController.setCurrentStat(StatKey.SPEED, 0, { silent: true })
    this.Record('prepare', { prepared: true })
  }

  public ReleasePrepared(): void {
    if (!this.Prepared) return
    this.Prepared = false
    this.CombatActions.Reaction = true
    this.Record('prepare', { prepared: false })
  }

  public Search(target: any, outcome: { success: boolean }): boolean {
    if (!outcome.success) return false
    target.RemoveStatus('hidden')
    return true
  }

  public NeedsTarget(actionId: string): boolean {
    return !!BASE_ACTIONS[actionId]?.needsTarget
  }

  public IsContested(actionId: string): boolean {
    return !!BASE_ACTIONS[actionId]?.contested
  }

  public IsMeleeResolved(actionId: string): boolean {
    return !!BASE_ACTIONS[actionId]?.melee
  }

  public MeleeActionBonus(actionId: string): number {
    if (!this.IsNpc) return this.AttackBonus
    const key = actionId.includes('ram') ? StatKey.RAM : StatKey.GRAPPLE
    return this.StatController.getCurrent(key) || 0
  }

  public ActivationFor(actionId: string): string | undefined {
    return BASE_ACTIONS[actionId]?.activation
  }

  public PerformAction(actionId: string, opts: IPerformOpts = {}): boolean {
    return this._action(actionId, opts, true)
  }

  public RunAction(actionId: string, opts: IPerformOpts = {}): boolean {
    return this._action(actionId, opts, false)
  }

  private _action(actionId: string, opts: IPerformOpts, activate: boolean): boolean {
    const rule = BASE_ACTIONS[actionId]
    if (!rule) {
      if (activate) this.MarkActionUsed(actionId)
      return true
    }
    const ref = { id: actionId, name: this.FindAction(actionId)?.Name ?? actionId }
    if (rule.needsTarget && !opts.target) {
      this.Record('blocked', { action: ref, reason: 'no_target' })
      return false
    }
    if (rule.can && !rule.can(this, opts)) {
      this.Record('blocked', { action: ref, reason: rule.reason ?? 'unavailable' })
      if (!opts.force) return false
    }
    if (activate && !this.Activate(rule.activation, { actionId, force: opts.force })) {
      this.Record('blocked', { action: ref, reason: 'insufficient' })
      return false
    }
    return rule.run(this, opts)
  }

  public JockeyOptions(): Action[] {
    return this.SubActions(ActivationType.Jockey)
  }

  public InvadeOptions(): Action[] {
    return this.SubActions(ActivationType.Invade)
  }

  public SubActions(activation: `${ActivationType}`): Action[] {
    return [
      ...CompendiumStore().Actions.filter(a => a.Activation === activation),
      ...this.AllActions(activation),
    ].sort((a, b) => a.Name.localeCompare(b.Name))
  }

  public LockOn(target: any): boolean {
    if (!target) return false
    if (target.ImmuneTo?.('tech', 'lockon')) {
      this.Record('blocked', { action: { id: 'act_lockon', name: 'LOCK ON' }, reason: 'immune' })
      return false
    }
    target.AddStatus('lockon')
    this.DropHostileActionStatuses()
    return true
  }

  public CanConsumeLockOn(target: any): boolean {
    return !!target?.HasStatus?.('lockon')
  }

  public ConsumeLockOnAgainst(target: any): number {
    return target?.ConsumeLockOn?.() ?? 0
  }

  public Jockey(target: any, outcome: { success: boolean }): boolean {
    return outcome.success
  }

  public StandUp(): boolean {
    if (!this.HasStatus('prone')) return false
    if (this.HasStatus('immobilized')) {
      this.Record('blocked', {
        action: { id: 'act_stand_up', name: 'STAND UP' },
        reason: 'immobilized',
      })
      return false
    }
    this.RemoveStatus('prone')
    this.SpendMovement(this.StatController.getCurrent(StatKey.SPEED))
    return true
  }

  public Hide(): boolean {
    if (this.HasStatus('engaged')) {
      this.Record('blocked', { action: { id: 'act_hide', name: 'HIDE' }, reason: 'engaged' })
      return false
    }
    this.AddStatus('hidden')
    return true
  }

  public Disengage(): boolean {
    this.Disengaged = true
    if (this.HasStatus('engaged')) this.RemoveStatus('engaged')
    return true
  }

  public ClearCondition(statusID: string, target: any = this): boolean {
    if (!target.ClearableConditions().some(c => c.status.ID === statusID)) return false
    target.RemoveStatus(statusID, 'cleared')
    return true
  }

  public get Kind(): 'mech' | 'pilot' | 'npc' {
    if (this.Parent instanceof Mech) return 'mech'
    if (this.Parent instanceof Pilot) return 'pilot'
    return 'npc'
  }

  public get IsMech(): boolean {
    return this.Kind === 'mech'
  }

  public get IsPilot(): boolean {
    return this.Kind === 'pilot'
  }

  public get IsNpc(): boolean {
    return this.Kind === 'npc'
  }

  public get Counterpart(): CombatController | null {
    if (this.IsPilot) return (this.Parent as Pilot).ActiveMech?.CombatController ?? null
    if (this.IsMech) return (this.Parent as Mech).Pilot?.CombatController ?? null
    return null
  }

  public get CanCrit(): boolean {
    return !this.IsNpc
  }

  public HasTemplate(name: string): boolean {
    const templates = (this.Parent as any).NpcTemplateController?.Templates ?? []
    return templates.some((t: any) => t?.Name?.toLowerCase() === name.toLowerCase())
  }

  public get RefreshesReactionsEachTurn(): boolean {
    return this.IsNpc && this.HasTemplate('ultra')
  }

  public get IsGrunt(): boolean {
    const templates = (this.Parent as any)?.NpcTemplateController?.Templates || []
    return templates.some((t: any) =>
      String(t?.ID ?? t?.Name ?? '')
        .toLowerCase()
        .includes('grunt')
    )
  }

  public get IsBiological(): boolean {
    return !!(this.Parent as any)?.IsBiological
  }

  public UseFullTech(options: string[]): boolean {
    if (!this.CanTakeTechActions) return false
    if (this.IsNpc && options.length === 2 && options[0] === options[1]) return false
    const frequency = new Frequency(`${Math.max(1, options.length)}/turn`)
    options.forEach(o => this.MarkActionUsed(o, frequency))
    return true
  }

  public NpcInvade(target: any): void {
    target.ApplyHeat(2)
    target.AddStatus('impaired')
  }

  public BeginCascade(encounter?: any): void {
    if (this.InCascade) return
    this.AIControl = true
    this.ApplyCustomStatus(
      new EffectSpecial({
        attribute: StatusController.CASCADE_ATTRIBUTE,
        detail: StatusController.CASCADE_DETAIL,
      }),
      '',
      this,
      this,
      encounter
    )
    this.Record('ai.control', { active: true })
  }

  public AddStatus(statusID: string, expires?: any, opts: { selfInflicted?: boolean } = {}): void {
    this.StatusController.AddStatus(statusID, expires, opts)
  }

  public ToggleStatus(status: Status, expires?: any, thisController = false): void {
    this.StatusController.ToggleStatus(status, expires, thisController)
  }

  public get IsDestroyed(): boolean {
    if (this.StatController.getMax(StatKey.STRUCTURE) > 0)
      return this.StatController.getCurrent(StatKey.STRUCTURE) <= 0
    else if (this.StatController.getMax(StatKey.HP) > 0)
      return this.StatController.getCurrent(StatKey.HP) <= 0
    return false
  }

  public SetDestroyed(val: boolean): void {
    if (val === this.IsDestroyed) return
    const key = this.StatController.getMax(StatKey.STRUCTURE) > 0 ? StatKey.STRUCTURE : StatKey.HP
    const prevSuppress = this.SuppressChecks
    this.SuppressChecks = true
    try {
      this.StatController.setCurrentStat(key, val ? 0 : this.StatController.getMax(key))
    } finally {
      this.SuppressChecks = prevSuppress
    }
  }

  public CanUseEquipment(item: any): boolean {
    if (!item?.DangerZone) return true
    return this.IsInDangerZone
  }

  public ImmuneTo(kind: string, action: string, fromAlly = false): boolean {
    if (kind.toLowerCase() !== 'tech') return false
    if (this.ImmuneToTech) return true
    if (fromAlly && this.ImmuneToAlliedTech) return true
    if (!this.IsBiological && !this.IsPilot) return false
    return !['scan', 'lock_on', 'lockon'].includes(action.toLowerCase())
  }

  public get ImmuneToAlliedTech(): boolean {
    return this._activeStatusRules.some(r => r.immuneToAlliedTech)
  }

  public get IsInDangerZone(): boolean {
    if (!this.StatController.getMax(StatKey.HEATCAP)) return false
    return (
      this.StatController.getCurrent(StatKey.HEATCAP) >=
      Math.ceil(this.StatController.getMax(StatKey.HEATCAP) / 2)
    )
  }

  public SetCustomStatus(special: EffectSpecial, expires?: any): void {
    this.StatusController.SetCustomStatus(special, expires)
  }

  public get OverchargeTrack(): any[] {
    return this.ActionPoolController.OverchargeTrack
  }

  public get OverchargeLevel(): number {
    return this.ActionPoolController.OverchargeLevel
  }

  public get OverchargeCost(): string | number {
    return this.ActionPoolController.OverchargeCost
  }

  public IncreaseOverchargeLevel(): void {
    this.ActionPoolController.IncreaseOverchargeLevel()
  }

  public getCheckBonus(type: 'Hull' | 'Agi' | 'Sys' | 'Eng'): number {
    if (this.IsPilot) return (this.Parent as Pilot).ActiveMech![type]
    return this.StatController.getMax(type.toLowerCase()) || 0
  }

  public CalculateArmorReduction(
    type: DamageType,
    value: number,
    ap: boolean,
    irreducible: boolean,
    direct = false
  ): number {
    return this.DamageController.CalculateArmorReduction(type, value, ap, irreducible, direct)
  }

  public CalculateDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    direct = false
  ): { total: number; resist: string[]; condition: string[]; tookDamage: boolean } {
    return this.DamageController.CalculateDamage(type, value, ap, irreducible, direct)
  }

  public TakeDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    direct = false
  ): void {
    this.DamageController.TakeDamage(type, value, ap, irreducible, direct)
  }

  public ApplyDamage(type: DamageType, value: number): void {
    this.DamageController.ApplyDamage(type, value)
  }

  public ApplyHeat(value: number, opts: { external?: boolean } = {}): void {
    this.DamageController.ApplyHeat(value, opts)
  }

  public RemoveStatus(
    statusID: string,
    reason: 'expired' | 'removed' | 'cleared' | 'replaced' | 'consumed' = 'removed'
  ): void {
    this.StatusController.RemoveStatus(statusID, reason)
  }

  public ApplyCustomStatus(
    customStatus: EffectSpecial,
    expires: string,
    owner: CombatController,
    target: CombatController,
    encounter: EncounterInstance
  ): void {
    this.StatusController.ApplyCustomStatus(customStatus, expires, owner, target, encounter)
  }

  public HasCustomStatus(attribute: string): boolean {
    return this.StatusController.HasCustomStatus(attribute)
  }

  public get InCascade(): boolean {
    return this.StatusController.InCascade
  }

  public RemoveCustomStatus(attribute: string): void {
    this.StatusController.RemoveCustomStatus(attribute)
  }

  public SetCore(active: boolean): void {
    this.CoreActive = active
    if (active) this.CorePower = false
    this.Record('core.power', { active })
  }

  public Overcharge(heat?: number): number {
    const cost = typeof heat === 'number' ? heat : DiceRoller.roll(this.OverchargeCost as any)
    const expression = this.OverchargeCost
    this.StartOvercharge()
    this.TakeDamage(DamageType.Heat, cost)
    this.IncreaseOverchargeLevel()
    this.Record('overcharge', { level: this.OverchargeLevel, cost: expression, heat: cost })
    return cost
  }

  public RepairDestroyed(contributed: number = CombatController.RepairCost('destroyed')): boolean {
    if (!this.IsDestroyed && !this.ReactorDestroyed) return false
    if (this.ReactorDestroyed) {
      this.Record('blocked', { reason: 'reactor_destroyed' })
      return false
    }
    if (contributed < CombatController.RepairCost('destroyed')) return false

    this.SetDestroyed(false)
    this.StatController.setCurrentStat(StatKey.HP, this.StatController.getMax(StatKey.HP))
    this.StatController.setCurrentStat(StatKey.STRUCTURE, 1)
    this.StatController.setCurrentStat(StatKey.STRESS, 1)
    this.StatController.setCurrentStat(StatKey.HEATCAP, 0, { silent: true })
    this.Record('repair', {
      kind: 'destroyed',
      cost: contributed,
      restored: { structure: 1, stress: 1 },
    })
    return true
  }

  public FullRepair(): void {
    this.StatController.resetCurrentStats()
    this.StatController.setCurrentStat(StatKey.HEATCAP, 0, { silent: true })
    this.StatController.setCurrentStat(StatKey.BURN, 0)
    this.StatController.setCurrentStat(StatKey.OVERCHARGE, 0)
    this.Statuses = []
    this.CustomStatuses = []
    this.CorePower = true
    this.CoreActive = false
    this.ReactorDestroyed = false
    this.SetDestroyed(false)
    this.IsDead = false
    this.TimedEffects = []
    this.PendingChecks = []
    this.ResetCombatActions()
    this.ClearUses(ActivePeriod.Mission)
    this.Record('repair', { kind: 'full' })
  }

  public Stabilize(
    action: 'cool' | 'repair' | 'reload' | 'clear_burn' | 'clear_self' | 'clear_ally' | 'npc'
  ): void {
    switch (action) {
      case 'cool':
        this.ClearHeat('stabilize')
        this.RemoveStatus('exposed')
        break
      case 'repair':
        this.StatController.setCurrentStat(StatKey.HP, this.StatController.getMax(StatKey.HP))
        this.StatController.bumpCurrentStat(StatKey.REPAIR_CAPACITY, -1)
        break
      case 'reload':
        this.Reload()
        break
      case 'clear_burn':
        this.StatController.setCurrentStat(StatKey.BURN, 0)
        break
      case 'npc':
        this.Reload()
        this.ClearHeat('stabilize')
        this.RemoveStatus('exposed')
        break
      case 'clear_self':
      case 'clear_ally':
        break
      default:
        return
    }
    this.Record('stabilize', { choices: [action] })
  }

  public DurationContext(over: Partial<IDurationContext> = {}): IDurationContext {
    return { round: this.Round, actorId: this.Parent.ID, turn: this.Turn, ...over }
  }

  public getExpiredStatuses(
    currentRound: number,
    currentActorID: string
  ): { status: Status; expires: expiration }[] {
    return this.StatusController.getExpiredStatuses(currentRound, currentActorID, this.Turn)
  }

  private _applyInitialSelfEffects(matches: (duration?: string) => boolean): void {
    this.ActiveEffects.filter(ae => ae.InitialSelfApplied && matches(ae.Duration)).forEach(ae =>
      this._setTimedFromActiveEffect(ae)
    )
  }

  public StartEncounter(): void {
    this.ClearUses(ActivePeriod.Scene)
    this._applyInitialSelfEffects(d => !d || d === 'encounter' || d === 'End of Encounter')
  }

  private _setTimedFromActiveEffect(ae: ActiveEffect): void {
    const apply = {} as ITimedEffectAction
    if (ae.AddResist.length)
      apply.resist = ae.AddResist.map(x => ({ type: x.Resist, value: x.ResistType }))
    if (ae.AddSpecial.length)
      apply.special = ae.AddSpecial.map(x => ({ attribute: x.Attribute, detail: x.Detail }))
    if (ae.AddStatus.length) apply.status = ae.AddStatus.map(x => x.Status.ID)

    this._pushTimed({
      name: ae.Name,
      origin: ae.Origin.Name,
      detail: ae.Detail,
      round: this.Round,
      apply,
    })
  }

  private _pushTimed(data: any): void {
    this.TimedEffects.push(markRaw(new TimedEffect(data)))
  }

  private _pendingTimed(...kinds: string[]): TimedEffect | undefined {
    return this.TimedEffects.find(t => kinds.includes(t.Apply?.other as string))
  }

  public StartTurn(): void {
    this.RollRecharge(this.AllEquipment)
    this.RefreshReactions()
    this.ReleasePrepared()
    this.Disengaged = false
  }

  public StartRound(): void {
    this.StartTurn()
    this._applyInitialSelfEffects(d => d === 'turn' || d === 'End of Turn')
  }

  public EndRound(encounter?: any): void {
    EndRoundFlow.Begin({ cc: this, encounter })
  }

  public Reset(scope: ActivePeriod = ActivePeriod.Mission): void {
    this.ResetCombatActions()
    this.ClearBoost()
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getMax(StatKey.ACTIVATIONS)
    )
    this.StatController.setCurrentStat(StatKey.SPEED, this.StatController.getMax(StatKey.SPEED))
    this.ClearUses(scope)
    if (this.IsPilot) this.Counterpart?.Reset(scope)
  }

  public EndEncounter(): void {
    expiredIn(this.Statuses, this.DurationContext({ encounterEnded: true })).forEach(s => {
      this.RemoveStatus(s.status.ID, 'expired')
    })
    this.ClearUses(ActivePeriod.Scene)
    if (this.IsPilot) this.Counterpart?.ClearUses(ActivePeriod.Scene)
  }

  public ReloadOptions(): any[] {
    return this.AllEquipment.filter(eq => eq.IsLoading && eq.Used)
  }

  public Reload(weapon?: any): boolean {
    const targets = weapon ? [weapon] : this.ReloadOptions()
    if (!targets.length) return false
    targets.forEach(eq => {
      eq.Used = false
    })
    this.Record('reload', { items: targets.map(itemRef) })
    return true
  }

  public RollRecharge(features: any[]): number {
    const recharging = (features || []).filter(f => f?.Recharge > 0 && f.Used)
    if (!recharging.length) return 0
    const roll = DiceRoller.rollDie(6)
    this.RechargeRolledRound = this.Round
    recharging.forEach(f => {
      const recharged = roll >= f.Recharge
      if (recharged) f.Used = false
      this.Record('recharge', { item: itemRef(f), roll, recharged })
    })
    return roll
  }

  public StartSelfDestruct(fireOnRound?: number): void {
    this.ActionPoolController.StartSelfDestruct(fireOnRound ?? this.SelfDestructWindow[0])
  }

  public SetSelfDestructRound(round: number): boolean {
    if (!this.SelfDestructWindow.includes(round)) return false
    const pending = this._pendingTimed('self_destruct')
    if (!pending) return false
    this.TimedEffects = this.TimedEffects.filter(t => t !== pending)
    this.StartSelfDestructAt(round, pending)
    return true
  }

  private StartSelfDestructAt(round: number, previous: TimedEffect): void {
    this._pushTimed({
      name: previous.Name,
      detail: previous.Detail,
      round,
      apply: { other: 'self_destruct' },
    })
    this.Record('meltdown', { state: 'self_destruct', round })
  }

  public CommitSelfDestruct(): void {
    this.ActionPoolController.CommitSelfDestruct()
  }

  public CommitReactorMeltdown(): void {
    this.ActionPoolController.CommitReactorMeltdown()
    this.Record('meltdown', { state: 'committed' })
  }

  public ScheduleReactorMeltdown(turns: number): void {
    const pending = this._pendingTimed('reactor_meltdown')
    if (pending) {
      if (pending.Round <= this.Round + turns) return
      this.TimedEffects.splice(this.TimedEffects.indexOf(pending), 1)
    }
    this._pushTimed({
      name: 'Reactor Meltdown',
      detail: `This mech's reactor will melt down, annihilating it and killing everyone inside, dealing 4d6 explosive damage to all targets in a burst 2 area around it.`,
      round: this.Round + turns,
      apply: { other: 'reactor_meltdown' },
    })
    this.Record('meltdown', { state: 'scheduled', turns })
  }

  public RetryMeltdownCheck(success: boolean): boolean {
    const index = this.TimedEffects.findIndex(t => t.Apply?.other === 'reactor_meltdown')
    if (index === -1) return false
    this.SetCombatAction('full', false)
    if (!success) return false
    this.TimedEffects.splice(index, 1)
    this.Record('meltdown', { state: 'averted' })
    return true
  }

  public Kill(): void {
    this.ActionPoolController.Kill()
  }

  public static Serialize(controller: CombatController, target: any) {
    if (!target.stats) target.stats = {}
    if (!target.counters) target.counters = {}
    target.statuses = controller.Statuses.map(s => ({
      status: s.status.ID,
      expires: expiration.Serialize(s.expires),
      selfInflicted: s.selfInflicted,
    }))
    target.customStatuses = controller.CustomStatuses.map(s => ({
      status: EffectSpecial.Serialize(s.status),
      expires: s.expires?.Raw,
    }))
    target.resistances = controller.Resistances.map(r => ({ ...r }))
    target.cover = controller.Cover
    target.mounted = controller.Mounted
    target.overwatch = controller.Overwatch
    target.braced = controller.Braced
    target.braceGranted = [...controller.BraceGranted]
    target.prepared = controller.Prepared
    target.disengaged = controller.Disengaged
    target.boostBonus = controller.BoostBonus
    target.carrying = controller.Carrying
    target.coreActive = controller.CoreActive
    target.corePower = controller.CorePower
    target.aiControl = controller.AIControl

    target.isInSelfDestruct = controller.IsInSelfDestruct
    target.reactorDestroyed = controller.ReactorDestroyed
    target.rechargeRolledRound = controller.RechargeRolledRound
    target.reactionsUsed = [...controller.ActionPoolController.ReactionsUsed]
    target.isDead = controller.IsDead

    target.combatActions = { ...controller.CombatActions }

    target.combat_log = controller.CombatLog.Save()
    target.round = controller.Round
    target.turn = controller.Turn

    target.pending_checks = controller.PendingChecks.map(p => ({ ...p }))

    target.actionUses = { ...controller.ActionPoolController.ActionUses }
    target.usedActions = Object.keys(controller.ActionPoolController.ActionUses)

    target.timed_effects = controller.TimedEffects.map(te => TimedEffect.Serialize(te))

    StatController.Serialize(controller, target.stats)
    CounterController.Serialize(controller, target.counters)
  }

  public static Deserialize(controller: CombatController, data: CombatData) {
    assertController(controller.StatController, 'StatController')

    controller.Resistances = data?.resistances || []
    controller.Statuses = (data?.statuses || [])
      .map(s => ({
        status: CompendiumStore().Statuses.find(st => st.ID === s.status),
        expires: markRaw(expiration.Deserialize(s.expires)),
        selfInflicted: (s as any).selfInflicted ?? false,
      }))
      .filter(s => s.status != null) as {
      status: Status
      expires: expiration
      selfInflicted?: boolean
    }[]
    controller.CustomStatuses = (data?.customStatuses || []).map(s => ({
      status: EffectSpecial.Deserialize(s.status),
      expires: markRaw(expiration.Deserialize(s.expires)),
    }))

    controller.Cover = data?.cover || CoverType.None
    controller.Mounted = data?.mounted ?? true
    controller.Overwatch = data?.overwatch || false
    controller.Braced = data?.braced || false
    controller.BraceGranted = data?.braceGranted ? [...data.braceGranted] : []
    controller.Prepared = data?.prepared || false
    controller.Disengaged = data?.disengaged || false
    controller.BoostBonus = data?.boostBonus || 0
    controller.Carrying = data?.carrying || 'none'
    controller.CorePower = data?.corePower ?? true
    controller.CoreActive = data?.coreActive || false
    controller.AIControl = data?.aiControl || false

    controller.IsInSelfDestruct = data?.isInSelfDestruct || false
    controller.ReactorDestroyed = data?.reactorDestroyed || false
    controller.RechargeRolledRound = data?.rechargeRolledRound ?? -1
    controller.ActionPoolController.ReactionsUsed = data?.reactionsUsed
      ? [...data.reactionsUsed]
      : []
    controller.IsDead = data?.isDead || false

    if (data?.combatActions) controller.CombatActions = data.combatActions

    controller.ActionPoolController.ActionUses =
      data?.actionUses ??
      Object.fromEntries(
        (data?.usedActions || []).map(id => [
          id,
          { used: 1, max: 1, period: ActivePeriod.Round } as IActionUseRecord,
        ])
      )

    controller.CombatLog.Load(data?.combat_log)

    controller.Round = data?.round || 1
    controller.Turn = data?.turn || 1

    controller.PendingChecks = data?.pending_checks || []

    controller.TimedEffects = (data?.timed_effects || []).map(te => TimedEffect.Deserialize(te))

    StatController.Deserialize(controller, data?.stats || {})
    CounterController.Deserialize(controller, data?.counters || {})
  }

  public get MeltdownAction() {
    return new Action({
      id: 'self_destruct_internal',
      name: 'Deal Meltdown Damage',
      activation: ActivationType.None,
      detail:
        'The reactor explosion deals 4d6 explosive damage to all targets in a burst 2 area around this mech.',
      damage: [
        {
          type: DamageType.Explosive,
          val: '4d6',
          aoe: 'Burst 2',
          save: 'agility',
          save_half: true,
        },
      ],
    })
  }
}

CombatController satisfies IControllerStatic<CombatController, CombatData>
export { CombatController, BASE_ACTIONS }
export type { CombatData, CoverType, IPerformOpts, IBaseActionRule }
