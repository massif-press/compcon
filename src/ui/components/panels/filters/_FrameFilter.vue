<template>
  <v-row density="compact"
    justify="space-around"
    class="mx-4">
    <v-col cols="12">
      <v-select v-model="sourceFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:manufacturer"
        variant="outlined"
        label="From Manufacturer"
        :items="manufacturers"
        clearable
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="typeFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:frame"
        chips
        clearable
        variant="outlined"
        label="Role"
        :items="mechTypes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="mountFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:weapon"
        chips
        clearable
        variant="outlined"
        label="Has Mount"
        :items="mountTypes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="sizeFilter"
        class="px-2"
        hide-details
        density="compact"
        chips
        clearable
        prepend-icon="cc:size_1"
        variant="outlined"
        label="Size"
        :items="frameSizes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
      <v-select v-model="licenseFilter"
        class="px-2"
        hide-details
        density="compact"
        chips
        clearable
        prepend-icon="cc:license"
        variant="outlined"
        label="License"
        :items="frameLicenses"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { MechType, MountType } from '@/classes/enums'

export default {
  name: 'frame-filter',
  props: {
    activeFilters: { type: Object, default: () => ({}) },
    manufacturers: { type: Array, default: () => [] },
    frameSizes: { type: Array, default: () => [] },
    frameLicenses: { type: Array, default: () => [] },
  },
  data: () => ({
    sourceFilter: [] as string[],
    typeFilter: [] as string[],
    mountFilter: [] as string[],
    sizeFilter: [] as string[],
    licenseFilter: [] as string[],
  }),
  emits: ['set-filters'],
  mounted() {
    const f = this.activeFilters;
    if (!f || !Object.keys(f).length) return;
    if (f.Source) this.sourceFilter = f.Source;
    if (f.MechType) this.typeFilter = f.MechType;
    if (f.Mounts) this.mountFilter = f.Mounts;
    if (f.MechSize) this.sizeFilter = f.MechSize;
    if (f.License) this.licenseFilter = f.License;
  },
  computed: {
    mechTypes(): string[] {
      return Object.keys(MechType).map((k) => MechType[k as any]).sort() as string[];
    },
    mountTypes(): string[] {
      return Object.keys(MountType).map((k) => MountType[k as any]).filter((x) => x !== 'Integrated').sort() as string[];
    },
  },
  methods: {
    clear() {
      this.typeFilter = [];
      this.sourceFilter = [];
      this.mountFilter = [];
      this.sizeFilter = [];
      this.licenseFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.sourceFilter) fObj.Source = this.sourceFilter;
      if (this.sizeFilter && this.sizeFilter.length) fObj.MechSize = this.sizeFilter;
      if (this.typeFilter && this.typeFilter.length) fObj.MechType = this.typeFilter;
      if (this.mountFilter && this.mountFilter.length) fObj.Mounts = this.mountFilter;
      if (this.licenseFilter && this.licenseFilter.length) fObj.License = this.licenseFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
