
import { ActiveEffect } from './ActiveEffect'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { CombatantData } from '@/classes/encounter/Encounter'
import { Mech } from '../../../mech/Mech'
import { PilotWeapon } from '../../../pilot/components/Loadout/equipment/PilotWeapon'
import { Pilot } from '../../../pilot/Pilot'
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon'
import { ActiveEffectEvent } from './ActiveEffectEvent'
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon'
import { ActiveEventTarget } from './effect_events/eventTarget'

// per-event target instances are cached here (rather than on the instance) so the cache stays
// outside Vue reactivity. Reading and writing a reactive cell inside the TargetEvents getter,
// which runs during render, would self-invalidate and trigger "Maximum recursive updates".
const onEventTargetCaches = new WeakMap<WeaponAttackEvent, Record<string, ActiveEventTarget[]>>()

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
    this.ID = crypto.randomUUID()
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

    if (weapon instanceof NpcWeapon) {
      const attackCount = weapon.getAttacks(owner.actor.CombatController.Tier) - 1
      for (let i = 0; i < attackCount; i++) {
        this.BaseEvent.AddTarget()
      }
    }
  }

  private get EventConfigs(): {
    event?: ActiveEffectEvent
    filter: (t: ActiveEventTarget) => boolean
  }[] {
    return [
      {
        event: this.OnAttackEvent,
        filter: (t: ActiveEventTarget) => t.HitResult === 'hit' || t.HitResult === 'crit',
      },
      {
        event: this.OnHitEvent,
        filter: (t: ActiveEventTarget) => t.HitResult === 'hit' || t.HitResult === 'crit',
      },
      {
        event: this.OnCritEvent,
        filter: (t: ActiveEventTarget) => t.HitResult === 'crit',
      },
      {
        event: this.OnMissEvent,
        filter: (t: ActiveEventTarget) => t.HitResult === 'miss',
      },
    ]
  }

  // build (and cache) the set of targets for an on-hit/on-crit/etc. effect. Each effect gets
  // its own ActiveEventTarget instances mirroring the matching base attack targets, so save
  // rolls entered on one effect do not bleed into the others. Targets are reused across calls
  // (matched by index + combatant) so entered rolls persist between renders.
  private buildEventTargets(
    event: ActiveEffectEvent,
    filter: (t: ActiveEventTarget) => boolean
  ): ActiveEventTarget[] {
    let cacheStore = onEventTargetCaches.get(this)
    if (!cacheStore) {
      cacheStore = {}
      onEventTargetCaches.set(this, cacheStore)
    }

    const baseTargets = this.BaseEvent.Targets.filter(t => t && filter(t))
    const cached = cacheStore[event.ID] || []
    const result = baseTargets.map((bt, i) => {
      const existing = cached[i]
      if (existing && existing.Combatant === bt.Combatant) return existing
      return new ActiveEventTarget(event, bt.Combatant, event.Effect)
    })
    cacheStore[event.ID] = result
    event.Targets = result
    return result
  }

  public get TargetEvents(): ActiveEffectEvent[] {
    if (!this.BaseEvent.Targets[0]) return []

    return this.EventConfigs.filter(config => config.event)
      .map(config => ({
        event: config.event!,
        targets: this.buildEventTargets(config.event!, config.filter),
      }))
      .filter(({ targets }) => targets.length > 0)
      .map(({ event }) => event)
  }

  public get Summary(): string {
    let str = ''
    const isAdditional = this.AttackActionString.toLowerCase().includes('additional')
    if (!isAdditional) str = `${this.BaseEvent.Initiator.actor.CombatController.CombatName}: `
    else str = ' ⤷ '
    str += `${this.AttackActionString} with ${this.Weapon.Name}:\n`
    this.BaseEvent.Targets.forEach((t, idx) => {
      this.BaseEvent.DamageEvents.forEach(de => {
        const { finalDamage } = de.CalcFinalDamageValues(this.BaseEvent, t)
        str += `   - [${t.Combatant?.actor.CombatController.CombatName || `Target ${idx + 1}`}]`
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
          str += `\n     Total Damage: ${finalDamage} ${de.DamageType}`
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

    // apply each on-hit/on-crit/etc. effect through its own targets (built/cached by
    // buildEventTargets) so the save state the GM entered on that specific effect is what
    // gets applied. on-hit/on-attack fire on both hits and crits, matching what is displayed.
    this.EventConfigs.forEach(config => {
      if (!config.event) return
      const targets = this.buildEventTargets(config.event, config.filter)
      targets.forEach(t => {
        if (t) config.event!.Apply(t)
      })
    })

    this.SubEvents.forEach(se => se.ApplyAll())
    this.ModEvents.forEach(me => me.ApplyAll())
  }
}

export { WeaponAttackEvent }
