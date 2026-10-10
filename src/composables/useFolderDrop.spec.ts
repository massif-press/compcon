import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Sortable from 'sortablejs'
import { useFolderDrop, drawerAutoScroll } from './useFolderDrop'

type Item = { ID: string; FolderController: { Folder: string; SortIndex: number } }

const item = (id: string, folder: string, sortIndex = 0): Item => ({
  ID: id,
  FolderController: { Folder: folder, SortIndex: sortIndex },
})

function rowFor(id: string, cssClass = '') {
  const row = document.createElement('div')
  row.dataset.itemId = id
  row.className = cssClass
  document.body.appendChild(row)
  return row
}

function folderDrop(folder: string, items: Item[], rowsDisplayedInSavedOrder = true) {
  const transferred = vi.fn()
  const displayedRows = () =>
    items
      .filter(x => x.FolderController.Folder === folder)
      .sort((a, b) => a.FolderController.SortIndex - b.FolderController.SortIndex)
  const drop = useFolderDrop({
    folder: () => folder,
    droppableItems: () => items,
    displayedRows,
    rowsDisplayedInSavedOrder: () => rowsDisplayedInSavedOrder,
    transferred,
  })
  return { ...drop, transferred, displayedRows }
}

const positions = (items: Item[]) =>
  Object.fromEntries(items.map(x => [x.ID, x.FolderController.SortIndex]))

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('reordering rows inside a folder', () => {
  it('saves the order the rows were dropped in', () => {
    const items = [
      item('TEST_A', 'TEST FOLDER', 0),
      item('TEST_B', 'TEST FOLDER', 1),
      item('TEST_C', 'TEST FOLDER', 2),
    ]
    const list = document.createElement('div')

    folderDrop('TEST FOLDER', items).onItemReorder({
      item: rowFor('TEST_C'),
      from: list,
      to: list,
      oldIndex: 2,
      newIndex: 0,
    })

    expect(positions(items)).toEqual({ TEST_C: 0, TEST_A: 1, TEST_B: 2 })
  })

  it('leaves the order alone when the row ended up in another list', () => {
    const items = [item('TEST_A', 'TEST FOLDER', 0), item('TEST_B', 'TEST FOLDER', 1)]

    folderDrop('TEST FOLDER', items).onItemReorder({
      item: rowFor('TEST_B'),
      from: document.createElement('div'),
      to: document.createElement('div'),
      oldIndex: 1,
      newIndex: 0,
    })

    expect(positions(items)).toEqual({ TEST_A: 0, TEST_B: 1 })
  })
})

describe('dropping a row into another folder', () => {
  it('places it where it was dropped when rows are displayed in saved order', async () => {
    const items = [
      item('TEST_A', 'TEST FOLDER', 0),
      item('TEST_B', 'TEST FOLDER', 1),
      item('TEST_X', 'TEST OTHER FOLDER', 9),
    ]
    const drop = folderDrop('TEST FOLDER', items)

    await drop.onItemAdded({ item: rowFor('TEST_X'), newIndex: 1 })

    expect(drop.displayedRows().map(x => x.ID)).toEqual(['TEST_A', 'TEST_X', 'TEST_B'])
    expect(drop.transferred).toHaveBeenCalledOnce()
  })

  it('puts it last and keeps the saved order when rows are displayed in another order', async () => {
    const items = [
      item('TEST_A', 'TEST FOLDER', 4),
      item('TEST_B', 'TEST FOLDER', 7),
      item('TEST_X', 'TEST OTHER FOLDER', 0),
    ]
    const sortedSomeOtherWay = false
    const drop = folderDrop('TEST FOLDER', items, sortedSomeOtherWay)

    await drop.onItemAdded({ item: rowFor('TEST_X'), newIndex: 0 })

    expect(items[2].FolderController.Folder).toBe('TEST FOLDER')
    expect(positions(items)).toEqual({ TEST_A: 4, TEST_B: 7, TEST_X: 8 })
  })
})

describe('highlighting a folder as a drop target', () => {
  it('lights up for a dragged row from another folder', () => {
    const drop = folderDrop('TEST FOLDER', [item('TEST_X', 'TEST OTHER FOLDER')])
    rowFor('TEST_X', 'sortable-chosen')

    drop.onItemDragEnter()

    expect(drop.dropActive.value).toBe(true)
  })

  it('stays dark for a row that already lives in the folder', () => {
    const drop = folderDrop('TEST FOLDER', [item('TEST_A', 'TEST FOLDER')])
    rowFor('TEST_A', 'sortable-chosen')

    drop.onItemDragEnter()

    expect(drop.dropActive.value).toBe(false)
  })

  it('stays dark while a folder, not a row, is being dragged', () => {
    const drop = folderDrop('TEST FOLDER', [item('TEST_X', 'TEST OTHER FOLDER')])
    const draggedFolder = document.createElement('div')
    draggedFolder.className = 'sortable-chosen'
    document.body.appendChild(draggedFolder)

    drop.onItemDragEnter()

    expect(drop.dropActive.value).toBe(false)
  })

  it('goes dark when the drag is cancelled without ever leaving the folder', () => {
    const drop = folderDrop('TEST FOLDER', [item('TEST_X', 'TEST OTHER FOLDER')])
    rowFor('TEST_X', 'sortable-chosen')
    drop.onItemDragEnter()

    document.dispatchEvent(new Event('dragend'))

    expect(drop.dropActive.value).toBe(false)
  })
})

describe('dropping a row on a folder header', () => {
  it('moves the row to the end of the folder and opens it', () => {
    const items = [
      item('TEST_A', 'TEST FOLDER', 0),
      item('TEST_B', 'TEST FOLDER', 1),
      item('TEST_X', 'TEST OTHER FOLDER', 0),
    ]
    const drop = folderDrop('TEST FOLDER', items)
    drop.open.value = false
    rowFor('TEST_X', 'sortable-chosen')

    drop.onDrop()
    vi.runAllTimers()

    expect(items[2].FolderController).toEqual({ Folder: 'TEST FOLDER', SortIndex: 2 })
    expect(drop.open.value).toBe(true)
    expect(drop.transferred).toHaveBeenCalledOnce()
  })

  it('moves nothing until sortable has handled the same drop', () => {
    const items = [item('TEST_X', 'TEST OTHER FOLDER')]
    const drop = folderDrop('TEST FOLDER', items)
    rowFor('TEST_X', 'sortable-chosen')

    drop.onDrop()

    expect(items[0].FolderController.Folder).toBe('TEST OTHER FOLDER')
  })

  it('wins over the list the row was hovering when it was dropped', async () => {
    const items = [
      item('TEST_X', 'TEST OTHER FOLDER'),
      item('TEST_H1', 'TEST HOVERED FOLDER', 0),
      item('TEST_H2', 'TEST HOVERED FOLDER', 1),
    ]
    const header = folderDrop('TEST FOLDER', items)
    const hoveredList = folderDrop('TEST HOVERED FOLDER', items)
    const row = rowFor('TEST_X', 'sortable-chosen')

    header.onDrop()
    await hoveredList.onItemAdded({ item: row, newIndex: 0 })
    vi.runAllTimers()

    expect(items[0].FolderController.Folder).toBe('TEST FOLDER')
    expect(hoveredList.transferred).not.toHaveBeenCalled()
    expect(positions(items)).toMatchObject({ TEST_H1: 0, TEST_H2: 1 })
  })

  it('leaves the list the row started in as it was', () => {
    const items = [item('TEST_X', 'TEST ORIGIN FOLDER', 0), item('TEST_O', 'TEST ORIGIN FOLDER', 1)]
    const header = folderDrop('TEST FOLDER', items)
    const originList = folderDrop('TEST ORIGIN FOLDER', items)
    const row = rowFor('TEST_X', 'sortable-chosen')
    const list = document.createElement('div')

    header.onDrop()
    originList.onItemReorder({ item: row, from: list, to: list, oldIndex: 0, newIndex: 1 })

    expect(positions(items)).toEqual({ TEST_X: 0, TEST_O: 1 })
  })

  it('ignores a row dropped on the header of the folder it is already in', () => {
    const items = [item('TEST_A', 'TEST FOLDER', 0), item('TEST_B', 'TEST FOLDER', 1)]
    const drop = folderDrop('TEST FOLDER', items)
    rowFor('TEST_A', 'sortable-chosen')

    drop.onDrop()
    vi.runAllTimers()

    expect(positions(items)).toEqual({ TEST_A: 0, TEST_B: 1 })
    expect(drop.transferred).not.toHaveBeenCalled()
  })
})

describe('autoscroll inside the drawer', () => {
  it('only sets options sortable actually reads', () => {
    const knownOptions = Object.keys(Sortable.create(document.createElement('div')).options)

    expect(knownOptions).toEqual(expect.arrayContaining(Object.keys(drawerAutoScroll)))
  })
})
