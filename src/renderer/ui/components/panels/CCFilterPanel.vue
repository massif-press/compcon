<template>
  <v-bottom-sheet v-model="panel">
    <template v-slot:activator="{ on }">
      <v-badge overlap bottom color="panel-border">
        <template v-if="filterCount" v-slot:badge>
          <span class="stat-text white--text">{{ filterCount }}</span>
        </template>

        <v-btn fab v-on="on" color="primary">
          <v-icon dark>mdi-filter-variant</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <v-sheet>
      <cc-titlebar dark icon="mdi-filter-variant">Set Item Filters</cc-titlebar>
      <v-card-text>
        <frame-filter @set-filters="setFilters" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="panel = false">dismiss</v-btn>
        <v-spacer />
        <cc-btn color="warning" class="mr-3">clear selected</cc-btn>
        <cc-btn @click="$emit('set-filters', filters)">apply</cc-btn>
      </v-card-actions>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import FrameFilter from './filters/_FrameFilter.vue'

export default Vue.extend({
  name: 'cc-filter-panel',
  components: { FrameFilter },
  data: () => ({
    filterCount: 0,
    panel: false,
    filters: {},
  }),
  methods: {
    setFilters(filters) {
      console.log(filters)
    },
  },
})
</script>