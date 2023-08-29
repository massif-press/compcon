<template>
  <cc-compendium-browser
    :items="statuses"
    item-type="Status"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Statuses & Conditions</div></template
    >
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

import { Status } from '@/classes/Status';

export default {
  name: 'statuses',

  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Icon', key: 'Icon', sortable: false },
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'StatusType' },
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
    statuses(): Status[] {
      return CompendiumStore().Statuses;
    },
  },
};
</script>
