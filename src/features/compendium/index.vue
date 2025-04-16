<template>
  <cc-tabs ref="tabs" fixed prominent @changed="setTab($event)">
    <template #tabs>
      <v-tab selected-class="bg-accent">Compendium</v-tab>
      <v-tab selected-class="bg-accent">System Reference</v-tab>
      <v-tab selected-class="bg-accent">Campaign Library</v-tab>
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
import { NavStore, UserStore } from '@/stores';
import CompendiumView from './Views/Compendium/index.vue';
import ReferenceView from './Views/Reference/index.vue';
import CampaignLibrary from './Views/CampaignLibrary/index.vue';

export default {
  name: 'compendium-index',
  components: { CompendiumView, ReferenceView, CampaignLibrary },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
  },
  mounted() {
    if (this.$route.query.tab) {
      (this.$refs.tabs as any).setTab(parseInt(this.$route.query.tab as string));
    } else {
      this.setTab(UserStore().User.View('CompendiumTab', 0));
    }
  },
  methods: {
    setTab(tab: number) {
      if (!this.$refs.tabs) return;
      UserStore().User.SetView('CompendiumTab', tab);
      (this.$refs as any).tabs.setTab(tab);
    },
  },
};
</script>
