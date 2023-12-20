<template>
  <gm-item-table
    v-if="table"
    :item-type="itemType"
    :items="items"
    :grouping="grouping"
    :sorting="sorting"
    :sort-dir="sortDir"
    @open="$emit('open', $event)"
  />
  <div v-else>
    <div v-for="group in groupings">
      <v-row dense align="center">
        <v-col cols="auto" style="width: 2vw"><v-divider /></v-col>
        <v-col cols="auto" class="heading h3">
          {{ group }}
          <span class="text-caption text-disabled">({{ groupedItems(group).length }})</span>
        </v-col>
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <div v-if="!items.length" class="text-center text-disabled"><i>No Data</i></div>
      <v-row v-else dense>
        <v-col v-for="(item, i) in groupedItems(group)" :cols="list ? 12 : big ? 3 : 2">
          <item-card
            :item="(item as any)"
            :big="big"
            :odd="i % 2 > 0"
            :list="list"
            @open="$emit('open', $event)"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import ItemCard from './_components/GMItemCard.vue';
import GmItemTable from './GMItemTable.vue';
import _ from 'lodash';

export default {
  name: 'item-card-grid',
  components: { ItemCard, GmItemTable },
  props: {
    itemType: { type: String, required: true },
    items: { type: Array, required: true },
    big: { type: Boolean },
    list: { type: Boolean },
    table: { type: Boolean },
    grouping: { type: String, required: false, default: 'Collection' },
    sorting: { type: String, required: false, default: 'Name' },
    sortDir: { type: String, required: false, default: 'asc' },
  },
  computed: {
    groupings() {
      if (this.grouping === 'None') return [`All`];
      return _.uniq(this.items.flatMap((x) => (x as any)[this.grouping]));
    },
  },
  methods: {
    groupedItems(group) {
      if (this.grouping === 'None') return this.items;
      return this.items.filter((x) => (x as any)[this.grouping].some((y) => y === group));
    },
  },
};
</script>
