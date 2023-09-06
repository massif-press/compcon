<template>
  <cc-compendium-browser
    :items="environments"
    item-type="Environment"
    :table-headers="headers"
    :options="options"
  >
    <template #header> <div class="heading h3 text-center text-accent">Environments</div></template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

export default {
  name: 'environments',

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
    environments() {
      return CompendiumStore().Environments;
    },
  },
};
</script>
