import { describe, it, expect, vi } from 'vitest'

vi.mock('@/io/Storage', () => ({
  SetItem: vi.fn(),
  RemoveItem: vi.fn(),
  GetAll: vi.fn(async () => []),
  saveAll: vi.fn(),
  storeRegistry: {},
}))

import { toRaw } from 'vue'
import { makePilot, makeNpc } from '@/__tests__/factories'
import { Doodad } from '@/classes/npc/doodad/Doodad'
import { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { Character } from '@/classes/narrative/Character'
import { Faction } from '@/classes/narrative/Faction'
import { Location } from '@/classes/narrative/Location'
import { Encounter } from '@/classes/encounter/Encounter'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterArchive } from '@/classes/encounter/EncounterArchive'
import { Campaign } from '@/classes/campaign/Campaign'
import { PilotLogbook } from '@/classes/pilot/PilotLogbook'
import PilotSheet from '@/features/pilot_management/store/PilotSheet'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { PilotStore, PilotGroupStore, PilotSheetStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { NarrativeStore } from '@/features/gm/store/narrative_store'
import { EncounterStore } from '@/features/gm/store/encounter_store'
import { CampaignStore } from '@/features/gm/store/campaign_store'
import { allRegistrations, getItemRegistration } from './ItemRegistry'
import { normalizeItemType } from './ItemTypeMap'

const instance = () => new EncounterInstance(undefined, new Encounter(), [makePilot()])

type Row = {
  type: string
  sample: () => any
  store: () => any
  list: string
  add: string
  remove: string
}

const rows: Row[] = [
  {
    type: 'pilot',
    sample: () => makePilot(),
    store: PilotStore,
    list: 'Pilots',
    add: 'AddPilot',
    remove: 'DeletePilotPermanent',
  },
  {
    type: 'pilotgroup',
    sample: () => new PilotGroup({ id: 'TEST1', pilots: [] } as any),
    store: PilotGroupStore,
    list: 'PilotGroups',
    add: 'AddGroup',
    remove: 'DeleteGroupPermanent',
  },
  {
    type: 'unit',
    sample: () => makeNpc(),
    store: NpcStore,
    list: 'Npcs',
    add: 'AddNpc',
    remove: 'DeleteNpcPermanent',
  },
  {
    type: 'doodad',
    sample: () => new Doodad(),
    store: NpcStore,
    list: 'Npcs',
    add: 'AddNpc',
    remove: 'DeleteNpcPermanent',
  },
  {
    type: 'eidolon',
    sample: () => new Eidolon(),
    store: NpcStore,
    list: 'Npcs',
    add: 'AddNpc',
    remove: 'DeleteNpcPermanent',
  },
  {
    type: 'character',
    sample: () => new Character(),
    store: NarrativeStore,
    list: 'CollectionItems',
    add: 'AddItem',
    remove: 'DeleteItemPermanent',
  },
  {
    type: 'faction',
    sample: () => new Faction(),
    store: NarrativeStore,
    list: 'CollectionItems',
    add: 'AddItem',
    remove: 'DeleteItemPermanent',
  },
  {
    type: 'location',
    sample: () => new Location(),
    store: NarrativeStore,
    list: 'CollectionItems',
    add: 'AddItem',
    remove: 'DeleteItemPermanent',
  },
  {
    type: 'encounter',
    sample: () => new Encounter(),
    store: EncounterStore,
    list: 'Encounters',
    add: 'AddEncounter',
    remove: 'DeleteEncounterPermanent',
  },
  {
    type: 'encounterinstance',
    sample: instance,
    store: EncounterStore,
    list: 'ActiveEncounters',
    add: 'AddEncounterInstance',
    remove: 'RemoveEncounterInstance',
  },
  {
    type: 'encounterarchive',
    sample: () => EncounterArchive.FromInstance(instance(), '', 'victory'),
    store: EncounterStore,
    list: 'ArchivedEncounters',
    add: 'AddEncounterArchive',
    remove: 'RemoveEncounterArchive',
  },
  {
    type: 'pilotsheet',
    sample: () => PilotSheet.FromPilot(makePilot()),
    store: PilotSheetStore,
    list: 'PilotSheets',
    add: 'ImportPilotSheet',
    remove: 'RemovePilotSheet',
  },
  {
    type: 'pilotlogbook',
    sample: () => new PilotLogbook({ pilotId: 'TEST1' }),
    store: PilotStore,
    list: 'PilotLogbooks',
    add: 'ImportPilotLogbook',
    remove: 'RemovePilotLogbook',
  },
  {
    type: 'campaign',
    sample: () => new Campaign(),
    store: CampaignStore,
    list: 'Campaigns',
    add: 'AddCampaign',
    remove: 'DeleteCampaign',
  },
]

describe('the item registry', () => {
  it('covers every registered type', () => {
    expect([...allRegistrations().keys()].sort()).toEqual(rows.map(r => r.type).sort())
  })

  it('normalizes the type it is asked for', () => {
    expect(getItemRegistration('Pilot_Group')).toBe(getItemRegistration('pilotgroup'))
  })

  it('does not make a pulled pilot sheet the active sheet', async () => {
    const sheet = PilotSheet.FromPilot(makePilot())
    await getItemRegistration('pilotsheet')!.add(sheet)
    expect(PilotSheetStore().PilotSheets.map(x => x.ID)).toEqual([sheet.ID])
    expect(PilotSheetStore().CurrentActiveID).toBe('')
  })

  it('deletes only the given pilot sheet', async () => {
    const sheets = [1, 2, 3].map(() => PilotSheet.FromPilot(makePilot()))
    const ids = sheets.map(x => x.ID)
    PilotSheetStore().PilotSheets = sheets
    await getItemRegistration('pilotsheet')!.deleteLocal(sheets[0])
    expect(PilotSheetStore().PilotSheets.map(x => x.ID)).toEqual(ids.slice(1))
  })

  describe.each(rows)('$type', row => {
    const reg = () => getItemRegistration(row.type)!

    it('rebuilds an item from its saved data', () => {
      const item = row.sample()
      const data = JSON.parse(JSON.stringify(toRaw(item).Serialize()))
      const rebuilt = reg().construct(data)
      expect(rebuilt.ID).toBe(item.ID)
      expect(normalizeItemType(rebuilt.ItemType)).toBe(row.type)
    })

    it('adds and deletes through its store', async () => {
      const item = row.sample()
      const add = vi.spyOn(row.store(), row.add as any).mockResolvedValue(undefined as never)
      const remove = vi.spyOn(row.store(), row.remove as any).mockResolvedValue(undefined as never)
      await reg().add(item)
      await reg().deleteLocal(item)
      expect(add.mock.calls[0][0]).toBe(item)
      expect(remove).toHaveBeenCalledWith(item)
    })

    it('lists only items of its own type', () => {
      const item = row.sample()
      const others = rows.filter(r => r.list === row.list && r.type !== row.type)
      row.store()[row.list] = [item, ...others.map(r => r.sample())]
      expect(
        reg()
          .getAll()
          .map((x: any) => x.ID)
      ).toEqual([item.ID])
    })
  })
})
