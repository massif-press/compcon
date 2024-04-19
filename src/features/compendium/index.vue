<template>
  <v-tabs :model-value="tab" density="compact" class="mt-2" fixed-tabs color="accent">
    <v-tab @click="setTab(0)">Compendium</v-tab>
    <v-tab @click="setTab(1)">System Reference</v-tab>
    <v-tab @click="setTab(2)">Campaign Library</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item>
      <compendium-view />
    </v-window-item>
    <v-window-item>
      <reference-view />
    </v-window-item>
    <v-window-item>
      <campaign-library />
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import { NavStore } from '@/stores';
import CompendiumView from './Views/Compendium/index.vue';
import ReferenceView from './Views/Reference/index.vue';
import CampaignLibrary from './Views/CampaignLibrary/index.vue';

export default {
  name: 'compendium-index',
  components: { CompendiumView, ReferenceView, CampaignLibrary },
  computed: {
    tab(): number {
      return NavStore().SrdTab;
    },
  },
  methods: {
    setTab(tab: number) {
      NavStore().setSrdTab(tab);
    },
  },
};
</script>
