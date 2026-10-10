import { ref, nextTick } from 'vue'
import { stopDragScroll } from './useScrollOnDrag'

type Options = {
  folder: () => string
  droppableItems: () => any[]
  displayedRows: () => any[]
  rowsDisplayedInSavedOrder?: () => boolean
  transferred: () => void
}

const PINNED_DRAWER_BUTTON_CLEARANCE = 80
export const drawerAutoScroll = {
  forceAutoScrollFallback: true,
  scrollSensitivity: PINNED_DRAWER_BUTTON_CLEARANCE,
}

const afterSortableFinishesItsDrop = (run: () => void) => setTimeout(run)

export function useFolderDrop(o: Options) {
  const open = ref(true)
  const dropActive = ref(false)
  const rowsDisplayedInSavedOrder = () => o.rowsDisplayedInSavedOrder?.() ?? true

  function draggedRow() {
    return document.querySelector('.sortable-chosen[data-item-id]') as HTMLElement | null
  }
  function draggedItemFromAnotherFolder() {
    const id = draggedRow()?.dataset.itemId
    const item = o.droppableItems().find((x: any) => x.ID === id)
    return item && item.FolderController.Folder !== o.folder() ? item : null
  }
  function claimedByHeader(row: HTMLElement) {
    return !!row.dataset.claimedByHeader
  }
  function saveDisplayedOrder(rows: any[]) {
    rows.forEach((x: any, idx: number) => (x.FolderController.SortIndex = idx))
  }
  function moveToEndOfFolder(item: any) {
    const last = Math.max(
      -1,
      ...o
        .droppableItems()
        .filter((x: any) => x.FolderController.Folder === o.folder())
        .map((x: any) => x.FolderController.SortIndex)
    )
    item.FolderController.Folder = o.folder()
    item.FolderController.SortIndex = last + 1
    open.value = true
    o.transferred()
  }

  function onItemReorder(event: any) {
    stopDragScroll()
    if (claimedByHeader(event.item)) return
    if (event.from !== event.to) return
    if (event.oldIndex === event.newIndex) return
    const rows = [...o.displayedRows()]
    const [moved] = rows.splice(event.oldIndex, 1)
    rows.splice(event.newIndex, 0, moved)
    saveDisplayedOrder(rows)
  }
  async function onItemAdded(event: any) {
    dropActive.value = false
    if (claimedByHeader(event.item)) return
    const itemId = event.item.dataset.itemId
    const item = o.droppableItems().find((x: any) => x.ID === itemId)
    if (!item) return
    if (!rowsDisplayedInSavedOrder()) return moveToEndOfFolder(item)
    item.FolderController.Folder = o.folder()
    open.value = true
    await nextTick()
    const rows = [...o.displayedRows()]
    const movedIdx = rows.findIndex((x: any) => x.ID === itemId)
    if (movedIdx !== -1 && movedIdx !== event.newIndex) {
      const [moved] = rows.splice(movedIdx, 1)
      rows.splice(Math.min(event.newIndex, rows.length), 0, moved)
    }
    saveDisplayedOrder(rows)
    o.transferred()
  }
  function onItemDragEnter() {
    if (dropActive.value || !draggedItemFromAnotherFolder()) return
    dropActive.value = true
    document.addEventListener('dragend', () => (dropActive.value = false), { once: true })
  }
  function onItemDragLeave(event: DragEvent) {
    const el = event.currentTarget as HTMLElement
    if (el.contains(event.relatedTarget as Node)) return
    dropActive.value = false
  }
  function onDrop() {
    dropActive.value = false
    const item = draggedItemFromAnotherFolder()
    if (!item) return
    draggedRow()!.dataset.claimedByHeader = '1'
    afterSortableFinishesItsDrop(() => moveToEndOfFolder(item))
  }

  return {
    open,
    dropActive,
    onItemReorder,
    onItemAdded,
    onItemDragEnter,
    onItemDragLeave,
    onDrop,
  }
}
