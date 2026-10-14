import { ActiveEffectEvent } from './ActiveEffectEvent'
import { i18n } from '@/i18n'
import { enumLabel, defenseLabel } from '@/i18n/enumLabel'

const t = (key: string, params: Record<string, unknown> = {}) => i18n.global.t(key, params)

function hitResultLabel(result: string): string {
  if (result === 'crit') return i18n.global.t('ui.combat.crit').toUpperCase()
  if (result === 'hit') return i18n.global.t('common.attackHit').toUpperCase()
  if (result === 'miss') return i18n.global.t('common.attackMiss').toUpperCase()
  return result.toUpperCase()
}

function withDuration(str: string, duration?: string): string {
  return duration ? `${str} ${t('combat.summary.forDuration', { duration })}` : str
}

type ActionSummaryData = {
  initiatorName: string
  initiatorType: string
  initiatorID: string
  effectName: string
  activation?: string
  damageEvents: any[]
  statusEvents: any[]
  otherEvents: any[]
  specialEvents: any[]
  resistEvents: any[]
}

class ActionSummary {
  private data: ActionSummaryData

  constructor(data: ActionSummaryData) {
    this.data = { ...data }
  }

  public Summarize(actorId: string): string {
    const d = (this.data as any).data || this.data

    if (d.initiatorID === actorId) return this.initiatorSummary(d)
    else return this.targetSummary(d)
  }

  private initiatorSummary(data: ActionSummaryData): string {
    const out = [
      data.activation
        ? t('combat.summary.effectAsActivation', {
            effect: data.effectName,
            activation: enumLabel('activationType', data.activation),
          })
        : t('combat.summary.effectHeader', { effect: data.effectName }),
    ]

    // if target is self name should be 'self'
    out.push(...this.summarizeDamageEvents(data.damageEvents, 'initiator'))
    out.push(...this.summarizeEvents(data.statusEvents, 'initiator'))
    out.push(...this.summarizeEvents(data.specialEvents, 'initiator'))
    out.push(...this.summarizeEvents(data.resistEvents, 'initiator'))
    out.push(...this.summarizeOtherEvents(data.otherEvents, 'initiator'))

    return out.join('\n')
  }

  private targetSummary(data: ActionSummaryData): string {
    const out = [
      t('combat.summary.targetedBy', { initiator: data.initiatorName, effect: data.effectName }),
    ]

    out.push(...this.summarizeDamageEvents(data.damageEvents, 'target'))
    out.push(...this.summarizeEvents(data.statusEvents, 'target'))
    out.push(...this.summarizeEvents(data.specialEvents, 'target'))
    out.push(...this.summarizeEvents(data.resistEvents, 'target'))
    out.push(...this.summarizeOtherEvents(data.otherEvents, 'target'))

    return out.join('\n')
  }

  private summarizeDamageEvents(events: any[], perspective: 'initiator' | 'target'): string[] {
    if (!events || events.length === 0) return []
    return events.flatMap(e => {
      const hasAttack = e.AttackRolledValue !== undefined
      const hasDamage = e.HitResult !== 'miss' && e.FinalDamageValue > 0
      if (!hasAttack && !hasDamage) return []

      const attack = {
        roll: e.AttackRolledValue,
        value: e.TargetDefenseValue,
        defense: defenseLabel(e.TargetDefense),
        result: hitResultLabel(e.HitResult),
      }
      let str = ''
      if (perspective === 'initiator') {
        if (hasAttack) str += `[${e.CombatantName}] ${t('combat.summary.attackResult', attack)}`
      } else {
        if (hasAttack) str += t('combat.summary.incomingAttack', attack)
      }
      if (hasDamage) {
        const prefix = str ? ' - ' : perspective === 'initiator' ? `[${e.CombatantName}] ` : ''
        let tags = ''
        if (e.AP) tags += ` ${t('combat.summary.apTag')}`
        if (e.Irreducible) tags += ` ${t('combat.summary.irreducibleTag')}`
        if (e.FinalDamageValue === e.Reliable)
          tags += ` ${t('combat.summary.reliable', { n: e.Reliable })}`
        str += `${prefix}${t('combat.summary.totalDamage', { damage: e.FinalDamageValue, type: enumLabel('damageType', e.DamageType) })}${tags}`
      }
      return [str]
    })
  }

  private summarizeEvents(events: any[], perspective: 'initiator' | 'target'): string[] {
    if (!events || events.length === 0) return []
    return events.map(e => {
      const eventName = e.StatusName || `${e.ResistType} ${e.Resist}`
      let str = ''
      const save = { roll: e.SaveRolledValue, target: e.SaveTarget }
      const outcome = withDuration(
        t(perspective === 'initiator' ? 'combat.summary.applied' : 'combat.summary.gained', {
          name: eventName,
        }),
        e.Duration
      )
      if (perspective === 'initiator') str = `[${e.CombatantName}] `
      if (e.SaveRolledValue) {
        if (e.SaveResult === 'failure') {
          str += `${t('combat.summary.failedSave', save)} → ${outcome}`
        } else {
          str += t('combat.summary.successfulSave', save)
        }
      } else {
        str += outcome
      }

      return str
    })
  }

  private summarizeOtherEvents(events: any[], perspective: 'initiator' | 'target'): string[] {
    if (!events || events.length === 0) return []
    return events.map(e => {
      let str = ''
      if (perspective === 'initiator') {
        str += `[${e.CombatantName}] ${t('combat.summary.appliedEffect', { type: e.Type, value: e.Value })}`
      } else {
        str += t('combat.summary.gainedEffect', { type: e.Type, value: e.Value })
      }
      return str
    })
  }

  public static fromActiveEffectEvent(event: ActiveEffectEvent): ActionSummaryData {
    const initiator = event.Initiator.actor.CombatController.RootActor
    return {
      initiatorName: event.Initiator.Label,
      initiatorType: initiator.ItemType,
      initiatorID: initiator.ID,
      effectName: event.Effect.Name,
      activation: (event.Effect as any).Activation,
      damageEvents: this.processSubEventArray(event.DamageEvents, event.Targets),
      statusEvents: this.processSubEventArray(event.StatusEvents, event.Targets),
      otherEvents: this.processSubEventArray(event.OtherEvents, event.Targets),
      specialEvents: this.processSubEventArray(event.SpecialEvents, event.Targets),
      resistEvents: this.processSubEventArray(event.ResistEvents, event.Targets),
    }
  }

  private static processSubEventArray(se: any[], targets: any[]): any[] {
    return se
      .map(s => {
        return targets.map(t => {
          return { ...s.ToJSON(), ...t.ToJSON() }
        })
      })
      .flat()
  }
}

export { ActionSummary }
export type { ActionSummaryData }
