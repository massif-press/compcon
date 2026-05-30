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

<script setup lang="ts">
import { computed } from 'vue'
import { computeItemGroupings } from '@/composables/useItemGrouping';
import ItemCard from './_components/GMItemCard.vue';
import GmItemTable from './GMItemTable.vue';
import * as _ from 'lodash-es';

const props = withDefaults(defineProps<{
  itemType: string
  items: any[]
  search?: string
  big?: boolean
  list?: boolean
  table?: boolean
  grouping?: string
  sorting?: string
  sortDir?: string
  allFolders?: any[]
  folderDrag?: boolean
}>(), {
  search: '',
  grouping: 'None',
  sorting: 'Name',
  sortDir: 'asc',
  allFolders: () => [],
  folderDrag: false
})

const groupings = computed(() => {
      return computeItemGroupings(props.items as any[], props.grouping, props.allFolders as string[]);
    })
const searchedItems = computed(() => {
      if (!props.search) return sort(props.items);
      return sort(props.items.filter((x: any) => (x as any).Name.toLowerCase().includes(props.search.toLowerCase())));
    })

function onDragStart(event: DragEvent, item: any) {
      event.dataTransfer!.setData('text/encounter-id', (item as any).ID);
      event.dataTransfer!.effectAllowed = 'move';
    }
function groupedItems(group) {
      if (props.grouping === 'None') return sort(searchedItems.value);
      return group.filter((x: any) => (x as any).Name.toLowerCase().includes(props.search.toLowerCase()));
    }
function sort(items) {
      return _.orderBy(items, (x: any) => {
        if (props.sorting === 'Sitrep') return x.Sitrep.Name;
        if (props.sorting === 'Environment') return x.Environment.Name;

        if (x[props.sorting]) return x[props.sorting];

        if (x.StatController && x.StatController.getMax(props.sorting))
          return x.StatController.getMax(props.sorting);
        if (x.NarrativeController && x.NarrativeController.LabelDictionary[props.sorting])
          return x.NarrativeController.LabelDictionary[props.sorting];
        if (x.NpcClassController) {
          if (props.sorting === 'Role') return x.NpcClassController.Class.Role;
          if (props.sorting === 'Tier') return x.NpcClassController.Tier;
          if (props.sorting === 'Tag') return x.Tag;
        }
      });
    }
</script>
