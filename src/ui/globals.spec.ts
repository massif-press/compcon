import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

describe('component test harness', () => {
  it('resolves globally registered components by name', () => {
    const w = mount({ template: '<cc-button>click</cc-button>' })
    expect(w.findComponent({ name: 'CCButton' }).exists()).toBe(true)
    expect(w.text()).toContain('click')
  })
})
