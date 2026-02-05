type EventTarget =
  | DamageEventTarget
  | StatusEventTarget
  | OtherEventTarget
  | SpecialEventTarget
  | ResistEventTarget
type EventType = 'damage' | 'status' | 'other' | 'special' | 'resist'

const EVENT_CONFIG: Record<
  EventType,
  {
    key: keyof EventSummaryData
    formatter: string
  }
> = {
  damage: { key: 'damageEvents', formatter: '_formatDamageTarget' },
  status: { key: 'statusEvents', formatter: '_formatStatusTarget' },
  other: { key: 'otherEvents', formatter: '_formatOtherTarget' },
  special: { key: 'specialEvents', formatter: '_formatSpecialTarget' },
  resist: { key: 'resistEvents', formatter: '_formatResistTarget' },
}

interface EventSummaryData {
  initiatorName: string
  effectName: string
  activation?: string
  damageEvents: DamageEventTarget[][]
  statusEvents: StatusEventTarget[][]
  otherEvents: OtherEventTarget[][]
  specialEvents: SpecialEventTarget[][]
  resistEvents: ResistEventTarget[][]
}

interface BaseEventTarget {
  combatantName: string
  combatantId: string
  saveResult?: 'success' | 'failure'
  saveRollResult?: number
  saveTarget?: number
}

interface DamageEventTarget extends BaseEventTarget {
  hitResult?: 'crit' | 'hit' | 'miss'
  attackRolledValue?: number
  saveRolledValue?: number
  targetDefense: string
  targetDefenseValue: number
  summary: string
  finalDamageValue: number
  damageType: string
  save?: string
  savedHalf?: boolean
  totalArmorReduction: number
}

interface StatusEventTarget extends BaseEventTarget {
  targetDefense?: string
  statusName: string
  duration?: string
}

interface OtherEventTarget {
  combatantName: string
  type: string
  value: any
}

interface SpecialEventTarget extends BaseEventTarget {
  saveType?: string
  attribute: string
  duration?: string
}

interface ResistEventTarget extends BaseEventTarget {
  saveType?: string
  resistType: string
  resist: string
}

class EventSummary {
  constructor(private readonly data: EventSummaryData) {}

  public toJSON(): EventSummaryData {
    return structuredClone(this.data)
  }

  public toString(full = true): string {
    const header = this.formatHeader()
    const events = this.formatAllEvents()
    return full ? `${header}:\n${events}` : events
  }

  private formatHeader(): string {
    const activation = this.data.activation ? ` as a ${this.data.activation} Action` : ''
    return `${this.data.initiatorName} activates ${this.data.effectName.toUpperCase()}${activation}`
  }

  private formatAllEvents(): string {
    return (Object.entries(EVENT_CONFIG) as [EventType, (typeof EVENT_CONFIG)[EventType]][])
      .map(([eventType, config]) => this.formatEventGroup(eventType, config))
      .join('')
  }

  private formatEventGroup(eventType: EventType, config: (typeof EVENT_CONFIG)[EventType]): string {
    const events = this.data[config.key] as EventTarget[][]
    const formatter = this[config.formatter as keyof this] as (target: EventTarget) => string

    return events
      .flatMap(targets => targets)
      .map(formatter.bind(this))
      .join('')
  }

  private formatSaveResult(saveResult?: 'success' | 'failure'): string {
    const resultMap = { success: ' - Applies', failure: ' - Fails to apply' }
    return resultMap[saveResult!] ?? ''
  }

  private formatSaveRoll(
    rollResult?: number,
    target?: number,
    defense?: string,
    saveType?: string
  ): string {
    if (rollResult === undefined) return ''
    const defenseDisplay = saveType ? saveType : defense
    return ` (${rollResult} vs ${target} ${defenseDisplay})`
  }

  private formatDuration(saveResult?: string, duration?: string): string {
    return saveResult === 'success' && duration ? ` until ${duration}` : ''
  }

  private _formatDamageTarget = (target: DamageEventTarget): string => {
    const name = target.combatantName
    let result = `   - [${name}]`

    if (target.hitResult) {
      result += this.formatAttackResult(target)
    } else if (target.save) {
      result += this.formatSaveBasedDamage(target)
    } else {
      result += this.formatDirectDamage(target)
    }

    return result + '\n'
  }

  private formatAttackResult(target: DamageEventTarget): string {
    const hitResults = { crit: ' [Critical Hit!]', hit: ' [Hit]', miss: ' [Miss]' }
    let result = hitResults[target.hitResult!] ?? ''
    result += '\n'

    if (target.attackRolledValue !== undefined || target.saveRolledValue !== undefined) {
      result += ` (${target.attackRolledValue || target.saveRolledValue} vs ${target.targetDefense} ${target.targetDefenseValue}) `
    }

    return result + `[${target.combatantName}] for ${target.summary} - ${target.finalDamageValue}`
  }

  private formatSaveBasedDamage(target: DamageEventTarget): string {
    let result = ` (${target.saveRolledValue} vs ${target.save!.toUpperCase()} ${target.saveTarget})`
    result += target.saveResult === 'success' ? ' [SAVED]' : ' [FAILED SAVE]'
    result += `\n     ${target.summary}`

    if (target.savedHalf) result += ` - ${target.savedHalf} (Save)`
    result += ` - ${target.totalArmorReduction} (Armor)`

    return result + ` // ${target.finalDamageValue} ${target.damageType} Damage Total`
  }

  private formatDirectDamage(target: DamageEventTarget): string {
    return ` for ${target.summary} - ${target.finalDamageValue} ${target.damageType} Damage Total`
  }

  private _formatStatusTarget = (target: StatusEventTarget): string => {
    const saveResult = this.formatSaveResult(target.saveResult)
    const saveRoll = this.formatSaveRoll(
      target.saveRollResult,
      target.saveTarget,
      target.targetDefense
    )
    const status = ` ${target.statusName.toUpperCase()} to [${target.combatantName}]`
    const duration = this.formatDuration(target.saveResult, target.duration)

    return `${saveResult}${saveRoll}${status}${duration}\n`
  }

  private _formatOtherTarget = (target: OtherEventTarget): string => {
    return ` - Applies ${target.type} (${target.value}) to [${target.combatantName}]\n`
  }

  private _formatSpecialTarget = (target: SpecialEventTarget): string => {
    const saveResult = this.formatSaveResult(target.saveResult)
    const saveRoll = this.formatSaveRoll(
      target.saveRollResult,
      target.saveTarget,
      undefined,
      target.saveType
    )
    const attribute = ` - ${target.attribute} to [${target.combatantName}]`
    const duration = this.formatDuration(target.saveResult, target.duration)

    return `${saveResult}${saveRoll}${attribute}${duration}\n`
  }

  private _formatResistTarget = (target: ResistEventTarget): string => {
    const saveResult = this.formatSaveResult(target.saveResult)
    const saveRoll = this.formatSaveRoll(
      target.saveRollResult,
      target.saveTarget,
      undefined,
      target.saveType
    )
    const resist = `${target.resistType} - ${target.resist} to [${target.combatantName}]`

    return `${saveResult}${saveRoll}${resist}\n`
  }

  public static fromActiveEffectEvent(event: any): EventSummary {
    const data: EventSummaryData = {
      initiatorName: event.Initiator.actor.CombatController.CombatName,
      effectName: event.Effect.Name,
      activation: (event.Effect as any).Activation,
      damageEvents: [],
      statusEvents: [],
      otherEvents: [],
      specialEvents: [],
      resistEvents: [],
    }

    // Process each event type using a unified approach
    this.processEventGroup(event.DamageEvents, event, data.damageEvents, this.createDamageTarget)
    this.processEventGroup(event.StatusEvents, event, data.statusEvents, this.createStatusTarget)
    this.processEventGroup(event.OtherEvents, event, data.otherEvents, this.createOtherTarget)
    this.processEventGroup(event.SpecialEvents, event, data.specialEvents, this.createSpecialTarget)
    this.processEventGroup(event.ResistEvents, event, data.resistEvents, this.createResistTarget)

    return new EventSummary(data)
  }

  public static fromBasicAction(initiatorName: string, actionName: string): EventSummary {
    const data: EventSummaryData = {
      initiatorName: initiatorName,
      effectName: actionName,
      damageEvents: [],
      statusEvents: [],
      otherEvents: [],
      specialEvents: [],
      resistEvents: [],
    }
    return new EventSummary(data)
  }

  private static processEventGroup<TSource, TTarget>(
    sourceEvents: TSource[] | undefined,
    event: any,
    targetArray: TTarget[][],
    createTarget: (source: TSource, event: any, targetData: any) => TTarget
  ): void {
    if (!sourceEvents?.length) return

    sourceEvents.forEach(sourceEvent => {
      const targets: TTarget[] = event.Targets.map((targetData: any) => {
        // Special handling for damage events that need calculation
        if (sourceEvent && typeof (sourceEvent as any).CalcFinalDamage === 'function') {
          ;(sourceEvent as any).CalcFinalDamage(event, targetData)
        }
        return createTarget(sourceEvent, event, targetData)
      })
      targetArray.push(targets)
    })
  }

  private static createDamageTarget = (de: any, event: any, t: any): DamageEventTarget => ({
    combatantName: t.Combatant.actor.CombatController.CombatName,
    combatantId: t.Combatant.actor.CombatController.ActiveActor.ID,
    hitResult: event.Attack ? t.HitResult : undefined,
    attackRolledValue: t.AttackRolledValue,
    saveRolledValue: t.SaveRolledValue,
    targetDefense: t.TargetDefense,
    targetDefenseValue: t.TargetDefenseValue,
    summary: de.Summary,
    finalDamageValue: t.FinalDamageValue,
    damageType: de.DamageType,
    save: event.Save,
    saveTarget: t.SaveTarget,
    saveResult: t.SaveResult,
    savedHalf: t.SavedHalf,
    totalArmorReduction: t.TotalArmorReduction,
  })

  private static createStatusTarget = (se: any, event: any, t: any): StatusEventTarget => ({
    combatantName: t.Combatant.actor.CombatController.CombatName,
    combatantId: t.Combatant.actor.CombatController.ActiveActor.ID,
    saveResult: t.SaveResult,
    saveRollResult: t.SaveRollResult?.total,
    saveTarget: t.SaveTarget,
    targetDefense: t.TargetDefense,
    statusName: se.Status.Name,
    duration: se.Duration,
  })

  private static createOtherTarget = (oe: any, event: any, t: any): OtherEventTarget => ({
    combatantName: t.Combatant.actor.CombatController.CombatName,
    type: oe.Type,
    value: oe.Value,
  })

  private static createSpecialTarget = (spe: any, event: any, t: any): SpecialEventTarget => ({
    combatantName: t.Combatant.actor.CombatController.CombatName,
    combatantId: t.Combatant.actor.CombatController.ActiveActor.ID,
    saveResult: t.SaveResult,
    saveRollResult: t.SaveRollResult,
    saveType: t.SaveType,
    saveTarget: t.SaveTarget,
    attribute: spe.Attribute,
    duration: spe.Duration,
  })

  private static createResistTarget = (re: any, event: any, t: any): ResistEventTarget => ({
    combatantName: t.Combatant.actor.CombatController.CombatName,
    combatantId: t.Combatant.actor.CombatController.ActiveActor.ID,
    saveResult: t.SaveResult,
    saveRollResult: t.SaveRollResult,
    saveType: t.SaveType,
    saveTarget: t.SaveTarget,
    resistType: re.ResistType,
    resist: re.Resist,
  })
}

export { EventSummary }
export type { EventSummaryData }
