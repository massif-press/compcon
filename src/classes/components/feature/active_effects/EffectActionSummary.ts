import { ActiveEffectEvent } from './ActiveEffectEvent'

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
    // TODO: why is this getting polluted?
    let d = (this.data as any).data || this.data

    if (d.initiatorID === actorId) return this.initiatorSummary(d)
    else return this.targetSummary(d)
  }

  private initiatorSummary(data: ActionSummaryData): string {
    let str = data.effectName
    if (data.activation) str += ` as a ${data.activation} Action`
    let out = [`${str}:`]

    // if target is self name should be 'self'
    out.push(...this.summarizeDamageEvents(data.damageEvents, 'initiator'))
    out.push(...this.summarizeEvents(data.statusEvents, 'initiator'))
    out.push(...this.summarizeEvents(data.specialEvents, 'initiator'))
    out.push(...this.summarizeEvents(data.resistEvents, 'initiator'))
    out.push(...this.summarizeOtherEvents(data.otherEvents, 'initiator'))

    return out.join('\n')
  }

  private targetSummary(data: ActionSummaryData): string {
    let out = [`Targeted by ${data.initiatorName}'s ${data.effectName}:`]

    out.push(...this.summarizeDamageEvents(data.damageEvents, 'target'))
    out.push(...this.summarizeEvents(data.statusEvents, 'target'))
    out.push(...this.summarizeEvents(data.specialEvents, 'target'))
    out.push(...this.summarizeEvents(data.resistEvents, 'target'))
    out.push(...this.summarizeOtherEvents(data.otherEvents, 'target'))

    return out.join('\n')
  }

  private summarizeDamageEvents(events: any[], perspective: 'initiator' | 'target'): string[] {
    return events.map(e => {
      let str = ''
      if (perspective === 'initiator') {
        str += `[${e.CombatantName}] ${e.AttackRolledValue} vs ${e.TargetDefenseValue} ${e.TargetDefense} : ${e.HitResult.toUpperCase()}`
      } else {
        str += `Incoming ${e.AttackRolledValue} vs ${e.TargetDefenseValue} ${e.TargetDefense} : ${e.HitResult.toUpperCase()}`
      }
      if (e.HitResult !== 'miss' && e.FinalDamageValue > 0) {
        str += ` - Total Damage: ${e.FinalDamageValue} ${e.DamageType}${e.AP ? ' (AP)' : ''}${e.Irreducible ? ' (Irreducible)' : ''}${e.FinalDamageValue === e.Reliable ? `( Reliable ${e.Reliable})` : ''}`
      }

      return str
    })
  }

  private summarizeEvents(events: any[], perspective: 'initiator' | 'target'): string[] {
    return events.map(e => {
      const eventName = e.StatusName || `${e.ResistType} ${e.Resist}`
      let str = ''
      if (perspective === 'initiator') {
        str = `[${e.CombatantName}] `
        if (e.SaveRolledValue) {
          if (e.SaveResult === 'failed') {
            str += `Failed Save (${e.SaveRolledValue} vs ${e.SaveTarget}) → Applied ${eventName}${e.Duration ? ` for ${e.Duration}` : ''}`
            if (e.Duration) {
              str += ` for ${e.Duration}`
            }
          } else {
            str += `Successful Save (${e.SaveRolledValue} vs ${e.SaveTarget})`
          }
        } else {
          str += `Applied ${eventName}${e.Duration ? ` for ${e.Duration}` : ''}`
        }
      } else {
        if (e.SaveRolledValue) {
          if (e.SaveResult === 'failed') {
            str += `Failed Save (${e.SaveRolledValue} vs ${e.SaveTarget}) → Gained ${eventName}${e.Duration ? ` for ${e.Duration}` : ''}`
          } else {
            str += `Successful Save (${e.SaveRolledValue} vs ${e.SaveTarget})`
          }
        } else {
          str += `Gained ${eventName}${e.Duration ? ` for ${e.Duration}` : ''}`
        }
      }

      return str
    })
  }

  private summarizeOtherEvents(events: any[], perspective: 'initiator' | 'target'): string[] {
    return events.map(e => {
      let str = ''
      if (perspective === 'initiator') {
        str += `[${e.CombatantName}] Applied Effect ${e.Type} ${e.Value}`
      } else {
        str += `Gained Effect ${e.Type} ${e.Value}`
      }
      return str
    })
  }

  public static fromActiveEffectEvent(event: ActiveEffectEvent): ActionSummaryData {
    const initiator = event.Initiator.actor.CombatController.RootActor
    return {
      initiatorName: initiator.CombatController.CombatName,
      initiatorType: initiator.ItemType,
      initiatorID: initiator.ID,
      effectName: event.Effect.Name,
      activation: (event.Effect as any).Activation,
      damageEvents: this.processSubEventArray(event.DamageEvents, event.Targets),
      statusEvents: this.processSubEventArray(event.StatusEvents, event.Targets),
      otherEvents: this.processSubEventArray(event.StatusEvents, event.Targets),
      specialEvents: this.processSubEventArray(event.StatusEvents, event.Targets),
      resistEvents: this.processSubEventArray(event.StatusEvents, event.Targets),
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

  public static fromBasicAction(
    initiator: any,
    effectName: string,
    activation?: string
  ): ActionSummary {
    initiator = initiator.CombatController.RootActor
    const data: ActionSummaryData = {
      initiatorName: initiator.CombatController.CombatName,
      initiatorType: initiator.ItemType,
      initiatorID: initiator.ID,
      effectName,
      activation,
      damageEvents: [],
      statusEvents: [],
      otherEvents: [],
      specialEvents: [],
      resistEvents: [],
    }
    return new ActionSummary(data)
  }
}

export { ActionSummary }
export type { ActionSummaryData }
