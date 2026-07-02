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
import { BonusController } from '../feature/bonus/BonusController'
import { CompendiumStore } from '@/features/compendium/store'
import { expiration } from './Expiration'
import { CombatLogEntry, CombatLog } from './CombatLog'
import { Bonus } from '../feature/bonus/Bonus'
import { assertController } from '../../utility/assertController'
import { StatusController } from './StatusController'
import { ActionPoolController, DEFAULT_COMBAT_ACTIONS } from './ActionPoolController'
import { DamageController } from './DamageController'

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
  isDead: boolean

  stats: IStatData

  timed_effects: ITimedEffectData[]

  combatActions: any
  usedActions: string[]

  combat_history: CombatLogEntry[]
  round: number
  turn: number
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
    if (this.Parent instanceof Pilot || this.Parent instanceof Mech)
      return this.Parent.AttackBonus || 0
    else return this.StatController.getCurrent(StatKey.ATTACK_BONUS) || 0
  }

  public get TechAttackBonus(): number {
    if (this.Parent instanceof Pilot || this.Parent instanceof Mech)
      return this.Parent.TechAttack || 0
    else return this.StatController.getCurrent(StatKey.TECH_ATTACK) || 0
  }

  public AllActions(activation: ActivationType): Action[] {
    return this.Parent.FeatureController.Actions.filter(a => a.Activation === activation)
  }

  public get AllSynergies(): any[] {
    return this.Parent.FeatureController.Synergies
  }

  public get AllEquipment(): any[] {
    let items: any[]
    if (this.Parent instanceof Mech)
      items = this.Parent.MechLoadoutController.ActiveLoadout.Equipment
    else if (this.Parent instanceof Pilot)
      items = this.Parent.PilotLoadoutController.ActiveLoadout.Items
    else if (this.Parent.NpcFeatureController) items = this.Parent.NpcFeatureController.Features
    else return []
    return items.filter(Boolean)
  }

  public get RootActor(): any {
    if (this.Parent instanceof Mech) return this.Parent.Parent
    return this.Parent
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

  public log(str: string): void {
    this.CombatLog.LogSimpleEvent(str)
  }
  // ------------------------------------------------------
  public get Activations(): number {
    return this.StatController.getMax(StatKey.ACTIVATIONS)
  }

  public get ActiveEffects(): ActiveEffect[] {
    const fx = this.Parent.FeatureController?.ActiveEffects || []
    if (this.Parent instanceof Pilot) return fx.filter(e => e.Pilot)
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
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getCurrent(StatKey.ACTIVATIONS) - 1
    )
    if (this.StatController.getCurrent(StatKey.ACTIVATIONS) >= 1) {
      const remaining = this.StatController.getCurrent(StatKey.ACTIVATIONS)
      this.Reset()
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

  public ToggleMounted(): void {
    this.Mounted = !this.Mounted
    this.log(`${this.Mounted ? 'Mounted' : 'Dismounted'} Mech`)
    if (!this.Mounted && this.HasAISystems) {
      this.AIControl = true
      this.log(`AI Assumed control of ${this.RootActor.ActiveMech.Name}`)
    }
  }

  public CanActivate(action: string): boolean {
    return this.ActionPoolController.CanActivate(action)
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

  public MarkActionUsed(actionId: string): void {
    this.ActionPoolController.MarkActionUsed(actionId)
  }

  public IsActionUsed(actionId: string): boolean {
    return this.ActionPoolController.IsActionUsed(actionId)
  }

  public ClearActionUsed(actionId: string): void {
    this.ActionPoolController.ClearActionUsed(actionId)
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
    this.StatController.setCurrentStat(key, val ? 0 : this.StatController.getMax(key))
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
    if (this.Parent instanceof Pilot) {
      return this.Parent.ActiveMech![type]
    } else return this.StatController.getMax(type.toLowerCase()) || 0
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
    reliable = 0,
    direct = false
  ): { total: number; resist: string[]; condition: string[] } {
    return this.DamageController.CalculateDamage(type, value, ap, irreducible, reliable, direct)
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

  public ApplyHeat(value: number): void {
    this.DamageController.ApplyHeat(value)
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
    this.CorePower = false
    this.log(`${active ? 'Activated' : 'Deactivated'} Core System`)
  }

  public Stabilize(
    action: 'cool' | 'repair' | 'reload' | 'clear_burn' | 'clear self' | 'clear ally' | 'npc'
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
      case 'clear self':
      case 'clear ally':
        this.log(
          `Stabilized: Cleared negative status: ${action === 'clear self' ? 'self' : 'ally'}`
        )
        break
      default:
        break
    }
  }

  public getExpiredStatuses(
    currentRound: number,
    currentActorID: string
  ): { status: Status; expires: expiration }[] {
    return this.StatusController.getExpiredStatuses(currentRound, currentActorID, this.Turn)
  }

  public StartEncounter(): void {
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

  public StartRound(): void {
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
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getMax(StatKey.ACTIVATIONS)
    )
    this.ActionPoolController.clearAllUsedActions()
    this._resetReloadableEquipment()

    const newEffects: TimedEffect[] = []

    if (this.StatController.getCurrent(StatKey.BURN) > 0) {
      newEffects.push(
        new TimedEffect({
          name: 'Burn Damage',
          detail: `Take ${this.StatController.getCurrent(StatKey.BURN)} burn damage at the end of your turn.`,
          round: this.Round + 1,
          apply: {
            damage: [
              { type: DamageType.AppliedBurn, value: this.StatController.getCurrent(StatKey.BURN) },
            ],
          },
        })
      )
    }

    const statusExpires = this.getExpiredStatuses(this.Round, this.Parent.ID)

    const specialStatusExpires = this.CustomStatuses.filter(s =>
      s.expires?.HasExpired(this.Round, this.Parent.ID, this.Turn)
    )

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

  public Reset(): void {
    this.ResetCombatActions()
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getMax(StatKey.ACTIVATIONS)
    )
    this.StatController.setCurrentStat(StatKey.SPEED, this.StatController.getMax(StatKey.SPEED))
    this.ActionPoolController.clearAllUsedActions()
    this._resetReloadableEquipment()
    if (this.Parent instanceof Pilot) {
      if (this.Parent.ActiveMech) this.Parent.ActiveMech.CombatController.Reset()
    }
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
      eq.IsUsed = false
    })
  }

  public StartSelfDestruct(): void {
    this.ActionPoolController.StartSelfDestruct()
  }

  public CommitSelfDestruct(): void {
    this.ActionPoolController.CommitSelfDestruct()
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
    target.resistances = controller.Resistances
    target.cover = controller.Cover
    target.mounted = controller.Mounted
    target.overwatch = controller.Overwatch
    target.braced = controller.Braced
    target.prepared = controller.Prepared
    target.coreActive = controller.CoreActive
    target.corePower = controller.CorePower
    target.aiControl = controller.AIControl

    target.isInSelfDestruct = controller.IsInSelfDestruct
    target.reactorDestroyed = controller.ReactorDestroyed
    target.isDead = controller.IsDead

    target.combatActions = controller.CombatActions

    target.combat_history = controller.CombatLog.History
    target.round = controller.Round
    target.turn = controller.Turn

    target.usedActions = controller.ActionPoolController.usedActions

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
    controller.Prepared = data?.prepared || false
    controller.CorePower = data?.corePower ?? true
    controller.CoreActive = data?.coreActive || false
    controller.AIControl = data?.aiControl || false

    controller.IsInSelfDestruct = data?.isInSelfDestruct || false
    controller.ReactorDestroyed = data?.reactorDestroyed || false
    controller.IsDead = data?.isDead || false

    if (data?.combatActions) controller.CombatActions = data.combatActions

    controller.ActionPoolController.usedActions = data?.usedActions || []

    controller.CombatLog.History = data?.combat_history || []

    controller.Round = data?.round || 1
    controller.Turn = data?.turn || 1

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

const _checkController: IControllerStatic<CombatController, CombatData> = CombatController
export { CombatController }
export type { CombatData, CoverType }
