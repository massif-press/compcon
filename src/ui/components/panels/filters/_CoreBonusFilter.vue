<template>
  <v-select v-model="sourceFilter"
    density="compact"
    hide-details
    class="px-2 mb-2"
    prepend-icon="mdi-factory"
    variant="outlined"
    label="From Manufacturer"
    :items="manufacturers"
    chips
    clearable
    @update:model-value="updateFilters()" />
  <v-select v-model="lcpFilter"
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
    @update:model-value="updateFilters()" />
</template>

<script lang="ts">
import { Manufacturer } from '@/class';

import { CompendiumStore } from '@/stores';
import * as _ from 'lodash-es';

const nameSort = function (a, b): number {
  if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'CoreBonusFilter',
  props: { activeFilters: { type: Object, default: () => ({}) } },
  emits: ['set-filters'],
  data: () => ({
    sourceFilter: [],
    lcpFilter: [],
  }),
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
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Source) this.sourceFilter = f.Source[0] ?? [];
    if (f.LcpName) this.lcpFilter = f.LcpName[0] ?? [];
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
