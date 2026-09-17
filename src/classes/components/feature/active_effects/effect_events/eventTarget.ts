import { D20RollResult } from '../../../../dice/DiceRoller'
import { CombatantData } from '@/classes/encounter/Encounter'
import { ActiveEffect } from '../ActiveEffect'
import { ActiveEffectEvent } from '../ActiveEffectEvent'
import { DamageEvent } from './damageEvent'
import { StatusEvent } from './statusEvent'
import { OtherEvent } from './otherEvent'
import { SpecialEvent } from './specialEvent'
import { ResistEvent } from './resistEvent'
import { EffectSpecial } from '../effect_subtype/EffectSpecial'
import { CoverType } from '@/classes/components/combat/CombatController'
import {
  hitResultFor,
  canCrit,
  heatExempt,
  applyAttackDamage,
  attackModifiers,
} from '@/classes/components/combat/flows/WeaponAttackFlow'
import {
  resolveTargetRoll,
  resolveTargetDefense,
} from '@/classes/components/combat/flows/TargetResolutionFlow'
export { canCrit }

class ActiveEventTarget {
  public Event: ActiveEffectEvent
  private _combatant!: CombatantData | null

  public TargetDefense?: string
  public TargetDefenseValue?: number
  public AttackRollString?: string
  public AttackRollResult?: D20RollResult
  private _attackRolledValue?: number
  public AttackAccuracy: number = 0
  public AttackBonus: number = 0
  public AttackType?: 'melee' | 'ranged' | 'tech'

  public FinalDamageValue: number = 0
  public TotalArmorReduction: number = 0
  public TookDamage: boolean = false
  public MissedFromInvisibility: boolean = false
  public HitResultOverride?: 'hit' | 'miss'

  public ConsumingLockOn: boolean = false

  public SaveTarget: number = 10
  public SaveBonus: number = 0
  public SaveRollString?: string
  public SaveRollResult?: D20RollResult
  private _saveRolledValue?: number
  public SaveType?: string

  public Grit: number = 0
  public SavedHalf: boolean = false

  public ConfirmedKill: boolean = false

  constructor(event: ActiveEffectEvent, combatant: CombatantData | null, effect: ActiveEffect) {
    this.Event = event
    this.AttackType = event.Attack
    this.Combatant = combatant
    this.AttackAccuracy = event.Accuracy || 0
    this.AttackBonus = event.AttackBonus || 0
    this.SaveTarget = this.Event.Initiator.actor.CombatController.SaveTarget

    if (effect.Save) {
      this.SaveType = event.Save
      this.SaveBonus = 0
      this.SaveRollString = `1d20+${this.SaveBonus}`
    }
  }

  public get Combatant(): CombatantData | null {
    return this._combatant
  }

  public set Combatant(value: CombatantData | null) {
    this._combatant = value
    resolveTargetDefense(this, this.Event)
  }

  public get AttackRolledValue(): number | undefined {
    return this._attackRolledValue
  }

  public set AttackRolledValue(value: number | undefined) {
    this._attackRolledValue = value
    resolveTargetRoll({ target: this, event: this.Event, kind: 'attack' })
  }

  public get StatusAccuracy(): number {
    return attackModifiers(
      this.Event.Initiator?.actor?.CombatController,
      this.Combatant?.actor?.CombatController,
      this.AttackType
    )
  }

  public get HitResult(): string {
    if (this.MissedFromInvisibility) return 'miss'
    if (this.HitResultOverride === 'miss') return 'miss'
    if (this.HitResultOverride === 'hit')
      return (this.AttackRolledValue ?? 0) >= 20 ? 'crit' : 'hit'
    return hitResultFor(this.AttackRolledValue, this.TargetDefenseValue)
  }

  public OverrideHitResult(value: 'hit' | 'miss' | undefined): void {
    this.HitResultOverride = value
  }

  public get SaveRolledValue(): number | undefined {
    return this._saveRolledValue
  }

  public set SaveRolledValue(value: number | undefined) {
    this._saveRolledValue = value
    resolveTargetRoll({ target: this, event: this.Event, kind: 'save' })
  }

  public get SaveResult(): string {
    if (this.SaveRolledValue === undefined) return ''
    if (this.SaveRolledValue >= this.SaveTarget) return 'success'
    return 'failure'
  }

  public get IsExposed(): boolean {
    return this.Combatant?.actor.CombatController.HasStatus('exposed') || false
  }

  public get IsShredded(): boolean {
    return this.Combatant?.actor.CombatController.HasStatus('shredded') || false
  }

  public Resistance(damageType: string): string {
    return this.Combatant?.actor.CombatController.GetResistance(damageType) || 'none'
  }

  public DamageModSummary(damageType: string, isAp: boolean, isIrreducible: boolean): string {
    let str = ''
    if (!isIrreducible && this.Resistance(damageType) === 'immunity')
      return `No Damage (target Immune) `
    if (this.IsExposed) str += 'x2 (target Exposed) '
    if (this.Resistance(damageType) === 'vulnerable') str += 'x2 (target Vulnerable) '
    if (isIrreducible) return `${str} (Irreducible)`
    const armor = this.Combatant?.actor.CombatController.StatController.getCurrent('armor') || 0
    if (armor && !['heat', 'burn'].includes(damageType.toLowerCase())) {
      if (isAp) str += `- 0 (target Armor ignored) `
      else if (this.IsShredded) str += `- 0 (target Shredded) `
      else str += `- ${armor} (target Armor) `
    }
    if (this.Resistance(damageType) === 'resistance') str += '/2 (target Resistance) '
    return str.trim()
  }

  public get HeatExempt(): boolean {
    return heatExempt(this.Event.Attack, this.Event.Initiator, this.Combatant)
  }

  public ApplyDamage(damageEvent: DamageEvent) {
    applyAttackDamage(this, damageEvent, this.Event)
  }

  public ApplyStatus(statusEvent: StatusEvent) {
    if (!this.Combatant) return
    const initiator = this.Event.Initiator?.actor?.CombatController
    const selfInflicted =
      !!initiator && initiator.RootActor?.ID === this.Combatant.actor.CombatController.RootActor?.ID
    this.Combatant.actor.CombatController.AddStatus(statusEvent.Status.ID, statusEvent.Duration, {
      selfInflicted,
    })
  }

  public ApplyOther(otherEvent: OtherEvent) {
    if (!this.Combatant) return
    switch (otherEvent.Type) {
      case 'cover':
        this.Combatant.actor.CombatController.Cover = otherEvent.Value as CoverType
        break
      default:
        this.Combatant.actor.CombatController.StatController.setCurrentStat(
          otherEvent.Type,
          (this.Combatant.actor.CombatController.StatController.getCurrent(otherEvent.Type) || 0) +
            (otherEvent.Value as number)
        )
        break
    }
  }

  public ApplySpecial(specialEvent: SpecialEvent) {
    if (!this.Combatant) return
    this.Combatant.actor.CombatController.ActiveActor.CombatController.SetCustomStatus(
      new EffectSpecial({
        attribute: specialEvent.Attribute,
        detail: specialEvent.Detail,
        duration: specialEvent.Duration,
      }),
      specialEvent.Duration
    )
  }

  public ApplyResist(resistEvent: ResistEvent) {
    if (!this.Combatant) return
    this.Combatant.actor.CombatController.SetResistance(resistEvent.ResistType, resistEvent.Resist)
  }

  public RemoveSpecialStatus(special: string) {
    if (!this.Combatant) return
    this.Combatant.actor.CombatController.RemoveCustomStatus(special)
  }

  public ToJSON() {
    return {
      CombatantName: this.Combatant?.Label || 'Unknown Target',
      CombatantType: this.Combatant?.actor.ItemType || 'Unknown Target',
      CombatantId: this.Combatant?.actor.ID || 'Unknown Target',
      TargetDefense: this.TargetDefense,
      TargetDefenseValue: this.TargetDefenseValue,
      AttackType: this.AttackType,
      AttackRollString: this.AttackRollString,
      AttackRollResult: this.AttackRollResult?.toJSON(),
      AttackRolledValue: this.AttackRolledValue,
      HitResult: this.HitResult,
      HitResultOverride: this.HitResultOverride,
      FinalDamageValue: this.FinalDamageValue,
      TotalArmorReduction: this.TotalArmorReduction,
      SaveResult: this.SaveResult,
      SaveTarget: this.SaveTarget,
      SaveBonus: this.SaveBonus,
      SaveRollString: this.SaveRollString,
      SaveRollResult: this.SaveRollResult?.toJSON(),
      SaveRolledValue: this.SaveRolledValue,
      SaveType: this.SaveType,
      SavedHalf: this.SavedHalf,
    }
  }
}

export { ActiveEventTarget }
