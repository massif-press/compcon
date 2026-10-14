import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const server = vi.hoisted(() => ({
  files: {} as Record<string, any>,
  metas: {} as Record<string, any>,
  pending: {} as Record<string, any>,
  clock: 1000,
  uploads: 0,
}))

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetItem: vi.fn(async () => null),
  GetAll: vi.fn(async () => []),
  SetAll: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

vi.mock('@/io/apis/account', () => ({
  downloadFromS3: vi.fn(async (uri: string) => JSON.parse(JSON.stringify(server.files[uri]))),
  getUploadPresigns: vi.fn(async (uris: string[]) => Object.fromEntries(uris.map(u => [u, u]))),
  uploadToS3: vi.fn(async (data: any, uri: string) => {
    server.pending[uri] = JSON.parse(JSON.stringify(data))
    return true
  }),
  updateItem: vi.fn(async (meta: any) => {
    server.files[meta.uri] = server.pending[meta.uri]
    server.metas[meta.uri] = { ...meta, updated: ++server.clock }
    server.uploads++
    return { data: server.metas[meta.uri] }
  }),
  invalidateETagCache: vi.fn(),
  batchUpsert: vi.fn(),
  PresignExpiredError: class PresignExpiredError extends Error {},
}))

import { toRaw } from 'vue'
import { GetAll } from '@/io/Storage'
import { Pilot } from '@/classes/pilot/Pilot'
import type { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import PilotSheet from '@/features/pilot_management/store/PilotSheet'
import { AuthStore } from '@/user/store/AuthStore'
import { CompendiumStore } from '@/features/compendium/store'
import { makePilot, makeMech } from '@/__tests__/factories'
import { CloudSyncOrchestrator } from './CloudSyncOrchestrator'
import { DbItemMetadata } from './CloudTypes'
import { mergeFields, buildFieldHashMap, stampChangedFields } from './fieldMerge'
import { PilotStore, PilotGroupStore } from '@/features/pilot_management/store'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { Unit } from '@/classes/npc/unit/Unit'
import { NpcFeatureFactory } from '@/classes/npc/feature/NpcFeatureFactory'
import type { NpcFeature } from '@/classes/npc/feature/NpcFeature'

const FRAME = 'mf_standard_pattern_i_everest'
const RIFLE = 'mw_assault_rifle'
const BLADE = 'mw_charged_blade'

type Device = {
  pilot: Pilot
  sheet?: PilotSheet
  unit?: Unit
  groups: Record<string, PilotGroup>
  frameText: string
  weaponText: string
  sortIndex?: number
}
type Pick = (d: Device) => any

let active: Device
let npcFeature: any = null
let originalFrameText: string
let originalWeaponText: string

const frameData = () => (CompendiumStore().referenceByID('Frames', FRAME) as any).ItemData
const weaponData = () => (CompendiumStore().referenceByID('MechWeapons', RIFLE) as any).ItemData

function use(device: Device) {
  active = device
  frameData().description = device.frameText
  weaponData().effect = device.weaponText
  if (npcFeature) npcFeature.ItemData.effect = device.frameText
}

function tick() {
  vi.advanceTimersByTime(2000)
}

const uriOf = (item: any): string => item.CloudController.Metadata.Uri
const remoteOf = (item: any) => server.files[uriOf(item)]

async function sync(
  device: Device,
  pick: Pick = d => d.pilot
): Promise<{ state: string; uploads: number }> {
  use(device)
  tick()
  const before = server.uploads
  const uri = uriOf(pick(device))
  const cc = pick(device).CloudController
  cc.Metadata = { ...server.metas[uri] }
  if (cc.isSynced) return { state: 'synced', uploads: 0 }
  if (cc.serverVersionChanged) await cc.syncFromCloud()
  else await cc.UpdateCloud()
  pick(device).CloudController.Metadata = { ...server.metas[uri] }
  return {
    state: pick(device).CloudController.isSynced ? 'done' : 'stuck',
    uploads: server.uploads - before,
  }
}

async function download(device: Device, item: any) {
  use(device)
  tick()
  const meta = server.metas[uriOf(item)]
  await CloudSyncOrchestrator.ForceDownload({
    IsCloudOnly: true,
    raw: meta,
    Name: meta.name,
    ItemType: item.ItemType,
    CloudController: { Metadata: new DbItemMetadata(meta) },
  })
}

function newDevice(overrides: Partial<Device> = {}): Device {
  return {
    pilot: null as any,
    groups: {},
    frameText: originalFrameText,
    weaponText: originalWeaponText,
    ...overrides,
  }
}

function slot(pilot: Pilot) {
  const mounts = pilot.Mechs[0].MechLoadoutController.ActiveLoadout.EquippableMounts
  return mounts.find(x => x.Slots.length)!.Slots[0]
}

function equip(pilot: Pilot, id: string) {
  slot(pilot).EquipWeapon(CompendiumStore().instantiate('MechWeapons', id) as MechWeapon, false)
}

function pruneStamps(...devices: Device[]) {
  for (const d of devices) d.pilot.CloudController._fieldTs = {}
  for (const file of Object.values(server.files)) file._ts = {}
}

function edit(device: Device, name: string) {
  use(device)
  tick()
  device.pilot.Name = name
}

async function setup(b: Partial<Device> = {}, prepare: (seed: Pilot) => void = () => {}) {
  const seed = makePilot({ name: 'Test Pilot 1', callsign: 'TEST1' })
  makeMech(seed, FRAME)
  prepare(seed)
  const a = newDevice({ pilot: new Pilot(JSON.parse(JSON.stringify(Pilot.Serialize(seed)))) })
  use(a)
  a.pilot.SaveController.markModified()
  await a.pilot.CloudController.UpdateCloud()

  const dev = newDevice(b)
  await download(dev, a.pilot)
  return { a, b: dev }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-01T00:00:00Z'))
  AuthStore().Cognito = { userId: 'user-1', username: 'tester' }
  Object.assign(server, { files: {}, metas: {}, pending: {}, clock: 1000, uploads: 0 })
  originalFrameText = frameData().description
  originalWeaponText = weaponData().effect
  vi.spyOn(CloudSyncOrchestrator, 'AddByType').mockImplementation(async (_t, item) => {
    if (item instanceof PilotGroup) {
      active.groups[item.ID] = item
      return
    }
    if (item instanceof PilotSheet) {
      active.sheet = item
      return
    }
    if (item instanceof Unit) {
      active.unit = item
      return
    }
    active.pilot = item as Pilot
    if (active.sortIndex !== undefined) toRaw(item as Pilot).SortIndex = active.sortIndex
  })
})

afterEach(() => {
  frameData().description = originalFrameText
  weaponData().effect = originalWeaponText
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('two devices, same content', () => {
  it('pulls an edit without re-uploading', async () => {
    const { a, b } = await setup()
    edit(a, 'Test Pilot 1 edited')
    expect((await sync(a)).uploads).toBe(1)

    expect(await sync(b)).toEqual({ state: 'done', uploads: 0 })
    expect(b.pilot.Name).toBe('Test Pilot 1 edited')
    expect((await sync(a)).state).toBe('synced')
  })
})

describe('a merge the local side wins', () => {
  it('uploads the merge instead of sticking', async () => {
    const { b } = await setup()
    use(b)
    tick()
    b.pilot.Callsign = 'TEST2'
    await sync(b)

    const uri = uriOf(b.pilot)
    const stale = server.files[uri]
    server.files[uri] = { ...stale, callsign: 'TEST9', _ts: { ...stale._ts, callsign: 1 } }
    server.metas[uri] = { ...server.metas[uri], updated: ++server.clock }

    expect((await sync(b)).state).toBe('done')
    expect(remoteOf(b.pilot).callsign).toBe('TEST2')
  })
})

describe('concurrent edits on both devices', () => {
  it('keeps a mech added on the other device', async () => {
    const { a, b } = await setup()
    use(a)
    tick()
    makeMech(a.pilot, FRAME)
    await sync(a)
    edit(b, 'Test Pilot 1 edited')
    await sync(b)
    expect(b.pilot.Mechs).toHaveLength(2)
    expect(remoteOf(b.pilot).mechs).toHaveLength(2)
    expect(remoteOf(b.pilot).name).toBe('Test Pilot 1 edited')
  })

  it('settles after both add a mech', async () => {
    const { a, b } = await setup()
    use(a)
    tick()
    makeMech(a.pilot, FRAME)
    await sync(a)
    use(b)
    tick()
    makeMech(b.pilot, FRAME)
    await sync(b)

    expect(await sync(a)).toEqual({ state: 'done', uploads: 0 })
    expect((await sync(b)).state).toBe('synced')
    expect(a.pilot.Mechs.map(m => m.ID)).toEqual(b.pilot.Mechs.map(m => m.ID))
    expect(a.pilot.Mechs).toHaveLength(3)
  })

  it('merges edits to different fields after an old build pruned the stamps', async () => {
    const { a, b } = await setup()
    pruneStamps(a, b)
    use(a)
    tick()
    a.pilot.Callsign = 'TEST2'
    await sync(a)
    edit(b, 'Test Pilot 1 edited')
    await sync(b)

    expect(await sync(a)).toEqual({ state: 'done', uploads: 0 })
    expect((await sync(b)).state).toBe('synced')
    for (const d of [a, b]) {
      expect(d.pilot.Callsign).toBe('TEST2')
      expect(d.pilot.Name).toBe('Test Pilot 1 edited')
    }
  })
})

describe('a change saved without a modified stamp', () => {
  it('is kept and uploaded on the next pull', async () => {
    const { a, b } = await setup()
    ;(toRaw(b.pilot) as any)._callsign = 'TEST2'
    edit(a, 'Test Pilot 1 edited')
    await sync(a)

    expect((await sync(b)).uploads).toBe(1)
    expect(remoteOf(b.pilot).callsign).toBe('TEST2')
    expect(remoteOf(b.pilot).name).toBe('Test Pilot 1 edited')
  })
})

describe('a device left stuck by an old build', () => {
  it('takes the server copy without uploading', async () => {
    const { a, b } = await setup()
    use(a)
    tick()
    a.pilot.Callsign = 'TEST2'
    await sync(a)
    pruneStamps(a, b)

    tick()
    toRaw(b.pilot).SaveController.LastModified = Date.now()
    b.pilot.CloudController._lastUploadedItemModified = Date.now()

    expect(await sync(b)).toEqual({ state: 'done', uploads: 0 })
    expect(b.pilot.Callsign).toBe('TEST2')
    expect((await sync(a)).state).toBe('synced')
  })
})

describe('two devices, removing the last mech', () => {
  it('removes it on the other device', async () => {
    const { a, b } = await setup()
    use(a)
    tick()
    a.pilot.RemoveMech(a.pilot.Mechs[0])
    await sync(a)
    expect(await sync(b)).toEqual({ state: 'done', uploads: 0 })
    expect(b.pilot.Mechs).toHaveLength(0)
  })

  it('does not restore it to the server under content skew', async () => {
    const { a, b } = await setup({ frameText: 'TEST CONTENT v2' })
    use(a)
    tick()
    a.pilot.RemoveMech(a.pilot.Mechs[0])
    await sync(a)
    await sync(b)
    expect(remoteOf(b.pilot).mechs).toHaveLength(0)
  })
})

describe('stampChangedFields, emptied entity array', () => {
  it('tombstones the removed entity', () => {
    const hashes = buildFieldHashMap({ mechs: [{ id: 'm1', name: 'Test Mech' }] })
    const ts = stampChangedFields({ mechs: [] }, hashes, {}, 1)
    expect(ts['mechs.m1']).toBeGreaterThan(1)
  })
})

describe('stampChangedFields, undefined values', () => {
  it('does not stamp a field that was undefined at the last sync', () => {
    const current = { mechs: [{ id: 'm1', img: { avatar: undefined } }] }
    const hashes = buildFieldHashMap(JSON.parse(JSON.stringify(current)))
    expect(stampChangedFields(current, hashes, {}, 1)).toEqual({})
  })
})

describe('two devices, different content versions', () => {
  it('settles after an edit', async () => {
    const { a, b } = await setup({ frameText: 'TEST CONTENT v2' })
    edit(a, 'Test Pilot 1 edited')
    await sync(a)

    const rounds: string[] = []
    for (let i = 0; i < 4; i++) {
      const rb = await sync(b)
      const ra = await sync(a)
      rounds.push(`b:${rb.state}/${rb.uploads} a:${ra.state}/${ra.uploads}`)
    }
    expect(rounds).toEqual(['b:done/0 a:synced/0', ...Array(3).fill('b:synced/0 a:synced/0')])
  })

  it('keeps the edit on both devices', async () => {
    const { a, b } = await setup({ frameText: 'TEST CONTENT v2' })
    edit(a, 'Test Pilot 1 edited')
    await sync(a)
    await sync(b)
    expect(b.pilot.Name).toBe('Test Pilot 1 edited')
  })

  it('settles when a field outside the derived keys differs per device', async () => {
    const serialize = Pilot.Serialize
    vi.spyOn(Pilot, 'Serialize').mockImplementation((p, asInstance) => ({
      ...serialize.call(Pilot, p, asInstance),
      text_appearance: active.frameText,
    }))
    const { a, b } = await setup({ frameText: 'TEST CONTENT v2' })
    const stamp = remoteOf(a.pilot)._ts.text_appearance

    const rounds: string[] = []
    for (const device of [a, b]) {
      edit(device, `Test Pilot 1 edited on ${device === a ? 'a' : 'b'}`)
      await sync(device)
      const other = device === a ? b : a
      const first = await sync(other)
      const second = await sync(device)
      rounds.push(`${first.state}/${first.uploads} ${second.state}/${second.uploads}`)
    }
    expect(rounds).toEqual(['done/0 synced/0', 'done/0 synced/0'])
    expect(a.pilot.Name).toBe(b.pilot.Name)
    expect(remoteOf(a.pilot)._ts.text_appearance).toBe(stamp)
  })

  it('takes a weapon swap when its hashes came from an old build', async () => {
    const { a, b } = await setup({}, seed => equip(seed, RIFLE))
    const hashes = b.pilot.CloudController._lastFieldHashes!
    delete hashes.__v
    for (const key of Object.keys(hashes)) if (key.endsWith('.mounts')) hashes[key] = 'TEST1'

    use(a)
    tick()
    equip(a.pilot, BLADE)
    a.pilot.SaveController.save()
    await sync(a)

    expect(await sync(b)).toEqual({ state: 'done', uploads: 0 })
    expect(slot(b.pilot).Weapon?.ID).toBe(BLADE)
  })

  it('keeps a weapon swap from the other device after a local content update', async () => {
    const { a, b } = await setup({}, seed => equip(seed, RIFLE))
    b.weaponText = 'TEST CONTENT v2'
    use(b)
    b.pilot = Pilot.Deserialize(JSON.parse(JSON.stringify(Pilot.Serialize(toRaw(b.pilot)))))

    use(a)
    tick()
    equip(a.pilot, BLADE)
    a.pilot.SaveController.save()
    await sync(a)
    edit(b, 'Test Pilot 1 edited')
    await sync(b)

    expect(slot(b.pilot).Weapon?.ID).toBe(BLADE)
    expect(b.pilot.Name).toBe('Test Pilot 1 edited')
    expect((await sync(a)).uploads).toBe(0)
    expect(slot(a.pilot).Weapon?.ID).toBe(BLADE)
  })
})

describe('two devices, a pilot sheet under different content versions', () => {
  it('settles without uploading when both hold the same version', async () => {
    const seed = makePilot({ name: 'Test Pilot 1' })
    makeMech(seed, FRAME)
    const a = newDevice()
    use(a)
    a.sheet = PilotSheet.FromPilot(seed)
    a.sheet.SaveController.markModified()
    await a.sheet.CloudController.UpdateCloud()

    const b = newDevice({ frameText: 'TEST CONTENT v2' })
    await download(b, a.sheet)
    use(a)
    await a.sheet.CloudController.UpdateCloud('item', true)

    const rounds: string[] = []
    for (let i = 0; i < 3; i++) {
      const rb = await sync(b, d => d.sheet)
      const ra = await sync(a, d => d.sheet)
      rounds.push(`b:${rb.state}/${rb.uploads} a:${ra.state}/${ra.uploads}`)
    }
    expect(rounds).toEqual(['b:done/0 a:synced/0', ...Array(2).fill('b:synced/0 a:synced/0')])
  })
})

describe('two devices, an NPC under different content versions', () => {
  const build = () =>
    NpcFeatureFactory.Build<NpcFeature>({
      id: 'npcf_test1',
      name: 'Test Feature 1',
      type: 'Trait',
      effect: active.frameText,
    } as any)
  let pack: any

  beforeEach(() => {
    active = newDevice()
    npcFeature = build()
    pack = { Active: true, NpcFeatures: [npcFeature] }
    ;(CompendiumStore() as any)._packs.push(pack)
  })

  afterEach(() => {
    const packs = (CompendiumStore() as any)._packs
    packs.splice(packs.indexOf(pack), 1)
    npcFeature = null
  })

  const pick: Pick = d => d.unit

  async function setupUnits() {
    const a = newDevice()
    use(a)
    a.unit = new Unit()
    a.unit.NpcFeatureController.AddFeature(build())
    a.unit.SaveController.markModified()
    await a.unit.CloudController.UpdateCloud()
    const b = newDevice({ frameText: 'TEST CONTENT v2' })
    await download(b, a.unit)
    return { a, b }
  }

  it('keeps panel state per device without uploading it', async () => {
    const { a, b } = await setupUnits()
    toRaw(b.unit!).UIState = { npcf_test1: true }
    use(a)
    tick()
    toRaw(a.unit!).UIState = { npcf_test1: false }
    a.unit!.Name = 'Test NPC 1 edited'
    await sync(a, pick)

    expect(await sync(b, pick)).toEqual({ state: 'done', uploads: 0 })
    expect(b.unit!.Name).toBe('Test NPC 1 edited')
    expect(b.unit!.UIState).toEqual({ npcf_test1: true })
  })

  it('settles after edits on either device', async () => {
    const { a, b } = await setupUnits()

    const rounds: string[] = []
    for (const device of [a, b]) {
      use(device)
      tick()
      device.unit!.Name = `Test NPC 1 edited on ${device === a ? 'a' : 'b'}`
      await sync(device, pick)
      const other = device === a ? b : a
      const first = await sync(other, pick)
      const second = await sync(device, pick)
      rounds.push(`${first.state}/${first.uploads} ${second.state}/${second.uploads}`)
    }
    expect(rounds).toEqual(['done/0 synced/0', 'done/0 synced/0'])
    expect(a.unit!.Name).toBe(b.unit!.Name)
    expect(remoteOf(a.unit).features[0].data.effect).toBe('TEST CONTENT v2')
    use(a)
    expect(toRaw(a.unit!).Serialize().features[0].data.effect).toBe(originalFrameText)
  })
})

describe('a forced upload', () => {
  async function force(device: Device) {
    use(device)
    tick()
    await CloudSyncOrchestrator.ForceUpload(device.pilot, true)
  }

  it('replaces stale state on the other device', async () => {
    const { a, b } = await setup()
    const mech = b.pilot.Mechs[0].ID
    b.pilot.CloudController._fieldTs = {
      ...b.pilot.CloudController._fieldTs,
      callsign: Date.now() + 5000,
      [`mechs.${mech}.img.avatar`]: Date.now() + 5000,
    }
    use(a)
    tick()
    a.pilot.Callsign = 'TEST2'
    a.pilot.RemoveMech(a.pilot.Mechs[0])
    await sync(a)
    vi.advanceTimersByTime(10000)
    await force(a)

    expect(await sync(b)).toEqual({ state: 'done', uploads: 0 })
    expect(b.pilot.Callsign).toBe('TEST2')
    expect(b.pilot.Mechs).toHaveLength(0)
    expect((await sync(a)).state).toBe('synced')
  })

  it('keeps an edit made after it', async () => {
    const { a, b } = await setup()
    await force(a)
    edit(b, 'Test Pilot 1 edited')

    expect((await sync(b)).uploads).toBe(1)
    expect(remoteOf(b.pilot).name).toBe('Test Pilot 1 edited')
  })

  it('drops an edit made before it', async () => {
    const { a, b } = await setup()
    edit(b, 'Test Pilot 1 edited')
    makeMech(b.pilot, FRAME)
    await force(a)

    expect(await sync(b)).toEqual({ state: 'done', uploads: 0 })
    expect(b.pilot.Name).toBe('Test Pilot 1')
    expect(b.pilot.Mechs).toHaveLength(1)
  })
})

describe('two devices, different group order', () => {
  it('settles after an edit', async () => {
    const { a, b } = await setup({ sortIndex: 5 })
    b.pilot.SortIndex = 5
    const rounds: string[] = []
    for (let i = 0; i < 3; i++) {
      edit(a, `Test Pilot 1 edit ${i}`)
      const ra = await sync(a)
      const rb = await sync(b)
      const ra2 = await sync(a)
      rounds.push(`a:${ra.uploads} b:${rb.state}/${rb.uploads} a:${ra2.state}/${ra2.uploads}`)
    }
    expect(rounds).toEqual(Array(3).fill('a:1 b:done/0 a:synced/0'))
  })
})

describe('entity order', () => {
  const ids = (x: any) => x.pilots.map((p: any) => p.id)

  it('stamps a reorder', () => {
    const hashes = buildFieldHashMap({ pilots: [{ id: 'p1' }, { id: 'p2' }] })
    const ts = stampChangedFields({ pilots: [{ id: 'p2' }, { id: 'p1' }] }, hashes, {}, 1)
    expect(ts['pilots.__order']).toBeGreaterThan(1)
  })

  it('does not stamp an append', () => {
    const hashes = buildFieldHashMap({ pilots: [{ id: 'p1' }] })
    const ts = stampChangedFields({ pilots: [{ id: 'p1' }, { id: 'p2' }] }, hashes, {}, 1)
    expect(ts['pilots.__order']).toBeUndefined()
  })

  it('takes the order stamped more recently', () => {
    const local = {
      pilots: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }],
      _ts: { 'pilots.__order': 1 },
    }
    const remote = { pilots: [{ id: 'p2' }, { id: 'p1' }], _ts: { 'pilots.__order': 5 } }
    expect(ids(mergeFields(local, remote))).toEqual(['p2', 'p1', 'p3'])
  })

  it('keeps the local order when it is newer', () => {
    const local = { pilots: [{ id: 'p1' }, { id: 'p2' }], _ts: { 'pilots.__order': 5 } }
    const remote = { pilots: [{ id: 'p2' }, { id: 'p1' }], _ts: { 'pilots.__order': 1 } }
    expect(ids(mergeFields(local, remote))).toEqual(['p1', 'p2'])
  })

  it('takes the remote order when neither side stamped one', () => {
    const local = { pilots: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }] }
    const remote = { pilots: [{ id: 'p2' }, { id: 'p1' }] }
    expect(ids(mergeFields(local, remote))).toEqual(['p2', 'p1', 'p3'])
  })
})

describe('mergeFields, unstamped fields', () => {
  it('takes the remote scalar when neither side is stamped', () => {
    const local = { callsign: 'TEST1', save: { lastModified: 300 } }
    const remote = { callsign: 'TEST2', save: { lastModified: 200 } }
    expect(mergeFields(local, remote).callsign).toBe('TEST2')
  })

  it('keeps a stamped local edit over an unstamped remote value', () => {
    const local = { callsign: 'TEST2', _ts: { callsign: 100 }, save: { lastModified: 100 } }
    const remote = { callsign: 'TEST1', save: { lastModified: 200 } }
    expect(mergeFields(local, remote).callsign).toBe('TEST2')
  })

  it('takes a stamped remote edit over an unstamped local value', () => {
    const local = { callsign: 'TEST1', save: { lastModified: 200 } }
    const remote = { callsign: 'TEST2', _ts: { callsign: 100 }, save: { lastModified: 100 } }
    expect(mergeFields(local, remote).callsign).toBe('TEST2')
  })

  it('drops no entity without a tombstone', () => {
    const local = { talents: [{ id: 't_old', rank: 1 }], save: { lastModified: 300 } }
    const remote = { talents: [{ id: 't_new', rank: 1 }], save: { lastModified: 200 } }
    expect(mergeFields(local, remote).talents.map((t: any) => t.id)).toEqual(['t_new', 't_old'])
  })
})

describe('derived keys', () => {
  const pilot = (text: string) => ({
    itemType: 'pilot',
    mechs: [
      {
        id: 'm1',
        name: 'Test Mech',
        mounts: [{ slots: [{ weapon: { id: 'TEST1', data: { effect: text } } }] }],
      },
    ],
  })

  it('does not stamp an array without ids when only derived data changed', () => {
    const hashes = buildFieldHashMap(pilot('TEST CONTENT v1'))
    expect(stampChangedFields(pilot('TEST CONTENT v2'), hashes, {}, 1)).toEqual({})
  })

  it('does not stamp an array hashed by an old build', () => {
    const hashes = buildFieldHashMap({ ...pilot('TEST CONTENT v1'), itemType: 'TEST1' })
    const ts = stampChangedFields(pilot('TEST CONTENT v1'), hashes, {}, 1)
    expect(ts['mechs.m1.mounts']).toBeUndefined()
  })

  it('ignores stamps under derived keys when weighing a tombstone', () => {
    const local = { ...pilot('TEST CONTENT v1'), _ts: { 'mechs.m1.frameData.description': 900 } }
    const remote = { itemType: 'pilot', mechs: [], _ts: { 'mechs.m1': 800 } }
    expect(mergeFields(local, remote).mechs).toHaveLength(0)
  })
})

describe('two devices, edit older than 30 days', () => {
  it('keeps the edit on a device that was idle', async () => {
    const { a, b } = await setup()
    use(a)
    tick()
    a.pilot.Callsign = 'TEST2'
    await sync(a)

    vi.setSystemTime(Date.now() + 31 * 24 * 60 * 60 * 1000)
    edit(a, 'Test Pilot 1 edited')
    await sync(a)
    edit(a, 'Test Pilot 1 edited again')
    await sync(a)

    await sync(b)
    expect(b.pilot.Name).toBe('Test Pilot 1 edited again')
    expect(b.pilot.Callsign).toBe('TEST2')
  })
})

describe('pilot groups', () => {
  function group(id: string, pilots: string[]) {
    const g = new PilotGroup({
      id,
      name: id,
      pilots: pilots.map(p => ({ id: p, index: -1 })),
    } as any)
    g.SaveController.LastModified = 1
    return g
  }

  it('marks the destination group modified on transfer', async () => {
    const pilot = makePilot()
    PilotGroupStore().PilotGroups = [group('g1', [pilot.ID]), group('g2', [])]
    tick()
    await PilotGroupStore().TransferPilot(pilot, 'g2')
    const [g1, g2] = PilotGroupStore().PilotGroups
    expect(g1.SaveController.LastModified).toBeGreaterThan(1)
    expect(g2.SaveController.LastModified).toBeGreaterThan(1)
  })

  it('marks a group modified when its pilots are reordered', async () => {
    PilotGroupStore().PilotGroups = [group('g1', ['p1', 'p2'])]
    tick()
    const g = PilotGroupStore().PilotGroups[0]
    PilotStore().movePilotIndex(g as PilotGroup, 0, 1)
    await PilotGroupStore().SaveGroupData()
    expect(g.SaveController.LastModified).toBeGreaterThan(1)
  })

  it('marks groups synced by an old build modified on load', async () => {
    const data = (id: string, hashes: Record<string, string>) => ({
      ...group(id, []).Serialize(),
      cloud: { _lastHashes: hashes },
    })
    vi.mocked(GetAll).mockResolvedValueOnce([
      data('g1', { name: 'TEST1' }),
      data('g2', { name: 'TEST1', __v: '1' }),
    ])
    tick()
    await PilotGroupStore().LoadGroups()
    const modified = (id: string) => PilotGroupStore().getGroupByID(id).SaveController.LastModified
    expect(modified('g1')).toBeGreaterThan(1)
    expect(modified('g2')).toBe(1)
  })

  it('marks groups modified when groups are reordered', async () => {
    PilotGroupStore().PilotGroups = [group('g1', []), group('g2', [])]
    await PilotGroupStore().SaveGroupData()
    tick()
    PilotGroupStore().ReorderGroup(PilotGroupStore().PilotGroups[1] as PilotGroup, 'top')
    expect(PilotGroupStore().PilotGroups.map(g => g.SaveController.LastModified)).not.toEqual([
      1, 1,
    ])
  })
})

describe('two devices, pilot groups', () => {
  const ids = (g: PilotGroup) => g.Pilots.map(p => p.id)

  async function setupGroups(groups: Record<string, string[]>) {
    const a = newDevice()
    use(a)
    for (const [id, pilots] of Object.entries(groups)) {
      const g = new PilotGroup({
        id,
        name: id,
        sortIndex: Object.keys(a.groups).length,
        pilots: pilots.map(p => ({ id: p, index: -1 })),
      } as any)
      g.SaveController.markModified()
      await g.CloudController.UpdateCloud()
      a.groups[id] = g
    }
    const b = newDevice()
    for (const g of Object.values(a.groups)) await download(b, g)
    return { a, b }
  }

  it('carries a pilot reorder to the other device', async () => {
    const { a, b } = await setupGroups({ g1: ['p1', 'p2', 'p3'] })
    use(a)
    tick()
    PilotStore().movePilotIndex(a.groups.g1, 0, 2)
    await sync(a, d => d.groups.g1)

    expect(await sync(b, d => d.groups.g1)).toEqual({ state: 'done', uploads: 0 })
    expect(ids(b.groups.g1)).toEqual(['p2', 'p3', 'p1'])
    expect((await sync(a, d => d.groups.g1)).state).toBe('synced')
  })

  it('settles when the devices hold a different pilot order', async () => {
    const { a, b } = await setupGroups({ g1: ['p1', 'p2', 'p3'] })
    ;(toRaw(b.groups.g1) as any)._pilots.reverse()
    for (const d of [a, b]) {
      const hashes = d.groups.g1.CloudController._lastFieldHashes!
      delete hashes['pilots.__order']
      delete hashes.__v
    }

    use(a)
    tick()
    a.groups.g1.Name = 'Test Group 1'
    await sync(a, d => d.groups.g1)

    expect(await sync(b, d => d.groups.g1)).toEqual({ state: 'done', uploads: 0 })
    expect(ids(b.groups.g1)).toEqual(['p1', 'p2', 'p3'])
    expect((await sync(a, d => d.groups.g1)).state).toBe('synced')
  })

  it('does not upload after pulling a group last written by an old build', async () => {
    const { b } = await setupGroups({ g1: ['p1'] })
    const uri = uriOf(b.groups.g1)
    const { itemType: _itemType, ...old } = server.files[uri]
    server.files[uri] = { ...old, name: 'Test Group 1', expanded: true }
    server.metas[uri] = { ...server.metas[uri], updated: ++server.clock }

    expect(await sync(b, d => d.groups.g1)).toEqual({ state: 'done', uploads: 0 })
    expect(b.groups.g1.Name).toBe('Test Group 1')
  })

  it('carries a transfer to the other device', async () => {
    const pilot = makePilot()
    const { a, b } = await setupGroups({ g1: [pilot.ID, 'p2'], g2: [] })
    use(a)
    tick()
    PilotGroupStore().PilotGroups = [a.groups.g1, a.groups.g2]
    await PilotGroupStore().TransferPilot(pilot, 'g2')
    await sync(a, d => d.groups.g1)
    await sync(a, d => d.groups.g2)

    await sync(b, d => d.groups.g1)
    await sync(b, d => d.groups.g2)
    expect(ids(b.groups.g1)).toEqual(['p2'])
    expect(ids(b.groups.g2)).toEqual([pilot.ID])
  })

  it('keeps the expanded state per device', async () => {
    const { a, b } = await setupGroups({ g1: [] })
    use(a)
    tick()
    a.groups.g1.Expanded = true
    expect((await sync(a, d => d.groups.g1)).state).toBe('synced')

    a.groups.g1.Name = 'Test Group 1'
    await sync(a, d => d.groups.g1)
    expect(await sync(b, d => d.groups.g1)).toEqual({ state: 'done', uploads: 0 })
    expect(b.groups.g1.Name).toBe('Test Group 1')
    expect(b.groups.g1.Expanded).toBe(false)
  })

  it('carries a group reorder to the other device', async () => {
    const { a, b } = await setupGroups({ g1: [], g2: [] })
    use(a)
    tick()
    PilotGroupStore().PilotGroups = [a.groups.g1, a.groups.g2]
    PilotGroupStore().ReorderGroup(a.groups.g2, 'top')
    await sync(a, d => d.groups.g1)
    await sync(a, d => d.groups.g2)

    await sync(b, d => d.groups.g1)
    await sync(b, d => d.groups.g2)
    expect(b.groups.g2.SortIndex).toBeLessThan(b.groups.g1.SortIndex)
  })
})
