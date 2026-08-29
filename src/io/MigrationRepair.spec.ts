import { describe, it, expect, vi, beforeEach } from 'vitest'

const { storage } = vi.hoisted(() => ({
  storage: { npcs: [] as any[] },
}))

vi.mock('./Storage', () => ({
  GetAll: vi.fn(async (collection: string) => (collection === 'npcs' ? storage.npcs : [])),
  SetItem: vi.fn(),
  SetAll: vi.fn(),
  GetItem: vi.fn(async () => null),
  RemoveItem: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

import { runMigrationScan, applyAllFixes } from './MigrationRepair'
import { SetItem } from './Storage'
import { ContentPackStore, CompendiumStore } from '@/features/compendium/store'

const featurePack = (features: any[], classes: any[] = [], templates: any[] = []) =>
  ({
    ID: 'pack1',
    Name: 'Test Pack',
    Active: true,
    Data: { npcFeatures: features, npcClasses: classes, npcTemplates: templates },
    Serialize: () => ({ id: 'pack1' }),
  }) as any

beforeEach(() => {
  storage.npcs = []
  vi.mocked(SetItem).mockClear()
})

describe('runMigrationScan', () => {
  it('finds nothing in an empty install', async () => {
    expect(await runMigrationScan()).toEqual([])
  })

  it('resolves an object-form origin against a class name', async () => {
    ContentPackStore().ContentPacks = [
      featurePack(
        [{ id: 'f1', name: 'Feature', origin: { type: 'class', name: 'Pursuer' } }],
        [{ id: 'npcc_pursuer', name: 'Pursuer', base_features: [], optional_features: [] }]
      ),
    ]

    const [finding] = await runMigrationScan()
    expect(finding.category).toBe('lcp_origin')
    expect(finding.canFix).toBe(true)
    expect(finding.saveKey).toBe('pack1')
  })

  it('resolves an origin from a class feature list when the origin object does not match', async () => {
    ContentPackStore().ContentPacks = [
      featurePack(
        [{ id: 'f1', name: 'Feature', origin: { type: 'class', name: 'Nobody' } }],
        [{ id: 'npcc_x', name: 'X', base_features: ['f1'], optional_features: [] }]
      ),
    ]

    const [finding] = await runMigrationScan()
    expect(finding.canFix).toBe(true)
  })

  it('reports an unresolvable origin as unfixable', async () => {
    ContentPackStore().ContentPacks = [
      featurePack([{ id: 'f1', name: 'Feature', origin: { type: 'class', name: 'Nobody' } }]),
    ]

    const [finding] = await runMigrationScan()
    expect(finding.canFix).toBe(false)
    expect(finding.mutate).toBeNull()
    expect(finding.description).toContain('Delete and reinstall')
  })

  it('ignores a feature whose origin is already a string', async () => {
    ContentPackStore().ContentPacks = [
      featurePack([{ id: 'f1', name: 'Feature', origin: 'npcc_x' }]),
    ]
    expect(await runMigrationScan()).toEqual([])
  })

  it('reports a feature a class references but the pack does not ship', async () => {
    ContentPackStore().ContentPacks = [
      featurePack(
        [],
        [{ id: 'npcc_x', name: 'X', base_features: ['missing'], optional_features: [] }]
      ),
    ]

    const [finding] = await runMigrationScan()
    expect(finding.itemId).toBe('missing')
    expect(finding.canFix).toBe(false)
    expect(finding.description).toContain('Reinstall LCP')
  })

  it('reports each missing feature once', async () => {
    ContentPackStore().ContentPacks = [
      featurePack(
        [],
        [
          { id: 'a', name: 'A', base_features: ['missing'], optional_features: [] },
          { id: 'b', name: 'B', base_features: ['missing'], optional_features: [] },
        ]
      ),
    ]
    expect(await runMigrationScan()).toHaveLength(1)
  })

  it('skips inactive packs', async () => {
    const pack = featurePack([{ id: 'f1', name: 'F', origin: { type: 'class', name: 'Nobody' } }])
    pack.Active = false
    ContentPackStore().ContentPacks = [pack]
    expect(await runMigrationScan()).toEqual([])
  })

  it('skips a stored npc that is not in the store', async () => {
    storage.npcs = [{ id: 'gone', npcType: 'unit', stats: {} }]
    expect(await runMigrationScan()).toEqual([])
  })
})

describe('applyAllFixes', () => {
  it('runs every mutation and saves the affected pack', async () => {
    ContentPackStore().ContentPacks = [
      featurePack(
        [{ id: 'f1', name: 'Feature', origin: { type: 'class', name: 'Pursuer' } }],
        [{ id: 'npcc_pursuer', name: 'Pursuer', base_features: [], optional_features: [] }]
      ),
    ]
    vi.spyOn(CompendiumStore(), 'refreshExtraContent').mockResolvedValue()

    const findings = await runMigrationScan()
    await applyAllFixes(findings)

    expect(ContentPackStore().ContentPacks[0].Data.npcFeatures[0].origin).toBe('npcc_pursuer')
    expect(SetItem).toHaveBeenCalledWith('content', { id: 'pack1' })
  })

  it('reports progress against the number of save tasks', async () => {
    ContentPackStore().ContentPacks = [
      featurePack(
        [{ id: 'f1', name: 'Feature', origin: { type: 'class', name: 'Pursuer' } }],
        [{ id: 'npcc_pursuer', name: 'Pursuer', base_features: [], optional_features: [] }]
      ),
    ]
    vi.spyOn(CompendiumStore(), 'refreshExtraContent').mockResolvedValue()

    const progress: [number, number][] = []
    await applyAllFixes(await runMigrationScan(), (done, total) => progress.push([done, total]))

    expect(progress[0]).toEqual([0, 1])
    expect(progress.at(-1)).toEqual([1, 1])
  })

  it('does nothing for findings that cannot be fixed', async () => {
    ContentPackStore().ContentPacks = [
      featurePack([{ id: 'f1', name: 'Feature', origin: { type: 'class', name: 'Nobody' } }]),
    ]

    await applyAllFixes(await runMigrationScan())
    expect(SetItem).not.toHaveBeenCalled()
  })
})
