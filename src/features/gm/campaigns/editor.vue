<template>
  <div>
    <div v-if="!campaign">ERR: NO CAMPAIGN LOADED</div>
    <v-row v-else no-gutters>
      <campaign-editor-sidebar
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
              :item="selected"
              @delete="deleteCampaignPage(selected)"
              @preview="showPreview($event)" />
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </div>
  <v-dialog v-if="campaign" v-model="previewDialog" fullscreen>
    <v-card class="pb-6">
      <component
        v-if="previewItemComponent"
        :is="previewItemComponent"
        :campaign="campaign"
        :item="selected" />
      <div
        class="bg-panel"
        style="
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          overflow-x: hidden;
          overflow-y: hidden;
        ">
        <v-row dense align="center" class="px-4 py-1">
          <v-col>
            <v-chip size="small">Currently viewing</v-chip>
            {{ campaign.Title }} &mdash; Credits
          </v-col>
          <v-col cols="auto">
            <v-btn size="small" variant="tonal" color="accent" @click="previewDialog = false">
              Close Preview
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import campaignEditorSidebar from './_components/campaignEditorSidebar.vue';
import Overview from './pages/overview.vue';
import Credits from '@/features/compendium/Views/CampaignLibrary/pages/credits.vue';
import ContentPage from '@/features/compendium/Views/CampaignLibrary/pages/contentPage.vue';

import Page from './pages/CampaignPage.vue';

import { CampaignStore } from '@/stores';

export default {
  name: 'campaign-editor',
  components: { campaignEditorSidebar, Overview, Page, Credits, ContentPage },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    componentType: 'overview',
    previewType: 'credits',
    selected: null,
    previewDialog: false,
  }),

  computed: {
    itemComponent() {
      switch (this.componentType.toLowerCase()) {
        case 'overview':
          return Overview;
        default:
          return Page;
      }
    },
    previewItemComponent() {
      switch (this.previewType.toLowerCase()) {
        case 'credits':
          return Credits;
        default:
          return ContentPage;
      }
    },
    campaign() {
      return CampaignStore().Campaigns.find((c) => c.ID === this.id);
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
    showPreview(preview) {
      this.previewType = preview;
      this.previewDialog = true;
    },
    deleteCampaignPage(item) {
      if (item) {
        this.componentType = 'overview';
        item.DeleteSelf();
      }
    },
  },
};
</script>
