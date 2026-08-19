import { describe, it, expect } from 'vitest'
import '@/__tests__/factories'
import {
  mergeTs,
  buildFieldHashMap,
  stampChangedFields,
  mergeFields,
  setServerTimeOffset,
} from './fieldMerge'
import { expandFilterTypes, normalizeItemType } from './ItemTypeMap'
import { getItemRegistration, allRegistrations } from './ItemRegistry'

describe('normalizeItemType', () => {
  it('strips separators and case', () => {
    expect(normalizeItemType('Encounter_Instance')).toBe('encounterinstance')
    expect(normalizeItemType('pilot-group')).toBe('pilotgroup')
  })
})

describe('expandFilterTypes', () => {
  it('expands a group into its member types', () => {
    const types = expandFilterTypes(['npc'])

    expect(types).toContain('npc')
    expect(types.length).toBeGreaterThan(1)
  })

  it('leaves a concrete type alone', () => {
    expect(expandFilterTypes(['pilot_sheet'])).toEqual(['pilot_sheet'])
  })

  it('does not duplicate types', () => {
    const types = expandFilterTypes(['npc', 'npc'])
    expect(new Set(types).size).toBe(types.length)
  })
})

describe('mergeTs', () => {
  it('keeps the newer timestamp per field', () => {
    expect(mergeTs({ a: 1, b: 5 }, { a: 3, c: 2 })).toEqual({ a: 3, b: 5, c: 2 })
  })

  it('is a copy, not a mutation', () => {
    const a = { x: 1 }
    mergeTs(a, { x: 9 })
    expect(a.x).toBe(1)
  })
})

describe('buildFieldHashMap', () => {
  it('hashes each field path', () => {
    const map = buildFieldHashMap({ name: 'Nelson', nested: { level: 3 } })

    expect(Object.keys(map).length).toBeGreaterThan(0)
    expect(map).toHaveProperty('name')
  })

  it('gives equal data equal hashes', () => {
    expect(buildFieldHashMap({ name: 'A' })).toEqual(buildFieldHashMap({ name: 'A' }))
  })

  it('gives different data different hashes', () => {
    expect(buildFieldHashMap({ name: 'A' }).name).not.toBe(buildFieldHashMap({ name: 'B' }).name)
  })
})

describe('stampChangedFields', () => {
  it('stamps a field that changed since the last hash', () => {
    const before = { name: 'A', level: 1 }
    const hashes = buildFieldHashMap(before)

    const ts = stampChangedFields({ name: 'B', level: 1 }, hashes, {}, 1000)

    expect(ts.name).toBeGreaterThan(1000)
  })

  it('leaves an unchanged field unstamped, so it falls back to the item baseline', () => {
    const before = { name: 'A' }
    const ts = stampChangedFields(before, buildFieldHashMap(before), {}, 1000)

    expect(ts).not.toHaveProperty('name')
  })

  it('ignores the sync bookkeeping keys', () => {
    const ts = stampChangedFields({ name: 'A', _ts: {}, save: {}, cloud: {} }, null, {}, 1000)

    expect(ts).not.toHaveProperty('_ts')
    expect(ts).not.toHaveProperty('save')
    expect(ts).not.toHaveProperty('cloud')
  })
})

describe('mergeFields', () => {
  it('takes the side with the newer field timestamp', () => {
    const merged = mergeFields(
      { name: 'local', notes: 'local notes', _ts: { name: 200, notes: 50 } },
      { name: 'remote', notes: 'remote notes', _ts: { name: 100, notes: 500 } }
    )

    expect(merged.name).toBe('local')
    expect(merged.notes).toBe('remote notes')
  })

  it('falls back to the item baseline when a field has no stamp', () => {
    const merged = mergeFields(
      { name: 'local', item_modified: 100 },
      { name: 'remote', item_modified: 200 }
    )

    expect(merged.name).toBe('remote')
  })

  it('carries the merged timestamp map onto the result', () => {
    const merged = mergeFields({ _ts: { a: 1 } }, { _ts: { a: 5, b: 2 } })

    expect(merged._ts).toEqual({ a: 5, b: 2 })
  })
})

describe('setServerTimeOffset', () => {
  it('shifts the clock used for new stamps', () => {
    setServerTimeOffset(Date.now() + 60_000)
    const ts = stampChangedFields({ name: 'B' }, buildFieldHashMap({ name: 'A' }), {}, 0)

    expect(ts.name).toBeGreaterThan(Date.now() + 30_000)

    setServerTimeOffset(Date.now())
  })
})

describe('the item registry', () => {
  it('registers the syncable item types', () => {
    expect(allRegistrations().size).toBeGreaterThan(0)
  })

  it('looks a registration up by item type', () => {
    const [type] = [...allRegistrations().keys()]

    expect(getItemRegistration(type)).toBeTruthy()
    expect(getItemRegistration('not_a_type')).toBeUndefined()
  })
})
