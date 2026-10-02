import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@/io/apis/account', () => ({
  cloudDelete: vi.fn(async () => undefined),
  getUser: vi.fn(async () => ({})),
  patchItem: vi.fn(async () => ({})),
  UnauthorizedError: class UnauthorizedError extends Error {},
  getHeaders: vi.fn(async () => ({})),
}))

vi.mock('@/classes/components/cloud/CloudArchive', () => ({
  PostCloudArchive: vi.fn(async () => true),
}))

vi.mock('./CloudDataStore', () => ({
  CloudDataStore: () => ({ setMetadataFromDynamo: vi.fn(async () => undefined) }),
}))

import { setSyncTimer, clearSyncTimer } from './SyncService'
import { pruneBackups, autoBackup } from './BackupService'
import { UserMetadataStore } from './UserMetadataStore'
import { cloudDelete } from '@/io/apis/account'
import { PostCloudArchive } from '@/classes/components/cloud/CloudArchive'
import { DefaultSyncSettings } from './UserMetadataStore'

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

describe('autoBackup', () => {
  const room = { BackupSpaceExceeded: false, BackupLimitExceeded: false } as never
  const day = 86_400_000

  function schedule(autoBackupFrequency: string, lastBackupTime = 0) {
    UserMetadataStore().UserMetadata.SyncSettings = {
      ...DefaultSyncSettings,
      autoBackupFrequency,
      lastBackupTime,
    }
  }

  beforeEach(() => {
    vi.mocked(PostCloudArchive).mockClear()
    vi.spyOn(UserMetadataStore(), 'setUserMetadata').mockResolvedValue()
  })

  it('backs up on startup only when set to app start', async () => {
    schedule('appstart')
    await autoBackup(room)
    expect(PostCloudArchive).not.toHaveBeenCalled()
    await autoBackup(room, true)
    expect(PostCloudArchive).toHaveBeenCalledWith('Automatic')
    expect(UserMetadataStore().SyncSettings.lastBackupTime).toBe(Date.now())
  })

  it.each([
    ['daily', day],
    ['weekly', 7 * day],
    ['monthly', 30 * day],
  ])('backs up %s once the interval has passed', async (frequency, interval) => {
    schedule(frequency, Date.now() - interval + 1000)
    await autoBackup(room)
    expect(PostCloudArchive).not.toHaveBeenCalled()

    schedule(frequency, Date.now() - interval - 1000)
    await autoBackup(room)
    expect(PostCloudArchive).toHaveBeenCalledTimes(1)
  })

  it('never backs up when off or out of room', async () => {
    schedule('none')
    await autoBackup(room, true)
    schedule('appstart')
    await autoBackup({ BackupSpaceExceeded: true } as never, true)
    await autoBackup({ BackupLimitExceeded: true } as never, true)
    expect(PostCloudArchive).not.toHaveBeenCalled()
  })
})
