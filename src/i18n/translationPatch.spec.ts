import { describe, it, expect, beforeEach, vi } from 'vitest'

const { storage } = vi.hoisted(() => ({ storage: { translations: [] as any[] } }))

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(async (_c: string, item: any) => {
    storage.translations.push(item)
  }),
  RemoveItem: vi.fn(async (_c: string, id: string) => {
    storage.translations = storage.translations.filter(p => p.id !== id)
  }),
  GetAll: vi.fn(async () => storage.translations),
  GetItem: vi.fn(async () => null),
  SetAll: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

vi.mock('./loadContent', () => ({ setContentLocale: vi.fn(async () => undefined) }))

import { installPatch, packPatches, patchIsStale, removePatch } from './translationPatch'
import { QUALITY_THRESHOLD, TRANSLATION_COMPONENTS, completeness } from './completeness'
import { LocalizationStore } from '@/stores/localization'

const patch = (overrides: Record<string, unknown> = {}) => ({
  id: 'patch-1',
  lang: 'de',
  target: 'tp',
  name: 'Test Patch',
  author: 'Tester',
  version: '1.0.0',
  data: { 'mf_everest.name': 'Everest (DE)' },
  ...overrides,
})

beforeEach(() => {
  storage.translations = []
  LocalizationStore().patches = []
})

describe('installPatch', () => {
  it('stores a valid patch and registers it', async () => {
    const installed = await installPatch(patch())

    expect(installed.id).toBe('tp::de')
    expect(storage.translations).toHaveLength(1)
    expect(LocalizationStore().patches.map(p => p.id)).toEqual(['tp::de'])
  })

  it('replaces an existing patch with the same id', async () => {
    await installPatch(patch())
    await installPatch(patch({ name: 'Updated' }))

    expect(LocalizationStore().patches).toHaveLength(1)
    expect((LocalizationStore().patches[0] as any).name).toBe('Updated')
  })

  it('refuses invalid patch data', async () => {
    await expect(installPatch({ nope: true })).rejects.toThrow()
    expect(storage.translations).toEqual([])
  })
})

describe('removePatch', () => {
  it('drops the patch from storage and the store', async () => {
    const installed = await installPatch(patch())
    await removePatch(installed.id)

    expect(storage.translations).toEqual([])
    expect(LocalizationStore().patches).toEqual([])
  })
})

describe('packPatches', () => {
  it('matches patches by any of the pack identifiers', async () => {
    await installPatch(patch())

    expect(packPatches(['tp']).map(p => p.id)).toEqual(['tp::de'])
    expect(packPatches(['other', 'tp']).map(p => p.id)).toEqual(['tp::de'])
    expect(packPatches(['other'])).toEqual([])
  })

  it('ignores undefined identifiers', async () => {
    await installPatch(patch())
    expect(packPatches([undefined, 'tp'])).toHaveLength(1)
  })
})

describe('patchIsStale', () => {
  it('is false without a declared target version or a pack version', () => {
    expect(patchIsStale(patch() as never, '1.0.0')).toBe(false)
    expect(patchIsStale(patch({ target_version: '^1.0.0' }) as never, undefined)).toBe(false)
  })

  it('is false while the pack version still satisfies the range', () => {
    expect(patchIsStale(patch({ target_version: '^1.0.0' }) as never, '1.4.2')).toBe(false)
  })

  it('is true once the pack has moved past the range', () => {
    expect(patchIsStale(patch({ target_version: '^1.0.0' }) as never, '2.0.0')).toBe(true)
  })

  it('is false for an unparseable version rather than throwing', () => {
    expect(patchIsStale(patch({ target_version: '^1.0.0' }) as never, 'not-a-version')).toBe(false)
  })
})

describe('completeness', () => {
  it('publishes a quality threshold and the tracked components', () => {
    expect(QUALITY_THRESHOLD).toBeGreaterThan(0)
    expect(TRANSLATION_COMPONENTS).toContain('ui')
  })

  it('carries baked-in per-locale percentages', () => {
    expect(typeof completeness.value).toBe('object')
  })
})
