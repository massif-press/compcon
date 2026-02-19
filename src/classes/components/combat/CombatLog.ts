// log and telemetry

import { ActionSummaryData } from '../feature/active_effects/EffectActionSummary'
import { CombatController } from './CombatController'

type CombatLogEntry = {
  timestamp: number
  round: number
  dir: 'outgoing' | 'incoming'
  action?: ActionSummaryData
  event?: string
}

type glp = {
  gained: number
  lost: number
}

type TelemetryData = {
  turns: number
  rounds: number
  mechs_lost: number
  enemies_destroyed: number
  rounds_mounted: number
  rounds_dismounted: number
  cover_rounds: Record<string, number>[]
  rounds_ai_control: number
  damage: {
    kinetic: glp
    energy: glp
    explosive: glp
    heat: glp
    burn: glp
    other: glp
  }
  stats: {
    hp: glp
    overshield: glp
    armor: glp
    structure: glp
    heat: glp
    stress: glp
    burn: glp
    repair: glp
  }
  damage_armor_reduced: number
  overcharge_heat: number
  movement: number
  cp_spent: number
  deployables_launched: number
  damage_dealt_pilot: number
  damage_dealt_ai: number
  damage_taken_pilot: number
  pilot_movement: number
}

function getBlankTelemetry(): TelemetryData {
  return {
    turns: 0,
    rounds: 0,
    mechs_lost: 0,
    enemies_destroyed: 0,
    rounds_mounted: 0,
    rounds_dismounted: 0,
    cover_rounds: [],
    rounds_ai_control: 0,
    damage: {
      kinetic: { gained: 0, lost: 0 },
      energy: { gained: 0, lost: 0 },
      explosive: { gained: 0, lost: 0 },
      heat: { gained: 0, lost: 0 },
      burn: { gained: 0, lost: 0 },
      other: { gained: 0, lost: 0 },
    },
    stats: {
      hp: { gained: 0, lost: 0 },
      overshield: { gained: 0, lost: 0 },
      armor: { gained: 0, lost: 0 },
      structure: { gained: 0, lost: 0 },
      heat: { gained: 0, lost: 0 },
      stress: { gained: 0, lost: 0 },
      burn: { gained: 0, lost: 0 },
      repair: { gained: 0, lost: 0 },
    },
    damage_armor_reduced: 0,
    overcharge_heat: 0,
    movement: 0,
    pilot_movement: 0,
    cp_spent: 0,
    deployables_launched: 0,
    damage_dealt_pilot: 0,
    damage_dealt_ai: 0,
    damage_taken_pilot: 0,
  }
}

class CombatLog {
  public RootActor: any
  public History: CombatLogEntry[] = []
  public Telemetry: TelemetryData
  private _telemetryCache: TelemetryData

  public constructor(
    rootActor: any,
    log_data: CombatLogEntry[] = [],
    telemetry_data?: TelemetryData
  ) {
    this.RootActor = rootActor
    this.History = log_data
    this.Telemetry = telemetry_data || getBlankTelemetry()
    this._telemetryCache = getBlankTelemetry()
  }

  public get CombatController(): CombatController {
    return this.RootActor.CombatController
  }

  public LogAction(action: ActionSummaryData, dir: 'incoming' | 'outgoing' = 'outgoing'): void {
    this.History.push({
      timestamp: Date.now(),
      round: this.CombatController.Round,
      dir,
      action,
    })
  }

  public LogEvent(event: string, dir: 'incoming' | 'outgoing' = 'incoming'): void {
    this.History.push({
      timestamp: Date.now(),
      round: this.CombatController.Round,
      dir,
      event,
    })
  }

  public LogSimpleEvent(summary: string): void {
    this.LogEvent(summary, 'incoming')
  }

  public LoseMech(): void {
    this._telemetryCache.mechs_lost += 1
  }

  public DealDamage(amount: number, type: string): void {
    // TODO: set variable damage selection
    if (type.toLowerCase() === 'variable') type = 'kinetic'
    if (type.toLowerCase() === 'applied burn' || type.toLowerCase() === 'appliedburn') type = 'burn'
    const isAi = this.CombatController.IsAIControlled
    const isPilot = !this.CombatController.Mounted
    if (isAi) {
      this._telemetryCache.damage_dealt_ai += amount
    } else if (isPilot) {
      this._telemetryCache.damage_dealt_pilot += amount
    }
    this._telemetryCache.damage[type.toLowerCase()].gained += amount
  }

  public TakeDamage(amount: number, type: string): void {
    // TODO: set variable damage selection
    if (type.toLowerCase() === 'variable') type = 'kinetic'
    if (type.toLowerCase() === 'applied burn' || type.toLowerCase() === 'appliedburn') type = 'burn'
    const isPilot = !this.CombatController.Mounted
    if (isPilot) {
      this._telemetryCache.damage_taken_pilot += amount
    }
    this._telemetryCache.damage[type.toLowerCase()].lost += amount
  }

  public StatChange(amount: number, type: string): void {
    const isPilot = !this.CombatController.Mounted
    if (isPilot && type === 'movement') {
      this._telemetryCache.pilot_movement += amount
    }
    if (this._telemetryCache.stats[type.toLowerCase()]) {
      if (amount > 0) {
        this._telemetryCache.stats[type.toLowerCase()].gained += amount
      } else {
        this._telemetryCache.stats[type.toLowerCase()].lost += Math.abs(amount)
      }
    }
  }

  public ArmorReduced(amount: number): void {
    this._telemetryCache.damage_armor_reduced += amount
  }

  public OverchargeHeat(amount: number): void {
    this._telemetryCache.overcharge_heat += amount
  }

  public AddTurn(): void {
    this._telemetryCache.turns += 1
  }

  private mergeTelemetryData(main: TelemetryData, cache: TelemetryData): void {
    for (const key in cache) {
      const cacheValue = cache[key as keyof TelemetryData]
      const mainValue = main[key as keyof TelemetryData]

      if (typeof cacheValue === 'number') {
        main[key] += cacheValue
      } else if (Array.isArray(cacheValue)) {
        const m = main[key] as Record<string, number>[]
        const c = cacheValue as Record<string, number>[]
        for (let i = 0; i < c.length; i++) {
          if (m[i]) {
            for (const subKey in c[i]) {
              m[i][subKey] = (m[i][subKey] || 0) + c[i][subKey]
            }
          } else {
            m[i] = { ...c[i] }
          }
        }
      } else if (typeof cacheValue === 'object' && cacheValue !== null) {
        this.mergeTelemetryData(mainValue as any, cacheValue as any)
      }
    }
  }

  public EndRound(): void {
    if (this.CombatController.IsAIControlled) {
      this._telemetryCache.rounds_ai_control += 1
    }
    if (this.CombatController.Cover) {
      const coverKey = this.CombatController.Cover.toString()
      this._telemetryCache.cover_rounds.push({ [coverKey]: 1 })
    }
    if (this.CombatController.Mounted) {
      this._telemetryCache.rounds_mounted += 1
    } else {
      this._telemetryCache.rounds_dismounted += 1
    }

    //calculate movement for the turn
    const movement = this.CombatController.ActiveActor.StatController.CurrentStats['speed']
    this._telemetryCache.movement += movement
    if (!this.CombatController.Mounted) {
      this._telemetryCache.pilot_movement += movement
    }

    // add cached telemetry to main telemetry
    this.mergeTelemetryData(this.Telemetry, this._telemetryCache)
    this._telemetryCache = getBlankTelemetry()
  }

  public static FormatTelemetry(t: TelemetryData, justify: boolean, lineWidth: number): string {
    let out = `Rounds: ${t.rounds} (${t.rounds_mounted} mounted, ${t.rounds_dismounted} unmounted)\n`
    out += `Movement: ${t.movement} spaces (${t.pilot_movement} unmounted)\n`
    if (justify) {
      out += `\n${this.justify(['Damage', 'Dealt', 'Taken'], justify, lineWidth)}\n`
      for (const e in t.damage) {
        out += `${this.justify([e.toUpperCase(), t.damage[e].gained.toString(), t.damage[e].lost.toString()], justify, lineWidth)}\n`
      }
      out += `\n${this.justify(['Stat', 'Gain', 'Loss'], justify, lineWidth)}\n`
      for (const e in t.stats) {
        out += `${this.justify([e.toUpperCase(), t.stats[e].gained.toString(), t.stats[e].lost.toString()], justify, lineWidth)}\n`
      }
    } else {
      out += `\n`
      for (const e in t.damage) {
        out += `${e.toUpperCase()}: +${t.damage[e].gained} / -${t.damage[e].lost}\n`
      }
      out += `\n`
      for (const e in t.stats) {
        out += `${e.toUpperCase()}: +${t.stats[e].gained} / -${t.stats[e].lost}\n`
      }
    }

    return out
  }

  private static justify(arr, justify = true, lineWidth = 40): string {
    if (!justify) return arr.filter(x => x.length).join('   ')
    if (!arr.length) return ''

    const cols = arr.length

    const step = lineWidth / cols
    const starts = [] as number[]

    for (let i = 0; i < cols; i++) {
      starts.push(Math.floor(i * step))
    }

    let line = Array(lineWidth).fill(' ')

    for (let i = 0; i < cols; i++) {
      const start = starts[i]
      const text = arr[i]

      for (let j = 0; j < text.length && start + j < lineWidth; j++) {
        line[start + j] = text[j]
      }
    }

    return line.join('')
  }
}

export { CombatLog }
export type { CombatLogEntry }
