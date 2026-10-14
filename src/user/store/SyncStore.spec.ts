import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetAll: vi.fn(async () => []),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

vi.mock('@/io/apis/account', () => ({
  downloadFromS3: vi.fn(),
  getUploadPresigns: vi.fn(),
  invalidateETagCache: vi.fn(),
  updateItem: vi.fn(),
  uploadToS3: vi.fn(),
  batchUpsert: vi.fn(),
  PresignExpiredError: class PresignExpiredError extends Error {},
}))

vi.mock('./SyncService', () => ({ setSyncTimer: vi.fn() }))

import { toRaw } from 'vue'
import { makePilot, makeNpc, markSynced } from '@/__tests__/factories'
import type { Pilot } from '@/classes/pilot/Pilot'
import { CloudController } from '@/classes/components/cloud/CloudController'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { PilotStore, PilotGroupStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { AuthStore } from './AuthStore'
import { UserMetadataStore } from './UserMetadataStore'
import { CloudDataStore } from './CloudDataStore'
import { RemoteItemStore } from './RemoteItemStore'
import { NotificationStore } from './NotificationStore'
import { SyncStore } from './SyncStore'
import { setSyncTimer } from './SyncService'
import { UserStore } from './index'

const sync = () => SyncStore()
const ids = (items: { ID: string }[]) => items.map(x => x.ID).sort()
const notes = () => NotificationStore().CloudNotifications

function remote(p: Pilot, code = 'TEST1') {
  toRaw(p).SaveController.RemoteCode = code
  return p
}

function cloudRow(id: string, extra: Record<string, unknown> = {}) {
  return {
    user_id: 'user-1',
    sortkey: `savedata_pilot_${id}`,
    name: id,
    author: '',
    item_modified: 100,
    uri: `user-1/savedata_pilot_${id}.json`,
    updated: 500,
    ...extra,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  UserMetadataStore().UserMetadata.SyncSettings = {
    ...UserMetadataStore().UserMetadata.SyncSettings,
    frequency: 'manual',
    itemTypes: ['pilot', 'npc'],
  }
  vi.spyOn(UserMetadataStore(), 'getUserMetadata').mockResolvedValue()
  vi.spyOn(UserMetadataStore(), 'setUserMetadata').mockResolvedValue()
  vi.spyOn(CloudDataStore(), 'setMetadataFromDynamo').mockResolvedValue()
})

describe('item lists', () => {
  it('gathers every relevant store', () => {
    const p = makePilot()
    const npc = makeNpc()
    PilotStore().Pilots = [p]
    NpcStore().Npcs = [npc]
    PilotGroupStore().PilotGroups = [
      new PilotGroup({ id: 'no_group', pilots: [] } as any),
      new PilotGroup({ id: 'g1', pilots: [] } as any),
    ]
    expect(ids(sync().AllItems)).toEqual(ids([p, npc, { ID: 'g1' }]))
  })

  it('splits local items from remote copies', () => {
    const local = makePilot()
    const shared = remote(makePilot())
    const collectionCopy = makePilot()
    toRaw(collectionCopy).SaveController.RemoteCollection = 'TEST COLLECTION'
    PilotStore().Pilots = [local, shared, collectionCopy]
    expect(ids(sync().AllLocalItems)).toEqual([local.ID])
    expect(ids(sync().AllRemoteItems)).toEqual(ids([shared, collectionCopy]))
  })

  it('lists cloud rows with no local copy', () => {
    const p = makePilot()
    PilotStore().Pilots = [p]
    CloudDataStore().CloudItems = [
      cloudRow(p.ID),
      cloudRow('TEST1'),
      cloudRow('TEST2', { deleted: 900 }),
    ] as any
    const cloudOnly = sync().CloudOnlyItems
    expect(cloudOnly.map(x => x.ID)).toEqual(['TEST1'])
    expect(cloudOnly[0].IsCloudOnly).toBe(true)
    expect(cloudOnly[0].ItemType).toBe('pilot')
    expect(ids(sync().AllSyncableItems)).toEqual(ids([p, { ID: 'TEST1' }]))
  })

  it('refuses to merge a cloud-only row', async () => {
    CloudDataStore().CloudItems = [cloudRow('TEST1')] as any
    await expect(sync().CloudOnlyItems[0].CloudController.syncFromCloud()).rejects.toThrow()
  })

  it('exposes the synced item types', () => {
    expect(sync().SyncItemTypes).toEqual(expect.arrayContaining(['pilot', 'npc']))
  })
})

describe('AllItemsToSync', () => {
  it('lists unsynced items of the synced types', () => {
    const changed = makePilot()
    const synced = markSynced(makePilot())
    const npc = makeNpc()
    PilotStore().Pilots = [changed, synced]
    NpcStore().Npcs = [npc]
    expect(ids(sync().AllItemsToSync)).toEqual(ids([changed, npc]))
  })

  it('leaves out item types the user does not sync', () => {
    UserMetadataStore().UserMetadata.SyncSettings.itemTypes = ['npc']
    PilotStore().Pilots = [makePilot()]
    expect(sync().AllItemsToSync).toEqual([])
  })

  it('lists a deleted item only when the cloud still has it live', () => {
    const neverUploaded = makePilot()
    const uploaded = markSynced(makePilot())
    const alreadyGone = markSynced(makePilot())
    alreadyGone.CloudController.Metadata.Deleted = 900
    for (const p of [neverUploaded, uploaded, alreadyGone]) p.SaveController.Delete()
    PilotStore().Pilots = [neverUploaded, uploaded, alreadyGone]
    expect(ids(sync().AllItemsToSync)).toEqual([uploaded.ID])
  })

  it('leaves out items held as V2 backups', () => {
    const p = makePilot()
    PilotStore().Pilots = [p]
    UserMetadataStore().V2BackupIds = [p.ID]
    expect(sync().AllItemsToSync).toEqual([])
  })

  it('lists unsynced remote copies separately', () => {
    const shared = remote(makePilot())
    const syncedShared = remote(markSynced(makePilot()), 'TEST2')
    PilotStore().Pilots = [shared, syncedShared, makePilot()]
    expect(ids(sync().AllRemoteItemsToSync)).toEqual([shared.ID])
  })

  it('reports every unsynced item as requiring an update', () => {
    const changed = makePilot()
    PilotStore().Pilots = [changed, markSynced(makePilot())]
    expect(ids(sync().ItemsRequiringUpdate)).toEqual([changed.ID])
  })
})

describe('refreshDbData', () => {
  it('does nothing when signed out', async () => {
    await sync().refreshDbData()
    expect(CloudDataStore().setMetadataFromDynamo).not.toHaveBeenCalled()
  })

  it('refreshes metadata when signed in', async () => {
    AuthStore().IsLoggedIn = true
    await sync().refreshDbData()
    expect(UserMetadataStore().getUserMetadata).toHaveBeenCalled()
    expect(CloudDataStore().setMetadataFromDynamo).toHaveBeenCalled()
  })
})

describe('AutoSync', () => {
  let batch: ReturnType<typeof vi.spyOn>
  let forceDownload: ReturnType<typeof vi.spyOn>
  let updateRemote: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    batch = vi.spyOn(CloudController, 'BatchUpdateCloud').mockResolvedValue([])
    forceDownload = vi.spyOn(CloudController, 'ForceDownload').mockResolvedValue()
    updateRemote = vi.spyOn(CloudController, 'UpdateRemote').mockResolvedValue()
  })

  function serverChanged() {
    const p = markSynced(makePilot())
    p.CloudController.Metadata = { ...p.CloudController.Metadata.raw, updated: 999 }
    return p
  }

  it('downloads cloud-only items, merges server changes, and uploads the rest', async () => {
    const changed = makePilot()
    const pulled = serverChanged()
    const merge = vi.spyOn(pulled.CloudController, 'syncFromCloud').mockResolvedValue()
    PilotStore().Pilots = [changed, pulled]
    CloudDataStore().CloudItems = [cloudRow('TEST1')] as any

    expect(await sync().AutoSync()).toEqual([])
    expect(forceDownload).toHaveBeenCalledTimes(1)
    expect(merge).toHaveBeenCalledTimes(1)
    expect(batch).toHaveBeenCalledWith([changed])
    expect(notes()).toHaveLength(1)
    expect(sync().IsSyncing).toBe(false)
  })

  it('pulls everything when forced to download', async () => {
    const a = makePilot()
    const b = makePilot()
    const merges = [a, b].map(p => vi.spyOn(p.CloudController, 'syncFromCloud').mockResolvedValue())
    PilotStore().Pilots = [a, b]
    CloudDataStore().CloudItems = [cloudRow('TEST1')] as any

    await sync().AutoSync('download')
    expect(forceDownload).toHaveBeenCalledTimes(1)
    for (const m of merges) expect(m).toHaveBeenCalled()
    expect(batch).not.toHaveBeenCalled()
  })

  it('pushes every local item when forced to upload', async () => {
    const a = makePilot()
    const pulled = serverChanged()
    const synced = markSynced(makePilot())
    PilotStore().Pilots = [a, pulled, synced]
    CloudDataStore().CloudItems = [cloudRow('TEST1')] as any

    await sync().AutoSync('upload')
    expect(batch).toHaveBeenCalledWith(expect.arrayContaining([a, pulled, synced]), true)
    expect(forceDownload).not.toHaveBeenCalled()
  })

  it('refreshes remote copies but skips broken share codes', async () => {
    const ok = remote(makePilot(), 'TEST1')
    const broken = remote(makePilot(), 'TEST2')
    PilotStore().Pilots = [ok, broken]
    RemoteItemStore().BrokenRemoteCodes = ['TEST2']

    await sync().AutoSync()
    expect(updateRemote).toHaveBeenCalledTimes(1)
    expect(updateRemote).toHaveBeenCalledWith(ok)
  })

  it('reports partial failures', async () => {
    const changed = makePilot()
    PilotStore().Pilots = [changed, makePilot()]
    batch.mockResolvedValue([{ item: changed, error: 'TEST' }])

    const failures = await sync().AutoSync()
    expect(failures).toHaveLength(1)
    expect(notes()[0].type).toBe('warning')
  })

  it('collects a merge failure instead of aborting', async () => {
    const pulled = serverChanged()
    vi.spyOn(pulled.CloudController, 'syncFromCloud').mockRejectedValue(new Error('TEST'))
    const changed = makePilot()
    PilotStore().Pilots = [pulled, changed]

    expect(await sync().AutoSync()).toHaveLength(1)
    expect(batch).toHaveBeenCalledWith([changed])
  })

  it('collects download and remote refresh failures', async () => {
    const a = makePilot()
    vi.spyOn(a.CloudController, 'syncFromCloud').mockRejectedValue(new Error('TEST'))
    PilotStore().Pilots = [a, remote(makePilot())]
    updateRemote.mockRejectedValue(new Error('TEST'))

    expect(await sync().AutoSync('download')).toHaveLength(2)
  })

  it('marks every item failed when the batch upload throws', async () => {
    PilotStore().Pilots = [makePilot(), makePilot()]
    batch.mockRejectedValue(new Error('TEST'))
    expect(await sync().AutoSync()).toHaveLength(2)
    expect(await sync().AutoSync('upload')).toHaveLength(2)
  })

  it('does not start a second sync while one is running', async () => {
    sync().IsSyncing = true
    expect(await sync().AutoSync()).toEqual([])
    expect(UserMetadataStore().getUserMetadata).not.toHaveBeenCalled()
  })

  it('only refreshes metadata when asked to skip the sync', async () => {
    PilotStore().Pilots = [makePilot()]
    await sync().AutoSync(undefined, false, true)
    expect(CloudDataStore().setMetadataFromDynamo).toHaveBeenCalled()
    expect(batch).not.toHaveBeenCalled()
  })

  it('skips the startup sync unless the frequency includes startup', async () => {
    PilotStore().Pilots = [makePilot()]
    await sync().AutoSync(undefined, true)
    expect(batch).not.toHaveBeenCalled()

    UserMetadataStore().UserMetadata.SyncSettings.frequency = 'On Startup'
    await sync().AutoSync(undefined, true)
    expect(batch).toHaveBeenCalled()
  })

  it('clears the syncing flag after an error', async () => {
    vi.mocked(CloudDataStore().setMetadataFromDynamo).mockRejectedValue(new Error('TEST'))
    await expect(sync().AutoSync()).rejects.toThrow('TEST')
    expect(sync().IsSyncing).toBe(false)
  })

  it('syncs on close only when the frequency includes close', async () => {
    PilotStore().Pilots = [makePilot()]
    await sync().OnUnload()
    expect(batch).not.toHaveBeenCalled()

    UserMetadataStore().UserMetadata.SyncSettings.frequency = 'On Close'
    await sync().OnUnload()
    expect(batch).toHaveBeenCalled()
  })
})

describe('setSyncTimer', () => {
  it('schedules AutoSync at the configured frequency', async () => {
    UserMetadataStore().UserMetadata.SyncSettings.frequency = '5 minutes'
    const auto = vi.spyOn(sync(), 'AutoSync').mockResolvedValue([])
    sync().setSyncTimer()
    expect(setSyncTimer).toHaveBeenCalledWith('5 minutes', expect.any(Function))
    await vi.mocked(setSyncTimer).mock.calls[0][1]()
    expect(auto).toHaveBeenCalled()
  })
})

describe('removeOldItems', () => {
  function deletedLongAgo(cloudDeleted: boolean) {
    const p = markSynced(makePilot())
    toRaw(p).SaveController.DeleteTime = Date.now() - 30 * 86_400_000
    if (cloudDeleted) p.CloudController.Metadata.Deleted = 1
    return p
  }

  it('does nothing when auto-delete is off', async () => {
    UserStore().User = { AutoDeleteDays: 0 } as any
    expect(await sync().removeOldItems()).toBe('Auto-delete is disabled.\n')
  })

  it('purges items deleted long ago that the cloud has also deleted', async () => {
    UserStore().User = { AutoDeleteDays: 7 } as any
    const purge = deletedLongAgo(true)
    const keep = deletedLongAgo(false)
    const recent = markSynced(makePilot())
    recent.SaveController.Delete()
    recent.CloudController.Metadata.Deleted = 1
    PilotStore().Pilots = [purge, keep, recent]
    const remove = vi.spyOn(PilotStore(), 'DeletePilotPermanent').mockResolvedValue()

    expect(await sync().removeOldItems()).toContain('Permanently Deleted pilot')
    expect(remove).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledWith(purge)
  })

  it('never purges groups', async () => {
    UserStore().User = { AutoDeleteDays: 7 } as any
    const g = new PilotGroup({ id: 'g1', pilots: [] } as any)
    g.SaveController.DeleteTime = 1
    g.CloudController.Metadata.Deleted = 1
    PilotGroupStore().PilotGroups = [g]
    expect(await sync().removeOldItems()).toBe('No items to remove\n')
  })
})
