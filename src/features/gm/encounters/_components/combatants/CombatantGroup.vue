<template>
  <div v-if="list.length > 0"
    :class="isFirst ? '' : 'mt-3'">
    <v-row dense
      align="center">
      <v-col cols="auto"
        style="width: 30px"><v-divider /></v-col>
      <v-col cols="auto"
        class="text-caption text-disabled">{{ label }}</v-col>
      <v-col><v-divider /></v-col>
    </v-row>
  </div>
  <sortable :key="`${type}-${transferKey}`"
    :list="list"
    item-key="instanceId"
    :options="{ animation: 200, handle: '.combatant-drag-handle', scroll: false, group: { name: 'combatants', pull: true, put: true } }"
    @start="$emit('drag-start', $event)"
    @end="$emit('reorder', type, $event)"
    @add="$emit('add', type, $event)">
    <template #item="{ element, index }">
      <div :data-combatant-id="element.id"
        :style="`display: flex; ${isFirst ? '' : 'align-items: center; '}gap: 4px`">
        <v-icon class="combatant-drag-handle"
          icon="mdi-drag"
          :size="isFirst ? '24' : '20'"
          style="cursor: move; opacity: 0.5"
          @click.stop />
        <div style="flex: 1; min-width: 0">
          <combatant-list-item :item="element"
            :odd="index % 2 === 0"
            :readonly="readonly"
            @open="$emit('open', $event)"
            @remove="$emit('remove', element.id)" />
        </div>
      </div>
    </template>
  </sortable>
</template>

<script setup lang="ts">
import { Sortable } from 'sortablejs-vue3'
import type { CombatantData } from '@/classes/encounter/Encounter'
import CombatantListItem from './listItemContent/CombatantListItem.vue'

defineProps<{
  type: string
  list: CombatantData[]
  label: string
  transferKey: number
  readonly: boolean
  isFirst?: boolean
}>()

defineEmits<{
  'drag-start': [event: any]
  'reorder': [type: string, event: any]
  'add': [type: string, event: any]
  'open': [item: any]
  'remove': [id: string]
}>()
</script>
