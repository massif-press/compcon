import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCCheckbox from './CCCheckbox.vue'

const checkbox = (props: Record<string, unknown> = {}) =>
  mount(CCCheckbox, { props: { modelValue: false, ...props } })

describe('CCCheckbox', () => {
  it('exposes itself as a checkbox to assistive tech', () => {
    const w = checkbox({ label: 'Overwatch' })
    const box = w.get('[role="checkbox"]')

    expect(box.attributes('aria-checked')).toBe('false')
    expect(box.attributes('aria-label')).toBe('Overwatch')
  })

  it('reports its checked state', () => {
    expect(checkbox({ modelValue: true }).get('[role="checkbox"]').attributes('aria-checked')).toBe(
      'true'
    )
  })

  it('falls back to the tooltip for its accessible name', () => {
    const w = checkbox({ tooltip: 'Toggle overwatch' })
    expect(w.get('[role="checkbox"]').attributes('aria-label')).toBe('Toggle overwatch')
  })

  it('emits the flipped value when clicked', async () => {
    const w = checkbox({ modelValue: false })
    await w.get('[role="checkbox"]').trigger('click')

    expect(w.emitted('update:modelValue')).toEqual([[true]])
  })

  it('emits false when a checked box is clicked', async () => {
    const w = checkbox({ modelValue: true })
    await w.get('[role="checkbox"]').trigger('click')

    expect(w.emitted('update:modelValue')).toEqual([[false]])
  })

  it('emits nothing while disabled', async () => {
    const w = checkbox({ disabled: true })
    await w.get('[role="checkbox"]').trigger('click')

    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders the label text', () => {
    expect(checkbox({ label: 'Overwatch' }).text()).toContain('Overwatch')
  })
})
