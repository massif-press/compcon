<template>
  <v-container fluid>
    <cc-compendium-browser
      :headers="headers"
      :items="features"
      title="NPC Features"
      no-filter
      lock-view
    />
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { NpcFeature } from '@/class';

export default {
  name: 'NpcFeatures',

  data: () => ({
    headers: [
      { title: 'Feature', align: 'left', value: 'Name' },
      { title: 'Type', align: 'left', value: 'FeatureType' },
      { title: 'Class', align: 'left', value: 'OriginClass' },
      { title: 'Set', align: 'left', value: 'OriginSet' },
    ],
  }),
  computed: {
    features(): NpcFeature[] {
      return CompendiumStore().NpcFeatures as NpcFeature[];
    },
  },
};
</script>
