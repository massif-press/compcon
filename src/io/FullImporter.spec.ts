import { describe, it, expect, beforeEach, vi } from 'vitest'

const { storage } = vi.hoisted(() => ({
  storage: { values: new Map<string, unknown>(), content: [] as any[], backups: [] as any[] },
}))

vi.mock('./Storage', () => ({
  SetItem: vi.fn(async (collection: string, item: any) => {
    if (collection === 'content') storage.content.push(item)
    if (collection === 'v2_backup') storage.backups.push(item)
  }),
  SetValue: vi.fn(async (key: string, value: unknown) => storage.values.set(key, value)),
  GetValue: vi.fn(async (key: string) => storage.values.get(key) ?? null),
  GetAll: vi.fn(async (collection: string) => (collection === 'v2_backup' ? storage.backups : [])),
  RemoveItem: vi.fn(),
  GetItem: vi.fn(async () => null),
  SetAll: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

import {
  isFullBackup,
  extractFullBackupEntries,
  importExtraContent,
  processFullBackup,
  serializeToFullBackup,
  migrateV2LocalStorage,
  V2_LOCALSTORAGE_KEYS,
} from './FullImporter'
import { SetItem, SetValue } from './Storage'
import { CompendiumStore, PilotStore } from '@/stores'

const entry = (filename: string, data: unknown) => ({
  filename,
  data: data === null ? null : JSON.stringify(data),
})

const v2Pilot = (callsign: string) => ({
  id: `v2-${callsign}`,
  callsign,
  name: callsign,
  level: 1,
  mechs: [],
})

beforeEach(() => {
  storage.values.clear()
  storage.content = []
  storage.backups = []
  window.localStorage.clear()
  vi.spyOn(CompendiumStore(), 'refreshExtraContent').mockResolvedValue()
})

describe('isFullBackup', () => {
  it('accepts an array of named entries', () => {
    expect(isFullBackup([{ filename: 'pilots_v2.json', data: '[]' }])).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isFullBackup([])).toBe(false)
    expect(isFullBackup([{ id: 'a' }])).toBe(false)
    expect(isFullBackup({ filename: 'x' })).toBe(false)
    expect(isFullBackup(null)).toBe(false)
  })
})

describe('extractFullBackupEntries', () => {
  it('routes each known file to its collection', () => {
    const out = extractFullBackupEntries([
      entry('pilots_v2.json', [v2Pilot('A')]),
      entry('npcs_v2.json', [{ id: 'n1' }]),
      entry('encounters_v2.json', [{ id: 'e1' }]),
      entry('extra_content.json', [{ id: 'lcp1' }]),
    ])

    expect(out.pilots).toHaveLength(1)
    expect(out.npcs).toHaveLength(1)
    expect(out.encounters).toHaveLength(1)
    expect(out.extraContent).toHaveLength(1)
  })

  it('skips mission files and unknown keys', () => {
    const out = extractFullBackupEntries([
      entry('missions_v2.json', [{ id: 'm1' }]),
      entry('active_missions_v2.json', [{ id: 'm2' }]),
      entry('pilot_groups_v2.json', [{ id: 'g1' }]),
      entry('user.config', { theme: 'dark' }),
    ])

    expect(out).toEqual({ pilots: [], npcs: [], encounters: [], extraContent: [] })
  })

  it('skips empty entries and unparseable JSON without throwing', () => {
    const out = extractFullBackupEntries([
      { filename: 'pilots_v2.json', data: null },
      { filename: 'npcs_v2.json', data: '{not json' },
    ])

    expect(out.pilots).toEqual([])
    expect(out.npcs).toEqual([])
  })

  it('ignores a known file whose contents are not an array', () => {
    expect(extractFullBackupEntries([entry('pilots_v2.json', { id: 'a' })]).pilots).toEqual([])
  })
})

describe('importExtraContent', () => {
  it('writes each pack and refreshes the compendium', async () => {
    await importExtraContent([{ id: 'lcp1' }, { id: 'lcp2' }])

    expect(storage.content).toHaveLength(2)
    expect(CompendiumStore().refreshExtraContent).toHaveBeenCalled()
  })

  it('keeps going when one pack fails to save', async () => {
    vi.mocked(SetItem).mockRejectedValueOnce(new Error('disk full'))

    await importExtraContent([{ id: 'bad' }, { id: 'good' }])

    expect(storage.content.map(p => p.id)).toEqual(['good'])
    expect(CompendiumStore().refreshExtraContent).toHaveBeenCalled()
  })
})

describe('processFullBackup', () => {
  it('imports pilots and reports the counts', async () => {
    const result = await processFullBackup([entry('pilots_v2.json', [v2Pilot('A'), v2Pilot('B')])])

    expect(result.pilotsImported).toBe(2)
    expect(result.errors).toEqual([])
    expect(PilotStore().Pilots).toHaveLength(2)
  })

  it('counts a pilot with missing packs as backed up, not imported', async () => {
    const result = await processFullBackup([
      entry('pilots_v2.json', [{ ...v2Pilot('A'), brews: [{ LcpId: 'absent' }] }]),
    ])

    expect(result.pilotsImported).toBe(0)
    expect(result.pilotsBackedUp).toBe(1)
  })

  it('keeps the raw backup before touching anything', async () => {
    const backup = [entry('pilots_v2.json', [v2Pilot('A')])]
    await processFullBackup(backup)

    expect(SetValue).toHaveBeenCalledWith('v2_backup_download', expect.anything())
  })

  it('releases entry payloads once they are parsed', async () => {
    const backup = [entry('pilots_v2.json', [v2Pilot('A')])]
    await processFullBackup(backup)

    expect(backup[0].data).toBeNull()
  })

  it('loads content packs before importing anything else', async () => {
    const result = await processFullBackup([
      entry('extra_content.json', [{ id: 'lcp1' }]),
      entry('pilots_v2.json', [v2Pilot('A')]),
    ])

    expect(result.lcpsImported).toBe(1)
    expect(storage.content).toHaveLength(1)
  })

  it('does not let a junk entry abort the run', async () => {
    const result = await processFullBackup([entry('pilots_v2.json', [null, v2Pilot('B')])])

    expect(result.errors).toEqual([])
    expect(PilotStore().Pilots.map(p => p.Callsign)).toContain('B')
  })
})

describe('serializeToFullBackup', () => {
  it('turns a localStorage map into backup entries', () => {
    expect(serializeToFullBackup({ 'pilots_v2.json': '[]', 'user.config': null })).toEqual([
      { filename: 'pilots_v2.json', data: '[]' },
      { filename: 'user.config', data: null },
    ])
  })
})

describe('migrateV2LocalStorage', () => {
  it('does nothing when no v2 keys are present', async () => {
    expect(await migrateV2LocalStorage()).toBeNull()
  })

  it('migrates, records the result, and clears the v2 keys', async () => {
    window.localStorage.setItem('pilots_v2.json', JSON.stringify([v2Pilot('A')]))
    window.localStorage.setItem('user.config', '{}')

    const result = await migrateV2LocalStorage()

    expect(result?.pilotsImported).toBe(1)
    expect(storage.values.get('v2_migration_complete')).toBe(true)
    expect(storage.values.get('v2_migration_result')).toMatchObject({ pilotsImported: 1 })
    expect(window.localStorage.getItem('pilots_v2.json')).toBeNull()
    expect(window.localStorage.getItem('user.config')).toBeNull()
  })

  it('does not re-run after a completed migration, and cleans up leftovers', async () => {
    storage.values.set('v2_migration_complete', true)
    window.localStorage.setItem('pilots_v2.json', JSON.stringify([v2Pilot('A')]))

    expect(await migrateV2LocalStorage()).toBeNull()
    expect(window.localStorage.getItem('pilots_v2.json')).toBeNull()
    expect(PilotStore().Pilots).toHaveLength(0)
  })

  it('lists every v2 key it knows how to migrate', () => {
    expect(V2_LOCALSTORAGE_KEYS).toContain('pilots_v2.json')
    expect(V2_LOCALSTORAGE_KEYS).toContain('extra_content.json')
  })
})
