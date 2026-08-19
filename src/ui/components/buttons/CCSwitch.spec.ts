import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCSwitch from './CCSwitch.vue'

const cswitch = (props: Record<string, unknown> = {}) =>
  mount(CCSwitch, { props: { modelValue: false, ...props } })

describe('CCSwitch', () => {
  it('exposes itself as a switch to assistive tech', () => {
    const w = cswitch({ label: 'Autosave' })
    const toggle = w.get('[role="switch"]')

    expect(toggle.attributes('aria-checked')).toBe('false')
    expect(toggle.attributes('aria-label')).toBe('Autosave')
    expect(toggle.attributes('tabindex')).toBe('0')
  })

  it('reports its checked state', () => {
    expect(cswitch({ modelValue: true }).get('[role="switch"]').attributes('aria-checked')).toBe(
      'true'
    )
  })

  it('prefers the label, then the top label, then the tooltip for its name', () => {
    expect(
      cswitch({ label: 'A', topLabel: 'B', tooltip: 'C' })
        .get('[role="switch"]')
        .attributes('aria-label')
    ).toBe('A')
    expect(
      cswitch({ topLabel: 'B', tooltip: 'C' }).get('[role="switch"]').attributes('aria-label')
    ).toBe('B')
    expect(cswitch({ tooltip: 'C' }).get('[role="switch"]').attributes('aria-label')).toBe('C')
  })

  it('ignores a boolean label for the accessible name', () => {
    expect(
      cswitch({ label: true, tooltip: 'C' }).get('[role="switch"]').attributes('aria-label')
    ).toBe('C')
  })

  it('emits the flipped value on click', async () => {
    const w = cswitch()
    await w.get('[role="switch"]').trigger('click')

    expect(w.emitted('update:modelValue')).toEqual([[true]])
  })

  it('toggles from the keyboard', async () => {
    const w = cswitch()

    await w.get('[role="switch"]').trigger('keydown.enter')
    await w.get('[role="switch"]').trigger('keydown.space')

    expect(w.emitted('update:modelValue')).toEqual([[true], [true]])
  })

  it('treats the value prop as also meaning on', () => {
    expect(
      cswitch({ modelValue: false, value: true }).get('[role="switch"]').attributes('aria-checked')
    ).toBe('true')
  })

  it('renders the top label', () => {
    expect(cswitch({ topLabel: 'Sync' }).text()).toContain('Sync')
  })
})
