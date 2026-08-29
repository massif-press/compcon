import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./Storage', () => ({
  SetItem: vi.fn(),
  GetItem: vi.fn(async () => null),
  GetAll: vi.fn(async () => []),
  SetAll: vi.fn(),
  RemoveItem: vi.fn(),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

import { StageImport, ImportStagedData, ImportPilot } from './Importer'
import { PilotStore } from '@/features/pilot_management/store'
import { Pilot } from '@/classes/pilot/Pilot'
import { makePilot } from '@/__tests__/factories'

const pilotData = () => Pilot.Serialize(makePilot()) as any

beforeEach(() => {
  vi.clearAllMocks()
})

describe('StageImport routing', () => {
  it('rejects empty input', async () => {
    await expect(StageImport(null)).rejects.toThrow('No data provided')
  })

  it('stages a v3 pilot', async () => {
    const staged = await StageImport(pilotData())
    expect(staged).toHaveLength(1)
    expect(staged[0].collection).toBe('Pilot')
    expect(staged[0].status).toBe(true)
  })

  it('stages an npc by npcType', async () => {
    const staged = await StageImport({ npcType: 'unit', name: 'x' })
    expect(staged[0].collection).toBe('NPC')
    expect(staged[0].type).toBe('unit')
  })

  it('stages a narrative item by collectionItemType', async () => {
    const staged = await StageImport({ collectionItemType: 'character', name: 'x' })
    expect(staged[0].collection).toBe('Narrative Item')
  })

  it('stages an encounter and a campaign by itemType', async () => {
    expect((await StageImport({ itemType: 'Encounter' }))[0].collection).toBe('Encounter')
    expect((await StageImport({ itemType: 'campaign' }))[0].collection).toBe('Campaign')
  })

  it('unwraps a collection payload into one staged object per item', async () => {
    const staged = await StageImport({
      type: 'pilot collection',
      data: [{ itemType: 'pilot' }, { itemType: 'pilot' }],
    })
    expect(staged).toHaveLength(2)
  })

  it('ignores an unrecognized item', async () => {
    expect(await StageImport({ nothing: true })).toHaveLength(0)
  })

  it('marks an item that needs an uninstalled content pack', async () => {
    const staged = await StageImport({
      itemType: 'pilot',
      brews: [{ LcpId: 'not_installed', LcpName: 'Missing Pack' }],
    })
    expect(staged[0].status).toBe(false)
    expect(staged[0].missingPacks).toHaveLength(1)
  })
})

describe('ImportStagedData', () => {
  it('rejects empty input', async () => {
    await expect(ImportStagedData(null as never)).rejects.toThrow('No staged objects provided')
  })

  it('imports a staged pilot into the store', async () => {
    const staged = await StageImport(pilotData())
    const errors = await ImportStagedData(staged)

    expect(errors).toEqual([])
    expect(PilotStore().Pilots).toHaveLength(1)
  })

  it('reports, rather than throws, for an item missing its content packs', async () => {
    const staged = await StageImport({
      itemType: 'pilot',
      brews: [{ LcpId: 'not_installed', LcpName: 'Missing Pack' }],
    })
    const errors = await ImportStagedData(staged)

    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('missing required content packs')
    expect(PilotStore().Pilots).toHaveLength(0)
  })

  it('collects a per-item failure and keeps going', async () => {
    const good = (await StageImport(pilotData()))[0]
    const bad = (await StageImport({ npcType: 'unit' }))[0]
    bad.data = null

    const errors = await ImportStagedData([bad, good])

    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('failed to import')
    expect(PilotStore().Pilots).toHaveLength(1)
  })

  it('accepts a bare staged object instead of an array', async () => {
    const staged = (await StageImport(pilotData()))[0]
    expect(await ImportStagedData(staged as never)).toEqual([])
    expect(PilotStore().Pilots).toHaveLength(1)
  })
})

describe('ImportPilot', () => {
  it('claims ownership of the imported pilot', async () => {
    const data = pilotData()
    data.remoteCode = 'someone-elses-code'

    await ImportPilot(data, 'my-collection')

    const [imported] = PilotStore().Pilots
    expect(imported.SaveController.RemoteCode).toBe('')
    expect(imported.SaveController.RemoteAuthor).toBe('')
    expect(imported.SaveController.RemoteCollection).toBe('my-collection')
  })
})
