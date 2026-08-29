import fc from 'fast-check'
import { describe, it, expect } from 'vitest'
import Tag, { type ITagData } from './Tag'
import { CompendiumStore } from '@/features/compendium/store'
import { assertDataRoundTrip } from '@/__tests__/roundtrip'

const tagIds = ['tg_limited', 'tg_ap', 'tg_reliable', 'tg_overkill', 'tg_accurate', 'tg_unique']

const tagListArb: fc.Arbitrary<ITagData[]> = fc.array(
  fc.record({
    id: fc.constantFrom(...tagIds),
    val: fc.oneof(fc.integer({ min: 0, max: 6 }), fc.constantFrom('', '1d6', '{tier}')),
  }),
  { maxLength: 4 }
)

describe('Tag.Serialize/Tag.Deserialize', () => {
  it('round-trips any tag list', () => {
    assertDataRoundTrip(tagListArb, Tag.Serialize, d => Tag.Deserialize(d))
  })

  it('resolves ids against the live compendium', () => {
    const [t] = Tag.Deserialize([{ id: 'tg_limited', val: 3 }])
    expect(t.ID).toBe('tg_limited')
    expect(t.Value).toBe(3)
    expect(t.IsLimited).toBe(true)
  })

  it('drops an unknown tag rather than throwing', () => {
    expect(Tag.Deserialize([{ id: 'tg_not_a_real_tag' }])).toHaveLength(0)
  })

  it('returns an empty list for missing data', () => {
    expect(Tag.Deserialize(undefined as unknown as ITagData[])).toEqual([])
  })

  it('does not hand out the compendium instance', () => {
    const [a] = Tag.Deserialize([{ id: 'tg_limited', val: 1 }])
    const [b] = Tag.Deserialize([{ id: 'tg_limited', val: 2 }])
    expect(a.Value).toBe(1)
    expect(b.Value).toBe(2)
    expect(CompendiumStore().TagData.find(t => t.id === 'tg_limited')).not.toHaveProperty('_val')
  })
})

describe('Tag usage cost', () => {
  it.each([
    ['tg_full', 2],
    ['tg_full_action', 2],
    ['tg_full_tech', 2],
    ['tg_quick', 1],
    ['tg_quick_action', 1],
    ['tg_quick_tech', 1],
    ['tg_ap', 0],
  ])('%s costs %i', (id, cost) => {
    expect(new Tag({ id, name: id, description: '' }).UsageCost).toBe(cost)
  })

  it('covers the action-cost ids lancer-data actually ships', () => {
    const ids = CompendiumStore().TagData.map(t => t.id)
    const shipped = ids.filter(id => /^tg_(full|quick)(_|$)/.test(id))

    expect(shipped.length).toBeGreaterThan(0)
    for (const id of shipped) {
      expect(Tag._genTag(id).UsageCost, `${id} should have a usage cost`).toBeGreaterThan(0)
    }
  })
})
