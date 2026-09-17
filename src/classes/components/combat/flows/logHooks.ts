import { withLogGroup } from '../log/CombatLogRecorder'
import type { IFlowHooks, IFlowRequest } from './Flow'
import type { BlockedReason, IRef } from '../log/events'
import { actionRef } from '../log/refs'

interface ICombatFlowState {
  cc?: { Record: (kind: any, payload: any) => void; FindAction?: (id: string) => any }
  blockedBy?: BlockedReason
  actionId?: string
  weapon?: { ID?: string; Name?: string }
}

const groups = new WeakMap<object, string>()

export function groupOf(state: object): string {
  let id = groups.get(state)
  if (!id) {
    id = crypto.randomUUID()
    groups.set(state, id)
  }
  return id
}

function blockedAction(s: ICombatFlowState): IRef | undefined {
  if (s.weapon?.Name) return { id: s.weapon.ID ?? '', name: s.weapon.Name }
  if (s.actionId) return actionRef(s.actionId, s.cc?.FindAction?.(s.actionId)?.Name)
  return undefined
}

function describeAnswer(input: unknown): { answer?: string; skipped?: boolean } {
  if (input === undefined || input === null) return {}
  if (typeof input === 'object') {
    const o = input as Record<string, unknown>
    if (o.skip) return { skipped: true }
    const answered = Object.entries(o).find(
      ([k, v]) => k !== 'skip' && v !== undefined && v !== null
    )
    return answered ? { answer: `${answered[0]}: ${answered[1]}` } : {}
  }
  return { answer: String(input) }
}

function recorderOf(state: unknown): ICombatFlowState['cc'] | undefined {
  const s = state as ICombatFlowState
  return typeof s?.cc?.Record === 'function' ? s.cc : undefined
}

export const combatLogHooks: IFlowHooks<any> = {
  Scope: (state, run) => withLogGroup(run, groupOf(state as object)),

  OnHalt: state => {
    const cc = recorderOf(state)
    const s = state as ICombatFlowState
    if (!cc || !s.blockedBy) return
    cc.Record('blocked', { action: blockedAction(s), reason: s.blockedBy })
  },

  OnResume: (state, request: IFlowRequest, input: unknown) => {
    const cc = recorderOf(state)
    if (!cc) return
    cc.Record('prompt', {
      label: request.label,
      requestKind: request.kind,
      ...describeAnswer(input),
    })
  },
}
