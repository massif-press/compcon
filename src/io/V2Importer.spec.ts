import { describe, it, expect, beforeEach, vi } from 'vitest'

const { storage } = vi.hoisted(() => ({ storage: { v2_backup: [] as any[] } }))

vi.mock('./Storage', () => ({
  GetAll: vi.fn(async (collection: string) =>
    collection === 'v2_backup' ? storage.v2_backup : []
  ),
  SetItem: vi.fn(async (collection: string, item: any) => {
    if (collection === 'v2_backup') storage.v2_backup.push(item)
  }),
  RemoveItem: vi.fn(async (collection: string, id: string) => {
    if (collection === 'v2_backup') storage.v2_backup = storage.v2_backup.filter(r => r.id !== id)
  }),
  SetAll: vi.fn(),
  GetItem: vi.fn(async () => null),
  ClearAll: vi.fn(),
  GetLength: vi.fn(async () => 0),
  GetKeys: vi.fn(async () => []),
  SetValue: vi.fn(),
  GetValue: vi.fn(async () => null),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

import {
  isV2Pilot,
  isV2Npc,
  isV2Encounter,
  getV2PilotMissingLcps,
  getV2NpcMissingLcps,
  getV2EncounterMissingNpcs,
  transformV2Pilot,
  transformV2Npc,
  transformV2Encounter,
  saveV2Backup,
  getV2Backups,
  deleteV2Backup,
  forceImportV2Pilot,
  forceImportV2Npc,
  reprocessV2Backups,
  preprocessPilotImport,
  preprocessNpcImport,
} from './V2Importer'
import { PilotStore, NpcStore, CompendiumStore } from '@/stores'
import { ContentPackStore } from '@/features/compendium/store'

const v2Pilot = (overrides: Record<string, unknown> = {}) => ({
  id: 'v2-pilot-1',
  callsign: 'HAMMER',
  name: 'Nelson',
  level: 3,
  mechs: [],
  ...overrides,
})

const v2Npc = (overrides: Record<string, unknown> = {}) => ({
  id: 'v2-npc-1',
  name: 'Pursuer',
  cc_ver: '2.4.0',
  class: 'npcc_pursuer',
  tier: 1,
  items: [],
  ...overrides,
})

const v2Encounter = (overrides: Record<string, unknown> = {}) => ({
  id: 'v2-enc-1',
  name: 'Ambush',
  npcs: [],
  ...overrides,
})

const installedPack = (id: string) =>
  ({ ID: id, Name: id, Active: true, Data: {}, Serialize: () => ({ id }) }) as any

beforeEach(() => {
  storage.v2_backup = []
})

describe('isV2Pilot', () => {
  it('accepts a v2 pilot export', () => {
    expect(isV2Pilot(v2Pilot())).toBe(true)
  })

  it('rejects a v3 pilot', () => {
    expect(isV2Pilot({ itemType: 'pilot', callsign: 'HAMMER' })).toBe(false)
  })

  it('rejects anything without a callsign', () => {
    expect(isV2Pilot({ name: 'Nelson' })).toBe(false)
    expect(isV2Pilot(null)).toBe(false)
    expect(isV2Pilot([v2Pilot()])).toBe(false)
    expect(isV2Pilot('a string')).toBe(false)
  })
})

describe('isV2Npc', () => {
  it('accepts a v2 npc by cc_ver', () => {
    expect(isV2Npc(v2Npc())).toBe(true)
  })

  it('accepts a v2 npc by class plus items', () => {
    expect(isV2Npc({ class: 'npcc_pursuer', items: [] })).toBe(true)
  })

  it('rejects a v3 npc', () => {
    expect(isV2Npc({ npcType: 'unit', cc_ver: '2.4.0' })).toBe(false)
  })

  it('rejects unrelated data', () => {
    expect(isV2Npc({ name: 'x' })).toBe(false)
    expect(isV2Npc([])).toBe(false)
  })
})

describe('isV2Encounter', () => {
  it('accepts a single v2 encounter', () => {
    expect(isV2Encounter(v2Encounter())).toBe(true)
  })

  it('accepts an array of v2 encounters', () => {
    expect(isV2Encounter([v2Encounter({ npcs: [{ id: 'a' }] })])).toBe(true)
  })

  it('rejects a v3 encounter', () => {
    expect(isV2Encounter({ itemType: 'Encounter', npcs: [] })).toBe(false)
  })

  it('rejects an array of v3 encounters', () => {
    expect(isV2Encounter([{ itemType: 'Encounter', npcs: [] }])).toBe(false)
    expect(isV2Encounter([])).toBe(false)
  })

  it('rejects a payload whose npcs are already v3 shaped', () => {
    expect(isV2Encounter({ npcs: [{ npcType: 'unit' }] })).toBe(false)
  })
})

describe('missing content analysis', () => {
  it('lists the packs a pilot needs and does not have', () => {
    ContentPackStore().ContentPacks = [installedPack('installed')]

    const { missingIds, missingNames } = getV2PilotMissingLcps(
      v2Pilot({
        brews: [
          { LcpId: 'installed', LcpName: 'Installed' },
          { LcpId: 'absent', LcpName: 'Absent Pack' },
        ],
      }) as never
    )

    expect(missingIds).toEqual(['absent'])
    expect(missingNames).toEqual(['Absent Pack'])
  })

  it('falls back to the id when a pack name is missing', () => {
    const { missingNames } = getV2PilotMissingLcps(
      v2Pilot({ brews: [{ LcpId: 'absent' }] }) as never
    )
    expect(missingNames).toEqual(['absent'])
  })

  it('reports npc features that no installed pack provides', () => {
    const { unresolvableFeatures } = getV2NpcMissingLcps(
      v2Npc({ items: [{ itemID: 'npcf_nope' }, { itemID: 'npcf_nope' }] }) as never
    )
    expect(unresolvableFeatures).toEqual(['npcf_nope'])
  })

  it('reports encounter npcs that are not in the roster', () => {
    expect(
      getV2EncounterMissingNpcs(
        v2Encounter({ npcs: [{ id: 'gone' }], reinforcements: [{ id: 'gone' }] }) as never
      )
    ).toEqual(['gone'])
  })
})

describe('transformV2Pilot', () => {
  it('stamps the v3 item shape onto the pilot', () => {
    const out = transformV2Pilot(v2Pilot() as never) as any

    expect(out.itemType).toBe('pilot')
    expect(out.is_instance).toBe(false)
    expect(out.originId).toBe('v2-pilot-1')
    expect(out.cloud).toEqual({})
  })

  it('normalizes string core bonuses into objects', () => {
    const out = transformV2Pilot(
      v2Pilot({ core_bonuses: ['cb_a', { id: 'cb_b' }] }) as never
    ) as any
    expect(out.core_bonuses).toEqual([{ id: 'cb_a' }, { id: 'cb_b' }])
  })

  it('moves the portrait fields under img', () => {
    const out = transformV2Pilot(
      v2Pilot({ portrait: 'p.png', cloud_portrait: 'c.png' }) as never
    ) as any
    expect(out.img).toEqual({ portrait: 'p.png', cloud_portrait: 'c.png' })
  })

  it('keeps the original modified time so a second migration loses the sync merge', () => {
    const out = transformV2Pilot(v2Pilot({ lastModified: 1700000000000 }) as never) as any
    expect((out.save as any).lastModified).toBe(1700000000000)
    expect((out.save as any).created).toBe(1700000000000)
  })

  it('falls back to now for an unparseable timestamp', () => {
    const out = transformV2Pilot(v2Pilot({ lastModified: 'not a date' }) as never) as any
    expect((out.save as any).lastModified).toBeGreaterThan(0)
  })

  it('defaults the bond block', () => {
    const out = transformV2Pilot(v2Pilot() as never) as any
    expect(out.bond).toMatchObject({ bondId: '', xp: 0, maxStress: 8, bondAnswers: ['', ''] })
  })

  it('drops loadout entries the compendium cannot resolve', () => {
    const realWeapon = CompendiumStore().MechWeapons.find(w => !w.IsHidden)!.ID
    const out = transformV2Pilot(
      v2Pilot({
        mechs: [
          {
            id: 'm1',
            loadouts: [
              {
                systems: [{ id: 'ms_not_installed' }],
                mounts: [
                  {
                    slots: [
                      { weapon: { id: realWeapon } },
                      { weapon: { id: 'mw_not_installed' } },
                      { weapon: null },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }) as never
    ) as any

    const loadout = (out.mechs as any[])[0].loadouts[0]
    expect(loadout.systems).toEqual([])
    expect(loadout.mounts[0].slots[0].weapon).toEqual({ id: realWeapon })
    expect(loadout.mounts[0].slots[1].weapon).toBeNull()
    expect(loadout.mounts[0].slots[2].weapon).toBeNull()
  })
})

describe('transformV2Npc', () => {
  it('stamps the v3 npc shape', () => {
    const out = transformV2Npc(v2Npc() as never) as any

    expect(out.npcType).toBe('unit')
    expect(out.instance).toBe(false)
    expect(out.narrative.textItems).toEqual([])
    expect(out.folder).toEqual({ folder: '' })
  })

  it('converts items into features, carrying the destroyed flag', () => {
    const out = transformV2Npc(
      v2Npc({ items: [{ itemID: 'npcf_a', destroyed: true }, { itemID: 'npcf_b' }] }) as never
    ) as any

    expect(out.features).toEqual([
      { id: 'npcf_a', data: { isUsed: true } },
      { id: 'npcf_b', data: { isUsed: false } },
    ])
  })

  it('marks brews the compendium is missing', () => {
    ContentPackStore().ContentPacks = [installedPack('installed')]

    const out = transformV2Npc(
      v2Npc({ brews: [{ LcpId: 'installed' }, { LcpId: 'absent' }] }) as never
    ) as any

    expect((out.brews as any[]).map(b => b.Status)).toEqual(['OK', 'MISSING'])
  })

  it('strips the v2-only bookkeeping fields', () => {
    const out = transformV2Npc(
      v2Npc({ active: true, isDeleted: false, group: 'Squad', labels: ['a'] }) as never
    ) as any

    for (const key of ['cc_ver', 'active', 'isDeleted', 'items', 'group', 'labels', 'portrait']) {
      expect(out).not.toHaveProperty(key)
    }
    expect(out.folder).toEqual({ folder: 'Squad' })
    expect(out.narrative.labels).toEqual(['a'])
  })

  it('rebuilds a custom-tier stat block and resets the tier', () => {
    const out = transformV2Npc(
      v2Npc({
        tier: 'custom',
        stats: { hp: [12], evade: 8, sensor: 10, agility: 2, save: 11, sizes: [1] },
      }) as never
    ) as any

    expect(out.tier).toBe(1)
    expect(out.combat_data.stats.max).toMatchObject({
      hp: 12,
      evasion: 8,
      sensorRange: 10,
      agi: 2,
      saveTarget: 11,
      sizes: [1],
    })
    expect(out.combat_data.stats.current.hp).toBe(12)
  })

  it('leaves combat data empty for a standard tier', () => {
    expect((transformV2Npc(v2Npc({ tier: 2 }) as never) as any).combat_data).toEqual({})
  })
})

describe('transformV2Encounter', () => {
  it('maps the encounter shell onto v3 fields', () => {
    const [out] = transformV2Encounter(
      v2Encounter({
        gmNotes: 'gm only',
        narrativeNotes: 'read aloud',
        campaign: 'Op Solstice',
        environment: 'Deep Space',
        environmentDetails: 'no gravity',
      }) as never
    ) as any[]

    expect(out.itemType).toBe('Encounter')
    expect(out.name).toBe('Ambush')
    expect(out.note).toBe('gm only')
    expect(out.folder).toEqual({ folder: 'Op Solstice' })
    expect(out.environment).toEqual({
      name: 'Deep Space',
      modified: false,
      description: 'no gravity',
    })
    expect(out.narrative.textItems[0].body).toBe('read aloud')
  })

  it('skips npcs that are not in the roster', () => {
    const [out] = transformV2Encounter(
      v2Encounter({ npcs: [{ id: 'gone' }], reinforcements: [{ id: 'also-gone' }] }) as never
    ) as any[]

    expect(out.combatants).toEqual([])
  })

  it('accepts a list of encounters', () => {
    const out = transformV2Encounter([v2Encounter(), v2Encounter({ id: 'v2-enc-2' })] as never)
    expect(out).toHaveLength(2)
  })

  it('mints an id for an encounter that has none', () => {
    const [out] = transformV2Encounter({ name: 'Nameless', npcs: [] } as never) as any[]
    expect(out.id).toBeTruthy()
  })
})

describe('the v2 backup store', () => {
  it('stores, lists, and deletes a backup', async () => {
    await saveV2Backup('pilot', v2Pilot() as never, ['absent'], ['Absent Pack'])

    const [record] = await getV2Backups()
    expect(record.type).toBe('pilot')
    expect(record.missingLcps).toEqual(['absent'])
    expect(record.timestamp).toBeGreaterThan(0)

    await deleteV2Backup(record.id)
    expect(await getV2Backups()).toEqual([])
  })
})

describe('preprocessPilotImport', () => {
  it('passes a v3 pilot straight through', async () => {
    const data = { itemType: 'pilot', callsign: 'HAMMER' }
    expect(await preprocessPilotImport(data)).toEqual({ action: 'import', transformed: data })
  })

  it('transforms a v2 pilot whose packs are all installed', async () => {
    const result = await preprocessPilotImport(v2Pilot())
    expect(result.action).toBe('import')
    expect((result.transformed as any).itemType).toBe('pilot')
  })

  it('backs up a v2 pilot with missing packs instead of importing it', async () => {
    const result = await preprocessPilotImport(v2Pilot({ brews: [{ LcpId: 'absent' }] }))

    expect(result.action).toBe('backup')
    expect(result.missingLcps).toEqual(['absent'])
    expect(await getV2Backups()).toHaveLength(1)
  })
})

describe('preprocessNpcImport', () => {
  it('backs up an npc with unresolvable features', async () => {
    const result = await preprocessNpcImport(v2Npc({ items: [{ itemID: 'npcf_nope' }] }))

    expect(result.action).toBe('backup')
    expect(await getV2Backups()).toHaveLength(1)
  })
})

describe('forceImportV2Pilot', () => {
  it('imports the pilot and reports what it stripped', async () => {
    const result = await forceImportV2Pilot(
      v2Pilot({
        mechs: [
          {
            id: 'm1',
            loadouts: [
              {
                systems: [{ id: 'ms_not_installed' }],
                mounts: [{ slots: [{ weapon: { id: 'mw_not_installed' } }] }],
              },
            ],
          },
        ],
      }) as never
    )

    expect(result.stripped).toEqual(['ms_not_installed', 'mw_not_installed'])
    expect(PilotStore().Pilots).toHaveLength(1)
  })
})

describe('forceImportV2Npc', () => {
  it('drops unresolvable features and imports what is left', async () => {
    const result = await forceImportV2Npc(v2Npc({ items: [{ itemID: 'npcf_nope' }] }) as never)

    expect(result.stripped).toEqual(['npcf_nope'])
    expect((result.imported as any).features).toEqual([])
    expect(NpcStore().Npcs).toHaveLength(1)
  })
})

describe('reprocessV2Backups', () => {
  it('imports a backup once its packs are installed and clears it', async () => {
    await saveV2Backup(
      'pilot',
      v2Pilot({ brews: [{ LcpId: 'later' }] }) as never,
      ['later'],
      ['Later Pack']
    )

    expect((await reprocessV2Backups()).stillPending).toEqual(['v2-pilot-1'])

    ContentPackStore().ContentPacks = [installedPack('later')]

    const result = await reprocessV2Backups()
    expect(result.succeeded).toEqual(['v2-pilot-1'])
    expect(await getV2Backups()).toEqual([])
    expect(PilotStore().Pilots).toHaveLength(1)
  })
})
