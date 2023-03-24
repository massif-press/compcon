<template>
  <div>
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
      <v-row v-for="(group, i) in groupings" :key="`${group}_${i}`" dense>
        <v-col cols="12">
          <div class="primary white--text heading h3 pa-1 pl-2">
            {{ group }}
          </div>
        </v-col>
        <v-col
          v-for="(item, j) in groupedItems(group)"
          :key="`grid_item_${j}`"
          :cols="list ? 12 : big ? 3 : 2"
        >
          <item-card
            :item="item"
            :big="big"
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
      return _.uniq(this.items.flatMap((x) => x[this.grouping]));
    },
  },
  methods: {
    groupedItems(group) {
      if (this.grouping === 'None') return this.items;
      return this.items.filter((x) =>
        x[this.grouping].some((y) => y === group)
      );
    },
  },
};
</script>
