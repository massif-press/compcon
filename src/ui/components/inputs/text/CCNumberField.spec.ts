import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CCNumberField from './CCNumberField.vue'

const field = (props: Record<string, unknown> = {}) => mount(CCNumberField, { props })

const setVal = (w: ReturnType<typeof field>, val: number | string) =>
  (w.vm as unknown as { setVal: (v: number | string) => void }).setVal(val)

const emitted = (w: ReturnType<typeof field>) => w.emitted('update:model-value') as unknown[][]

describe('CCNumberField.setVal', () => {
  it('emits a value inside the range untouched', () => {
    const w = field({ min: 0, max: 10 })
    setVal(w, 5)
    expect(emitted(w).at(-1)).toEqual([5])
  })

  it('clamps to the maximum', () => {
    const w = field({ min: 0, max: 10 })
    setVal(w, 99)
    expect(emitted(w).at(-1)).toEqual([10])
  })

  it('clamps to the minimum', () => {
    const w = field({ min: 2, max: 10 })
    setVal(w, -5)
    expect(emitted(w).at(-1)).toEqual([2])
  })

  it('defaults to a 0..100 range', () => {
    const w = field()

    setVal(w, 500)
    expect(emitted(w).at(-1)).toEqual([100])

    setVal(w, -1)
    expect(emitted(w).at(-1)).toEqual([0])
  })

  it('clamps the bounds themselves to themselves', () => {
    const w = field({ min: 3, max: 7 })

    setVal(w, 3)
    expect(emitted(w).at(-1)).toEqual([3])

    setVal(w, 7)
    expect(emitted(w).at(-1)).toEqual([7])
  })
})
