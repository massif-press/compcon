<template>
  <cc-compendium-browser :items="backgrounds" item-type="Background" :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">Pilot Background</div></template
    >
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
  }),
  computed: {
    backgrounds(): Background[] {
      return _.orderBy(CompendiumStore().Backgrounds, 'Name');
    },
  },
};
</script>
