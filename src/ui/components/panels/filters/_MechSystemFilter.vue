<template>
  <mech-item-filter-base
    ref="base"
    :active-filters="activeFilters"
    @sp-ll-change="onSpLlChange">
    <v-col cols="12">
      <v-select v-model="tagFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="systemTags"
        multiple
        item-title="Name"
        item-value="ID"
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="<any>systemTypeFilter"
        class="px-2"
        density="compact"
        prepend-icon="cc:system"
        variant="outlined"
        hide-details
        label="System Type"
        :items="systemTypes"
        chips
        clearable
        @update:modelValue="updateFilters()" />
    </v-col>
  </mech-item-filter-base>
</template>

<script lang="ts">
import { SystemType } from '@/classes/enums'
import MechItemFilterBase from './MechItemFilterBase.vue'

export default {
  name: 'mech-system-filter',
  components: { MechItemFilterBase },
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    systemTags: { type: Array, default: () => [] },
  },
  data: () => ({
    tagFilter: [] as string[],
    systemTypeFilter: [] as SystemType[],
    spLlFilters: {} as any,
  }),
  emits: ['set-filters'],
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Tags) this.tagFilter = f.Tags;
    if (f.Type) this.systemTypeFilter = f.Type[0] ?? [];
  },
  computed: {
    systemTypes(): string[] {
      return Object.keys(SystemType).map((k) => SystemType[k as any]).filter((k) => k !== 'Integrated').sort() as string[];
    },
  },
  methods: {
    onSpLlChange(partial: any) {
      this.spLlFilters = partial;
      this.updateFilters();
    },
    clear() {
      this.tagFilter = [];
      this.systemTypeFilter = [];
      this.spLlFilters = {};
      (this.$refs.base as any)?.clear();
    },
    updateFilters() {
      const fObj = { ...this.spLlFilters } as any;
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter;
      if (this.systemTypeFilter && this.systemTypeFilter.length) fObj.Type = [this.systemTypeFilter];
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
