<template>
  <new-compendium-browser
    :items="backgrounds"
    item-type="Background"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Pilot Background</div></template
    >
  </new-compendium-browser>
</template>

<script lang="ts">
import { Background } from '@/class';
import NewCompendiumBrowser from '../../components/NewCompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'backgrounds',
  components: { NewCompendiumBrowser },
  data: () => ({
    headers: [
      { title: 'Source', key: 'Source' },
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
    backgrounds(): Background[] {
      return CompendiumStore().Backgrounds;
    },
  },
};
</script>
