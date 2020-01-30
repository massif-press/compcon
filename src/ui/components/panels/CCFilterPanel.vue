<template>
  <v-bottom-sheet v-model="panel">
    <template v-slot:activator="{ on }">
      <v-badge :value="filterCount" overlap right color="secondary">
        <template v-slot:badge>
          <span class="stat-text white--text">{{ filterCount }}</span>
        </template>

        <v-btn fab color="primary" v-on="on">
          <v-icon dark>mdi-filter-variant</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <v-sheet>
      <cc-titlebar dark icon="mdi-filter-variant">Set Item Filters</cc-titlebar>
      <v-card-text pb-0>
        <cc-item-filter ref="controls" :item-type="itemType" @set-filters="applyFilters($event)" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="panel = false">dismiss</v-btn>
        <v-spacer />
        <cc-btn color="warning" class="mr-3" @click="clearFilters">clear all</cc-btn>
      </v-card-actions>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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
  methods: {
    clearFilters() {
      this.$refs.controls.clear()
      this.applyFilters({})
    },
    applyFilters(newFilters) {
      this.filterCount = Object.keys(newFilters).length
      this.$emit('set-filters', newFilters)
    },
  },
})
</script>
