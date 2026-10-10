import { describe, it, expect, vi } from 'vitest'

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

import { mount } from '@vue/test-utils'
import ItemSidebarList from './ItemSidebarList.vue'
import { makeNpc } from '@/__tests__/factories'

function unit(name: string, folder = '', sortIndex = 0) {
  const npc = makeNpc(name)
  npc.FolderController.Folder = folder
  npc.FolderController.SortIndex = sortIndex
  return npc
}

function sidebar(units: ReturnType<typeof unit>[], props: Record<string, unknown> = {}) {
  const folders = [...new Set(units.map(x => x.FolderController.Folder).filter(Boolean))]
  return mount(ItemSidebarList, {
    props: {
      itemType: 'Unit',
      items: units,
      unfilteredItems: units,
      allFolders: folders,
      grouping: 'Folder',
      sorting: 'Manual',
      draggable: true,
      ...props,
    },
  })
}

type Sidebar = ReturnType<typeof sidebar>

const groupNames = (wrapper: Sidebar) =>
  wrapper.findAll('.heading.h3').map(x => x.element.childNodes[0].textContent!.trim())
const rowNames = (wrapper: Sidebar) => wrapper.findAll('[data-item-id] .heading').map(x => x.text())
const rowHandles = (wrapper: Sidebar) => wrapper.findAll('.folder-drag-handle').length
const folderHandles = (wrapper: Sidebar) => wrapper.findAll('.folder-sort-handle').length

const squad = () => [
  unit('TEST UNIT A', 'TEST FOLDER A'),
  unit('TEST UNIT B', 'TEST FOLDER B'),
  unit('TEST UNIT UNFILED'),
]

describe('sidebar drag handles', () => {
  it('shows one per row and one per folder, none for the unfiled group', () => {
    const wrapper = sidebar(squad())

    expect(rowHandles(wrapper)).toBe(3)
    expect(folderHandles(wrapper)).toBe(2)
  })

  it('hides them while a search narrows the rows', () => {
    const wrapper = sidebar(squad(), { search: 'TEST UNIT A' })

    expect(rowHandles(wrapper) + folderHandles(wrapper)).toBe(0)
  })

  it('hides them while a filter hides rows', () => {
    const units = squad()
    const wrapper = sidebar(units, { items: units.slice(0, 2) })

    expect(rowHandles(wrapper) + folderHandles(wrapper)).toBe(0)
  })

  it('hides them when rows are grouped by something other than folder', () => {
    const wrapper = sidebar(squad(), { grouping: 'None' })

    expect(rowHandles(wrapper) + folderHandles(wrapper)).toBe(0)
  })

  it('hides them for lists that are not draggable', () => {
    const wrapper = sidebar(squad(), { draggable: false })

    expect(rowHandles(wrapper) + folderHandles(wrapper)).toBe(0)
  })
})

describe('sidebar folder order', () => {
  it('follows the given order even for a folder with a numeric name', () => {
    const numericName = '2'
    const wrapper = sidebar(
      [unit('TEST UNIT A', 'TEST FOLDER'), unit('TEST UNIT B', numericName)],
      {
        allFolders: ['TEST FOLDER', numericName],
      }
    )

    expect(groupNames(wrapper)).toEqual(['TEST FOLDER', numericName])
  })

  it('keeps the unfiled group last', () => {
    const wrapper = sidebar([unit('TEST UNIT UNFILED'), unit('TEST UNIT A', 'TEST FOLDER A')])

    expect(groupNames(wrapper)).toEqual(['TEST FOLDER A', 'N/A'])
  })
})

describe('manual sort', () => {
  it('orders rows in a folder by saved position, then by name', () => {
    const wrapper = sidebar([
      unit('TEST UNIT Z', 'TEST FOLDER A', 0),
      unit('TEST UNIT B', 'TEST FOLDER A', 1),
      unit('TEST UNIT A', 'TEST FOLDER A', 1),
    ])

    expect(rowNames(wrapper)).toEqual(['TEST UNIT Z', 'TEST UNIT A', 'TEST UNIT B'])
  })

  it('orders by name alone when rows are not grouped by folder', () => {
    const wrapper = sidebar(
      [unit('TEST UNIT Z', 'TEST FOLDER A', 0), unit('TEST UNIT A', 'TEST FOLDER B', 5)],
      {
        grouping: 'None',
      }
    )

    expect(rowNames(wrapper)).toEqual(['TEST UNIT A', 'TEST UNIT Z'])
  })
})
