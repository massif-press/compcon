import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCRadio from './CCRadio.vue'

const radio = (props: Record<string, unknown> = {}) =>
  mount(CCRadio, { props: { modelValue: false, ...props } })

describe('CCRadio', () => {
  it('reports its state to assistive tech', () => {
    const w = radio({ label: 'Ranged' })
    const control = w.get('[role="checkbox"]')

    expect(control.attributes('aria-checked')).toBe('false')
    expect(control.attributes('aria-label')).toBe('Ranged')
  })

  it('falls back to the tooltip for its name', () => {
    expect(
      radio({ tooltip: 'Pick ranged' }).get('[role="checkbox"]').attributes('aria-label')
    ).toBe('Pick ranged')
  })

  it('emits the flipped value on click', async () => {
    const w = radio()
    await w.get('[role="checkbox"]').trigger('click')

    expect(w.emitted('update:modelValue')).toEqual([[true]])
  })

  it('hides its inner indicator from assistive tech', () => {
    const w = radio({ modelValue: true })
    expect(w.get('[aria-hidden="true"]').attributes('tabindex')).toBe('-1')
  })

  it('renders the label text', () => {
    expect(radio({ label: 'Ranged' }).text()).toContain('Ranged')
  })
})
