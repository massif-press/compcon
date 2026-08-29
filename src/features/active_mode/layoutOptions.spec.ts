import { describe, it, expect } from 'vitest'
import { DEFAULTS, PRESETS, resolveLayout, filterStats, matchedPreset } from './layoutOptions'

describe('layoutOptions', () => {
  it('default resolves to rendering on desktop', () => {
    const r = resolveLayout(DEFAULTS, false)
    expect(r.showIcon).toBe(true)
    expect(r.showLabel).toBe(false)
    expect(r.simpleTickbars).toBe(false)
    expect(r.columns).toBe(false)
    expect(r.maxColumns).toBe(1)
  })

  it('auto tickbars clamp to simple on mobile, explicit choices do not', () => {
    expect(resolveLayout(DEFAULTS, true).simpleTickbars).toBe(true)
    expect(resolveLayout({ ...DEFAULTS, tickbars: 'standard' }, true).simpleTickbars).toBe(false)
    expect(resolveLayout({ ...DEFAULTS, tickbars: 'simple' }, false).simpleTickbars).toBe(true)
  })

  it('mobile clamps columns last, regardless of user setting', () => {
    const r = resolveLayout({ ...DEFAULTS, columns: true, maxColumns: 3 }, true)
    expect(r.columns).toBe(false)
    expect(r.maxColumns).toBe(1)
  })

  it('label modes drive icon/label visibility', () => {
    expect(resolveLayout({ ...DEFAULTS, labels: 'text' }, false)).toMatchObject({
      showIcon: false,
      showLabel: true,
    })
    expect(resolveLayout({ ...DEFAULTS, labels: 'icon+text' }, false)).toMatchObject({
      showIcon: true,
      showLabel: true,
    })
  })

  it('filterStats keeps spacers and drops unlisted keys', () => {
    const stats = [{ key: 'hp' }, { key: '__spacer__' }, { key: 'techAttack' }]
    expect(filterStats(stats, false)).toHaveLength(3)
    expect(filterStats(stats, true).map(s => s.key)).toEqual(['hp', '__spacer__'])
  })

  it('matchedPreset round-trips every preset and returns null for custom', () => {
    for (const name of Object.keys(PRESETS)) {
      expect(matchedPreset({ ...DEFAULTS, ...PRESETS[name] })).toBe(name)
    }
    expect(matchedPreset({ ...DEFAULTS, maxColumns: 4 })).toBeNull()
  })
})

describe('resolveLayout has no dead fields', () => {
  it('exposes only consumed derived fields', () => {
    expect(Object.keys(resolveLayout(DEFAULTS, false)).sort()).toEqual(
      [
        ...Object.keys(DEFAULTS),
        'mobile',
        'simpleTickbars',
        'showLabel',
        'showIcon',
        'btnSize',
        'iconSize',
        'tileHeight',
        'tileIconSize',
        'padX',
        'padY',
      ].sort()
    )
  })
})
