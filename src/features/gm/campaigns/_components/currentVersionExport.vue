<template>
  <v-card v-if="latest" variant="tonal">
    <v-toolbar density="compact">
      <v-toolbar-title>
        {{ latest.ver }}
        <span class="text-caption text-disabled">
          <cc-slashes />
          {{ new Date(latest.date).toLocaleDateString('en-us', dOptions as any) }}
        </span>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <div class="text-caption text-disabled">Latest Changes:</div>
      {{ latest.changes }}
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-tooltip location="top" max-width="300px">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-upload"
            @click="exportLcd()">
            Export .lcd Package
          </v-btn>
        </template>
        <span>
          Download a Lancer Campaign Distributable (.lcd) file that can be imported into another
          user's COMP/CON
        </span>
      </v-tooltip>

      <v-spacer />
      <v-tooltip location="top" max-width="300px">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-content-save"
            @click="saveLocalCollection()">
            Save to Local Collection
          </v-btn>
        </template>
        <span>
          Save a read-only copy of this campaign into your local Campaign Library for use in active
          mode or online play
        </span>
      </v-tooltip>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';
import JSZip from 'jszip';
import { CampaignStore } from '../../store/campaign_store';

export default {
  name: 'campaign-current-version-export',
  props: {
    campaign: { type: Object, required: true },
  },
  data: () => ({
    dOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }),
  computed: {
    latest() {
      return this.campaign.VersionHistory.length
        ? this.campaign.VersionHistory[this.campaign.VersionHistory.length - 1]
        : null;
    },
  },

  methods: {
    async exportLcd() {
      const filename = `${this.campaign.Name} - ${this.latest.ver}.lcd`;
      var zip = new JSZip();

      zip.file('campaign_data.json', JSON.stringify(Campaign.Serialize(this.campaign as Campaign)));

      var content = await zip.generateAsync({ type: 'blob' });

      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(content);
      link.download = filename;

      // Add the link to the DOM and trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async saveLocalCollection() {
      try {
        await CampaignStore().AddCollectionCampaign(Campaign.Serialize(this.campaign as Campaign));
        this.$notify({
          title: 'Import Complete',
          text: `Campaign added to local collection!`,
          data: { icon: 'cc:campaign', color: 'success' },
        });
      } catch (error) {
        this.$notify({
          title: 'Import Error',
          text: `Unable to transfer campaign: ${error}`,
          data: { icon: 'cc:campaign', color: 'error' },
        });
      }
    },
  },
};
</script>
