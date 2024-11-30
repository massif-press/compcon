<template>
  <div>
    <v-row>
      <v-spacer />
      <v-card v-if="campaigns.length">
        <v-tooltip location="top" open-delay="300">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="small" class="rounded-e-0" @click="setSort('title')">
              <v-icon icon="mdi-format-text" />
              <v-icon v-if="sort === 'title'" :icon="`mdi-chevron-${asc ? 'up' : 'down'}`" />
            </v-btn>
          </template>
          <span>Sort by Title</span>
        </v-tooltip>

        <v-tooltip location="top" open-delay="300">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="small" tile @click="setSort('author')">
              <v-icon icon="mdi-fountain-pen" />
              <v-icon v-if="sort === 'author'" :icon="`mdi-chevron-${asc ? 'up' : 'down'}`" />
            </v-btn>
          </template>
          <span>Sort by Author</span>
        </v-tooltip>

        <v-tooltip location="top" open-delay="300">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="small" tile @click="setSort('players')">
              <v-icon size="24" icon="cc:pilot" />
              <v-icon v-if="sort === 'players'" :icon="`mdi-chevron-${asc ? 'up' : 'down'}`" />
            </v-btn>
          </template>
          <span>Sort by Suggested Players</span>
        </v-tooltip>

        <v-tooltip location="top" open-delay="300">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="small" class="rounded-s-0" @click="setSort('ll')">
              <v-icon size="28" icon="cc:license" />
              <v-icon v-if="sort === 'll'" :icon="`mdi-chevron-${asc ? 'up' : 'down'}`" />
            </v-btn>
          </template>
          <span>Sort by License Level</span>
        </v-tooltip>
      </v-card>
    </v-row>
    <dense-shelf v-if="density === 'compact'" :search="search" :sort="sort" :sort-dir="asc" />
    <compendium-shelf v-else :search="search" :sort="sort" :sort-dir="asc" />
  </div>

  <v-footer :app="density !== 'compact'">
    <v-spacer />
    <v-dialog v-model="libDialog" width="50vw">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="secondary" variant="tonal" class="mx-2" size="small">
          <v-icon start icon="cc:campaign" />
          LANCER Campaign Directory
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Not yet implemented</v-card-title>
        <v-card-text>
          <p>
            After v3 release this will be a searchable directory of Massif and community-created
            campaigns. If you're logged in and have linked an itch.io account, you'll be able to
            import campaigns directly from the directory. Otherwise you'll be directed to the
            itch.io page to purchase and download the campaign.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" @click="libDialog = false">Dismiss</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <campaign-share-code-dialog />

    <v-dialog v-model="importDialog" max-width="750px">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          color="accent"
          variant="tonal"
          class="mx-2"
          size="small"
          @click="importType = 'file'">
          <v-icon start icon="mdi-import" />
          File Import
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Import Lancer Campaign Data</v-card-title>
        <v-divider />
        <v-card-text>
          <v-row align="center" justify="center">
            <v-col cols="10">
              <v-file-input
                v-model="<any>fileValue"
                variant="outlined"
                label="Select .lcd File"
                accept=".lcd"
                prepend-icon="mdi-paperclip"
                @change="stageImport"
                @click:clear="reset" />
            </v-col>
          </v-row>
          <div v-if="errorMessage" class="text-error text-center mt-2">{{ errorMessage }}</div>
          <div v-else-if="stagedData">
            <div class="text-caption">Staged Campaign Data</div>
            <v-card variant="tonal">
              <v-card-title>{{ stagedData.title }}</v-card-title>
              <v-card-subtitle>{{ stagedData.subtitle }}</v-card-subtitle>
              <v-card-text class="pl-6">
                <div class="text-center">
                  <i>{{ stagedData.author }}</i>
                </div>
                {{ stagedData.description }}

                <v-alert
                  v-if="importSameId"
                  variant="outlined"
                  :color="importIsOlder ? 'error' : 'warning'"
                  class="my-2"
                  density="compact"
                  icon="mdi-alert">
                  <div class="text-caption">Warning</div>
                  <div v-if="importIsOlder" class="my-2 font-weight-bold">
                    The existing campaign is newer than the imported data.
                  </div>
                  This import data will overwrite an existing campaign with the same ID ({{
                    importSameId.title
                  }}). The existing campaign was last updated on
                  {{ new Date(importSameId.save.lastModified).toLocaleString() }}.
                </v-alert>

                <div class="text-caption text-right">
                  Last Updated: &nbsp;
                  <b>{{ new Date(stagedData.save.lastModified).toLocaleString() }}</b>
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn color="accent" @click="importCampaign">Import Campaign</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="accent" @click="importDialog = false">Dismiss</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-footer>
</template>

<script lang="ts">
import { CampaignStore, UserStore } from '@/stores';
import DenseShelf from './denseShelf.vue';
import CompendiumShelf from './compendiumShelf.vue';
import JSZip from 'jszip';
import CampaignShareCodeDialog from './campaignShareCodeDialog.vue';
import { GetFromCode } from '@/io/apis/account';

export default {
  name: 'campaign-bookshelf',
  components: { DenseShelf, CompendiumShelf, CampaignShareCodeDialog },
  props: {
    density: { type: String, default: 'default' },
    search: { type: String, default: '' },
  },
  data: () => ({
    libDialog: false,
    importDialog: false,
    deleteText: '',
    fileValue: null as any,
    stagedData: null as any,
    errorMessage: '',
    sort: 'title',
    asc: true,
    importType: 'file',
  }),

  mounted() {
    this.checkForUpdates();
  },

  computed: {
    campaigns() {
      return CampaignStore().CampaignCollection.filter((c) =>
        c.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    importSameId() {
      if (!this.stagedData) return null;
      return CampaignStore().CampaignCollection.find((c) => c.id === this.stagedData.id);
    },

    importIsOlder() {
      if (!this.stagedData) return false;
      const existing = CampaignStore().CampaignCollection.find((c) => c.id === this.stagedData.id);
      if (!existing) return false;
      return existing.save.lastModified > this.stagedData.save.lastModified;
    },
  },

  methods: {
    reset() {
      this.fileValue = null;
      this.stagedData = null;
      this.errorMessage = '';
    },

    setSort(sort: string) {
      if (this.sort === sort) {
        this.asc = !this.asc;
      } else {
        this.sort = sort;
        this.asc = true;
      }
    },

    async stageImport(file: any) {
      if (!file) return;
      const unzipped = await JSZip.loadAsync(file.target.files[0]);
      const json = await unzipped.file('campaign_data.json')?.async('text');

      if (!json) {
        this.errorMessage = 'No campaign data file found in the selected .lcd file.';
        return;
      }

      const data = JSON.parse(json);

      try {
        this.stagedData = data;
      } catch (e) {
        console.error(e);
        this.stagedData = null;
        this.errorMessage = JSON.stringify(e);
      }
    },

    importCampaign() {
      if (!this.stagedData) return;
      CampaignStore().AddCollectionCampaign(this.stagedData);
      this.reset();
      this.importDialog = false;
    },

    async checkForUpdates() {
      if (!UserStore().IsLoggedIn) return;
      for (const campaign of CampaignStore().CampaignCollection) {
        if (campaign.publish_info?.code) {
          const metadata = await GetFromCode(campaign.publish_info.code);
          if (metadata.item_modified !== campaign.save.lastModified) campaign.hasUpdate = true;
        }
      }
    },
  },
};
</script>
