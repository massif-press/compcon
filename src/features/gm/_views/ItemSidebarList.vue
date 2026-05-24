<template>
  <v-list v-for="key in Object.keys(groupings)"
    :key="key"
    class="mb-4 mt-n2"
    slim
    density="compact">
    <v-row dense
      align="center"
      style="cursor: pointer"
      @click="toggleCollapsed(key)">
      <v-col cols="auto"
        style="width: 2vw"><v-divider /></v-col>
      <v-col cols="auto"
        class="heading h3">
        {{ key === '0' ? 'All' : key }}
        <span class="text-caption text-disabled">
          ({{ groupedItems(groupings[key]).length }}/{{ items.length }})
        </span>
      </v-col>
      <v-col>
        <v-divider />
      </v-col>
      <v-col cols="auto">
        <v-icon size="small">{{ collapsed.includes(key) ? 'mdi-chevron-right' : 'mdi-chevron-down'
          }}</v-icon>
      </v-col>
    </v-row>
    <div v-if="!items.length"
      class="text-center text-disabled"><i>No Data</i></div>
    <v-expand-transition>
      <div v-show="!collapsed.includes(key)">
        <gm-item-list-element v-for="item in groupedItems(groupings[key])"
          :key="(item as any).ID"
          :item="<any>item"
          :grouping="grouping"
          :sorting="sorting"
          :selected-id="selectedId"
          @open="$emit('open', item)" />
      </div>
    </v-expand-transition>
  </v-list>
</template>

<script lang="ts">
import { computeItemGroupings } from '@/composables/useItemGrouping';
import GmItemListElement from './_components/GMItemListElement.vue';
import * as _ from 'lodash-es';

export default {
  name: 'ItemSidebarList',
  components: { GmItemListElement },
  props: {
    itemType: { type: String, required: true },
    items: { type: Array, required: true },
    selectedId: { type: String, required: false },
    search: { type: String, required: false, default: '' },
    big: { type: Boolean },
    list: { type: Boolean },
    table: { type: Boolean },
    grouping: { type: String, required: false, default: 'Folder' },
    sorting: { type: String, required: false, default: 'Name' },
    sortDir: { type: String, required: false, default: 'asc' },
    allFolders: { type: Array, required: false, default: () => [] },
    disabled: { type: Boolean, required: false, default: false },
  },
  emits: ['open', 'add-new'],
  data: () => ({
    collapsed: [] as string[],
  }),
  computed: {
    groupings() {
      return computeItemGroupings(this.items as any[], this.grouping, this.allFolders as string[]);
    },
    searchedItems() {
      if (!this.search) return this.sort(this.items);
      return this.sort(this.items.filter((x: any) => (x as any).Name.toLowerCase().includes(this.search?.toLowerCase() || '')));
    },
  },
  methods: {
    toggleCollapsed(key: string) {
      const i = this.collapsed.indexOf(key)
      if (i === -1) this.collapsed.push(key)
      else this.collapsed.splice(i, 1)
    },
    groupedItems(group) {
      if (this.grouping === 'None') return this.sort(this.searchedItems);
      return this.sort(group.filter((x: any) => (x as any).Name.toLowerCase().includes(this.search?.toLowerCase() || '')));
    },
    sort(items) {
      return _.orderBy(items, (x: any) => {
        if (this.sorting === 'Sitrep') return x.Sitrep.Name;
        if (this.sorting === 'Environment') return x.Environment.Name;

        if (x[this.sorting]) return x[this.sorting];

        if (x.StatController) {
          const dk = x.StatController.DisplayKeys.find(
            (k) => k.title === this.sorting || k.key === this.sorting
          );
          if (dk) return x.StatController.getMax(dk.key) ?? 0;
        }
        if (x.NarrativeController && x.NarrativeController.LabelDictionary[this.sorting])
          return x.NarrativeController.LabelDictionary[this.sorting];
        if (x.NpcClassController) {
          if (this.sorting === 'Role') return x.NpcClassController.Class?.Role ?? '';
          if (this.sorting === 'Tier') return x.NpcClassController.Tier ?? 0;
          if (this.sorting === 'Tag') return x.Tag ?? '';
        }
      }, this.sortDir);
    },
  },
};
</script>
