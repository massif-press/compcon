<template>
  <div>
    <v-data-table density="compact"
      :items="items"
      item-key="ID"
      :headers="headers"
      :items-per-page="25">
      <template v-slot:item.Name="{ item }">
        <div style="min-width: 200px">
          <cc-remote-hover :item="item"
            color="accent" />
          <cc-missing-content-hover :item="item" />
          {{ (item as any).Name }}
        </div>
      </template>
      <template v-slot:item.ItemType="{ item }">
        <v-btn icon
          size="small"
          variant="plain"
          color="accent"
          class="mr-n12"
          @click="$emit('open', item)">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.Layers="{ item }">
        <v-chip v-for="l in (item as any).Layers"
          :key="l.ID"
          label
          size="x-small"
          prepend-icon="mdi-layers"
          class="mr-1">
          {{ l.Layer.Name }}
        </v-chip>
      </template>
      <template v-slot:item.Templates="{ item }">
        <v-chip v-for="t in (item as any).NpcTemplateController.Templates"
          :key="t.ID"
          label
          size="x-small"
          prepend-icon="cc:npc_template"
          class="mr-1">
          {{ t.Name }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as _ from 'lodash-es';
import * as headers from './_components/gmItemHeaders';

defineOptions({ name: 'item-card-grid' })

const props = withDefaults(defineProps<{
  items: any[]
  itemType: string
  grouping?: string
  sorting?: string
  sortDir?: string
}>(), {
  grouping: 'None',
  sorting: 'Name',
  sortDir: 'asc'
})

const emit = defineEmits<{
  'open': [payload: any]
}>()

const headers = computed(() => {
      const statHeaders = [] as any[];
      if (props.items.length && (props.items[0] as any).StatController) {
        const stats = _.uniqBy(
          props.items.map((x: any) => x.StatController.DisplayKeys).flat(),
          'key'
        );

        stats.forEach((s) => {
          statHeaders.push({
            title: s.title,
            value: `StatController.MaxStats.${s.key}`,
            align: 'center',
            sortable: true,
          });
        });
      }

      const labelHeaders = [] as any[];
      if (props.items.length && (props.items[0] as any).NarrativeController) {
        const labels = new Set(
          props.items.flatMap((x: any) => x.NarrativeController.Labels).map((x) => x.title)
        );

        labels.forEach((l) => {
          labelHeaders.push({
            title: l,
            value: `NarrativeController.LabelDictionary.${l}`,
            align: 'center',
            sortable: true,
          });
        });
      }

      return headers[props.itemType].concat(statHeaders).concat(labelHeaders);
    })
const groupings = computed(() => {
      if (props.grouping === 'None') return [`All`];
      return _.uniq(props.items.flatMap((x) => (x as any)[props.grouping]));
    })
const sortBy = computed(() => {
      return [{ key: props.sorting, order: 'asc' }];
    })
</script>
