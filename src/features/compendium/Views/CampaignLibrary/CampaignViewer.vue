<template>
  <v-layout style="position: relative">
    <cc-button
      :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
      size="small"
      color="primary"
      :style="`position: absolute; z-index: 999; left: ${showNav ? '258' : '4'}px; top: 6px`"
      @click="(showNav as any) = !showNav" />
    <div v-if="!campaign">ERR: NO CAMPAIGN LOADED</div>
    <v-row v-else no-gutters>
      <v-slide-x-transition>
        <sidebar
          v-if="showNav"
          :campaign="campaign"
          :current-page="currentPage"
          @set-selected="setSelected"
          @set-page="setPage" />
      </v-slide-x-transition>
      <v-col>
        <v-fade-transition leave-absolute>
          <div :style="`padding-left: ${!mobile && showNav ? '256px' : 0}; padding-bottom: 45px`">
            <component
              v-if="itemComponent"
              :is="itemComponent"
              :campaign="campaign"
              :item="selected" />
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';
import sidebar from './components/sidebar.vue';
import Credits from './pages/credits.vue';
import Page from './pages/contentPage.vue';
import Indices from './pages/indices.vue';

import { CampaignStore } from '@/stores';

export default {
  name: 'campaign-viewer',
  components: { sidebar, Credits, Page, Indices },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    showNav: true,
    componentType: 'Credits',
    selected: null,
    campaign: null as any,
  }),
  async created() {
    await CampaignStore().LoadCampaigns();
    const data = CampaignStore().CampaignCollection.find((c) => c.id === this.id);
    this.campaign = new Campaign(data);
  },

  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    itemComponent() {
      switch (this.componentType.toLowerCase()) {
        case 'credits':
          return Credits;
        case 'index':
          return Indices;
        default:
          return Page;
      }
    },
    currentPage() {
      return this.componentType;
    },
  },
  methods: {
    setPage(type) {
      this.componentType = type;
      this.selected = null;
    },
    setSelected(item) {
      this.componentType = item.SectionType;
      this.selected = item;
    },
  },
};
</script>
