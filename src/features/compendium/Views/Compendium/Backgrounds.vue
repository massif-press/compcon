<template>
  <cc-compendium-browser
    :items="backgrounds"
    item-type="Background"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">Pilot Background</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import { Background } from '@/class';

import { CompendiumStore } from '@/stores';

export default {
  name: 'backgrounds',

  data: () => ({
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp'],
      initialGroup: 'lcp',
      noSource: true,
    },
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      { title: '', key: 'Terse' },
    ],
  }),
  computed: {
    backgrounds(): Background[] {
      return _.orderBy(CompendiumStore().Backgrounds, 'Name');
    },
  },
};
</script>
