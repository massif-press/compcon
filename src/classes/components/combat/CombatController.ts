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
  type IActionUseRecord,
} from './ActionPoolController'
import { DamageController } from './DamageController'
import { DiceRoller } from '@/classes/dice/DiceRoller'
import { ruleFor, customRuleFor, kindsFor } from './StatusRules'
import { ActivationFlow, BraceFlow, OverwatchFlow } from './ActivationFlow'
import type { IActivationState } from './ActivationFlow'
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

  public get Statuses(): { status: Status; expires: expiration }[] {
    return this.StatusController.Statuses
  }
  public set Statuses(val: { status: Status; expires: expiration }[]) {
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

  public EndTurn(): void {
    this.ActionPoolController.InOvercharge = false
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getCurrent(StatKey.ACTIVATIONS) - 1
    )
    this.ClearUses(ActivePeriod.Turn)
    this.Counterpart?.ClearUses(ActivePeriod.Turn)
    if (this.StatController.getCurrent(StatKey.ACTIVATIONS) >= 1) {
      const remaining = this.StatController.getCurrent(StatKey.ACTIVATIONS)
      this.Reset(ActivePeriod.Turn)
      this.RefreshReactions()
      this.StatController.setCurrentStat(StatKey.ACTIVATIONS, remaining)
      this.Turn++
      this.CombatLog.AddTurn()
      this.CombatLog.LogSimpleEvent(
        `Turn complete. ${this.StatController.getCurrent(StatKey.ACTIVATIONS)} turns remaining this round.`
      )
    }
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
    this.SetCombatAction('protocol', false)
    this.CombatActions.Protocol = false
    this.AIControl = value
    this.log(value ? 'AI assumed control' : 'Pilot reclaimed control')
  }

  public ToggleMounted(): void {
    this.Mounted = !this.Mounted
    this.SetCombatAction('protocol', false)
    this.CombatActions.Protocol = false
    this.log(`${this.Mounted ? 'Mounted' : 'Dismounted'} Mech`)
    if (!this.Mounted && this.HasAISystems) {
      this.AIControl = true
      this.log(`AI Assumed control of ${this.RootActor.ActiveMech.Name}`)
    }
  }

  public CanActivate(action: string): boolean {
    return this.ActionPoolController.CanActivate(action)
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
    return BraceFlow.Begin(this._activationState('brace', { reaction: 'brace' })).outcome === 'complete'
  }

  public SetBraced(value: boolean): boolean {
    if (value === this.Braced) return false
    if (value) return this.Brace()
    this.Braced = false
    this._clearBraceResistance()
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

  private _activationState(activation: string, opts: Partial<IActivationState> = {}): IActivationState {
    return { cc: this, activation, legal: false, ...opts }
  }

  private _clearBraceResistance(): void {
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
      OverwatchFlow.Begin(
        this._activationState('overwatch', { reaction: 'overwatch', weapon })
      ).outcome === 'complete'
    )
  }

  public CanUseQuickTech(option: string): boolean {
    return this.CanActivate('quicktech') && !this.IsActionUsed(`quicktech:${option.toLowerCase()}`)
  }

  public UseQuickTech(option: string): boolean {
    if (!this.CanUseQuickTech(option)) return false
    this.MarkActionUsed(`quicktech:${option.toLowerCase()}`)
    this.SetCombatAction('quicktech', false)
    return true
  }

  public CanUseReaction(id: string): boolean {
    return this.ActionPoolController.CanUseReaction(id)
  }

  public UseReaction(id: string): void {
    this.ActionPoolController.UseReaction(id)
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

  public static RepairCost(kind: 'hp' | 'item' | 'structure' | 'stress' | 'destroyed'): number {
    return { hp: 1, item: 1, structure: 2, stress: 2, destroyed: 4 }[kind]
  }

  public SetUnlicensed(unlicensed: boolean): void {
    if (unlicensed) {
      this.AddStatus('impaired')
      this.AddStatus('slow')
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

  public ClearableConditions(): { status: Status; expires: expiration }[] {
    return this.Statuses.filter(
      s => s.status.StatusType === 'Condition' && !(s as any).SelfInflicted
    )
  }

  public AutoFails(check: string): boolean {
    const key = check.toLowerCase()
    return this._activeStatusRules.some(r => r.autoFail?.includes(key as any))
  }

  public DeniesActivation(action: string): boolean {
    const str = action.toLowerCase().replace(' ', '')
    return this._activeStatusRules.some(r => {
      if (r.permits?.includes(str)) return false
      if (r.denies?.includes('*')) return true
      return !!r.denies?.includes(str)
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
    this.SetCombatAction('quick', false)
    this.log('Shut down')
  }

  public BootUp(): void {
    if (!this.HasStatus('shut-down')) return
    this.RemoveStatus('shut-down')
    this.RemoveStatus('stunned')
    this.SetCombatAction('full', false)
    this.log('Booted up')
  }

  public ConsumeLockOn(): number {
    if (!this.HasStatus('lockon')) return 0
    this.RemoveStatus('lockon')
    this.log('Lock On consumed')
    return 1
  }

  public ImprovisedAttackDamage(): number {
    return DiceRoller.rollDie(6)
  }

  public Ram(target: CombatController, outcome: { hit: boolean }): boolean {
    this.SetCombatAction('full', false)
    if (!outcome.hit) return false
    target.AddStatus('prone')
    this.log('Ram: target knocked prone')
    return true
  }

  public Grapple(
    target: CombatController,
    outcome: { hit: boolean; smaller?: CombatController }
  ): boolean {
    this.SetCombatAction('full', false)
    if (!outcome.hit) return false
    this.AddStatus('engaged')
    target.AddStatus('engaged')
    ;(outcome.smaller ?? target).AddStatus('immobilized')
    this.log('Grapple: both characters engaged')
    return true
  }

  public Invade(target: CombatController, opts: { willing?: boolean } = {}): {
    automatic: boolean
    isAttack: boolean
  } {
    if (target.ImmuneTo('tech', 'invade')) return { automatic: false, isAttack: false }
    if (opts.willing) {
      this.log('Invaded a willing ally: automatic success, no heat')
      return { automatic: true, isAttack: false }
    }
    return { automatic: false, isAttack: true }
  }

  public Eject(): void {
    this.SetCombatAction('full', false)
    this.AddStatus('impaired')
    this.log('Ejected; mech is impaired until a full repair')
  }

  public Prepare(): void {
    if (this.Prepared) return
    this.Prepared = true
    this.SetCombatAction('quick', false)
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
    this.log('Released the prepared action')
  }

  public Search(target: CombatController, outcome: { success: boolean }): boolean {
    this.SetCombatAction('quick', false)
    if (!outcome.success) return false
    target.RemoveStatus('hidden')
    this.log('Search: target is no longer hidden')
    return true
  }

  public Jockey(
    target: CombatController,
    outcome: { success: boolean; option?: 'distract' | 'shred' | 'damage' }
  ): boolean {
    this.SetCombatAction('quick', false)
    if (!outcome.success) return false
    if (outcome.option === 'distract') target.AddStatus('impaired')
    if (outcome.option === 'shred') target.AddStatus('shredded')
    this.log(`Jockey: ${outcome.option ?? 'success'}`)
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

  public get IsGrunt(): boolean {
    const templates = (this.Parent as any)?.NpcTemplateController?.Templates || []
    return templates.some((t: any) => String(t?.ID ?? t?.Name ?? '').toLowerCase().includes('grunt'))
  }

  public get IsBiological(): boolean {
    return !!(this.Parent as any)?.IsBiological
  }

  public UseFullTech(options: string[]): boolean {
    if (!this.CanActivate('fulltech')) return false
    if (this.IsNpc && options.length === 2 && options[0] === options[1]) return false
    this.SetCombatAction('full', false)
    const frequency = new Frequency(`${Math.max(1, options.length)}/turn`)
    options.forEach(o => this.MarkActionUsed(o, frequency))
    return true
  }

  public NpcInvade(target: CombatController): void {
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

  public AddStatus(statusID: string, expires?: any): void {
    this.StatusController.AddStatus(statusID, expires)
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

  public ImmuneTo(kind: string, action: string): boolean {
    if (kind.toLowerCase() !== 'tech') return false
    if (this.ImmuneToTech) return true
    if (!this.IsBiological && !this.IsPilot) return false
    return !['scan', 'lock_on', 'lockon'].includes(action.toLowerCase())
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

  private _durationContext(over: Partial<IDurationContext> = {}): IDurationContext {
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

  public EndRound(encounter): void {
    this.Turn = 1
    if (this.Braced) {
      this.Braced = false
      this.CustomStatuses.push({
        status: new EffectSpecial({
          attribute: 'Brace Cooldown',
          detail:
            'Due to the stress of bracing, until the end of this turn you can only take one quick action – you cannot take reactions, overcharge, move normally, take full actions, or take free actions.',
        }),
        expires: markRaw(
          new expiration('end_turn_self', this.Parent.CombatController, this, encounter)
        ),
      })
      this._clearBraceResistance()
      this.log('Brace ended; entered Brace Cooldown period')
      this.CombatActions = {
        ...DEFAULT_COMBAT_ACTIONS,
        Protocol: false,
        Full: false,
        Quick2: false,
        Overcharge: false,
        Reaction: false,
      }
    } else {
      this.StatController.setCurrentStat(StatKey.SPEED, this.StatController.getMax(StatKey.SPEED))
      this.CombatActions = { ...DEFAULT_COMBAT_ACTIONS }
    }
    this.ActionPoolController.ClearReactionUses()
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getMax(StatKey.ACTIVATIONS)
    )
    this.ClearUses(ActivePeriod.Round)
    this._resetReloadableEquipment()

    const newEffects: TimedEffect[] = []

    const statusExpires = this.getExpiredStatuses(this.Round, this.Parent.ID)

    const specialStatusExpires = expiredIn(this.CustomStatuses, this._durationContext())

    statusExpires.forEach(s => {
      this.log(`Status expired: ${s.status.Name}`)
      newEffects.push(
        new TimedEffect({
          name: `Status/Condition Expired`,
          detail: `${s.status.Name} status has expired.`,
          round: this.Round,
          remove: { status: [s.status.ID] },
        })
      )
    })

    specialStatusExpires.forEach(s => {
      this.log(`Special status expired: ${s.status.Attribute}`)
      newEffects.push(
        new TimedEffect({
          name: `Special Status Expired`,
          detail: `${s.status.Attribute} special status has expired.`,
          round: this.Round,
          remove: { special: [{ attribute: s.status.Attribute, detail: s.status.Detail }] },
        })
      )
    })

    if (newEffects.length) this.TimedEffects.push(...newEffects.map(markRaw))

    this.Round++
    this.CombatLog.EndRound()
    this.StartRound()
  }

  public Reset(scope: ActivePeriod = ActivePeriod.Mission): void {
    this.ResetCombatActions()
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getMax(StatKey.ACTIVATIONS)
    )
    this.StatController.setCurrentStat(StatKey.SPEED, this.StatController.getMax(StatKey.SPEED))
    this.ClearUses(scope)
    this._resetReloadableEquipment()
    if (this.IsPilot) this.Counterpart?.Reset(scope)
  }

  public EndEncounter(): void {
    expiredIn(this.Statuses, this._durationContext({ encounterEnded: true })).forEach(s => {
      this.log(`Status expired with the encounter: ${s.status.Name}`)
      this.RemoveStatus(s.status.ID)
    })
    this.ClearUses(ActivePeriod.Scene)
    if (this.IsPilot) this.Counterpart?.ClearUses(ActivePeriod.Scene)
  }

  public Reload(): void {
    this.AllEquipment.forEach(eq => {
      if (eq.IsReloading) eq.IsUsed = false
    })
  }

  private _resetReloadableEquipment(): void {
    this.AllEquipment.forEach(eq => {
      if (!eq.IsReloading) return
      if (eq.Recharge < 0) return
      if (eq.Recharge > 0) return
      eq.IsUsed = false
    })
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

  public StartSelfDestruct(): void {
    this.ActionPoolController.StartSelfDestruct()
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
      }))
      .filter(s => s.status != null) as { status: Status; expires: expiration }[]
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
    controller.CorePower = data?.corePower ?? true
    controller.CoreActive = data?.coreActive || false
    controller.AIControl = data?.aiControl || false

    controller.IsInSelfDestruct = data?.isInSelfDestruct || false
    controller.ReactorDestroyed = data?.reactorDestroyed || false
    controller.RechargeRolledRound = data?.rechargeRolledRound ?? -1
    controller.ActionPoolController.ReactionsUsed = data?.reactionsUsed ? [...data.reactionsUsed] : []
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
export { CombatController }
export type { CombatData, CoverType }
