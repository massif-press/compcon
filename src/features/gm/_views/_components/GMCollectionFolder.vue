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

<script lang="ts">
import { Sortable } from 'sortablejs-vue3';
import { startDragScroll, stopDragScroll } from '@/composables/useScrollOnDrag';
import ItemCard from '../_components/GMItemCard.vue';

export default {
  name: 'GmCollectionFolder',
  components: { Sortable, ItemCard },
  props: {
    folder: { type: String, required: true },
    allFolders: { type: Array, required: true },
    filteredItems: { type: Array, required: true },
    items: { type: Array, required: true },
    itemType: { type: String, required: true },
    search: { type: String, required: true },
    view: { type: String, required: true },
    grouping: { type: String, required: true },
    sorting: { type: String, required: true },
    folderDrag: { type: Boolean, default: false },
    transferKey: { type: Number, default: 0 },
  },
  emits: ['open', 'add-new', 'set-folder-name', 'remove-folder', 'item-transferred'],
  data: () => ({
    open: true,
    deleteMenu: false,
    dropActive: false,
  }),
  computed: {
    folderItems() {
      return this.filteredItems.filter((x: any) => x.FolderController.Folder === this.folder);
    },
    sortedFolderItems() {
      return [...(this.folderItems as any[])].sort(
        (a, b) => a.FolderController.SortIndex - b.FolderController.SortIndex
      );
    },
  },
  created() {
    this.open = this.folderItems.length > 0;
  },
  methods: {
    setFolderName(name: string) {
      if (name === this.folder) return;
      if (!name || name.trim() === '') {
        return
      }
      this.$emit('set-folder-name', name);
    },
    onItemDragStart(event: any) {
      startDragScroll();
      const itemId = event.item.dataset.itemId;
      if (event.originalEvent?.dataTransfer && itemId) {
        event.originalEvent.dataTransfer.setData('text/encounter-id', itemId);
      }
    },
    onItemReorder(event: any) {
      stopDragScroll();
      if (event.from !== event.to) return;
      if (event.oldIndex === event.newIndex) return;
      const items = [...this.sortedFolderItems] as any[];
      const [moved] = items.splice(event.oldIndex, 1);
      items.splice(event.newIndex, 0, moved);
      items.forEach((item, idx) => {
        item.FolderController.SortIndex = idx;
      });
    },
    onSortableAreaDragEnter(event: DragEvent) {
      const chosen = document.querySelector('.sortable-chosen[data-item-id]') as HTMLElement | null;
      if (!chosen) return;
      const itemId = chosen.dataset.itemId;
      if ((this.sortedFolderItems as any[]).some((x: any) => x.ID === itemId)) return;
      this.dropActive = true;
    },
    onSortableAreaDragLeave(event: DragEvent) {
      const el = event.currentTarget as HTMLElement;
      if (el.contains(event.relatedTarget as Node)) return;
      this.dropActive = false;
    },
    async onItemAdded(event: any) {
      this.dropActive = false;
      const itemId = event.item.dataset.itemId;
      const item = (this.items as any[]).find((x: any) => x.ID === itemId);
      if (!item) return;
      item.FolderController.Folder = this.folder;
      this.open = true;
      await this.$nextTick();
      const items = [...this.sortedFolderItems] as any[];
      const movedIdx = items.findIndex((x: any) => x.ID === itemId);
      if (movedIdx !== -1 && movedIdx !== event.newIndex) {
        const [moved] = items.splice(movedIdx, 1);
        items.splice(Math.min(event.newIndex, items.length), 0, moved);
      }
      items.forEach((item: any, idx: number) => {
        item.FolderController.SortIndex = idx;
      });
      this.$emit('item-transferred');
    },
    onDrop(event: DragEvent) {
      this.dropActive = false;
      const id = event.dataTransfer?.getData('text/encounter-id');
      if (!id) return;
      const item = (this.items as any[]).find(x => x.ID === id);
      if (item && item.FolderController) {
        item.FolderController.Folder = this.folder;
        this.open = true;
      }
    },
  },
};
</script>
