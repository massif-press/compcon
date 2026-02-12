import { D20RollResult, DamageType } from '@/class'
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
import { ActionSummaryData } from '../EffectActionSummary'

// this should include everything that can happen to a target, and components manage
// what is shown/not shown based on the effect data
class ActiveEventTarget {
  public Event: ActiveEffectEvent
  private _combatant!: CombatantData

  // attack roll
  public TargetDefense?: string // eg. evasion, agility, etc
  public TargetDefenseValue?: number
  public AttackRollString?: string // dice string
  public AttackRollResult?: D20RollResult // after roll
  private _attackRolledValue?: number // save roll
  public AttackAccuracy: number = 0 // accuracy bonus
  public AttackType?: 'melee' | 'ranged' | 'tech'

  // damage info
  public FinalDamageValue: number = 0
  public TotalArmorReduction: number = 0

  // save roll
  public SaveTarget: number = 10
  public SaveBonus: number = 0
  public SaveRollString?: string // dice string
  public SaveRollResult?: D20RollResult // after roll
  private _saveRolledValue?: number // save roll
  public SaveType?: string // hase

  // etc
  public Grit: number = 0
  public SavedHalf: boolean = false // did they save half damage

  constructor(event: ActiveEffectEvent, combatant: CombatantData, effect: ActiveEffect) {
    this.Event = event
    this.Combatant = combatant
    this.AttackType = event.Attack
    this.AttackAccuracy = event.Accuracy || 0

    if (effect.Save) {
      this.SaveType = event.Save
      this.SaveTarget = this.Event.Initiator.actor.CombatController.SaveTarget
      this.SaveBonus = this._combatant.actor.CombatController.GetSavingThrowBonus(
        effect.Save[0].Stat
      )
      this.SaveRollString = `1d20+${this.SaveBonus}`
    }
  }

  public get Combatant(): CombatantData {
    return this._combatant
  }

  public set Combatant(value: CombatantData) {
    this._combatant = value

    // if this is attack roll:
    switch (this.AttackType) {
      case 'tech':
        this.TargetDefense = 'E-Defense'
        this.TargetDefenseValue =
          this._combatant.actor.CombatController.ActiveActor.StatController.CurrentStats['edef']
      default:
        this.TargetDefense = 'Evasion'
        this.TargetDefenseValue =
          this._combatant.actor.CombatController.ActiveActor.StatController.CurrentStats['evasion']
        break
    }
  }

  public get AttackRolledValue(): number | undefined {
    return this._attackRolledValue
  }

  public set AttackRolledValue(value: number | undefined) {
    this._attackRolledValue = value
    if (this.Event.SaveHalf) this.SavedHalf = this.HitResult !== 'miss'
    if (value && value >= 20 && this.Event.Effect.CanCrit) this.Event.SetCrit()
  }

  public get HitResult(): string {
    if (this.AttackRolledValue === undefined || !this.TargetDefenseValue) return ''
    if (this.AttackRolledValue >= 20) return 'crit'
    if (this.AttackRolledValue >= this.TargetDefenseValue) return 'hit'
    return 'miss'
  }

  public get SaveRolledValue(): number | undefined {
    return this._saveRolledValue
  }

  public set SaveRolledValue(value: number | undefined) {
    this._saveRolledValue = value
    if (this.Event.SaveHalf) this.SavedHalf = this.SaveResult === 'success'
  }

  public get SaveResult(): string {
    if (this.SaveRolledValue === undefined) return ''
    if (this.SaveRolledValue >= this.SaveTarget) return 'success'
    return 'failure'
  }

  public get IsExposed(): boolean {
    return this.Combatant.actor.CombatController.HasStatus('exposed')
  }

  public get IsShredded(): boolean {
    return this.Combatant.actor.CombatController.HasStatus('shredded')
  }

  public Resistance(damageType: string): string {
    return this.Combatant.actor.CombatController.GetResistance(damageType)
  }

  public DamageModSummary(damageType: string, isAp: boolean, isIrreducible: boolean): string {
    let str = ''
    if (!isIrreducible && this.Resistance(damageType) === 'immunity')
      return `No Damage (target Immune) `
    if (this.IsExposed) str += 'x2 (target Exposed) '
    if (this.Resistance(damageType) === 'vulnerable') str += 'x2 (target Vulnerable) '
    if (isIrreducible) return `${str} (Irreducible)`
    const armor = this.Combatant.actor.CombatController.StatController.CurrentStats['armor'] || 0
    if (armor && !['heat', 'burn'].includes(damageType.toLowerCase())) {
      if (isAp) str += `- 0 (target Armor ignored) `
      else if (this.IsShredded) str += `- 0 (target Shredded) `
      else str += `- ${armor} (target Armor) `
    }
    if (this.Resistance(damageType) === 'resistance') str += '/2 (target Resistance) '
    return str.trim()
  }

  public ApplyDamage(damageEvent: DamageEvent) {
    damageEvent.CalcFinalDamage(this.Event, this)
    if (this.FinalDamageValue > 0)
      this.Combatant.actor.CombatController.ApplyDamage(
        damageEvent.DamageType,
        this.FinalDamageValue
      )
    this.Event.Initiator.actor.CombatController.RootActor.CombatController.CombatLog.DealDamage(
      this.FinalDamageValue,
      damageEvent.DamageType
    )
  }

  public ApplyStatus(statusEvent: StatusEvent) {
    this.Combatant.actor.CombatController.SetStatus(statusEvent.Status, statusEvent.Duration)
  }

  public ApplyOther(otherEvent: OtherEvent) {
    switch (otherEvent.Type) {
      case 'cover':
        this.Combatant.actor.CombatController.Cover = otherEvent.Value as CoverType
        break
      default:
        this.Combatant.actor.CombatController.StatController.CurrentStats[otherEvent.Type] +=
          otherEvent.Value as number
        break
    }
  }

  public ApplySpecial(specialEvent: SpecialEvent) {
    this.Combatant.actor.CombatController.SetCustomStatus(
      new EffectSpecial({
        attribute: specialEvent.Attribute,
        detail: specialEvent.Detail,
        duration: specialEvent.Duration,
      }),
      specialEvent.Duration
    )
  }

  public ApplyResist(resistEvent: ResistEvent) {
    this.Combatant.actor.CombatController.SetResistance(resistEvent.ResistType, resistEvent.Resist)
  }

  public RemoveSpecialStatus(special: string) {
    this.Combatant.actor.CombatController.RemoveCustomStatus(special)
  }

  public static IncomingActionSummary(event: ActionSummaryData): string {
    let str = ''
    console.log(event)
    str += `Incoming from ${event.initiatorName}: ${event.effectName} // `
    event.damageEvents.flat().forEach(de => {
      str += `${de.finalDamageValue} ${de.damageType} Damage`
    })
    event.statusEvents.flat().forEach(se => {
      str += `Apply Status ${se.statusName} for ${se.duration}`
    })
    event.otherEvents.flat().forEach(oe => {
      str += `Apply Effect ${oe.type} ${oe.value}`
    })
    event.specialEvents.flat().forEach(spe => {
      str += `Apply Special Status ${spe.attribute} for ${spe.duration}`
    })
    event.resistEvents.flat().forEach(re => {
      str += `Set ${re.resistType} to ${re.resist}`
    })
    return str.trim()
  }

  public ToJSON() {
    return {
      CombatantName: this.Combatant.actor.CombatController.CombatName,
      CombatantType: this.Combatant.actor.ItemType,
      CombatantId: this.Combatant.actor.ID,
      TargetDefense: this.TargetDefense,
      TargetDefenseValue: this.TargetDefenseValue,
      AttackType: this.AttackType,
      AttackRollString: this.AttackRollString,
      AttackRollResult: this.AttackRollResult?.toJSON(),
      AttackRolledValue: this.AttackRolledValue,
      HitResult: this.HitResult,
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
