import { describe, it, expect, beforeEach } from 'vitest'
import { CloudController } from './CloudController'
import { AuthStore } from '@/user/store/AuthStore'
import { makePilot } from '@/__tests__/factories'
import type { Pilot } from '@/classes/pilot/Pilot'

let pilot: Pilot

const cloud = () => pilot.CloudController

beforeEach(() => {
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  pilot = makePilot()
  cloud().GenerateMetadata()
})

describe('CloudController.stringifySafe', () => {
  it('passes a string through', () => {
    expect(CloudController.stringifySafe('already a string')).toBe('already a string')
  })

  it('survives a circular reference', () => {
    const a: any = { name: 'a' }
    a.self = a
    expect(CloudController.stringifySafe(a)).toContain('[Circular]')
  })
})

describe('CloudController.computeContentHash', () => {
  it('is stable for equal content', () => {
    expect(CloudController.computeContentHash({ a: 1, b: 2 })).toBe(
      CloudController.computeContentHash({ a: 1, b: 2 })
    )
  })

  it('ignores key order', () => {
    expect(CloudController.computeContentHash({ a: 1, b: 2 })).toBe(
      CloudController.computeContentHash({ b: 2, a: 1 })
    )
  })

  it('changes when content changes', () => {
    expect(CloudController.computeContentHash({ a: 1 })).not.toBe(
      CloudController.computeContentHash({ a: 2 })
    )
  })

  it('ignores the sync bookkeeping fields', () => {
    expect(CloudController.computeContentHash({ a: 1, _ts: { x: 1 }, cloud: {}, save: {} })).toBe(
      CloudController.computeContentHash({ a: 1 })
    )
  })
})

describe('CloudController.GenerateSortKey', () => {
  it('joins data type, item type, and id', () => {
    expect(cloud().GenerateSortKey()).toBe(`${pilot.DataType}_${pilot.ItemType}_${pilot.ID}`)
  })
})

describe('CloudController.GenerateMetadata', () => {
  it('stamps the signed-in user onto the record', () => {
    expect(cloud().UserID).toBe('user-1')
    expect(cloud().Metadata.Uri).toBe(`user-1/${cloud().GenerateSortKey()}.json`)
  })

  it('leaves the share code empty until the item is published', () => {
    expect(cloud().ShareCode).toBe('')
  })
})

describe('CloudController.ensureOwnedUri', () => {
  it('rewrites a uri that belongs to another user', () => {
    cloud().Metadata.Uri = 'someone-else/pilot.json'
    cloud().Metadata.UserId = 'someone-else'

    cloud().ensureOwnedUri()

    expect(cloud().Metadata.Uri).toBe(`user-1/${cloud().GenerateSortKey()}.json`)
    expect(cloud().Metadata.UserId).toBe('user-1')
  })

  it('leaves a remote item alone', () => {
    pilot.SaveController.RemoteCode = 'shared-code'
    cloud().Metadata.Uri = 'someone-else/pilot.json'

    cloud().ensureOwnedUri()

    expect(cloud().Metadata.Uri).toBe('someone-else/pilot.json')
  })

  it('does nothing when nobody is signed in', () => {
    AuthStore().Cognito = {}
    cloud().Metadata.Uri = 'stale/pilot.json'

    cloud().ensureOwnedUri()

    expect(cloud().Metadata.Uri).toBe('stale/pilot.json')
  })
})

describe('CloudController.stampTombstone', () => {
  it('records a deletion timestamp for the field', () => {
    cloud().stampTombstone('mechs.abc')
    expect(cloud()._fieldTs['mechs.abc']).toBeGreaterThan(0)
  })
})

describe('CloudController.isSynced', () => {
  it('is false for an item that has never been uploaded', () => {
    expect(cloud().isSynced).toBe(false)
  })

  it('is true once the upload markers are current', () => {
    const now = Date.now()
    cloud().Metadata.Updated = now
    cloud().Metadata.ItemModified = now
    cloud()._lastSyncedUpdated = now
    cloud()._lastUploadedItemModified = now
    pilot.SaveController.LastModified = now

    expect(cloud().isSynced).toBe(true)
  })

  it('is false again after a local edit', () => {
    const now = Date.now()
    cloud().Metadata.Updated = now
    cloud().Metadata.ItemModified = now
    cloud()._lastSyncedUpdated = now
    cloud()._lastUploadedItemModified = now
    pilot.SaveController.LastModified = now + 1000

    expect(cloud().isSynced).toBe(false)
  })
})

describe('CloudController.serverVersionChanged', () => {
  it('is false for an item the server has never seen', () => {
    expect(cloud().serverVersionChanged).toBe(false)
  })

  it('is true when the server holds a newer item', () => {
    const now = Date.now()
    cloud().Metadata.Updated = now
    cloud()._lastSyncedUpdated = now
    cloud()._lastUploadedItemModified = now
    cloud().Metadata.ItemModified = now + 1000

    expect(cloud().serverVersionChanged).toBe(true)
  })

  it('is true when the item exists remotely but was never uploaded from here', () => {
    cloud().Metadata.Updated = Date.now()
    expect(cloud().serverVersionChanged).toBe(true)
  })
})

describe('CloudController.Serialize/Deserialize', () => {
  it('omits the cloud bookkeeping when there is nothing to record', () => {
    const target: any = {}
    CloudController.Serialize(pilot, target)
    expect(target.cloud).toEqual({})
  })

  it('round-trips the sync markers', () => {
    cloud()._fieldTs = { 'mechs.a': 123 }
    cloud()._lastContentHash = 'hash-1'
    cloud()._lastFieldHashes = { name: 'h' }
    cloud()._lastUploadedItemModified = 5
    cloud()._lastSyncedUpdated = 6

    const target: any = {}
    CloudController.Serialize(pilot, target)

    const other = makePilot()
    CloudController.Deserialize(other, target.cloud)

    expect(other.CloudController._fieldTs).toEqual({ 'mechs.a': 123 })
    expect(other.CloudController._lastContentHash).toBe('hash-1')
    expect(other.CloudController._lastFieldHashes).toEqual({ name: 'h' })
    expect(other.CloudController._lastUploadedItemModified).toBe(5)
    expect(other.CloudController._lastSyncedUpdated).toBe(6)
  })

  it('accepts a legacy _lastSnapshot of field hashes', () => {
    CloudController.Deserialize(pilot, { _lastSnapshot: { name: 'h1', callsign: 'h2' } })
    expect(cloud()._lastFieldHashes).toEqual({ name: 'h1', callsign: 'h2' })
  })

  it('ignores a _lastSnapshot that is not a hash map', () => {
    CloudController.Deserialize(pilot, { _lastSnapshot: { name: { nested: true } } })
    expect(cloud()._lastFieldHashes).toBeNull()
  })
})

describe('CloudController.ResetIdentity', () => {
  it('clears every sync marker', () => {
    cloud()._fieldTs = { a: 1 }
    cloud()._lastContentHash = 'hash'
    cloud()._lastFieldHashes = { a: 'h' }
    cloud()._lastSyncedUpdated = 5
    cloud()._lastUploadedItemModified = 5

    cloud().ResetIdentity()

    expect(cloud()._fieldTs).toEqual({})
    expect(cloud()._lastContentHash).toBeNull()
    expect(cloud()._lastFieldHashes).toBeNull()
    expect(cloud()._lastSyncedUpdated).toBe(0)
    expect(cloud()._lastUploadedItemModified).toBe(0)
  })
})
