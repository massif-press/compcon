import { describe, it, expect, beforeEach } from 'vitest'
import { SkillsController } from './SkillsController'
import { Skill } from './Skill'
import { CompendiumStore } from '@/features/compendium/store'
import { Rules } from '@/classes/utility/Rules'
import { makePilot } from '@/__tests__/factories'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const skills = () => pilot.SkillsController
const skill = (i = 0) => Skill.Deserialize(CompendiumStore().Skills[i].ID)

beforeEach(() => {
  pilot = makePilot({ level: 2 })
})

describe('SkillsController points', () => {
  it('starts empty and short of the maximum', () => {
    expect(skills().Skills).toEqual([])
    expect(skills().CurrentSkillPoints).toBe(0)
    expect(skills().IsMissingSkills).toBe(true)
  })

  it('scales the maximum with pilot level', () => {
    expect(skills().MaxSkillPoints).toBe(Rules.MinimumPilotSkills + 2)
  })

  it('counts ranks, not entries', () => {
    skills().AddSkill(skill(0))
    skills().AddSkill(skill(0))

    expect(skills().Skills).toHaveLength(1)
    expect(skills().CurrentSkillPoints).toBe(2)
  })

  it('reports a full sheet', () => {
    for (let i = 0; i < skills().MaxSkillPoints; i++) skills().AddSkill(skill(i))

    expect(skills().HasFullSkills).toBe(true)
    expect(skills().IsMissingSkills).toBe(false)
  })
})

describe('SkillsController.AddSkill', () => {
  it('adds a new skill at rank 1', () => {
    skills().AddSkill(skill())
    expect(skills().Skills[0].Rank).toBe(1)
  })

  it('increments an existing skill instead of duplicating it', () => {
    skills().AddSkill(skill())
    skills().AddSkill(skill())

    expect(skills().Skills).toHaveLength(1)
    expect(skills().Skills[0].Rank).toBe(2)
  })

  it('keeps the list sorted by title', () => {
    for (let i = 0; i < 4; i++) skills().AddSkill(skill(i))

    const titles = skills().Skills.map(s => s.Title)
    expect(titles).toEqual([...titles].sort())
  })

  it('adds a custom skill from its text', () => {
    skills().AddCustomSkill({ skill: 'Improvise', description: 'd', detail: 't' })

    expect(skills().Skills[0].IsCustom).toBe(true)
    expect(skills().Skills[0].Title).toBe('Improvise')
  })
})

describe('SkillsController.RemoveSkill', () => {
  it('decrements before removing', () => {
    skills().AddSkill(skill())
    skills().AddSkill(skill())

    skills().RemoveSkill(skill())
    expect(skills().Skills).toHaveLength(1)

    skills().RemoveSkill(skill())
    expect(skills().Skills).toEqual([])
  })

  it('survives removing something that is not there', () => {
    expect(() => skills().RemoveSkill(skill())).not.toThrow()
  })

  it('clears everything', () => {
    for (let i = 0; i < 3; i++) skills().AddSkill(skill(i))
    skills().ClearSkills()

    expect(skills().Skills).toEqual([])
    expect(skills().CurrentSkillPoints).toBe(0)
  })
})

describe('SkillsController.GetSkill', () => {
  it('finds by id, and is undefined otherwise', () => {
    skills().AddSkill(skill())

    expect(skills().GetSkill(skill().ID)?.Rank).toBe(1)
    expect(skills().GetSkill('sk_nope')).toBeUndefined()
  })
})

describe('SkillsController.Serialize/Deserialize', () => {
  it('round-trips the skill sheet', () => {
    skills().AddSkill(skill(0))
    skills().AddSkill(skill(0))
    skills().AddSkill(skill(1))

    const target: any = {}
    SkillsController.Serialize(pilot, target)

    const other = makePilot()
    SkillsController.Deserialize(other, target)

    expect(other.SkillsController.Skills.map(s => [s.Skill.ID, s.Rank])).toEqual(
      skills().Skills.map(s => [s.Skill.ID, s.Rank])
    )
  })
})
