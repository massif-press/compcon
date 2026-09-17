import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import CCTooltip, { isWarm, markWarm, resetWarm } from './CCTooltip.vue'

beforeEach(() => {
  resetWarm()
  vi.useFakeTimers()
  // Vuetify's location strategy needs this once the overlay opens; happy-dom lacks it.
  vi.stubGlobal('visualViewport', { addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const mountTip = (props: Record<string, unknown> = {}, slots: Record<string, any> = {}) =>
  mount(CCTooltip, { props: { text: 'tip text', ...props }, slots, attachTo: document.body })

const tooltip = (w: ReturnType<typeof mountTip>) => w.findComponent({ name: 'VTooltip' })
const activator = (w: ReturnType<typeof mountTip>) => w.findComponent({ name: 'VIcon' })

describe('CCTooltip', () => {
  it('renders an activator when it has text', () => {
    expect(activator(mountTip()).exists()).toBe(true)
  })

  it('takes a custom icon and activator slot', () => {
    expect(activator(mountTip({ icon: 'mdi-alert' })).props('icon')).toBe('mdi-alert')
    const w = mountTip({}, { activator: '<button class="act" v-bind="props">go</button>' })
    expect(w.find('button.act').exists()).toBe(true)
  })

  it('is disabled when it has no content', () => {
    expect(tooltip(mountTip({ text: undefined })).props('disabled')).toBe(true)
  })

  it('honours location on pointer devices, forces top on touch', () => {
    expect(tooltip(mountTip({ location: 'end' })).props('location')).toBe('end')
    vi.stubGlobal('navigator', { maxTouchPoints: 5 })
    const w = tooltip(mountTip({ location: 'end' }))
    expect(w.props('location')).toBe('top')
    expect(w.props('openOnClick')).toBe(true)
  })

  it('opens after the cold open delay', async () => {
    const w = mountTip()
    activator(w).trigger('mouseenter')
    expect(tooltip(w).props('modelValue')).toBe(false)
    await vi.advanceTimersByTimeAsync(200)
    expect(tooltip(w).props('modelValue')).toBe(true)
  })

  it('opens instantly and skips the animation while warm', async () => {
    markWarm()
    const w = mountTip()
    activator(w).trigger('mouseenter')
    await nextTick()
    expect(tooltip(w).props('modelValue')).toBe(true)
    expect(tooltip(w).props('transition')).toBe('cc-instant')
  })

  it('closes immediately on leave, warming the page for the warm window', async () => {
    const w = mountTip()
    activator(w).trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(200)
    activator(w).trigger('mouseleave')
    await nextTick()
    expect(tooltip(w).props('modelValue')).toBe(false)
    expect(isWarm()).toBe(true)
    await vi.advanceTimersByTimeAsync(300)
    expect(isWarm()).toBe(false)
  })

  it('resolves by its globally-registered kebab-case name', async () => {
    // Guards the main.ts registration name (kebabCase('CCTooltip') === 'cc-tooltip').
    const Host = { template: `<cc-tooltip text="reg"><button class="act" />` }
    const w = mount(Host, { attachTo: document.body })
    expect(w.findComponent(CCTooltip).exists()).toBe(true)
  })

  describe('stuck-tooltip hardening', () => {
    const mountTwo = () => {
      const a = mountTip({}, { activator: '<button class="a" v-bind="props">a</button>' })
      const b = mountTip({}, { activator: '<button class="b" v-bind="props">b</button>' })
      return { a, b, btnA: () => a.find('button.a'), btnB: () => b.find('button.b') }
    }

    it('force-closes a tooltip whose mouseleave was lost when another is hovered', async () => {
      const { a, b, btnA, btnB } = mountTwo()
      // open a, then simulate a lost leave: the tooltip stays open
      btnA().trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(200)
      expect(tooltip(a).props('modelValue')).toBe(true)
      // hovering anything else heals it
      btnB().trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(200)
      expect(tooltip(a).props('modelValue')).toBe(false)
      expect(tooltip(b).props('modelValue')).toBe(true)
    })

    it('never opens from a pending timer after the pointer left', async () => {
      const { a, b, btnA, btnB } = mountTwo()
      btnA().trigger('mouseenter')
      btnA().trigger('mouseleave')
      btnB().trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(500)
      expect(tooltip(a).props('modelValue')).toBe(false)
      expect(tooltip(b).props('modelValue')).toBe(true)
    })

    it('closes when its content disappears while open', async () => {
      const w = mountTip()
      activator(w).trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(200)
      expect(tooltip(w).props('modelValue')).toBe(true)
      await w.setProps({ text: undefined })
      await nextTick()
      expect(tooltip(w).props('modelValue')).toBe(false)
    })

    it('never opens when the disabled prop is set', async () => {
      const w = mountTip({ disabled: true })
      activator(w).trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(500)
      await nextTick()
      expect(tooltip(w).props('modelValue')).toBe(false)
      await w.setProps({ disabled: false })
      activator(w).trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(200)
      await nextTick()
      expect(tooltip(w).props('modelValue')).toBe(true)
    })

    it('does not open when its default slot only forwards an absent slot', async () => {
      // The cc-chip pattern: CCTooltip's default slot is a passthrough of a named
      // slot the caller may not have provided (renders a comment vnode).
      const w = mount(
        {
          template: `<cc-tooltip><slot name="tooltip" /></cc-tooltip>`,
        },
        { attachTo: document.body }
      )
      w.findComponent(CCTooltip).find('.v-icon').trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(500)
      await nextTick()
      expect(w.findComponent({ name: 'VTooltip' }).props('modelValue')).toBe(false)
      w.unmount()
    })

    it('does open when the forwarded slot has content', async () => {
      const w = mount(
        {
          template: `<cc-tooltip><slot name="tooltip">real content</slot></cc-tooltip>`,
        },
        { attachTo: document.body }
      )
      w.findComponent(CCTooltip).find('.v-icon').trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(200)
      await nextTick()
      expect(w.findComponent({ name: 'VTooltip' }).props('modelValue')).toBe(true)
      w.unmount()
    })
  })
})
