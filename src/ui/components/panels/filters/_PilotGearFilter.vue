<template>
  <v-row density="compact" justify="space-around" class="mx-4">
    <v-col cols="12">
      <v-select
        v-model="typeFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:trait"
        chips
        clearable
        variant="outlined"
        label="Item Type"
        :items="types"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
    <v-col cols="12">
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
        item-title="Name"
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import _ from 'lodash';
import { Tag, Manufacturer } from '@/class';
import { CompendiumStore } from '@/stores';

const nameSort = function (a, b): number {
  if (a.toUpperCase() < b.toUpperCase()) return -1;
  if (a.toUpperCase() > b.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'pilot-gear-filter',
  data: () => ({
    tagFilter: [],
    typeFilter: [],
  }),
  emits: ['set-filters'],
  computed: {
    tags(): Tag[] {
      return _.uniqBy(
        [].concat(
          CompendiumStore()
            .getItemCollection('PilotGear')
            .flatMap((x) => x.Tags)
            .filter((x) => !x.FilterIgnore && !x.IsHidden)
        ),
        'ID'
      );
    },
    types() {
      return [
        { title: 'Armor', value: 'PilotArmor' },
        { title: 'Gear', value: 'PilotGear' },
        { title: 'Weapon', value: 'PilotWeapon' },
      ];
    },
  },
  methods: {
    clear() {
      this.tagFilter = [];
      this.typeFilter = [];
      this.updateFilters();
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.tagFilter && this.tagFilter.length > 0) fObj.Tags = this.tagFilter;
      if (this.typeFilter && this.typeFilter.length > 0) fObj.ItemType = this.typeFilter;

      this.$emit('set-filters', fObj);
    },
  },
};
</script>
