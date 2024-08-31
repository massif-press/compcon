<template>
  <v-navigation-drawer permanent fixed style="overflow-y: scroll" class="pb-8">
    <v-row density="compact" class="pa-2" justify="center" align="center">
      <v-col cols="auto" class="heading h3 text-center">
        {{ campaign.Title }}
        <div class="text-caption text-disabled">{{ campaign.Subtitle }}</div>
      </v-col>
    </v-row>

    <v-divider class="mb-3" />
    <div class="ma-2">
      <v-btn
        variant="tonal"
        :color="currentPage === 'overview' ? 'secondary' : ''"
        block
        size="small"
        @click="setPage('overview')">
        Campaign Information
      </v-btn>

      <v-divider class="my-2" />

      <indented-list
        :items="campaign.Contents"
        :level="0"
        :selected="<any>selected"
        @clicked="setSelected($event)" />

      <section-add-menu main :item="campaign" />
    </div>
    <v-divider class="my-2" />
    <div class="px-2">
      <v-btn
        block
        size="small"
        class="my-2 pa-2"
        :color="!dirty ? '' : 'secondary'"
        :disabled="!dirty"
        @click="save">
        Save Campaign
      </v-btn>
      <v-dialog max-width="650px">
        <template #activator="{ props }">
          <v-btn v-bind="props" block size="small" variant="tonal" class="my-2 pa-2">
            Export Campaign
          </v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card>
            <v-card-title>Export Campaign</v-card-title>
            <v-divider />
            <v-card-text v-if="campaign.VersionHistory.length">
              <div class="text-caption">Current Published Version</div>
              <current-version-export :campaign="campaign" />
              <v-divider />
            </v-card-text>
            <v-card-text>
              <p class="text-caption">
                <i>
                  You can export this editable campaign as a JSON file for backup, device transfer,
                  or collaborative editing.
                </i>
              </p>
              <p v-if="!campaign.VersionHistory.length" class="text-caption">
                <i>
                  To produce a campaign package suitable for distribution, select
                  <b class="text-secondary">Publish Campaign</b>
                  instead.
                </i>
              </p>
              <div class="text-right">
                <v-btn
                  variant="tonal"
                  color="accent"
                  prepend-icon="mdi-download"
                  class="my-2"
                  @click="exportEditable">
                  Export Campaign JSON
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
      <campaign-publisher :campaign="campaign" @published="save()" />
    </div>
    <div style="position: absolute; bottom: 0; left: 0; right: 0" class="px-2">
      <v-btn
        block
        size="small"
        class="my-2 pa-2"
        color="accent"
        variant="tonal"
        prepend-icon="mdi-arrow-left"
        to="/gm/campaigns">
        Return to Index
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Campaign } from '@/classes/campaign/Campaign';
import { CampaignStore } from '../../store/campaign_store';
import CampaignPublisher from './campaignPublisher.vue';
import CurrentVersionExport from './currentVersionExport.vue';
import IndentedList from '@/features/compendium/Views/CampaignLibrary/components/IndentedList.vue';
import exportAsJson from '@/util/jsonExport';
import sectionAddMenu from './sectionAddMenu.vue';

export default {
  name: 'campaign-editor-sidebar',
  components: { IndentedList, CampaignPublisher, CurrentVersionExport, sectionAddMenu },
  props: {
    campaign: { type: Object, required: true },
    currentPage: { type: String },
  },
  data: () => ({
    lastSave: '',
    selected: null,
  }),
  created() {
    this.lastSave = this.campaign.SaveController.LastModified;
  },
  computed: {
    dirty() {
      return this.lastSave !== this.campaign.SaveController.LastModified;
    },
  },
  methods: {
    async save() {
      this.campaign.SaveController.save();
      CampaignStore().SaveCampaigns();
      setTimeout(() => {
        this.lastSave = this.campaign.SaveController.LastModified;
      }, 300);
    },
    setPage(type: string) {
      this.$emit('set-page', type);
      this.selected = null;
    },
    setSelected(item: any) {
      this.selected = item;
      this.$emit('set-selected', item);
    },
    exportEditable() {
      const filename =
        this.campaign.Title.replace(/\s/g, '_').toLowerCase() +
        new Date().toLocaleString() +
        '.json';
      exportAsJson(Campaign.Serialize(this.campaign as Campaign), filename);
    },
  },
};
</script>
