<template>
  <cc-compendium-browser :items="backgrounds"
    item-type="Background"
    :table-headers="headers"
    :options="options"
    view-key="cb-backgrounds">
    <template #header>
      <div class="heading h3 text-center text-accent">Pilot Background</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import { orderBy } from 'lodash-es';
import { Background } from '@/classes/Background'

import { CompendiumStore } from '@/stores';

export default {
  name: 'Backgrounds',

  data: () => ({
    options: {
      views: ['list', 'table'],
      initialView: 'list',
      groups: ['lcp', 'none'],
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
      return orderBy(CompendiumStore().Backgrounds, 'Name');
    },
  },
};
</script>
