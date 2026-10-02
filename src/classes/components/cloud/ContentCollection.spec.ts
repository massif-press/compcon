import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetAll: vi.fn(async () => []),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

vi.mock('@/io/apis/account', () => ({
  cloudDelete: vi.fn(),
  getUploadPresigns: vi.fn(),
  updateItem: vi.fn(),
  uploadToS3: vi.fn(),
}))

import { toRaw } from 'vue'
import { cloudDelete, getUploadPresigns, updateItem, uploadToS3 } from '@/io/apis/account'
import { RemoveItem } from '@/io/Storage'
import { makePilot, makeNpc } from '@/__tests__/factories'
import { AuthStore } from '@/user/store/AuthStore'
import { PilotStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { EncounterStore } from '@/features/gm/store/encounter_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import { CampaignStore } from '@/features/gm/store/campaign_store'
import { Encounter } from '@/classes/encounter/Encounter'
import { Character } from '@/classes/narrative/Character'
import { Campaign } from '@/classes/campaign/Campaign'
import { ContentCollectionStore, ContentPackStore } from '@/features/compendium/store'
import { ContentCollection } from './ContentCollection'

const lcp = { ID: 'TEST_LCP', Name: 'Test LCP', ItemType: 'lcp', Serialize: () => ({}) }

function collectionWith(...items: [string, any][]) {
  const c = new ContentCollection()
  for (const [type, item] of items) c.AddItem(type, item)
  return c
}

let save: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  vi.clearAllMocks()
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  save = vi.spyOn(ContentCollectionStore(), 'saveContentCollection').mockResolvedValue()
  vi.mocked(getUploadPresigns).mockImplementation(async uris =>
    Object.fromEntries(uris.map(u => [u, `presign:${u}`]))
  )
  vi.mocked(uploadToS3).mockResolvedValue(true)
  vi.mocked(updateItem).mockImplementation(async meta => ({ data: meta }))
})

describe('building a collection', () => {
  it('resolves saved entries to local items', () => {
    const p = makePilot()
    const npc = makeNpc()
    const encounter = new Encounter()
    const character = new Character()
    const campaign = new Campaign()
    PilotStore().Pilots = [p]
    NpcStore().Npcs = [npc]
    EncounterStore().Encounters = [encounter]
    NarrativeStore().CollectionItems = [character]
    CampaignStore().Campaigns = [campaign]
    ContentPackStore().ContentPacks = [lcp as any]
    const items: [string, any][] = [
      ['pilots', p],
      ['npcs', npc],
      ['encounters', encounter],
      ['narratives', character],
      ['campaigns', campaign],
      ['lcps', lcp],
    ]
    const saved = ContentCollection.Serialize(collectionWith(...items))

    const c = ContentCollection.Deserialize(saved)
    expect(c.Contents.map(x => x.data)).toEqual(items.map(([, item]) => item))
  })

  it('keeps an entry whose item is gone, without data', () => {
    const saved = ContentCollection.Serialize(collectionWith(['pilots', makePilot()]))
    PilotStore().Pilots = []
    expect(ContentCollection.Deserialize(saved).Contents[0].data).toBeUndefined()
  })

  it('adds and removes entries and logs both', () => {
    const p = makePilot({ name: 'Test Pilot 1' })
    const c = collectionWith(['pilots', p])
    c.RemoveItem({ id: 'TEST9' })
    c.RemoveItem(c.Contents[0])
    expect(c.Contents).toEqual([])
    expect(c.GenerateChangelog()).toContain('Added Pilot Test Pilot 1')
    expect(c.GenerateChangelog()).toContain('Removed Pilot Test Pilot 1')
  })

  it('lists entries edited since they were added', () => {
    const p = makePilot({ name: 'Test Pilot 1' })
    const c = collectionWith(['pilots', p], ['lcps', lcp])
    toRaw(p).SaveController.LastModified = 999
    expect(c.GenerateChangelog()).toContain('Updated Pilot Test Pilot 1')
  })

  it('bumps the version', () => {
    const c = new ContentCollection()
    c.Version = '1.4'
    expect(c.NextVersion('minor')).toBe('1.5')
    expect(c.NextVersion('major')).toBe('2.0')
  })

  it('saves to and removes from local storage', () => {
    const c = new ContentCollection()
    c.Save()
    c.Delete()
    expect(save).toHaveBeenCalledWith(c)
    expect(RemoveItem).toHaveBeenCalledWith(ContentCollection.StorageType, c.ID)
  })
})

describe('Publish', () => {
  it('uploads the collection before writing its record', async () => {
    const order: string[] = []
    vi.mocked(uploadToS3).mockImplementation(async () => {
      order.push('s3')
      return true
    })
    vi.mocked(updateItem).mockImplementation(async meta => {
      order.push('db')
      return { data: meta }
    })
    const c = collectionWith(['pilots', makePilot()])

    await c.Publish('minor')
    expect(order).toEqual(['s3', 'db'])
    const meta = vi.mocked(updateItem).mock.calls[0][0]
    expect(meta.uri).toBe(`user-1/collections/collection_${c.ID}.json`)
    expect(meta.version).toBe('0.1')
    expect(save).toHaveBeenCalled()
  })

  it('publishes the changelog the user wrote', async () => {
    const c = collectionWith(['pilots', makePilot()])
    c.NextChangelog = 'Test changes'
    await c.Publish('major')
    expect(c.Changelog).toEqual([{ version: '1.0', changes: ['Test changes'] }])
    expect(c.NextChangelog).toBe('')
  })

  it('generates the changelog before refreshing entries', async () => {
    const p = makePilot({ name: 'Test Pilot 1' })
    const c = collectionWith(['pilots', p], ['lcps', lcp])
    toRaw(p).SaveController.LastModified = 999

    await c.Publish('minor')
    expect(c.Changelog[0].changes.join('\n')).toContain('Updated Pilot Test Pilot 1')
    expect(c.Contents[0].last_updated).toBe(999)
  })

  it('does not repeat old changes in the next publish', async () => {
    const c = collectionWith(['pilots', makePilot({ name: 'Test Pilot 1' })])
    await c.Publish('minor')
    await c.Publish('minor')
    expect(c.Changelog[1].changes.join('\n')).not.toContain('Added')
  })

  it('rolls back the version and entries when the upload fails', async () => {
    vi.mocked(uploadToS3).mockResolvedValue(false)
    const p = makePilot()
    const c = collectionWith(['pilots', p])
    const before = c.Contents[0].last_updated
    toRaw(p).SaveController.LastModified = 999

    await expect(c.Publish('minor')).rejects.toThrow('S3 upload failed')
    expect(c.Version).toBe('0.0')
    expect(c.Changelog).toEqual([])
    expect(c.Contents[0].last_updated).toBe(before)
    expect(updateItem).not.toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
  })

  it('fails without a presign', async () => {
    vi.mocked(getUploadPresigns).mockResolvedValue({})
    await expect(collectionWith(['pilots', makePilot()]).Publish('minor')).rejects.toThrow(
      'No presign'
    )
  })

  it('fails when the record write fails', async () => {
    vi.mocked(updateItem).mockResolvedValue({ error: 'TEST' })
    await expect(collectionWith(['pilots', makePilot()]).Publish('minor')).rejects.toThrow('TEST')
  })

  it('keeps the share code of a collection published before', async () => {
    const c = collectionWith(['pilots', makePilot()])
    c.Metadata = { created: 5, code: 'TEST1' } as any
    await c.Publish('minor')
    expect(vi.mocked(updateItem).mock.calls[0][0]).toMatchObject({ created: 5, code: 'TEST1' })
  })
})

describe('ContentCollection.Delete', () => {
  beforeEach(() => {
    vi.spyOn(ContentCollectionStore(), 'deleteContentCollection').mockResolvedValue()
  })

  it('deletes a published collection from the cloud', async () => {
    const c = new ContentCollection()
    c.Metadata = { user_id: 'user-1', sortkey: 'collection_TEST1', uri: 'u' } as any
    await ContentCollection.Delete(c)
    expect(cloudDelete).toHaveBeenCalledWith('user-1', 'collection_TEST1', 'u')
  })

  it('only deletes locally when never published', async () => {
    await ContentCollection.Delete(new ContentCollection())
    expect(cloudDelete).not.toHaveBeenCalled()
  })

  it('skips the cloud delete without a user id', async () => {
    AuthStore().Cognito = {}
    const c = new ContentCollection()
    c.Metadata = { sortkey: 'collection_TEST1' } as any
    await ContentCollection.Delete(c)
    expect(cloudDelete).not.toHaveBeenCalled()
  })
})
