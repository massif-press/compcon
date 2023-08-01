<template>
  <compendium-browser
    :items="bonuses"
    :itemType="'CoreBonus'"
    :table-headers="headers"
    :options="options"
  >
    <template #header>
      <div class="heading h3 text-center text-primary">Core Bonuses</div></template
    >
  </compendium-browser>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { CoreBonus } from '@/class';
import CompendiumBrowser from '../../components/CompendiumBrowser.vue';

export default {
  name: 'CoreBonuses',
  components: { CompendiumBrowser },
  data: () => ({
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
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
