import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCButton from './CCButton.vue'
import std from './subcomponents/cc_btn_std.vue'
import icn from './subcomponents/cc_btn_icon.vue'
import txt_icn from './subcomponents/cc_btn_icon_text.vue'
import ton from './subcomponents/cc_btn_tonal.vue'
import txt from './subcomponents/cc_btn_text.vue'
import blk from './subcomponents/cc_btn_block.vue'
import stk from './subcomponents/cc_btn_stk.vue'

const button = (props: Record<string, unknown> = {}) =>
  mount(CCButton, { props, slots: { default: 'Engage' } })

describe('CCButton variant resolution', () => {
  it.each([
    ['plain', {}, std],
    ['tonal', { variant: 'tonal' }, ton],
    ['text', { variant: 'text' }, txt],
    ['block', { block: true }, blk],
    ['block tonal', { block: true, variant: 'tonal' }, ton],
    ['block text', { block: true, variant: 'text' }, txt],
    ['icon', { icon: 'mdi-close' }, icn],
    ['icon text', { icon: 'mdi-close', variant: 'text' }, txt_icn],
    ['icon outlined', { icon: 'mdi-close', variant: 'outlined' }, txt_icn],
    ['stacked', { stacked: true }, stk],
  ])('renders the %s subcomponent', (_name, props, expected) => {
    expect(button(props).findComponent(expected).exists()).toBe(true)
  })

  it('prefers stacked over every other variant', () => {
    const w = button({ stacked: true, block: true, icon: 'mdi-close', variant: 'tonal' })
    expect(w.findComponent(stk).exists()).toBe(true)
  })

  it('prefers block over icon', () => {
    expect(button({ block: true, icon: 'mdi-close' }).findComponent(blk).exists()).toBe(true)
  })
})

describe('CCButton', () => {
  it('renders its slot content', () => {
    expect(button().text()).toContain('Engage')
  })

  it('passes props through to the subcomponent', () => {
    const w = button({ color: 'error', disabled: true })
    expect(w.findComponent(std).props('color')).toBe('error')
    expect(w.findComponent(std).props('disabled')).toBe(true)
  })
})
