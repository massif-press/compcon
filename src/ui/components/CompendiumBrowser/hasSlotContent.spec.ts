import { describe, it, expect } from 'vitest'
import { Comment, Fragment, Text, h } from 'vue'
import { hasSlotContent } from './hasSlotContent'

describe('hasSlotContent', () => {
  it('is false without a slot', () => {
    expect(hasSlotContent(undefined)).toBe(false)
  })

  it('is false for a slot that renders only a comment', () => {
    expect(hasSlotContent(() => [h(Comment)])).toBe(false)
  })

  it('is false for whitespace-only text', () => {
    expect(hasSlotContent(() => [h(Text, '   ')])).toBe(false)
  })

  it('is true for real text', () => {
    expect(hasSlotContent(() => [h(Text, 'Frames')])).toBe(true)
  })

  it('is true for an element', () => {
    expect(hasSlotContent(() => [h('div')])).toBe(true)
  })

  it('looks inside a fragment', () => {
    expect(hasSlotContent(() => [h(Fragment, null, [h(Comment)])])).toBe(false)
    expect(hasSlotContent(() => [h(Fragment, null, [h(Comment), h('span')])])).toBe(true)
  })

  it('passes slot props through', () => {
    const slot = (props: Record<string, any>) => [h(Text, props.label ?? '')]

    expect(hasSlotContent(slot, { label: 'Systems' })).toBe(true)
    expect(hasSlotContent(slot, {})).toBe(false)
  })
})
