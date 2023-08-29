<template>
  <cc-compendium-browser
    :items="sitreps"
    item-type="Sitrep"
    :table-headers="headers"
    :options="options"
  >
    <template #header> <div class="heading h3 text-center text-primary">Sitreps</div></template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'sitreps',

  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
    ],
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp'],
      initialGroup: 'lcp',
      noSource: true,
    },
  }),
  computed: {
    sitreps() {
      return CompendiumStore().Sitreps;
    },
  },
};
</script>
