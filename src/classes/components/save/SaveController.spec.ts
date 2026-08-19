import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetItem: vi.fn(async () => null),
  GetAll: vi.fn(async () => []),
  SetAll: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

import { makePilot } from '@/__tests__/factories'
import { SaveController } from './SaveController'
import { SetItem } from '@/io/Storage'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const save = () => pilot.SaveController

beforeEach(() => {
  vi.useFakeTimers()
  pilot = makePilot()
  vi.advanceTimersByTime(2000)
  vi.mocked(SetItem).mockClear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('SaveController.NewSaveData', () => {
  it('stamps creation and leaves the rest zeroed', () => {
    const data = SaveController.NewSaveData()

    expect(data.created).toBeGreaterThan(0)
    expect(data.lastModified).toBe(0)
    expect(data.deleteTime).toBe(0)
  })
})

describe('SaveController.save', () => {
  it('marks the item dirty, stamps it, and writes it', () => {
    save().IsDirty = false
    save().save()
    vi.advanceTimersByTime(2000)

    expect(save().IsDirty).toBe(true)
    expect(save().LastModified).toBeGreaterThan(0)
    expect(SetItem).toHaveBeenCalledWith(pilot.StorageType, expect.anything())
  })

  it('saveSilent writes without marking dirty', () => {
    save().IsDirty = false
    const before = save().LastModified

    save().saveSilent()
    vi.advanceTimersByTime(2000)

    expect(save().IsDirty).toBe(false)
    expect(save().LastModified).toBe(before)
    expect(SetItem).toHaveBeenCalled()
  })

  it('never writes an encounter instance to its own storage', () => {
    ;(pilot as any).IsInstance = true
    save().save()
    vi.advanceTimersByTime(2000)

    expect(SetItem).not.toHaveBeenCalled()
  })
})

describe('SaveController.Delete/Restore', () => {
  it('stamps a delete time and reports the item deleted', () => {
    expect(save().IsDeleted).toBe(false)

    save().Delete()

    expect(save().DeleteTime).toBeGreaterThan(0)
    expect(save().IsDeleted).toBe(true)
    expect(save().DeleteTimeFormatted).toBeTruthy()
  })

  it('restores a deleted item', () => {
    save().Delete()
    save().Restore()

    expect(save().DeleteTime).toBe(0)
    expect(save().IsDeleted).toBe(false)
  })

  it('does not treat a remote item as locally deleted', () => {
    save().SetRemote('share-code', 'author')
    save().DeleteTime = Date.now()

    expect(save().IsDeleted).toBe(false)
  })
})

describe('SaveController.SetRemote', () => {
  it('records the share code, author, and collection', () => {
    save().SetRemote('code', 'author', 'collection', 1700000000000)

    expect(save().RemoteCode).toBe('code')
    expect(save().RemoteAuthor).toBe('author')
    expect(save().RemoteCollection).toBe('collection')
    expect(save().LastModified).toBe(1700000000000)
  })
})

describe('SaveController.Serialize/Deserialize', () => {
  it('round-trips the save block', () => {
    save().SetRemote('code', 'author', 'collection')
    save().markModified()

    const target: any = {}
    SaveController.Serialize(pilot, target)

    const other = makePilot()
    SaveController.Deserialize(other, target.save)

    expect(other.SaveController.RemoteCode).toBe('code')
    expect(other.SaveController.RemoteAuthor).toBe('author')
    expect(other.SaveController.LastModified).toBe(save().LastModified)
  })
})
