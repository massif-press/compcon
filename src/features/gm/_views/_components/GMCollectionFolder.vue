<template>
  <v-card class="my-1"
    tile>
    <v-toolbar density="compact"
      :color="dropActive ? 'success' : 'primary'"
      style="height: 40px"
      class="mt-n3"
      tile
      @dragover.prevent="dropActive = true"
      @dragleave="dropActive = false"
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
          @set="$emit('set-folder-name', $event)">
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
      <v-card-text v-if="open">
        <item-card-grid :item-type="itemType"
          :items="folderItems"
          :search="search"
          list
          :grouping="grouping"
          :sorting="sorting"
          :all-folders="allFolders"
          :folder-drag="folderDrag"
          @open="$emit('open', $event)" />
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import ItemCardGrid from '../ItemCardGrid.vue';

export default {
  name: 'GmCollectionFolder',
  components: { ItemCardGrid },
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
  },
  emits: ['open', 'add-new', 'set-folder-name', 'remove-folder'],
  data: () => ({
    open: true,
    deleteMenu: false,
    dropActive: false,
  }),
  computed: {
    folderItems() {
      return this.filteredItems.filter((x: any) => x.FolderController.Folder === this.folder);
    },
  },
  created() {
    this.open = this.folderItems.length > 0;
  },
  methods: {
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
