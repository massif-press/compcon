<template>
  <div :style="$vuetify.display.mdAndDown ? 'z-index:2; position: fixed; bottom: 28px; right: 28px' : ''
    ">
    <v-badge :value="filterCount"
      overlap
      right
      color="secondary">
      <template #badge>
        <b>{{ filterCount }}</b>
      </template>

      <v-btn icon
        size="small"
        color="primary"
        @click="panel = !panel">
        <v-icon dark>mdi-filter-variant</v-icon>
      </v-btn>
    </v-badge>
  </div>

  <v-navigation-drawer v-model="panel"
    location="bottom"
    temporary>
    <v-sheet>
      <cc-titlebar dark
        icon="mdi-filter-variant">Set Item Filters</cc-titlebar>
      <v-card-text>
        <cc-item-filter ref="controls"
          :item-type="itemType"
          :active-filters="activeFilters"
          @set-filters="applyFilters($event)" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn text
          @click="panel = false">dismiss</v-btn>
        <v-spacer />
        <cc-button color="accent"
          class="mr-3"
          @click="clearFilters">clear all</cc-button>
      </v-card-actions>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script lang="ts">
export default {
  name: 'CcFilterPanel',
  props: {
    itemType: {
      type: String,
      required: true,
    },
  },
  emits: ['set-filters'],
  data: () => ({
    filterCount: 0,
    panel: false,
    activeFilters: {} as Record<string, any>,
  }),
  methods: {
    clearFilters() {
      (this.$refs.controls as any).clear();
      this.applyFilters({});
    },
    applyFilters(newFilters) {
      this.filterCount = Object.keys(newFilters).length;
      this.activeFilters = newFilters;
      this.$emit('set-filters', newFilters);
    },
  },
};
</script>
