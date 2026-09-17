import { Flow, step } from './Flow'
import type { IFlowStep } from './Flow'
import type { CombatController } from '../CombatController'
import type { Frequency } from '@/classes/Frequency'
import type { BlockedReason } from '../log/events'
import { actionRef } from '../log/refs'
import { combatLogHooks } from './logHooks'

export interface IActivationState {
  cc: CombatController
  activation: string
  actionId?: string
  useId?: string
  frequency?: Frequency
  heat?: number
  reaction?: string
  logActivation?: string
  weapon?: any
  force?: boolean
  recorded?: boolean
  legal: boolean
  blockedBy?: BlockedReason
}

const FREE = ['free', 'none']

const normalization = step<IActivationState>('activation-normalization', s => {
  s.activation = (s.activation || 'free').toLowerCase().replace(' ', '')
})

const legality: IFlowStep<IActivationState> = {
  Name: 'legality',
  Run: s => {
    const blocked = activationBlock(s)
    if (!blocked) {
      s.legal = true
      return 'continue'
    }
    s.blockedBy = blocked
    if (!s.force) {
      s.legal = false
      return 'halt'
    }
    s.cc.Record('blocked', {
      action: s.actionId
        ? actionRef(s.actionId, s.cc.FindAction(s.actionId)?.Name)
        : undefined,
      reason: blocked,
      overridden: true,
    })
    s.legal = true
    return 'continue'
  },
  ReportHalt: true,
}

export function activationBlock(s: IActivationState): BlockedReason | undefined {
  if (!s.cc.CanActivate(s.reaction ?? s.activation, s.actionId)) return 'insufficient'
  if (s.actionId && !s.cc.CanTakeAction(s.actionId, s.activation, s.useId))
    return !s.frequency || s.frequency.Unlimited ? 'duplicate' : 'no_uses'
  return undefined
}

const consumeUses = step<IActivationState>(
  'consume-uses',
  s => {
    if (s.actionId) s.cc.MarkActionUsed(s.actionId, s.frequency)
    if (s.useId && s.useId !== s.actionId) s.cc.MarkActionUsed(s.useId, s.frequency)
  },
  {
    Undo: s => {
      if (s.actionId) s.cc.RestoreUse(s.actionId)
      if (s.useId && s.useId !== s.actionId) s.cc.RestoreUse(s.useId)
    },
  }
)

const heatApplication = step<IActivationState>(
  'heat-application',
  s => {
    if (s.heat) s.cc.ApplyHeat(s.heat)
  },
  {
    Undo: s => {
      if (s.heat) s.cc.RemoveHeat(s.heat)
    },
  }
)

const consume = step<IActivationState>(
  'consume',
  s => {
    if (s.reaction) s.cc.UseReaction(s.reaction)
    else if (!FREE.includes(s.activation)) s.cc.SetCombatAction(s.activation, false)
  },
  {
    Undo: s => {
      if (s.reaction) s.cc.RestoreReaction(s.reaction)
      else if (!FREE.includes(s.activation)) s.cc.ResetActivation(s.activation)
    },
  }
)

const REVEALING = ['boost', 'act_boost']

const reveal = step<IActivationState>(
  'reveal',
  s => {
    if (REVEALING.includes(s.activation) || REVEALING.includes((s.actionId || '').toLowerCase()))
      s.cc.DropHostileActionStatuses()
  },
  {
    Undo: 'irreversible',
  }
)

const record = step<IActivationState>('record-action', s => {
  if (s.recorded) return
  const id = s.actionId ?? s.reaction ?? s.activation
  const action = actionRef(id, s.cc.FindAction(id)?.Name)
  s.cc.Record('action', {
    action,
    activation: s.reaction ? 'reaction' : (s.logActivation ?? s.activation),
    free: !s.reaction && FREE.includes(s.activation),
    heat: s.heat || undefined,
    overcharged: s.cc.ActionPoolController.OverchargeApplies || undefined,
    usesRemaining: s.actionId ? s.cc.RemainingUses(s.actionId) : undefined,
  })
})

export const ActivationFlow = new Flow<IActivationState>(
  'ActivationFlow',
  [normalization, legality, consumeUses, record, heatApplication, consume, reveal],
  combatLogHooks
)

const braceEffects = step<IActivationState>('brace-effects', s => {
  s.cc.ApplyBraceEffects()
})

const overwatchEligibility: IFlowStep<IActivationState> = {
  Name: 'weapon-eligibility',
  Run: s => {
    if (!s.force && !s.cc.CanOverwatch(s.weapon)) {
      s.legal = false
      s.blockedBy = 'unavailable'
      return 'halt'
    }
    return 'continue'
  },
  ReportHalt: true,
}

const overwatchEffects = step<IActivationState>('overwatch-effects', s => {
  s.cc.Overwatch = true
})

export const BraceFlow = new Flow<IActivationState>(
  'BraceFlow',
  [ActivationFlow.AsStep('activation'), braceEffects],
  combatLogHooks
)

export const OverwatchFlow = new Flow<IActivationState>(
  'OverwatchFlow',
  [overwatchEligibility, ActivationFlow.AsStep('activation'), overwatchEffects],
  combatLogHooks
)
