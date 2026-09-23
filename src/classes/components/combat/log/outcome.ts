import { MechStatus, NpcStatus, PilotStatus } from '@/classes/enums'
import { eventsFor } from './CombatLogRecorder'
import type { ILogEvent } from './events'

type OutcomeKind = 'pilot.status' | 'mech.status' | 'npc.status'

interface IOutcome {
  status?: string
  pilotStatus?: string
  mechStatus?: string
}

const TO_EVENT: Record<OutcomeKind, Record<string, string>> = {
  'pilot.status': {
    [PilotStatus.Active]: 'active',
    [PilotStatus.Injured]: 'injured',
    [PilotStatus.KIA]: 'kia',
    [PilotStatus.MIA]: 'mia',
    [PilotStatus.Disengaged]: 'disengaged',
  },
  'mech.status': {
    [MechStatus.Operational]: 'operational',
    [MechStatus.Cascade]: 'cascade',
    [MechStatus.Destroyed]: 'destroyed',
    [MechStatus.ReactorMeltdown]: 'reactor_destroyed',
  },
  'npc.status': {
    [NpcStatus.Operational]: 'operational',
    [NpcStatus.Destroyed]: 'destroyed',
    [NpcStatus.Routed]: 'routed',
    [NpcStatus.Disengaged]: 'disengaged',
  },
}

const DEFAULT_EVENT: Record<OutcomeKind, string> = {
  'pilot.status': 'active',
  'mech.status': 'operational',
  'npc.status': 'operational',
}

const DOWN = new Set(['destroyed', 'reactor_destroyed'])

function isDown(value?: string): boolean {
  return !!value && DOWN.has(value)
}

function toEventStatus(kind: OutcomeKind, value: string): string {
  return TO_EVENT[kind][value] ?? value.trim()
}

function fromEventStatus(kind: OutcomeKind, value: string): string {
  const hit = Object.entries(TO_EVENT[kind]).find(([, v]) => v === value)
  return hit ? hit[0] : value
}

function lastStatus(events: ILogEvent[], kind: OutcomeKind, actorId: string): string | undefined {
  let out: string | undefined
  for (const e of events) {
    if (e.actorId !== actorId) continue
    if (e.kind === kind) out = (e.payload as any).to
    else if (kind === 'npc.status' && e.kind === 'mech.status' && isDown((e.payload as any).to))
      out = 'destroyed'
  }
  return out
}

function hpBelowMax(cc: any): boolean {
  const stats = cc?.StatController
  if (!stats) return false
  return Number(stats.CurrentStats?.hp) < Number(stats.MaxStats?.hp)
}

function isPilotCombatant(c: any): boolean {
  return c.type === 'pilot' || c.actor?.ItemType === 'Pilot'
}

function deriveOutcome(c: any): IOutcome {
  const cc = c.actor?.CombatController
  if (!isPilotCombatant(c)) {
    if (cc?.IsDestroyed) return { status: NpcStatus.Destroyed }
    return { status: c.status || NpcStatus.Operational }
  }

  const storedPilot = c.pilotStatus && c.pilotStatus !== PilotStatus.Active ? c.pilotStatus : ''
  let pilotStatus: string = PilotStatus.Active
  if (cc?.IsDead) pilotStatus = PilotStatus.KIA
  else if (storedPilot) pilotStatus = storedPilot
  else if (hpBelowMax(cc)) pilotStatus = PilotStatus.Injured

  const mcc = c.actor?.ActiveMech?.CombatController
  if (!mcc) return { pilotStatus }

  const storedMech = c.mechStatus && c.mechStatus !== MechStatus.Operational ? c.mechStatus : ''
  let mechStatus: string = MechStatus.Operational
  if (mcc.ReactorDestroyed) mechStatus = MechStatus.ReactorMeltdown
  else if (mcc.IsDestroyed) mechStatus = MechStatus.Destroyed
  else if (storedMech) mechStatus = storedMech
  else if (mcc.AIControl && mcc.InCascade) mechStatus = MechStatus.Cascade

  return { pilotStatus, mechStatus }
}

function seedOutcomes(
  combatants: any[],
  current: Record<string, IOutcome>,
  edited: ReadonlySet<string>
): void {
  for (const c of combatants)
    if (!edited.has(c.id) || !current[c.id]) current[c.id] = deriveOutcome(c)
}

function recordDiff(cc: any, events: ILogEvent[], kind: OutcomeKind, chosen?: string): void {
  if (!cc || !chosen) return
  const actorId = cc.RootActor?.ID
  const from = lastStatus(events, kind, actorId) ?? DEFAULT_EVENT[kind]
  const to = toEventStatus(kind, chosen)
  if (!to || to === from) return
  cc.Record(kind, { from, to, manual: true })
}

function commitOutcome(c: any, chosen: IOutcome): void {
  const cc = c.actor?.CombatController
  const mcc = c.actor?.ActiveMech?.CombatController
  const events = eventsFor(c.actor)

  if (isPilotCombatant(c)) {
    recordDiff(cc, events, 'pilot.status', chosen.pilotStatus)
    recordDiff(mcc, events, 'mech.status', chosen.mechStatus)
    if (chosen.pilotStatus) c.pilotStatus = chosen.pilotStatus
    if (chosen.mechStatus) c.mechStatus = chosen.mechStatus
  } else {
    recordDiff(cc, events, 'npc.status', chosen.status)
    if (chosen.status) c.status = chosen.status
  }
}

export { deriveOutcome, seedOutcomes, commitOutcome, toEventStatus, fromEventStatus, isDown }
export type { IOutcome, OutcomeKind }
