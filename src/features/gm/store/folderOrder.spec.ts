import { describe, it, expect, vi, beforeEach } from 'vitest'

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

import { EncounterStore } from './encounter_store'
import { NpcStore } from './npc_store'
import { makeNpc } from '@/__tests__/factories'
import { Doodad } from '@/classes/npc/doodad/Doodad'
import { Encounter } from '@/classes/encounter/Encounter'
import {
  buildFieldHashMap,
  stampChangedFields,
  mergeFields,
} from '@/classes/components/cloud/fieldMerge'

function seed(...folders: string[]): Encounter[] {
  const encounters = folders.map(folder => {
    const e = new Encounter()
    e.FolderController.Folder = folder
    return e
  })
  EncounterStore().Encounters = encounters
  return EncounterStore().Encounters as Encounter[]
}

describe('encounter folder order', () => {
  beforeEach(() => {
    EncounterStore().Folders = []
    EncounterStore().FolderOrder = []
  })

  it('keeps first-seen order until folders are ranked', () => {
    seed('TEST A', 'TEST B', '', 'TEST C')

    expect(EncounterStore().getFolders).toEqual(['TEST A', 'TEST B', 'TEST C'])
  })

  it('stores a reorder on the encounters themselves', () => {
    const [a, b, none, c] = seed('TEST A', 'TEST B', '', 'TEST C')
    EncounterStore().SetFolderOrder(['TEST C', 'TEST A', 'TEST B'])

    expect(EncounterStore().getFolders).toEqual(['TEST C', 'TEST A', 'TEST B'])
    expect([a, b, c].map(x => x.FolderController.FolderIndex)).toEqual([1, 2, 0])
    expect(none.FolderController.FolderIndex).toBe(-1)
    expect(Encounter.Serialize(c).folder.folderIndex).toBe(0)
  })

  it('reads the order back from encounter data alone', () => {
    const saved = seed('TEST A', 'TEST B', 'TEST C')
    EncounterStore().SetFolderOrder(['TEST C', 'TEST A', 'TEST B'])
    const data = saved.map(x => JSON.parse(JSON.stringify(Encounter.Serialize(x))))

    EncounterStore().FolderOrder = []
    EncounterStore().Encounters = data.map(x => Encounter.Deserialize(x))

    expect(EncounterStore().getFolders).toEqual(['TEST C', 'TEST A', 'TEST B'])
  })

  it('keeps a folder in place when it is renamed', () => {
    seed('TEST A', 'TEST B', 'TEST C')
    EncounterStore().SetFolderOrder(['TEST C', 'TEST A', 'TEST B'])
    EncounterStore().EditFolder({ old: 'TEST A', newName: 'TEST RENAMED' })

    expect(EncounterStore().getFolders).toEqual(['TEST C', 'TEST RENAMED', 'TEST B'])
  })

  it('does not let a moved encounter drag its old rank into the new folder', () => {
    const [c] = seed('TEST C', 'TEST C', 'TEST A', 'TEST B')
    EncounterStore().SetFolderOrder(['TEST C', 'TEST A', 'TEST B'])
    c.FolderController.Folder = 'TEST B'

    expect(c.FolderController.FolderIndex).toBe(-1)
    expect(EncounterStore().getFolders).toEqual(['TEST C', 'TEST A', 'TEST B'])
  })

  it('ranks a folder by the lowest rank among its encounters', () => {
    const [stale, , other] = seed('TEST A', 'TEST A', 'TEST B')
    EncounterStore().SetFolderOrder(['TEST B', 'TEST A'])
    stale.FolderController.FolderIndex = 5
    other.FolderController.FolderIndex = 3

    expect(EncounterStore().getFolders).toEqual(['TEST A', 'TEST B'])
  })

  it('saves only the encounters whose rank changes', () => {
    const [a, b, c] = seed('TEST A', 'TEST B', 'TEST C')
    EncounterStore().SetFolderOrder(['TEST A', 'TEST B', 'TEST C'])
    const saves = [a, b, c].map(x => vi.spyOn(x.SaveController, 'save'))

    EncounterStore().SetFolderOrder(['TEST A', 'TEST C', 'TEST B'])

    expect(saves.map(x => x.mock.calls.length)).toEqual([0, 1, 1])
  })

  it('ranks an encounter that joined an unranked folder once the current order is saved', () => {
    const [mover] = seed('TEST A', 'TEST B')
    EncounterStore().SetFolderOrder(['TEST B', 'TEST A'])
    mover.FolderController.Folder = 'TEST NEW'

    EncounterStore().SetFolderOrder(EncounterStore().getFolders)

    expect(EncounterStore().getFolders).toEqual(['TEST B', 'TEST NEW'])
    expect(mover.FolderController.FolderIndex).toBe(1)
  })

  it('keeps an empty folder where it was dropped for the session', () => {
    seed('TEST A', 'TEST B')
    EncounterStore().AddFolder('TEST EMPTY')
    EncounterStore().SetFolderOrder(['TEST A', 'TEST EMPTY', 'TEST B'])

    expect(EncounterStore().getFolders).toEqual(['TEST A', 'TEST EMPTY', 'TEST B'])
  })

  it('leaves other folders alone when removing one that was never added by hand', () => {
    seed('TEST A')
    EncounterStore().AddFolder('TEST EMPTY')
    EncounterStore().RemoveFolder('TEST A')

    expect(EncounterStore().getFolders).toEqual(['TEST EMPTY'])
  })
})

describe('encounter folder order across devices', () => {
  const plain = (e: Encounter) => JSON.parse(JSON.stringify(Encounter.Serialize(e)))
  const stampedAgainstLastSyncedCopy = (encounters: Encounter[], lastSynced: any[]) =>
    encounters.map(plain).map((data, i) => ({
      ...data,
      _ts: stampChangedFields(data, buildFieldHashMap(lastSynced[i]), {}, Date.now()),
    }))
  const load = (data: any[]) => {
    EncounterStore().FolderOrder = []
    EncounterStore().Encounters = data.map(x => Encounter.Deserialize(x))
  }

  beforeEach(() => {
    EncounterStore().Folders = []
    EncounterStore().FolderOrder = []
  })

  it('carries a reorder to a device holding the older copy', () => {
    const encounters = seed('TEST A', 'TEST B', 'TEST C')
    const older = encounters.map(plain)
    EncounterStore().SetFolderOrder(['TEST C', 'TEST A', 'TEST B'])
    const newer = stampedAgainstLastSyncedCopy(encounters, older)

    const pulled = older.map((local, i) => mergeFields(local, newer[i]))
    expect(pulled.map(x => x.folder.folderIndex)).toEqual([1, 2, 0])
    load(pulled)
    expect(EncounterStore().getFolders).toEqual(['TEST C', 'TEST A', 'TEST B'])
  })

  it('keeps a reorder on the device that made it when the cloud copy is older', () => {
    const encounters = seed('TEST A', 'TEST B', 'TEST C')
    const older = encounters.map(plain)
    EncounterStore().SetFolderOrder(['TEST C', 'TEST A', 'TEST B'])
    const newer = stampedAgainstLastSyncedCopy(encounters, older)

    const kept = newer.map((local, i) => mergeFields(local, older[i]))
    expect(kept.map(x => x.folder.folderIndex)).toEqual([1, 2, 0])
  })

  it('carries a moved encounter with its new folder and rank', () => {
    const encounters = seed('TEST A', 'TEST A', 'TEST B')
    EncounterStore().SetFolderOrder(['TEST B', 'TEST A'])
    const older = encounters.map(plain)

    encounters[0].FolderController.Folder = 'TEST B'
    EncounterStore().SetFolderOrder(EncounterStore().getFolders)
    const newer = stampedAgainstLastSyncedCopy(encounters, older)

    const pulled = older.map((local, i) => mergeFields(local, newer[i]))
    expect(pulled[0].folder).toMatchObject({ folder: 'TEST B', folderIndex: 0 })
    load(pulled)
    expect(EncounterStore().getFolders).toEqual(['TEST B', 'TEST A'])
  })
})

describe('npc folder order, shared by units, doodads and eidolons', () => {
  const filed = <T extends { FolderController: { Folder: string } }>(npc: T, folder: string) => {
    npc.FolderController.Folder = folder
    return npc
  }

  beforeEach(() => {
    NpcStore().Folders = []
    NpcStore().FolderOrder = []
    NpcStore().Npcs = [
      filed(makeNpc('TEST UNIT 1'), 'TEST A'),
      filed(new Doodad(), 'TEST D'),
      filed(makeNpc('TEST UNIT 2'), 'TEST B'),
      filed(new Doodad(), 'TEST B'),
      filed(makeNpc('TEST UNIT 3'), 'TEST C'),
    ] as any
  })

  it('reorders the folders one list shows without moving the ones it does not', () => {
    const foldersHoldingUnits = ['TEST C', 'TEST A', 'TEST B']
    NpcStore().ReorderFolders(foldersHoldingUnits)

    expect(NpcStore().getFolders).toEqual(['TEST C', 'TEST D', 'TEST A', 'TEST B'])
  })

  it('gives every folder its own rank, whatever kinds of npc are in it', () => {
    NpcStore().ReorderFolders(['TEST C', 'TEST A', 'TEST B'])

    const ranks = NpcStore().Npcs.map(x => [
      x.FolderController.Folder,
      x.FolderController.FolderIndex,
    ])
    expect(ranks).toEqual([
      ['TEST A', 2],
      ['TEST D', 1],
      ['TEST B', 3],
      ['TEST B', 3],
      ['TEST C', 0],
    ])
  })

  it('keeps a renamed folder in place', () => {
    NpcStore().ReorderFolders(['TEST C', 'TEST A', 'TEST B'])
    NpcStore().EditFolder({ old: 'TEST D', newName: 'TEST D RENAMED' })

    expect(NpcStore().getFolders).toEqual(['TEST C', 'TEST D RENAMED', 'TEST A', 'TEST B'])
  })
})
