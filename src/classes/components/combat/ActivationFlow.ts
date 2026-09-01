import { Flow } from './Flow'
import type { IFlowStep } from './Flow'
import type { CombatController } from './CombatController'
import type { Frequency } from '@/classes/Frequency'

interface IActivationState {
  cc: CombatController
  activation: string
  actionId?: string
  useId?: string
  frequency?: Frequency
  heat?: number
  reaction?: string
  weapon?: any
  legal: boolean
  blockedBy?: string
}

const FREE = ['free', 'none']

const normalization: IFlowStep<IActivationState> = {
  Name: 'activation-normalization',
  Run: s => {
    s.activation = (s.activation || 'free').toLowerCase().replace(' ', '')
    return 'continue'
  },
}

const legality: IFlowStep<IActivationState> = {
  Name: 'legality',
  Run: s => {
    if (!s.cc.CanActivate(s.reaction ?? s.activation)) {
      s.legal = false
      s.blockedBy = 'activation'
      return 'halt'
    }
    if (s.actionId && !s.cc.CanTakeAction(s.actionId, s.activation, s.useId)) {
      s.legal = false
      s.blockedBy = 'uses'
      return 'halt'
    }
    s.legal = true
    return 'continue'
  },
}

const consumeUses: IFlowStep<IActivationState> = {
  Name: 'consume-uses',
  Run: s => {
    if (s.actionId) s.cc.MarkActionUsed(s.actionId, s.frequency)
    if (s.useId && s.useId !== s.actionId) s.cc.MarkActionUsed(s.useId, s.frequency)
    return 'continue'
  },
}

const heatApplication: IFlowStep<IActivationState> = {
  Name: 'heat-application',
  Run: s => {
    if (s.heat) s.cc.ApplyHeat(s.heat)
    return 'continue'
  },
}

const consume: IFlowStep<IActivationState> = {
  Name: 'consume',
  Run: s => {
    if (s.reaction) s.cc.UseReaction(s.reaction)
    else if (!FREE.includes(s.activation)) s.cc.SetCombatAction(s.activation, false)
    return 'continue'
  },
}

const makeActivationFlow = (): Flow<IActivationState> =>
  new Flow<IActivationState>('ActivationFlow', [
    normalization,
    legality,
    consumeUses,
    heatApplication,
    consume,
  ])

const ActivationFlow = makeActivationFlow()

const braceEffects: IFlowStep<IActivationState> = {
  Name: 'brace-effects',
  Run: s => {
    s.cc.ApplyBraceEffects()
    return 'continue'
  },
}

const overwatchEligibility: IFlowStep<IActivationState> = {
  Name: 'weapon-eligibility',
  Run: s => {
    if (!s.cc.CanOverwatch(s.weapon)) {
      s.legal = false
      s.blockedBy = 'weapon'
      return 'halt'
    }
    return 'continue'
  },
}

const overwatchEffects: IFlowStep<IActivationState> = {
  Name: 'overwatch-effects',
  Run: s => {
    s.cc.Overwatch = true
    s.cc.log('Overwatch: skirmishing as a reaction')
    return 'continue'
  },
}

const BraceFlow = new Flow<IActivationState>('BraceFlow', [
  ActivationFlow.AsStep('activation'),
  braceEffects,
])

const OverwatchFlow = new Flow<IActivationState>('OverwatchFlow', [
  overwatchEligibility,
  makeActivationFlow().AsStep('activation'),
  overwatchEffects,
])

export { ActivationFlow, BraceFlow, OverwatchFlow, makeActivationFlow }
export type { IActivationState }
