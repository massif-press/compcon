import { LOG_SCHEMA_VERSION } from './events'
import type { ILogEvent, ILogStream, IActorRef, LogSource } from './events'

function referencedIds(event: ILogEvent): string[] {
  const p = event.payload as Record<string, unknown>
  return [event.actorId, p.targetId, p.opposedId, p.fromId].filter(
    (v): v is string => typeof v === 'string' && !!v
  )
}

export function concernsActor(event: ILogEvent, actorId: string): boolean {
  return referencedIds(event).includes(actorId)
}

export function extractActorStream(stream: ILogStream, actorId: string): ILogStream {
  const events = stream.events.filter(e => concernsActor(e, actorId))
  const needed = new Set(events.flatMap(referencedIds))
  return {
    ...stream,
    participants: stream.participants.filter(p => needed.has(p.id)),
    events,
    rounds: events.reduce((max, e) => Math.max(max, e.round), 0),
    start: events[0]?.ts ?? stream.start,
    end: events[events.length - 1]?.ts ?? stream.end,
  }
}

export function buildStream(
  header: Partial<ILogStream> & Pick<ILogStream, 'encounterId'>,
  participants: IActorRef[],
  events: ILogEvent[],
  source: LogSource = 'gm'
): ILogStream {
  const ordered = [...events].sort((a, b) => a.ts - b.ts || a.seq - b.seq)
  return {
    v: LOG_SCHEMA_VERSION,
    encounterName: '',
    start: ordered[0]?.ts ?? 0,
    end: ordered[ordered.length - 1]?.ts,
    rounds: ordered.reduce((max, e) => Math.max(max, e.round), 0),
    source,
    participants,
    events: ordered,
    ...header,
  }
}

export interface IReconcileCandidate {
  encounterId: string
  encounterName: string
  start: number
  rounds: number
  source: LogSource
}

export function candidateOf(stream: ILogStream): IReconcileCandidate {
  return {
    encounterId: stream.encounterId,
    encounterName: stream.encounterName,
    start: stream.start,
    rounds: stream.rounds,
    source: stream.source,
  }
}

type HeldHeader = Pick<ILogStream, 'encounterId' | 'encounterName' | 'start'>

export function planImport(
  incoming: ILogStream,
  held: HeldHeader[]
): { action: 'replace' | 'add'; targetIndex: number; suggestions: number[] } {
  const exact = held.findIndex(h => h.encounterId === incoming.encounterId)
  if (exact !== -1) return { action: 'replace', targetIndex: exact, suggestions: [] }

  const DAY = 24 * 60 * 60 * 1000
  const suggestions = held
    .map((h, i) => ({ h, i }))
    .filter(
      ({ h }) =>
        (!!incoming.encounterName && h.encounterName === incoming.encounterName) ||
        (!!incoming.start && !!h.start && Math.abs(h.start - incoming.start) < DAY)
    )
    .map(({ i }) => i)

  return { action: 'add', targetIndex: -1, suggestions }
}

export function applyImport(
  incoming: ILogStream,
  held: ILogStream[],
  replaceId?: string
): ILogStream[] {
  const out = held.filter(
    s => s.encounterId !== replaceId && s.encounterId !== incoming.encounterId
  )
  out.push({ ...incoming })
  return out
}
