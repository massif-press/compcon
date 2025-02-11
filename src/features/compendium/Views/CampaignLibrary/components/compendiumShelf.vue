<template>
  <v-card v-if="!campaigns.length" class="text-center py-6 text-disabled mt-4">
    <div class="heading">No Campaigns Found</div>
    <div class="text-caption">
      Campaigns can be imported via File Import or the Lancer Campaign Directory
    </div>
  </v-card>
  <div class="mt-4">
    <v-row dense justify="space-around">
      <v-col cols="auto" v-for="(c, n) in campaigns" class="mx-1">
        <v-badge :model-value="!!c.hasUpdate" color="secondary" content="!">
          <v-card
            variant="plain"
            :height="mobile ? 198 : 320"
            :width="mobile ? 150 : 250"
            style="border-width: 2px"
            @click="openInfo(c)">
            <v-img v-if="c.cover_image_url" :src="c.cover_image_url" style="height: 100%" cover />
            <v-row v-else align="center" justify="center" style="height: 100%">
              <v-col cols="auto" class="text-text text-center">
                <v-icon size="60" icon="cc:campaign" />
                <div class="heading">{{ c.title }}</div>
                <div class="text-caption">{{ c.subtitle }}</div>
                <v-divider class="mt-1" />
                <i class="text-caption">{{ c.author }}</i>
              </v-col>
            </v-row>
          </v-card>
        </v-badge>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" :fullscreen="mobile" :width="mobile ? '' : '80vw'">
      <v-card v-if="selected" style="overflow-y: hidden; position: relative">
        <cc-toolbar
          :title="selected.title"
          icon="cc:campaign"
          color="primary"
          style="position: sticky; top: 0; z-index: 10"
          class="border-b-sm"
          @close="dialog = false" />

        <cc-alert v-if="selected.hasUpdate" color="secondary" icon="mdi-information" prominent>
          <div class="text-cc-overline">
            There is a new version of this campaign available. Click the update below to download
            and install the latest version of this campaign.
          </div>
          <div class="text-right mt-1 mr-2">
            <cc-button size="small" :loading="loading" @click="updateCampaign()">
              Update Campaign
            </cc-button>
          </div>
        </cc-alert>

        <campaign-detail-panel :campaign="selected">
          <div class="text-right mt-2">
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="x-small"
                  tile
                  variant="tonal"
                  color="error"
                  prepend-icon="mdi-delete">
                  Remove from Collection
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  This will remove the campaign from your collection. Are you sure?
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn variant="text" @click="">Cancel</v-btn>
                  <v-spacer />
                  <v-btn variant="text" color="error" @click="removeCampaign(selected)">
                    Remove
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>
        </campaign-detail-panel>

        <div style="position: fixed; bottom: 8px; left: 8px; right: 2px">
          <cc-button
            block
            prepend-icon="mdi-chevron-double-right"
            color="primary"
            :to="`/srd/campaign/${selected.id}`">
            Open Campaign
          </cc-button>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { CampaignStore } from '@/stores';
import _ from 'lodash';
import CampaignDetailPanel from './CampaignDetailPanel.vue';
import { downloadFromS3, GetFromCode } from '@/io/apis/account';

export default {
  name: 'campaign-library-compendium',
  components: { CampaignDetailPanel },
  props: {
    search: {
      type: String,
      default: '',
    },
    sort: {
      type: String,
      default: 'title',
    },
    sortDir: {
      type: Boolean,
    },
  },
  data: () => ({
    selected: null as any,
    dialog: false,
    loading: false,
    dOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }),

  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    campaigns() {
      return _.orderBy(
        CampaignStore().CampaignCollection.filter((c) =>
          c.title.toLowerCase().includes(this.search.toLowerCase())
        ),
        this.sort,
        this.sortDir ? 'asc' : 'desc'
      );
    },
  },

  methods: {
    openInfo(p) {
      if (p) {
        this.selected = p;
        this.dialog = true;
      }
    },
    removeCampaign(campaign) {
      this.selected = null;
      CampaignStore().DeleteCollectionCampaign(campaign);
      this.dialog = false;
    },
    getLatest(publish_info) {
      return publish_info.version_history[publish_info.version_history.length - 1];
    },
    async updateCampaign() {
      this.loading = true;

      try {
        const code = this.selected.publish_info.code;
        if (!code) throw new Error('No share code found');
        const queryResult = await GetFromCode(code);
        const campaign = await downloadFromS3(queryResult.uri);
        console.log(queryResult, campaign);
        CampaignStore().AddCollectionCampaign(campaign);
        this.selected = campaign;
        this.$notify({
          title: 'Success',
          text: 'Campaign updated successfully',
          data: { color: 'success' },
        });
      } catch (err) {
        console.error(err);
        this.$notify({
          title: 'Error',
          text: 'Failed to update campaign',
          data: { color: 'error' },
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
