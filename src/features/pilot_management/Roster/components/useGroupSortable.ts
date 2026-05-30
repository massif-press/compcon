import { ref, computed } from 'vue'
import { PilotStore, PilotGroupStore } from '@/stores'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { startDragScroll, stopDragScroll } from '@/composables/useScrollOnDrag'
import { useDragMode } from '@/composables/useDragMode'

export function useGroupSortable(
  group: any,
  filteredPilots: ReturnType<typeof computed<any[]>>,
  rosterSearch: ReturnType<typeof ref<string>>,
  mobile: { value: boolean },
  dragModeActive: { value: boolean },
  transferKey: { value: number },
  emit: (event: string) => void
) {
  const { onPointerDown, onPointerUp, onPointerCancel } = useDragMode(600, { shared: true })

  const rootEl = ref<HTMLElement | null>(null)
  const dropActive = ref(false)

  const groupSortableKey = computed(
    () => `${group.ID}-${transferKey.value}-${dragModeActive.value}`
  )

  const sortableOptions = computed(() => {
    const needsHandle = !mobile.value || !dragModeActive.value
    return {
      animation: 250,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      handle: needsHandle ? '.drag-handle' : undefined,
      group: { name: 'pilots', pull: true, put: ['pilots'] },
      scroll: false,
      disabled: !!rosterSearch.value,
    }
  })

  function onPilotReorder(event: any) {
    stopDragScroll()
    dropActive.value = false
    if (event.from !== event.to) return
    if (event.oldIndex === event.newIndex) return
    if (rosterSearch.value) return

    const fromPilot = filteredPilots.value[event.oldIndex]
    const toPilot = filteredPilots.value[event.newIndex]
    if (!fromPilot || !toPilot) return

    const fromIdx = group.Pilots.findIndex((p: any) => p.id === fromPilot.ID)
    const toIdx = group.Pilots.findIndex((p: any) => p.id === toPilot.ID)
    if (fromIdx === -1 || toIdx === -1) return

    PilotStore().movePilotIndex(group as PilotGroup, fromIdx, toIdx)
    PilotGroupStore().SaveGroupData()
  }

  function onDropOnTitle() {
    if (!dropActive.value) return
    const dragEl = document.querySelector('[data-pilot-id].sortable-chosen') ||
      document.querySelector('[data-pilot-id].sortable-ghost')
    const pilotId = (dragEl as HTMLElement)?.dataset?.pilotId
    if (!pilotId) return
    if (group.Pilots.some((p: any) => p.id === pilotId)) { dropActive.value = false; return }
    const pilot = PilotStore().getPilotByID(pilotId) as any
    if (!pilot) return
    PilotGroupStore().TransferPilot(pilot, group.ID)
    emit('pilot-transferred')
    dropActive.value = false
  }

  function onDragEnter() {
    if (document.querySelector('.sortable-chosen .group-drag-handle')) return
    dropActive.value = true
  }

  function onDragLeave(event: DragEvent) {
    if (rootEl.value && rootEl.value.contains(event.relatedTarget as Node)) return
    dropActive.value = false
  }

  async function onPilotAdded(event: any) {
    stopDragScroll()
    dropActive.value = false
    const pilotId = event.item.dataset.pilotId
    if (!pilotId) return
    const pilot = PilotStore().getPilotByID(pilotId) as any
    if (!pilot) return
    await PilotGroupStore().TransferPilot(pilot, group.ID)
    emit('pilot-transferred')
  }

  return {
    rootEl,
    dropActive,
    groupSortableKey,
    sortableOptions,
    onPilotReorder,
    onDropOnTitle,
    onDragEnter,
    onDragLeave,
    onPilotAdded,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    startDragScroll,
  }
}
