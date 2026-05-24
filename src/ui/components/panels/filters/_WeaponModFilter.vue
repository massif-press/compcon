<template>
  <v-row justify="space-around"
    density="compact"
    class="mx-4">
    <v-col cols="4">
      <v-select v-model="sourceFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-factory"
        variant="outlined"
        label="From Manufacturer"
        :items="manufacturers"
        chips
        clearable
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12"
      md="4">
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
    </v-col>
    <v-col cols="4">
      <v-select v-model="tagFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="modTags"
        item-value="ID"
        multiple
        item-text="Name"
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'weapon-mod-filter',
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    manufacturers: { type: Array, default: () => [] },
    modTags: { type: Array, default: () => [] },
    lcpNames: { type: Array, default: () => [] },
  },
  data: () => ({
    sourceFilter: [] as string[],
    tagFilter: [] as string[],
    lcpFilter: [] as string[],
    weaponTypeFilter: [] as string[],
  }),
  emits: ['set-filters'],
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Source) this.sourceFilter = f.Source[0] ?? [];
    if (f.Tags) this.tagFilter = f.Tags;
    if (f.LcpName) this.lcpFilter = f.LcpName[0] ?? [];
  },
  methods: {
    clear() {
      this.sourceFilter = [];
      this.tagFilter = [];
      this.weaponTypeFilter = [];
      this.lcpFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.lcpFilter && this.lcpFilter.length) fObj.LcpName = [this.lcpFilter];
      if (this.sourceFilter && this.sourceFilter.length) fObj.Source = [this.sourceFilter];
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
