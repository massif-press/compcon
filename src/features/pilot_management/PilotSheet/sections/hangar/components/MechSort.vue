<template>
  <div class="mt-n4">
    <v-tooltip location="top" open-delay="300">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="panel" flat tile size="x-small" @click="setSort('Name')">
          <v-icon icon="mdi-format-text" class="mb-n1" color="accent" />
          <v-icon
            v-if="sort === 'Name'"
            :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
            class="mb-n1"
            color="accent" />
        </v-btn>
      </template>
      <span>Sort by Name</span>
    </v-tooltip>

    <v-tooltip location="top" open-delay="300">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="panel" flat tile size="x-small" @click="setSort('Source')">
          <v-icon icon="cc:manufacturer" color="accent" />
          <v-icon
            v-if="sort === 'Source'"
            color="accent"
            :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
            class="mb-n1" />
        </v-btn>
      </template>
      <span>Sort by Manufacturer</span>
    </v-tooltip>

    <v-tooltip location="top" open-delay="300">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="panel" flat tile size="x-small" @click="setSort('Created')">
          <v-icon icon="mdi-clock-outline" class="mb-n1" color="accent" />
          <v-icon
            v-if="sort === 'Created'"
            color="accent"
            :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
            class="mb-n1" />
        </v-btn>
      </template>
      <span>Sort by created timestamp</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { UserStore } from '@/stores';

export default {
  name: 'hangar-sort',
  data: () => ({
    sort: 'Name',
    asc: true,
  }),
  created() {
    this.sort = UserStore().User.View('hangarSort', 'Created');
    this.asc = UserStore().User.View('hangarAsc', false);
  },
  methods: {
    setSort(sort: string) {
      if (this.sort === sort) {
        this.asc = !this.asc;
      } else {
        this.sort = sort;
        this.asc = true;
      }

      UserStore().User.SetView('hangarSort', this.sort);
      UserStore().User.SetView('hangarAsc', this.asc);
    },
  },
};
</script>
