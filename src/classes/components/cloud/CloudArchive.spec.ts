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
  updateItem: vi.fn(),
  uploadToS3: vi.fn(),
}))

vi.mock('@/io/BulkData', () => ({
  exportAll: vi.fn(async () => ({ pilots: [] })),
  importAll: vi.fn(),
}))

import { downloadFromS3, getUploadPresigns, updateItem, uploadToS3 } from '@/io/apis/account'
import { importAll } from '@/io/BulkData'
import { AuthStore } from '@/user/store/AuthStore'
import { CloudDataStore } from '@/user/store/CloudDataStore'
import { SyncStore } from '@/user/store/SyncStore'
import { PilotStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import { EncounterStore } from '@/features/gm/store/encounter_store'
import { CampaignStore } from '@/features/gm/store/campaign_store'
import { NavStore } from '@/stores/nav'
import { PostCloudArchive, DownloadCloudArchive, SetCloudArchive } from './CloudArchive'

beforeEach(() => {
  vi.clearAllMocks()
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  vi.mocked(getUploadPresigns).mockImplementation(async uris =>
    Object.fromEntries(uris.map(u => [u, `presign:${u}`]))
  )
  vi.mocked(uploadToS3).mockResolvedValue(true)
  vi.mocked(updateItem).mockImplementation(async meta => ({ data: { ...meta, updated: 900 } }))
})

describe('PostCloudArchive', () => {
  it('uploads the archive before writing its record', async () => {
    const order: string[] = []
    vi.mocked(uploadToS3).mockImplementation(async () => {
      order.push('s3')
      return true
    })
    vi.mocked(updateItem).mockImplementation(async meta => {
      order.push('db')
      return { data: meta }
    })

    expect(await PostCloudArchive('Manual')).toBe(true)
    expect(order).toEqual(['s3', 'db'])
    const meta = vi.mocked(updateItem).mock.calls[0][0]
    expect(meta.uri).toMatch(/^user-1\/archives\/archive_\d+\.json$/)
    expect(meta.source).toBe('Manual')
    expect(CloudDataStore().CloudArchives).toHaveLength(1)
  })

  it('writes no record when the upload fails', async () => {
    vi.mocked(uploadToS3).mockResolvedValue(false)
    await expect(PostCloudArchive('Automatic')).rejects.toThrow('Archive upload failed')
    expect(updateItem).not.toHaveBeenCalled()
  })

  it('writes no record without a presign', async () => {
    vi.mocked(getUploadPresigns).mockResolvedValue({})
    await expect(PostCloudArchive('Automatic')).rejects.toThrow('No presign')
    expect(uploadToS3).not.toHaveBeenCalled()
  })
})

describe('DownloadCloudArchive', () => {
  it('returns the archive', async () => {
    vi.mocked(downloadFromS3).mockResolvedValue({ data: 'TEST' })
    expect(await DownloadCloudArchive('user-1/archives/a.json')).toEqual({ data: 'TEST' })
  })

  it('throws when the archive is missing', async () => {
    vi.mocked(downloadFromS3).mockResolvedValue(null)
    await expect(DownloadCloudArchive('user-1/archives/a.json')).rejects.toThrow('Failed')
  })
})

describe('SetCloudArchive', () => {
  function stubLoaders() {
    return [
      vi.spyOn(PilotStore(), 'LoadPilots').mockResolvedValue(),
      vi.spyOn(NpcStore(), 'LoadNpcs').mockResolvedValue(),
      vi.spyOn(NarrativeStore(), 'LoadCollectionItems').mockResolvedValue(),
      vi.spyOn(EncounterStore(), 'LoadEncounters').mockResolvedValue(),
      vi.spyOn(CampaignStore(), 'LoadCampaigns').mockResolvedValue(),
      vi.spyOn(NavStore(), 'CreateIndex').mockResolvedValue(),
    ]
  }

  it('imports the archive and reloads every store', async () => {
    const loaders = stubLoaders()
    const sync = vi.spyOn(SyncStore(), 'AutoSync').mockResolvedValue([])
    await SetCloudArchive({ data: { pilots: [] } }, false)
    expect(importAll).toHaveBeenCalledWith({ pilots: [] }, false)
    for (const l of loaders) expect(l).toHaveBeenCalled()
    expect(sync).not.toHaveBeenCalled()
  })

  it('pushes the restored data when asked to overwrite the cloud', async () => {
    stubLoaders()
    const sync = vi.spyOn(SyncStore(), 'AutoSync').mockResolvedValue([])
    await SetCloudArchive({ data: {} }, true)
    expect(sync).toHaveBeenCalledWith('upload', undefined, undefined)
  })
})
