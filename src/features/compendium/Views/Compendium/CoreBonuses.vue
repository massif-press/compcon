<template>
  <new-compendium-browser
    :items="bonuses"
    :itemType="'CoreBonus'"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Core Bonuses</div></template
    >
  </new-compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { CoreBonus } from '@/class';
import NewCompendiumBrowser from '../../components/NewCompendiumBrowser.vue';

export default {
  name: 'CoreBonuses',
  components: { NewCompendiumBrowser },
  data: () => ({
    headers: [
      { title: 'Source', key: 'Source' },
      { title: 'Name', key: 'Name' },
    ],
    options: {
      views: ['list', 'table', 'cards'],
      initialView: 'cards',
      groups: ['source', 'lcp'],
      initialGroup: 'source',
    },
  }),
  computed: {
    bonuses(): CoreBonus[] {
      return CompendiumStore().CoreBonuses.filter((x: CoreBonus) => !x.IsHidden);
    },
  },
};
</script>
