import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@/io/apis/account', () => ({
  getUser: vi.fn(),
  patchItem: vi.fn(),
  UnauthorizedError: class UnauthorizedError extends Error {},
}))
vi.mock('aws-amplify/auth', () => ({ signOut: vi.fn() }))
vi.mock('@/io/V2CloudImporter', () => ({ checkV2CloudData: vi.fn() }))
vi.mock('@/io/V2Importer', () => ({ getV2Backups: vi.fn() }))

import { getUser, patchItem, UnauthorizedError } from '@/io/apis/account'
import { checkV2CloudData } from '@/io/V2CloudImporter'
import { getV2Backups } from '@/io/V2Importer'
import { UserProfile } from '@/user'
import { AuthStore } from './AuthStore'
import { NotificationStore } from './NotificationStore'
import {
  UserMetadata,
  UserMetadataStore,
  DefaultSyncSettings,
  setSaveUserProfileCallback,
} from './UserMetadataStore'
import { UserStore } from './index'

const store = () => UserMetadataStore()
let clock = Date.parse('2026-09-01T00:00:00Z')

function cloudSettings(overrides: Record<string, unknown> = {}) {
  return {
    ...UserProfile.Serialize(new UserProfile('TEST1')),
    latest_change: UserStore().User.latest_change + 1000,
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  clock += 60_000
  vi.setSystemTime(clock)
  localStorage.clear()
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  UserStore().User = new UserProfile('TEST1')
  vi.mocked(patchItem).mockResolvedValue({})
})

afterEach(() => {
  vi.useRealTimers()
})

describe('UserMetadata', () => {
  it('gives each user a new copy of the default settings', () => {
    const a = new UserMetadata({})
    a.SyncSettings.itemTypes.push('TEST')
    a.SyncSettings.lastSyncTime = 5
    expect(new UserMetadata({}).SyncSettings).toEqual(DefaultSyncSettings)
    expect(DefaultSyncSettings.itemTypes).not.toContain('TEST')
  })
})

describe('getUserMetadata', () => {
  it('loads the cloud record', async () => {
    vi.mocked(getUser).mockResolvedValue({ user_id: 'user-1', remote_items: ['TEST1'] })
    await store().getUserMetadata()
    expect(store().UserMetadata.RemoteItems).toEqual(['TEST1'])
  })

  it('reuses a fetch from the last 30 seconds unless forced', async () => {
    vi.mocked(getUser).mockResolvedValue({ user_id: 'user-1' })
    await store().getUserMetadata()
    await store().getUserMetadata()
    expect(getUser).toHaveBeenCalledTimes(1)
    await store().getUserMetadata(true)
    expect(getUser).toHaveBeenCalledTimes(2)
  })

  it('signs out on an unauthorized response', async () => {
    vi.mocked(getUser).mockRejectedValue(new UnauthorizedError('TEST'))
    const signOut = vi.spyOn(AuthStore(), 'signOut').mockImplementation(async () => {})
    await expect(store().getUserMetadata()).rejects.toBeInstanceOf(UnauthorizedError)
    expect(signOut).toHaveBeenCalled()
  })

  it('passes other errors through', async () => {
    vi.mocked(getUser).mockRejectedValue(new Error('TEST'))
    await expect(store().getUserMetadata()).rejects.toThrow('TEST')
  })

  it('takes newer settings from another device', async () => {
    vi.mocked(getUser).mockResolvedValue({
      user_id: 'user-1',
      user_setting_data: cloudSettings({ theme: 'TEST_THEME' }),
    })
    await store().getUserMetadata()
    expect(UserStore().User.Theme).toBe('TEST_THEME')
    expect(NotificationStore().CloudNotifications[0].text).toContain('another device')
  })

  it('keeps auto-delete off when settings arrive from another device', async () => {
    vi.mocked(getUser).mockResolvedValue({
      user_id: 'user-1',
      user_setting_data: cloudSettings({ auto_delete_days: 0 }),
    })
    await store().getUserMetadata()
    expect(UserStore().User.AutoDeleteDays).toBe(0)
  })

  it('ignores cloud settings when settings sync is off', async () => {
    vi.mocked(getUser).mockResolvedValue({
      user_id: 'user-1',
      sync_settings: { ...DefaultSyncSettings, includeSettings: false },
      user_setting_data: cloudSettings({ theme: 'TEST_THEME' }),
    })
    await store().getUserMetadata()
    expect(UserStore().User.Theme).not.toBe('TEST_THEME')
  })

  it('takes achievements and LCP configs the device is missing', async () => {
    vi.mocked(getUser).mockResolvedValue({
      user_id: 'user-1',
      sync_settings: { ...DefaultSyncSettings, includeSettings: false },
      lcp_configs: [{ id: 'TEST_CONFIG' }],
      user_setting_data: cloudSettings({ achievement_unlocks: [{ id: 'TEST_ACH' }] }),
    })
    await store().getUserMetadata()
    expect(UserStore().User.AchievementUnlocks).toEqual([{ id: 'TEST_ACH' }])
    expect(UserStore().User.LcpConfigs).toEqual([{ id: 'TEST_CONFIG' }])
  })
})

describe('setUserMetadata', () => {
  it('sends one patch for multiple changes', async () => {
    store().UserMetadata.RemoteItems = ['TEST1', 'TEST1', 'TEST2']
    const saves = [store().setUserMetadata(), store().setUserMetadata()]
    await vi.advanceTimersByTimeAsync(2000)
    await Promise.all(saves)

    expect(patchItem).toHaveBeenCalledTimes(1)
    const [sortkey, payload] = vi.mocked(patchItem).mock.calls[0]
    expect(sortkey).toBe('meta')
    expect(payload.remote_items).toEqual(['TEST1', 'TEST2'])
    expect(payload.sync_settings).toBe(store().UserMetadata.SyncSettings)
  })

  it('saves the local profile before sending it', async () => {
    const saveProfile = vi.fn()
    setSaveUserProfileCallback(saveProfile)
    const save = store().setUserMetadata()
    await vi.advanceTimersByTimeAsync(2000)
    await save
    expect(saveProfile).toHaveBeenCalled()
  })

  it('resolves even when the patch fails', async () => {
    vi.mocked(patchItem).mockRejectedValue(new Error('TEST'))
    const save = store().setUserMetadata()
    await vi.advanceTimersByTimeAsync(2000)
    await expect(save).resolves.toBeUndefined()
  })
})

describe('V2 cloud migration', () => {
  beforeEach(() => {
    vi.spyOn(store(), 'setUserMetadata').mockResolvedValue()
    AuthStore().IsLoggedIn = true
  })

  it('marks pending when V2 data exists, complete otherwise', async () => {
    vi.mocked(checkV2CloudData).mockResolvedValueOnce({ hasV2Data: true } as any)
    await store().checkV2CloudMigration()
    expect(store().UserMetadata.V2CloudImportStatus).toBe('pending')

    store().UserMetadata.V2CloudImportStatus = 'none'
    vi.mocked(checkV2CloudData).mockResolvedValueOnce({ hasV2Data: false } as any)
    await store().checkV2CloudMigration()
    expect(store().UserMetadata.V2CloudImportStatus).toBe('complete')
  })

  it('skips the check when signed out or already complete', async () => {
    AuthStore().IsLoggedIn = false
    await store().checkV2CloudMigration()
    AuthStore().IsLoggedIn = true
    store().UserMetadata.V2CloudImportStatus = 'complete'
    await store().checkV2CloudMigration()
    expect(checkV2CloudData).not.toHaveBeenCalled()
  })

  it('survives a failed check', async () => {
    vi.mocked(checkV2CloudData).mockRejectedValue(new Error('TEST'))
    await expect(store().checkV2CloudMigration()).resolves.toBeUndefined()
  })

  it('can be reset to pending', async () => {
    store().UserMetadata.V2CloudImportStatus = 'complete'
    await store().resetV2CloudMigration()
    expect(store().UserMetadata.V2CloudImportStatus).toBe('pending')
  })

  it('refreshes the V2 backup ids', async () => {
    vi.mocked(getV2Backups).mockResolvedValue([{ id: 'TEST1' }] as any)
    await store().refreshV2BackupIds()
    expect(store().V2BackupIds).toEqual(['TEST1'])
  })
})
