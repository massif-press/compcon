import { v4 as uuid } from 'uuid'

import { ActiveEffect } from './ActiveEffect'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { CombatantData } from '@/classes/encounter/Encounter'
import { Damage, MechWeapon } from '@/class'

import { DamageEvent } from './effect_events/damageEvent'
import { ActiveEventTarget } from './effect_events/eventTarget'
import { ResistEvent } from './effect_events/resistEvent'
import { StatusEvent } from './effect_events/statusEvent'
import { OtherEvent } from './effect_events/otherEvent'
import { SpecialEvent } from './effect_events/specialEvent'
import { ActionSummary } from './EffectActionSummary'

class ActiveEffectEvent {
  public ID: string
  public Initiator: CombatantData
  public Effect: ActiveEffect
  public EncounterInstance: EncounterInstance
  public DamageEvents: DamageEvent[] = []
  public StatusEvents: StatusEvent[] = []
  public OtherEvents: OtherEvent[] = []
  public SpecialEvents: SpecialEvent[] = []
  public ResistEvents: ResistEvent[] = []
  private _targets: ActiveEventTarget[] = []
  private _aoe: boolean = false
  public Attack?: 'melee' | 'ranged' | 'tech'
  public Save?: 'hull' | 'agi' | 'sys' | 'eng'
  public SaveHalf?: boolean
  public RemoveSpecialStatus?: string[]
  public Staged: boolean = false

  public Accuracy: number = 0

  constructor(initiator: CombatantData, effect: ActiveEffect, instance: EncounterInstance) {
    this.ID = uuid()
    this.Initiator = initiator
    this.Effect = effect
    this.Attack = effect.Attack
    this.EncounterInstance = instance
    if (this.TargetType === 'self')
      this._targets = [new ActiveEventTarget(this, this.Initiator, effect)]
    else this._targets = [null as unknown as ActiveEventTarget] // placeholder for single target
    this._aoe = effect.IsAoE

    this.Accuracy = effect.Accuracy || 0

    this.RemoveSpecialStatus = effect.RemoveSpecial

    if (effect.Save) {
      this.Save = effect.Save.Stat
    }

    if (effect.Damage) this.DamageEvents = effect.Damage.map(d => new DamageEvent(d))
    if (this.DamageEvents[0]) {
      this.SaveHalf = effect.Damage[0].SaveHalf
      this.Save = effect.Damage[0].Save?.Stat
    }

    // TODO: associate bonus damage with item damage data
    if (effect.BonusDamage && this.DamageEvents[0] && this.DamageEvents[0].BonusDamageEvent) {
      this.DamageEvents[0].BonusDamageEvent.DamageRollString = String(effect.BonusDamage.Value)
    }

    if (effect.AddStatus?.length) {
      this.StatusEvents = effect.AddStatus.map(s => new StatusEvent(s))
      this.Save = effect.AddStatus[0].Save?.Stat
    }

    if (effect.AddSpecial?.length) {
      this.SpecialEvents = effect.AddSpecial.map(s => new SpecialEvent(s))
      this.Save = effect.AddSpecial[0].Save?.Stat
    }

    if (effect.AddOther?.length) {
      this.OtherEvents = effect.AddOther.map(o => new OtherEvent(o))
      this.Save = effect.AddOther[0].Save?.Stat
    }

    if (effect.AddResist?.length) {
      this.ResistEvents = effect.AddResist.map(r => new ResistEvent(r))
      this.Save = effect.AddResist[0].Save?.Stat
    }
  }

  private get _allEvents(): (
    | DamageEvent
    | StatusEvent
    | OtherEvent
    | SpecialEvent
    | ResistEvent
  )[] {
    return [
      ...this.DamageEvents,
      ...this.StatusEvents,
      ...this.OtherEvents,
      ...this.SpecialEvents,
      ...this.ResistEvents,
    ]
  }

  public get IsPassive(): boolean {
    return !this._allEvents.length
  }

  public SetCrit() {
    if (this.AoE) return
    if (this.DamageEvents.length) {
      this.DamageEvents[0].IsCrit = true
      // clear damage if rollable damage rolled without crit
      if (this.DamageEvents[0].DamageRollString.includes('d'))
        this.DamageEvents[0].DamageRolledValue = undefined
    }
  }

  public get Grit(): number {
    return this.Initiator.actor.CombatController.RootActor.StatController.MaxStats['grit'] || 0
  }

  public get Targets(): ActiveEventTarget[] {
    return this._targets
  }

  public set Targets(val: ActiveEventTarget[]) {
    this._targets = val
  }

  public SetTarget(target: CombatantData, index: number) {
    this._targets[index] = new ActiveEventTarget(this, target, this.Effect)
  }

  // add a new target slot
  public AddTarget() {
    this._targets.push(null as unknown as ActiveEventTarget)
  }

  public RemoveTarget(index: number) {
    if (this._targets.length === 1) {
      this._targets[index] = null as unknown as ActiveEventTarget
    } else {
      this._targets.splice(index, 1)
    }
  }

  public get AvailableTargets(): CombatantData[] {
    const availableTargets = this.EncounterInstance.getTargetsSorted(
      this.TargetType,
      this.Initiator.side,
      this.Initiator.id
    )

    return availableTargets.filter(x => !this._targets.some(y => y && y.Combatant.id === x.id))
  }

  public get AttackStat() {
    switch (this.Attack) {
      case 'melee':
        return 'Evasion'
      case 'ranged':
        return 'Evasion'
      case 'tech':
        return 'E-Defense'
      default:
        return ''
    }
  }

  public get AoE(): boolean {
    return this._aoe
  }

  public set AoE(val: boolean) {
    if (!val && this._targets.length > 1) {
      this._targets = [this._targets[0]]
    }
    this._aoe = val
  }

  public get AoeIcon(): string {
    let aoe = this.AoE
    if (!aoe) {
      return 'cc:range'
    }
    const aoeType = this.Effect.Range[0]?.Type || 'generic'
    return Damage.getAoeIcon(aoeType)
  }

  public get TargetType(): 'ally' | 'enemy' | 'self' {
    let out = 'enemy' as 'ally' | 'enemy' | 'self' | 'any'
    if (this.Effect.AddStatus && this.Effect.AddStatus.length) {
      out = this.Effect.AddStatus[0].Target
    }
    if (this.Effect.AddOther && this.Effect.AddOther.length) {
      out = this.Effect.AddOther[0].Target
    }
    if (out === 'any') out = 'enemy'
    return out
  }

  public get Ready(): boolean {
    if (this.IsPassive) return true
    let ready = true
    if (!this._targets || !this._targets.length || !this._targets[0]) return false
    ready = this._targets.every(t => !!t)
    if (this.Save || this.Attack)
      ready =
        this._targets.every(t => (t.AttackRolledValue || t.SaveRolledValue) !== undefined) && ready
    ready = this.DamageEvents.every(d => !!d.DamageRolledValue) && ready

    return ready
  }

  public get Summary(): string {
    return new ActionSummary(ActionSummary.fromActiveEffectEvent(this)).Summarize(
      this.Initiator.actor.ID
    )
  }

  public get ShortSummary(): string {
    return new ActionSummary(ActionSummary.fromActiveEffectEvent(this)).Summarize(
      this.Initiator.actor.ID
    )
  }

  public Apply(target: ActiveEventTarget) {
    this.DamageEvents.forEach(de => {
      target.ApplyDamage(de)
    })
    this.StatusEvents.forEach(se => {
      target.ApplyStatus(se)
    })
    this.OtherEvents.forEach(oe => {
      target.ApplyOther(oe)
    })
    this.SpecialEvents.forEach(spe => {
      target.ApplySpecial(spe)
    })
    this.ResistEvents.forEach(re => {
      target.ApplyResist(re)
    })
    this.RemoveSpecialStatus?.forEach(status => {
      target.RemoveSpecialStatus(status)
    })
    // target.Combatant.actor.CombatController.AddLogEvent(this.EncounterInstance.Round, this.Summary)
    this.Initiator.actor.CombatController.RootActor.CombatController.LogEventAction()
    // this.EncounterInstance.AddLogEvent()
  }

  public ApplyAll() {
    this.Targets.forEach(t => {
      if (!t) return
      this.DamageEvents.forEach(de => {
        t.ApplyDamage(de)
      })
      this.StatusEvents.forEach(se => {
        t.ApplyStatus(se)
      })
      this.OtherEvents.forEach(oe => {
        t.ApplyOther(oe)
      })
      this.SpecialEvents.forEach(spe => {
        t.ApplySpecial(spe)
      })
      this.ResistEvents.forEach(re => {
        t.ApplyResist(re)
      })
      this.RemoveSpecialStatus?.forEach(status => {
        t.RemoveSpecialStatus(status)
      })
      if (
        t.Combatant.actor.CombatController.RootActor.ID !==
        this.Initiator.actor.CombatController.RootActor.ID
      )
        t.Combatant.actor.CombatController.CombatLog.LogAction(
          ActionSummary.fromActiveEffectEvent(this)
        )
    })
    this.Initiator.actor.CombatController.CombatLog.LogAction(
      ActionSummary.fromActiveEffectEvent(this)
    )
    // this.EncounterInstance.AddLogEvent(ActionSummary.fromActiveEffectEvent(this))
  }
}

export { ActiveEffectEvent }
