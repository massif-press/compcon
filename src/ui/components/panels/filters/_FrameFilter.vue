<template>
  <v-row dense justify="space-around" class="mx-4">
    <v-col cols="12" md="4">
      <v-select
        v-model="sourceFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="mdi-factory"
        variant="outlined"
        label="From Manufacturer"
        :items="manufacturers"
        chips
        deletable-chips
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="typeFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cc:frame"
        chips
        deletable-chips
        variant="outlined"
        label="Role"
        :items="mechTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="mountFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cc:weapon"
        chips
        deletable-chips
        variant="outlined"
        label="Has Mount"
        :items="mountTypes"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="lcpFilter"
        class="px-2"
        hide-details
        dense
        prepend-icon="cc:compendium"
        chips
        deletable-chips
        variant="outlined"
        label="From Content Pack"
        :items="lcps"
        multiple
        small-chips
        @change="updateFilters()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { MechType, MountType, Manufacturer } from '@/class';

import { CompendiumStore } from '@/store';

const nameSort = function (a, b): number {
  if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
  if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'frame-filter',
  data: () => ({
    sourceFilter: '',
    typeFilter: [],
    mountFilter: [],
    lcpFilter: [],
  }),
  computed: {
    manufacturers(): Manufacturer[] {
      return this.$store.getters
        .getItemCollection('Manufacturers')
        .map((x) => ({ text: x.Name, value: x.ID }))
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
      return this.getModule(CompendiumStore).Frames.map((x) => x.LcpName);
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
