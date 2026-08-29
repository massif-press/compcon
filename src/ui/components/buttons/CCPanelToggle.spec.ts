import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCPanelToggle from './CCPanelToggle.vue'

const toggle = (props: Record<string, unknown> = {}) =>
  mount(CCPanelToggle, {
    props: { modelValue: false, openOffset: 300, closedOffset: 0, ...props },
  })

describe('CCPanelToggle', () => {
  it('exposes its expanded state', () => {
    expect(toggle({ modelValue: false }).get('[role="button"]').attributes('aria-expanded')).toBe(
      'false'
    )
    expect(toggle({ modelValue: true }).get('[role="button"]').attributes('aria-expanded')).toBe(
      'true'
    )
  })

  it('sits at the closed offset while closed and the open offset while open', () => {
    expect(toggle({ modelValue: false }).attributes('style')).toContain('left: 0px')
    expect(toggle({ modelValue: true }).attributes('style')).toContain('left: 300px')
  })

  it('anchors to the right when told to', () => {
    const w = toggle({ side: 'right', modelValue: true })

    expect(w.classes()).toContain('right')
    expect(w.attributes('style')).toContain('right: 300px')
  })

  it('accounts for a bottom inset', () => {
    expect(toggle({ bottomInset: 48 }).attributes('style')).toContain('calc(30% + 48px)')
  })

  it('is wider while closed, so it stays grabbable', () => {
    expect(toggle({ modelValue: false }).attributes('style')).toContain('width: 22px')
    expect(toggle({ modelValue: true }).attributes('style')).toContain('width: 14px')
  })

  it('emits the flipped value on click and from the keyboard', async () => {
    const w = toggle({ modelValue: false })

    await w.get('[role="button"]').trigger('click')
    await w.get('[role="button"]').trigger('keydown.enter')
    await w.get('[role="button"]').trigger('keydown.space')

    expect(w.emitted('update:modelValue')).toEqual([[true], [true], [true]])
  })

  it('is reachable by keyboard', () => {
    expect(toggle().get('[role="button"]').attributes('tabindex')).toBe('0')
  })
})
