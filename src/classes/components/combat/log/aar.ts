import { reduceEvents } from './telemetry'
import { renderEvent, statusLabel } from './render'
import { slug } from '@/i18n/contentKeys.mjs'
import { resolveActor } from './events'
import type { IActorRef, ILogEvent, ILogStream } from './events'
import type { IEncounterRollup, Translate } from './telemetry'

type HighlightKey =
  | 'topDealt'
  | 'topTaken'
  | 'topKills'
  | 'biggestHit'
  | 'topCrits'
  | 'topOvercharges'
  | 'topHeatCleared'

interface IHighlight {
  key: HighlightKey
  actorId: string
  name: string
  value: number
  damageType?: string
}

interface IParticipantSummary {
  ref: IActorRef
  rollup: IEncounterRollup
}

const OUTCOME_KINDS = new Set(['actor.destroy', 'pilot.status', 'mech.status', 'npc.status'])

const ROLLUP_HIGHLIGHTS: [HighlightKey, (r: IEncounterRollup) => number][] = [
  ['topDealt', r => r.totalDealt],
  ['topTaken', r => r.totalTaken],
  ['topKills', r => r.killsConfirmed + r.killsSelfReported],
  ['topCrits', r => r.attacks.crit],
  ['topOvercharges', r => r.overcharges],
  ['topHeatCleared', r => r.heatCleared],
]

function summarize(stream: ILogStream): IParticipantSummary[] {
  return stream.participants.map(ref => ({ ref, rollup: reduceEvents(stream.events, ref.id) }))
}

function biggestHit(stream: ILogStream): IHighlight | null {
  let best: ILogEvent | null = null
  for (const e of stream.events) {
    if (e.kind !== 'damage') continue
    const p = e.payload as any
    if (!p.targetId || p.targetId === e.actorId || !(p.final > 0)) continue
    if (!best || p.final > (best.payload as any).final) best = e
  }
  if (!best) return null
  const p = best.payload as any
  return {
    key: 'biggestHit',
    actorId: best.actorId,
    name: resolveActor(stream, best.actorId).name,
    value: p.final,
    damageType: String(p.damageType ?? '').toLowerCase(),
  }
}

function highlights(stream: ILogStream, summaries = summarize(stream)): IHighlight[] {
  const out: IHighlight[] = []
  for (const [key, pick] of ROLLUP_HIGHLIGHTS) {
    let top: IParticipantSummary | null = null
    for (const s of summaries) if (pick(s.rollup) > (top ? pick(top.rollup) : 0)) top = s
    if (top) out.push({ key, actorId: top.ref.id, name: top.ref.name, value: pick(top.rollup) })
    if (key === 'topKills') {
      const hit = biggestHit(stream)
      if (hit) out.push(hit)
    }
  }
  return out
}

function participantIdFor(stream: ILogStream, pilotId: string): string {
  const hit = stream.participants.find(p => p.id === pilotId || p.originId === pilotId)
  return hit?.id ?? pilotId
}

function casualties(stream: ILogStream): ILogEvent[] {
  return stream.events.filter(e => OUTCOME_KINDS.has(e.kind))
}

function sitrep(stream: ILogStream): string | undefined {
  const start = stream.events.find(e => e.kind === 'encounter.start')
  return (start?.payload as any)?.sitrep || undefined
}

function damageTypeLabel(type: string, t: Translate): string {
  const key = `enums.damageType.${slug(type)}`
  const label = t(key)
  return label === key ? type : label
}

function highlightValue(h: IHighlight, t: Translate): string {
  return h.damageType ? `${h.value} ${damageTypeLabel(h.damageType, t)}` : String(h.value)
}

function outcomeText(rollup: IEncounterRollup, t: Translate): string {
  const o = rollup.outcome ?? {}
  return [
    o.pilot && statusLabel('pilot.status', o.pilot, t),
    o.mech && statusLabel('mech.status', o.mech, t),
    o.npc && statusLabel('npc.status', o.npc, t),
  ]
    .filter(Boolean)
    .join(' / ')
}

function rowSummaryText(r: IEncounterRollup, t: Translate): string {
  return t('active.aar.rowSummary', {
    dealt: r.totalDealt,
    taken: r.totalTaken,
    kills: r.killsConfirmed + r.killsSelfReported,
  })
}

function formatReport(stream: ILogStream, t: Translate, result?: string): string {
  const summaries = summarize(stream)
  const k = (name: string, params?: Record<string, unknown>) => t(`active.aar.${name}`, params)
  const lines: string[] = [
    `${stream.encounterName}${result || stream.result ? `: ${result || stream.result}` : ''}`,
    k('roundsValue', { n: stream.rounds }),
    '',
    `// ${t('gm.combatant.combatants')}`,
  ]
  for (const s of summaries) {
    const status = outcomeText(s.rollup, t)
    lines.push(`${s.ref.name}${status ? ` [${status}]` : ''}: ${rowSummaryText(s.rollup, t)}`)
  }
  const notable = highlights(stream, summaries)
  if (notable.length) {
    lines.push('', `// ${k('highlightsTitle')}`)
    for (const h of notable)
      lines.push(`${k(`highlights.${h.key}`)}: ${h.name} (${highlightValue(h, t)})`)
  }
  const lost = casualties(stream)
  if (lost.length) {
    lines.push('', `// ${k('casualtiesTitle')}`)
    for (const e of lost)
      lines.push(`${k('roundTag', { n: e.round })} ${renderEvent(e, stream, t)}`)
  }
  return lines.join('\n')
}

export {
  summarize,
  highlights,
  casualties,
  participantIdFor,
  sitrep,
  highlightValue,
  outcomeText,
  rowSummaryText,
  formatReport,
}
export type { IParticipantSummary }
