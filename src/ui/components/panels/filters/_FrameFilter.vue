<template>
  <v-row density="compact" justify="space-around" class="mx-4">
    <v-col cols="12">
      <v-select
        v-model="sourceFilter"
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
      <v-select
        v-model="typeFilter"
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
      <v-select
        v-model="mountFilter"
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
      <v-select
        v-model="sizeFilter"
        class="px-2"
        hide-details
        density="compact"
        chips
        clearable
        prepend-icon="cc:size_1"
        variant="outlined"
        label="Size"
        :items="sizes"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import _ from 'lodash';
import { MechType, MountType, Manufacturer, Frame } from '@/class';

import { CompendiumStore } from '@/stores';

const nameSort = function (a, b): number {
  if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    typeFilter: [],
    mountFilter: [],
    sizeFilter: [],
  }),
  emits: ['set-filters'],
  computed: {
    manufacturers(): Manufacturer[] {
      return CompendiumStore()
        .getItemCollection('Manufacturers')
        .map((x) => ({ title: x.Name, value: x.ID }))
        .sort(nameSort);
    },
    mechTypes(): MechType[] {
      return Object.keys(MechType)
        .map((k) => MechType[k as any])
        .sort() as MechType[];
    },
    mountTypes(): MountType[] {
      return Object.keys(MountType)
        .map((k) => MountType[k as any])
        .filter((x) => x !== 'Integrated')
        .sort() as MountType[];
    },
    sizes(): { title: string; value: string }[] {
      const sizes = CompendiumStore()
        .getItemCollection('Frames')
        .map((x: Frame) => x.Size)
        .sort();
      return _.uniq(sizes).map((y: any) => ({ title: 'Size ' + y, value: y }));
    },
    lcps(): string[] {
      return CompendiumStore().lcpNames;
    },
  },
  methods: {
    clear() {
      this.typeFilter = [];
      this.sourceFilter = [];
      this.mountFilter = [];
      this.sizeFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.sourceFilter) fObj.Source = this.sourceFilter;
      if (this.sizeFilter && this.sizeFilter.length) fObj.MechSize = this.sizeFilter;
      if (this.typeFilter && this.typeFilter.length) fObj.MechType = this.typeFilter;
      if (this.mountFilter && this.mountFilter.length) fObj.Mounts = this.mountFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
