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

import { toRaw } from 'vue'
import {
  downloadFromS3,
  getUploadPresigns,
  updateItem,
  uploadToS3,
  PresignExpiredError,
} from '@/io/apis/account'
import { AuthStore } from '@/user/store/AuthStore'
import { UserStore } from '@/user/store'
import { makePilot, markSynced } from '@/__tests__/factories'
import PilotSheet from '@/features/pilot_management/store/PilotSheet'
import { CloudSyncOrchestrator } from './CloudSyncOrchestrator'
import { CloudTransferController } from './CloudTransferController'
import { setServerTimeOffset } from './fieldMerge'

let addSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  vi.clearAllMocks()
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  addSpy = vi.spyOn(CloudSyncOrchestrator, 'AddByType').mockResolvedValue()
  vi.mocked(getUploadPresigns).mockImplementation(async uris =>
    Object.fromEntries(uris.map(u => [u, `presign:${u}`]))
  )
  vi.mocked(uploadToS3).mockResolvedValue(true)
  vi.mocked(updateItem).mockImplementation(async meta => ({ data: { ...meta, updated: 900 } }))
})

describe('UpdateCloud', () => {
  it('skips an upload when content is unchanged', async () => {
    const p = markSynced(makePilot())
    toRaw(p).SaveController.LastModified = 300
    expect(await p.CloudController.UpdateCloud()).toBe(true)
    expect(uploadToS3).not.toHaveBeenCalled()
    expect(p.CloudController._lastUploadedItemModified).toBe(300)
  })

  it('uploads unchanged content when forced', async () => {
    await markSynced(makePilot()).CloudController.UpdateCloud('item', true)
    expect(uploadToS3).toHaveBeenCalledTimes(1)
  })

  it('retries once with a fresh presign when the first has expired', async () => {
    vi.mocked(uploadToS3).mockRejectedValueOnce(new PresignExpiredError()).mockResolvedValue(true)
    const p = makePilot()
    await p.CloudController.UpdateCloud()
    expect(getUploadPresigns).toHaveBeenCalledTimes(2)
    expect(p.CloudController.Metadata.Updated).toBe(900)
  })

  it('restores the metadata when the upload fails', async () => {
    vi.mocked(uploadToS3).mockResolvedValue(false)
    const p = markSynced(makePilot())
    p.Name = 'Test Pilot 1 edited'
    await expect(p.CloudController.UpdateCloud()).rejects.toThrow('S3 upload failed')
    expect(p.CloudController.Metadata.Updated).toBe(500)
    expect(updateItem).not.toHaveBeenCalled()
  })

  it('restores the metadata when the metadata write fails', async () => {
    vi.mocked(updateItem).mockResolvedValue({ error: 'db' })
    const p = markSynced(makePilot())
    p.Name = 'Test Pilot 1 edited'
    await expect(p.CloudController.UpdateCloud()).rejects.toThrow('db')
    expect(p.CloudController.Metadata.Name).not.toBe('Test Pilot 1 edited')
  })

  it('records a local delete in the metadata', async () => {
    const p = markSynced(makePilot())
    p.SaveController.Delete()
    await p.CloudController.UpdateCloud()
    expect(updateItem).toHaveBeenCalledWith(
      expect.objectContaining({ deleted: p.SaveController.DeleteTime }),
      'item'
    )
  })
})

describe('syncFromCloud', () => {
  it('uploads the local copy when the cloud file is missing', async () => {
    vi.mocked(downloadFromS3).mockResolvedValue(null)
    await markSynced(makePilot()).CloudController.syncFromCloud()
    expect(uploadToS3).toHaveBeenCalledTimes(1)
  })

  it('refuses when local storage is full', async () => {
    UserStore().LocalStorageFull = true
    await expect(makePilot().CloudController.syncFromCloud()).rejects.toThrow('Storage full')
  })
})

describe('syncFromCloud, item-level types', () => {
  function sheet() {
    return markSynced(PilotSheet.FromPilot(makePilot({ name: 'Test Pilot 1' })))
  }

  it('takes the remote copy when it was modified later', async () => {
    const local = sheet()
    const remote = toRaw(local).Serialize()
    remote.round = 4
    remote.save.lastModified = 200
    vi.mocked(downloadFromS3).mockResolvedValue(remote)

    await local.CloudController.syncFromCloud()
    const added = addSpy.mock.calls[0][1] as PilotSheet
    expect(added.Round).toBe(4)
    expect(added.SaveController.LastModified).toBe(200)
    expect(uploadToS3).not.toHaveBeenCalled()
  })

  it('uploads the local copy when it was modified later', async () => {
    const local = sheet()
    const remote = toRaw(local).Serialize()
    remote.round = 4
    remote.save.lastModified = 50
    vi.mocked(downloadFromS3).mockResolvedValue(remote)

    await local.CloudController.syncFromCloud()
    expect(addSpy).not.toHaveBeenCalled()
    expect(uploadToS3).toHaveBeenCalledTimes(1)
  })

  it('takes a forced remote copy over a newer local copy', async () => {
    const local = sheet()
    const remote = toRaw(local).Serialize()
    remote.round = 4
    remote.save.lastModified = 50
    remote._ts = { __forced: 500 }
    vi.mocked(downloadFromS3).mockResolvedValue(remote)

    await local.CloudController.syncFromCloud()
    const added = addSpy.mock.calls[0][1] as PilotSheet
    expect(added.Round).toBe(4)
    expect(uploadToS3).not.toHaveBeenCalled()
  })

  it('keeps an edit made after a forced upload on a device whose clock runs behind', async () => {
    const local = sheet()
    toRaw(local).SaveController.LastModified = Date.now()
    const remote = toRaw(local).Serialize()
    remote.round = 4
    remote.save.lastModified = 50
    remote._ts = { __forced: Date.now() + 30000 }
    vi.mocked(downloadFromS3).mockResolvedValue(remote)

    setServerTimeOffset(Date.now() + 60000)
    await local.CloudController.syncFromCloud()
    setServerTimeOffset(Date.now())
    expect(addSpy).not.toHaveBeenCalled()
    expect(uploadToS3).toHaveBeenCalledTimes(1)
  })

  it('leaves an item open in a runner alone', async () => {
    const local = sheet()
    local.CloudController.Metadata = { ...local.CloudController.Metadata.raw, updated: 800 }
    const remote = toRaw(local).Serialize()
    remote.round = 4
    remote.save.lastModified = 200
    vi.mocked(downloadFromS3).mockResolvedValue(remote)

    CloudTransferController.OpenItems.add(local.ID)
    await local.CloudController.syncFromCloud()
    CloudTransferController.OpenItems.delete(local.ID)
    expect(addSpy).not.toHaveBeenCalled()
    expect(uploadToS3).not.toHaveBeenCalled()
    expect(local.CloudController.isSynced).toBe(false)
  })

  it('does not upload the same version rewritten by another device', async () => {
    const local = sheet()
    local.CloudController.Metadata = { ...local.CloudController.Metadata.raw, updated: 800 }
    const remote = toRaw(local).Serialize()
    remote.combatant.actor.brews = [{ LcpId: 'TEST1' }]
    vi.mocked(downloadFromS3).mockResolvedValue(remote)

    await local.CloudController.syncFromCloud()
    expect(uploadToS3).not.toHaveBeenCalled()
    expect(local.CloudController.isSynced).toBe(true)
  })

  it('uploads the same version when the local copy changed since its last upload', async () => {
    const local = sheet()
    vi.mocked(downloadFromS3).mockResolvedValue(toRaw(local).Serialize())
    toRaw(local).Round = 4

    await local.CloudController.syncFromCloud()
    expect(uploadToS3).toHaveBeenCalledTimes(1)
  })

  it('marks matching copies synced without uploading', async () => {
    const local = sheet()
    local.CloudController.Metadata = { ...local.CloudController.Metadata.raw, updated: 800 }
    vi.mocked(downloadFromS3).mockResolvedValue(toRaw(local).Serialize())

    await local.CloudController.syncFromCloud()
    expect(uploadToS3).not.toHaveBeenCalled()
    expect(local.CloudController._lastSyncedUpdated).toBe(800)
    expect(local.CloudController.isSynced).toBe(true)
  })
})

describe('Download', () => {
  it('reads the item file', async () => {
    vi.mocked(downloadFromS3).mockResolvedValue({ id: 'TEST1' })
    const p = makePilot()
    expect(await p.CloudController.Download()).toEqual({ id: 'TEST1' })
    expect(downloadFromS3).toHaveBeenCalledWith(p.CloudController.Metadata.Uri)
  })
})

describe('setRemoteMetadata', () => {
  it('marks the item as a remote copy', () => {
    const p = makePilot()
    p.CloudController.setRemoteMetadata({
      ...p.CloudController.Metadata.raw,
      code: 'TEST1',
      author: 'Test Author',
      collection: 'Test Collection',
      item_modified: 100,
    })
    expect(p.CloudController.ShareCode).toBe('TEST1')
    expect(p.SaveController.RemoteAuthor).toBe('Test Author')
    expect(p.SaveController.RemoteCollection).toBe('Test Collection')
    expect(p.SaveController.LastModified).toBe(100)
    expect(p.SaveController.IsRemote).toBe(true)
  })
})
