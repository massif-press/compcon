import { v4 as uuid } from 'uuid'

import { ActiveEffect } from './ActiveEffect'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { CombatantData } from '@/classes/encounter/Encounter'
import { Mech, Pilot, PilotWeapon } from '@/class'

import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon'
import { ActiveEffectEvent } from './ActiveEffectEvent'
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon'
import { ActiveEventTarget } from './effect_events/eventTarget'

class WeaponAttackEvent {
  public ID: string
  public AttackActionString: string
  public Weapon: WeaponProfile | NpcWeapon | PilotWeapon
  public BaseEvent: ActiveEffectEvent // the weapon attack itself
  public SubEvents: ActiveEffectEvent[] = []
  public ModEvents: ActiveEffectEvent[] = []

  public OnMissEvent?: ActiveEffectEvent
  public OnAttackEvent?: ActiveEffectEvent
  public OnHitEvent?: ActiveEffectEvent
  public OnCritEvent?: ActiveEffectEvent

  // must rebuild when changing profiles
  constructor(
    weapon: WeaponProfile | NpcWeapon | PilotWeapon,
    owner: CombatantData,
    instance: EncounterInstance,
    attackActionString: string
  ) {
    this.ID = uuid()
    this.AttackActionString = attackActionString
    this.Weapon = weapon
    let effectData
    if (weapon instanceof WeaponProfile) {
      effectData = weapon.toActiveEffectData(owner.actor as Mech)
    } else if (weapon instanceof NpcWeapon) {
      effectData = weapon.toActiveEffectData(owner.actor as any) // this will always be Unit or Eidolon
    } else {
      effectData = weapon.toActiveEffectData(owner.actor as Pilot)
    }

    effectData.name += ` (${attackActionString})`

    this.BaseEvent = new ActiveEffectEvent(
      owner,
      new ActiveEffect(effectData, owner.actor),
      instance
    )

    if (weapon.ActiveEffects)
      this.SubEvents = weapon.ActiveEffects.map(ae => new ActiveEffectEvent(owner, ae, instance))

    if ((weapon as WeaponProfile).Parent?.Mod) {
      this.ModEvents = (weapon as WeaponProfile).Parent.Mod!.ActiveEffects.map(
        ae => new ActiveEffectEvent(owner, ae, instance)
      )
    }

    if (weapon.OnMiss) this.OnMissEvent = new ActiveEffectEvent(owner, weapon.OnMiss, instance)
    if (weapon.OnAttack)
      this.OnAttackEvent = new ActiveEffectEvent(owner, weapon.OnAttack, instance)
    if (weapon.OnHit) this.OnHitEvent = new ActiveEffectEvent(owner, weapon.OnHit, instance)
    if (weapon.OnCrit) this.OnCritEvent = new ActiveEffectEvent(owner, weapon.OnCrit, instance)
  }

  public get TargetEvents(): ActiveEffectEvent[] {
    if (!this.BaseEvent.Targets[0]) return []
    const eventMap = {
      attack: {
        event: this.OnAttackEvent,
        filter: (t: ActiveEventTarget) => t.HitResult === 'hit' || t.HitResult === 'crit',
      },
      hit: {
        event: this.OnHitEvent,
        filter: (t: ActiveEventTarget) => t.HitResult === 'hit' || t.HitResult === 'crit',
      },
      crit: {
        event: this.OnCritEvent,
        filter: (t: ActiveEventTarget) => t.HitResult === 'crit',
      },
      miss: {
        event: this.OnMissEvent,
        filter: (t: ActiveEventTarget) => t.HitResult === 'miss',
      },
    }

    return Object.values(eventMap)
      .filter(config => config.event)
      .map(config => {
        const event = config.event!
        const targets = this.BaseEvent.Targets.filter(config.filter)
        event.Targets = targets
        return { event, targets }
      })
      .filter(({ targets }) => targets.length > 0)
      .map(({ event }) => event)
  }

  public get Summary(): string {
    let str = ''
    const isAdditional = this.AttackActionString.toLowerCase().includes('additional')
    if (!isAdditional) str = `${this.BaseEvent.Initiator.actor.CombatController.CombatName}: `
    else str = ' ⤷ '
    str += `${this.AttackActionString} with ${this.Weapon.Name}:\n`
    this.BaseEvent.Targets.forEach(t => {
      this.BaseEvent.DamageEvents.forEach(de => {
        de.CalcFinalDamage(this.BaseEvent, t)
        str += `   - [${t.Combatant.actor.CombatController.CombatName}]`
        switch (this.BaseEvent.Attack && t.HitResult) {
          case 'crit':
            str += ` ⟪Critical Hit!⟫ `
            break
          case 'hit':
            str += ` ⟪Hit⟫ `
            break
          case 'miss':
            str += ` ⟪Miss⟫ `
            break
          default:
            break
        }
        // calc for attack, not save
        // (attacker rolls vs target defense)
        if (t.AttackRolledValue) {
          str += `(${t.AttackRolledValue || t.SaveRolledValue} vs ${t.TargetDefenseValue} ${t.TargetDefense})`
          if (t.HitResult !== 'miss') {
            str += `\n     ${de.IncomingSummary} `
            str += `${t.DamageModSummary(de.DamageType, de.AP, de.Irreducible)}`
          }
          str += `\n     Total Damage: ${t.FinalDamageValue} ${de.DamageType}`
          if (de.Reliable && (de.DamageRolledValue! < de.Reliable || t.HitResult === 'miss'))
            str += ` (Reliable ${de.Reliable})`
          const totalHeat =
            (this.Weapon as WeaponProfile).HeatCost + (de.Overkill ? de.OverkillHeat : 0)

          if (totalHeat > 0) {
            str += `\n     ${this.BaseEvent.Initiator.actor.CombatController.CombatName} takes ${totalHeat} Heat (`
            const heatSources: string[] = []
            if ((this.Weapon as WeaponProfile).HeatCost) heatSources.push('Self')
            if (de.Overkill) heatSources.push('Overkill')
            str += heatSources.join(' + ')
            str += `)`
          }

          if (t.HitResult === 'miss' && this.OnMissEvent) {
            str += `\n       ❯ On Miss Effect\n`
            str += `          ${this.OnMissEvent.ShortSummary}`
          }

          if (t.HitResult !== 'miss' && this.OnAttackEvent) {
            str += `\n       ❯ On Attack Effect\n`
            str += `          ${this.OnAttackEvent.ShortSummary}`
          }

          if ((t.HitResult === 'hit' || t.HitResult === 'crit') && this.OnHitEvent) {
            str += `\n       ❯ On Hit Effect\n`
            str += `          ${this.OnHitEvent.ShortSummary}`
          }

          if (t.HitResult === 'crit' && this.OnCritEvent) {
            str += `\n       ❯ On Crit Effect\n`
            str += `          ${this.OnCritEvent.ShortSummary}`
          }
        }
      })
    })

    if (this.SubEvents.length > 0) {
      str += `\n       ❯ Additional Effects\n`
      this.SubEvents.forEach(se => {
        str += `          - ${se.ShortSummary}\n`
      })
    }

    if (this.ModEvents.length > 0) {
      str += `\n       ❯ Mod Effects\n`
      this.ModEvents.forEach(me => {
        str += `          - ${me.ShortSummary}\n`
      })
    }

    return str
  }

  public ApplyAll() {
    this.BaseEvent.ApplyAll()
    this.BaseEvent.Targets.forEach(t => {
      if (t.HitResult === 'miss' && this.OnMissEvent) this.OnMissEvent.Apply(t)
      if (t.HitResult !== 'miss' && this.OnAttackEvent) this.OnAttackEvent.Apply(t)
      if (t.HitResult === 'hit' && this.OnHitEvent) this.OnHitEvent.Apply(t)
      if (t.HitResult === 'crit' && this.OnCritEvent) this.OnCritEvent.Apply(t)
    })

    this.SubEvents.forEach(se => se.ApplyAll())
    this.ModEvents.forEach(me => me.ApplyAll())
  }
}

export { WeaponAttackEvent }
