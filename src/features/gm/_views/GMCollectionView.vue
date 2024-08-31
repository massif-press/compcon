<template>
  <v-dialog v-model="dialog" fullscreen>
    <v-card flat>
      <slot />
    </v-card>
  </v-dialog>
  <v-container>
    <v-card variant="tonal">
      <v-toolbar class="px-2 rounded-b-0">
        <v-row dense align="center">
          <v-col cols="auto">
            <div class="heading h2">
              {{ title }}
              <slot name="tooltip" />
            </div>
          </v-col>
          <v-col class="pl-4">
            <v-autocomplete
              v-model="search"
              :placeholder="`Search ${title}`"
              :items="items"
              item-title="Name"
              item-value="Name"
              density="compact"
              hide-details
              clearable
              prepend-icon="mdi-magnify" />
          </v-col>
          <v-col cols="3" class="ml-auto">
            <v-select
              v-model="grouping"
              :items="groupings"
              label="Group By"
              hide-details
              variant="outlined"
              density="compact"
              :disabled="view === 'table'" />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="sorting"
              :items="sortings"
              label="Sort By"
              hide-details
              variant="outlined"
              density="compact"
              :disabled="view === 'table'" />
          </v-col>
          <v-col cols="auto">
            <gm-collection-filter
              :items="items"
              :filters="filters"
              @add-filter="filters.push($event)"
              @remove-filter="filters.splice(filters.indexOf($event), 1)"
              @set-filters="filters = $event" />
          </v-col>
        </v-row>
      </v-toolbar>
      <v-row justify="space-between">
        <v-col cols="auto">
          <v-btn-toggle
            v-model="view"
            density="compact"
            mandatory
            tile
            class="rounded-t-0 rounded-s-0">
            <v-btn value="list">
              <v-icon color="accent">mdi-view-list</v-icon>
            </v-btn>
            <v-btn value="big-grid">
              <v-icon color="accent">mdi-view-grid</v-icon>
            </v-btn>
            <v-btn value="grid">
              <v-icon color="accent">mdi-grid</v-icon>
            </v-btn>
            <v-btn value="table">
              <v-icon color="accent">mdi-table</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn-toggle density="compact" tile class="rounded-t-0 rounded-e-0">
            <v-btn v-model="hideFolders" @click="hideFolders = !hideFolders">
              <v-icon
                color="accent"
                :icon="!hideFolders ? 'mdi-folder-eye-outline' : 'mdi-folder-off-outline'" />
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-card-text v-if="!folders.length || hideFolders">
        <item-card-grid
          :item-type="itemType"
          :items="filteredItems"
          :search="search"
          :big="view === 'big-grid'"
          :list="view === 'list'"
          :table="view === 'table'"
          :grouping="grouping"
          :sorting="sorting"
          :all-folders="folders"
          @open="$emit('open', $event)" />
      </v-card-text>
      <v-card-text v-else>
        <gm-collection-folder
          v-for="folder in folders"
          :folder="folder"
          :filteredItems="filteredItems"
          :items="items"
          :itemType="itemType"
          :search="search"
          :view="view"
          :grouping="grouping"
          :sorting="sorting"
          :all-folders="folders"
          @set-folder-name="setFolderName(folder, $event)"
          @remove-folder="removeFolder($event)"
          @open="$emit('open', $event)" />

        <v-card v-if="filteredItems.filter((x: any) => !x.FolderController?.Folder).length > 0">
          <v-toolbar density="compact" style="height: 40px" class="mt-n2">
            <v-btn size="x-small" icon @click="showNoFolder = !showNoFolder">
              <v-icon
                size="30"
                icon="mdi-menu-right"
                :class="showNoFolder ? 'mdi-rotate-90' : ''" />
            </v-btn>
            <v-toolbar-title class="heading h3">No Folder</v-toolbar-title>
            <v-spacer />
            <div class="px-2 text-disabled text-caption">
              {{ filteredItems.filter((x: any) => !x.FolderController?.Folder).length }}
              ({{ items.filter((x: any) => !x.FolderController?.Folder).length }})
            </div>
          </v-toolbar>
          <v-expand-transition>
            <v-card-text v-if="showNoFolder">
              <item-card-grid
                :item-type="itemType"
                :items="filteredItems.filter((x: any) => !x.FolderController?.Folder)"
                :search="search"
                :big="view === 'big-grid'"
                :list="view === 'list'"
                :table="view === 'table'"
                :grouping="grouping"
                :sorting="sorting"
                :all-folders="folders"
                @open="$emit('open', $event)" />
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </v-card-text>

      <div v-if="hidden" class="text-right pa-2 text-disabled">
        <i>{{ hidden }} items hidden by filter</i>
      </div>
    </v-card>

    <v-footer fixed>
      <v-btn
        :value="true"
        prepend-icon="mdi-folder-multiple-plus"
        variant="tonal"
        color="accent"
        @click="addFolder">
        Add Folder
      </v-btn>
      <v-spacer />
      <v-btn color="secondary" @click="$emit('add-new')">
        <v-icon size="large" start icon="mdi-plus" />
        Add New {{ itemType }}
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import ItemCardGrid from '../_views/ItemCardGrid.vue';
import Organizer from '../_components/Organizer.vue';
import GmCollectionFilter from './_components/GMCollectionFilter.vue';
import GmCollectionFolder from './_components/GMCollectionFolder.vue';
import { NpcStore } from '../store/npc_store';
import { NarrativeStore } from '../store/narrative_store';
import { UserStore } from '@/stores';

export default {
  name: 'gm-collection-view',
  components: { ItemCardGrid, Organizer, GmCollectionFilter, GmCollectionFolder },
  props: {
    items: { type: Array, required: true },
    itemType: { type: String, required: true },
    title: { type: String, required: true },
    groupings: { type: Array, required: true, default: ['None'] },
    sortings: { type: Array, required: true, default: ['Name'] },
  },
  data: () => ({
    search: '',
    view: 'list',
    sorting: 'Name',
    grouping: 'None',
    filters: [] as any[],
    openFolders: [] as string[],
    showNoFolder: true,
    hideFolders: false,
    dialog: false,
  }),
  emits: ['open', 'add-new'],
  created() {
    const user = UserStore().User;
    if (!user || !user.View) return;
    this.view = user.View(this.itemType.toLowerCase() + 'View', 'list');
    this.sorting = user.View(this.itemType.toLowerCase() + 'Sorting', 'Name');
    this.grouping = user.View(this.itemType.toLowerCase() + 'Grouping', 'None');
    this.filters = user.View(this.itemType.toLowerCase() + 'Filters', []) as any[];
    this.hideFolders = user.View(this.itemType.toLowerCase() + 'HideFolders', false);
  },
  watch: {
    view(val) {
      if (!val) return;
      UserStore().User.SetView(this.itemType.toLowerCase() + 'View', val);
    },
    sorting(val) {
      if (!val) return;
      UserStore().User.SetView(this.itemType.toLowerCase() + 'Sorting', val);
    },
    grouping(val) {
      if (!val) return;
      UserStore().User.SetView(this.itemType.toLowerCase() + 'Grouping', val);
    },
    filters(val) {
      UserStore().User.SetView(this.itemType.toLowerCase() + 'Filters', val);
    },
    hideFolders(val) {
      UserStore().User.SetView(this.itemType.toLowerCase() + 'HideFolders', val);
    },
  },
  computed: {
    folderStore(): any {
      switch (this.itemType.toLowerCase()) {
        case 'npc':
        case 'unit':
        case 'doodad':
        case 'eidolon':
          return NpcStore();
        default:
          return NarrativeStore();
      }
    },
    folders(): string[] {
      return this.folderStore.getFolders;
    },
    filteredItems() {
      let out = this.items;

      if (this.filters.length) {
        out = out.filter((x: any) => {
          if (x.StatController) {
            const stats = x.StatController.DisplayKeys.map((x: any) => x.title);
            if (this.filters.some((f) => stats.some((s) => s === f))) return false;
          }
          if (x.NarrativeController) {
            const labels = x.NarrativeController.Labels.map((x: any) => x.title);
            if (this.filters.some((f) => labels.some((s) => s === f))) return false;
          }
          return true;
        });
      }
      return out;
    },
    hidden() {
      return this.items.length - this.filteredItems.length;
    },
  },
  methods: {
    addFolder() {
      let folderName = 'New Folder';
      if (this.folders.some((x) => x === folderName)) {
        let i = 1;
        while (this.folders.some((x) => x === `${folderName} ${i}`)) i++;
        folderName = `${folderName} ${i}`;
      }
      this.folderStore.AddFolder(folderName);
      this.hideFolders = false;
    },
    toggleFolder(folder: string) {
      if (this.openFolders.includes(folder)) {
        this.openFolders.splice(this.openFolders.indexOf(folder), 1);
      } else {
        this.openFolders.push(folder);
      }
    },
    setFolderName(old: string, newName: string) {
      this.folderStore.EditFolder({ old, newName });
    },
    removeFolder(folder: string) {
      this.folderStore.RemoveFolder(folder);
    },
  },
};
</script>
