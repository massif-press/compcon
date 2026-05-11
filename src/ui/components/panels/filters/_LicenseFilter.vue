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
    @update:modelValue="updateFilters()" />
  <v-select v-model="lcpFilter"
    class="px-2"
    hide-details
    density="compact"
    prepend-icon="cc:compendium"
    chips
    clearable
    variant="outlined"
    label="From Content Pack"
    :items="lcpNames"
    multiple
    @update:modelValue="updateFilters()" />
</template>

<script lang="ts">
export default {
  name: 'license-filter',
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    manufacturers: { type: Array, default: () => [] },
    lcpNames: { type: Array, default: () => [] },
  },
  data: () => ({
    sourceFilter: [] as string[],
    lcpFilter: [] as string[],
  }),
  emits: ['set-filters'],
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
