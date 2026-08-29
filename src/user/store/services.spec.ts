import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@/io/apis/account', () => ({
  cloudDelete: vi.fn(async () => undefined),
  getUser: vi.fn(async () => ({})),
  patchItem: vi.fn(async () => ({})),
  UnauthorizedError: class UnauthorizedError extends Error {},
  getHeaders: vi.fn(async () => ({})),
}))

vi.mock('./CloudDataStore', () => ({
  CloudDataStore: () => ({ setMetadataFromDynamo: vi.fn(async () => undefined) }),
}))

import { setSyncTimer, clearSyncTimer } from './SyncService'
import { pruneBackups } from './BackupService'
import { UserMetadataStore } from './UserMetadataStore'
import { cloudDelete } from '@/io/apis/account'

const withTier = (title: string | null) => {
  UserMetadataStore().UserMetadata = {
    PatreonData: title ? { profile: { tierData: { title } } } : undefined,
    UserID: 'user-1',
  } as never
}

beforeEach(() => {
  vi.useFakeTimers()
  clearSyncTimer()
  vi.mocked(cloudDelete).mockClear()
})

afterEach(() => {
  clearSyncTimer()
  vi.useRealTimers()
})

describe('setSyncTimer', () => {
  it('ignores a frequency that is not in minutes', async () => {
    const callback = vi.fn(async () => undefined)

    setSyncTimer('manual', callback)
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000)

    expect(callback).not.toHaveBeenCalled()
  })

  it('ignores a frequency with no parseable interval', async () => {
    const callback = vi.fn(async () => undefined)

    setSyncTimer('minutes_never', callback)
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000)

    expect(callback).not.toHaveBeenCalled()
  })

  it('runs the callback on the interval for a supporter', async () => {
    withTier('lancer')
    const callback = vi.fn(async () => undefined)

    setSyncTimer('minutes_5', callback)
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('stops itself when the account is not a supporter', async () => {
    withTier(null)
    const callback = vi.fn(async () => undefined)

    setSyncTimer('minutes_5', callback)
    await vi.advanceTimersByTimeAsync(15 * 60 * 1000)

    expect(callback).not.toHaveBeenCalled()
  })

  it('replaces a timer that is already running', async () => {
    withTier('lancer')
    const first = vi.fn(async () => undefined)
    const second = vi.fn(async () => undefined)

    setSyncTimer('minutes_5', first)
    setSyncTimer('minutes_5', second)
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000)

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('clears cleanly', async () => {
    withTier('lancer')
    const callback = vi.fn(async () => undefined)

    setSyncTimer('minutes_5', callback)
    clearSyncTimer()
    await vi.advanceTimersByTimeAsync(10 * 60 * 1000)

    expect(callback).not.toHaveBeenCalled()
  })
})

describe('pruneBackups', () => {
  it('does nothing when there is nothing to prune', async () => {
    await pruneBackups({ PrunableBackups: [] } as never)

    expect(cloudDelete).not.toHaveBeenCalled()
  })

  it('deletes every prunable backup', async () => {
    withTier('lancer')

    await pruneBackups({
      PrunableBackups: [
        { sortkey: 'a', uri: 'user-1/a.json' },
        { sortkey: 'b', uri: 'user-1/b.json' },
      ],
    } as never)

    expect(cloudDelete).toHaveBeenCalledTimes(2)
    expect(cloudDelete).toHaveBeenCalledWith('user-1', 'a', 'user-1/a.json')
  })
})
