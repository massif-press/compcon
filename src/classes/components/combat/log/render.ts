import { ActivationType } from '@/classes/enums'
import { slug } from '@/i18n/contentKeys.mjs'
import { LOG_EVENT_KEYS, resolveActor } from './events'
import type { IActorRef, ILogEvent, ILogStream, LogEventKind } from './events'

type Translate = (key: string, params?: Record<string, unknown>) => string
type StreamContext = Pick<ILogStream, 'participants'>

function key(kind: LogEventKind, suffix = ''): string {
  return `active.log.${LOG_EVENT_KEYS[kind]}${suffix}`
}

function annotate(base: string, notes: string[]): string {
  return notes.length ? `${base} (${notes.join(', ')})` : base
}

function withDamageNotes(base: string, p: any, t: Translate): string {
  const notes: string[] = []
  if (p.armorReduced) notes.push(t('active.log.armorReduced', { n: p.armorReduced }))
  p.resisted?.forEach((r: string) => notes.push(t(`active.log.resist.${r}`)))
  p.conditions?.forEach((c: string) => notes.push(t(`active.log.condition.${c}`)))
  if (p.overkillHeat) notes.push(t('active.log.overkill', { n: p.overkillHeat }))
  return annotate(base, notes)
}

const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')

const ACTIVATION_TYPES = new Map(
  Object.values(ActivationType).map(v => [compact(v), v as string])
)

function activationLabel(activation: string | undefined, t: Translate): string {
  if (!activation) return ''
  const canonical = ACTIVATION_TYPES.get(compact(activation)) ?? activation
  const key = `enums.activationType.${slug(canonical)}`
  const label = t(key)
  return label === key ? activation : label
}

const UNTAGGED = new Set<LogEventKind>([
  'encounter.start',
  'encounter.end',
  'round.start',
  'round.end',
  'note',
])

function actorName(actor: IActorRef): string {
  return actor.tier ? `T${actor.tier} ${actor.name}` : actor.name
}

function actorTag(actor: IActorRef, t: Translate): string {
  const parts: string[] = []
  if (actor.side) parts.push(t(`active.log.side.${actor.side}`))
  if (actor.type && actor.type !== 'unknown') parts.push(t(`active.log.type.${actor.type}`))
  return parts.length ? `[${parts.join(' ')}] ` : ''
}

export function renderEvent(
  event: ILogEvent,
  stream: StreamContext,
  t: Translate,
  viewerId?: string
): string {
  const body = renderBody(event, stream, t)
  if (!body || UNTAGGED.has(event.kind)) return body
  const targetId = (event.payload as any).targetId
  if (targetId && targetId === event.actorId) return `[${t('active.log.self')}] ${body}`
  const actor = resolveActor(stream, event.actorId)
  if (viewerId && (actor.id === viewerId || actor.originId === viewerId)) return body
  return actorTag(actor, t) + body
}

function renderBody(event: ILogEvent, stream: StreamContext, t: Translate): string {
  const p = event.payload as any
  const actor = resolveActor(stream, event.actorId)
  const target = () => actorName(resolveActor(stream, p.targetId))
  const who = actorName(actor)

  switch (event.kind) {
    case 'encounter.start':
      return t(key(event.kind), { name: p.name })
    case 'encounter.end':
      return t(key(event.kind), { result: p.result, rounds: p.rounds })
    case 'round.start':
    case 'round.end':
      return t(key(event.kind), { round: p.round })
    case 'turn.start':
    case 'turn.end':
      return t(key(event.kind), { who, n: p.activationsRemaining })

    case 'action':
      return t(key(event.kind, p.free ? 'Free' : p.activation ? '' : 'Plain'), {
        who,
        action: p.action?.name,
        activation: activationLabel(p.activation, t),
      })

    case 'attack': {
      const base = t(key(event.kind, p.targetId ? '' : 'Untargeted'), {
        who,
        target: target(),
        weapon: p.weapon?.name ?? p.action?.name ?? '',
        roll: p.rolled ?? p.roll?.total ?? 0,
        defense: p.defense,
        defenseValue: p.defenseValue,
        result: t(`active.log.hit.${p.result}`),
      })
      const notes: string[] = []
      if (p.overridden) notes.push(t('active.log.attackOverridden'))
      if (p.missedFromInvisibility) notes.push(t('active.log.attackInvisible'))
      return annotate(base, notes)
    }

    case 'damage': {
      const subject = !p.targetId ? 'Untargeted' : p.targetId === event.actorId ? 'Self' : ''
      const base = t(key(event.kind, `${subject}${p.taken ? '' : 'None'}`), {
        who,
        target: target(),
        amount: p.final,
        incoming: p.incoming ?? p.final,
        type: p.damageType,
      })
      return withDamageNotes(base, p, t)
    }

    case 'heat':
      if (p.cleared)
        return t(key(event.kind, 'Cleared'), {
          who,
          n: p.amount,
          reason: t(`active.log.heatReason.${p.reason ?? 'manual'}`),
        })
      return t(key(event.kind, p.dangerZone ? 'DangerZone' : ''), { who, n: p.amount })

    case 'save': {
      const rolled = p.rolled ?? p.roll?.total
      const outcome = p.result === 'success' ? 'Success' : 'Failure'
      return t(key(event.kind, rolled === undefined ? `${outcome}Unrolled` : outcome), {
        who,
        stat: p.stat,
        roll: rolled,
        target: p.target,
      })
    }

    case 'check':
      return t(key(event.kind, p.contested ? 'Contested' : ''), {
        who,
        stat: p.stat || t('common.none'),
        roll: p.rolled ?? 0,
        target: p.target ?? 0,
        opponent: actorName(resolveActor(stream, p.opposedId)),
        result: p.result,
      })

    case 'structure.check':
    case 'stress.check':
      return t(key(event.kind), {
        who,
        dice: p.dice?.join(', ') ?? '',
        lowest: p.lowest,
        row: p.row ?? '',
      })

    case 'status.gain':
      return t(key(event.kind, p.duration ? 'Timed' : ''), {
        who,
        status: p.status?.name,
        duration: p.duration,
      })
    case 'status.lose':
      return t(key(event.kind), { who, status: p.status?.name })
    case 'resist.change':
      return t(key(event.kind, p.removed ? 'Removed' : ''), {
        who,
        type: p.damageType,
        condition: p.condition,
      })

    case 'equipment': {
      const state = String(p.state ?? 'used')
      return t(key(event.kind, state.charAt(0).toUpperCase() + state.slice(1)), {
        who,
        item: p.item?.name,
      })
    }

    case 'counter': {
      const delta = (p.to ?? 0) - (p.from ?? 0)
      return t(key(event.kind, delta < 0 ? 'Down' : 'Up'), {
        who,
        counter: p.counter?.name,
        n: Math.abs(delta),
        to: p.to,
      })
    }

    case 'move':
      if (p.granted) return t(key(event.kind, 'Boosted'), { who, n: p.granted })
      if (p.mode === 'boost') return t(key(event.kind, 'Boost'), { who, n: p.spent })
      return t(key(event.kind), { who, n: p.spent })
    case 'overcharge':
      return t(key(event.kind), { who, level: p.level, heat: p.heat })

    case 'deployable.launch':
    case 'deployable.destroy':
      return t(key(event.kind), { who, name: p.deployable?.name })

    case 'actor.destroy':
      return t(key(event.kind, p.targetId ? '' : 'Unknown'), { who, target: target() })
    case 'pilot.status':
    case 'mech.status':
      return t(key(event.kind), { who, status: p.to })

    case 'repair':
      return t(key(event.kind), { who, kind: p.kind })
    case 'stabilize':
      return t(key(event.kind), { who, choices: (p.choices ?? []).join(', ') })

    case 'reload':
      return t(key(event.kind), { who, items: (p.items ?? []).map((i: any) => i.name).join(', ') })
    case 'recharge':
      return t(key(event.kind, p.recharged ? '' : 'Failed'), {
        who,
        item: p.item?.name,
        roll: p.roll,
      })
    case 'meltdown':
      return t(`active.log.meltdown.${p.state}`, { who, turns: p.turns, round: p.round })
    case 'core.power':
    case 'ai.control':
      return t(key(event.kind, p.active ? '' : 'Off'), { who })
    case 'mount':
      return t(key(event.kind, p.ejected ? 'Eject' : p.mounted ? '' : 'Dismount'), { who })
    case 'cover':
      return t(key(event.kind), { who, cover: p.cover })
    case 'carry':
      return t(`active.log.carry.${p.mode}`, { who })
    case 'prepare':
      return t(key(event.kind, p.prepared ? '' : 'Release'), { who })
    case 'blocked':
      return t(key(event.kind, p.overridden ? 'Overridden' : p.action?.name ? '' : 'NoAction'), {
        who,
        action: p.action?.name ?? '',
        reason: t(`active.log.blockedReason.${p.reason}`),
      })

    case 'prompt':
      if (!p.skipped) return ''
      return t(key(event.kind, 'Skipped'), {
        who,
        label: t(`ui.flow.request.${p.label}`),
      })

    case 'note':
      return p.text ?? ''
  }
}

export interface ILogEntry {
  id: string
  events: ILogEvent[]
  round: number
  turn: number
  ts: number
  kinds: LogEventKind[]
  text: string
}

function foldEvents(events: ILogEvent[]): ILogEvent[][] {
  const groups = new Map<string, ILogEvent[]>()
  const out: ILogEvent[][] = []

  for (const event of events) {
    if (!event.group) {
      out.push([event])
      continue
    }
    const held = groups.get(event.group)
    if (held) {
      held.push(event)
      continue
    }
    const group = [event]
    groups.set(event.group, group)
    out.push(group)
  }

  return out
}

const ROLE: Partial<Record<LogEventKind, number>> = {
  action: 0,
  attack: 1,
  damage: 2,
  heat: 3,
  'status.gain': 4,
  'status.lose': 5,
  'resist.change': 6,
  'actor.destroy': 9,
}

function role(kind: LogEventKind): number {
  return ROLE[kind] ?? 8
}

const ORDERED_SCHEMA_VERSION = 2

const ATTACK_KINDS = ['action', 'attack', 'damage']

function arrangeByAttack(events: ILogEvent[]): ILogEvent[] {
  const attacks = events.filter(e => e.kind === 'attack')
  if (!attacks.length) return events

  const damage = events.filter(e => e.kind === 'damage')
  const kills = events.filter(e => e.kind === 'actor.destroy')
  const claimed = new Set<ILogEvent>()
  const out = events.filter(e => e.kind === 'action')
  const claim = (pool: ILogEvent[], targetId: string) =>
    pool.forEach(e => {
      if (claimed.has(e) || (e.payload as any).targetId !== targetId) return
      claimed.add(e)
      out.push(e)
    })

  for (const attack of attacks) {
    out.push(attack)
    const targetId = (attack.payload as any).targetId
    claim(damage, targetId)
    if (targetId) claim(kills, targetId)
  }

  out.push(...damage.filter(hit => !claimed.has(hit)))
  out.push(...events.filter(e => !ATTACK_KINDS.includes(e.kind) && !claimed.has(e)))
  return out
}

function arrange(events: ILogEvent[]): ILogEvent[] {
  if (events.every(e => (e.v ?? 1) >= ORDERED_SCHEMA_VERSION)) return arrangeByAttack([...events])
  return arrangeByAttack([...events].sort((a, b) => role(a.kind) - role(b.kind) || a.seq - b.seq))
}
function isHitDamage(event: ILogEvent, previous?: ILogEvent): boolean {
  if (event.kind !== 'damage' || previous?.kind !== 'attack') return false
  const p = event.payload as any
  return !!p.taken && p.targetId === (previous.payload as any).targetId
}

function isFollowUpKill(event: ILogEvent, previous?: ILogEvent): boolean {
  if (event.kind !== 'actor.destroy') return false
  if (previous?.kind !== 'damage' && previous?.kind !== 'attack') return false
  const targetId = (event.payload as any).targetId
  return !targetId || targetId === (previous.payload as any).targetId
}

const FOLLOW_ON_KINDS: ReadonlySet<LogEventKind> = new Set<LogEventKind>([
  'status.gain',
  'status.lose',
  'resist.change',
  'damage',
  'heat',
  'actor.destroy',
  'repair',
  'reload',
  'stabilize',
  'recharge',
  'counter',
  'equipment',
  'core.power',
  'deployable.launch',
  'deployable.destroy',
  'overcharge',
  'meltdown',
  'prepare',
  'cover',
  'carry',
])

function sameTurn(a: ILogEvent, b: ILogEvent): boolean {
  return a.actorId === b.actorId && a.round === b.round && a.turn === b.turn
}

function movePayload(event: ILogEvent): any | undefined {
  const p = event.payload as any
  return event.kind === 'move' && !p.granted ? p : undefined
}

function isMoveRun(group: ILogEvent[]): boolean {
  return group.every(e => !!movePayload(e))
}

function mergeable(prev: ILogEvent[], next: ILogEvent[]): boolean {
  if (!sameTurn(prev[0], next[0])) return false
  if (isMoveRun(prev) && isMoveRun(next))
    return movePayload(prev[0])!.mode === movePayload(next[0])!.mode
  if (!prev.some(e => e.kind === 'action')) return false
  return next.every(e => FOLLOW_ON_KINDS.has(e.kind))
}

function collapse(groups: ILogEvent[][]): ILogEvent[][] {
  const out: ILogEvent[][] = []
  for (const group of groups) {
    const prev = out[out.length - 1]
    if (prev && mergeable(prev, group)) prev.push(...group)
    else out.push([...group])
  }
  return out
}

function sumMoves(events: ILogEvent[]): ILogEvent[] {
  const out: ILogEvent[] = []
  for (const event of events) {
    const prev = out[out.length - 1]
    const p = movePayload(event)
    const held = prev ? movePayload(prev) : undefined
    if (p && held && held.mode === p.mode) {
      out[out.length - 1] = { ...prev!, payload: { ...held, spent: held.spent + p.spent } }
      continue
    }
    out.push(event)
  }
  return out
}

function renderEntry(
  events: ILogEvent[],
  stream: StreamContext,
  t: Translate,
  viewerId?: string
): string {
  const arranged = sumMoves(arrange(events))
  const parts: string[] = []

  arranged.forEach((event, index) => {
    const p = event.payload as any
    if (parts.length && isHitDamage(event, arranged[index - 1])) {
      const clause = t('active.log.clause.damage', { amount: p.final, type: p.damageType })
      parts[parts.length - 1] += ` ${withDamageNotes(clause, p, t)}`
      return
    }
    if (parts.length && isFollowUpKill(event, arranged[index - 1])) {
      parts[parts.length - 1] += ` ${t('active.log.clause.kill')}`
      return
    }
    const line =
      index === 0 ? renderEvent(event, stream, t, viewerId) : renderBody(event, stream, t)
    if (line) parts.push(line)
  })

  return parts.join('; ')
}

export function renderStream(
  events: ILogEvent[],
  stream: StreamContext,
  t: Translate,
  viewerId?: string
): ILogEntry[] {
  return collapse(foldEvents(events))
    .map(group => ({
      id: group[0].id,
      events: group,
      round: group[0].round,
      turn: group[0].turn,
      ts: group[0].ts,
      kinds: [...new Set(group.map(e => e.kind))],
      text: renderEntry(group, stream, t, viewerId),
    }))
    .filter(entry => !!entry.text)
}
