<template>
  <cc-compendium-browser
    ref="browser"
    :items="features"
    item-type="NpcFeature"
    :table-headers="headers"
    :options="options">
    <template #header>
      <div class="heading h3 text-center text-accent">NPC Features</div>
    </template>
  </cc-compendium-browser>
</template>

<script lang="ts">
import _ from 'lodash';

import { CompendiumStore } from '@/stores';
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';

export default {
  name: 'NpcFeatures',

  data: () => ({
    selectedTier: 1,
    tieredView: false,
    options: {
      views: ['single', 'table', 'cards'],
      initialView: 'single',
      groups: ['lcp', 'featureType', 'origin'],
      initialGroup: 'lcp',
    },
  }),

  computed: {
    features(): NpcFeature[] {
      return _.orderBy(CompendiumStore().NpcFeatures, ['FeatureType', 'Origin.Name', 'Name']);
    },
    headers() {
      const h = [
        { title: 'Content Pack', key: 'LcpName' },
        { title: 'Origin', key: 'Origin' },
        { title: 'Name', key: 'Name' },
        { title: 'Tags', key: 'Tags' },
      ] as any[];
      return h;
    },
  },
};
</script>
