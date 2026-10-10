<template>
  <v-list
    class="mb-4 mt-n2"
    slim
    density="compact"
    @dragenter.prevent="onItemDragEnter"
    @dragleave="onItemDragLeave"
  >
    <v-row
      dense
      align="center"
      style="cursor: pointer"
      :class="dropActive ? 'bg-success' : ''"
      @click="open = !open"
      @dragover.prevent
      @drop="onDrop"
    >
      <v-col
        v-if="drag && folder"
        cols="auto"
      >
        <v-icon
          class="folder-sort-handle"
          icon="mdi-drag"
          size="18"
          :aria-label="$t('gm.a11y.dragToReorder')"
          style="cursor: move; opacity: 0.5"
          @click.stop
        />
      </v-col>
      <v-col
        v-else
        cols="auto"
        style="width: 2vw"
      >
        <v-divider />
      </v-col>
      <v-col
        cols="auto"
        class="heading h3"
      >
        {{ name === '0' ? $t('common.all') : name }}
        <span class="text-caption text-disabled">({{ rows.length }}/{{ total }})</span>
      </v-col>
      <v-col>
        <v-divider />
      </v-col>
      <v-col cols="auto">
        <v-icon
          size="small"
          :icon="open ? 'mdi-chevron-down' : 'mdi-chevron-right'"
        />
      </v-col>
    </v-row>
    <div
      v-if="!total"
      class="text-center text-disabled"
    >
      <i>{{ $t('common.noData') }}</i>
    </div>
    <v-expand-transition>
      <div v-show="open">
        <sortable
          :key="`${name}-${drag}-${manual}-${transferKey}`"
          :list="rows"
          item-key="ID"
          :options="{
            animation: 200,
            easing: 'cubic-bezier(1, 0, 0, 1)',
            handle: '.folder-drag-handle',
            group: { name: 'gm-folder-items', pull: true, put: true },
            sort: manual,
            disabled: !drag,
            ...drawerAutoScroll,
          }"
          @end="onItemReorder"
          @add="onItemAdded"
        >
          <template #item="{ element }">
            <div :data-item-id="(element as any).ID">
              <gm-item-list-element
                :item="element as any"
                :grouping="grouping"
                :sorting="sorting"
                :selected-id="selectedId"
                :drag-handle="drag"
                @open="$emit('open', element)"
              />
            </div>
          </template>
        </sortable>
      </div>
    </v-expand-transition>
  </v-list>
</template>

<script setup lang="ts">
  import { Sortable } from 'sortablejs-vue3'
  import { useFolderDrop, drawerAutoScroll } from '@/composables/useFolderDrop'
  import GmItemListElement from './GMItemListElement.vue'

  const props = defineProps<{
    name: string
    folder: string
    rows: any[]
    total: number
    unfilteredItems: any[]
    drag: boolean
    manual: boolean
    transferKey: number
    grouping?: string
    sorting?: string
    selectedId?: string
  }>()

  const emit = defineEmits<{
    open: [payload: any]
    'item-transferred': []
  }>()

  const { open, dropActive, onItemReorder, onItemAdded, onItemDragEnter, onItemDragLeave, onDrop } =
    useFolderDrop({
      folder: () => props.folder,
      droppableItems: () => (props.drag ? props.unfilteredItems : []),
      displayedRows: () => props.rows,
      rowsDisplayedInSavedOrder: () => props.manual,
      transferred: () => emit('item-transferred'),
    })
</script>
