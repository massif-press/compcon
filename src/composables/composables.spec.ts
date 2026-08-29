import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useOnlineStatus } from './useOnlineStatus'
import { computeItemGroupings } from './useItemGrouping'
import { useToggleIndicator } from './useToggleIndicator'

const withSetup = <T>(fn: () => T): { api: T; unmount: () => void } => {
  let api!: T
  const wrapper = mount(
    defineComponent({
      setup() {
        api = fn()
        return () => null
      },
    })
  )
  return { api, unmount: () => wrapper.unmount() }
}

describe('useOnlineStatus', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports the current connection state', () => {
    vi.stubGlobal('navigator', { onLine: true })
    expect(withSetup(() => useOnlineStatus()).api.isOnline.value).toBe(true)

    vi.stubGlobal('navigator', { onLine: false })
    expect(withSetup(() => useOnlineStatus()).api.isOnline.value).toBe(false)
  })

  it('follows the browser going offline and back', async () => {
    vi.stubGlobal('navigator', { onLine: true })
    const { api } = withSetup(() => useOnlineStatus())

    vi.stubGlobal('navigator', { onLine: false })
    window.dispatchEvent(new Event('offline'))
    expect(api.isOnline.value).toBe(false)

    vi.stubGlobal('navigator', { onLine: true })
    window.dispatchEvent(new Event('online'))
    expect(api.isOnline.value).toBe(true)
  })

  it('stops listening once the component is gone', () => {
    vi.stubGlobal('navigator', { onLine: true })
    const { api, unmount } = withSetup(() => useOnlineStatus())

    unmount()

    vi.stubGlobal('navigator', { onLine: false })
    window.dispatchEvent(new Event('offline'))

    expect(api.isOnline.value).toBe(true)
  })
})

describe('computeItemGroupings', () => {
  const folded = (folder?: string) => ({ FolderController: { Folder: folder || '' } })

  it('collapses everything into one group when grouping is off', () => {
    expect(computeItemGroupings([folded()], 'None')).toEqual(['All'])
  })

  it('groups by folder and files the rest under N/A', () => {
    const out = computeItemGroupings([folded('Squad A'), folded('Squad A'), folded()], 'Folder', [
      'Squad A',
    ]) as Record<string, any[]>

    expect(out['Squad A']).toHaveLength(2)
    expect(out['N/A']).toHaveLength(1)
  })

  it('omits the N/A group when every item is filed', () => {
    const out = computeItemGroupings([folded('Squad A')], 'Folder', ['Squad A']) as Record<
      string,
      any[]
    >

    expect(out).not.toHaveProperty('N/A')
  })

  it('groups encounters by sitrep name', () => {
    const enc = (name: string) => ({ Sitrep: { Name: name } })
    const out = computeItemGroupings(
      [enc('Recon'), enc('Recon'), enc('Holdout')],
      'Sitrep'
    ) as Record<string, any[]>

    expect(out.Recon).toHaveLength(2)
    expect(out.Holdout).toHaveLength(1)
  })

  it('groups encounters by environment name', () => {
    const enc = (name: string) => ({ Environment: { Name: name } })
    const out = computeItemGroupings([enc('Deep Space')], 'Environment') as Record<string, any[]>

    expect(out['Deep Space']).toHaveLength(1)
  })
})

describe('useToggleIndicator', () => {
  const indicator = (size: string, isOn = false) =>
    useToggleIndicator(
      () => size,
      () => 'primary',
      () => 'success',
      () => isOn
    )

  it('scales icons with the control size', () => {
    expect(indicator('x-small').iconSize('mdi-check')).toBe('10px')
    expect(indicator('default').iconSize('mdi-check')).toBe('24px')
    expect(indicator('xx-large').iconSize('mdi-check')).toBe('40px')
  })

  it('gives the button itself extra room', () => {
    expect(indicator('default').iconSize('btn')).toBe('32px')
    expect(indicator('small').iconSize('btn')).toBe('22px')
  })

  it('pads compendium icons', () => {
    expect(indicator('default').iconSize('cc:frame')).toBe('28px')
  })

  it('lights up in the active colour when on, or when hovered while off', () => {
    expect(indicator('default', true).getLightColor(false)).toBe('success')
    expect(indicator('default', false).getLightColor(true)).toBe('success')
    expect(indicator('default', false).getLightColor(false)).toBe('primary')
  })
})
