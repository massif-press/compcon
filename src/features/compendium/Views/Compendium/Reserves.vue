<template>
  <cc-compendium-browser
    :items="reserves"
    item-type="Reserve"
    :table-headers="headers"
    :options="options"
  >
    <template #header> <div class="heading h3 text-center text-primary">Reserves</div></template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';

import _ from 'lodash';

export default {
  name: 'reserves',

  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'Type' },
    ],
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'type'],
      initialGroup: 'type',
      noSource: true,
    },
  }),
  computed: {
    reserves() {
      return CompendiumStore().Reserves.filter((x) => !x.IsHidden);
    },
  },
};
</script>
