import { reduceEvents } from './telemetry'
import { LOG_EVENT_KINDS, resolveActor } from './events'
import type { ILogEvent, ILogStream } from './events'
import type { IEncounterRollup } from './telemetry'

export interface IChartRecord {
  encounterId: string
  encounterName: string
  start: number
  result?: string
  rounds: number
  rollup: IEncounterRollup
}

interface ISeries {
  label: string
  key?: string
  data: number[]
  color?: string
}

interface ICategorySlice {
  key: string
  label: string
  value: number
}

interface IChartData {
  labels: string[]
  series: ISeries[]
}

interface IPoint {
  x: number
  y: number
  label: string
  key: string
  size?: number
}

const byDate = (a: IChartRecord, b: IChartRecord) => a.start - b.start

const series = (label: string, data: number[], key = label): ISeries => ({ label, key, data })

function perEncounter(
  records: IChartRecord[],
  fallback: string,
  defs: [string, (r: IChartRecord) => number][]
): IChartData {
  const { sorted, labels } = byEncounter(records, fallback)
  return { labels, series: defs.map(([label, pick]) => series(label, sorted.map(pick))) }
}

function byEncounter(
  records: IChartRecord[],
  fallback: string
): { sorted: IChartRecord[]; labels: string[] } {
  const sorted = [...records].sort(byDate)
  return { sorted, labels: sorted.map(r => r.encounterName || fallback) }
}

export function titleCase(key: string): string {
  return key.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function damageByType(
  rollup: IEncounterRollup,
  which: 'dealt' | 'taken' = 'dealt',
  order: readonly string[] = []
): ICategorySlice[] {
  const bag = which === 'dealt' ? rollup.damageDealt : rollup.damageTaken
  const present = Object.entries(bag).filter(([, v]) => v > 0)
  const rank = (k: string) => {
    const i = order.indexOf(k)
    return i === -1 ? order.length : i
  }
  return present
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([key, value]) => ({ key, label: titleCase(key), value }))
}

export function dealtVsTaken(records: IChartRecord[], fallback = 'Encounter'): IChartData {
  return perEncounter(records, fallback, [
    ['dealt', r => r.rollup.totalDealt],
    ['taken', r => r.rollup.totalTaken],
  ])
}

export function cumulativeDamage(records: IChartRecord[], fallback = 'Encounter'): IChartData {
  let running = 0
  return perEncounter(records, fallback, [['cumulative', r => (running += r.rollup.totalDealt)]])
}

export function accuracyOverTime(
  records: IChartRecord[],
  fallback = 'Encounter'
): IChartData & { average: number } {
  const { sorted, labels } = byEncounter(records, fallback)
  const pct = (hit: number, made: number) => Math.max(0, Math.min(100, (hit / made) * 100))
  const rate = (r: IChartRecord) =>
    r.rollup.attacks.made ? pct(r.rollup.attacks.hit, r.rollup.attacks.made) : NaN

  const made = sorted.reduce((n, r) => n + r.rollup.attacks.made, 0)
  const hit = sorted.reduce((n, r) => n + r.rollup.attacks.hit, 0)

  return {
    labels,
    series: [series('accuracy', sorted.map(rate))],
    average: made ? pct(hit, made) : 0,
  }
}

export function checkOutcomes(rollup: IEncounterRollup): IChartData {
  return {
    labels: ['saves', 'checks'],
    series: [
      series('passed', [rollup.savesPassed, rollup.checksPassed]),
      series('failed', [rollup.savesFailed, rollup.checksFailed]),
    ],
  }
}

export function heatSources(records: IChartRecord[], fallback = 'Encounter'): IChartData {
  return perEncounter(records, fallback, [
    ['overcharge', r => r.rollup.overchargeHeat],
    ['other', r => Math.max(0, r.rollup.heatGained - r.rollup.overchargeHeat)],
  ])
}

export function rankedBag(
  rollup: IEncounterRollup,
  which: 'actions' | 'statuses',
  top = 10
): ICategorySlice[] {
  const bag = which === 'actions' ? rollup.actionsTaken : rollup.statusesGained
  return Object.entries(bag)
    .filter(([k]) => !!k)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, top)
    .map(([key, value]) => ({
      key,
      label: rollup.labels?.[key] ?? titleCase(key),
      value,
    }))
}

function roundsIn(events: ILogEvent[]): number[] {
  const max = events.reduce((n, e) => Math.max(n, e.round), 0)
  return Array.from({ length: Math.max(max, 1) }, (_, i) => i + 1)
}

function damageIn(events: ILogEvent[], round: number, pick: (e: ILogEvent) => boolean): number {
  return events
    .filter(e => e.kind === 'damage' && e.round === round && pick(e))
    .reduce((n, e) => n + ((e.payload as any).final ?? 0), 0)
}

export function damagePerRound(stream: ILogStream, actorId: string): IChartData {
  const rounds = roundsIn(stream.events)
  const bucket = (pick: (e: ILogEvent) => boolean) =>
    rounds.map(round => damageIn(stream.events, round, pick))

  return {
    labels: rounds.map(String),
    series: [
      series(
        'taken',
        bucket(e => (e.payload as any).targetId === actorId)
      ),
      series(
        'dealt',
        bucket(e => e.actorId === actorId)
      ),
    ],
  }
}

export function heatCurve(stream: ILogStream, actorId: string): IChartData & { cap: number } {
  const rounds = roundsIn(stream.events)
  const heats = stream.events.filter(e => e.kind === 'heat' && e.actorId === actorId)
  const cap = heats.reduce((n, e) => Math.max(n, (e.payload as any).cap ?? 0), 0)

  let held = 0
  const data = rounds.map(round => {
    const last = [...heats].reverse().find(e => e.round === round)
    const current = last ? (last.payload as any).current : undefined
    if (typeof current === 'number') held = current
    return held
  })

  return { labels: rounds.map(String), series: [series('heat', data)], cap }
}

export function eventTimeline(stream: ILogStream, actorId?: string, top = 6): IChartData {
  const events = actorId ? stream.events.filter(e => e.actorId === actorId) : stream.events
  const rounds = roundsIn(events)

  const totals = new Map<string, number>()
  for (const e of events) totals.set(e.kind, (totals.get(e.kind) ?? 0) + 1)
  const kinds = [...totals.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, top)
    .map(([kind]) => kind)
    .sort((a, b) => LOG_EVENT_KINDS.indexOf(a as any) - LOG_EVENT_KINDS.indexOf(b as any))

  return {
    labels: rounds.map(String),
    series: kinds.map(kind =>
      series(
        titleCase(kind),
        rounds.map(round => events.filter(e => e.kind === kind && e.round === round).length),
        kind
      )
    ),
  }
}

interface IGroupSlice {
  key: string
  label: string
  encounters?: number
  rollup: IEncounterRollup
}

export function threatScatter(groups: Required<IGroupSlice>[]): IPoint[] {
  return groups.map(g => ({
    key: g.key,
    label: g.label,
    x: g.rollup.totalDealt,
    y: g.rollup.totalTaken,
    size: g.encounters,
  }))
}

export function lethalityPerAppearance(groups: Required<IGroupSlice>[]): ICategorySlice[] {
  return groups
    .map(g => ({
      key: g.key,
      label: g.label,
      value: g.encounters
        ? (g.rollup.killsConfirmed + g.rollup.killsSelfReported) / g.encounters
        : 0,
    }))
    .sort((a, b) => b.value - a.value)
}

export function roundHistogram(records: { rounds: number }[]): ICategorySlice[] {
  const buckets = new Map<number, number>()
  for (const r of records) buckets.set(r.rounds, (buckets.get(r.rounds) ?? 0) + 1)
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([rounds, count]) => ({ key: String(rounds), label: String(rounds), value: count }))
}

export function damageShare(stream: ILogStream, types: string[] = ['pilot']): ICategorySlice[] {
  return stream.participants
    .filter(p => types.includes(p.type))
    .map(p => ({
      key: p.id,
      label: p.name,
      value: reduceEvents(stream.events, p.id).totalDealt,
    }))
    .filter(s => s.value > 0)
}

export function attackMix(groups: IGroupSlice[]): IChartData {
  return {
    labels: groups.map(g => g.label),
    series: [
      series(
        'crit',
        groups.map(g => g.rollup.attacks.crit)
      ),
      series(
        'hit',
        groups.map(g => Math.max(0, g.rollup.attacks.hit - g.rollup.attacks.crit))
      ),
      series(
        'miss',
        groups.map(g => g.rollup.attacks.missed)
      ),
    ],
  }
}

export function damageBySide(stream: ILogStream): IChartData {
  const rounds = roundsIn(stream.events)
  const sideOf = (id?: string) => (id ? (resolveActor(stream, id).side ?? 'unknown') : 'unknown')

  const sides = [...new Set(stream.participants.map(p => p.side ?? 'unknown'))].sort()

  return {
    labels: rounds.map(String),
    series: sides.map(side => {
      let running = 0
      return series(
        side,
        rounds.map(round => {
          running += damageIn(stream.events, round, e => sideOf(e.actorId) === side)
          return running
        })
      )
    }),
  }
}
