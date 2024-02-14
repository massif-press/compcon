<template>
  <v-row density="compact" justify="space-around" class="mx-4">
    <v-col cols="12">
      <v-select
        v-model="roleFilter"
        class="px-2"
        hide-details
        density="compact"
        prepend-icon="cc:role_support"
        chips
        clearable
        variant="outlined"
        label="Role"
        :items="roles"
        multiple
        @update:modelValue="updateFilters()" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';

const nameSort = function (a, b): number {
  if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
  if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
  return 0;
};

export default {
  name: 'npc-class-filter',
  data: () => ({
    roleFilter: [],
  }),
  emits: ['set-filters'],
  computed: {
    roles() {
      return _.uniqBy(CompendiumStore().NpcClasses, 'Role')
        .map((x) => ({ title: x.Role, value: x.ID }))
        .sort(nameSort);
    },
  },
  methods: {
    clear() {
      this.roleFilter = [];
    },
    updateFilters() {
      const fObj = {} as any;
      if (this.roleFilter) fObj.Role = this.roleFilter;
      this.$emit('set-filters', fObj);
    },
  },
};
</script>
