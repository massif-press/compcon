<template>
  <cc-compendium-browser :items="downtimeActions"
    item-type="DowntimeAction"
    :table-headers="headers"
    :options="options"
    view-key="cb-downtime-actions">
    <template #header>
      <div class="heading h3 text-center text-accent">Downtime Actions</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

import { orderBy } from 'lodash-es';

export default {
  name: 'DowntimeActions',

  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
    ],
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
      initialGroup: 'none',
      noSource: true,
    },
  }),
  computed: {
    downtimeActions() {
      return orderBy(CompendiumStore().DowntimeActions, 'Name');
    },
  },
};
</script>
