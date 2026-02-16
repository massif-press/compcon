import { ActivationType, Counter, DamageType, DiceRoller, Mech, Pilot, Rules } from '@/class'
import { ICombatant } from './ICombatant'
import { IStatData, StatController } from './stats/StatController'
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
import _ from 'lodash'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import {
  EffectSpecial,
  IEffectSpecialData,
} from '../feature/active_effects/effect_subtype/EffectSpecial'
import { Action } from '@/classes/Action'
import { Bonus } from '../feature/bonus/Bonus'
import { CompendiumStore } from '@/stores'
import { expiration } from './Expiration'
import { CombatLogEntry, CombatLog } from './CombatLog'

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

  history: CombatLogEntry[] = []
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
    this.CombatLog = new CombatLog(this.RootActor)
  }

  // passthroughs ------------------------------------
  public get SaveController(): SaveController {
    return this.Parent.SaveController
  }

  public get Grit(): number {
    return this.RootActor.Grit || 0
  }

  public AllActions(activation: ActivationType): Action[] {
    const arr = this.Parent.FeatureController.Actions.filter(a => a.Activation === activation)
    if (this.Parent instanceof Pilot) return arr.filter(x => x.IsPilotAction)
    return arr
  }

  public get AllSynergies(): any[] {
    return this.Parent.FeatureController.Synergies
  }

  public get AllEquipment(): any[] {
    if (this.Parent instanceof Mech)
      return this.Parent.MechLoadoutController.ActiveLoadout.Equipment
    if (this.Parent instanceof Pilot) return this.Parent.PilotLoadoutController.ActiveLoadout.Items
    if ((this.Parent as any).NpcFeatureController)
      return (this.Parent as any).NpcFeatureController.Features
    return []
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

  private log(str: string): void {
    this.CombatLog.LogSimpleEvent(str)
  }
  // ------------------------------------------------------
  public get Activations(): number {
    return this.StatController.getStat('activations')
  }

  public get ActiveEffects(): ActiveEffect[] {
    return this.Parent.FeatureController?.ActiveEffects || []
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
    this.StatController.CurrentStats['activations']--
    if (this.StatController.CurrentStats['activations'] < 0) {
      this.Reset()
      this.Turn++
      this.CombatLog.AddTurn()
      this.CombatLog.LogSimpleEvent(
        `Turn complete. ${this.StatController.CurrentStats['activations']} turns remaining this round.`
      )
    }
  }

  public get HasRemainingActions(): boolean {
    // ignore overcharge and reaction for this check
    return this.CanActivate('protocol') || this.CanActivate('full') || this.CanActivate('quick')
  }

  public SortedActiveEffects(sort: string, dir: 'asc' | 'desc'): ActiveEffect[] {
    let effects = [...this.ActiveEffects]
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
    return this.StatController.CurrentStats.saveTarget
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
          this.StatController.CurrentStats['speed'] >= this.StatController.MaxStats['speed']
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
        return this.StatController.CurrentStats['speed'] > 0
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

  public setStats(statArr: { key: string; val: number }[], encounter?: EncounterInstance): void {
    statArr.forEach(kvp => {
      this.StatController.setMax(kvp.key, kvp.val)
    })

    this.StatController.resetCurrentStats()
  }

  public SetBonusStats(encounter): void {
    this.Bonuses.forEach(bonus => {
      let statId = bonus.ID
      if (typeof bonus.Value !== 'number') {
        console.info('Non-numeric bonus value detected:', bonus.Value)
        return
      }

      let value = Number(bonus.Value)
      if (bonus.PerPc) {
        if (encounter.Combatants.filter(c => c.type === 'pilot').length >= Number(bonus.Value)) {
          statId = bonus.ID.replace('_pct', '')
          value = 1
        }
      }

      this.StatController.setMax(statId, this.StatController.getStat(statId) + value)
    })
  }

  public SetResistance(type: string, condition?: string): void {
    condition = condition?.toLowerCase() || 'vulnerable'

    const existingIndex = this.ActiveActor.CombatController.Resistances.findIndex(
      s => s.type === type
    )
    if (existingIndex === -1) {
      this.ActiveActor.CombatController.Resistances.push({ type, condition })
      this.log(`Gained ${type} ${condition}`)
    } else if (condition) {
      this.ActiveActor.CombatController.Resistances[existingIndex].condition = condition
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
    return this.Statuses.some(s => s.status.ID === statusID)
  }

  public AddStatus(statusID: string, expires?: any): void {
    const status = CompendiumStore().Statuses.find(s => s.ID === statusID)
    if (!status) return
    const existingIndex = this.Statuses.findIndex(s => s.status.ID === status.ID)
    if (existingIndex === -1) {
      this.Statuses.push({ status, expires })
      this.log(`Gained ${status.Name}`)
    } else if (expires) {
      this.Statuses[existingIndex].expires = expires
    }
  }

  public ToggleStatus(status: Status, expires?: any): void {
    if (!status) return
    const existingIndex = this.Statuses.findIndex(s => s.status.ID === status.ID)
    if (existingIndex === -1) {
      this.Statuses.push({ status, expires })
      this.log(`Gained ${status.Name}`)
    } else {
      this.Statuses.splice(existingIndex, 1)
      this.log(`Lost ${status.Name}`)
    }
  }

  public get IsDestroyed(): boolean {
    return this.StatController.CurrentStats['structure'] <= 0
  }

  public get IsInDangerZone(): boolean {
    if (!this.StatController.MaxStats['heatcap']) return false
    return (
      this.StatController.CurrentStats['heatcap'] >=
      Math.ceil(this.StatController.MaxStats['heatcap'] / 2)
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
    return this.StatController.CurrentStats['overcharge'] || 0
  }

  public get OverchargeCost(): string | number {
    const track = (this.Parent as any).OverchargeTrack || Rules.Overcharge
    return track[this.OverchargeLevel]
  }

  public IncreaseOverchargeLevel(): void {
    if (this.OverchargeLevel < this.OverchargeTrack.length - 1) {
      this.StatController.CurrentStats['overcharge'] += 1
      this.log(
        `Increased overcharge to level ${this.OverchargeLevel} (${this.OverchargeCost} Heat)`
      )
    }
  }

  public getCheckBonus(type: 'Hull' | 'Agi' | 'Sys' | 'Eng'): number {
    if (this.Parent instanceof Pilot) {
      return this.Parent.ActiveMech![type]
    } else return this.StatController.MaxStats[type.toLowerCase()] || 0
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
    return this.ActiveActor.StatController.CurrentStats['armor'] || 0
  }

  public CalculateDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false,
    reliable = 0
  ): { total: number; resist: string[]; condition: string[] } {
    let out = { total: value, resist: [] as string[], condition: [] as string[] }

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
        out.total = Math.floor(out.total * 2)
        out.resist.push('vulnerable')
      } else if (!this.HasStatus('shredded') && resist.condition === 'resistance') {
        out.total = Math.floor(out.total / 2)
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

  public TakeDamage(
    type: DamageType,
    value: number,
    ap: boolean = false,
    irreducible = false
  ): void {
    if (this.SaveLock) return

    if (type === DamageType.Heat && !this.ActiveActor.StatController.MaxStats['stress']) {
      type = DamageType.Energy
    }

    let damage = this.CalculateDamage(type, value, ap, irreducible)

    this.ApplyDamage(type, damage.total)

    this.CombatLog.TakeDamage(value, type)
    this.CombatLog.ArmorReduced(this.CalculateArmorReduction(type, value, ap, irreducible))
    if (this.IsDestroyed) this.CombatLog.LoseMech()
  }

  public ApplyDamage(type: DamageType, value: number) {
    const target = this.ActiveActor.CombatController

    if (type === DamageType.Heat) {
      target.ApplyHeat(value)
    }
    if (type === DamageType.Burn) {
      target.StatController.CurrentStats['burn'] += value
    }

    // subtract this damage from current hp
    this.ActiveActor.StatController.CurrentStats['hp'] -= value
    this.log(`Took ${value} ${type} damage`)
    this.CombatLog.StatChange(-value, 'hp')

    // if hull goes below 0, subtract 1 from structure and add max hp back to current hp
    while (
      target.StatController.CurrentStats['hp'] <= 0 &&
      target.StatController.CurrentStats['structure'] > 0
    ) {
      target.StatController.CurrentStats['structure'] -= 1
      if (target.StatController.CurrentStats['structure'] >= 0)
        this.log(
          `Structure damaged! Remaining structure: ${target.StatController.CurrentStats['structure']}`
        )
      if (target.StatController.CurrentStats['structure'] > 0)
        this.CombatLog.StatChange(-1, 'structure')
      target.StatController.CurrentStats['hp'] += target.StatController.MaxStats['hp']
    }

    // if structure goes below 0, set to 0
    if (target.StatController.CurrentStats['structure'] < 0) {
      target.StatController.CurrentStats['structure'] = 0
    }
  }

  public ApplyHeat(value: number): void {
    let totalValue = value
    const target = this.ActiveActor.CombatController

    target.StatController.CurrentStats['heatcap'] += totalValue
    this.log(`Gained ${totalValue} Heat`)
    this.CombatLog.StatChange(value, 'heat')

    if (this.IsInDangerZone)
      this.log(`In Danger Zone! Current Heat: ${target.StatController.CurrentStats['heatcap']}`)

    // if heatcap goes above max, subtract 1 from stress and set heatcap to 0
    while (
      target.StatController.CurrentStats['heatcap'] > target.StatController.MaxStats['heatcap']
    ) {
      target.StatController.CurrentStats['stress'] -= 1
      if (target.StatController.CurrentStats['stress'] >= 0)
        this.log(
          `Reactor stressed! Remaining Reactor Stress: ${target.StatController.CurrentStats['stress']}`
        )
      if (target.StatController.CurrentStats['stress'] > 0) this.CombatLog.StatChange(-1, 'stress')
      target.StatController.CurrentStats['heatcap'] -= target.StatController.MaxStats['heatcap']
    }

    // if stress goes below 0, set to 0
    if (target.StatController.CurrentStats['stress'] < 0) {
      target.StatController.CurrentStats['stress'] = 0
    }

    if (target.StatController.CurrentStats['stress'] === 0) {
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
    if (!this.StatController.CurrentStats[stat]) this.StatController.CurrentStats[stat] = 0
    this.StatController.CurrentStats[stat] += osVal
    if (
      this.StatController.MaxStats[stat] &&
      this.StatController.CurrentStats[stat] > this.StatController.MaxStats[stat]
    ) {
      this.StatController.CurrentStats[stat] = this.StatController.MaxStats[stat]
    }
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
        this.StatController.CurrentStats['heatcap'] = 0
        this.RemoveStatus('exposed')
        this.log('Stabilized: Cleared Heat and removed Exposed status')
        break
      case 'repair':
        this.StatController.CurrentStats['hp'] = this.StatController.MaxStats['hp']
        this.StatController.CurrentStats['repcap'] -= 1
        this.log('Stabilized: Repaired to full HP')
        break
      case 'reload':
        this.Reload()
        this.log('Stabilized: Reloaded all equipment')
        break
      case 'clear_burn':
        this.StatController.CurrentStats['burn'] = 0
        this.log('Stabilized: Cleared Burn')
        break
      case 'npc':
        this.Reload()
        this.StatController.CurrentStats['heatcap'] = 0
        this.RemoveStatus('exposed')
        this.log('Stabilized')
        break
      case 'clear self':
      case 'clear ally':
        this.log(
          `Stabilized: Cleared negative status: ${action === 'clear self' ? 'self' : 'ally'}`
        )
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
    let apply = {} as ITimedEffectAction
    if (ae.AddResist.length)
      apply.resist = ae.AddResist.map(x => ({ type: x.Resist, value: x.ResistType }))
    if (ae.AddSpecial.length)
      apply.special = ae.AddSpecial.map(x => ({ attribute: x.Attribute, detail: x.Detail }))
    if (ae.AddSpecial.length) apply.status = ae.AddStatus.map(x => x.Status.ID)

    this.TimedEffects.push(
      new TimedEffect({
        name: ae.Name,
        origin: ae.Origin.Name,
        detail: ae.Detail,
        round: this.Round,
        apply,
      })
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
      this.StatController.CurrentStats['speed'] = this.StatController.MaxStats['speed']
      this.CombatActions = {
        Protocol: true,
        Full: true,
        Quick1: true,
        Quick2: true,
        Overcharge: true,
        Reaction: true,
      }
    }
    this.StatController.CurrentStats['activations'] = this.StatController.MaxStats['activations']
    this._usedActions = []
    this.AllEquipment.forEach(eq => {
      if (!eq.IsReloading) return
      if (eq.Recharge < 0) return
      eq.IsUsed = false
    })

    //create burn events
    if (this.StatController.CurrentStats['burn'] > 0) {
      this.TimedEffects.push(
        new TimedEffect({
          name: 'Burn Damage',
          detail: `Take ${this.StatController.CurrentStats['burn']} burn damage at the start of this round.`,
          round: this.Round + 1,
          apply: {
            damage: [
              { type: DamageType.AppliedBurn, value: this.StatController.CurrentStats['burn'] },
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
      this.TimedEffects.push(
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
      this.TimedEffects.push(
        new TimedEffect({
          name: `Special Status Expired`,
          detail: `${s.status.Attribute} special status has expired.`,
          round: this.Round,
          remove: { special: [{ attribute: s.status.Attribute, detail: s.status.Detail }] },
        })
      )
    })

    this.Round++
    this.CombatLog.EndRound()
    this.StartRound()
  }

  public Reset(): void {
    this.ResetCombatActions()
    this.StatController.CurrentStats['activations'] = this.StatController.MaxStats['activations']
    this.StatController.CurrentStats['speed'] = this.StatController.MaxStats['speed']
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
      new TimedEffect({
        name: 'Self Destruct',
        detail: `This mech will explode as though it suffered a reactor meltdown. The explosion will annihilate this mech, killing everyone inside and dealing 4d6 explosive damage to all targets in a burst 2 area around it.`,
        round: this.Round + 3,
        apply: { other: 'self_destruct' },
      })
    )
    this.log('Self Destruct sequence initiated!')
  }

  public CommitSelfDestruct(): void {
    this.StatController.CurrentStats['structure'] = 0
    this.StatController.CurrentStats['hp'] = 0
    this.StatController.CurrentStats['heatcap'] = 0
    this.StatController.CurrentStats['stress'] = 0
    this.ReactorDestroyed = true
    this.IsInSelfDestruct = false
    if (this.Mounted && this.Parent instanceof Mech) {
      const pilot = this.Parent.Parent
      pilot.CombatController.Kill()
    }
    this.log('Mech has self-destructed!')
  }

  public Kill(): void {
    this.StatController.CurrentStats['hp'] = 0
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

    target.history = controller.CombatLog.History
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
    controller.Statuses = (data?.statuses || []).map(s => ({
      status: CompendiumStore().Statuses.find(st => st.ID === s.status)!,
      expires: expiration.Deserialize(s.expires),
    }))
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

    controller.CombatLog.History = data?.history || []

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
