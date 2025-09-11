<template>
  <v-layout :style="`height: calc(100vh - ${mobile ? '42px' : '68px'})`">
    <div
      style="position: absolute; z-index: 999"
      :style="`left: ${showNav ? (mobile ? '615' : '354') : '3'}px; top: 6px`">
      <cc-button
        :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
        size="small"
        color="primary"
        @click="(showNav as any) = !showNav" />
    </div>
    <v-navigation-drawer v-model="showNav" app :width="mobile ? 600 : 350">
      <div class="mt-2">
        <slot name="tooltip" />
      </div>
      <div class="px-2">
        <v-row density="compact" no-gutters align="center">
          <v-col class="mr-1">
            <cc-text-field
              type="autocomplete"
              v-model="search"
              :placeholder="`Search ${title}`"
              :items="items"
              item-title="Name"
              item-value="Name"
              variant="outlined"
              color="primary"
              hide-details
              clearable
              icon="mdi-magnify" />
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

        <v-row density="compact" no-gutters class="mt-5">
          <v-col>
            <cc-select
              v-model="grouping"
              :items="groupings"
              small
              chip-variant="text"
              label="Group"
              class="mr-1" />
          </v-col>
          <v-col>
            <cc-select
              v-model="sorting"
              :items="sortings"
              small
              chip-variant="text"
              label="Sort"
              class="ml-1" />
          </v-col>
        </v-row>
        <v-btn
          prepend-icon="mdi-queue-first-in-last-out"
          color="primary"
          block
          flat
          tile
          size="x-small"
          class="mt-1"
          @click="$emit('open-organizer')">
          ORGANIZE NPCS
        </v-btn>
        <v-divider class="my-1" />

        <item-sidebar-list
          :item-type="itemType"
          :items="filteredItems"
          :search="search"
          :big="view === 'big-grid'"
          :list="view === 'list'"
          :table="view === 'table'"
          :grouping="grouping"
          :sorting="sorting"
          :selected-id="selected?.ID || ''"
          :all-folders="folders"
          :disabled="!canAdd"
          @open="$emit('open', $event)" />

        <div v-if="hidden" class="text-right pa-2 text-disabled">
          <i>{{ hidden }} items hidden by filter</i>
        </div>

        <div class="my-12" />

        <div style="position: absolute; bottom: 4px; left: 4px; right: 4px">
          <v-menu>
            <template #activator="{ props }">
              <cc-button
                color="success"
                size="small"
                prepend-icon="mdi-plus"
                :disabled="!canAdd"
                block
                @click="props.onClick($event)">
                Add {{ itemType }}
              </cc-button>
            </template>
            <template #default="{ isActive }">
              <v-card class="pa-1" border>
                <cc-button
                  block
                  prepend-icon="mdi-plus"
                  size="small"
                  color="primary"
                  @click="
                    $emit('add-new');
                    isActive.value = false;
                  ">
                  Create New {{ itemType }}
                </cc-button>
                <div class="my-1" />
                <cc-button
                  block
                  prepend-icon="mdi-download"
                  size="small"
                  color="primary"
                  @click="
                    $emit('open-import');
                    isActive.value = false;
                  ">
                  File Import
                </cc-button>
                <div class="my-1" />
                <share-code-dialog import-type="npc" block-btn />
              </v-card>
            </template>
          </v-menu>
        </div>
      </div>
    </v-navigation-drawer>
    <v-main>
      <div
        style="
          height: calc(100vh - 65px) !important;
          overflow-y: scroll;
          padding-bottom: 100px;
          overflow-x: hidden;
        ">
        <div class="mx-auto pt-2 px-6" style="max-width: 1400px">
          <slot />
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import ItemSidebarList from './ItemSidebarList.vue';
import Organizer from '../_components/Organizer.vue';
import GmCollectionFilter from './_components/GMCollectionFilter.vue';
import GmCollectionFolder from './_components/GMCollectionFolder.vue';
import { NpcStore } from '../store/npc_store';
import { NarrativeStore } from '../store/narrative_store';
import { CompendiumStore, UserStore } from '@/stores';
import ShareCodeDialog from '@/features/main_menu/_components/account/_components/data_viewer/shareCodeDialog.vue';
import { Npc } from '@/classes/npc/Npc';

export default {
  name: 'gm-collection-view',
  components: {
    ItemSidebarList,
    Organizer,
    GmCollectionFilter,
    GmCollectionFolder,
    ShareCodeDialog,
  },
  props: {
    items: { type: Array, required: true },
    itemType: { type: String, required: true },
    title: { type: String, required: true },
    groupings: { type: Array, required: true, default: ['Folder'] },
    sortings: { type: Array, required: true, default: ['Name'] },
    selected: { type: Object, required: false },
  },
  data: () => ({
    search: '',
    view: 'list',
    sorting: 'Name',
    grouping: 'Folder',
    filters: [] as any[],
    openFolders: [] as string[],
    showNoFolder: true,
    showNav: true,
  }),
  emits: ['open', 'add-new', 'open-import', 'open-organizer'],
  created() {
    const user = UserStore().User;
    if (!user || !user.View) return;
    this.sorting = user.View(this.itemType.toLowerCase() + 'Sorting', 'Name');
    this.grouping = user.View(this.itemType.toLowerCase() + 'Grouping', 'Folder');
    this.filters = user.View(this.itemType.toLowerCase() + 'Filters', []) as any[];
  },
  watch: {
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
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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

    canAdd(): boolean {
      console.log(this.itemType);
      if (this.itemType.toLowerCase() === 'npc') {
        return CompendiumStore().hasNpcAccess;
      } else if (this.itemType.toLowerCase() === 'eidolon') {
        console.log(CompendiumStore().hasEidolonAccess);
        return CompendiumStore().hasEidolonAccess;
      }
      return true;
    },
    folders(): string[] {
      return this.folderStore.getFolders.filter((f) =>
        this.items.some((i) => (i as Npc).FolderController.Folder === f)
      );
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
    minimize() {
      this.showNav = false;
    },
  },
};
</script>
