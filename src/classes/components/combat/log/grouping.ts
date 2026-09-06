import { reduceEvents, mergeRollups } from './telemetry'
import type { ILogStream, IActorRef } from './events'
import type { IEncounterRollup } from './telemetry'

type GroupBy = 'actor' | 'class' | 'template' | 'origin' | 'type'

interface IActorGroup {
  key: string
  label: string
  by: GroupBy
  actorIds: string[]
  encounters: number
  rollup: IEncounterRollup
}

interface IGroupScope {
  campaignId?: string
  missionId?: string
  types?: string[]
  sides?: string[]
}

function identitiesOf(p: IActorRef): { key: string; label: string; by: GroupBy }[] {
  const out: { key: string; label: string; by: GroupBy }[] = [
    { key: `actor:${p.id}`, label: p.name, by: 'actor' },
    { key: `type:${p.type}`, label: p.type, by: 'type' },
  ]
  if (p.originId) out.push({ key: `origin:${p.originId}`, label: p.name, by: 'origin' })
  if (p.npcClassId) {
    out.push({ key: `class:${p.npcClassId}`, label: p.npcClassName ?? p.npcClassId, by: 'class' })
  }
  ;(p.templateIds ?? []).forEach((id, i) => {
    out.push({ key: `template:${id}`, label: p.templateNames?.[i] ?? id, by: 'template' })
  })
  return out
}

function inScope(stream: ILogStream, p: IActorRef, scope: IGroupScope): boolean {
  if (scope.campaignId && stream.campaignId !== scope.campaignId) return false
  if (scope.missionId && stream.missionId !== scope.missionId) return false
  if (scope.types?.length && !scope.types.includes(p.type)) return false
  if (scope.sides?.length && !scope.sides.includes(p.side ?? '')) return false
  return true
}

function groupStreams(streams: ILogStream[], scope: IGroupScope = {}): IActorGroup[] {
  const groups = new Map<
    string,
    { label: string; by: GroupBy; actorIds: Set<string>; rollups: IEncounterRollup[] }
  >()

  for (const stream of streams) {
    for (const p of stream.participants) {
      if (!inScope(stream, p, scope)) continue
      const rollup = reduceEvents(stream.events, p.id)

      for (const identity of identitiesOf(p)) {
        let group = groups.get(identity.key)
        if (!group) {
          group = { label: identity.label, by: identity.by, actorIds: new Set(), rollups: [] }
          groups.set(identity.key, group)
        }
        group.actorIds.add(p.id)
        group.rollups.push(rollup)
      }
    }
  }

  return [...groups.entries()]
    .map(([key, g]) => ({
      key,
      label: g.label,
      by: g.by,
      actorIds: [...g.actorIds],
      encounters: g.rollups.length,
      rollup: mergeRollups(g.rollups),
    }))
    .sort((a, b) => b.rollup.totalDealt - a.rollup.totalDealt || a.label.localeCompare(b.label))
}

export { groupStreams, identitiesOf }
export type { IActorGroup, GroupBy }
