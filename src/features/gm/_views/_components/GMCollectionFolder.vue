<template>
  <v-card class="my-1">
    <v-toolbar density="compact" color="primary" style="height: 40px" class="mt-n3">
      <v-btn size="x-small" icon>
        <v-icon
          size="30"
          icon="mdi-menu-right"
          class="mt-1"
          :class="open ? 'mdi-rotate-90' : ''"
          @click="open = !open" />
      </v-btn>
      <v-toolbar-title class="heading h3">
        <cc-short-string-editor justify="start" @set="$emit('set-folder-name', $event)">
          {{ folder }}
        </cc-short-string-editor>
      </v-toolbar-title>
      <v-spacer />
      <div class="px-2 text-disabled text-caption">
        {{ filteredItems.filter((x: any) => x.FolderController.Folder === folder).length }}
        ({{ items.filter((x: any) => x.FolderController.Folder === folder).length }})
      </div>
      <v-menu v-model="deleteMenu" offset-y offset-x top left>
        <template #activator="{ props }">
          <v-btn
            icon
            variant="tonal"
            size="small"
            color="error"
            class="mx-1 fade-select"
            v-bind="props">
            <v-icon size="20" icon="mdi-delete" />
          </v-btn>
        </template>
        <cc-confirmation
          :content="`This will delete the '${folder}' folder. All items will be sent to the 'No Folder' group`"
          @confirm="$emit('remove-folder', folder)" />
      </v-menu>
    </v-toolbar>
    <v-expand-transition>
      <v-card-text v-if="open">
        <item-card-grid
          :item-type="itemType"
          :items="folderItems"
          :search="search"
          :big="view === 'big-grid'"
          :list="view === 'list'"
          :table="view === 'table'"
          :grouping="grouping"
          :sorting="sorting"
          :all-folders="allFolders"
          @open="$emit('open', $event)" />
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import ItemCardGrid from '../ItemCardGrid.vue';

export default {
  name: 'gm-collection-folder',
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
  },
  data: () => ({
    open: true,
    deleteMenu: false,
  }),
  created() {
    this.open = this.folderItems.length > 0;
  },
  computed: {
    folderItems() {
      return this.filteredItems.filter((x: any) => x.FolderController.Folder === this.folder);
    },
  },
  emits: ['open', 'add-new', 'set-folder-name', 'remove-folder'],
};
</script>
