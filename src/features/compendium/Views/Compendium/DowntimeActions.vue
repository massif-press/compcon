<template>
  <cc-compendium-browser
    :items="downtimeActions"
    item-type="Reserve"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">Downtime Actions</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import lancerdata from '@massif/lancer-data';

import _ from 'lodash';

export default {
  name: 'downtimeActions',

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
    downtimeActions() {
      return _.orderBy(CompendiumStore().DowntimeActions, 'Name');
    },
  },
};
</script>
