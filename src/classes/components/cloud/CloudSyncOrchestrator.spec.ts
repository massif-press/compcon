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
  batchUpsert,
  downloadFromS3,
  getUploadPresigns,
  updateItem,
  uploadToS3,
} from '@/io/apis/account'
import { AuthStore } from '@/user/store/AuthStore'
import { UserStore } from '@/user/store'
import { CloudDataStore } from '@/user/store/CloudDataStore'
import { NotificationStore } from '@/user/store/NotificationStore'
import { makePilot, markSynced } from '@/__tests__/factories'
import type { Pilot } from '@/classes/pilot/Pilot'
import { CloudSyncOrchestrator as Orchestrator } from './CloudSyncOrchestrator'
import { DbItemMetadata } from './CloudTypes'

const notes = () => NotificationStore().CloudNotifications.map(n => n.text)

function syncedPilot(name = 'Test Pilot 1'): Pilot {
  return markSynced(makePilot({ name }))
}

function changedPilot(name = 'Test Pilot 1'): Pilot {
  const p = syncedPilot(name)
  p.Name = `${name} edited`
  return p
}

let addSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  vi.clearAllMocks()
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  addSpy = vi.spyOn(Orchestrator, 'AddByType').mockResolvedValue()
  vi.mocked(getUploadPresigns).mockImplementation(async uris =>
    Object.fromEntries(uris.map(u => [u, `presign:${u}`]))
  )
  vi.mocked(uploadToS3).mockResolvedValue(true)
  vi.mocked(batchUpsert).mockImplementation(async items => ({
    results: items.map((m: any) => ({ data: { ...m, updated: 900 } })),
  }))
  vi.mocked(updateItem).mockImplementation(async meta => ({ data: { ...meta, updated: 900 } }))
})

describe('BatchUpdateCloud', () => {
  it('skips a synced item', async () => {
    const failures = await Orchestrator.BatchUpdateCloud([syncedPilot()])
    expect(failures).toEqual([])
    expect(getUploadPresigns).not.toHaveBeenCalled()
  })

  it('marks a locally deleted item deleted in the cloud', async () => {
    const p = syncedPilot()
    toRaw(p).SaveController.DeleteTime = 700
    toRaw(p).SaveController.LastModified = 700
    await Orchestrator.BatchUpdateCloud([p])
    expect(updateItem).toHaveBeenCalledWith(expect.objectContaining({ deleted: 700 }), 'item')
    expect(p.CloudController.Metadata.Deleted).toBe(700)
    expect(p.CloudController._lastUploadedItemModified).toBe(700)
  })

  it('merges an item with a server record but no field hashes', async () => {
    const p = changedPilot()
    p.CloudController._lastFieldHashes = null
    const merge = vi.spyOn(p.CloudController, 'syncFromCloud').mockResolvedValue()
    await Orchestrator.BatchUpdateCloud([p])
    expect(merge).toHaveBeenCalled()
    expect(uploadToS3).not.toHaveBeenCalled()
  })

  it('merges an unchanged item whose server version changed', async () => {
    const p = syncedPilot()
    p.CloudController.Metadata = { ...p.CloudController.Metadata.raw, updated: 999 }
    const merge = vi.spyOn(p.CloudController, 'syncFromCloud').mockResolvedValue()
    await Orchestrator.BatchUpdateCloud([p])
    expect(merge).toHaveBeenCalled()
  })

  it('uploads a synced item when forced and marks the upload', async () => {
    await Orchestrator.BatchUpdateCloud([syncedPilot()], true)
    expect(vi.mocked(uploadToS3).mock.calls[0][0]._ts.__forced).toBeGreaterThan(0)
  })

  it('leaves no forced mark when a forced batch fails', async () => {
    vi.mocked(batchUpsert).mockRejectedValue(new Error('TEST1'))
    const p = syncedPilot()
    expect(await Orchestrator.BatchUpdateCloud([p], true)).toHaveLength(1)
    expect(p.CloudController._fieldTs.__forced).toBeUndefined()
  })

  it('uploads instead of merging when forced', async () => {
    const p = syncedPilot()
    p.CloudController.Metadata = { ...p.CloudController.Metadata.raw, updated: 999 }
    const merge = vi.spyOn(p.CloudController, 'syncFromCloud').mockResolvedValue()
    await Orchestrator.BatchUpdateCloud([p], true)
    expect(merge).not.toHaveBeenCalled()
    expect(uploadToS3).toHaveBeenCalledTimes(1)
  })

  it('marks an unchanged item uploaded without uploading', async () => {
    const p = syncedPilot()
    toRaw(p).SaveController.LastModified = 300
    await Orchestrator.BatchUpdateCloud([p])
    expect(uploadToS3).not.toHaveBeenCalled()
    expect(p.CloudController._lastUploadedItemModified).toBe(300)
    expect(p.CloudController.isSynced).toBe(true)
  })

  it('uploads changed items to S3 before writing metadata', async () => {
    const order: string[] = []
    vi.mocked(uploadToS3).mockImplementation(async () => {
      order.push('s3')
      return true
    })
    vi.mocked(batchUpsert).mockImplementation(async items => {
      order.push('db')
      return { results: items.map((m: any) => ({ data: { ...m, updated: 900 } })) }
    })
    const pilots = [changedPilot('Test Pilot 1'), changedPilot('Test Pilot 2')]

    expect(await Orchestrator.BatchUpdateCloud(pilots)).toEqual([])
    expect(order).toEqual(['s3', 's3', 'db'])
    for (const p of pilots) {
      expect(p.CloudController.Metadata.Updated).toBe(900)
      expect(p.CloudController.isSynced).toBe(true)
    }
  })

  it('reports a presign failure', async () => {
    vi.mocked(getUploadPresigns).mockRejectedValue(new Error('presign'))
    const failures = await Orchestrator.BatchUpdateCloud([changedPilot()])
    expect(failures).toHaveLength(1)
    expect(batchUpsert).not.toHaveBeenCalled()
  })

  it('does not write metadata for a failed upload', async () => {
    vi.mocked(uploadToS3).mockResolvedValue(false)
    const failures = await Orchestrator.BatchUpdateCloud([changedPilot()])
    expect(failures).toHaveLength(1)
    expect(batchUpsert).not.toHaveBeenCalled()
  })

  it('reports a failed metadata write', async () => {
    vi.mocked(batchUpsert).mockRejectedValue(new Error('db'))
    const p = changedPilot()
    const failures = await Orchestrator.BatchUpdateCloud([p])
    expect(failures).toHaveLength(1)
    expect(p.CloudController.isSynced).toBe(false)
  })

  it('reports a malformed batch response', async () => {
    vi.mocked(batchUpsert).mockResolvedValue({})
    expect(await Orchestrator.BatchUpdateCloud([changedPilot()])).toHaveLength(1)
  })

  it('reports an item missing from the batch response', async () => {
    vi.mocked(batchUpsert).mockResolvedValue({ results: [{}] })
    expect(await Orchestrator.BatchUpdateCloud([changedPilot()])).toHaveLength(1)
  })
})

describe('UpdateRemote', () => {
  function remotePilot() {
    const p = makePilot({ name: 'Test Pilot 1' })
    p.CloudController.setRemoteMetadata({
      ...p.CloudController.Metadata.raw,
      code: 'TEST1',
      author: 'Test Author',
      item_modified: 100,
      updated: 500,
    })
    return p
  }

  it('skips a synced remote item', async () => {
    const p = remotePilot()
    p.CloudController._lastUploadedItemModified = 100
    p.CloudController._lastSyncedUpdated = 500
    await Orchestrator.UpdateRemote(p)
    expect(downloadFromS3).not.toHaveBeenCalled()
  })

  it('replaces a remote item with the published copy', async () => {
    const p = remotePilot()
    const published = {
      ...toRaw(makePilot({ name: 'Test Pilot 1 v2' })).Serialize(false),
      id: p.ID,
    }
    vi.mocked(downloadFromS3).mockResolvedValue(published)

    await Orchestrator.UpdateRemote(p)
    const added = addSpy.mock.calls[0][1] as Pilot
    expect(added.Name).toBe('Test Pilot 1 v2')
    expect(added.SaveController.RemoteCode).toBe('TEST1')
    expect(added.SaveController.LastModified).toBe(100)
    expect(added.CloudController.isSynced).toBe(true)
  })

  it.each([
    'Download failed: 404 Not Found',
    'Download failed: 403 Forbidden',
  ])('skips a remote item whose file is gone (%s)', async message => {
    vi.mocked(downloadFromS3).mockRejectedValue(new Error(message))
    await expect(Orchestrator.UpdateRemote(remotePilot())).resolves.toBeUndefined()
    expect(addSpy).not.toHaveBeenCalled()
  })
})

describe('ForceDownload', () => {
  function cloudOnly(p: Pilot) {
    const raw = { ...p.CloudController.Metadata.raw, item_modified: 100, updated: 500 }
    return {
      IsCloudOnly: true,
      raw,
      Name: p.Name,
      ItemType: 'pilot',
      CloudController: { Metadata: new DbItemMetadata(raw) },
    }
  }

  it('refuses an item type that does not sync', async () => {
    await Orchestrator.ForceDownload({ ItemType: 'image', Name: 'TEST1', CloudController: {} })
    expect(notes()[0]).toContain('Unable to sync')
    expect(downloadFromS3).not.toHaveBeenCalled()
  })

  it('adds a cloud-only item', async () => {
    const source = makePilot({ name: 'Test Pilot 1' })
    vi.mocked(downloadFromS3).mockResolvedValue(toRaw(source).Serialize(false))

    await Orchestrator.ForceDownload(cloudOnly(source))
    const added = addSpy.mock.calls[0][1] as Pilot
    expect(added.ID).toBe(source.ID)
    expect(added.CloudController.isSynced).toBe(true)
    expect(notes()[0]).toContain('from cloud data')
  })

  it('reports missing cloud data', async () => {
    vi.mocked(downloadFromS3).mockResolvedValue(null)
    await Orchestrator.ForceDownload(cloudOnly(makePilot()))
    expect(notes()[0]).toContain('no cloud data found')
    expect(addSpy).not.toHaveBeenCalled()
  })

  it('strips share fields from the downloaded copy', async () => {
    const local = syncedPilot()
    const data = toRaw(local).Serialize(false)
    data.save.remote_code = 'TEST9'
    vi.mocked(downloadFromS3).mockResolvedValue(data)

    await Orchestrator.ForceDownload(local)
    expect((addSpy.mock.calls[0][1] as Pilot).SaveController.RemoteCode).toBe('')
  })

  it('refuses when local storage is full', async () => {
    UserStore().LocalStorageFull = true
    await expect(Orchestrator.ForceDownload(syncedPilot())).rejects.toThrow('Storage full')
  })
})

describe('ForceUpload', () => {
  it('skips a remote item', async () => {
    const p = syncedPilot()
    toRaw(p).SaveController.RemoteCode = 'TEST1'
    await Orchestrator.ForceUpload(p)
    expect(uploadToS3).not.toHaveBeenCalled()
  })

  it('refuses when cloud storage is full', async () => {
    CloudDataStore().CloudSizeMap = { big: Number.MAX_SAFE_INTEGER }
    await expect(Orchestrator.ForceUpload(syncedPilot())).rejects.toThrow('Cloud storage full')
  })

  it('uploads even when content is unchanged', async () => {
    const p = syncedPilot()
    await Orchestrator.ForceUpload(p)
    expect(uploadToS3).toHaveBeenCalledTimes(1)
    expect(updateItem).toHaveBeenCalledTimes(1)
    expect(p.CloudController._fieldTs.__forced).toBeUndefined()
  })

  it('marks the upload when it is authoritative', async () => {
    const p = syncedPilot()
    await Orchestrator.ForceUpload(p, true)
    expect(p.CloudController._fieldTs.__forced).toBeGreaterThan(0)
  })

  it('leaves no forced mark when the upload fails', async () => {
    vi.mocked(uploadToS3).mockResolvedValue(false)
    const p = syncedPilot()
    await expect(Orchestrator.ForceUpload(p, true)).rejects.toThrow()
    expect(p.CloudController._fieldTs.__forced).toBeUndefined()
  })
})

describe('the type registry', () => {
  it('builds an item by type', () => {
    expect(Orchestrator.NewByType('pilot', { id: 'TEST1' }).ID).toBe('TEST1')
  })

  it('throws on an unknown type', () => {
    expect(() => Orchestrator.NewByType('nonsense', {})).toThrow('Unknown item type')
  })

  it('ignores an add of an unknown type', async () => {
    addSpy.mockRestore()
    await expect(Orchestrator.AddByType('nonsense', {})).resolves.toBeUndefined()
  })
})

describe('ImageMetadata', () => {
  it('builds an image record under the user prefix', () => {
    expect(Orchestrator.ImageMetadata('test image!', 'png', 10)).toEqual({
      user_id: 'user-1',
      sortkey: 'image_testimage.png',
      name: 'testimage',
      uri: 'user-1/images/testimage.png',
      size: 10,
    })
  })
})
