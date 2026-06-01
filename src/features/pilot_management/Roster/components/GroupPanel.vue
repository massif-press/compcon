<template>
  <div ref="rootEl"
    style="position: relative"
    class="top-element"
    @dragenter.prevent="onDragEnter"
    @dragleave="onDragLeave">
    <div class="light bg-primary" />
    <group-header
      :group="group"
      :no-group="noGroup"
      :mobile="mobile.value"
      :drag-mode-active="dragModeActive"
      :drop-active="dropActive"
      :pilot-count="pilots.length"
      @toggle-expand="setGroupExpand"
      @drop="onDropOnTitle"
      @delete="deleteGroup"
      @transfer-pilot="transferPilot"
      @export="exportGroup" />
    <v-expand-transition>
      <v-card v-if="group.Expanded"
        style="overflow: visible">
        <pilot-sortable-list
          :filtered-pilots="filteredPilots"
          :group-sortable-key="groupSortableKey"
          :sortable-options="sortableOptions"
          :pilot-card-type="pilotCardType"
          :roster-view="rosterView"
          @reorder="onPilotReorder"
          @added="onPilotAdded"
          @start="startDragScroll"
          @pointer-down="onPointerDown"
          @pointer-up="onPointerUp"
          @pointer-cancel="onPointerCancel"
          @go-to="toPilotSheet" />
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { PilotStore, PilotGroupStore, UserStore } from '@/stores'
import PilotCard from './PilotCard.vue'
import PilotListItem from './PilotListItem.vue'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { saveFile } from '@/io/Data'
import { useGroupSortable } from './useGroupSortable'
import GroupHeader from './GroupHeader.vue'
import PilotSortableList from './PilotSortableList.vue'

const props = withDefaults(defineProps<{
  group: any
  rosterSearch?: string
  transferKey?: number
  dragModeActive?: boolean
}>(), {
  rosterSearch: '',
  transferKey: 0,
  dragModeActive: false,
})

const emit = defineEmits<{ 'pilot-transferred': [] }>()

const router = useRouter()
const mobile = useDisplay().smAndDown

const noGroup = computed(() => props.group.ID === 'no_group')

const pilots = computed<Pilot[]>(() => {
  const store = PilotStore()
  return (props.group.Pilots as any[])
    .map((pi: any) => store.getPilotByID(pi.id))
    .filter((p: any): p is Pilot => !!p && !p.SaveController.IsDeleted)
})

const filteredPilots = computed<Pilot[]>(() => {
  if (!props.rosterSearch) return pilots.value
  const s = props.rosterSearch.toLowerCase()
  return pilots.value.filter(
    (p) => p.Name.toLowerCase().includes(s) || p.Callsign.toLowerCase().includes(s)
  )
})

const profile = computed(() => UserStore().User)
const rosterView = computed<string>(() => {
  if (!profile.value || !profile.value.View) return 'list'
  return profile.value.View('roster', 'list')
})
const pilotCardType = computed<any>(() => {
  switch (rosterView.value) {
    case 'cards': return PilotCard
    default: return PilotListItem
  }
})


const rosterSearchRef = computed(() => props.rosterSearch)
const transferKeyRef = computed(() => props.transferKey)
const dragModeActiveRef = computed(() => props.dragModeActive)

const {
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
} = useGroupSortable(
  props.group,
  filteredPilots,
  rosterSearchRef,
  mobile,
  dragModeActiveRef,
  transferKeyRef,
  () => emit('pilot-transferred')
)

watch(() => props.rosterSearch, (val: string) => {
  props.group.Expanded = val ? filteredPilots.value.length > 0 : true
})

function toPilotSheet(pilotID: string) {
  router.push({ name: 'pilot_sheet_redirect', params: { pilotID } })
}
async function transferPilot(pilot: Pilot) {
  await PilotGroupStore().TransferPilot(pilot, props.group.ID)
}
function deleteGroup(deletePilots: boolean) {
  PilotGroupStore().DeleteGroup(props.group as PilotGroup, deletePilots)
}
function setGroupExpand() {
  props.group.Expanded = !props.group.Expanded
  PilotGroupStore().SaveGroupData()
}
function exportGroup() {
  const groupPilots = PilotStore().getPilots(props.group.ID)
  const exportObj = {
    groupData: PilotGroup.Serialize(props.group as PilotGroup),
    pilotData: groupPilots.map((x: Pilot) => Pilot.Serialize(x)),
  }
  saveFile(
    props.group.Name.toUpperCase().replace(/\W/g, '') + '.json',
    JSON.stringify(exportObj, null, 2) as any,
    'Pilot Group'
  )
}
</script>

<style scoped>
.light {
  position: absolute;
  width: 13.5px;
  height: 13.5px;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: filter 0.2s ease-in-out;
}

.top-element:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.top-element:hover .group-drag-handle {
  opacity: 1;
}
</style>
