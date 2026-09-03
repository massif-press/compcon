import { describe, it, expect, beforeEach } from 'vitest'
import { SkillCheckFlow, skillCheckState } from './SkillCheckFlow'
import { makeMech, makePilot } from '@/__tests__/factories'
import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController

const fake = (bonuses: any[], stats: Record<string, number> = {}) => ({
  ActiveActor: {
    FeatureController: { Bonuses: bonuses },
    CombatController: { StatController: { getMax: (k: string) => stats[k] } },
  },
  log: () => undefined,
})

beforeEach(() => {
  m = makeMech(makePilot({ level: 3 }))
  m.SetStats()
  m.CombatController.StatController.resetCurrentStats()
})

describe('SkillCheckFlow', () => {
  it('runs its steps in the documented order', () => {
    expect(SkillCheckFlow.Steps).toEqual([
      'check-sources',
      'check-roll',
      'contest-target',
      'contest-roll',
      'outcome',
      'record',
    ])
  })

  it('waits for the roll, then reports the outcome against the value the GM set', () => {
    const s = skillCheckState({ cc: cc(), targetValue: 15 })

    const first = SkillCheckFlow.Begin(s)
    expect(first.outcome).toBe('awaiting')
    expect(first.pending).toBe('check-roll')

    const second = SkillCheckFlow.Resume(first, { roll: 14 })
    expect(second.outcome).toBe('complete')
    expect(second.state.outcome).toBe('failure')

    const third = SkillCheckFlow.Begin(skillCheckState({ cc: cc(), targetValue: 15, roll: 15 }))
    expect(third.state.outcome).toBe('success')
  })

  it('keeps a bonus the GM edited rather than recomputing it', () => {
    const s = skillCheckState({ cc: cc(), bonus: 99, accDiff: -2 })
    SkillCheckFlow.Begin(s)

    expect(s.bonus).toBe(99)
    expect(s.accDiff).toBe(-2)
    expect(s.sources).toBeDefined()
  })

  it('refuses a contested check with no opponent, before asking for any roll', () => {
    const s = skillCheckState({ cc: cc(), contested: true, roll: 12 })

    const r = SkillCheckFlow.Begin(s)
    expect(r.outcome).toBe('halted')
    expect(r.pending).toBe('contest-target')
    expect(r.state.blockedBy).toBe('no-target')
  })

  it('asks for both rolls in a contested check and names the winner, ties going to the actor', () => {
    const s = skillCheckState({ cc: cc(), contested: true, target: {} })

    const first = SkillCheckFlow.Begin(s)
    expect(first.pending).toBe('check-roll')

    const second = SkillCheckFlow.Resume(first, { roll: 12 })
    expect(second.outcome).toBe('awaiting')
    expect(second.pending).toBe('contest-roll')

    const third = SkillCheckFlow.Resume(second, { roll: 12 })
    expect(third.outcome).toBe('complete')
    expect(third.state.outcome).toBe('win')

    const lost = SkillCheckFlow.Begin(
      skillCheckState({ cc: cc(), contested: true, target: {}, roll: 8, contestRoll: 9 })
    )
    expect(lost.state.outcome).toBe('lose')
  })

  it('records the tier the GM chose without setting a target value from it', () => {
    const logs: string[] = []
    const s = skillCheckState({
      cc: { ...fake([], {}), log: (str: string) => logs.push(str) },
      stat: 'systems',
      tier: 'heroic',
      roll: 18,
    })

    SkillCheckFlow.Begin(s)

    expect(s.targetValue).toBe(10)
    expect(logs).toEqual(['Skill check: systems check (heroic) 18 vs 10 - success'])
  })
})
