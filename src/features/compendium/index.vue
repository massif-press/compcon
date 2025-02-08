<template>
  <cc-tabs ref="tabs" fixed @changed="setTab($event)">
    <template #tabs>
      <v-tab>Compendium</v-tab>
      <v-tab>System Reference</v-tab>
      <v-tab>Campaign Library</v-tab>
    </template>
    <div :class="mobile ? 'my-2' : 'my-4'" />

    <v-window-item>
      <compendium-view />
    </v-window-item>
    <v-window-item>
      <reference-view />
    </v-window-item>
    <v-window-item>
      <campaign-library />
    </v-window-item>
  </cc-tabs>
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
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
  },
  mounted() {
    if (this.$route.query.tab) {
      (this.$refs.tabs as any).setTab(parseInt(this.$route.query.tab as string));
      this.setTab(parseInt(this.$route.query.tab as string));
    }
  },
  methods: {
    setTab(tab: number) {
      NavStore().setSrdTab(tab);
    },
  },
};
</script>
