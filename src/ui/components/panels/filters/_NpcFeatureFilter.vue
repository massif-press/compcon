<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
    <v-col cols="12">
      <v-select v-model="typeFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:trait"
        chips
        clearable
        variant="outlined"
        label="Item Type"
        :items="featureTypes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="originFilter"
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
export default {
  name: 'npc-feature-filter',
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    origins: { type: Array, default: () => [] },
    featureTypes: { type: Array, default: () => [] },
  },
  data: () => ({
    originFilter: [] as string[],
    typeFilter: [] as string[],
  }),
  emits: ['set-filters'],
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Origin) this.originFilter = f.Origin;
    if (f.FeatureType) this.typeFilter = f.FeatureType;
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
