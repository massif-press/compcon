export const LOG_SCHEMA_VERSION = 2

export type LogSource = 'gm' | 'self'

export type ActorRefType =
  | 'pilot'
  | 'mech'
  | 'npc'
  | 'eidolon'
  | 'deployable'
  | 'doodad'
  | 'unknown'

export interface IActorRef {
  id: string
  originId?: string
  name: string
  type: ActorRefType
  side?: string
  tier?: number
  npcClassId?: string
  npcClassName?: string
  templateIds?: string[]
  templateNames?: string[]
}

export interface IRef {
  id: string
  name: string
}

interface IRollRecord {
  raw: number
  bonus: number
  accuracy: number
  difficulty: number
  accuracyResult: number
  total: number
}

export type HeatChangeReason = 'stabilize' | 'shutdown' | 'effect' | 'cap' | 'cascade' | 'manual'

export type BlockedReason =
  | 'immobilized'
  | 'engaged'
  | 'prone'
  | 'mounted'
  | 'unmounted'
  | 'immune'
  | 'reactor_destroyed'
  | 'shut_down'
  | 'unavailable'
  | 'no_uses'
  | 'insufficient'
  | 'no_target'
  | 'no_weapon'
  | 'ordnance'
  | 'untargetable'
  | 'already_applied'
  | 'unknown_status'

type CheckOutcome = 'success' | 'failure'
type HitOutcome = 'hit' | 'miss' | 'crit'

export interface ILogPayloads {
  'encounter.start': { name: string; sitrep?: string }
  'encounter.end': { result: string; rounds: number }
  'round.start': { round: number }
  'round.end': { round: number }
  'turn.start': { activationsRemaining: number }
  'turn.end': { activationsRemaining: number }

  action: {
    action: IRef
    activation: string
    free?: boolean
    overcharged?: boolean
    heat?: number
    usesSpent?: number
    usesRemaining?: number
  }
  attack: {
    weapon?: IRef
    action?: IRef
    attackType: string
    targetId?: string
    roll?: IRollRecord
    rolled?: number
    defense: string
    defenseValue: number
    result: HitOutcome
    overridden?: boolean
    missedFromInvisibility?: boolean
  }
  damage: {
    targetId?: string
    damageType: string
    rolled?: number
    bonus?: number
    reliable?: number
    incoming: number
    armorReduced: number
    resisted: string[]
    conditions: string[]
    final: number
    ap?: boolean
    irreducible?: boolean
    overkillHeat?: number
    taken: boolean
  }
  heat: {
    amount: number
    current?: number
    cap?: number
    external?: boolean
    dangerZone: boolean
    exposed?: boolean
    cleared?: boolean
    reason?: HeatChangeReason
  }
  save: {
    stat: string
    target: number
    roll?: IRollRecord
    rolled?: number
    result: CheckOutcome
    half?: boolean
  }
  check: {
    stat?: string
    target?: number
    tier?: string
    contested?: boolean
    opposedId?: string
    rolled?: number
    result: string
  }

  'structure.check': ICheckRollPayload
  'stress.check': ICheckRollPayload

  'status.gain': {
    status: IRef
    duration?: string
    selfInflicted?: boolean
    implied?: boolean
    fromId?: string
  }
  'status.lose': {
    status: IRef
    reason: 'expired' | 'removed' | 'cleared' | 'replaced' | 'consumed'
  }
  'resist.change': { damageType: string; condition: string; removed?: boolean }

  move: { spent: number; mode: 'move' | 'boost' | 'other'; granted?: number }
  overcharge: { level: number; cost: string | number; heat: number }

  'deployable.launch': { deployable: IRef; count?: number }
  'deployable.destroy': { deployable: IRef }

  'actor.destroy': { targetId?: string; selfReported?: boolean; cause?: string }
  'pilot.status': { from?: string; to: string }
  'mech.status': { from?: string; to: string }

  repair: { kind: string; cost?: number; restored?: Record<string, number> }
  stabilize: { choices: string[] }

  reload: { items: IRef[] }
  recharge: { item: IRef; roll: number; recharged: boolean }
  meltdown: {
    state: 'scheduled' | 'averted' | 'committed' | 'self_destruct'
    round?: number
    turns?: number
  }
  'core.power': { active: boolean }
  mount: { mounted: boolean; ejected?: boolean }
  'ai.control': { active: boolean }
  cover: { cover: string }
  carry: { mode: 'drag' | 'lift' | 'none' }
  prepare: { prepared: boolean }

  blocked: { action?: IRef; reason: BlockedReason; targetId?: string; overridden?: boolean }
  prompt: { label: string; requestKind: string; answer?: string; skipped?: boolean }

  note: { text: string }
}

interface ICheckRollPayload {
  marked: number
  dice: number[]
  lowest: number
  multipleOnes: boolean
  table: string
  row?: string
  resolved: IResolvedEffect[]
}

interface IResolvedEffect {
  kind: string
  id?: string
  name?: string
  value?: number
  damageType?: string
  delayTurns?: number
  items?: IRef[]
}

export type LogEventKind = keyof ILogPayloads

export const LOG_EVENT_KEYS: Record<LogEventKind, string> = {
  'encounter.start': 'encounterStart',
  'encounter.end': 'encounterEnd',
  'round.start': 'roundStart',
  'round.end': 'roundEnd',
  'turn.start': 'turnStart',
  'turn.end': 'turnEnd',
  action: 'action',
  attack: 'attack',
  damage: 'damage',
  heat: 'heat',
  save: 'save',
  check: 'check',
  'structure.check': 'structureCheck',
  'stress.check': 'stressCheck',
  'status.gain': 'statusGain',
  'status.lose': 'statusLose',
  'resist.change': 'resistChange',
  move: 'move',
  overcharge: 'overcharge',
  'deployable.launch': 'deployableLaunch',
  'deployable.destroy': 'deployableDestroy',
  'actor.destroy': 'actorDestroy',
  'pilot.status': 'pilotStatus',
  'mech.status': 'mechStatus',
  repair: 'repair',
  stabilize: 'stabilize',
  reload: 'reload',
  recharge: 'recharge',
  meltdown: 'meltdown',
  'core.power': 'corePower',
  mount: 'mount',
  'ai.control': 'aiControl',
  cover: 'cover',
  carry: 'carry',
  prepare: 'prepare',
  blocked: 'blocked',
  prompt: 'prompt',
  note: 'note',
}

export const LOG_EVENT_KINDS = Object.keys(LOG_EVENT_KEYS) as readonly LogEventKind[]

const KNOWN_KINDS: ReadonlySet<string> = new Set(LOG_EVENT_KINDS)

export interface ILogEnvelope {
  seq: number
  source: LogSource
  encounterId: string
  round: number
  turn: number
  actorId: string
  campaignId?: string
  missionId?: string
  group?: string
  ts?: number
}

export type ILogEvent<K extends LogEventKind = LogEventKind> = Omit<ILogEnvelope, 'ts'> & {
  id: string
  ts: number
  v: number
  kind: K
  payload: ILogPayloads[K]
}

export interface ILogStream {
  v: number
  encounterId: string
  encounterName: string
  campaignId?: string
  missionId?: string
  start: number
  end?: number
  rounds: number
  result?: string
  source: LogSource
  participants: IActorRef[]
  events: ILogEvent[]
}

export function makeEvent<K extends LogEventKind>(
  kind: K,
  payload: ILogPayloads[K],
  envelope: ILogEnvelope
): ILogEvent<K> {
  return {
    id: crypto.randomUUID(),
    ts: envelope.ts ?? Date.now(),
    v: LOG_SCHEMA_VERSION,
    seq: envelope.seq,
    source: envelope.source,
    encounterId: envelope.encounterId,
    campaignId: envelope.campaignId,
    missionId: envelope.missionId,
    round: envelope.round,
    turn: envelope.turn,
    actorId: envelope.actorId,
    group: envelope.group,
    kind,
    payload,
  }
}

export function isKnownKind(kind: unknown): kind is LogEventKind {
  return typeof kind === 'string' && KNOWN_KINDS.has(kind)
}

export function readEvent(raw: unknown): ILogEvent | null {
  if (!raw || typeof raw !== 'object') return null
  const e = raw as Partial<ILogEvent> & Record<string, unknown>
  if (!isKnownKind(e.kind)) return null
  return {
    ...e,
    id: typeof e.id === 'string' ? e.id : crypto.randomUUID(),
    seq: typeof e.seq === 'number' ? e.seq : 0,
    ts: typeof e.ts === 'number' ? e.ts : 0,
    v: typeof e.v === 'number' ? e.v : LOG_SCHEMA_VERSION,
    source: e.source === 'gm' || e.source === 'self' ? e.source : 'gm',
    encounterId: typeof e.encounterId === 'string' ? e.encounterId : '',
    round: typeof e.round === 'number' ? e.round : 0,
    turn: typeof e.turn === 'number' ? e.turn : 0,
    actorId: typeof e.actorId === 'string' ? e.actorId : '',
    group: typeof e.group === 'string' ? e.group : undefined,
    kind: e.kind,
    payload: (e.payload ?? {}) as ILogPayloads[LogEventKind],
  }
}

export function readStream(raw: unknown): ILogStream | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Partial<ILogStream> & Record<string, unknown>
  if (typeof s.encounterId !== 'string' || !s.encounterId) return null
  return {
    v: typeof s.v === 'number' ? s.v : LOG_SCHEMA_VERSION,
    encounterId: s.encounterId,
    encounterName: typeof s.encounterName === 'string' ? s.encounterName : '',
    campaignId: s.campaignId,
    missionId: s.missionId,
    start: typeof s.start === 'number' ? s.start : 0,
    end: typeof s.end === 'number' ? s.end : undefined,
    rounds: typeof s.rounds === 'number' ? s.rounds : 0,
    result: typeof s.result === 'string' ? s.result : undefined,
    source: s.source === 'self' ? 'self' : 'gm',
    participants: Array.isArray(s.participants) ? (s.participants as IActorRef[]) : [],
    events: Array.isArray(s.events) ? (s.events.map(readEvent).filter(Boolean) as ILogEvent[]) : [],
  }
}

const UNKNOWN_ACTOR: IActorRef = { id: '', name: 'Unknown', type: 'unknown' }

export function resolveActor(stream: Pick<ILogStream, 'participants'>, id?: string): IActorRef {
  if (!id) return UNKNOWN_ACTOR
  return stream.participants.find(p => p.id === id) ?? { ...UNKNOWN_ACTOR, id }
}
