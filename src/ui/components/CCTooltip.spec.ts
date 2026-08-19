import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CCTooltip from './CCTooltip.vue'

const tooltip = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(CCTooltip, { props, slots })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('CCTooltip', () => {
  it('renders an activator when it has text', () => {
    expect(tooltip({ text: 'Explains the stat' }).findComponent({ name: 'VIcon' }).exists()).toBe(
      true
    )
  })

  it('renders an activator when it only has slot content', () => {
    expect(
      tooltip({}, { default: 'Explains the stat' }).findComponent({ name: 'VIcon' }).exists()
    ).toBe(true)
  })

  it('still renders the icon with no content, but leaves it inert', () => {
    const w = tooltip()
    const icon = w.findComponent({ name: 'VIcon' })

    expect(icon.exists()).toBe(true)
    expect(icon.attributes('aria-describedby')).toBeUndefined()
  })

  it('defaults to the info icon', () => {
    const w = tooltip({ text: 'x' })
    expect(w.findComponent({ name: 'VIcon' }).props('icon')).toBe(
      'mdi-information-slab-box-outline'
    )
  })

  it('takes a custom icon', () => {
    const w = tooltip({ text: 'x', icon: 'mdi-alert' })
    expect(w.findComponent({ name: 'VIcon' }).props('icon')).toBe('mdi-alert')
  })

  it('honours the requested location on a pointer device', () => {
    vi.stubGlobal('navigator', { maxTouchPoints: 0 })
    const w = tooltip({ text: 'x', location: 'end' })
    expect(w.findComponent({ name: 'VTooltip' }).props('location')).toBe('end')
  })

  it('forces top placement on touch, where side tooltips get clipped', () => {
    vi.stubGlobal('navigator', { maxTouchPoints: 5 })
    const w = tooltip({ text: 'x', location: 'end' })
    expect(w.findComponent({ name: 'VTooltip' }).props('location')).toBe('top')
  })
})
