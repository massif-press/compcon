<template>
  <cc-compendium-browser
    :items="bonuses"
    :itemType="'CoreBonus'"
    :table-headers="headers"
    :options="options">
    <template #header> <div class="heading h3 text-center text-accent">Core Bonuses</div></template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import { CoreBonus } from '@/class';

export default {
  name: 'CoreBonuses',

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
      return _.orderBy(
        CompendiumStore().CoreBonuses.filter((x: CoreBonus) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
