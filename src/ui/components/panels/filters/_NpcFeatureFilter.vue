<template>
  <v-row density="compact" justify="space-around" class="mx-4">
    <v-col cols="12">
      <v-select
        v-model="typeFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:trait"
        chips
        clearable
        variant="outlined"
        label="Item Type"
        :items="types"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select
        v-model="originFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:npc_class"
        chips
        clearable
        variant="outlined"
        label="Origin"
        :items="origins"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';

const nameSort = function (a, b): number {
  if (a.toUpperCase() < b.toUpperCase()) return -1;
  if (a.toUpperCase() > b.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'npc-class-filter',
  data: () => ({
    originFilter: [],
    typeFilter: [],
  }),
  emits: ['set-filters'],
  computed: {
    origins() {
      return _.uniqBy(CompendiumStore().NpcFeatures, 'Origin').map((x) => ({
        title: x.Origin.Name,
        value: x.Origin.ID,
      }));
    },
    types() {
      return _.uniqBy(CompendiumStore().NpcFeatures, 'FeatureType')
        .map((x) => x.FeatureType)
        .sort(nameSort);
    },
  },
  methods: {
    clear() {
      this.originFilter = [];
      this.typeFilter = [];
      this.updateFilters();
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.originFilter && this.originFilter.length > 0) fObj.Origin = this.originFilter;
      if (this.typeFilter && this.typeFilter.length > 0) fObj.FeatureType = this.typeFilter;

      this.$emit('set-filters', fObj);
    },
  },
};
</script>
