<template>
  <v-card-text class="py-0"
    style="overflow:visible"
    :class="[rosterView.includes('card') ? 'text-center' : '', mobile ? 'px-0' : 'px-2']">
    <sortable :key="groupSortableKey"
      :list="filteredPilots"
      item-key="ID"
      :class="rosterView === 'cards' ? 'd-flex flex-wrap' : ''"
      :options="sortableOptions"
      @start="emit('start')"
      @end="emit('reorder', $event)"
      @add="emit('added', $event)">
      <template #item="{ element }">
        <div :data-pilot-id="element.ID"
          @pointerdown="mobile ? emit('pointer-down') : undefined"
          @pointerup="mobile ? emit('pointer-up') : undefined"
          @pointercancel="mobile ? emit('pointer-cancel') : undefined">
          <component :is="pilotCardType"
            :pilot="element"
            @go-to="emit('go-to', element.ID)" />
        </div>
      </template>
    </sortable>
  </v-card-text>
</template>

<script setup lang="ts">
import { Sortable } from 'sortablejs-vue3'
import { Pilot } from '@/classes/pilot/Pilot'

const props = defineProps<{
  filteredPilots: Pilot[]
  groupSortableKey: string
  sortableOptions: object
  pilotCardType: any
  rosterView: string
  mobile: boolean
}>()

const emit = defineEmits<{
  'reorder': [event: any]
  'added': [event: any]
  'start': []
  'pointer-down': []
  'pointer-up': []
  'pointer-cancel': []
  'go-to': [pilotID: string]
}>()
</script>
