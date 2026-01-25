import { D20RollResult } from '@/class'
import { CombatantData } from '@/classes/encounter/Encounter'
import { ActiveEffect } from '../ActiveEffect'
import { ActiveEffectEvent } from '../ActiveEffectEvent'

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
  public SaveRollResult?: number // after roll
  private _saveRolledValue?: number // save roll
  public SaveType?: string // hase

  // etc
  public Grit: number = 0
  public SavedHalf: boolean = false // did they save half damage

  constructor(event: ActiveEffectEvent, combatant: CombatantData, effect: ActiveEffect) {
    this.Event = event
    this.Combatant = combatant
    this.AttackType = event.Attack

    if (effect.Save) {
      this.SaveType = event.Save
      this.SaveTarget = this.Event.Initiator.actor.CombatController.SaveTarget
      this.SaveBonus = this._combatant.actor.CombatController.getSavingThrowBonus(
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
}

export { ActiveEventTarget }
