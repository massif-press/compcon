<template>
  <div
    :style="
      $vuetify.display.mdAndDown ? 'z-index:2; position: fixed; bottom: 28px; right: 28px' : ''
    ">
    <v-badge :value="filterCount" overlap right color="secondary">
      <template #badge>
        <b>{{ filterCount }}</b>
      </template>

      <v-btn icon size="small" color="primary" @click="panel = !panel">
        <v-icon dark>mdi-filter-variant</v-icon>
      </v-btn>
    </v-badge>
  </div>

  <v-navigation-drawer v-model="panel" location="bottom" temporary>
    <v-sheet>
      <cc-titlebar dark icon="mdi-filter-variant">Set Item Filters</cc-titlebar>
      <v-card-text>
        <cc-item-filter ref="controls" :item-type="itemType" @set-filters="applyFilters($event)" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="panel = false">dismiss</v-btn>
        <v-spacer />
        <cc-btn color="accent" class="mr-3" @click="clearFilters">clear all</cc-btn>
      </v-card-actions>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script lang="ts">
export default {
  name: 'cc-filter-panel',
  props: {
    itemType: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    filterCount: 0,
    panel: false,
  }),
  emits: ['set-filters'],
  methods: {
    clearFilters() {
      (this.$refs.controls as any).clear();
      this.applyFilters({});
    },
    applyFilters(newFilters) {
      this.filterCount = Object.keys(newFilters).length;
      this.$emit('set-filters', newFilters);
    },
  },
};
</script>
