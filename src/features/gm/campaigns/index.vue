<template>
  <v-container>
    <div class="my-2">
      <v-card>
        <v-card-title>
          <div class="heading h3 text-accent">Campaign Catalog</div>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row dense class="heading text-secondary" style="font-size: 10pt">
            <v-col cols="3">Campaign</v-col>
            <v-col cols="2">Author</v-col>
            <v-col class="text-center">Suggested Players</v-col>
            <v-col class="text-center">Missions</v-col>
            <v-col class="text-center">Beats</v-col>
            <v-col class="text-center">Encounters</v-col>
            <v-col class="text-center">Requirements</v-col>
            <v-col class="text-center">Options</v-col>
          </v-row>
          <v-divider />
          <div v-if="!campaigns.length" class="text-center text-disabled pa-5">
            <i>No data</i>
          </div>

          <tbody></tbody>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" variant="tonal" class="mx-2" size="small">
            <v-icon start icon="mdi-import" />
            Import Campaign
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="mt-5">
        <v-card-title>
          <div class="heading h3 text-accent">Unpublished Campaigns</div>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row dense class="heading text-secondary" style="font-size: 10pt">
            <v-col cols="3">Campaign</v-col>
            <v-col cols="2">Author</v-col>
            <v-col class="text-center">Suggested Players</v-col>
            <v-col class="text-center">Beats</v-col>
            <v-col class="text-center">Missions</v-col>
            <v-col class="text-center">Encounters</v-col>
            <v-col class="text-center">Options</v-col>
          </v-row>
          <v-divider />
          <div v-if="!unpublished.length" class="text-center text-disabled pa-5">
            <i>No data</i>
          </div>

          <tbody></tbody>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" variant="tonal" class="mx-2" size="small">
            <v-icon start icon="mdi-plus" />
            Create New Campaign
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';

import { CampaignStore } from '@/stores';

export default {
  name: 'campaign-landing',
  computed: {
    campaigns() {
      return CampaignStore().getPublishedCampaigns;
    },

    unpublished() {
      return CampaignStore().getUnpublishedCampaigns;
    },
  },
  methods: {
    openNewCampaign() {
      // const c = new Campaign();
      // this.cstore.addCampaign(c);
      // this.openEditCampaign(c);
    },
    async openEditCampaign(c) {
      // this.cstore.setEditCampaign(c.ID);
      // await this.$nextTick();
      // this.$router.push('campaigns/edit');
    },
  },
};
</script>
