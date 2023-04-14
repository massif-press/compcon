<template>
  <v-row density="compact" justify="space-around" class="mx-4">
    <v-col cols="12" md="4">
      <v-select
        v-model="sourceFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="mdi-factory"
        variant="outlined"
        label="From Manufacturer"
        :items="manufacturers"
        chips
        clearable
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
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
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
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
        @update:modelValue="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
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
        @update:modelValue="updateFilters()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import _ from 'lodash';
import { MechType, MountType, Manufacturer } from '@/class';

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
    lcps(): string[] {
      return _.uniq(CompendiumStore().Frames.map((x) => x.LcpName));
    },
  },
  methods: {
    clear() {
      this.sourceFilter = [];
      this.typeFilter = [];
      this.mountFilter = [];
      this.lcpFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.lcpFilter && this.lcpFilter.length)
        fObj.LcpName = [this.lcpFilter];
      if (this.sourceFilter) fObj.Source = [this.sourceFilter];
      if (this.typeFilter && this.typeFilter.length)
        fObj.MechType = this.typeFilter;
      if (this.mountFilter && this.mountFilter.length)
        fObj.Mounts = this.mountFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
