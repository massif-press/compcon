import { Flow, step } from './Flow'
import type { IFlowStep } from './Flow'
import { checkSources, totalBonus, totalAccDiff } from '../SkillCheckRules'
import type { ICheckSources } from '../SkillCheckRules'
import type { BlockedReason } from '../log/events'
import { combatLogHooks } from './logHooks'

export type CheckTier = '' | 'risky' | 'heroic'
type CheckOutcome = 'success' | 'failure' | 'win' | 'lose'

export interface ISkillCheckState {
  cc: any
  stat: string
  tier: CheckTier
  difficult: boolean
  contested: boolean
  target?: any
  targetValue: number
  sources?: ICheckSources
  bonus?: number
  accDiff?: number
  roll?: number
  contestRoll?: number
  outcome?: CheckOutcome
  blockedBy?: BlockedReason
}

const checkStat = step<ISkillCheckState>('check-sources', s => {
  s.sources = checkSources(s.cc, s.stat)
  if (s.bonus === undefined) s.bonus = totalBonus(s.sources, s.difficult)
  if (s.accDiff === undefined) s.accDiff = totalAccDiff(s.sources)
})

const checkRoll: IFlowStep<ISkillCheckState> = {
  Name: 'check-roll',
  Run: (s, input) => {
    const answer = input as { roll?: number } | undefined
    if (typeof answer?.roll === 'number') s.roll = answer.roll
    return typeof s.roll === 'number' ? 'continue' : 'await'
  },
}

const contestTarget: IFlowStep<ISkillCheckState> = {
  Name: 'contest-target',
  Run: s => {
    if (!s.contested || s.target) return 'continue'
    s.blockedBy = 'no_target'
    return 'halt'
  },
  ReportHalt: true,
}

const contestRoll: IFlowStep<ISkillCheckState> = {
  Name: 'contest-roll',
  Run: (s, input) => {
    if (!s.contested) return 'continue'
    const answer = input as { roll?: number } | undefined
    if (typeof answer?.roll === 'number') s.contestRoll = answer.roll
    return typeof s.contestRoll === 'number' ? 'continue' : 'await'
  },
}

const outcome = step<ISkillCheckState>('outcome', s => {
  if (s.contested) s.outcome = (s.roll as number) >= (s.contestRoll as number) ? 'win' : 'lose'
  else s.outcome = (s.roll as number) >= s.targetValue ? 'success' : 'failure'
})

const record = step<ISkillCheckState>('record', s => {
  s.cc.Record('check', {
    stat: s.stat,
    target: s.targetValue,
    tier: s.tier || undefined,
    contested: s.contested,
    opposedId: s.target?.Parent?.ID,
    rolled: s.roll,
    result: s.outcome as string,
  })
})

export const SkillCheckFlow = new Flow<ISkillCheckState>(
  'SkillCheckFlow',
  [checkStat, checkRoll, contestTarget, contestRoll, outcome, record],
  combatLogHooks
)

export function skillCheckState(
  over: Partial<ISkillCheckState> & Pick<ISkillCheckState, 'cc'>
): ISkillCheckState {
  return {
    stat: 'hull',
    tier: '',
    difficult: false,
    contested: false,
    targetValue: 10,
    ...over,
  }
}
