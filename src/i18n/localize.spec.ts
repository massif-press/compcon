import { describe, it, expect, beforeEach } from 'vitest'
import { localize, localizeNested } from './localize'
import { enumLabel } from './enumLabel'
import { keyPrefixes } from './contentKeys'
import { LocalizationStore } from '@/stores/localization'
import { ItemType } from '@/classes/enums'

beforeEach(() => {
  LocalizationStore().catalog = {}
})

describe('localize', () => {
  it('falls back when the catalog has no entry', () => {
    expect(localize('mf_everest', 'name', 'Everest')).toBe('Everest')
  })

  it('returns the catalog entry when there is one', () => {
    LocalizationStore().catalog = { 'mf_everest.name': 'Everest (DE)' }

    expect(localize('mf_everest', 'name', 'Everest')).toBe('Everest (DE)')
  })

  it('keys on both id and field', () => {
    LocalizationStore().catalog = { 'mf_everest.description': 'Beschreibung' }

    expect(localize('mf_everest', 'name', 'Everest')).toBe('Everest')
    expect(localize('mf_everest', 'description', 'desc')).toBe('Beschreibung')
  })
})

describe('localizeNested', () => {
  it('falls back for an object with no registered prefix', () => {
    expect(localizeNested({}, 'detail', 'fallback')).toBe('fallback')
  })

  it('uses the prefix registered for the object', () => {
    const obj = {}
    keyPrefixes.set(obj, 'mf_everest')
    LocalizationStore().catalog = { 'mf_everest.detail': 'Detail (DE)' }

    expect(localizeNested(obj, 'detail', 'fallback')).toBe('Detail (DE)')
  })
})

describe('enumLabel', () => {
  it('passes through an empty value', () => {
    expect(enumLabel('itemType', '')).toBe('')
    expect(enumLabel('itemType', null)).toBe('')
    expect(enumLabel('itemType', undefined)).toBe('')
  })

  it('falls back to the raw value when there is no translation key', () => {
    expect(enumLabel('not_a_kind', 'Whatever')).toBe('Whatever')
  })

  it('translates a known enum value', () => {
    const label = enumLabel('itemType', ItemType.Frame)
    expect(label).toBeTruthy()
  })
})
