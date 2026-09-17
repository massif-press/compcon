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
import { ITimedEffectData, TimedEffect } from '../feature/active_effects/TimedEffect'
import * as _ from 'lodash-es'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import {
  EffectSpecial,
  IEffectSpecialData,
} from '../feature/active_effects/effect_subtype/EffectSpecial'
import { Action } from '@/classes/Action'
import { ActivePeriod, Frequency } from '@/classes/Frequency'
import { BonusController } from '../feature/bonus/BonusController'
import { expiration } from './Expiration'
import { CombatLogRecorder } from './log/CombatLogRecorder'
import type { IRecorderData } from './log/CombatLogRecorder'
import type { BlockedReason, HeatChangeReason, ILogPayloads, LogEventKind } from './log/events'
import type { IStatWriteOpts } from './stats/StatController'
import { groupOf } from './flows/logHooks'
import { Bonus } from '../feature/bonus/Bonus'
import { assertController } from '../../utility/assertController'
import { StatusController } from './StatusController'
import { TimedEffectController } from './TimedEffectController'
import { PendingCheckController } from './PendingCheckController'
import {
  activeActor,
  allActions,
  allEquipment,
  combatName,
  counterpart,
  findAction,
  hasTemplate,
  isBiological,
  isGrunt,
  limitedBonus,
  rootActor,
  subActions,
  tier,
} from './ActorIdentity'
import {
  ActionPoolController,
  normalizeActivation,
  type IActionUseRecord,
} from './ActionPoolController'
import { DamageController } from './DamageController'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { kindsFor } from './StatusRules'
import { ActivationFlow, BraceFlow, OverwatchFlow, activationBlock } from './flows/ActivationFlow'
import { EndTurnFlow, EndRoundFlow } from './flows/LifecycleFlow'
import type { IEndTurnState } from './flows/LifecycleFlow'
import type { IFlowResult } from './flows/Flow'
import type { IActivationState } from './flows/ActivationFlow'
import type { CheckKind, IPendingCheck } from './StructureCheck'
import { TAG, hasTag } from '@/classes/TagRules'
import { expiredIn } from './Duration'
import type { IDurationContext } from './Duration'
import {
  BASE_ACTIONS,
  boost,
  shutDown,
  bootUp,
  ram,
  grapple,
  invade,
  npcInvade,
  eject,
  dismount,
  prepare,
  releasePrepared,
  search,
  lockOn,
  jockey,
  standUp,
  hide,
  disengage,
  clearCondition,
  carry,
  setUnlicensed,
  bolster,
  useFullTech,
  reloadOptions,
  reload,
  rollRecharge,
  stabilize,
} from './actions/BaseActions'
import type { IPerformOpts } from './actions/BaseActions'
import { ACTION_FLOWS, baseActionState } from './flows/BaseActionFlow'

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

class CombatController implements ICounterContainer, IStatContainer {
  public readonly Parent: ICombatant

  public StatusController: StatusController
  public TimedEffectController: TimedEffectController
  public PendingCheckController: PendingCheckController
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
  private _cover: CoverType = CoverType.None

  public get Cover(): CoverType {
    return this._cover
  }

  public set Cover(value: CoverType) {
    const next = value || CoverType.None
    if (next === this._cover) return
    this._cover = next
    this.Record('cover', { cover: String(next) })
  }
  public CorePower = true

  private _mounted = true

  public get Mounted(): boolean {
    const mech = (this.Parent as any).ActiveMech
    return mech ? mech.CombatController._mounted : this._mounted
  }

  public set Mounted(value: boolean) {
    const mech = (this.Parent as any).ActiveMech
    if (mech) mech.CombatController._mounted = value
    else this._mounted = value
  }

  public Overwatch = false
  public Braced = false
  public BraceGranted: string[] = []
  public Prepared = false
  public Disengaged = false
  public Carrying: 'drag' | 'lift' | 'none' = 'none'
  private _coreActive = false

  public get CoreActive(): boolean {
    return this._coreActive
  }

  public set CoreActive(value: boolean) {
    if (value === this._coreActive) return
    this._coreActive = value
    this.Record('core.power', { active: value })
  }

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
    this.TimedEffectController = new TimedEffectController(this)
    this.PendingCheckController = new PendingCheckController(this)
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
    return allActions(this, activation)
  }

  public get AllEquipment(): any[] {
    return allEquipment(this)
  }

  public get RootActor(): any {
    return rootActor(this)
  }

  public get ActiveActor(): any {
    return activeActor(this)
  }

  public get CombatName(): string {
    return combatName(this)
  }

  public get Tier(): number {
    return tier(this)
  }

  public get LimitedBonus(): number {
    return limitedBonus(this)
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

  public get PendingChecks(): IPendingCheck[] {
    return this.PendingCheckController.PendingChecks
  }

  public set PendingChecks(val: IPendingCheck[]) {
    this.PendingCheckController.PendingChecks = val
  }

  public get SuppressChecks(): boolean {
    return this.PendingCheckController.SuppressChecks
  }

  public set SuppressChecks(val: boolean) {
    this.PendingCheckController.SuppressChecks = val
  }

  public AddPendingCheck(kind: CheckKind): void {
    this.PendingCheckController.Add(kind)
  }

  public RemovePendingCheck(id: string): void {
    this.PendingCheckController.Remove(id)
  }

  public get RollsStressChart(): boolean {
    return this.PendingCheckController.RollsStressChart
  }

  public ClearHeat(reason: HeatChangeReason, to = 0): void {
    this.StatController.setCurrentStat(StatKey.HEATCAP, to, { heatReason: reason })
  }

  public onStatDecrease(key: string, prev = 0, next = 0, opts: IStatWriteOpts = {}): void {
    this.PendingCheckController.onStatDecrease(key, prev, next, opts)
  }

  public Record<K extends LogEventKind>(kind: K, payload: ILogPayloads[K]): void {
    this.CombatLog.Record(kind, payload)
    this.CombatLogVersion++
  }

  public BoostBonus = 0

  public Boost(): boolean {
    return boost(this)
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
      recorded?: boolean
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
    const state: IActivationState = { cc: this, activation, legal: false, ...opts }
    state.logActivation ??= state.actionId ? this.FindAction(state.actionId)?.Activation : undefined
    return state
  }

  public get TimedEffects(): TimedEffect[] {
    return this.TimedEffectController.TimedEffects
  }

  public set TimedEffects(val: TimedEffect[]) {
    this.TimedEffectController.TimedEffects = val
  }

  public get SelfDestructWindow(): number[] {
    return this.TimedEffectController.SelfDestructWindow
  }

  public get MeltdownCountdown(): number {
    return this.TimedEffectController.MeltdownCountdown
  }

  public get MeltdownAction(): Action {
    return this.TimedEffectController.MeltdownAction
  }

  public EndOfTurnEffects(): { effect: TimedEffect; fromOther: boolean }[] {
    return this.TimedEffectController.EndOfTurnEffects()
  }

  public SetSelfDestructRound(round: number): boolean {
    return this.TimedEffectController.SetSelfDestructRound(round)
  }

  public ScheduleReactorMeltdown(turns: number): void {
    this.TimedEffectController.ScheduleReactorMeltdown(turns)
  }

  public RetryMeltdownCheck(success: boolean): boolean {
    return this.TimedEffectController.RetryMeltdownCheck(success)
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

  public ResetActivation(action: string): void {
    this.ActionPoolController.ResetActivation(action)
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
    return findAction(this, actionId)
  }

  public MarkActionUsed(actionId: string, frequency?: Frequency): void {
    const action = this.FindAction(actionId)
    const freq = frequency ?? action?.Frequency
    this.ActionPoolController.MarkActionUsed(actionId, freq)
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

  public DifficultyFor(kind: string): number {
    return this.StatusController.DifficultyFor(kind)
  }

  public AccuracyAgainst(): number {
    return this.StatusController.AccuracyAgainst()
  }

  public DifficultyAgainst(kind = 'ranged'): number {
    const fromStatuses = this.StatusController.DifficultyAgainst()
    const cover =
      kindsFor(kind).includes('ranged') && this.Cover !== CoverType.None
        ? this.Cover === CoverType.Hard
          ? 2
          : 1
        : 0
    return fromStatuses + cover + (this.Braced ? 1 : 0)
  }

  public Carry(mode: 'drag' | 'lift' | 'none'): void {
    carry(this, mode)
  }

  public static RepairCost(kind: 'hp' | 'item' | 'structure' | 'stress' | 'destroyed'): number {
    return { hp: 1, item: 1, structure: 2, stress: 2, destroyed: 4 }[kind]
  }

  public SetUnlicensed(unlicensed: boolean): void {
    setUnlicensed(this, unlicensed)
  }

  public Bolster(): void {
    bolster(this)
  }

  public AccuracyFrom(source: string): number {
    if (source.toLowerCase() === 'bolster') return this.HasCustomStatus('Bolster') ? 2 : 0
    return 0
  }

  public ClearableConditions(): { status: Status; expires: expiration; selfInflicted?: boolean }[] {
    return this.StatusController.ClearableConditions()
  }

  public AutoFails(check: string): boolean {
    return this.StatusController.AutoFails(check)
  }

  public DeniesActivation(action: string, actionId?: string): boolean {
    return this.StatusController.DeniesActivation(action, actionId)
  }

  public StatCap(stat: string): number | undefined {
    return this.StatusController.StatCap(stat)
  }

  public get CanBeTargeted(): boolean {
    return this.StatusController.CanBeTargeted
  }

  public get InvisibilityMissChance(): number {
    return this.StatusController.InvisibilityMissChance
  }

  public DropAttackRevealedStatuses(): void {
    this.StatusController.DropStatuses('dropsOnAttack')
  }

  public DropHostileActionStatuses(): void {
    this.StatusController.DropStatuses('dropsOnHostileAction')
  }

  public DropTechActionStatuses(): void {
    this.StatusController.DropStatuses('fromTechAction')
  }

  public get ImmuneToTech(): boolean {
    return this.StatusController.ImmuneToTech
  }

  public ShutDown(): void {
    shutDown(this)
  }

  public BootUp(): boolean {
    return bootUp(this)
  }

  public ConsumeLockOn(): number {
    if (!this.HasStatus('lockon')) return 0
    this.RemoveStatus('lockon', 'consumed')
    return 1
  }

  public Ram(target: any, outcome: { hit: boolean }): boolean {
    return ram(this, target, outcome)
  }

  public Grapple(target: any, outcome: { hit: boolean; smaller?: any }): boolean {
    return grapple(this, target, outcome)
  }

  public Invade(
    target: any,
    opts: { willing?: boolean } = {}
  ): { automatic: boolean; isAttack: boolean } {
    return invade(this, target, opts)
  }

  public Eject(): boolean {
    return eject(this)
  }

  public Dismount(): boolean {
    return dismount(this)
  }

  public Prepare(): void {
    prepare(this)
  }

  public ReleasePrepared(): void {
    releasePrepared(this)
  }

  public Search(target: any, outcome: { success: boolean }): boolean {
    return search(this, target, outcome)
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
    const flow = ACTION_FLOWS[actionId]
    if (!flow) {
      if (activate) this.MarkActionUsed(actionId)
      return true
    }
    const result = flow.Begin(baseActionState(this, actionId, opts, activate))
    return result.outcome === 'complete' && result.state.ok
  }

  public JockeyOptions(): Action[] {
    return this.SubActions(ActivationType.Jockey)
  }

  public InvadeOptions(): Action[] {
    return this.SubActions(ActivationType.Invade)
  }

  public SubActions(activation: `${ActivationType}`): Action[] {
    return subActions(this, activation)
  }

  public LockOn(target: any): boolean {
    return lockOn(this, target)
  }

  public CanConsumeLockOn(target: any): boolean {
    return !!target?.HasStatus?.('lockon')
  }

  public ConsumeLockOnAgainst(target: any): number {
    return target?.ConsumeLockOn?.() ?? 0
  }

  public Jockey(target: any, outcome: { success: boolean }): boolean {
    return jockey(this, target, outcome)
  }

  public StandUp(): boolean {
    return standUp(this)
  }

  public Hide(): boolean {
    return hide(this)
  }

  public Disengage(): boolean {
    return disengage(this)
  }

  public ClearCondition(statusID: string, target: any = this): boolean {
    return clearCondition(this, statusID, target)
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
    return counterpart(this)
  }

  public get CanCrit(): boolean {
    return !this.IsNpc
  }

  public HasTemplate(name: string): boolean {
    return hasTemplate(this, name)
  }

  public get RefreshesReactionsEachTurn(): boolean {
    return this.IsNpc && this.HasTemplate('ultra')
  }

  public get IsGrunt(): boolean {
    return isGrunt(this)
  }

  public get IsBiological(): boolean {
    return isBiological(this)
  }

  public UseFullTech(options: string[]): boolean {
    return useFullTech(this, options)
  }

  public NpcInvade(target: any): void {
    npcInvade(this, target)
  }

  public BeginCascade(encounter?: any): void {
    if (this.InCascade) return
    this.AIControl = true
    this.ApplyCustomStatus(
      new EffectSpecial({
        attribute: StatusController.CASCADE_ATTRIBUTE,
        detail: '',
        detailKey: StatusController.CASCADE_DETAIL_KEY,
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
    return this.StatusController.ImmuneTo(kind, action, fromAlly)
  }

  public get ImmuneToAlliedTech(): boolean {
    return this.StatusController.ImmuneToAlliedTech
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
    if (active) this.CorePower = false
    this.CoreActive = active
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
    this._coreActive = false
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
    stabilize(this, action)
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

  public StartEncounter(): void {
    this.ClearUses(ActivePeriod.Scene)
    this.TimedEffectController.ApplyInitialSelfEffects(
      d => !d || d === 'encounter' || d === 'End of Encounter'
    )
  }

  public StartTurn(): void {
    this.RollRecharge(this.AllEquipment)
    this.RefreshReactions()
    this.ReleasePrepared()
    this.Disengaged = false
  }

  public StartRound(): void {
    this.StartTurn()
    this.TimedEffectController.ApplyInitialSelfEffects(d => d === 'turn' || d === 'End of Turn')
  }

  public EndRound(encounter?: any, silent = false): void {
    EndRoundFlow.Begin({ cc: this, encounter, silent })
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

  public ResetForEncounter(): void {
    this.StatusController.ResetForEncounter()
    this.ActionPoolController.ResetForEncounter()
    this.PendingCheckController.ResetForEncounter()
    this.TimedEffectController.ResetForEncounter()
    this.CounterController.ResetForEncounter()

    this._cover = CoverType.None
    this.CorePower = true
    this._coreActive = false
    this.Mounted = true
    this.Overwatch = false
    this.Braced = false
    this.BraceGranted = []
    this.Prepared = false
    this.Disengaged = false
    this.Carrying = 'none'
    this.BoostBonus = 0
    this.AIControl = false
    this.RechargeRolledRound = -1

    this.CombatLog.Clear()
    this.Round = 1
    this.Turn = 1
    this.CombatLogVersion++

    this.StatController.resetCurrentStats()

    if (this.IsPilot) this.Counterpart?.ResetForEncounter()
  }

  public EndEncounter(): void {
    expiredIn(this.Statuses, this.DurationContext({ encounterEnded: true })).forEach(s => {
      this.RemoveStatus(s.status.ID, 'expired')
    })
    this.ClearUses(ActivePeriod.Scene)
    if (this.IsPilot) this.Counterpart?.ClearUses(ActivePeriod.Scene)
  }

  public ReloadOptions(): any[] {
    return reloadOptions(this)
  }

  public Reload(weapon?: any): boolean {
    return reload(this, weapon)
  }

  public RollRecharge(features: any[]): number {
    return rollRecharge(this, features)
  }

  public StartSelfDestruct(fireOnRound?: number): void {
    this.ActionPoolController.StartSelfDestruct(fireOnRound ?? this.SelfDestructWindow[0])
  }

  public CommitSelfDestruct(): void {
    this.ActionPoolController.CommitSelfDestruct()
  }

  public CommitReactorMeltdown(): void {
    this.ActionPoolController.CommitReactorMeltdown()
    this.Record('meltdown', { state: 'committed' })
  }

  public Kill(): void {
    this.ActionPoolController.Kill()
  }

  public static Serialize(controller: CombatController, target: any) {
    if (!target.stats) target.stats = {}
    if (!target.counters) target.counters = {}

    controller.StatusController.Serialize(target)
    controller.ActionPoolController.Serialize(target)

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
    target.rechargeRolledRound = controller.RechargeRolledRound

    target.combat_log = controller.CombatLog.Save()
    target.round = controller.Round
    target.turn = controller.Turn

    controller.PendingCheckController.Serialize(target)
    controller.TimedEffectController.Serialize(target)

    StatController.Serialize(controller, target.stats)
    CounterController.Serialize(controller, target.counters)
  }

  public static Deserialize(controller: CombatController, data: CombatData) {
    assertController(controller.StatController, 'StatController')

    controller.StatusController.Deserialize(data)
    controller.ActionPoolController.Deserialize(data)

    controller._cover = data?.cover || CoverType.None
    controller.Mounted = data?.mounted ?? true
    controller.Overwatch = data?.overwatch || false
    controller.Braced = data?.braced || false
    controller.BraceGranted = data?.braceGranted ? [...data.braceGranted] : []
    controller.Prepared = data?.prepared || false
    controller.Disengaged = data?.disengaged || false
    controller.BoostBonus = data?.boostBonus || 0
    controller.Carrying = data?.carrying || 'none'
    controller.CorePower = data?.corePower ?? true
    controller._coreActive = data?.coreActive || false
    controller.AIControl = data?.aiControl || false
    controller.RechargeRolledRound = data?.rechargeRolledRound ?? -1

    controller.CombatLog.Load(data?.combat_log)

    controller.Round = data?.round || 1
    controller.Turn = data?.turn || 1

    controller.PendingCheckController.Deserialize(data)
    controller.TimedEffectController.Deserialize(data)

    StatController.Deserialize(controller, data?.stats || {})
    CounterController.Deserialize(controller, data?.counters || {})
  }
}

CombatController satisfies IControllerStatic<CombatController, CombatData>
export { CombatController, CoverType }
export type { CombatData }
