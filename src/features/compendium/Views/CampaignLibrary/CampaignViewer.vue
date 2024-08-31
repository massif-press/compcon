<template>
  <div>
    <div v-if="!campaign">ERR: NO CAMPAIGN LOADED</div>
    <v-row v-else no-gutters>
      <sidebar
        :campaign="campaign"
        :current-page="currentPage"
        @set-selected="setSelected"
        @set-page="setPage" />
      <v-col>
        <v-fade-transition leave-absolute>
          <div style="padding-left: 256px; padding-bottom: 45px">
            <component
              v-if="itemComponent"
              :is="itemComponent"
              :campaign="campaign"
              :item="selected" />
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </div>
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
