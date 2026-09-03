import { describe, it, expect, beforeEach } from 'vitest'
import { checkSources, totalBonus, totalAccDiff } from './SkillCheckRules'
import { makeMech, makePilot } from '@/__tests__/factories'
import type { Mech } from '@/classes/mech/Mech'

let m: Mech
const cc = () => m.CombatController

const fake = (bonuses: any[], stats: Record<string, number> = {}) => ({
  ActiveActor: {
    FeatureController: { Bonuses: bonuses },
    CombatController: { StatController: { getMax: (k: string) => stats[k] } },
  },
})

beforeEach(() => {
  m = makeMech(makePilot({ level: 3 }))
  m.SetStats()
  m.CombatController.StatController.resetCurrentStats()
})

describe('skill check sources', () => {
  it('reads a HASE stat under the name the picker offers, not the name the stat block stores', () => {
    expect(cc().StatController.getMax('agility')).toBe(cc().StatController.getMax('agi'))
    expect(cc().StatController.getMax('systems')).toBe(cc().StatController.getMax('sys'))
    expect(cc().StatController.getMax('engineering')).toBe(cc().StatController.getMax('eng'))
  })

  it('gathers the stat, the matching bonuses, and the check-wide bonuses', () => {
    const sources = checkSources(
      fake(
        [
          { ID: 'hull', Value: 2, Source: 'Frame' },
          { ID: 'check', Value: 1, Source: 'Talent' },
          { ID: 'agility', Value: 5, Source: 'Other stat' },
          { ID: 'check', Accuracy: 1, Source: 'Talent' },
        ],
        { hull: 3 }
      ),
      'hull'
    )

    expect(sources.bonuses.map(b => b.Source)).toEqual(['Frame', 'Talent', 'Hull Stat'])
    expect(sources.accDiff.map(b => b.Source)).toEqual(['Talent'])
  })

  it('takes no stat bonus when no stat is chosen', () => {
    const sources = checkSources(fake([{ ID: 'check', Value: 1, Source: 'Talent' }], { hull: 3 }), '')
    expect(sources.bonuses.map(b => b.Source)).toEqual(['Talent'])
  })

  it('applies the flat difficult modifier the app has always used', () => {
    const sources = { bonuses: [{ Source: 'Frame', Value: 2 }], accDiff: [] }
    expect(totalBonus(sources, false)).toBe(2)
    expect(totalBonus(sources, true)).toBe(1)
  })

  it('nets accuracy and difficulty sources against one another', () => {
    expect(
      totalAccDiff({
        bonuses: [],
        accDiff: [
          { Source: 'Talent', Accuracy: 2 },
          { Source: 'Status', Accuracy: -1 },
        ],
      })
    ).toBe(1)
  })
})
