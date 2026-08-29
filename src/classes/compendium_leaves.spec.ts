import { describe, it, expect } from 'vitest'
import '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'
import { Background } from './Background'
import { EnvironmentInstance } from './Environment'
import { DowntimeAction } from './DowntimeAction'
import { SitrepInstance } from './encounter/Sitrep'
import { Encounter } from './encounter/Encounter'
import { applyLcpTracking, DEFAULT_LCP_NAME } from './LcpItemMixin'
import { Bond } from './pilot/components/bond/Bond'
import { CoreBonus } from './pilot/components/corebonus/CoreBonus'
import { Skill } from './pilot/components/skill/Skill'
import { Talent } from './pilot/components/talent/Talent'

describe('Background', () => {
  it('round-trips a compendium background', () => {
    const source = CompendiumStore().Backgrounds[0]
    const back = Background.Deserialize(Background.Serialize(source))

    expect(back.ID).toBe(source.ID)
    expect(back.Name).toBe(source.Name)
    expect(back.Icon).toBeTruthy()
  })
})

describe('DowntimeAction', () => {
  it('round-trips a compendium downtime action', () => {
    const source = CompendiumStore().DowntimeActions[0]
    if (!source) return

    const back = DowntimeAction.Deserialize(DowntimeAction.Serialize(source))

    expect(back.ID).toBe(source.ID)
    expect(back.Name).toBe(source.Name)
  })
})

describe('EnvironmentInstance', () => {
  it('round-trips against its parent encounter', () => {
    const encounter = new Encounter()
    const source = CompendiumStore().Environments[0]
    const instance = new EnvironmentInstance(encounter, source)

    const back = EnvironmentInstance.Deserialize(EnvironmentInstance.Serialize(instance), encounter)

    expect(back.Name).toBe(instance.Name)
    expect(back.Description).toBe(instance.Description)
  })
})

describe('SitrepInstance', () => {
  it('round-trips against its parent encounter', () => {
    const encounter = new Encounter()
    const source = CompendiumStore().Sitreps[0]
    const instance = new SitrepInstance(encounter, source)

    const back = SitrepInstance.Deserialize(SitrepInstance.Serialize(instance), encounter)

    expect(back.Name).toBe(instance.Name)
    expect(back.Objective).toBe(instance.Objective)
  })
})

describe('applyLcpTracking', () => {
  it('marks an item as core content with no pack', () => {
    const item = {} as any
    applyLcpTracking(item)

    expect(item.LcpName).toBe(DEFAULT_LCP_NAME)
    expect(item.InLcp).toBe(false)
  })

  it('stamps the pack onto an item that came from one', () => {
    const item = {} as any
    applyLcpTracking(item, { Name: 'Test Pack', Author: 'Tester', ID: 'tp' } as never)

    expect(item.LcpName).toBe('Test Pack')
    expect(item.InLcp).toBe(true)
  })
})

describe('compendium item Deserialize by id', () => {
  it('resolves a skill, talent, core bonus, and bond from the compendium', () => {
    const skill = CompendiumStore().Skills[0]
    expect(Skill.Deserialize(skill.ID).ID).toBe(skill.ID)

    const talent = CompendiumStore().Talents[0]
    expect(Talent.Deserialize(talent.ID).ID).toBe(talent.ID)

    const cb = CompendiumStore().CoreBonuses[0]
    expect(CoreBonus.Deserialize(cb.ItemData as never).ID).toBe(cb.ID)

    const bond = CompendiumStore().Bonds[0]
    if (bond) expect(Bond.Deserialize(bond.ID).ID).toBe(bond.ID)
  })

  it('throws for an id the compendium does not know', () => {
    expect(() => Skill.Deserialize('sk_not_a_skill')).toThrow('ID not found')
    expect(() => Talent.Deserialize('t_not_a_talent')).toThrow('ID not found')
  })
})
