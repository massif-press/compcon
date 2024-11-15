<template>
  <v-layout style="height: calc(100vh - 90px)">
    <v-navigation-drawer app width="350">
      <div class="heading h2 text-center">
        {{ title }}
        <slot name="tooltip" />
      </div>
      <div class="px-2">
        <v-row density="compact" no-gutters>
          <v-col class="mr-1">
            <v-autocomplete
              v-model="search"
              :placeholder="`Search ${title}`"
              :items="items"
              item-title="Name"
              item-value="Name"
              density="compact"
              hide-details
              clearable
              variant="outlined"
              prepend-inner-icon="mdi-magnify" />
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
        <v-row density="compact" no-gutters class="mt-2">
          <v-col>
            <v-select
              v-model="grouping"
              :items="groupings"
              label="Group"
              hide-details
              variant="outlined"
              class="mr-1"
              density="compact" />
          </v-col>
          <v-col>
            <v-select
              v-model="sorting"
              :items="sortings"
              label="Sort"
              hide-details
              class="ml-1"
              variant="outlined"
              density="compact" />
          </v-col>
        </v-row>
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
          :disabled="!canAddNpc"
          @open="$emit('open', $event)" />

        <div v-if="hidden" class="text-right pa-2 text-disabled">
          <i>{{ hidden }} items hidden by filter</i>
        </div>

        <div style="position: absolute; bottom: 30px; left: 8px; right: 8px">
          <v-divider class="my-1" />
          <v-btn
            color="secondary"
            size="small"
            variant="tonal"
            class="mb-1"
            prepend-icon="mdi-plus"
            :disabled="!canAddNpc"
            block
            @click="$emit('add-new')">
            Add New {{ itemType }}
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>
    <v-main>
      <div style="height: calc(100vh - 65px) !important; overflow-y: scroll; padding-bottom: 100px">
        <slot />
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

export default {
  name: 'gm-collection-view',
  components: { ItemSidebarList, Organizer, GmCollectionFilter, GmCollectionFolder },
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
  }),
  emits: ['open', 'add-new'],
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
    canAddNpc(): boolean {
      return CompendiumStore().hasNpcAccess;
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
};
</script>
