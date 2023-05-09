<template>
  <div>
    <v-data-table
      :items="items"
      :group-by="grouping === 'None' ? [] : grouping"
      :sort-by="sorting"
      :headers="headers"
      :items-per-page="-1"
      hide-default-footer
    >
      <template #[`item.Campaigns`]="{ item }">
        <v-chip v-for="c in item.Campaigns" small color="accent" variant="outlined" class="mr-1">
          {{ c }}
        </v-chip>
      </template>
      <template #[`item.Labels`]="{ item }">
        <v-chip v-for="l in item.Labels" small color="primary" label class="mr-1">
          {{ l }}
        </v-chip>
      </template>
      <template #[`item.NpcTemplateController.Templates`]="{ item }">
        <v-chip
          v-for="(t, i) in item.NpcTemplateController.Templates"
          small
          color="primary"
          label
          class="mr-1"
        >
          <v-icon small>cc:npc_template</v-icon>
          {{ t.Name }}
        </v-chip>
      </template>
      <template #[`item.ItemType`]="{ item }">
        <v-btn small color="primary" class="text-white" @click="$emit('open', item.ID)">
          <v-icon start>mdi-open-in-new</v-icon>
          Open
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
  computed: {
    headers() {
      return headers[this.itemType];
    },
    groupings() {
      if (this.grouping === 'None') return ['All'];
      return _.uniq(this.items.flatMap((x) => x[this.grouping]));
    },
  },
  methods: {
    groupedItems(group) {
      if (this.grouping === 'None') return this.items;
      return this.items.filter((x) => x[this.grouping].some((y) => y === group));
      // return _.orderBy(
      //   this.sorting,
      //   this.sortDir
      // )
    },
  },
};
</script>
