<template>
  <v-row justify="space-around" density="compact" class="mx-4">
    <v-col cols="4">
      <v-select
        v-model="sourceFilter"
        density="compact"
        hide-details
        class="px-2"
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
    <v-col cols="4">
      <v-select
        v-model="tagFilter"
        density="compact"
        hide-details
        class="px-2"
        prepend-icon="mdi-tag"
        chips
        clearable
        variant="outlined"
        label="Tags"
        :items="tags"
        item-value="ID"
        multiple
        item-text="Name"
        @update:modelValue="updateFilters()"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Tag, Manufacturer } from '@/class';

import { CompendiumStore } from '@/stores';
import _ from 'lodash';

const nameSort = function (a, b): number {
  if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'frame-filter',
  data: () => ({
    sourceFilter: [],
    tagFilter: [],
    lcpFilter: [],
    weaponTypeFilter: [],
  }),
  emits: ['set-filters'],
  computed: {
    manufacturers(): Manufacturer[] {
      return CompendiumStore()
        .getItemCollection('Manufacturers')
        .map((x) => ({ title: x.Name, value: x.ID }))
        .sort(nameSort);
    },
    tags(): Tag[] {
      return _.uniqBy(
        [].concat(
          CompendiumStore()
            .getItemCollection('WeaponMods')
            .flatMap((x) => x.Tags)
            .filter((x) => !x.FilterIgnore && !x.IsHidden)
        ),
        'ID'
      );
    },
    lcps(): string[] {
      return _.uniq(CompendiumStore().Frames.map((x) => x.LcpName));
    },
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
      if (this.lcpFilter && this.lcpFilter.length)
        fObj.LcpName = [this.lcpFilter];
      if (this.sourceFilter && this.sourceFilter.length)
        fObj.Source = [this.sourceFilter];
      if (this.tagFilter && this.tagFilter.length) fObj.Tags = this.tagFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
