import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { useDragMode } from './useDragMode'
import { useFolderManagement } from './useFolderManagement'
import { startDragScroll, stopDragScroll } from './useScrollOnDrag'
import {
  ITEM_BONUS_IDS,
  externalItemBonuses,
  externalPilotItemBonuses,
} from './useExternalItemBonuses'
import { makePilot, makeMech } from '@/__tests__/factories'
import { CompendiumStore } from '@/features/compendium/store'

afterEach(() => {
  vi.useRealTimers()
})

describe('useDragMode', () => {
  it('enters drag mode only after the hold duration', () => {
    vi.useFakeTimers()
    const { dragModeActive, onPointerDown } = useDragMode(600)

    onPointerDown()
    expect(dragModeActive.value).toBe(false)

    vi.advanceTimersByTime(600)
    expect(dragModeActive.value).toBe(true)
  })

  it('cancels the hold when the pointer lifts early', () => {
    vi.useFakeTimers()
    const { dragModeActive, onPointerDown, onPointerUp } = useDragMode(600)

    onPointerDown()
    vi.advanceTimersByTime(300)
    onPointerUp()
    vi.advanceTimersByTime(600)

    expect(dragModeActive.value).toBe(false)
  })

  it('ignores a second press while one is already pending', () => {
    vi.useFakeTimers()
    const { dragModeActive, onPointerDown } = useDragMode(600)

    onPointerDown()
    vi.advanceTimersByTime(300)
    onPointerDown()
    vi.advanceTimersByTime(300)

    expect(dragModeActive.value).toBe(true)
  })

  it('keeps separate state per caller unless shared', () => {
    vi.useFakeTimers()
    const a = useDragMode(100)
    const b = useDragMode(100)

    a.onPointerDown()
    vi.advanceTimersByTime(100)

    expect(a.dragModeActive.value).toBe(true)
    expect(b.dragModeActive.value).toBe(false)
  })

  it('shares state when asked', () => {
    vi.useFakeTimers()
    const a = useDragMode(100, { shared: true })
    const b = useDragMode(100, { shared: true })

    a.onPointerDown()
    vi.advanceTimersByTime(100)

    expect(b.dragModeActive.value).toBe(true)

    b.dragModeActive.value = false
  })
})

describe('useFolderManagement', () => {
  const item = (folder: string) => ({ FolderController: { Folder: folder } })

  it('adds a folder', () => {
    const folders: string[] = []
    useFolderManagement([], folders).AddFolder('Squad A')

    expect(folders).toEqual(['Squad A'])
  })

  it('renames a folder and everything filed in it', () => {
    const items = [item('Squad A'), item('Squad B')]
    const folders = ['Squad A', 'Squad B']

    useFolderManagement(items, folders).EditFolder({ old: 'Squad A', newName: 'Vanguard' })

    expect(items[0].FolderController.Folder).toBe('Vanguard')
    expect(items[1].FolderController.Folder).toBe('Squad B')
    expect(folders).toContain('Vanguard')
  })

  it('removes a folder and unfiles its contents', () => {
    const items = [item('Squad A')]
    const folders = ['Squad A']

    useFolderManagement(items, folders).RemoveFolder('Squad A')

    expect(items[0].FolderController.Folder).toBe('')
    expect(folders).toEqual([])
  })
})

describe('drag scrolling', () => {
  it('listens while dragging and stops afterwards', () => {
    vi.useFakeTimers()
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')

    startDragScroll()
    expect(add).toHaveBeenCalledWith('dragover', expect.any(Function))

    stopDragScroll()
    expect(remove).toHaveBeenCalledWith('dragover', expect.any(Function))
  })

  it('stops cleanly when nothing is scrolling', () => {
    expect(() => stopDragScroll()).not.toThrow()
  })

  const dragOverAt = (clientY: number) => {
    const event = new Event('dragover') as Event & { clientY: number }
    event.clientY = clientY
    document.dispatchEvent(event)
  }

  it('scrolls the window while a drag sits near the edge', () => {
    vi.useFakeTimers()
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})

    startDragScroll()
    dragOverAt(0)
    vi.advanceTimersByTime(64)
    stopDragScroll()

    expect(scrollBy).toHaveBeenCalled()
  })

  it('scrolls up near the top edge and down near the bottom edge', () => {
    vi.useFakeTimers()
    const deltas: number[] = []
    vi.spyOn(window, 'scrollBy').mockImplementation(((_x: number, y: number) => {
      deltas.push(y)
    }) as never)

    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })

    startDragScroll()
    dragOverAt(0)
    vi.advanceTimersByTime(16)
    dragOverAt(1000)
    vi.advanceTimersByTime(16)
    stopDragScroll()

    expect(deltas.some(d => d < 0)).toBe(true)
    expect(deltas.some(d => d > 0)).toBe(true)
  })
})

describe('external item bonuses', () => {
  it('publishes the bonus ids that can come from elsewhere', () => {
    expect(ITEM_BONUS_IDS.size).toBeGreaterThan(0)
  })

  it('is empty for an item nothing on the mech buffs', () => {
    const pilot = makePilot({ level: 3 })
    const mech = makeMech(pilot)
    const weapon = CompendiumStore().MechWeapons.find(w => !w.IsHidden)!

    expect(externalItemBonuses(mech, weapon)).toEqual([])
    expect(externalPilotItemBonuses(pilot, weapon)).toEqual([])
  })
})
