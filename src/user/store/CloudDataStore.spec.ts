import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetAll: vi.fn(async () => []),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

vi.mock('@/io/apis/account', () => ({
  getUserDataChanged: vi.fn(),
  bulkDelete: vi.fn(),
  cloudDelete: vi.fn(),
}))

import { toRaw } from 'vue'
import { bulkDelete, cloudDelete, getUserDataChanged } from '@/io/apis/account'
import { makePilot, makeNpc, markSynced } from '@/__tests__/factories'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import { Character } from '@/classes/narrative/Character'
import { ContentCollectionStore } from '@/features/compendium/store/ContentCollectionStore'
import { AuthStore } from './AuthStore'
import { UserMetadataStore } from './UserMetadataStore'
import { NotificationStore } from './NotificationStore'
import { RemoteItemStore } from './RemoteItemStore'
import { CloudDataStore } from './CloudDataStore'

const store = () => CloudDataStore()

function row(sortkey: string, extra: Record<string, unknown> = {}) {
  return {
    user_id: 'user-1',
    sortkey,
    name: sortkey,
    author: '',
    item_modified: 100,
    uri: `user-1/${sortkey}.json`,
    updated: 500,
    size: 10,
    ...extra,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  store().resetLastQuery()
  vi.spyOn(RemoteItemStore(), 'setMetadataForRemotes').mockResolvedValue()
  vi.spyOn(UserMetadataStore(), 'setUserMetadata').mockResolvedValue()
  vi.mocked(bulkDelete).mockResolvedValue({ unprocessed: 0 })
})

describe('storage getters', () => {
  it('sums the size of every cloud item', () => {
    store().CloudSizeMap = { a: 10, b: 15 }
    expect(store().CloudStorageUsed).toBe(25)
    expect(store().CloudStorageFull).toBe(false)
  })

  it('reports full storage past the tier limit', () => {
    store().CloudSizeMap = { a: store().MaxCloudStorage + 1 }
    expect(store().CloudStorageFull).toBe(true)
  })

  it('raises the limit for patron tiers', () => {
    const base = store().MaxCloudStorage
    UserMetadataStore().UserMetadata.PatreonData = {
      profile: { tierData: { title: 'Cosmopolitan' } },
    } as any
    expect(store().MaxCloudStorage).toBe(base * 50)
  })

  it('lifts the publish limit on localhost', () => {
    expect(store().CollectionPublishLimit).toBe(-1)
  })

  it('expands the synced item type groups', () => {
    UserMetadataStore().UserMetadata.SyncSettings.itemTypes = ['pilot']
    expect(store().SyncItemTypes).toContain('pilot')
  })

  it('attaches published metadata to local collections', () => {
    ContentCollectionStore().ContentCollections = [{ ID: 'c1' } as any]
    store().UserPublishedCollections = [row('collection_c1')] as any
    expect((store().UserCollections[0] as any).Metadata.sortkey).toBe('collection_c1')
  })
})

describe('getLocalItem', () => {
  it('ignores non-item rows', () => {
    for (const key of ['meta', 'archive_1', 'image_x.png', 'collection_c1'])
      expect(store().getLocalItem(key)).toBeUndefined()
  })

  it('finds a local item by sort key', () => {
    const p = makePilot()
    const npc = makeNpc()
    PilotStore().Pilots = [p]
    NpcStore().Npcs = [npc]
    expect(store().getLocalItem(`savedata_pilot_${p.ID}`)?.ID).toBe(p.ID)
    expect(store().getLocalItem(`savedata_unit_${npc.ID}`)?.ID).toBe(npc.ID)
  })

  it('resolves legacy npc and narrative sort keys', () => {
    const npc = makeNpc()
    const character = new Character()
    NpcStore().Npcs = [npc]
    NarrativeStore().CollectionItems = [character]
    expect(store().getLocalItem(`savedata_npc_${npc.ID}`)?.ID).toBe(npc.ID)
    expect(store().getLocalItem(`savedata_collectionitem_${character.ID}`)?.ID).toBe(character.ID)
    expect(store().getLocalItem('savedata_nonsense_TEST1')).toBeUndefined()
  })

  it('finds an item whose id contains an underscore', () => {
    const p = Pilot.Deserialize({ ...Pilot.Serialize(makePilot()), id: 'TEST_PILOT_1' })
    PilotStore().Pilots = [p]
    expect(store().getLocalItem('savedata_pilot_TEST_PILOT_1')?.ID).toBe('TEST_PILOT_1')
  })
})

describe('setCloudDataItem', () => {
  it('files each row under its data type', () => {
    store().setCloudDataItem(row('savedata_pilot_TEST1'))
    store().setCloudDataItem(row('archive_1'))
    store().setCloudDataItem(row('image_test.png'))
    store().setCloudDataItem(row('meta'))
    expect(store().CloudItems).toHaveLength(1)
    expect(store().CloudArchives).toHaveLength(1)
    expect(store().CloudImages).toHaveLength(1)
  })

  it('merges a row it already holds', () => {
    store().setCloudDataItem(row('savedata_pilot_TEST1'))
    store().setCloudDataItem({ sortkey: 'savedata_pilot_TEST1', updated: 900 })
    expect(store().CloudItems).toEqual([expect.objectContaining({ updated: 900, size: 10 })])
  })

  it('attaches a published collection to the local copy', () => {
    const collection = { ID: 'c1' } as any
    ContentCollectionStore().ContentCollections = [collection]
    store().setCloudDataItem(row('collection_c1'))
    expect(collection.Metadata.sortkey).toBe('collection_c1')
    expect(store().UserPublishedCollections).toHaveLength(1)
  })
})

describe('setMetadataFromDynamo', () => {
  it('fetches everything on first load', async () => {
    const p = makePilot()
    PilotStore().Pilots = [p]
    vi.mocked(getUserDataChanged).mockResolvedValue({
      serverTime: 1000,
      items: [row(`savedata_pilot_${p.ID}`), row('savedata_pilot_TEST1')],
    })

    await store().setMetadataFromDynamo()
    expect(getUserDataChanged).toHaveBeenCalledWith('user-1', 0)
    expect(p.CloudController.Metadata.Updated).toBe(500)
    expect(store().CloudItems.map(x => x.sortkey)).toEqual(['savedata_pilot_TEST1'])
    expect(store().CloudStorageUsed).toBe(20)
    expect(localStorage.getItem('cc_last_query_user-1')).toBe('1000')
    expect(RemoteItemStore().setMetadataForRemotes).toHaveBeenCalled()
  })

  it('fetches only changes after the first load', async () => {
    vi.mocked(getUserDataChanged).mockResolvedValue({ serverTime: 1000, items: [] })
    await store().setMetadataFromDynamo()
    vi.mocked(getUserDataChanged).mockResolvedValue({
      serverTime: 2000,
      items: [row('savedata_pilot_TEST1')],
    })

    await store().setMetadataFromDynamo()
    expect(getUserDataChanged).toHaveBeenLastCalledWith('user-1', 1000)
    expect(store().CloudItems).toHaveLength(1)
    expect(store().LastQuery).toBe(2000)
  })

  it('drops a row deleted on another device', async () => {
    vi.mocked(getUserDataChanged).mockResolvedValue({
      serverTime: 1000,
      items: [row('savedata_pilot_TEST1')],
    })
    await store().setMetadataFromDynamo()
    vi.mocked(getUserDataChanged).mockResolvedValue({
      serverTime: 2000,
      items: [row('savedata_pilot_TEST1', { deleted: 1500 })],
    })

    await store().setMetadataFromDynamo()
    expect(store().CloudItems).toEqual([])
    expect(store().CloudStorageUsed).toBe(0)
  })

  for (const load of ['first', 'later']) {
    it(`marks a local item deleted when another device deleted it (${load} load)`, async () => {
      const p = markSynced(makePilot())
      PilotStore().Pilots = [p]
      vi.mocked(getUserDataChanged).mockResolvedValue({ serverTime: 1000, items: [] })
      if (load === 'later') await store().setMetadataFromDynamo()
      vi.mocked(getUserDataChanged).mockResolvedValue({
        serverTime: 2000,
        items: [row(`savedata_pilot_${p.ID}`, { deleted: 1500 })],
      })

      await store().setMetadataFromDynamo()
      expect(toRaw(p).SaveController.DeleteTime).toBe(1500)
      expect(p.CloudController.Metadata.Deleted).toBe(1500)
      expect(NotificationStore().CloudNotifications[0].type).toBe('warning')
    })
  }

  it('shares one request between overlapping calls', async () => {
    vi.mocked(getUserDataChanged).mockResolvedValue({ serverTime: 1000, items: [] })
    await Promise.all([store().setMetadataFromDynamo(), store().setMetadataFromDynamo()])
    expect(getUserDataChanged).toHaveBeenCalledTimes(1)
  })

  it('resumes from the stored query time after a restart', async () => {
    vi.mocked(getUserDataChanged).mockResolvedValue({ serverTime: 1000, items: [] })
    await store().setMetadataFromDynamo()
    store().LastQuery = 0
    await store().setMetadataFromDynamo()
    expect(store().LastQuery).toBe(1000)
    expect(getUserDataChanged).toHaveBeenLastCalledWith('user-1', 1000)
  })
})

describe('permDeleteFlaggedItems', () => {
  it('purges flagged rows in batches of 25', async () => {
    store().CloudItems = [
      ...Array.from({ length: 30 }, (_, i) => row(`savedata_pilot_TEST${i}`, { deleted: 1 })),
      row('savedata_pilot_KEEP'),
    ] as any

    expect(await store().permDeleteFlaggedItems()).toBe(30)
    expect(bulkDelete).toHaveBeenCalledTimes(2)
    expect(store().CloudItems.map(x => x.sortkey)).toEqual(['savedata_pilot_KEEP'])
  })

  it('falls back to single deletes when a batch fails', async () => {
    vi.mocked(bulkDelete).mockRejectedValue(new Error('TEST'))
    store().CloudItems = [row('savedata_pilot_TEST1', { deleted: 1 })] as any
    await store().permDeleteFlaggedItems()
    expect(cloudDelete).toHaveBeenCalledTimes(1)
  })
})

describe('deleteAllCloudData', () => {
  it('deletes every row and forgets remote items', async () => {
    store().CloudItems = [row('savedata_pilot_TEST1')] as any
    store().CloudArchives = [row('archive_1')] as any
    UserMetadataStore().UserMetadata.RemoteItems = ['TEST1']

    await store().deleteAllCloudData()
    expect(vi.mocked(bulkDelete).mock.calls[0][1]).toHaveLength(2)
    expect(store().CloudItems).toEqual([])
    expect(UserMetadataStore().UserMetadata.RemoteItems).toEqual([])
    expect(UserMetadataStore().setUserMetadata).toHaveBeenCalled()
  })

  it('falls back to single deletes when a batch fails', async () => {
    vi.mocked(bulkDelete).mockRejectedValue(new Error('TEST'))
    store().CloudImages = [row('image_a.png'), row('image_b.png')] as any
    await store().deleteAllCloudData()
    expect(cloudDelete).toHaveBeenCalledTimes(2)
  })
})
