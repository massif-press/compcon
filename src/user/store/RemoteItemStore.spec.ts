import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetAll: vi.fn(async () => []),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

vi.mock('@/io/apis/account', () => ({
  GetFromCode: vi.fn(),
  DownloadViaCode: vi.fn(),
  NotFoundError: class NotFoundError extends Error {},
}))

import { toRaw } from 'vue'
import { GetFromCode, DownloadViaCode, NotFoundError } from '@/io/apis/account'
import { makePilot } from '@/__tests__/factories'
import type { Pilot } from '@/classes/pilot/Pilot'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { PilotStore } from '@/features/pilot_management/store'
import { AuthStore } from './AuthStore'
import { UserMetadataStore } from './UserMetadataStore'
import { RemoteItemStore } from './RemoteItemStore'
import { UserStore } from './index'

const store = () => RemoteItemStore()
const tracked = () => UserMetadataStore().UserMetadata.RemoteItems
let views: Record<string, any>

function share(p: Pilot, code: string, extra: Record<string, unknown> = {}) {
  return {
    user_id: 'author-1',
    sortkey: `savedata_pilot_${p.ID}`,
    name: p.Name,
    author: 'Test Author',
    item_modified: 300,
    uri: `author-1/savedata_pilot_${p.ID}.json`,
    updated: 500,
    code,
    ...extra,
  }
}

function localCopy(code: string) {
  const p = makePilot()
  toRaw(p).SaveController.RemoteCode = code
  return p
}

beforeEach(() => {
  vi.clearAllMocks()
  views = {}
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  UserMetadataStore().UserMetadata.RemoteItems = []
  UserStore().User = {
    View: (key: string, fallback: unknown) => views[key] ?? fallback,
    SetView: (key: string, val: unknown) => (views[key] = val),
  } as any
  vi.spyOn(UserMetadataStore(), 'setUserMetadata').mockResolvedValue()
})

describe('tracking share codes', () => {
  it('tracks and untracks a code', () => {
    store().addRemoteItem('TEST1')
    expect(tracked()).toEqual(['TEST1'])
    store().deleteRemoteItem('TEST1')
    expect(tracked()).toEqual([])
    expect(UserMetadataStore().setUserMetadata).toHaveBeenCalledTimes(2)
  })

  it('ignores untracking a code it does not hold', () => {
    store().deleteRemoteItem('TEST1')
    expect(UserMetadataStore().setUserMetadata).not.toHaveBeenCalled()
  })

  it('records a broken code once and clears it', () => {
    store().addBrokenRemote('TEST1')
    store().addBrokenRemote('TEST1')
    expect(store().BrokenRemoteCodes).toEqual(['TEST1'])
    store().removeBrokenRemote('TEST1')
    expect(store().BrokenRemoteCodes).toEqual([])
  })
})

describe('retryBrokenRemote', () => {
  it('clears the code when it resolves again', async () => {
    store().addBrokenRemote('TEST1')
    vi.mocked(GetFromCode).mockResolvedValue({ code: 'TEST1' })
    const refresh = vi.spyOn(store(), 'setMetadataForRemotes').mockResolvedValue()
    expect(await store().retryBrokenRemote('TEST1')).toBe(true)
    expect(store().BrokenRemoteCodes).toEqual([])
    expect(refresh).toHaveBeenCalled()
  })

  it('keeps the code when it still fails', async () => {
    store().addBrokenRemote('TEST1')
    vi.mocked(GetFromCode).mockRejectedValueOnce(new Error('TEST')).mockResolvedValueOnce(null)
    expect(await store().retryBrokenRemote('TEST1')).toBe(false)
    expect(await store().retryBrokenRemote('TEST1')).toBe(false)
    expect(store().BrokenRemoteCodes).toEqual(['TEST1'])
  })
})

describe('convertBrokenRemoteToLocal', () => {
  it('turns the copy into a local item and forgets the code', () => {
    const p = localCopy('TEST1')
    PilotStore().Pilots = [p]
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']
    store().addBrokenRemote('TEST1')

    store().convertBrokenRemoteToLocal('TEST1')
    expect(p.SaveController.IsRemote).toBe(false)
    expect(store().BrokenRemoteCodes).toEqual([])
    expect(tracked()).toEqual([])
  })
})

describe('setMetadataForRemotes', () => {
  let add: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    add = vi.spyOn(CloudController, 'AddByType').mockResolvedValue()
  })

  it('does nothing without tracked codes', async () => {
    await store().setMetadataForRemotes()
    expect(GetFromCode).not.toHaveBeenCalled()
  })

  it('refreshes the metadata of a local copy', async () => {
    const p = localCopy('TEST1')
    PilotStore().Pilots = [p]
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']
    vi.mocked(GetFromCode).mockResolvedValue([share(p, 'TEST1', { updated: 777 })])

    await store().setMetadataForRemotes()
    expect(p.CloudController.Metadata.Updated).toBe(777)
    expect(add).not.toHaveBeenCalled()
  })

  it('leaves the metadata of an item the user owns alone', async () => {
    const p = localCopy('TEST1')
    PilotStore().Pilots = [p]
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']
    vi.mocked(GetFromCode).mockResolvedValue([share(p, 'TEST1', { user_id: 'user-1' })])

    await store().setMetadataForRemotes()
    expect(p.CloudController.Metadata.Updated).toBeUndefined()
  })

  it('downloads a tracked code with no local copy', async () => {
    const source = makePilot({ name: 'Test Pilot 1' })
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']
    vi.mocked(GetFromCode).mockResolvedValue([share(source, 'TEST1')])
    vi.mocked(DownloadViaCode).mockResolvedValue(toRaw(source).Serialize(false))

    await store().setMetadataForRemotes()
    const added = add.mock.calls[0][1] as Pilot
    expect(added.ID).toBe(source.ID)
    expect(added.SaveController.RemoteCode).toBe('TEST1')
    expect(added.SaveController.LastModified).toBe(300)
  })

  it('ignores codes it did not ask for', async () => {
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']
    vi.mocked(GetFromCode).mockResolvedValue([share(makePilot(), 'TEST9')])
    await store().setMetadataForRemotes()
    expect(DownloadViaCode).not.toHaveBeenCalled()
  })

  it('falls back to single lookups and marks missing codes broken', async () => {
    const p = localCopy('TEST1')
    PilotStore().Pilots = [p, localCopy('TEST2'), localCopy('TEST3')]
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1', 'TEST2', 'TEST3']
    vi.mocked(GetFromCode).mockImplementation(async (codes: any) => {
      if (Array.isArray(codes)) throw new Error('batch')
      if (codes === 'TEST1') return share(p, 'TEST1', { updated: 777 })
      if (codes === 'TEST2') throw new NotFoundError('missing')
      throw new Error('offline')
    })

    await store().setMetadataForRemotes()
    expect(p.CloudController.Metadata.Updated).toBe(777)
    expect(store().BrokenRemoteCodes).toEqual(['TEST2'])
    expect(views.brokenRemoteCodes.codes).toEqual(['TEST2'])
  })

  it('restores broken codes saved in the last day', async () => {
    views.brokenRemoteCodes = { codes: ['TEST2'], expires: Date.now() + 1000 }
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']
    vi.mocked(GetFromCode).mockResolvedValue([])
    await store().setMetadataForRemotes()
    expect(store().BrokenRemoteCodes).toEqual(['TEST2'])
  })

  it('detaches an extra import that tracks the wrong item', async () => {
    const real = localCopy('TEST1')
    const extra = localCopy('TEST1')
    PilotStore().Pilots = [real, extra]
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']
    vi.mocked(GetFromCode).mockResolvedValue([share(real, 'TEST1')])

    await store().setMetadataForRemotes()
    expect(real.SaveController.IsRemote).toBe(true)
    expect(extra.SaveController.IsRemote).toBe(false)
  })

  it('stops tracking codes with no local copy left', async () => {
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']
    vi.mocked(GetFromCode).mockResolvedValue([share(makePilot(), 'TEST1', { deleted: 900 })])
    await store().setMetadataForRemotes()
    expect(tracked()).toEqual([])
  })
})
