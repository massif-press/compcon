import { describe, it, expect } from 'vitest'
import { ByTier, ByTierArray, replaceVal, resolveTier } from './tierFormat'

describe('ByTier', () => {
  it('bolds a braced value when no tier is given', () => {
    expect(ByTier('deals {1/2/3} damage')).toBe('deals <b class="text-accent">1/2/3</b> damage')
  })

  it('picks the tier value when a tier is given', () => {
    expect(ByTier('deals {1/2/3} damage', 2)).toBe('deals <b class="text-accent">2</b> damage')
  })

  it('handles more than one braced group', () => {
    expect(ByTier('{1/2/3} and {4/5/6}', 1)).toBe(
      '<b class="text-accent">1</b> and <b class="text-accent">4</b>'
    )
  })

  it('leaves an unbraced string alone', () => {
    expect(ByTier('plain text', 2)).toBe('plain text')
  })

  it('is empty for empty input', () => {
    expect(ByTier('')).toBe('')
    expect(ByTier(undefined as unknown as string)).toBe('')
  })

  it('stringifies a non-string input', () => {
    expect(ByTier({ a: 1 } as unknown as string)).toBe('{"a":1}')
  })
})

describe('ByTierArray', () => {
  it('indexes a JSON array string by tier', () => {
    expect(ByTierArray('[10,20,30]', 3)).toBe(30)
  })

  it('falls back to comma splitting', () => {
    expect(ByTierArray('a,b,c', 2)).toBe('b')
  })

  it('returns the input untouched with no tier', () => {
    expect(ByTierArray('a,b,c')).toBe('a,b,c')
  })

  it('returns the input when it does not parse to an array', () => {
    expect(ByTierArray('{"a":1}', 1)).toBe('{"a":1}')
  })
})

describe('replaceVal', () => {
  it('replaces every occurrence', () => {
    expect(replaceVal('{VAL} and {VAL}', 3)).toBe('3 and 3')
  })

  it('is empty for empty input', () => {
    expect(replaceVal('', 1)).toBe('')
  })
})

describe('resolveTier', () => {
  it('picks the tier value out of a tier pattern', () => {
    expect(resolveTier('deals {1/2/3} damage', 2)).toBe('deals 2 damage')
  })

  it('resolves several patterns in one string', () => {
    expect(resolveTier('{1/2/3} then {4/5/6}', 3)).toBe('3 then 6')
  })

  it('clamps past the end of the list', () => {
    expect(resolveTier('{1/2/3}', 9)).toBe('3')
  })

  it('returns the string unchanged without a tier', () => {
    expect(resolveTier('{1/2/3}', 0)).toBe('{1/2/3}')
  })

  it('is empty for empty input', () => {
    expect(resolveTier('', 1)).toBe('')
  })
})
