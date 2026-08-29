import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCHeading from './CCHeading.vue'
import minor from './cc_heading_minor.vue'
import title from './cc_title.vue'
import h3 from './cc_h3.vue'

const heading = (props: Record<string, unknown> = {}) =>
  mount(CCHeading, { props: { text: 'LOADOUT', ...props } })

describe('CCHeading variant resolution', () => {
  it('is a minor heading by default', () => {
    expect(heading().findComponent(minor).exists()).toBe(true)
  })

  it.each([
    ['minor', minor],
    ['h3', h3],
  ])('renders the %s variant', (type, expected) => {
    expect(heading({ type }).findComponent(expected).exists()).toBe(true)
  })

  it('falls back to a title for an unknown type', () => {
    expect(heading({ type: 'not-a-type' }).findComponent(title).exists()).toBe(true)
  })

  it('is a title when isTitle is set, whatever the type says', () => {
    expect(heading({ type: 'h3', isTitle: true }).findComponent(title).exists()).toBe(true)
  })
})

describe('CCHeading', () => {
  it('renders slot content, which is how headings carry their text', () => {
    const w = mount(CCHeading, { slots: { default: 'SYSTEMS' } })
    expect(w.text()).toContain('SYSTEMS')
  })

  it('passes its props down to the chosen variant', () => {
    const w = heading({ type: 'h3', color: 'accent' })
    expect(w.findComponent(h3).props('color')).toBe('accent')
  })
})
