import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EditableAttribute from './EditableAttribute.vue'

const stat = { key: 'hp', title: 'HP', icon: 'mdi-heart' }

function total(bonuses: any[], val = 30): string {
  const wrapper = mount(EditableAttribute, {
    props: { stat, val, bonuses, readonly: true },
  })
  return wrapper.find('.h2').text()
}

describe('EditableAttribute total', () => {
  it('lets a replace bonus stand in for the base value', () => {
    expect(total([{ Value: 15, Replace: true }])).toBe('15')
    expect(total([{ Value: 1, Replace: true }], 1)).toBe('1')
  })

  it('adds normal bonuses on top of a replaced base', () => {
    expect(total([{ Value: 15, Replace: true }, { Value: 5 }])).toBe('20')
  })

  it('adds normal bonuses to the base when nothing replaces it', () => {
    expect(total([{ Value: 5 }, { Value: 2 }])).toBe('37')
  })

  it('ignores a non-numeric bonus instead of zeroing the total', () => {
    expect(total([{ Value: 5 }, { Value: 'Immunity' }])).toBe('35')
  })
})
