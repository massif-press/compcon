import { describe, it, expect, beforeEach } from 'vitest'
import { TalentsController } from './TalentsController'
import { Talent } from './Talent'
import { CompendiumStore } from '@/features/compendium/store'
import { Rules } from '@/classes/utility/Rules'
import { makePilot } from '@/__tests__/factories'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const talents = () => pilot.TalentsController
const talent = (i = 0) => Talent.Deserialize(CompendiumStore().Talents[i].ID)

beforeEach(() => {
  pilot = makePilot({ level: 2 })
})

describe('TalentsController points', () => {
  it('starts empty', () => {
    expect(talents().Talents).toEqual([])
    expect(talents().CurrentTalentPoints).toBe(0)
  })

  it('scales the maximum with pilot level', () => {
    expect(talents().MaxTalentPoints).toBe(Rules.MinimumPilotTalents + 2)
  })

  it('counts ranks, not entries', () => {
    talents().AddTalent(talent())
    talents().AddTalent(talent())

    expect(talents().Talents).toHaveLength(1)
    expect(talents().CurrentTalentPoints).toBe(2)
  })
})

describe('TalentsController.AddTalent', () => {
  it('adds at rank 1 then increments', () => {
    talents().AddTalent(talent())
    expect(talents().getTalentRank(talent().ID)).toBe(1)

    talents().AddTalent(talent())
    expect(talents().getTalentRank(talent().ID)).toBe(2)
  })

  it('reports rank 0 for a talent the pilot does not have', () => {
    expect(talents().getTalentRank('t_nope')).toBe(0)
  })

  it('reports no missing talents while every talent resolves', () => {
    talents().AddTalent(talent())
    expect(talents().MissingTalents).toEqual([])
  })

  it('reports a talent whose content pack is gone as missing', () => {
    const target: any = {}
    talents().AddTalent(talent())
    TalentsController.Serialize(pilot, target)
    target.talents[0].id = 't_uninstalled'
    target.talents[0].data = { ...target.talents[0].data, id: 't_uninstalled' }

    const other = makePilot()
    TalentsController.Deserialize(other, target)

    expect(other.TalentsController.MissingTalents).toHaveLength(1)
  })
})

describe('TalentsController.RemoveTalent', () => {
  it('decrements before removing', () => {
    talents().AddTalent(talent())
    talents().AddTalent(talent())

    talents().RemoveTalent(talent())
    expect(talents().getTalentRank(talent().ID)).toBe(1)

    talents().RemoveTalent(talent())
    expect(talents().Talents).toEqual([])
  })

  it('survives removing something that is not there', () => {
    expect(() => talents().RemoveTalent(talent())).not.toThrow()
  })

  it('clears everything', () => {
    talents().AddTalent(talent(0))
    talents().AddTalent(talent(1))
    talents().ClearTalents()

    expect(talents().Talents).toEqual([])
  })
})

describe('TalentsController.Serialize/Deserialize', () => {
  it('round-trips the talent sheet', () => {
    talents().AddTalent(talent(0))
    talents().AddTalent(talent(0))
    talents().AddTalent(talent(1))

    const target: any = {}
    TalentsController.Serialize(pilot, target)

    const other = makePilot()
    TalentsController.Deserialize(other, target)

    expect(other.TalentsController.Talents.map(t => [t.Talent.ID, t.Rank])).toEqual(
      talents().Talents.map(t => [t.Talent.ID, t.Rank])
    )
  })
})
