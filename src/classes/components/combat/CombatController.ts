import { markRaw } from 'vue'
import { ActivationType, Counter, DamageType, DiceRoller, Mech, Pilot, Rules } from '@/class'
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
import { CompendiumStore } from '@/stores'
import { expiration } from './Expiration'
import { CombatLogEntry, CombatLog } from './CombatLog'
import { Bonus } from '../feature/bonus/Bonus'

enum CoverType {
  None = 'none',
  Soft = 'soft',
  Hard = 'hard',
}

class CombatData {
  resistances: { type: DamageType; condition: string }[] = []
  statuses: { status: string; expires: string }[] = []
  customStatuses: { status: IEffectSpecialData; expires: string }[] = []
  counters: ICounterCollection = {} as ICounterCollection
  cover: CoverType = CoverType.None
  corePower: boolean = true

  mounted: boolean = true
  overwatch: boolean = false
  braced: boolean = false
  prepared: boolean = false
  coreActive: boolean = false
  aiControl: boolean = false

  isInSelfDestruct: boolean = false
  reactorDestroyed: boolean = false
  isDead: boolean = false

  stats: IStatData = {} as IStatData

  timed_effects: ITimedEffectData[] = []

  combatActions: any = {}
  usedActions: string[] = []

  combat_history: CombatLogEntry[] = []
  round: number = 1
  turn: number = 1
  action: number = 1
}

class CombatController implements ICounterContainer, IStatContainer {
  public readonly Parent: ICombatant

  public Resistances: { type: string; condition: string }[] = []
  public Statuses: { status: Status; expires: expiration }[] = []
  public CustomStatuses: { status: EffectSpecial; expires: expiration }[] = []
  public Counters: Counter[] = []
  public Cover: CoverType = CoverType.None
  public TimedEffects: TimedEffect[] = []
  public CorePower = true

  public Mounted = true
  public Overwatch = false
  public Braced = false
  public Prepared = false
  public CoreActive = false
  public AIControl = false

  public IsInSelfDestruct = false
  public ReactorDestroyed: boolean = false
  public IsDead: boolean = false

  public StatController: StatController
  public CounterController: CounterController

  public CombatLog: CombatLog
  public CombatLogVersion: number = 0
  public Round: number = 1
  public Turn: number = 1
  public Action: number = 1

  private _usedActions: string[] = []

  // prevent applied events after successful saves. Must be disabled after effect iteration.
  public SaveLock: boolean = false

  public _combatActions: any = {
    Protocol: true,
    Full: true,
    Quick1: true,
    Quick2: true,
    Overcharge: true,
    Reaction: true,
  }

  public get CombatActions(): any {
    // pilot and mech action pool is shared... unless it's under AI control
    if (this.Parent instanceof Mech && this.IsAIControlled) return this._combatActions
    return this.RootActor.CombatController._combatActions
  }

  public set CombatActions(value: any) {
    this.RootActor.CombatController._combatActions = value
  }

  constructor(parent: ICombatant) {
    this.Parent = parent
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
    else if ((this.Parent as any).NpcFeatureController)
      items = (this.Parent as any).NpcFeatureController.Features
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
    return (this.Parent as any).Callsign || this.Parent.Name
  }

  public get Tier(): number {
    if ((this.Parent as any).NpcClassController) return (this.Parent as any).NpcClassController.Tier
    return 1
  }

  public get LimitedBonus(): number {
    if ((this.Parent as any).LimitedBonus !== undefined) return (this.Parent as any).LimitedBonus
    return 0
  }

  public GetSavingThrowBonus(stat: string): number {
    // TODO
    return 0
  }

  // for pc table prompt watchers
  public get CurrentStructure(): number {
    return this.StatController.getCurrent(StatKey.STRUCTURE) || 0
  }

  public get CurrentStress(): number {
    return this.StatController.getCurrent(StatKey.STRESS) || 0
  }

  private log(str: string): void {
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
    if ((this.Parent as any).Callsign)
      return `${(this.Parent as any).Callsign} (${this.Parent.Name})`
    return this.Parent.Name
  }

  public EndTurn(): void {
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getCurrent(StatKey.ACTIVATIONS) - 1
    )
    console.log(this.StatController.getCurrent(StatKey.ACTIVATIONS))
    if (this.StatController.getCurrent(StatKey.ACTIVATIONS) >= 1) {
      console.log(this.StatController.getCurrent(StatKey.ACTIVATIONS))
      this.Reset()
      this.Turn++
      this.CombatLog.AddTurn()
      this.CombatLog.LogSimpleEvent(
        `Turn complete. ${this.StatController.getCurrent(StatKey.ACTIVATIONS)} turns remaining this round.`
      )
    }
  }

  public get HasRemainingActions(): boolean {
    // ignore overcharge and reaction for this check
    return this.CanActivate('protocol') || this.CanActivate('full') || this.CanActivate('quick')
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
    const str = action.toLowerCase().replace(' ', '')
    switch (str) {
      case 'free':
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
          this.StatController.getCurrent(StatKey.SPEED) >= this.StatController.getMax(StatKey.SPEED)
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
        return this.StatController.getCurrent(StatKey.SPEED) > 0
      default:
        return false
    }
  }

  public ResetCombatActions(): void {
    this.CombatActions = {
      Protocol: true,
      Full: true,
      Quick1: true,
      Quick2: true,
      Overcharge: true,
      Reaction: true,
    }
  }

  public toggleCombatAction(action: string) {
    const str = action.toLowerCase()
    this.SetCombatAction(str, !this.CanActivate(str))
  }

  public SetCombatAction(action: string, value: boolean): void {
    const str = action.toLowerCase()
    switch (str) {
      case 'protocol':
        this.CombatActions.Protocol = value
        break
      case 'full':
      case 'full tech':
        this.CombatActions.Full = value
        this.CombatActions.Quick1 = this.CombatActions.Full
        this.CombatActions.Quick2 = this.CombatActions.Full
        break
      case 'quick':
      case 'quicktech':
      case 'quick tech':
      case 'invade':
        if (this.CombatActions.Quick1 && !value) this.CombatActions.Quick1 = false
        else if (this.CombatActions.Quick2 && !value) this.CombatActions.Quick2 = false
        else if (!this.CombatActions.Quick1 && value) this.CombatActions.Quick1 = true
        else if (!this.CombatActions.Quick2 && value) this.CombatActions.Quick2 = true
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

  public ResetActivation(action: string): void {
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
    // pilot and mech action pool is shared
    if (this.Parent instanceof Pilot) {
      this.Parent.ActiveMech?.CombatController.ResetActivation(action)
    } else if (this.Parent instanceof Mech)
      this.Parent.Pilot?.CombatController.ResetActivation(action)
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
    condition = condition?.toLowerCase() || 'off'
    const target = thisActor ? this : this.ActiveActor.CombatController

    const existingIndex = target.Resistances.findIndex(s => s.type === type)
    if (existingIndex === -1) {
      target.Resistances.push({ type, condition })
      this.log(`Gained ${type} ${condition}`)
    } else if (condition && condition !== 'off') {
      target.Resistances[existingIndex].condition = condition
    } else {
      this.Resistances.splice(existingIndex, 1)
      this.log(`Lost ${type} ${condition}`)
    }
  }

  public AddResist(type: string, condition?: string): void {
    condition = condition?.toLowerCase() || 'vulnerable'

    const existingIndex = this.ActiveActor.CombatController.Resistances.findIndex(
      s => s.type === type
    )
    if (existingIndex === -1) {
      this.ActiveActor.CombatController.Resistances.push({ type, condition })
      this.log(`Gained ${type} ${condition}`)
    } else if (condition) {
      this.ActiveActor.CombatController.Resistances[existingIndex].condition = condition
    }
  }

  public RemoveResist(type: string): void {
    type = type.toLowerCase()
    const existingIndex = this.ActiveActor.CombatController.Resistances.findIndex(
      s => s.type === type
    )
    if (existingIndex > -1) {
      this.Resistances.splice(existingIndex, 1)
    }
  }

  public GetResistance(damageType: string): string {
    const resist = this.ActiveActor.CombatController.Resistances.find(
      r => r.type === damageType.toLowerCase()
    )

    if (!resist || !resist.condition) return 'none'

    if (resist.condition === 'vulnerable') {
      return resist.condition
    } else {
      return this.HasStatus('shredded') ? 'none' : resist.condition
    }
  }

  public HasStatus(statusID: string): boolean {
    return this.ActiveActor.CombatController.Statuses.some(s => s.status.ID === statusID)
  }

  public AddStatus(statusID: string, expires?: any): void {
    const status = CompendiumStore().Statuses.find(s => s.ID === statusID)
    if (!status) return
    const target = this.ActiveActor.CombatController
    const existingIndex = target.Statuses.findIndex(s => s.status.ID === status.ID)
    if (existingIndex === -1) {
      target.Statuses.push({ status, expires })
      this.log(`Gained ${status.Name}`)
    } else if (expires) {
      target.Statuses[existingIndex].expires = expires
    }
  }

  public ToggleStatus(status: Status, expires?: any, thisController = false): void {
    if (!status) return
    const target = thisController ? this : this.ActiveActor.CombatController
    const existingIndex = target.Statuses.findIndex(s => s.status.ID === status.ID)
    if (existingIndex === -1) {
      target.Statuses.push({ status, expires })
      this.log(`Gained ${status.Name}`)
    } else {
      target.Statuses.splice(existingIndex, 1)
      this.log(`Lost ${status.Name}`)
    }
  }

  public get IsDestroyed(): boolean {
    if (this.StatController.getMax(StatKey.STRUCTURE) > 0)
      return this.StatController.getCurrent(StatKey.STRUCTURE) <= 0
    else if (this.StatController.getMax(StatKey.HP) > 0)
      return this.StatController.getCurrent(StatKey.HP) <= 0
    return false
  }

  public get IsInDangerZone(): boolean {
    if (!this.StatController.getMax(StatKey.HEATCAP)) return false
    return (
      this.StatController.getCurrent(StatKey.HEATCAP) >=
      Math.ceil(this.StatController.getMax(StatKey.HEATCAP) / 2)
    )
  }

  public SetCustomStatus(special: EffectSpecial, expires?: any): void {
    if (!special) return
    const existingIndex = this.CustomStatuses.findIndex(
      s => s.status.Attribute === special.Attribute
    )
    if (existingIndex === -1) {
      this.CustomStatuses.push({ status: special, expires })
      this.log(`Gained special status: ${special.Attribute}`)
    } else if (expires) {
      this.CustomStatuses[existingIndex].expires = expires
    } else {
      this.CustomStatuses.splice(existingIndex, 1)
      this.log(`Lost special status: ${special.Attribute}`)
    }
  }

  public get OverchargeTrack(): any[] {
    return (this.Parent as any).OverchargeTrack || Rules.Overcharge
  }

  public get OverchargeLevel(): number {
    return this.StatController.getCurrent(StatKey.OVERCHARGE) || 0
  }

  public get OverchargeCost(): string | number {
    const track = (this.Parent as any).OverchargeTrack || Rules.Overcharge
    return track[this.OverchargeLevel]
  }

  public IncreaseOverchargeLevel(): void {
    if (this.OverchargeLevel < this.OverchargeTrack.length - 1) {
      this.StatController.setCurrentStat(
        StatKey.OVERCHARGE,
        this.StatController.getCurrent(StatKey.OVERCHARGE) + 1
      )
      this.log(
        `Increased overcharge to level ${this.OverchargeLevel} (${this.OverchargeCost} Heat)`
      )
    }
  }

  public getCheckBonus(type: 'Hull' | 'Agi' | 'Sys' | 'Eng'): number {
    if (this.Parent instanceof Pilot) {
      return this.Parent.ActiveMech![type]
    } else return this.StatController.getMax(type.toLowerCase()) || 0
  }

  // these are split out to furnish UI with more detailed breakdowns
  public CalculateArmorReduction(
    type: DamageType,
    value: number,
    ap: boolean,
    irreducible: boolean
  ): number {
    if (
      irreducible ||
      ap ||
      type === DamageType.Heat ||
      type === DamageType.Burn ||
      type === DamageType.AppliedBurn
    )
      return 0
    return this.ActiveActor.StatController.getCurrent(StatKey.ARMOR) || 0
  }

  public CalculateDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    reliable = 0
  ): { total: number; resist: string[]; condition: string[] } {
    const out = { total: value, resist: [] as string[], condition: [] as string[] }

    if (reliable > 0 && out.total < reliable) {
      out.total = reliable
    }

    if (
      this.HasStatus('exposed') &&
      type !== DamageType.Heat &&
      type !== DamageType.Burn &&
      type !== DamageType.AppliedBurn
    ) {
      out.total *= 2
      out.condition.push('exposed')
    }

    if (this.HasStatus('shredded')) {
      out.condition.push('shredded')
      ap = true
    }

    if (irreducible) return out

    out.total = Math.max(0, out.total - this.CalculateArmorReduction(type, value, ap, irreducible))

    const resist = this.ActiveActor.CombatController.Resistances.find(
      r => r.type === type.toLowerCase()
    )

    if (resist) {
      if (resist.condition === 'vulnerable') {
        out.total = Math.ceil(out.total * 2)
        out.resist.push('vulnerable')
      } else if (!this.HasStatus('shredded') && resist.condition === 'resistance') {
        out.total = Math.ceil(out.total / 2)
        out.resist.push('resistance')
      } else if (!this.HasStatus('shredded') && resist.condition === 'immunity') {
        out.total = 0
        out.resist.push('immunity')
      }
    }

    if (reliable > 0 && out.total < reliable) {
      out.total = reliable
    }

    return out
  }

  // TODO: audit damage calcs to ensure everything is coming through as enum (or constant)
  public TakeDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false
  ): void {
    if (this.SaveLock) return

    if (
      type === DamageType.Heat.toLowerCase() &&
      !this.ActiveActor.StatController.getMax(StatKey.STRESS)
    ) {
      type = DamageType.Energy
    }

    const damage = this.CalculateDamage(type, value, ap, irreducible)

    this.ApplyDamage(type, damage.total)

    this.CombatLog.TakeDamage(value, type)
    this.CombatLog.ArmorReduced(this.CalculateArmorReduction(type, value, ap, irreducible))
    if (this.IsDestroyed) this.CombatLog.LoseMech()
  }

  public ApplyDamage(type: DamageType, value: number) {
    const target = this.ActiveActor.CombatController

    if (type.toLowerCase() === DamageType.Heat.toLowerCase()) {
      target.ApplyHeat(value)
      return
    }
    if (type.toLowerCase() === DamageType.Burn.toLowerCase()) {
      target.StatController.setCurrentStat(
        StatKey.BURN,
        target.StatController.getCurrent(StatKey.BURN) + value
      )
    }

    // if we have overshield, remove it before hp
    if (target.StatController.getCurrent(StatKey.OVERSHIELD) > 0) {
      const overshield = target.StatController.getCurrent(StatKey.OVERSHIELD) || 0
      if (value <= overshield) {
        target.StatController.setCurrentStat(StatKey.OVERSHIELD, overshield - value)
        this.log(`Overshield absorbed ${value} damage`)
        this.CombatLog.StatChange(-value, 'overshield')
        return
      } else {
        target.StatController.setCurrentStat(StatKey.OVERSHIELD, 0)
        value -= overshield
        this.log(`Overshield absorbed ${overshield} damage before breaking`)
        this.CombatLog.StatChange(-overshield, 'overshield')
      }
    }

    // subtract this damage from current hp
    this.ActiveActor.StatController.setCurrentStat(
      StatKey.HP,
      this.ActiveActor.StatController.getCurrent(StatKey.HP) - value
    )
    this.log(`Took ${value} ${type} damage`)
    this.CombatLog.StatChange(-value, 'hp')

    // if hull goes below 0, subtract 1 from structure and add max hp back to current hp
    while (
      target.StatController.getCurrent(StatKey.HP) <= 0 &&
      target.StatController.getCurrent(StatKey.STRUCTURE) > 0
    ) {
      target.StatController.setCurrentStat(
        StatKey.STRUCTURE,
        target.StatController.getCurrent(StatKey.STRUCTURE) - 1
      )
      if (target.StatController.getCurrent(StatKey.STRUCTURE) >= 0)
        this.log(
          `Structure damaged! Remaining structure: ${target.StatController.getCurrent(StatKey.STRUCTURE)}`
        )
      if (target.StatController.getCurrent(StatKey.STRUCTURE) > 0)
        this.CombatLog.StatChange(-1, 'structure')
      target.StatController.setCurrentStat(
        StatKey.HP,
        target.StatController.getCurrent(StatKey.HP) + target.StatController.getMax(StatKey.HP)
      )
    }

    // if structure goes below 0, set to 0
    if (target.StatController.getCurrent(StatKey.STRUCTURE) < 0) {
      target.StatController.setCurrentStat(StatKey.STRUCTURE, 0)
    }
  }

  public ApplyHeat(value: number): void {
    const totalValue = value
    const target = this.ActiveActor.CombatController

    target.StatController.setCurrentStat(
      StatKey.HEATCAP,
      target.StatController.getCurrent(StatKey.HEATCAP) + totalValue
    )
    this.log(`Gained ${totalValue} Heat`)
    this.CombatLog.StatChange(value, 'heat')

    if (this.IsInDangerZone)
      this.log(`In Danger Zone! Current Heat: ${target.StatController.getCurrent(StatKey.HEATCAP)}`)

    // if heatcap goes above max, subtract 1 from stress and set heatcap to 0
    while (
      target.StatController.getCurrent(StatKey.HEATCAP) >
      target.StatController.getMax(StatKey.HEATCAP)
    ) {
      target.StatController.setCurrentStat(
        StatKey.STRESS,
        target.StatController.getCurrent(StatKey.STRESS) - 1
      )
      if (target.StatController.getCurrent(StatKey.STRESS) >= 0)
        this.log(
          `Reactor stressed! Remaining Reactor Stress: ${target.StatController.getCurrent(StatKey.STRESS)}`
        )
      if (target.StatController.getCurrent(StatKey.STRESS) > 0)
        this.CombatLog.StatChange(-1, 'stress')
      target.StatController.setCurrentStat(
        StatKey.HEATCAP,
        target.StatController.getCurrent(StatKey.HEATCAP) -
          target.StatController.getMax(StatKey.HEATCAP)
      )
    }

    // if stress goes below 0, set to 0
    if (target.StatController.getCurrent(StatKey.STRESS) < 0) {
      target.StatController.setCurrentStat(StatKey.STRESS, 0)
    }

    if (target.StatController.getCurrent(StatKey.STRESS) === 0) {
      this.ReactorDestroyed = true
      this.log('Reactor destroyed!')
    }
  }

  public RemoveStatus(statusID: string): void {
    const existingIndex = this.ActiveActor.CombatController.Statuses.findIndex(
      s => s.status.ID === statusID
    )
    if (existingIndex !== -1) {
      this.ActiveActor.CombatController.Statuses.splice(existingIndex, 1)
    }
  }

  public ApplyCustomStatus(
    customStatus: EffectSpecial,
    expires: string,
    owner: CombatController,
    target: CombatController,
    encounter: EncounterInstance
  ): void {
    if (this.SaveLock) return
    if (!customStatus) return
    const expirationObj = new expiration(expires, owner, target, encounter)
    const existingIndex = this.ActiveActor.CombatController.CustomStatuses.findIndex(
      s => s.status.Attribute === customStatus.Attribute
    )
    if (existingIndex === -1) {
      this.ActiveActor.CombatController.CustomStatuses.push({
        status: customStatus,
        expires: expirationObj,
      })
    } else {
      this.ActiveActor.CombatController.CustomStatuses[existingIndex].expires.Raw = expires
    }
  }

  public HasCustomStatus(attribute: string): boolean {
    return this.ActiveActor.CombatController.CustomStatuses.some(
      s => s.status.Attribute === attribute
    )
  }

  public get InCascade(): boolean {
    return this.HasCustomStatus('In Cascade')
  }

  public RemoveCustomStatus(attribute: string): void {
    const existingIndex = this.ActiveActor.CombatController.CustomStatuses.findIndex(
      s => s.status.Attribute === attribute
    )
    if (existingIndex !== -1) {
      this.ActiveActor.CombatController.CustomStatuses.splice(existingIndex, 1)
    }
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
    return this.Statuses.filter(s => s.expires.HasExpired(currentRound, currentActorID, this.Turn))
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
    if (ae.AddSpecial.length) apply.status = ae.AddStatus.map(x => x.Status.ID)

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
        expires: new expiration('end_turn_self', this.Parent.CombatController, this, encounter),
      })
      this.log('Brace ended; entered Brace Cooldown period')
      this.CombatActions = {
        Protocol: false,
        Full: false,
        Quick1: true,
        Quick2: false,
        Overcharge: false,
        Reaction: false,
      }
    } else {
      this.StatController.setCurrentStat(StatKey.SPEED, this.StatController.getMax(StatKey.SPEED))
      this.CombatActions = {
        Protocol: true,
        Full: true,
        Quick1: true,
        Quick2: true,
        Overcharge: true,
        Reaction: true,
      }
    }
    this.StatController.setCurrentStat(
      StatKey.ACTIVATIONS,
      this.StatController.getMax(StatKey.ACTIVATIONS)
    )
    this._usedActions = []
    const equipment = this.AllEquipment
    equipment.forEach(eq => {
      if (!eq.IsReloading) return
      if (eq.Recharge < 0) return
      eq.IsUsed = false
    })

    const newEffects: TimedEffect[] = []

    if (this.StatController.getCurrent(StatKey.BURN) > 0) {
      newEffects.push(
        new TimedEffect({
          name: 'Burn Damage',
          detail: `Take ${this.StatController.getCurrent(StatKey.BURN)} burn damage at the start of this round.`,
          round: this.Round + 1,
          apply: {
            damage: [
              { type: DamageType.AppliedBurn, value: this.StatController.getCurrent(StatKey.BURN) },
            ],
          },
        })
      )
    }

    const statusExpires = this.Statuses.filter(s =>
      s.expires.HasExpired(this.Round, this.Parent.ID, this.Turn)
    )

    const specialStatusExpires = this.CustomStatuses.filter(s =>
      s.expires.HasExpired(this.Round, this.Parent.ID, this.Turn)
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
    this._usedActions = []
    this.AllEquipment.forEach(eq => {
      if (!eq.IsReloading) return
      if (eq.Recharge < 0) return
      eq.IsUsed = false
    })
    if (this.Parent instanceof Pilot) {
      if (this.Parent.ActiveMech) this.Parent.ActiveMech.CombatController.Reset()
    }
  }

  public Reload(): void {
    this.AllEquipment.forEach(eq => {
      if (eq.IsReloading) eq.IsUsed = false
    })
  }

  public StartSelfDestruct(): void {
    if (this.IsInSelfDestruct) return
    this.IsInSelfDestruct = true
    this.TimedEffects.push(
      markRaw(
        new TimedEffect({
          name: 'Self Destruct',
          detail: `This mech will explode as though it suffered a reactor meltdown. The explosion will annihilate this mech, killing everyone inside and dealing 4d6 explosive damage to all targets in a burst 2 area around it.`,
          round: this.Round + 3,
          apply: { other: 'self_destruct' },
        })
      )
    )
    this.log('Self Destruct sequence initiated!')
  }

  public CommitSelfDestruct(): void {
    this.StatController.setCurrentStat(StatKey.STRUCTURE, 0)
    this.StatController.setCurrentStat(StatKey.HP, 0)
    this.StatController.setCurrentStat(StatKey.HEATCAP, 0)
    this.StatController.setCurrentStat(StatKey.STRESS, 0)
    this.ReactorDestroyed = true
    this.IsInSelfDestruct = false
    if (this.Mounted && this.Parent instanceof Mech) {
      const pilot = this.Parent.Parent
      pilot.CombatController.Kill()
    }
    this.log('Mech has self-destructed!')
  }

  public Kill(): void {
    this.StatController.setCurrentStat(StatKey.HP, 0)
    this.IsDead = true
    this.log('Pilot registered as KIA')
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
      expires: s.expires.Raw,
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
    target.action = controller.Action

    target.usedActions = controller._usedActions

    target.timed_effects = controller.TimedEffects.map(te => TimedEffect.Serialize(te))

    StatController.Serialize(controller, target.stats)
    CounterController.Serialize(controller, target.counters)
  }

  public static Deserialize(controller: CombatController, data: CombatData) {
    if (!controller.StatController)
      throw new Error(
        `StatController not found on CombatController. New StatControllers must be instantiated in the CombatController's constructor method.`
      )

    controller.Resistances = data?.resistances || []
    controller.Statuses = (data?.statuses || [])
      .map(s => ({
        status: CompendiumStore().Statuses.find(st => st.ID === s.status),
        expires: expiration.Deserialize(s.expires),
      }))
      .filter(s => s.status != null) as { status: Status; expires: expiration }[]
    controller.CustomStatuses = (data?.customStatuses || []).map(s => ({
      status: EffectSpecial.Deserialize(s.status),
      expires: expiration.Deserialize(s.expires),
    }))

    controller.Cover = data?.cover || CoverType.None
    controller.Mounted = data?.mounted || true
    controller.Overwatch = data?.overwatch || false
    controller.Braced = data?.braced || false
    controller.Prepared = data?.prepared || false
    controller.CorePower = data?.corePower !== undefined ? data.corePower : true
    controller.CoreActive = data?.coreActive || false
    controller.AIControl = data?.aiControl || false

    controller.IsInSelfDestruct = data?.isInSelfDestruct || false
    controller.ReactorDestroyed = data?.reactorDestroyed || false
    controller.IsDead = data?.isDead || false

    if (data?.combatActions) controller.CombatActions = data.combatActions

    controller._usedActions = data?.usedActions || []

    controller.CombatLog.History = data?.combat_history || []

    controller.Round = data?.round || 1
    controller.Turn = data?.turn || 1
    controller.Action = data?.action || 1

    controller.TimedEffects = (data?.timed_effects || []).map(te => TimedEffect.Deserialize(te))

    StatController.Deserialize(controller, data?.stats || {})
    CounterController.Deserialize(controller, data?.counters || {})
  }

  public get MeltdownAction() {
    return new Action({
      id: 'self_destruct_internal',
      name: 'Deal Meltdown Damage',
      activation: ActivationType.Free,
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

export { CombatController }
export type { CombatData, CoverType }
