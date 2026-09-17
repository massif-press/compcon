import type { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
import type { ActiveEventTarget } from '@/classes/components/feature/active_effects/effect_events/eventTarget'

export function killTargets(events: ActiveEffectEvent[]): ActiveEventTarget[] {
  const seen = new Set<ActiveEventTarget>()
  for (const e of events) {
    if (!e || e.IsSelfOnly) continue
    for (const t of (e.Targets ?? []) as ActiveEventTarget[]) {
      if (t) seen.add(t)
    }
  }
  return [...seen]
}
