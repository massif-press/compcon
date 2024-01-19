<template>
  <div>
    <v-data-table
      density="compact"
      :items="items"
      item-key="ID"
      :headers="headers"
      :items-per-page="25">
      <template v-slot:item.ItemType="{ item }">
        <v-btn
          icon
          size="small"
          variant="plain"
          color="accent"
          class="mr-n12"
          @click="$emit('open', item)">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import * as headers from './_components/gmItemHeaders';

export default {
  name: 'item-card-grid',
  props: {
    items: { type: Array, required: true },
    itemType: { type: String, required: true },
    grouping: { type: String, required: false, default: 'None' },
    sorting: { type: String, required: false, default: 'Name' },
    sortDir: { type: String, required: false, default: 'asc' },
  },
  emits: ['open'],
  computed: {
    headers() {
      const statHeaders = [] as any[];
      if ((this.items[0] as any).StatController) {
        const stats = _.uniqBy(
          this.items.map((x: any) => x.StatController.DisplayKeys).flat(),
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
      if ((this.items[0] as any).NarrativeController) {
        const labels = new Set(
          this.items.flatMap((x: any) => x.NarrativeController.Labels).map((x) => x.title)
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

      return headers[this.itemType].concat(statHeaders).concat(labelHeaders);
    },
    groupings() {
      if (this.grouping === 'None') return [`All`];
      return _.uniq(this.items.flatMap((x) => (x as any)[this.grouping]));
    },
    sortBy() {
      return [{ key: this.sorting, order: 'asc' }];
    },
  },
};
</script>
