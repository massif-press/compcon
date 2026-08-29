import { describe, it, expect, beforeEach, vi } from 'vitest'

const { instances } = vi.hoisted(() => ({
  instances: new Map<string, Map<string, unknown>>(),
}))

vi.mock('localforage', () => {
  const makeInstance = (storeName: string) => {
    const data = new Map<string, unknown>()
    instances.set(storeName, data)
    return {
      setItem: async (k: string, v: unknown) => (data.set(k, v), v),
      getItem: async (k: string) => (data.has(k) ? data.get(k) : null),
      removeItem: async (k: string) => void data.delete(k),
      clear: async () => data.clear(),
      length: async () => data.size,
      keys: async () => [...data.keys()],
      iterate: async (cb: (v: unknown, k: string, i: number) => void) => {
        let i = 1
        for (const [k, v] of data) cb(v, k, i++)
      },
    }
  }
  return {
    default: {
      config: vi.fn(),
      createInstance: ({ storeName }: { storeName: string }) => makeInstance(storeName),
    },
  }
})

import {
  SetItem,
  GetItem,
  RemoveItem,
  GetAll,
  SetAll,
  GetLength,
  GetKeys,
  ClearAll,
  SetValue,
  GetValue,
  AddBlob,
  GetBlob,
  ClearAllData,
  GetTotalStorageSize,
  saveAll,
} from './Storage'

beforeEach(async () => {
  for (const data of instances.values()) data.clear()
})

describe('SetItem/GetItem', () => {
  it('keys an object by ID', async () => {
    await SetItem('pilots', { ID: 'p1', name: 'x' })
    expect(await GetItem('pilots', 'p1')).toEqual({ ID: 'p1', name: 'x' })
  })

  it('falls back to sortkey, then id', async () => {
    await SetItem('pilots', { sortkey: 'sk', v: 1 })
    await SetItem('pilots', { id: 'lower', v: 2 })
    expect(await GetItem('pilots', 'sk')).toEqual({ sortkey: 'sk', v: 1 })
    expect(await GetItem('pilots', 'lower')).toEqual({ id: 'lower', v: 2 })
  })

  it('is case-insensitive about the collection name', async () => {
    await SetItem('Pilots', { ID: 'p1' })
    expect(await GetItem('PILOTS', 'p1')).toEqual({ ID: 'p1' })
  })

  it('stores a bare string under itself', async () => {
    await SetItem('settings', 'flag')
    expect(await GetKeys('settings')).toEqual(['flag'])
  })

  it('skips an item with no key', async () => {
    await SetItem('pilots', { name: 'keyless' })
    expect(await GetLength('pilots')).toBe(0)
  })

  it('skips a clean item that reports itself not dirty', async () => {
    await SetItem('pilots', { ID: 'p1', SaveController: { IsDirty: false } })
    expect(await GetLength('pilots')).toBe(0)
  })

  it('writes a dirty item', async () => {
    await SetItem('pilots', { ID: 'p1', SaveController: { IsDirty: true } })
    expect(await GetLength('pilots')).toBe(1)
  })

  it('returns null for a missing id', async () => {
    expect(await GetItem('pilots', 'nope')).toBeNull()
  })
})

describe('GetAll', () => {
  it('parses every stored record', async () => {
    await SetItem('pilots', { ID: 'a' })
    await SetItem('pilots', { ID: 'b' })
    expect(await GetAll('pilots')).toHaveLength(2)
  })

  it('skips a corrupt record instead of failing the read', async () => {
    await SetItem('pilots', { ID: 'a' })
    instances.get('pilots')!.set('broken', '{not json')
    expect(await GetAll('pilots')).toEqual([{ ID: 'a' }])
  })

  it('returns an empty array for an unknown collection', async () => {
    expect(await GetAll('not_a_collection')).toEqual([])
  })
})

describe('SetAll', () => {
  it('replaces the collection contents', async () => {
    await SetItem('pilots', { ID: 'old' })
    await SetAll('pilots', [{ ID: 'a' }, { ID: 'b' }])
    expect(await GetKeys('pilots')).toEqual(['a', 'b'])
  })
})

describe('RemoveItem / ClearAll / GetLength', () => {
  it('removes one and clears the rest', async () => {
    await SetAll('pilots', [{ ID: 'a' }, { ID: 'b' }])
    await RemoveItem('pilots', 'a')
    expect(await GetLength('pilots')).toBe(1)
    await ClearAll('pilots')
    expect(await GetLength('pilots')).toBe(0)
  })

  it('reports 0 length and no keys for an unknown collection', async () => {
    expect(await GetLength('not_a_collection')).toBe(0)
    expect(await GetKeys('not_a_collection')).toEqual([])
  })
})

describe('SetValue/GetValue', () => {
  it('round-trips a settings value', async () => {
    await SetValue('theme', { dark: true })
    expect(await GetValue('theme')).toEqual({ dark: true })
  })

  it('returns null for an unset key', async () => {
    expect(await GetValue('unset')).toBeNull()
  })
})

describe('blobs', () => {
  it('stores a blob unserialized', async () => {
    const blob = new Blob(['abc'])
    await AddBlob('remote_images', 'k', blob)
    expect(await GetBlob('remote_images', 'k')).toBe(blob)
  })
})

describe('GetTotalStorageSize', () => {
  it('sums blob bytes and string lengths across every store', async () => {
    await SetValue('a', 1)
    await AddBlob('remote_images', 'k', new Blob(['12345']))
    const size = await GetTotalStorageSize()
    expect(size).toBe('1'.length + 5)
  })

  it('is 0 when everything is cleared', async () => {
    await SetValue('a', 1)
    await ClearAllData()
    expect(await GetTotalStorageSize()).toBe(0)
  })
})

describe('saveAll', () => {
  it('serializes every item into the collection', async () => {
    await saveAll('pilots', [{ id: 'a' }, { id: 'b' }], x => ({ ID: x.id }), 'pilots')
    expect(await GetKeys('pilots')).toEqual(['a', 'b'])
  })

  it('swallows a serializer failure rather than rejecting', async () => {
    await expect(
      saveAll(
        'pilots',
        [{ id: 'a' }],
        () => {
          throw new Error('boom')
        },
        'pilots'
      )
    ).resolves.toBeUndefined()
  })
})
