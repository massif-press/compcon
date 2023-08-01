<template>
  <compendium-browser :items="backgrounds" item-type="Background" :options="options">
    <template #header>
      <div class="heading h3 text-center text-primary">Pilot Background</div></template
    >
  </compendium-browser>
</template>

<script lang="ts">
import { Background } from '@/class';
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'backgrounds',
  components: { CompendiumBrowser },
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
      return CompendiumStore().Backgrounds;
    },
  },
};
</script>
