<template>
  <cc-share-code-importer
    ref="importer"
    importType="campaign"
    @set-query-result="queryResult = $event"
    @set-data="campaign = $event">
    <template #result>
      <campaign-detail-panel v-if="campaign" :campaign="campaign" />
    </template>

    <template #actions>
      <cc-button
        color="primary"
        :disabled="!($refs as any).importer.canDownload"
        @click="addCampaign()">
        Add Campaign
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script lang="ts">
import { CampaignStore } from '@/stores';
import CampaignDetailPanel from './CampaignDetailPanel.vue';

export default {
  name: 'share-code-dialog',
  components: { CampaignDetailPanel },
  data: () => ({
    queryResult: null as any,
    campaign: null as any,
  }),
  methods: {
    async addCampaign() {
      CampaignStore().AddCollectionCampaign(this.campaign);
      (this.$refs as any).importer.reset();
      (this.$refs as any).importer.close();
    },
  },
};
</script>
