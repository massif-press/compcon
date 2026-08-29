import { describe, it, expect } from 'vitest'
import PilotTalent from './PilotTalent'
import { Talent } from './Talent'
import { CompendiumStore } from '@/features/compendium/store'

const talentId = () => CompendiumStore().Talents[0].ID
const pilotTalent = (rank?: number) => new PilotTalent(Talent.Deserialize(talentId()), rank)

describe('PilotTalent', () => {
  it('starts at rank 1', () => {
    expect(pilotTalent().Rank).toBe(1)
  })

  it('takes a starting rank', () => {
    expect(pilotTalent(2).Rank).toBe(2)
  })

  it('unlocks one rank per level taken', () => {
    expect(pilotTalent(1).UnlockedRanks).toHaveLength(1)
    expect(pilotTalent(3).UnlockedRanks.length).toBeGreaterThanOrEqual(1)
  })
})

describe('PilotTalent.Increment/Decrement', () => {
  it('increments up to the number of ranks the talent has', () => {
    const t = pilotTalent()
    const max = t.Talent.Ranks.length

    while (t.Rank < max) expect(t.Increment()).toBe(true)

    expect(t.Rank).toBe(max)
    expect(t.Increment()).toBe(false)
  })

  it('decrements down to rank 1', () => {
    const t = pilotTalent(2)

    t.Decrement()
    expect(t.Rank).toBe(1)

    t.Decrement()
    expect(t.Rank).toBe(1)
  })
})

describe('PilotTalent.Serialize/Deserialize', () => {
  it('round-trips a compendium talent', () => {
    const back = PilotTalent.Deserialize(PilotTalent.Serialize(pilotTalent(2)))

    expect(back.Talent.ID).toBe(talentId())
    expect(back.Rank).toBe(2)
    expect(back.Talent.FromInstance).toBe(false)
  })

  it('rebuilds from saved data when the talent is not installed', () => {
    const data = PilotTalent.Serialize(pilotTalent())
    const back = PilotTalent.Deserialize({ ...data, id: 't_not_installed' })

    expect(back.Talent.FromInstance).toBe(true)
    expect(back.Talent.Name).toBeTruthy()
  })
})
