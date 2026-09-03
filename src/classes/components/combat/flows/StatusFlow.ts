import { Flow } from './Flow'
import type { IFlowStep } from './Flow'
import { CompendiumStore } from '@/features/compendium/store'
import { ruleFor } from '../StatusRules'
import { Status } from '@/classes/Status'
import type { expiration } from '../Expiration'
import type { StatusController } from '../StatusController'

interface IAddStatusState {
  sc: StatusController
  statusID: string
  expires?: any
  selfInflicted: boolean
  status?: Status
  resolvedExpires?: expiration
  applied: boolean
  blockedBy?: string
}

const statusLookup: IFlowStep<IAddStatusState> = {
  Name: 'status-lookup',
  Run: s => {
    s.status = CompendiumStore().Statuses.find((x: Status) => x.ID === s.statusID)
    if (s.status) return 'continue'
    s.blockedBy = 'unknown'
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
}

const resolveExpiration: IFlowStep<IAddStatusState> = {
  Name: 'resolve-expiration',
  Run: s => {
    s.resolvedExpires = s.sc.ResolveExpiration(s.expires, s.sc.ActiveController)
    return 'continue'
  },
}

const applyStatus: IFlowStep<IAddStatusState> = {
  Name: 'apply-status',
  Run: s => {
    const held = s.sc.ActiveStatusController.Statuses
    const existing = held.findIndex(x => x.status.ID === s.status!.ID)
    if (existing === -1) {
      held.push({
        status: s.status!,
        expires: s.resolvedExpires as expiration,
        selfInflicted: s.selfInflicted,
      })
      s.sc.LogStatusGained(s.status!)
      s.applied = true
      return 'continue'
    }
    if (s.resolvedExpires) held[existing].expires = s.resolvedExpires
    if (!s.selfInflicted) held[existing].selfInflicted = false
    return 'continue'
  },
}

const implications: IFlowStep<IAddStatusState> = {
  Name: 'implications',
  Run: s => {
    if (!s.applied) return 'continue'
    ruleFor(s.statusID)?.implies?.forEach(id =>
      s.sc.AddStatus(id, s.expires, { selfInflicted: s.selfInflicted })
    )
    return 'continue'
  },
}

const AddStatusFlow = new Flow<IAddStatusState>('AddStatusFlow', [
  statusLookup,
  immunity,
  resolveExpiration,
  applyStatus,
  implications,
])

export { AddStatusFlow }
export type { IAddStatusState }
