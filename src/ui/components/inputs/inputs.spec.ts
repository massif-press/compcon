import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { VSelect, VAutocomplete, VCombobox } from 'vuetify/components'
import CCTextField from './text/CCTextField.vue'
import CCTextArea from './text/CCTextArea.vue'
import CCSelect from './selector/CCSelect.vue'

describe('CCTextField', () => {
  it('renders an input carrying the model value', () => {
    const w = mount(CCTextField, { props: { modelValue: 'HAMMER' } })
    expect(w.get('input').element.value).toBe('HAMMER')
  })

  it('emits on input', async () => {
    const w = mount(CCTextField, { props: { modelValue: '' } })

    await w.get('input').setValue('NELSON')

    expect(w.emitted()['update:modelValue'] ?? w.emitted()['update:model-value']).toBeTruthy()
  })

  it('takes an explicit accessible name', () => {
    const w = mount(CCTextField, { props: { modelValue: '', ariaLabel: 'Callsign' } })
    expect(w.get('input').attributes('aria-label')).toBe('Callsign')
  })

  it('can be disabled', () => {
    const w = mount(CCTextField, { props: { modelValue: '', disabled: true } })
    expect(w.get('input').attributes('disabled')).toBeDefined()
  })
})

describe('CCTextArea', () => {
  it('renders a textarea carrying the model value', () => {
    const w = mount(CCTextArea, { props: { modelValue: 'notes here' } })
    expect(w.get('textarea').element.value).toBe('notes here')
  })
})

describe('CCSelect variant resolution', () => {
  const select = (props: Record<string, unknown> = {}) =>
    mount(CCSelect, { props: { items: ['a', 'b'], ...props } })

  it('is a plain select by default', () => {
    expect(select().findComponent(VSelect).exists()).toBe(true)
  })

  it('becomes an autocomplete when asked', () => {
    expect(select({ autocomplete: true }).findComponent(VAutocomplete).exists()).toBe(true)
  })

  it('becomes a combobox when asked', () => {
    expect(select({ combobox: true }).findComponent(VCombobox).exists()).toBe(true)
  })

  it('prefers combobox over autocomplete', () => {
    const w = select({ combobox: true, autocomplete: true })
    expect(w.findComponent(VCombobox).exists()).toBe(true)
  })

  it('passes its items through', () => {
    expect(
      select({ items: ['a', 'b', 'c'] })
        .findComponent(VSelect)
        .props('items')
    ).toEqual(['a', 'b', 'c'])
  })
})
