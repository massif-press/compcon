import { describe, it, expect } from 'vitest'
import { defineComponent, h, provide } from 'vue'
import { mount } from '@vue/test-utils'
import { CompendiumDataKey, useCompendiumData } from './providers'
import { featureRenderers } from './components/items/features/featureRenderers'
import { btnSubMixin } from './components/buttons/subcomponents/_btnSubMixin'
import { getChartAxes } from './components/CompendiumBrowser/views/_selectorUtils'
import { registerHorusText } from './style/horusText'

describe('providers', () => {
  it('hands the injected compendium provider to a child', () => {
    const stub = { Statuses: [], Frames: [] } as never
    let received: unknown

    mount(
      defineComponent({
        setup() {
          provide(CompendiumDataKey, stub)
          return () =>
            h(
              defineComponent({
                setup() {
                  received = useCompendiumData()
                  return () => null
                },
              })
            )
        },
      })
    )

    expect(received).toBe(stub)
  })
})

describe('featureRenderers', () => {
  it('offers a component for every feature type and display mode', () => {
    for (const type of ['action', 'bonus', 'deployable', 'integrated'] as const) {
      expect(featureRenderers[type]).toBeTruthy()
      for (const component of Object.values(featureRenderers[type])) {
        expect(component).toBeTruthy()
      }
    }
  })
})

describe('btnSubMixin', () => {
  const withProps = (props: Record<string, unknown>) => {
    const computed = btnSubMixin.computed as Record<string, (this: any) => any>
    return {
      sizeStyle: computed.sizeStyle.call(props),
      optionsSize: computed.optionsSize.call(props),
      bgColor: computed.bgColor.call(props),
      outlined: computed.outlined.call(props),
    }
  }

  it('falls back to the default size classes', () => {
    const out = withProps({})

    expect(out.sizeStyle).toBe('size-default')
    expect(out.optionsSize).toBe('options-default')
  })

  it('uses the requested size', () => {
    const out = withProps({ size: 'large' })

    expect(out.sizeStyle).toBe('size-large')
    expect(out.optionsSize).toBe('options-large')
  })

  it('maps colour onto a background class', () => {
    expect(withProps({ color: 'error' }).bgColor).toBe('bg-error')
  })

  it('reports the outlined variant', () => {
    expect(withProps({ variant: 'outlined' }).outlined).toBe(true)
    expect(withProps({ variant: 'tonal' }).outlined).toBe(false)
  })

  it('declares the click event it re-emits', () => {
    expect(btnSubMixin.emits).toContain('click')
  })
})

describe('getChartAxes', () => {
  it('describes the frame comparison axes', () => {
    const axes = getChartAxes('Frame')

    expect(axes.map(a => a.value)).toContain('hp')
    expect(axes.map(a => a.value)).toContain('armor')
  })

  it('adds size only when asked', () => {
    expect(getChartAxes('Frame').map(a => a.value)).not.toContain('size')
    expect(getChartAxes('Frame', { includeSize: true }).map(a => a.value)).toContain('size')
  })

  it('has axes for other item types too', () => {
    expect(getChartAxes('PilotArmor').length).toBeGreaterThan(0)
  })

  it('falls back to the weapon axes for an unrecognized type', () => {
    expect(getChartAxes('NotAType').map(a => a.value)).toContain('damage')
  })
})

describe('registerHorusText', () => {
  it('registers a horus blot against the editor', () => {
    class Inline {
      static create() {
        return { classList: { add: () => undefined } }
      }
    }

    const registered: unknown[] = []
    const quill = {
      import: () => Inline,
      register: (blot: unknown) => registered.push(blot),
    }

    registerHorusText(quill)

    expect(registered).toHaveLength(1)
    expect((registered[0] as any).blotName).toBe('horusText')
    expect((registered[0] as any).tagName).toBe('code')
  })
})
