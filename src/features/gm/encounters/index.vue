<template>
  <v-container>
    <v-row>
      <v-col class="heading h2">Encounters</v-col>
      <v-col cols="auto">
        <cc-modal title="organize encounters" icon="mdi-queue-first-in-last-out">
          <template #activator="{ open }">
            <cc-button size="small" color="primary" class="mx-4" @click="open">Organize</cc-button>
          </template>
          <template #default="{ close }">
            <organizer type="encounter" @exit="close" />
          </template>
        </cc-modal>
      </v-col>
    </v-row>
    <v-card flat tile>
      <v-toolbar class="px-2 rounded-b-0">
        <v-row dense align="center">
          <v-col cols="auto"></v-col>
          <v-col class="pl-4">
            <v-autocomplete
              v-model="search"
              :placeholder="`Search Encounters`"
              :items="items"
              item-title="Name"
              item-value="Name"
              density="compact"
              hide-details
              clearable
              tile
              prepend-inner-icon="mdi-magnify" />
          </v-col>
          <v-col cols="3" class="ml-auto">
            <v-select
              v-model="grouping"
              :items="groupings"
              label="Group By"
              hide-details
              tile
              variant="outlined"
              density="compact" />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="sorting"
              :items="sortings"
              label="Sort By"
              hide-details
              tile
              variant="outlined"
              density="compact" />
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

      <gm-collection-folder
        v-for="folder in folders"
        :folder="folder"
        :filteredItems="filteredItems"
        :items="items"
        item-type="Encounter"
        :search="search"
        :view="view"
        :grouping="grouping"
        :sorting="sorting"
        :all-folders="folders"
        @set-folder-name="setFolderName(folder, $event)"
        @remove-folder="removeFolder($event)"
        @open="openItem($event)" />

      <v-card
        v-if="filteredItems.filter((x: any) => !x.FolderController?.Folder).length > 0"
        flat
        tile>
        <v-toolbar density="compact" style="height: 40px" class="mt-n2">
          <v-btn size="x-small" icon @click="showNoFolder = !showNoFolder">
            <v-icon size="30" icon="mdi-menu-right" :class="showNoFolder ? 'mdi-rotate-90' : ''" />
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
              item-type="Encounter"
              :items="filteredItems.filter((x: any) => !x.FolderController?.Folder)"
              :search="search"
              :list="view === 'list'"
              :grouping="grouping"
              :sorting="sorting"
              :all-folders="folders"
              @open="openItem($event)" />
          </v-card-text>
        </v-expand-transition>
      </v-card>

      <div v-if="hidden" class="text-right pa-2 text-disabled">
        <i>{{ hidden }} items hidden by filter</i>
      </div>
    </v-card>

    <v-dialog v-model="editDialog" fullscreen>
      <encounter-editor :item="selected" @exit="editDialog = false" />
    </v-dialog>

    <v-footer fixed>
      <cc-button
        size="small"
        prepend-icon="mdi-folder-multiple-plus"
        color="primary"
        @click="addFolder">
        Add Folder
      </cc-button>
      <v-spacer />
      <cc-modal title="import data" icon="mdi-download" ref="import" no-confirm>
        <template #activator="{ open }">
          <cc-button
            size="small"
            color="primary"
            prepend-icon="mdi-download"
            class="mx-4"
            @click="open">
            Import
          </cc-button>
        </template>
        <template #default="{ close }">
          <importer @complete="close" />
        </template>
      </cc-modal>

      <share-code-dialog import-type="encounter" />
      <cc-button size="small" class="mx-4" prepend-icon="mdi-plus" color="accent" @click="addNew()">
        Add New Encounter
      </cc-button>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import ItemCardGrid from '../_views/ItemCardGrid.vue';
import GmCollectionFilter from '../_views/_components/GMCollectionFilter.vue';
import GmCollectionFolder from '../_views/_components/GMCollectionFolder.vue';
import { EncounterStore, UserStore } from '@/stores';
import { Encounter } from '@/classes/encounter/Encounter';
import EncounterEditor from './_components/EncounterEditor.vue';
import Organizer from '../_components/Organizer.vue';
import Importer from '../_components/NpcImporter.vue';
import ShareCodeDialog from '@/features/main_menu/_components/account/_components/data_viewer/shareCodeDialog.vue';

export default {
  name: 'gm-encounter-view',
  components: {
    ItemCardGrid,
    Organizer,
    GmCollectionFilter,
    GmCollectionFolder,
    EncounterEditor,
    Importer,
    ShareCodeDialog,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
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
    selected: null as any,
    editDialog: false,
  }),
  emits: ['open', 'add-new'],
  created() {
    const user = UserStore().User;
    if (!user || !user.View) return;
    this.view = user.View('encountersView', 'list');
    this.sorting = user.View('encountersSorting', 'Name');
    this.grouping = user.View('encountersGrouping', 'None');
    this.filters = user.View('encountersFilters', []) as any[];
    this.hideFolders = user.View('encountersHideFolders', false);

    if (this.id) {
      const item = EncounterStore().getEncounterByID(this.id);
      if (item) {
        this.selected = item;
        this.editDialog = true;
      }
    }
  },
  watch: {
    view(val) {
      if (!val) return;
      UserStore().User.SetView('encountersView', val);
    },
    sorting(val) {
      if (!val) return;
      UserStore().User.SetView('encountersSorting', val);
    },
    grouping(val) {
      if (!val) return;
      UserStore().User.SetView('encountersGrouping', val);
    },
    filters(val) {
      UserStore().User.SetView('encountersFilters', val);
    },
    hideFolders(val) {
      UserStore().User.SetView('encountersHideFolders', val);
    },
  },
  computed: {
    folders(): string[] {
      return EncounterStore().getFolders;
    },
    items(): any[] {
      return EncounterStore().Encounters.filter((x) => !x.SaveController.IsDeleted);
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
    groupings() {
      const allLabelTitles = new Set(
        EncounterStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseGroupings = ['Sitrep', 'Environment'];

      return ['None', ...baseGroupings, ...allLabelTitles];
    },
    sortings() {
      const allLabelTitles = new Set(
        EncounterStore()
          .getAllLabels.filter((x: any) => x.title.length > 0)
          .map((x: any) => x.title)
      );

      const baseSortings = ['Name', 'Sitrep', 'Environment', 'Created', 'Updated'];

      return [...baseSortings, ...allLabelTitles];
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
      EncounterStore().AddFolder(folderName);
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
      EncounterStore().EditFolder({ old, newName });
    },
    removeFolder(folder: string) {
      EncounterStore().RemoveFolder(folder);
    },
    openItem(item) {
      this.selected = item;
      this.editDialog = true;
    },
    addNew() {
      const e = new Encounter();
      EncounterStore().AddEncounter(e);
      this.selected = e;
      this.editDialog = true;
    },
  },
};
</script>
