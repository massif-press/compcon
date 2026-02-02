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
    let ready = true
    if (!this._targets || !this._targets.length || !this._targets[0]) return false
    ready = this._targets.every(t => !!t)
    if (this.Save || this.Attack)
      ready =
        this._targets.every(t => (t.AttackRolledValue || t.SaveRolledValue) !== undefined) && ready
    ready = this.DamageEvents.every(d => !!d.DamageRolledValue) && ready

    return ready
  }

  public get Summary(): any {
    let str = ''
    if (!this.Ready) return 'Incomplete action'
    str += `${this.Initiator.actor.CombatController.CombatName} activates ${this.Effect.Name.toUpperCase()}`
    if ((this.Effect as any).Activation) str += ` as a ${(this.Effect as any).Activation} Action`
    str += `:\n`

    this.DamageEvents.forEach(de => {
      this.Targets.forEach(t => {
        str += `   - [${t.Combatant.actor.CombatController.CombatName}]`
        de.CalcFinalDamage(this, t)
        if (this.Attack) {
          switch (this.Attack && t.HitResult) {
            case 'crit':
              str += ` [Critical Hit!]\n`
              break
            case 'hit':
              str += ` [Hit]\n`
              break
            case 'miss':
              str += ` [Miss]\n`
              break
            default:
              break
          }
          if (t.AttackRolledValue || t.SaveRolledValue)
            str += ` (${t.AttackRolledValue || t.SaveRolledValue} vs ${t.TargetDefense} ${t.TargetDefenseValue}) `
          str += `[${t.Combatant.actor.CombatController.CombatName}] for ${de.Summary} - ${t.FinalDamageValue}`
        } else if (this.Save) {
          str += ` (${t.SaveRolledValue} vs ${this.Save?.toUpperCase() || ''} ${t.SaveTarget})`
          switch (t.SaveResult) {
            case 'success':
              str += ` [SAVED]`
              break
            default:
              str += ` [FAILED SAVE]`
              break
          }
          str += `\n     ${de.Summary}`
          if (t.SavedHalf) str += ` - ${Math.ceil((de.DamageRolledValue || 0) / 2)} (Save)`
          str += ` - ${t.TotalArmorReduction} (Armor)`
          str += ` // ${t.FinalDamageValue} ${de.DamageType} Damage Total`
        } else {
          str += ` for ${de.Summary} - ${t.FinalDamageValue} ${de.DamageType} Damage Total`
        }
        str += '\n'
      })
    })

    this.StatusEvents.forEach(se => {
      this.Targets.forEach(t => {
        switch (t.SaveResult) {
          case 'success':
            str += ` - Applies`
            break
          case 'failure':
            str += ` - Fails to apply`
            break
        }
        if (t.SaveType) str += ` (${t.SaveRollResult} vs ${t.SaveType} ${t.SaveTarget}) `
        str += ` - Applies ${se.Status.Name.toUpperCase()} to [${t.Combatant.actor.CombatController.CombatName}]`
        if (se.Duration) str += ` for ${se.Duration}`
        str += '\n'
      })
    })

    this.OtherEvents.forEach(oe => {
      this.Targets.forEach(t => {
        str += ` - Applies ${oe.Type} (${oe.Value}) to [${t.Combatant.actor.CombatController.CombatName}]\n`
      })
    })

    this.SpecialEvents.forEach(spe => {
      this.Targets.forEach(t => {
        switch (t.SaveResult) {
          case 'success':
            str += ` - Applies`
            break
          case 'failure':
            str += ` - Fails to apply`
            break
        }
        str += ` (${t.SaveRollResult} vs ${t.SaveType} ${t.SaveTarget}) `
        str += ` - ${spe.Attribute} to [${t.Combatant.actor.CombatController.CombatName}]`
        if (spe.Duration) str += ` for ${spe.Duration}`
        str += '\n'
      })
    })

    this.ResistEvents.forEach(re => {
      this.Targets.forEach(t => {
        switch (t.SaveResult) {
          case 'success':
            str += ` - Applies`
            break
          case 'failure':
            str += ` - Fails to apply`
            break
        }
        str += ` (${t.SaveRollResult} vs ${t.SaveType} ${t.SaveTarget}) `
        str += `${re.ResistType} - ${re.Resist} to [${t.Combatant.actor.CombatController.CombatName}]\n`
      })
    })

    return str
  }

  public setLog() {
    // log to encounter log
    // log to initiator log
    // log to target logs
  }
}

export { ActiveEffectEvent }
