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
import { CombatLogEntry, CombatLog } from './CombatLog'
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
import { ActivationFlow, BraceFlow, OverwatchFlow } from './flows/ActivationFlow'
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

  combat_history: CombatLogEntry[]
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
}

interface IBaseActionRule {
  activation: string
  needsTarget?: boolean
  contested?: boolean
  can?: (cc: CombatController, opts: IPerformOpts) => boolean
  run: (cc: CombatController, opts: IPerformOpts) => boolean
}

const BASE_ACTIONS: Record<string, IBaseActionRule> = {
  act_shut_down: {
    activation: 'quick',
    can: cc => !cc.HasStatus('shut-down'),
    run: cc => {
      cc.ShutDown()
      return true
    },
  },
  act_boot_up: {
    activation: 'full',
    can: cc => cc.HasStatus('shut-down'),
    run: cc => cc.BootUp(),
  },
  act_hide: {
    activation: 'quick',
    can: cc => !cc.HasStatus('engaged'),
    run: cc => cc.Hide(),
  },
  act_disengage: { activation: 'full', run: cc => cc.Disengage() },
  act_eject: { activation: 'quick', can: cc => cc.Mounted, run: cc => cc.Eject() },
  act_dismount: { activation: 'full', can: cc => cc.Mounted, run: cc => cc.Dismount() },
  act_mount: {
    activation: 'full',
    can: cc => !cc.Mounted,
    run: cc => {
      cc.ToggleMounted()
      return true
    },
  },
  act_prepare: {
    activation: 'quick',
    can: cc => !cc.Prepared,
    run: cc => {
      cc.Prepare()
      return true
    },
  },
  act_stand_up: {
    activation: 'free',
    can: cc => cc.HasStatus('prone') && !cc.HasStatus('immobilized'),
    run: cc => cc.StandUp(),
  },
  act_self_destruct: {
    activation: 'quick',
    can: cc => !cc.IsInSelfDestruct,
    run: cc => {
      cc.StartSelfDestruct()
      return true
    },
  },
  act_grapple: {
    activation: 'quick',
    needsTarget: true,
    contested: true,
    run: (cc, o) => cc.Grapple(o.target, { hit: o.success !== false, smaller: o.smaller }),
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
    can: cc => cc.ReloadOptions().length > 0,
    run: (cc, o) => cc.Reload(o.target),
  },
  act_overcharge: {
    activation: 'free',
    can: cc => cc.CanActivate('overcharge'),
    run: (cc, o) => {
      cc.Overcharge(typeof o.value === 'number' ? o.value : undefined)
      return true
    },
  },
}

BASE_ACTIONS.act_lock_on = BASE_ACTIONS.act_lockon

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

  public CombatLog: CombatLog
  public CombatLogVersion: number = 0
  public Round: number = 1
  public Turn: number = 1

  // prevent applied events after successful saves. Must be disabled after effect iteration.
  public SaveLock: boolean = false

  public get _combatActions(): any {
    return this.ActionPoolController._combatActions
  }

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
    this.CombatLog = markRaw(new CombatLog(this.RootActor))
  }

  // passthroughs ------------------------------------
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

  public get AllSynergies(): any[] {
    return this.Parent.FeatureController.Synergies
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

  // use whenever access is needed to guarantee correct mounted pilot selection
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

  // for pc table prompt watchers
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

  public onStatDecrease(key: string): void {
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
    this.log('Down and out')
  }

  public log(str: string): void {
    this.CombatLog.LogSimpleEvent(str)
    this.CombatLogVersion++
  }
  // ------------------------------------------------------
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
    return this.StatController.getCurrent(StatKey.SAVE_TARGET) //|| 10
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
    this.log(value ? 'AI assumed control' : 'Pilot reclaimed control')
  }

  public ToggleMounted(): void {
    this.Mounted = !this.Mounted
    this.log(`${this.Mounted ? 'Mounted' : 'Dismounted'} Mech`)
    if (!this.Mounted && this.HasAISystems) this.SetAIControl(true)
  }

  public CanActivate(action: string, actionId?: string): boolean {
    return this.ActionPoolController.CanActivate(action, actionId)
  }

  public CanFireWeapon(weapon: any): boolean {
    const tags = weapon?.ActiveTags || weapon?.Tags || []
    const isOrdnance = hasTag(tags, TAG.Ordnance)
    if (!isOrdnance) return true
    return this.CanActivate('ordnance')
  }

  public ResolveBurn(success: boolean): void {
    const burn = this.StatController.getCurrent(StatKey.BURN)
    if (!burn) return
    if (success) {
      this.StatController.setCurrentStat(StatKey.BURN, 0)
      this.log('Engineering check passed: Burn cleared')
      return
    }
    this.DamageController.ApplyDamage(DamageType.AppliedBurn, burn)
    this.log(`Engineering check failed: took ${burn} burn damage`)
  }

  private static readonly BRACE_RESIST = ['kinetic', 'energy', 'explosive', 'heat', 'burn']

  public ApplyBraceEffects(): void {
    this.Braced = true
    this.BraceGranted = CombatController.BRACE_RESIST.filter(
      t => !this.Resistances.some(r => r.type === t)
    )
    this.BraceGranted.forEach(t => this.AddResist(t, 'resistance'))
    this.log('Braced')
  }

  public Brace(): boolean {
    return (
      BraceFlow.Begin(this._activationState('brace', { reaction: 'brace' })).outcome === 'complete'
    )
  }

  public SetBraced(value: boolean): boolean {
    if (value === this.Braced) return false
    if (value) return this.Brace()
    this.Braced = false
    this.ClearBraceResistance()
    this.log('Brace released')
    return true
  }

  public SetOverwatch(value: boolean): boolean {
    if (value === this.Overwatch) return false
    if (value) return this.TakeOverwatch()
    this.Overwatch = false
    this.log('Overwatch released')
    return true
  }

  public Activate(
    activation: string,
    opts: { actionId?: string; useId?: string; frequency?: Frequency; heat?: number } = {}
  ): boolean {
    return ActivationFlow.Begin(this._activationState(activation, opts)).outcome === 'complete'
  }

  public UndoActivation(
    activation: string,
    opts: { actionId?: string; useId?: string; heat?: number; reaction?: string } = {}
  ): string[] {
    return ActivationFlow.UndoAll(this._activationState(normalizeActivation(activation), opts))
  }

  public RemoveHeat(value: number): void {
    this.StatController.setCurrentStat(
      StatKey.HEATCAP,
      Math.max(0, this.StatController.getCurrent(StatKey.HEATCAP) - value)
    )
  }

  public GrantsAction(id: string): boolean {
    const key = id.toLowerCase()
    return !!this.Parent.FeatureController?.Actions.some(
      a => a.ID.toLowerCase() === key || a.ID.toLowerCase() === `act_${key}`
    )
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
    const tags = weapon?.ActiveTags || weapon?.Tags || []
    return !hasTag(tags, TAG.Ordnance)
  }

  public TakeOverwatch(weapon?: any): boolean {
    return (
      OverwatchFlow.Begin(this._activationState('overwatch', { reaction: 'overwatch', weapon }))
        .outcome === 'complete'
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

  public ActionFrequency(actionId: string): Frequency | undefined {
    return this.FindAction(actionId)?.Frequency
  }

  public MarkActionUsed(actionId: string, frequency?: Frequency): void {
    const action = this.FindAction(actionId)
    const freq = frequency ?? action?.Frequency
    this.ActionPoolController.MarkActionUsed(actionId, freq)
    if (freq && !freq.Unlimited && freq.Uses > 1)
      this.log(
        `${action?.Name || actionId} used (${this.RemainingUses(actionId)} of ${freq.Uses} remaining per ${freq.Duration})`
      )
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
    if (mode === 'none') {
      this.log('No longer carrying')
      return
    }
    this.AddStatus(status[mode], undefined, { selfInflicted: true })
    this.log(mode === 'drag' ? 'Dragging: slowed' : 'Lifting: immobilized')
  }

  public static RepairCost(kind: 'hp' | 'item' | 'structure' | 'stress' | 'destroyed'): number {
    return { hp: 1, item: 1, structure: 2, stress: 2, destroyed: 4 }[kind]
  }

  public SetUnlicensed(unlicensed: boolean): void {
    if (unlicensed) {
      this.AddStatus('impaired', undefined, { selfInflicted: true })
      this.AddStatus('slow', undefined, { selfInflicted: true })
      this.log('Piloted without its license: impaired and slowed')
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
    this.log('Bolstered')
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
    const pending = this.TimedEffects.find(
      t => t.Apply?.other === 'self_destruct' || t.Apply?.other === 'reactor_meltdown'
    )
    return roundsRemaining(pending, this.Round)
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

  public DropAttackRevealedStatuses(): void {
    this.Statuses.filter(s => ruleFor(s.status.ID)?.dropsOnAttack).forEach(s =>
      this.RemoveStatus(s.status.ID)
    )
  }

  public DropHostileActionStatuses(): void {
    this.Statuses.filter(s => ruleFor(s.status.ID)?.dropsOnHostileAction).forEach(s =>
      this.RemoveStatus(s.status.ID)
    )
  }

  public get ImmuneToTech(): boolean {
    return this._activeStatusRules.some(r => r.immuneToTech)
  }

  public ShutDown(): void {
    if (this.HasStatus('shut-down')) return
    this.StatController.setCurrentStat(StatKey.HEATCAP, 0)
    this.RemoveStatus('exposed')
    if (this.InCascade) {
      this.RemoveCustomStatus(StatusController.CASCADE_ATTRIBUTE)
      this.AIControl = false
    }
    this.Statuses.filter(s => ruleFor(s.status.ID)?.fromTechAction).forEach(s =>
      this.RemoveStatus(s.status.ID)
    )
    this.AddStatus('shut-down')
    this.log('Shut down')
  }

  public BootUp(): boolean {
    if (!this.HasStatus('shut-down')) return false
    this.RemoveStatus('shut-down')
    this.RemoveStatus('stunned')
    this.log('Booted up')
    return true
  }

  public ConsumeLockOn(): number {
    if (!this.HasStatus('lockon')) return 0
    this.RemoveStatus('lockon')
    this.log('Lock On consumed')
    return 1
  }

  public Grapple(target: any, outcome: { hit: boolean; smaller?: any }): boolean {
    if (!outcome.hit) return false
    this.AddStatus('engaged')
    target.AddStatus('engaged')
    ;(outcome.smaller ?? target).AddStatus('immobilized')
    this.log('Grapple: both characters engaged')
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
    if (opts.willing) {
      this.log('Invaded a willing ally: automatic success, no heat')
      return { automatic: true, isAttack: false }
    }
    return { automatic: false, isAttack: true }
  }

  public Eject(): boolean {
    if (!this.Mounted) return false
    this.ToggleMounted()
    this.AddStatus('impaired')
    this.log('Ejected; mech is impaired until a full repair')
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
    this.StatController.setCurrentStat(StatKey.SPEED, 0)
    this.log('Prepared an action')
  }

  public ReleasePrepared(): void {
    if (!this.Prepared) return
    this.Prepared = false
    this.CombatActions.Reaction = true
    this.log('Released the prepared action')
  }

  public Search(target: any, outcome: { success: boolean }): boolean {
    if (!outcome.success) return false
    target.RemoveStatus('hidden')
    this.log('Search: target is no longer hidden')
    return true
  }

  public NeedsTarget(actionId: string): boolean {
    return !!BASE_ACTIONS[actionId]?.needsTarget
  }

  public IsContested(actionId: string): boolean {
    return !!BASE_ACTIONS[actionId]?.contested
  }

  /**
   * The one entry point a view uses to take a base action whose effect the content data
   * does not express. The view supplies the target and the contested result; the mapping
   * from action id to rule lives in BASE_ACTIONS, not in a component.
   *
   * `can` is a precondition: failing it costs nothing. `run` returning false means the
   * action was taken and produced no effect, which still spends the activation.
   *
   * An id with no rule has already been spent by whatever view rendered it, so the use is
   * recorded and nothing else happens.
   */
  public PerformAction(actionId: string, opts: IPerformOpts = {}): boolean {
    const rule = BASE_ACTIONS[actionId]
    if (!rule) {
      this.MarkActionUsed(actionId)
      return true
    }
    if (rule.needsTarget && !opts.target) return false
    if (rule.can && !rule.can(this, opts)) return false
    if (!this.Activate(rule.activation, { actionId })) return false
    return rule.run(this, opts)
  }

  public JockeyOptions(): Action[] {
    return this.SubActions(ActivationType.Jockey)
  }

  public InvadeOptions(): Action[] {
    return this.SubActions(ActivationType.Invade)
  }

  /**
   * The sub-actions of a parent action: those the compendium ships plus any the actor's
   * own equipment grants. The bare parent stays available for at-table play and for
   * third-party content that ships no sub-actions of its own.
   */
  public SubActions(activation: `${ActivationType}`): Action[] {
    return [
      ...CompendiumStore().Actions.filter(a => a.Activation === activation),
      ...this.AllActions(activation),
    ].sort((a, b) => a.Name.localeCompare(b.Name))
  }

  public LockOn(target: any): boolean {
    if (!target) return false
    if (target.ImmuneTo?.('tech', 'lockon')) {
      this.log('Lock On: target is immune to tech actions')
      return false
    }
    target.AddStatus('lockon')
    this.DropHostileActionStatuses()
    this.log('Lock On applied')
    return true
  }

  public CanConsumeLockOn(target: any): boolean {
    return !!target?.HasStatus?.('lockon')
  }

  public ConsumeLockOnAgainst(target: any): number {
    return target?.ConsumeLockOn?.() ?? 0
  }

  public Jockey(target: any, outcome: { success: boolean }): boolean {
    if (!outcome.success) return false
    this.log('Jockey: climbed onto the mech')
    return true
  }

  public StandUp(): boolean {
    if (!this.HasStatus('prone')) return false
    if (this.HasStatus('immobilized')) {
      this.log('Cannot stand up while immobilized')
      return false
    }
    this.RemoveStatus('prone')
    this.StatController.setCurrentStat(StatKey.SPEED, 0)
    this.log('Stood up, spending the standard move')
    return true
  }

  public Hide(): boolean {
    if (this.HasStatus('engaged')) {
      this.log('Cannot hide while engaged')
      return false
    }
    this.AddStatus('hidden')
    this.log('Hidden')
    return true
  }

  public Disengage(): boolean {
    this.Disengaged = true
    if (this.HasStatus('engaged')) this.RemoveStatus('engaged')
    this.log('Disengaged: movement ignores engagement and reactions until the end of this turn')
    return true
  }

  public ClearCondition(statusID: string, target: any = this): boolean {
    if (!target.ClearableConditions().some(c => c.status.ID === statusID)) return false
    target.RemoveStatus(statusID)
    this.log(`Cleared ${statusID}`)
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
    this.log('NPC invade: 2 heat and impaired')
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
    this.log('NHP has entered cascade; control passes to the GM')
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
    irreducible: boolean
  ): number {
    return this.DamageController.CalculateArmorReduction(type, value, ap, irreducible)
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

  public RemoveStatus(statusID: string): void {
    this.StatusController.RemoveStatus(statusID)
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

  public AddStatVal(stat, val): void {
    const osVal = Number(val)
    if (isNaN(osVal)) return
    const current = this.StatController.getCurrent(stat) || 0
    const max = this.StatController.getMax(stat)
    const newVal = max ? Math.min(current + osVal, max) : current + osVal
    this.StatController.setCurrentStat(stat, newVal)
  }

  public SetCore(active: boolean): void {
    this.CoreActive = active
    if (active) this.CorePower = false
    this.log(`${active ? 'Activated' : 'Deactivated'} Core System`)
  }

  public Overcharge(heat?: number): number {
    const cost = typeof heat === 'number' ? heat : DiceRoller.roll(this.OverchargeCost as any)
    this.StartOvercharge()
    this.TakeDamage(DamageType.Heat, cost)
    this.IncreaseOverchargeLevel()
    return cost
  }

  public RepairDestroyed(contributed: number = CombatController.RepairCost('destroyed')): boolean {
    if (!this.IsDestroyed && !this.ReactorDestroyed) return false
    if (this.ReactorDestroyed) {
      this.log('Repair refused: the wreck was annihilated by a reactor meltdown')
      return false
    }
    if (contributed < CombatController.RepairCost('destroyed')) return false

    this.SetDestroyed(false)
    this.StatController.setCurrentStat(StatKey.HP, this.StatController.getMax(StatKey.HP))
    this.StatController.setCurrentStat(StatKey.STRUCTURE, 1)
    this.StatController.setCurrentStat(StatKey.STRESS, 1)
    this.StatController.setCurrentStat(StatKey.HEATCAP, 0)
    this.log('Destroyed mech repaired: 1 structure, 1 stress, full HP')
    return true
  }

  public FullRepair(): void {
    this.StatController.resetCurrentStats()
    this.StatController.setCurrentStat(StatKey.HEATCAP, 0)
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
    this.log('Full repair')
  }

  public Stabilize(
    action: 'cool' | 'repair' | 'reload' | 'clear_burn' | 'clear_self' | 'clear_ally' | 'npc'
  ): void {
    switch (action) {
      case 'cool':
        this.StatController.setCurrentStat(StatKey.HEATCAP, 0)
        this.RemoveStatus('exposed')
        this.log('Stabilized: Cleared Heat and removed Exposed status')
        break
      case 'repair':
        this.StatController.setCurrentStat(StatKey.HP, this.StatController.getMax(StatKey.HP))
        this.StatController.setCurrentStat(
          StatKey.REPAIR_CAPACITY,
          this.StatController.getCurrent(StatKey.REPAIR_CAPACITY) - 1
        )
        this.log('Stabilized: Repaired to full HP')
        break
      case 'reload':
        this.Reload()
        this.log('Stabilized: Reloaded all equipment')
        break
      case 'clear_burn':
        this.StatController.setCurrentStat(StatKey.BURN, 0)
        this.log('Stabilized: Cleared Burn')
        break
      case 'npc':
        this.Reload()
        this.StatController.setCurrentStat(StatKey.HEATCAP, 0)
        this.RemoveStatus('exposed')
        this.log('Stabilized')
        break
      case 'clear_self':
      case 'clear_ally':
        this.log(
          `Stabilized: Cleared negative status: ${action === 'clear_self' ? 'self' : 'ally'}`
        )
        break
      default:
        break
    }
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
    const selfApplied = this.ActiveEffects.filter(ae => ae.InitialSelfApplied)

    if (selfApplied.length > 0) {
      selfApplied.forEach(ae => {
        if (!ae.Duration || ae.Duration === 'encounter' || ae.Duration === 'End of Encounter') {
          this._setTimedFromActiveEffect(ae)
        }
      })
    }
  }

  private _setTimedFromActiveEffect(ae: ActiveEffect): void {
    const apply = {} as ITimedEffectAction
    if (ae.AddResist.length)
      apply.resist = ae.AddResist.map(x => ({ type: x.Resist, value: x.ResistType }))
    if (ae.AddSpecial.length)
      apply.special = ae.AddSpecial.map(x => ({ attribute: x.Attribute, detail: x.Detail }))
    if (ae.AddStatus.length) apply.status = ae.AddStatus.map(x => x.Status.ID)

    this.TimedEffects.push(
      markRaw(
        new TimedEffect({
          name: ae.Name,
          origin: ae.Origin.Name,
          detail: ae.Detail,
          round: this.Round,
          apply,
        })
      )
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

    const selfApplied = this.ActiveEffects.filter(ae => ae.InitialSelfApplied)

    if (selfApplied.length > 0) {
      selfApplied.forEach(ae => {
        if (ae.Duration === 'turn' || ae.Duration === 'End of Turn') {
          this._setTimedFromActiveEffect(ae)
        }
      })
    }
  }

  public EndRound(encounter?: any): void {
    EndRoundFlow.Begin({ cc: this, encounter })
  }

  public Reset(scope: ActivePeriod = ActivePeriod.Mission): void {
    this.ResetCombatActions()
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
      this.log(`Status expired with the encounter: ${s.status.Name}`)
      this.RemoveStatus(s.status.ID)
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
      this.log(`Reloaded ${eq.Name ?? 'weapon'}`)
    })
    return true
  }

  public RollRecharge(features: any[]): number {
    const recharging = (features || []).filter(f => f?.Recharge > 0 && f.Used)
    if (!recharging.length) return 0
    const roll = DiceRoller.rollDie(6)
    this.RechargeRolledRound = this.Round
    recharging.forEach(f => {
      if (roll >= f.Recharge) {
        f.Used = false
        this.log(`${f.Name || 'Feature'} recharged on a ${roll}`)
      }
    })
    return roll
  }

  public StartSelfDestruct(fireOnRound?: number): void {
    this.ActionPoolController.StartSelfDestruct(fireOnRound ?? this.SelfDestructWindow[0])
  }

  public SetSelfDestructRound(round: number): boolean {
    if (!this.SelfDestructWindow.includes(round)) return false
    const pending = this.TimedEffects.find(t => t.Apply?.other === 'self_destruct')
    if (!pending) return false
    this.TimedEffects = this.TimedEffects.filter(t => t !== pending)
    this.StartSelfDestructAt(round, pending)
    return true
  }

  private StartSelfDestructAt(round: number, previous: TimedEffect): void {
    this.TimedEffects.push(
      markRaw(
        new TimedEffect({
          name: previous.Name,
          detail: previous.Detail,
          round,
          apply: { other: 'self_destruct' },
        })
      )
    )
    this.log(`Self destruct set to detonate on round ${round}`)
  }

  public CommitSelfDestruct(): void {
    this.ActionPoolController.CommitSelfDestruct()
  }

  public CommitReactorMeltdown(): void {
    this.ActionPoolController.CommitReactorMeltdown()
    this.log('Reactor meltdown!')
  }

  public ScheduleReactorMeltdown(turns: number): void {
    const pending = this.TimedEffects.find(t => t.Apply?.other === 'reactor_meltdown')
    if (pending) {
      if (pending.Round <= this.Round + turns) return
      this.TimedEffects.splice(this.TimedEffects.indexOf(pending), 1)
    }
    this.TimedEffects.push(
      markRaw(
        new TimedEffect({
          name: 'Reactor Meltdown',
          detail: `This mech's reactor will melt down, annihilating it and killing everyone inside, dealing 4d6 explosive damage to all targets in a burst 2 area around it.`,
          round: this.Round + turns,
          apply: { other: 'reactor_meltdown' },
        })
      )
    )
    this.log(`Reactor meltdown in ${turns} turn(s)`)
  }

  public RetryMeltdownCheck(success: boolean): boolean {
    const index = this.TimedEffects.findIndex(t => t.Apply?.other === 'reactor_meltdown')
    if (index === -1) return false
    this.SetCombatAction('full', false)
    if (!success) {
      this.log('Failed to avert the reactor meltdown')
      return false
    }
    this.TimedEffects.splice(index, 1)
    this.log('Reactor meltdown averted')
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

    target.combat_history = [...controller.CombatLog.History]
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

    controller.CombatLog.History = CombatLog.trim(data?.combat_history || [])

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
