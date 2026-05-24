<template>
  <gm-item-table v-if="table"
    :item-type="itemType"
    :items="searchedItems"
    :grouping="grouping"
    :sorting="sorting"
    :sort-dir="sortDir"
    @open="$emit('open', $event)" />
  <div v-else>
    <div v-for="key in Object.keys(groupings)"
      :key="key"
      class="mb-4 mt-n2">
      <v-row dense
        align="center">
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
      </v-row>
      <div v-if="!items.length"
        class="text-center text-disabled"><i>No Data</i></div>
      <v-row v-else
        dense>
        <v-col v-for="(item, i) in groupedItems(groupings[key])"
          :key="(item as any).ID"
          :cols="list ? 12 : big ? 3 : 2"
          style="position: relative"
          :draggable="folderDrag"
          @dragstart="folderDrag ? onDragStart($event, item) : undefined">
          <item-card :item="<any>item"
            :big="big"
            :odd="i % 2 > 0"
            :list="list"
            :grouping="grouping"
            :sorting="sorting"
            @open="$emit('open', $event)" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { computeItemGroupings } from '@/composables/useItemGrouping';
import ItemCard from './_components/GMItemCard.vue';
import GmItemTable from './GMItemTable.vue';
import * as _ from 'lodash-es';

export default {
  name: 'ItemCardGrid',
  components: { ItemCard, GmItemTable },
  props: {
    itemType: { type: String, required: true },
    items: { type: Array, required: true },
    search: { type: String, required: false, default: '' },
    big: { type: Boolean },
    list: { type: Boolean },
    table: { type: Boolean },
    grouping: { type: String, required: false, default: 'None' },
    sorting: { type: String, required: false, default: 'Name' },
    sortDir: { type: String, required: false, default: 'asc' },
    allFolders: { type: Array, required: false, default: () => [] },
    folderDrag: { type: Boolean, default: false },
  },
  computed: {
    groupings() {
      return computeItemGroupings(this.items as any[], this.grouping, this.allFolders as string[]);
    },
    searchedItems() {
      if (!this.search) return this.sort(this.items);
      return this.sort(this.items.filter((x: any) => (x as any).Name.toLowerCase().includes(this.search.toLowerCase())));
    },
  },
  methods: {
    onDragStart(event: DragEvent, item: any) {
      event.dataTransfer!.setData('text/encounter-id', (item as any).ID);
      event.dataTransfer!.effectAllowed = 'move';
    },
    groupedItems(group) {
      if (this.grouping === 'None') return this.sort(this.searchedItems);
      return group.filter((x: any) => (x as any).Name.toLowerCase().includes(this.search.toLowerCase()));
    },
    sort(items) {
      return _.orderBy(items, (x: any) => {
        if (this.sorting === 'Sitrep') return x.Sitrep.Name;
        if (this.sorting === 'Environment') return x.Environment.Name;

        if (x[this.sorting]) return x[this.sorting];

        if (x.StatController && x.StatController.getMax(this.sorting))
          return x.StatController.getMax(this.sorting);
        if (x.NarrativeController && x.NarrativeController.LabelDictionary[this.sorting])
          return x.NarrativeController.LabelDictionary[this.sorting];
        if (x.NpcClassController) {
          if (this.sorting === 'Role') return x.NpcClassController.Class.Role;
          if (this.sorting === 'Tier') return x.NpcClassController.Tier;
          if (this.sorting === 'Tag') return x.Tag;
        }
      });
    },
  },
};
</script>
