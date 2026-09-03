import { Flow } from './Flow'
import type { IFlowStep } from './Flow'
import { checkSources, totalBonus, totalAccDiff } from '../SkillCheckRules'
import type { ICheckSources } from '../SkillCheckRules'

type CheckTier = '' | 'risky' | 'heroic'
type CheckOutcome = 'success' | 'failure' | 'win' | 'lose'

interface ISkillCheckState {
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
  blockedBy?: string
}

const checkStat: IFlowStep<ISkillCheckState> = {
  Name: 'check-sources',
  Run: s => {
    s.sources = checkSources(s.cc, s.stat)
    if (s.bonus === undefined) s.bonus = totalBonus(s.sources, s.difficult)
    if (s.accDiff === undefined) s.accDiff = totalAccDiff(s.sources)
    return 'continue'
  },
}

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
    s.blockedBy = 'no-target'
    return 'halt'
  },
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

const outcome: IFlowStep<ISkillCheckState> = {
  Name: 'outcome',
  Run: s => {
    if (s.contested) s.outcome = (s.roll as number) >= (s.contestRoll as number) ? 'win' : 'lose'
    else s.outcome = (s.roll as number) >= s.targetValue ? 'success' : 'failure'
    return 'continue'
  },
}

const record: IFlowStep<ISkillCheckState> = {
  Name: 'record',
  Run: s => {
    const label = s.stat ? `${s.stat} check` : 'check'
    const tier = s.tier ? ` (${s.tier})` : ''
    const against = s.contested
      ? `contested ${s.roll} vs ${s.contestRoll}`
      : `${s.roll} vs ${s.targetValue}`
    s.cc.log(`Skill check: ${label}${tier} ${against} - ${s.outcome}`)
    return 'continue'
  },
}

const SkillCheckFlow = new Flow<ISkillCheckState>('SkillCheckFlow', [
  checkStat,
  checkRoll,
  contestTarget,
  contestRoll,
  outcome,
  record,
])

function skillCheckState(
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

export { SkillCheckFlow, skillCheckState }
export type { ISkillCheckState, CheckTier }
