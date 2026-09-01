import { describe, it, expect } from 'vitest'
import { TAG, tagId, findTag, hasTag, tagValue } from './TagRules'

describe('TagRules', () => {
  it('reads a tag id whether the source is compendium data or a Tag instance', () => {
    expect(tagId({ id: 'tg_smart' })).toBe('tg_smart')
    expect(tagId({ ID: 'tg_smart' })).toBe('tg_smart')
    expect(tagId(null)).toBe('')
  })

  it('matches case-insensitively, which the call sites previously did not agree on', () => {
    expect(hasTag([{ ID: 'TG_Ordnance' }], TAG.Ordnance)).toBe(true)
    expect(hasTag([{ id: 'tg_ordnance' }], TAG.Ordnance)).toBe(true)
  })

  it('answers false for an absent tag and for no tags at all', () => {
    expect(hasTag([{ ID: 'tg_ap' }], TAG.Ordnance)).toBe(false)
    expect(hasTag(undefined, TAG.Ordnance)).toBe(false)
    expect(hasTag([], TAG.Ordnance)).toBe(false)
  })

  it('reads a tag value from either shape', () => {
    expect(tagValue([{ ID: 'tg_reliable', Value: 3 }], TAG.Reliable)).toBe(3)
    expect(tagValue([{ id: 'tg_reliable', val: '1/2/3' }], TAG.Reliable)).toBe('1/2/3')
    expect(tagValue([], TAG.Reliable)).toBeUndefined()
  })

  it('returns the tag itself when a call site needs more than a boolean', () => {
    expect(findTag([{ ID: 'tg_limited', Value: 2 }], TAG.Limited)).toEqual({
      ID: 'tg_limited',
      Value: 2,
    })
  })
})
