<template>
  <v-dialog max-width="85vw">
    <template #activator="{ props }">
      <v-btn v-bind="props" block size="small" variant="tonal" class="my-2 pa-2">
        Publish Campaign
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-card-title>Publish Campaign</v-card-title>
        <v-divider />
        <v-card-text>
          <div class="mx-auto" style="width: 80%">
            <current-version-export v-if="campaign.Latest" :campaign="campaign" />
            <v-alert v-else color="accent" variant="tonal" border icon="mdi-information">
              <div class="text-caption">
                This campaign has not been published. Publish a first version of this campaign to
                export a campaign package via file or share code.
              </div>
            </v-alert>
          </div>
          <div class="my-2 text-center">
            <div class="text-caption">Release for</div>
            <div class="mb-1 text-accent">
              {{ new Date().toLocaleDateString(undefined, dOptions as any) }}
            </div>
            <div class="text-caption">Version</div>
            <v-row style="width: 400px" class="mx-auto">
              <v-col>
                <div class="text-caption text-disabled">Major</div>
                <v-text-field
                  v-model="major"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details />
              </v-col>
              <v-col>
                <div class="text-caption text-disabled">Minor</div>
                <v-text-field
                  v-model="minor"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details />
              </v-col>
              <v-col>
                <div class="text-caption text-disabled">Patch</div>
                <v-text-field
                  v-model="patch"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details />
              </v-col>
            </v-row>
            <v-expand-transition>
              <div v-if="!verifyVersion" class="text-caption text-error ma-1">
                <b>Version {{ version }} already exists!</b>
              </div>
            </v-expand-transition>
          </div>

          <div class="text-left mx-auto text-caption" style="width: 80%">
            Release notes and changelog:
            <v-textarea v-model="changes" outlined dense rows="3" auto-grow />
          </div>
          <div class="text-center">
            <v-btn
              size="large"
              variant="tonal"
              color="accent"
              prepend-icon="mdi-upload"
              class="my-2"
              :disabled="!verifyVersion"
              @click="publishCampaign()">
              Publish New Version
            </v-btn>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';
import CurrentVersionExport from './currentVersionExport.vue';
import JSZip from 'jszip';

export default {
  name: 'campaign-publisher',
  components: { CurrentVersionExport },
  props: {
    campaign: { type: Object, required: true },
  },
  data: () => ({
    major: 0,
    minor: 0,
    patch: 0,
    changes: '',
    dOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }),
  emits: ['published'],
  created() {
    if (!this.versionHistory.length) {
      this.major = 1;
      this.minor = 0;
      this.patch = 0;
    } else {
      const latest = this.versionHistory[this.versionHistory.length - 1].ver
        .split('.')
        .map((n) => parseInt(n));
      this.major = latest[0];
      this.minor = latest[1] + 1;
      this.patch = latest[2];
    }
  },
  computed: {
    versionHistory() {
      return this.campaign.VersionHistory || [];
    },
    version() {
      return `${this.major}.${this.minor}.${this.patch}`;
    },
    latest() {
      return this.versionHistory.length
        ? this.versionHistory[this.versionHistory.length - 1]
        : null;
    },
    verifyVersion() {
      if (Number(this.major) + Number(this.minor) + Number(this.patch) < 1) return false;
      let res = true;
      this.versionHistory.forEach((hist) => {
        if (hist.ver === this.version) res = false;
      });
      return res;
    },
  },
  methods: {
    async publishCampaign() {
      (this.campaign as Campaign).Publish(this.version, this.changes);
      if (this.campaign.CloudController.ShareCode) {
        await this.campaign.CloudController.UpdateCloud('campaign');
      }
      this.$emit('published');
      this.$notify({
        title: 'Campaign Published',
        text: `Version ${this.version} of ${this.campaign.Name} has been published.`,
        data: { color: 'success' },
      });
    },
    async exportLcd() {
      const filename = `${this.campaign.Name} - ${this.version}.lcd`;
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
    savePublished() {
      (this.campaign as Campaign).Publish(this.version, this.changes);
    },
  },
};
</script>
