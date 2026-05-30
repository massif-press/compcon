<template>
  <div class="mt-n4">
    <v-tooltip location="top"
      open-delay="300">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          color="panel"
          flat
          tile
          size="small"
          @click="setSort('Name')">
          <v-icon icon="mdi-format-text-variant"
            size="21"
            color="accent" />
          <v-icon v-if="sort === 'Name'"
            :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
            size="21"
            color="accent" />
        </v-btn>
      </template>
      <span>Sort by Name</span>
    </v-tooltip>

    <v-tooltip location="top"
      open-delay="300">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          color="panel"
          flat
          tile
          size="small"
          @click="setSort('Source')">
          <v-icon icon="cc:manufacturer"
            size="21"
            color="accent" />
          <v-icon v-if="sort === 'Source'"
            color="accent"
            :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
            size="21" />
        </v-btn>
      </template>
      <span>Sort by Manufacturer</span>
    </v-tooltip>

    <v-tooltip location="top"
      open-delay="300">
      <template #activator="{ props }">
        <v-btn v-bind="props"
          color="panel"
          flat
          tile
          size="small"
          @click="setSort('Created')">
          <v-icon icon="mdi-clock-outline"
            size="21"
            color="accent" />
          <v-icon v-if="sort === 'Created'"
            color="accent"
            :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
            size="21" />
        </v-btn>
      </template>
      <span>Sort by created timestamp</span>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserStore } from '@/stores';

defineOptions({ name: 'HangarSort' })

const sort = ref('Name')
const asc = ref(true)

sort.value = UserStore().User.View('hangarSort', 'Created');
    asc.value = UserStore().User.View('hangarAsc', false);

sort.value = UserStore().User.View('hangarSort', 'Created');
    asc.value = UserStore().User.View('hangarAsc', false);

function setSort(sort: string) {
      if (sort.value === sort) {
        asc.value = !asc.value;
      } else {
        sort.value = sort;
        asc.value = true;
      }

      UserStore().User.SetView('hangarSort', sort.value);
      UserStore().User.SetView('hangarAsc', asc.value);
    }
</script>
