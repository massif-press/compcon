import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCSlashes from './CCSlashes.vue'
import CCDivider from './CCDivider.vue'
import CCTitle from './CCTitle.vue'
import CCText from './CCText.vue'

describe('CCSlashes', () => {
  it('renders the separator', () => {
    expect(mount(CCSlashes).text()).toBe('//')
  })

  it('is dimmed', () => {
    expect(mount(CCSlashes).attributes('style')).toContain('opacity: 0.5')
  })

  it('takes a font size', () => {
    expect(mount(CCSlashes, { props: { size: 14 } }).attributes('style')).toContain(
      'font-size: 14pt'
    )
  })

  it('leaves the font size alone by default', () => {
    expect(mount(CCSlashes).attributes('style')).not.toContain('font-size')
  })
})

describe('CCDivider', () => {
  it('is horizontal with vertical margin by default', () => {
    const w = mount(CCDivider)

    expect(w.classes()).toContain('my-2')
    expect(w.classes()).not.toContain('mx-2')
  })

  it('switches to horizontal margin when vertical', () => {
    const w = mount(CCDivider, { props: { vertical: true } })

    expect(w.classes()).toContain('mx-2')
    expect(w.classes()).not.toContain('my-2')
  })

  it('takes an extra class', () => {
    expect(mount(CCDivider, { props: { class_: 'mt-8' } }).classes()).toContain('mt-8')
  })
})

describe('CCTitle', () => {
  it('renders its slot', () => {
    expect(mount(CCTitle, { slots: { default: 'PILOT' } }).text()).toBe('PILOT')
  })

  it('clips its corner and sizes to content by default', () => {
    const w = mount(CCTitle)

    expect(w.classes()).toContain('clip')
    expect(w.attributes('style')).toContain('width: max-content')
  })

  it('fills the width and drops the clip in block mode', () => {
    const w = mount(CCTitle, { props: { block: true } })

    expect(w.classes()).not.toContain('clip')
    expect(w.attributes('style')).toContain('width: 100%')
  })

  it('takes a colour and an offset', () => {
    const w = mount(CCTitle, { props: { color: 'secondary', offset: true } })

    expect(w.classes()).toContain('bg-secondary')
    expect(w.classes()).toContain('offset')
  })
})

describe('CCText', () => {
  it('renders its content', () => {
    expect(mount(CCText, { props: { text: 'Ready to deploy' } }).text()).toContain(
      'Ready to deploy'
    )
  })
})
