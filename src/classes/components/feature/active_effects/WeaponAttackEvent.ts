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

    this.BaseEvent = new ActiveEffectEvent(
      owner,
      new ActiveEffect(effectData, owner.actor),
      instance
    )

    if (weapon.ActiveEffects)
      this.SubEvents = weapon.ActiveEffects.map(ae => new ActiveEffectEvent(owner, ae, instance))

    if ((weapon as WeaponProfile).Parent.Mod) {
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
        filter: (t: ActiveEventTarget) => t.HitResult === 'hit',
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
    console.log(this)
    let str = `${this.BaseEvent.Initiator.actor.CombatController.CombatName}: ${this.AttackActionString} with ${
      this.Weapon.Name
    }:\n`
    this.BaseEvent.DamageEvents.forEach(de => {
      this.BaseEvent.Targets.forEach(t => {
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
        if (t.AttackRolledValue || t.SaveRolledValue) {
          str += `(${t.AttackRolledValue || t.SaveRolledValue} vs ${t.TargetDefenseValue} ${t.TargetDefense})`
          str += `\n     roll = incoming`
          str += `+ x overkill damage`
          str += `+ x bonus damage`
          str += `x2 (target exposed)`
          str += `x2 (target vulnerable)`
          str += `- x (target armor)`
          str += `- 0 (target shredded)`
          str += `- 0 (Armor Pierced)`
          str += `/2 (target resistance)`
          str += `//NEGATED// (target immune)`
          // initial damage (roll = final)
          // ap, irreducible, etc
          // double etc from statuses, mods, etc
          // reduction from armor
          // reduction from resistances
          // if on event
          // event, roll, etc
          // if sub events
          // event, roll, etc
          // if mod events
          // event, roll, etc
          str += `\n     Total Damage: ${t.FinalDamageValue} ${de.DamageType} Damage`
          str += ` (reliable x)`
          str += `\n`
          str += `     ${this.BaseEvent.Initiator.actor.CombatController.CombatName} takes x overkill heat\n`
        }
      })
    })
    return str
  }
}

export { WeaponAttackEvent }
