<template>
  <v-card v-if="latest" variant="tonal">
    <div class="text-overline ml-2">LATEST VERSION</div>
    <v-toolbar density="compact">
      <v-toolbar-title>
        {{ latest.ver }}
        <span class="text-caption text-disabled">
          <cc-slashes />
          {{ new Date(latest.date).toLocaleDateString(undefined, dOptions as any) }}
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
            size="small"
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
            size="small"
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
      <div v-if="shareCode">
        <v-tooltip max-width="300px" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              color="primary"
              variant="elevated"
              prepend-icon="mdi-code-block-brackets"
              @click="copyShareCode">
              Copy Share Code
            </v-btn>
          </template>
          <div class="text-center">
            <b class="text-accent">
              {{ shareCode.substring(0, 4) }}-{{ shareCode.substring(4, 8) }}
            </b>
            <v-divider />
            <span class="text-caption">
              Copy this share code for this campaign to your clipboard. Share codes can be used to
              import this campaign into another COMP/CON instance.
            </span>
          </div>
        </v-tooltip>
      </div>
      <v-tooltip v-else-if="isLoggedIn" location="top" max-width="300px">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-code-block-brackets"
            :loading="uploading"
            @click="upload">
            Generate Share Code
          </v-btn>
        </template>
        <span>
          Upload this campaign to the cloud repository to generate a share code for other users to
          import this campaign into their COMP/CON instance. Generating a share code will
          automatically update the cloud repository with the latest version of this campaign
          whenever a new version is published.
        </span>
      </v-tooltip>
      <v-spacer v-if="isLoggedIn" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';
import JSZip from 'jszip';
import { CampaignStore } from '../../store/campaign_store';
import { UserStore } from '@/stores';

export default {
  name: 'campaign-current-version-export',
  props: {
    campaign: { type: Object, required: true },
  },
  data: () => ({
    dOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    uploading: false,
  }),
  computed: {
    latest() {
      return this.campaign.VersionHistory.length
        ? this.campaign.VersionHistory[this.campaign.VersionHistory.length - 1]
        : null;
    },
    isLoggedIn() {
      return UserStore().IsLoggedIn;
    },
    shareCode() {
      return this.campaign.CloudController.ShareCode;
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
    async upload() {
      if (!this.isLoggedIn) {
        this.$notify({
          title: 'Login Required',
          text: `You must be logged in to upload campaign data to the cloud repository.`,
          data: { icon: 'cc:campaign', color: 'error' },
        });
        return;
      }
      console.log(this.campaign);
      try {
        this.uploading = true;
        await this.campaign.CloudController.UpdateCloud('campaign');
        this.$notify({
          title: 'Upload Success',
          text: `Cloud data updated!`,
          data: { icon: 'cc:campaign', color: 'success' },
        });
        console.log(this.campaign);
      } catch (error) {
        this.$notify({
          title: 'Upload Error',
          text: `Unable to update cloud: ${error}`,
          data: { icon: 'cc:campaign', color: 'error' },
        });
      } finally {
        this.uploading = false;
      }
    },
    copyShareCode() {
      navigator.clipboard.writeText(this.shareCode);
      this.$notify({
        title: 'Share Code Copied',
        text: `Share code copied to clipboard!`,
        data: { icon: 'cc:campaign', color: 'success' },
      });
    },
  },
};
</script>
