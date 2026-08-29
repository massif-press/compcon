import { describe, it, expect } from 'vitest'
import PilotSkill from './PilotSkill'
import { Skill } from './Skill'
import CustomSkill from './CustomSkill'
import { CompendiumStore } from '@/features/compendium/store'
import { Rules } from '@/classes/utility/Rules'

const skillId = () => CompendiumStore().Skills[0].ID
const pilotSkill = (rank?: number) => new PilotSkill(Skill.Deserialize(skillId()), rank)

describe('PilotSkill', () => {
  it('starts at rank 1', () => {
    expect(pilotSkill().Rank).toBe(1)
  })

  it('takes a starting rank', () => {
    expect(pilotSkill(3).Rank).toBe(3)
  })

  it('reports the compendium skill name as its title', () => {
    const skill = Skill.Deserialize(skillId())
    expect(new PilotSkill(skill).Title).toBe(skill.Name)
  })

  it('scales its bonus with rank', () => {
    expect(pilotSkill(2).Bonus).toBe(2 * Rules.TriggerBonusPerRank)
  })
})

describe('PilotSkill.Increment/Decrement', () => {
  it('increments up to the rank cap', () => {
    const s = pilotSkill(Rules.MaxTriggerRank - 1)

    expect(s.Increment()).toBe(true)
    expect(s.Rank).toBe(Rules.MaxTriggerRank)
    expect(s.Increment()).toBe(false)
    expect(s.Rank).toBe(Rules.MaxTriggerRank)
  })

  it('decrements down to rank 1', () => {
    const s = pilotSkill(2)

    s.Decrement()
    expect(s.Rank).toBe(1)

    s.Decrement()
    expect(s.Rank).toBe(1)
  })
})

describe('PilotSkill.Serialize/Deserialize', () => {
  it('round-trips a compendium skill', () => {
    const original = pilotSkill(2)
    const back = PilotSkill.Deserialize(PilotSkill.Serialize(original))

    expect(back.Skill.ID).toBe(original.Skill.ID)
    expect(back.Rank).toBe(2)
    expect(back.IsCustom).toBe(false)
  })

  it('round-trips a custom skill with its text', () => {
    const custom = new PilotSkill(new CustomSkill('Test Custom Skill', 'desc', 'detail'), 3)
    const data = PilotSkill.Serialize(custom)

    expect(data.custom).toBe(true)
    expect(data.custom_desc).toBe('desc')

    const back = PilotSkill.Deserialize(data)
    expect(back.IsCustom).toBe(true)
    expect(back.Title).toBe('Test Custom Skill')
    expect(back.Rank).toBe(3)
  })

  it('carries the item data so an uninstalled skill still loads', () => {
    const data = PilotSkill.Serialize(pilotSkill())
    expect(data.data).toBeTruthy()

    const back = PilotSkill.Deserialize({ ...data, id: 'sk_not_installed' })
    expect(back.Skill).toBeTruthy()
  })
})
