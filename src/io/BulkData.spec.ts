import { describe, it, expect, beforeEach, vi } from 'vitest'

const { state } = vi.hoisted(() => ({
  state: {
    collections: {} as Record<string, any[]>,
    written: [] as { collection: string; items: any[] }[],
    cleared: 0,
    initialized: 0,
  },
}))

vi.mock('./Storage', () => ({
  storeRegistry: {
    pilots: {},
    npcs: {},
    settings: {},
    v2_backup: {},
  },
  GetAll: vi.fn(async (collection: string) => state.collections[collection] ?? []),
  SetAll: vi.fn(async (collection: string, items: any[]) => {
    state.written.push({ collection, items })
  }),
  ClearAllData: vi.fn(async () => {
    state.cleared++
  }),
  Initialize: vi.fn(async () => {
    state.initialized++
  }),
  SetItem: vi.fn(),
  GetItem: vi.fn(async () => null),
  RemoveItem: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
}))

const startup = vi.fn(async () => undefined)
vi.mock('./Startup', () => ({ default: (...args: unknown[]) => startup(...(args as [])) }))

import { exportAll, importAll } from './BulkData'

beforeEach(() => {
  state.collections = { pilots: [{ id: 'p1' }], npcs: [{ id: 'n1' }], settings: [{ id: 's1' }] }
  state.written = []
  state.cleared = 0
  state.initialized = 0
  startup.mockClear()
})

describe('exportAll', () => {
  it('collects every store except settings and the v2 backup', async () => {
    const archive = await exportAll()
    const names = archive.data.map(d => d.collection).sort()

    expect(names).toEqual(['npcs', 'pilots'])
  })

  it('carries the items of each collection', async () => {
    const archive = await exportAll()
    expect(archive.data.find(d => d.collection === 'pilots')?.items).toEqual([{ id: 'p1' }])
  })
})

describe('importAll', () => {
  const archive = {
    data: [
      { collection: 'pilots', items: [{ id: 'p1' }] },
      { collection: 'npcs', items: [{ id: 'n1' }] },
      { collection: 'settings', items: [{ id: 's1' }] },
    ],
  }

  it('writes each collection and then runs startup', async () => {
    await importAll(structuredClone(archive), false)

    expect(state.written.map(w => w.collection).sort()).toEqual(['npcs', 'pilots'])
    expect(startup).toHaveBeenCalledWith(true)
  })

  it('never restores settings or the v2 backup', async () => {
    await importAll(structuredClone(archive), false)
    expect(state.written.map(w => w.collection)).not.toContain('settings')
  })

  it('matches collection names case-insensitively', async () => {
    await importAll({ data: [{ collection: 'PILOTS', items: [{ id: 'p1' }] }] }, false)
    expect(state.written.map(w => w.collection)).toEqual(['pilots'])
  })

  it('clears and reinitializes storage when overwriting', async () => {
    await importAll(structuredClone(archive), true)

    expect(state.cleared).toBe(1)
    expect(state.initialized).toBe(1)
  })

  it('leaves existing data in place when merging', async () => {
    await importAll(structuredClone(archive), false)
    expect(state.cleared).toBe(0)
  })

  it('rejects a malformed archive without touching storage', async () => {
    await importAll(null, true)
    await importAll({ nope: true }, true)
    await importAll({ data: 'not an array' }, true)

    expect(state.written).toEqual([])
    expect(state.cleared).toBe(0)
    expect(startup).not.toHaveBeenCalled()
  })
})
