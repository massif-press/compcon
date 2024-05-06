<template>
  <v-select
    v-model="sourceFilter"
    density="compact"
    hide-details
    class="px-2 mb-2"
    prepend-icon="mdi-factory"
    variant="outlined"
    label="From Manufacturer"
    :items="manufacturers"
    chips
    clearable
    @update:modelValue="updateFilters()" />
  <v-select
    v-model="lcpFilter"
    class="px-2"
    hide-details
    density="compact"
    prepend-icon="cc:compendium"
    chips
    clearable
    variant="outlined"
    label="From Content Pack"
    :items="lcps"
    multiple
    @update:modelValue="updateFilters()" />
</template>

<script lang="ts">
import { Manufacturer } from '@/class';

import { CompendiumStore } from '@/stores';
import _ from 'lodash';

const nameSort = function (a, b): number {
  if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'core-bonus-filter',
  data: () => ({
    sourceFilter: [],
    lcpFilter: [],
  }),
  emits: ['set-filters'],
  computed: {
    manufacturers(): Manufacturer[] {
      return CompendiumStore()
        .getItemCollection('Manufacturers')
        .map((x) => ({ title: x.Name, value: x.ID }))
        .sort(nameSort);
    },
    lcps(): string[] {
      return _.uniq(CompendiumStore().Frames.map((x) => x.LcpName));
    },
  },
  methods: {
    clear() {
      this.sourceFilter = [];
      this.lcpFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.lcpFilter && this.lcpFilter.length) fObj.LcpName = [this.lcpFilter];
      if (this.sourceFilter && this.sourceFilter.length) fObj.Source = [this.sourceFilter];
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
