import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCLight from './CCLight.vue'
import CCTail from './CCTail.vue'
import CCEndAccent from './CCEndAccent.vue'

describe('CCLight', () => {
  it('defaults to the primary colour', () => {
    expect(mount(CCLight).classes()).toContain('bg-primary')
  })

  it('takes a colour', () => {
    expect(mount(CCLight, { props: { color: 'success' } }).classes()).toContain('bg-success')
  })

  it('keeps its shape class', () => {
    expect(mount(CCLight).classes()).toContain('cc-corner-pip')
  })
})

describe('CCTail', () => {
  it('defaults to the primary colour', () => {
    expect(mount(CCTail).classes()).toContain('bg-primary')
  })

  it('takes a colour', () => {
    expect(mount(CCTail, { props: { color: 'error' } }).classes()).toContain('bg-error')
  })

  it('keeps its shape class', () => {
    expect(mount(CCTail).classes()).toContain('cc-end-accent')
  })
})

describe('CCEndAccent', () => {
  it('sizes itself to twice the offset so the corner lines up', () => {
    const style = mount(CCEndAccent, { props: { size: 5 } }).attributes('style')

    expect(style).toContain('bottom: -5px')
    expect(style).toContain('right: -5px')
    expect(style).toContain('width: 10px')
    expect(style).toContain('height: 10px')
  })

  it('scales with the size prop', () => {
    const style = mount(CCEndAccent, { props: { size: 12 } }).attributes('style')

    expect(style).toContain('bottom: -12px')
    expect(style).toContain('width: 24px')
  })

  it('takes a colour and stays click-through', () => {
    const w = mount(CCEndAccent, { props: { color: 'secondary' } })

    expect(w.classes()).toContain('bg-secondary')
    expect(w.attributes('style')).toContain('pointer-events: none')
  })
})
