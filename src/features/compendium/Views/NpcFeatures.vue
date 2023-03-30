<template>
  <v-container fluid>
    <compendium-browser
      :headers="headers"
      :items="features"
      no-filter
      lock-view
    >
      NPC Features
    </compendium-browser>
  </v-container>
</template>

<script lang="ts">
import CompendiumBrowser from '../components/CompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';
import { NpcFeature } from '@/class';

export default {
  name: 'NpcFeatures',
  components: { CompendiumBrowser },
  data: () => ({
    headers: [
      { text: 'Feature', align: 'left', value: 'Name' },
      { text: 'Type', align: 'left', value: 'FeatureType' },
      { text: 'Class', align: 'left', value: 'OriginClass' },
      { text: 'Set', align: 'left', value: 'OriginSet' },
    ],
  }),
  computed: {
    compendium(): CompendiumStore {
      return CompendiumStore();
    },
    features(): NpcFeature[] {
      return this.compendium.NpcFeatures;
    },
  },
};
</script>
