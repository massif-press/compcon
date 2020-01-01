<template>
  <v-bottom-sheet v-model="panel">
    <template v-slot:activator="{ on }">
      <v-badge overlap right color="secondary">
        <template v-if="filterCount" v-slot:badge>
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
        <cc-item-filter ref="controls" :item-type="itemType" @set-filters="stageFilters" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="panel = false">dismiss</v-btn>
        <v-spacer />
        <cc-btn color="warning" class="mr-3" @click="clearFilters">clear selected</cc-btn>
        <cc-btn @click="setFilters">apply</cc-btn>
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
    filters: {},
  }),
  methods: {
    stageFilters(newFilters) {
      this.filters = newFilters
    },
    clearFilters() {
      this.filters = {}
      this.$refs.controls.clear()
      this.applyFilters()
    },
    setFilters() {
      this.applyFilters()
      this.panel = false
    },
    applyFilters() {
      this.filterCount = Object.keys(this.filters).length
      this.$emit('set-filters', this.filters)
    },
  },
})
</script>
