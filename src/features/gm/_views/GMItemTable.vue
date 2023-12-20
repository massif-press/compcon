<template>
  <div>
    <v-data-table
      density="compact"
      :items="items"
      item-key="ID"
      :headers="headers"
      :items-per-page="25"
    >
      <template v-slot:item.ItemType="{ item }">
        <v-btn
          icon
          size="small"
          variant="plain"
          color="accent"
          class="mr-n12"
          @click="$emit('open', item)"
        >
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
      return headers[this.itemType];
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
