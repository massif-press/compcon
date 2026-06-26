<template>
  <v-card class="my-1"
    tile>
    <v-toolbar density="compact"
      :color="dropActive ? 'success' : 'primary'"
      style="height: 40px"
      class="mt-n3"
      tile
      @dragover.prevent
      @drop="onDrop">
      <v-btn size="x-small"
        icon>
        <v-icon size="30"
          icon="mdi-menu-right"
          class="mt-1"
          :class="open ? 'mdi-rotate-90' : ''"
          @click="open = !open" />
      </v-btn>
      <v-toolbar-title class="heading h3">
        <cc-short-string-editor justify="start"
          @set="setFolderName">
          {{ folder }}
        </cc-short-string-editor>
      </v-toolbar-title>
      <v-spacer />
      <div class="px-2 text-disabled text-caption">
        {{filteredItems.filter((x: any) => x.FolderController.Folder === folder).length}}
        ({{items.filter((x: any) => x.FolderController.Folder === folder).length}})
      </div>
      <v-menu v-model="deleteMenu"
        offset-y
        offset-x
        top
        left>
        <template #activator="{ props }">
          <v-btn variant="tonal"
            size="x-small"
            color="error"
            icon
            flat
            tile
            v-bind="props">
            <v-icon size="x-large"
              icon="mdi-delete" />
          </v-btn>
        </template>
        <cc-confirmation
          :content="`This will delete the '${folder}' folder. All items will be sent to the 'No Folder' group`"
          @confirm="$emit('remove-folder', folder)" />
      </v-menu>
    </v-toolbar>
    <v-expand-transition>
      <v-card-text v-if="open"
        @dragenter.prevent="onSortableAreaDragEnter"
        @dragleave="onSortableAreaDragLeave">
        <sortable :key="`${folder}-${transferKey}`"
          :list="sortedFolderItems"
          item-key="ID"
          :options="{ animation: 200, easing: 'cubic-bezier(1, 0, 0, 1)', handle: '.folder-drag-handle', group: { name: 'gm-folder-items', pull: true, put: true } }"
          @start="onItemDragStart"
          @end="onItemReorder"
          @add="onItemAdded">
          <template #item="{ element }">
            <div style="position: relative"
              :data-item-id="(element as any).ID">
              <item-card :item="(element as any)"
                list
                :grouping="grouping"
                :sorting="sorting"
                @open="$emit('open', $event)" />
            </div>
          </template>
        </sortable>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { Sortable } from 'sortablejs-vue3';
import { startDragScroll, stopDragScroll } from '@/composables/useScrollOnDrag';
import ItemCard from '../_components/GMItemCard.vue';

const props = withDefaults(defineProps<{
  folder: string
  allFolders: any[]
  filteredItems: any[]
  items: any[]
  itemType: string
  search: string
  view: string
  grouping: string
  sorting: string
  folderDrag?: boolean
  transferKey?: number
}>(), {
  folderDrag: false,
  transferKey: 0
})

const emit = defineEmits<{
  'open': [payload: any]
  'add-new': []
  'set-folder-name': [payload: any]
  'remove-folder': [payload: any]
  'item-transferred': []
}>()

const open = ref(true)
const deleteMenu = ref(false)
const dropActive = ref(false)

const folderItems = computed(() => {
      return props.filteredItems.filter((x: any) => x.FolderController.Folder === props.folder);
    })

open.value = folderItems.value.length > 0;
const sortedFolderItems = computed(() => {
      return [...(folderItems.value as any[])].sort(
        (a, b) => a.FolderController.SortIndex - b.FolderController.SortIndex
      );
    })

function setFolderName(name: string) {
      if (name === props.folder) return;
      if (!name || name.trim() === '') {
        return
      }
      emit('set-folder-name', name);
    }
function onItemDragStart(event: any) {
      startDragScroll();
      const itemId = event.item.dataset.itemId;
      if (event.originalEvent?.dataTransfer && itemId) {
        event.originalEvent.dataTransfer.setData('text/encounter-id', itemId);
      }
    }
function onItemReorder(event: any) {
      stopDragScroll();
      if (event.from !== event.to) return;
      if (event.oldIndex === event.newIndex) return;
      const items = [...sortedFolderItems.value] as any[];
      const [moved] = items.splice(event.oldIndex, 1);
      items.splice(event.newIndex, 0, moved);
      items.forEach((item, idx) => {
        item.FolderController.SortIndex = idx;
      });
    }
function onSortableAreaDragEnter(event: DragEvent) {
      const chosen = document.querySelector('.sortable-chosen[data-item-id]') as HTMLElement | null;
      if (!chosen) return;
      const itemId = chosen.dataset.itemId;
      if ((sortedFolderItems.value as any[]).some((x: any) => x.ID === itemId)) return;
      dropActive.value = true;
    }
function onSortableAreaDragLeave(event: DragEvent) {
      const el = event.currentTarget as HTMLElement;
      if (el.contains(event.relatedTarget as Node)) return;
      dropActive.value = false;
    }
async function onItemAdded(event: any) {
      dropActive.value = false;
      const itemId = event.item.dataset.itemId;
      const item = (props.items as any[]).find((x: any) => x.ID === itemId);
      if (!item) return;
      item.FolderController.Folder = props.folder;
      open.value = true;
      await nextTick();
      const items = [...sortedFolderItems.value] as any[];
      const movedIdx = items.findIndex((x: any) => x.ID === itemId);
      if (movedIdx !== -1 && movedIdx !== event.newIndex) {
        const [moved] = items.splice(movedIdx, 1);
        items.splice(Math.min(event.newIndex, items.length), 0, moved);
      }
      items.forEach((item: any, idx: number) => {
        item.FolderController.SortIndex = idx;
      });
      emit('item-transferred');
    }
function onDrop(event: DragEvent) {
      dropActive.value = false;
      const id = event.dataTransfer?.getData('text/encounter-id');
      if (!id) return;
      const item = (props.items as any[]).find(x => x.ID === id);
      if (item && item.FolderController) {
        item.FolderController.Folder = props.folder;
        open.value = true;
      }
    }
</script>
