import type { ILogEvent } from './events'

interface IAttackTally {
  made: number
  hit: number
  crit: number
  missed: number
}

interface IEncounterRollup {
  rounds: number
  turns: number

  movementSpent: number

  damageDealt: Record<string, number>
  damageTaken: Record<string, number>
  damageArmorReduced: number
  totalDealt: number
  totalTaken: number

  heatGained: number
  heatCleared: number
  overchargeHeat: number
  overcharges: number

  attacks: IAttackTally
  savesPassed: number
  savesFailed: number
  checksPassed: number
  checksFailed: number
  structureChecks: number
  stressChecks: number

  killsConfirmed: number
  killsSelfReported: number
  deployablesLaunched: number
  deployablesDestroyed: number

  statusesGained: Record<string, number>
  actionsTaken: Record<string, number>
  labels: Record<string, string>

  mechsLost: number
  destroyed: boolean
}

function blankRollup(): IEncounterRollup {
  return {
    rounds: 0,
    turns: 0,
    movementSpent: 0,
    damageDealt: {},
    damageTaken: {},
    damageArmorReduced: 0,
    totalDealt: 0,
    totalTaken: 0,
    heatGained: 0,
    heatCleared: 0,
    overchargeHeat: 0,
    overcharges: 0,
    attacks: { made: 0, hit: 0, crit: 0, missed: 0 },
    savesPassed: 0,
    savesFailed: 0,
    checksPassed: 0,
    checksFailed: 0,
    structureChecks: 0,
    stressChecks: 0,
    killsConfirmed: 0,
    killsSelfReported: 0,
    deployablesLaunched: 0,
    deployablesDestroyed: 0,
    statusesGained: {},
    actionsTaken: {},
    labels: {},
    mechsLost: 0,
    destroyed: false,
  }
}

function bump(bag: Record<string, number>, key: string, by = 1): void {
  if (!key) return
  bag[key] = (bag[key] ?? 0) + by
}

function label(out: IEncounterRollup, ref: { id?: string; name?: string } | undefined): void {
  if (!ref?.id || !ref.name) return
  out.labels[ref.id] = ref.name
}

function reduceEvents(events: ILogEvent[], perspectiveId?: string): IEncounterRollup {
  const out = blankRollup()
  const mine = (id?: string) => perspectiveId === undefined || id === perspectiveId
  const roundsSeen = new Set<number>()

  for (const e of events) {
    const p = e.payload as any
    const byMe = mine(e.actorId)

    switch (e.kind) {
      case 'round.end':
        if (perspectiveId === undefined || byMe) roundsSeen.add(p.round ?? e.round)
        break
      case 'turn.end':
        if (byMe) out.turns += 1
        break

      case 'move':
        if (byMe) out.movementSpent += p.spent ?? 0
        break

      case 'damage': {
        const type = String(p.damageType ?? 'other').toLowerCase()
        const amount = p.final ?? 0
        const dealt = e.actorId !== p.targetId
        if (byMe && dealt) {
          bump(out.damageDealt, type, amount)
          out.totalDealt += amount
          out.damageArmorReduced += p.armorReduced ?? 0
        }
        if (mine(p.targetId)) {
          bump(out.damageTaken, type, amount)
          out.totalTaken += amount
        }
        break
      }

      case 'heat':
        if (byMe) {
          if (p.cleared) out.heatCleared += p.amount ?? 0
          else out.heatGained += p.amount ?? 0
        }
        break

      case 'overcharge':
        if (byMe) {
          out.overcharges += 1
          out.overchargeHeat += p.heat ?? 0
        }
        break

      case 'attack':
        if (byMe) {
          out.attacks.made += 1
          if (p.result === 'crit') out.attacks.crit += 1
          if (p.result === 'crit' || p.result === 'hit') out.attacks.hit += 1
          if (p.result === 'miss') out.attacks.missed += 1
        }
        break

      case 'save':
        if (byMe) {
          if (p.result === 'success') out.savesPassed += 1
          else out.savesFailed += 1
        }
        break

      case 'check':
        if (byMe) {
          if (p.result === 'success' || p.result === 'win') out.checksPassed += 1
          else out.checksFailed += 1
        }
        break

      case 'structure.check':
        if (byMe) out.structureChecks += 1
        break
      case 'stress.check':
        if (byMe) out.stressChecks += 1
        break

      case 'actor.destroy':
        if (byMe) {
          if (p.selfReported) out.killsSelfReported += 1
          else out.killsConfirmed += 1
        }
        if (mine(p.targetId)) out.destroyed = true
        break

      case 'deployable.launch':
        if (byMe) out.deployablesLaunched += 1
        break
      case 'deployable.destroy':
        if (byMe) out.deployablesDestroyed += 1
        break

      case 'status.gain':
        if (byMe) {
          bump(out.statusesGained, p.status?.id ?? '')
          label(out, p.status)
        }
        break

      case 'action':
        if (byMe) {
          bump(out.actionsTaken, p.action?.id ?? '')
          label(out, p.action)
        }
        break

      case 'mech.status':
        if (byMe && (p.to === 'destroyed' || p.to === 'reactor_destroyed')) out.mechsLost += 1
        break

      default:
        break
    }
  }

  out.rounds = roundsSeen.size
  return out
}

const BAGS = ['damageDealt', 'damageTaken', 'statusesGained', 'actionsTaken'] as const

function mergeRollups(rollups: IEncounterRollup[]): IEncounterRollup {
  return rollups.reduce<IEncounterRollup>((acc, r) => {
    for (const [key, held] of Object.entries(acc)) {
      if (typeof held === 'number') (acc as any)[key] = held + ((r as any)[key] ?? 0)
    }
    for (const k of ['made', 'hit', 'crit', 'missed'] as const) acc.attacks[k] += r.attacks[k]
    for (const bag of BAGS) for (const [k, v] of Object.entries(r[bag] ?? {})) bump(acc[bag], k, v)
    Object.assign(acc.labels, r.labels ?? {})
    return acc
  }, blankRollup())
}

function pad(label: string, value: string, width: number): string {
  const gap = Math.max(1, width - label.length - value.length)
  return `${label}${' '.repeat(gap)}${value}`
}

function formatRollup(r: IEncounterRollup, width = 40): string {
  const lines: string[] = [
    pad('Rounds', String(r.rounds), width),
    pad('Turns', String(r.turns), width),
    pad('Movement spent', String(r.movementSpent), width),
    '',
    pad('Attacks', `${r.attacks.hit}/${r.attacks.made}`, width),
    pad('Crits', String(r.attacks.crit), width),
    pad('Saves', `${r.savesPassed} passed, ${r.savesFailed} failed`, width),
    pad('Kills', `${r.killsConfirmed} (+${r.killsSelfReported} reported)`, width),
    '',
    pad('Damage dealt', String(r.totalDealt), width),
  ]
  for (const [type, n] of Object.entries(r.damageDealt))
    lines.push(pad(`  ${type}`, String(n), width))
  lines.push(pad('Damage taken', String(r.totalTaken), width))
  for (const [type, n] of Object.entries(r.damageTaken))
    lines.push(pad(`  ${type}`, String(n), width))
  lines.push(
    pad('Reduced by armor', String(r.damageArmorReduced), width),
    '',
    pad('Heat gained', String(r.heatGained), width),
    pad('Heat cleared', String(r.heatCleared), width),
    pad('Overcharges', `${r.overcharges} (${r.overchargeHeat} heat)`, width),
    pad('Structure checks', String(r.structureChecks), width),
    pad('Stress checks', String(r.stressChecks), width),
    pad('Deployables', `${r.deployablesLaunched} launched`, width)
  )
  return lines.join('\n')
}

export { reduceEvents, mergeRollups, blankRollup, formatRollup }
export type { IEncounterRollup }
