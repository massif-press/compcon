import { describe, it, expect, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useTickbar } from './useTickbar'

type Tickbar = ReturnType<typeof useTickbar>

const withTickbar = (props: Parameters<typeof useTickbar>[0]) => {
  const emit = vi.fn()
  let api!: Tickbar

  const wrapper = mount(
    defineComponent({
      setup() {
        api = useTickbar(props, emit)
        return () => null
      },
    })
  )

  return { api, emit, wrapper }
}

describe('useTickbar.setVal', () => {
  it('emits the new value', () => {
    const { api, emit } = withTickbar({ modelValue: 2, ticks: 6 })
    api.setVal(4)
    expect(emit).toHaveBeenCalledWith('update:modelValue', 4)
  })

  it('clamps to the tick count', () => {
    const { api, emit } = withTickbar({ modelValue: 2, ticks: 6 })
    api.setVal(99)
    expect(emit).toHaveBeenCalledWith('update:modelValue', 6)
  })

  it('clamps to zero', () => {
    const { api, emit } = withTickbar({ modelValue: 2, ticks: 6 })
    api.setVal(-3)
    expect(emit).toHaveBeenCalledWith('update:modelValue', 0)
  })

  it('clears the last tick when it is clicked again', () => {
    const { api, emit } = withTickbar({ modelValue: 1, ticks: 6 })
    api.setVal(1)
    expect(emit).toHaveBeenCalledWith('update:modelValue', 0)
  })

  it('refuses to increase when stopAdd is set', () => {
    const { api, emit } = withTickbar({ modelValue: 2, ticks: 6, stopAdd: true })
    api.setVal(5)
    expect(emit).not.toHaveBeenCalled()
  })

  it('still allows a decrease when stopAdd is set', () => {
    const { api, emit } = withTickbar({ modelValue: 4, ticks: 6, stopAdd: true })
    api.setVal(1)
    expect(emit).toHaveBeenCalledWith('update:modelValue', 1)
  })
})

describe('useTickbar tick state', () => {
  it('marks ticks up to the current value active', () => {
    const { api } = withTickbar({ modelValue: 3, ticks: 6 })

    expect(api.isActive(3)).toBe(true)
    expect(api.isActive(4)).toBe(false)
  })

  it('tracks hover across the ticks below the pointer', () => {
    const { api } = withTickbar({ modelValue: 0, ticks: 6 })
    api.hover.value = 3

    expect(api.isHovered(2)).toBe(true)
    expect(api.isHovered(4)).toBe(false)
    expect(api.isMouseovered(3)).toBe(true)
    expect(api.isMouseovered(2)).toBe(false)
  })

  it('reports nothing hovered when the pointer has left', () => {
    const { api } = withTickbar({ modelValue: 0, ticks: 6 })
    expect(api.isHovered(0)).toBe(false)
  })
})

describe('useTickbar.pctBackground', () => {
  it('renders a gradient at the filled percentage', () => {
    const { api } = withTickbar({ modelValue: 3, ticks: 6, color: 'primary', bgColor: 'surface' })
    expect(api.pctBackground.value).toContain('50%')
    expect(api.pctBackground.value).toContain('--v-theme-primary')
  })

  it('is empty without a tick count', () => {
    expect(withTickbar({ modelValue: 3, ticks: 0 }).api.pctBackground.value).toBe('')
  })
})

describe('useTickbar model sync', () => {
  it('emits when the internal value changes', async () => {
    const { api, emit } = withTickbar({ modelValue: 1, ticks: 6 })

    api.internalValue.value = 5
    await nextTick()

    expect(emit).toHaveBeenCalledWith('update:modelValue', 5)
  })
})
