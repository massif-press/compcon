import { Flow, step } from './Flow'
import type { IFlowStep } from './Flow'
import { CompendiumStore } from '@/features/compendium/store'
import { ruleFor } from '../StatusRules'
import { Status } from '@/classes/Status'
import type { expiration } from '../Expiration'
import type { StatusController } from '../StatusController'
import type { CombatController } from '../CombatController'
import type { BlockedReason } from '../log/events'
import { combatLogHooks } from './logHooks'

interface IAddStatusState {
  sc: StatusController
  cc: CombatController
  statusID: string
  expires?: any
  selfInflicted: boolean
  status?: Status
  resolvedExpires?: expiration
  applied: boolean
  blockedBy?: BlockedReason
}

const statusLookup: IFlowStep<IAddStatusState> = {
  Name: 'status-lookup',
  Run: s => {
    s.status = CompendiumStore().Statuses.find((x: Status) => x.ID === s.statusID)
    if (s.status) return 'continue'
    s.blockedBy = 'unknown_status'
    return 'halt'
  },
}

const immunity: IFlowStep<IAddStatusState> = {
  Name: 'immunity',
  Run: s => {
    const rule = ruleFor(s.statusID)
    if (!rule?.immuneIf?.some(id => s.sc.HasCondition(id))) return 'continue'
    s.blockedBy = 'immune'
    return 'halt'
  },
  ReportHalt: true,
}

const resolveExpiration = step<IAddStatusState>('resolve-expiration', s => {
  s.resolvedExpires = s.sc.ResolveExpiration(s.expires, s.sc.ActiveController)
})

const applyStatus = step<IAddStatusState>('apply-status', s => {
  const held = s.sc.ActiveStatusController.Statuses
  const existing = held.findIndex(x => x.status.ID === s.status!.ID)
  if (existing === -1) {
    held.push({
      status: s.status!,
      expires: s.resolvedExpires as expiration,
      selfInflicted: s.selfInflicted,
    })
    s.sc.LogStatusGained(s.status!, s.expires, s.selfInflicted)
    s.applied = true
    return
  }
  if (s.resolvedExpires) held[existing].expires = s.resolvedExpires
  if (!s.selfInflicted) held[existing].selfInflicted = false
})

const implications = step<IAddStatusState>('implications', s => {
  if (!s.applied) return
  ruleFor(s.statusID)?.implies?.forEach(id =>
    s.sc.AddStatus(id, s.expires, { selfInflicted: s.selfInflicted })
  )
})

export const AddStatusFlow = new Flow<IAddStatusState>(
  'AddStatusFlow',
  [statusLookup, immunity, resolveExpiration, applyStatus, implications],
  combatLogHooks
)
