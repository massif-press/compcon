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
        {{ key === '0' ? $t('common.all') : key }}
        <span class="text-caption text-disabled">
          ({{ groupedItems(groupings[key]).length }}/{{ items.length }})
        </span>
      </v-col>
      <v-col>
        <v-divider />
      </v-col>
      <v-col cols="auto">
        <v-icon size="small"
          :icon="collapsed.includes(key) ? 'mdi-chevron-right' : 'mdi-chevron-down'" />
      </v-col>
    </v-row>
    <div v-if="!items.length"
      class="text-center text-disabled"><i>{{ $t('common.noData') }}</i></div>
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { computeItemGroupings } from '@/composables/useItemGrouping';
import GmItemListElement from './_components/GMItemListElement.vue';
import * as _ from 'lodash-es';

const props = withDefaults(defineProps<{
  itemType: string
  items: any[]
  selectedId?: string
  search?: string
  big?: boolean
  list?: boolean
  table?: boolean
  grouping?: string
  sorting?: string
  sortDir?: string
  allFolders?: any[]
  disabled?: boolean
}>(), {
  search: '',
  grouping: 'Folder',
  sorting: 'Name',
  sortDir: 'asc',
  allFolders: () => [],
  disabled: false
})

const emit = defineEmits<{
  'open': [payload: any]
  'add-new': []
}>()

const collapsed = ref([] as string[])

const groupings = computed(() => {
      return computeItemGroupings(props.items as any[], props.grouping, props.allFolders as string[]);
    })
const searchedItems = computed(() => {
      if (!props.search) return sort(props.items);
      return sort(props.items.filter((x: any) => (x as any).Name.toLowerCase().includes(props.search?.toLowerCase() || '')));
    })

function toggleCollapsed(key: string) {
      const i = collapsed.value.indexOf(key)
      if (i === -1) collapsed.value.push(key)
      else collapsed.value.splice(i, 1)
    }
function groupedItems(group) {
      if (props.grouping === 'None') return sort(searchedItems.value);
      return sort(group.filter((x: any) => (x as any).Name.toLowerCase().includes(props.search?.toLowerCase() || '')));
    }
function sort(items) {
      return _.orderBy(items, (x: any) => {
        if (props.sorting === 'Sitrep') return x.Sitrep.Name;
        if (props.sorting === 'Environment') return x.Environment.Name;

        if (x[props.sorting]) return x[props.sorting];

        if (x.StatController) {
          const dk = x.StatController.DisplayKeys.find(
            (k) => k.title === props.sorting || k.key === props.sorting
          );
          if (dk) return x.StatController.getMax(dk.key) ?? 0;
        }
        if (x.NarrativeController && x.NarrativeController.LabelDictionary[props.sorting])
          return x.NarrativeController.LabelDictionary[props.sorting];
        if (x.NpcClassController) {
          if (props.sorting === 'Role') return x.NpcClassController.Class?.Role ?? '';
          if (props.sorting === 'Tier') return x.NpcClassController.Tier ?? 0;
          if (props.sorting === 'Tag') return x.Tag ?? '';
        }
      }, props.sortDir);
    }
</script>
