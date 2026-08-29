import { describe, it, expect, beforeEach, vi } from 'vitest'

const store = new Map<string, unknown>()

vi.mock('localforage', () => ({
  default: {
    setItem: vi.fn(async (k: string, v: unknown) => {
      store.set(k, v)
      return v
    }),
    getItem: vi.fn(async (k: string) => (store.has(k) ? store.get(k) : null)),
  },
}))

import {
  writeFile,
  readFile,
  exists,
  saveData,
  saveDelta,
  deleteDataById,
  loadData,
  ImportData,
} from './Data'

const grantPersistence = (capable: boolean, granted: boolean) => {
  vi.stubGlobal('navigator', {
    storage: { persist: async () => capable },
    permissions: { query: async () => ({ state: granted ? 'granted' : 'denied' }) },
  })
}

const fileOf = (content: string) => new File([content], 'x.json', { type: 'application/json' })

beforeEach(() => {
  store.clear()
  grantPersistence(true, true)
})

describe('writeFile/readFile/exists', () => {
  it('round-trips a value', async () => {
    await writeFile('k', 'v')
    expect(await readFile('k')).toBe('v')
    expect(await exists('k')).toBe(true)
  })

  it('reports a missing key as absent', async () => {
    expect(await readFile('nope')).toBeNull()
    expect(await exists('nope')).toBe(false)
  })

  it('treats an empty string as absent, because exists is truthiness', async () => {
    await writeFile('empty', '')
    expect(await exists('empty')).toBe(false)
  })
})

describe('saveData', () => {
  it('stringifies an object', async () => {
    await saveData('pilots', [{ id: 'a' }])
    expect(await readFile('pilots')).toBe('[{"id":"a"}]')
  })

  it('passes a string through without double-encoding', async () => {
    await saveData('pilots', '[{"id":"a"}]')
    expect(await readFile('pilots')).toBe('[{"id":"a"}]')
  })

  it('writes nothing when persistence is refused', async () => {
    grantPersistence(true, false)
    await saveData('pilots', [{ id: 'a' }])
    expect(await exists('pilots')).toBe(false)
  })

  it('writes nothing when the browser cannot persist', async () => {
    grantPersistence(false, true)
    await saveData('pilots', [{ id: 'a' }])
    expect(await exists('pilots')).toBe(false)
  })
})

describe('saveDelta', () => {
  it('appends new records and updates existing ones by id', async () => {
    await writeFile('pilots', JSON.stringify([{ id: 'a', n: 1 }]))
    await saveDelta('pilots', [
      { id: 'a', n: 2 },
      { id: 'b', n: 1 },
    ])
    expect(JSON.parse((await readFile('pilots')) as string)).toEqual([
      { id: 'a', n: 2 },
      { id: 'b', n: 1 },
    ])
  })

  it('seeds an empty collection', async () => {
    await saveDelta('pilots', [{ id: 'a' }])
    expect(JSON.parse((await readFile('pilots')) as string)).toEqual([{ id: 'a' }])
  })

  it('is a no-op for an empty delta', async () => {
    await saveDelta('pilots', [])
    expect(await exists('pilots')).toBe(false)
  })
})

describe('deleteDataById', () => {
  beforeEach(async () => {
    await writeFile('pilots', JSON.stringify([{ id: 'a' }, { id: 'b' }, { id: 'c' }]))
  })

  it('removes the named records only', async () => {
    await deleteDataById('pilots', ['a', 'c'])
    expect(JSON.parse((await readFile('pilots')) as string)).toEqual([{ id: 'b' }])
  })

  it('ignores ids that are not present', async () => {
    await deleteDataById('pilots', ['zzz'])
    expect(JSON.parse((await readFile('pilots')) as string)).toHaveLength(3)
  })

  it('is a no-op for an empty id list or a missing collection', async () => {
    await deleteDataById('pilots', [])
    expect(JSON.parse((await readFile('pilots')) as string)).toHaveLength(3)
    await deleteDataById('missing', ['a'])
    expect(await exists('missing')).toBe(false)
  })
})

describe('loadData', () => {
  it('parses a stored collection', async () => {
    await writeFile('pilots', JSON.stringify([{ id: 'a' }]))
    expect(await loadData('pilots')).toEqual([{ id: 'a' }])
  })

  it('returns an empty array for a missing collection', async () => {
    expect(await loadData('missing')).toEqual([])
  })

  it('returns an empty array rather than throwing on corrupt JSON', async () => {
    await writeFile('pilots', '{not json')
    expect(await loadData('pilots')).toEqual([])
  })

  it('returns an empty array when the stored value parses to null', async () => {
    await writeFile('pilots', 'null')
    expect(await loadData('pilots')).toEqual([])
  })
})

describe('ImportData', () => {
  it('unwraps a wrapped export', async () => {
    const data = await ImportData(
      fileOf(JSON.stringify({ EXPORT_TYPE: 'pilot', data: { id: 'a' } }))
    )
    expect(data).toEqual({ id: 'a' })
  })

  it('passes a bare object through', async () => {
    expect(await ImportData(fileOf(JSON.stringify({ id: 'a' })))).toEqual({ id: 'a' })
  })

  it('rejects invalid JSON', async () => {
    await expect(ImportData(fileOf('{not json'))).rejects.toThrow()
  })
})
