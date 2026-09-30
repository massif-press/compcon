import { ActiveEffect } from './ActiveEffect'
import { i18n } from '@/i18n'
import { enumLabel, defenseLabel } from '@/i18n/enumLabel'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { CombatantData } from '@/classes/encounter/Encounter'
import { Mech } from '../../../mech/Mech'
import { PilotWeapon } from '../../../pilot/components/Loadout/equipment/PilotWeapon'
import { Pilot } from '../../../pilot/Pilot'
import { NpcWeapon } from '@/classes/npc/feature/NpcItem/NpcWeapon'
import { ActiveEffectEvent } from './ActiveEffectEvent'
import { WeaponProfile } from '@/classes/mech/components/equipment/MechWeapon'
import { ActiveEventTarget } from './effect_events/eventTarget'
import {
  routesTo,
  attackCountFor,
  WeaponAttackFlow,
} from '@/classes/components/combat/flows/WeaponAttackFlow'
import type { IWeaponAttackState } from '@/classes/components/combat/flows/WeaponAttackFlow'

const onEventTargetCaches = new WeakMap<WeaponAttackEvent, Record<string, ActiveEventTarget[]>>()

class WeaponAttackEvent {
  public ID: string
  public AttackActionString: string
  public IsAdditional = false
  public Weapon: WeaponProfile | NpcWeapon | PilotWeapon
  public BaseEvent: ActiveEffectEvent
  public SubEvents: ActiveEffectEvent[] = []
  public ModEvents: ActiveEffectEvent[] = []

  private _applied = false

  public Force = false

  public OnMissEvent?: ActiveEffectEvent
  public OnAttackEvent?: ActiveEffectEvent
  public OnHitEvent?: ActiveEffectEvent
  public OnCritEvent?: ActiveEffectEvent

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
      effectData = weapon.toActiveEffectData(owner.actor as any)
    } else {
      effectData = weapon.toActiveEffectData(owner.actor as Pilot)
    }

    effectData.name += ` (${attackActionString})`

    this.BaseEvent = new ActiveEffectEvent(
      owner,
      new ActiveEffect(effectData, owner.actor),
      instance
    )
    this.BaseEvent.Weapon = weapon

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

    const extraAttacks = attackCountFor(weapon, owner.actor.CombatController.Tier) - 1
    for (let i = 0; i < extraAttacks; i++) this.BaseEvent.AddTarget()
  }

  private get EventConfigs(): {
    event?: ActiveEffectEvent
    filter: (t: ActiveEventTarget) => boolean
  }[] {
    return [
      {
        event: this.OnAttackEvent,
        filter: (t: ActiveEventTarget) => routesTo(t.HitResult).onAttack,
      },
      { event: this.OnHitEvent, filter: (t: ActiveEventTarget) => routesTo(t.HitResult).onHit },
      { event: this.OnCritEvent, filter: (t: ActiveEventTarget) => routesTo(t.HitResult).onCrit },
      { event: this.OnMissEvent, filter: (t: ActiveEventTarget) => routesTo(t.HitResult).onMiss },
    ]
  }

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
    const t = i18n.global.t
    let str = ''
    if (!this.IsAdditional) str = `${this.BaseEvent.Initiator.Label}: `
    else str = ' ⤷ '
    str += `${t('combat.summary.attackWith', { action: this.AttackActionString, weapon: this.Weapon.Name })}\n`
    this.BaseEvent.Targets.forEach((tg, idx) => {
      this.BaseEvent.DamageEvents.forEach(de => {
        const { finalDamage } = de.CalcFinalDamageValues(this.BaseEvent, tg)
        str += `   - [${tg.Combatant?.Label || t('combat.summary.targetNumbered', { n: idx + 1 })}]`
        switch (this.BaseEvent.Attack && tg.HitResult) {
          case 'crit':
            str += ` ⟪${t('combat.summary.criticalHit')}⟫ `
            break
          case 'hit':
            str += ` ⟪${t('common.attackHit')}⟫ `
            break
          case 'miss':
            str += ` ⟪${t('common.attackMiss')}⟫ `
            break
          default:
            break
        }
        if (tg.AttackRolledValue) {
          str += `(${t('combat.summary.rollVsDefense', { roll: tg.AttackRolledValue || tg.SaveRolledValue, value: tg.TargetDefenseValue, defense: defenseLabel(tg.TargetDefense) })})`
          if (tg.HitResult !== 'miss') {
            str += `\n     ${de.IncomingSummary} `
            str += `${tg.DamageModSummary(de.DamageType, de.AP, de.Irreducible)}`
          }
          str += `\n     ${t('combat.summary.totalDamage', { damage: finalDamage, type: enumLabel('damageType', de.DamageType) })}`
          if (de.Reliable && (de.DamageRolledValue! < de.Reliable || tg.HitResult === 'miss'))
            str += ` ${t('combat.summary.reliable', { n: de.Reliable })}`
          const totalHeat =
            (this.Weapon as WeaponProfile).HeatCost + (de.Overkill ? de.OverkillHeat : 0)

          if (totalHeat > 0) {
            const heatSources: string[] = []
            if ((this.Weapon as WeaponProfile).HeatCost) heatSources.push(t('ui.combat.self'))
            if (de.Overkill) heatSources.push(t('common.overkill'))
            str += `\n     ${t('combat.summary.takesHeat', { actor: this.BaseEvent.Initiator.Label, heat: totalHeat, sources: heatSources.join(' + ') })}`
          }

          if (routesTo(tg.HitResult).onMiss && this.OnMissEvent) {
            str += `\n       ❯ ${t('combat.summary.onMissEffect')}\n`
            str += `          ${this.OnMissEvent.ShortSummary}`
          }

          if (tg.HitResult !== 'miss' && this.OnAttackEvent) {
            str += `\n       ❯ ${t('combat.summary.onAttackEffect')}\n`
            str += `          ${this.OnAttackEvent.ShortSummary}`
          }

          if (routesTo(tg.HitResult).onHit && this.OnHitEvent) {
            str += `\n       ❯ ${t('combat.summary.onHitEffect')}\n`
            str += `          ${this.OnHitEvent.ShortSummary}`
          }

          if (routesTo(tg.HitResult).onCrit && this.OnCritEvent) {
            str += `\n       ❯ ${t('combat.summary.onCritEffect')}\n`
            str += `          ${this.OnCritEvent.ShortSummary}`
          }
        }
      })
    })

    if (this.SubEvents.length > 0) {
      str += `\n       ❯ ${t('combat.summary.additionalEffects')}\n`
      this.SubEvents.forEach(se => {
        str += `          - ${se.ShortSummary}\n`
      })
    }

    if (this.ModEvents.length > 0) {
      str += `\n       ❯ ${t('combat.summary.modEffects')}\n`
      this.ModEvents.forEach(me => {
        str += `          - ${me.ShortSummary}\n`
      })
    }

    return str
  }

  public get FlowState(): IWeaponAttackState {
    const attacker = this.BaseEvent.Initiator.actor.CombatController
    return {
      attacker,
      weapon: this.Weapon as any,
      event: this.BaseEvent as any,
      targets: this.BaseEvent.Targets as any,
      routes: this.EventConfigs.map(config => ({
        event: config.event as any,
        targets: () => this.buildEventTargets(config.event!, config.filter) as any,
      })).filter(r => !!r.event),
      followUps: [...this.SubEvents, ...this.ModEvents],
      applied: false,
      force: this.Force,
    }
  }

  public ApplyAll() {
    const state = this.FlowState
    state.applied = this._applied
    const result = WeaponAttackFlow.Begin(state)
    this._applied = result.state.applied
    return result
  }
}

export { WeaponAttackEvent }
