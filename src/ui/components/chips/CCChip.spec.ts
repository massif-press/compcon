import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import CCChip from './CCChip.vue'
import split from './_subcomponents/cc_split_chip.vue'
import std from './_subcomponents/cc_std_chip.vue'

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('visualViewport', { addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

const chip = (props: Record<string, unknown> = {}) => mount(CCChip, { props })

describe('CCChip variant resolution', () => {
  it('splits when it has both a title and a label', () => {
    expect(chip({ title: 'RANGE', label: 5 }).findComponent(split).exists()).toBe(true)
  })

  it('splits when it has both an icon and a label', () => {
    expect(chip({ icon: 'mdi-target', label: 5 }).findComponent(split).exists()).toBe(true)
  })

  it('stays a plain chip with only a label', () => {
    expect(chip({ label: 'Limited' }).findComponent(std).exists()).toBe(true)
  })

  it('stays a plain chip with only a title', () => {
    expect(chip({ title: 'RANGE' }).findComponent(std).exists()).toBe(true)
  })

  it('stays a plain chip with nothing at all', () => {
    expect(chip().findComponent(std).exists()).toBe(true)
  })
})

describe('CCChip', () => {
  it('passes colour and size through', () => {
    const w = chip({ label: 'Limited', color: 'error', size: 'large' })

    expect(w.findComponent(std).props('color')).toBe('error')
    expect(w.findComponent(std).props('size')).toBe('large')
  })

  it('re-emits the close event', async () => {
    const w = chip({ label: 'Limited', closable: true })
    w.findComponent(std).vm.$emit('click:close')
    await w.vm.$nextTick()

    expect(w.emitted('click:close')).toBeTruthy()
  })
})

// The activation badges ("Quick", "Protocol", ...) render chips with no
// #tooltip slot; they must never open a tooltip.
describe('CCChip tooltip slot handling', () => {
  const mountChip = (template: string) => mount({ template }, { attachTo: document.body })

  it('does not open a tooltip when the caller provides no #tooltip slot', async () => {
    const w = mountChip('<cc-chip>QUICK</cc-chip>')
    w.find('.v-chip').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(500)
    await nextTick()
    expect(w.findComponent({ name: 'VTooltip' }).props('modelValue')).toBe(false)
    w.unmount()
  })

  it('opens its tooltip when the caller provides one', async () => {
    const w = mountChip('<cc-chip><template #tooltip>chip tip</template>QUICK</cc-chip>')
    w.find('.v-chip').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(200)
    await nextTick()
    expect(w.findComponent({ name: 'VTooltip' }).props('modelValue')).toBe(true)
    w.unmount()
  })
})
