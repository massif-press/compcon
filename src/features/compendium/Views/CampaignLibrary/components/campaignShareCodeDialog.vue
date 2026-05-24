<template>
  <cc-share-code-importer ref="importer"
    import-type="campaign"
    :user-id="userId"
    :remote-items="remoteItems"
    @set-query-result="queryResult = $event"
    @set-data="campaign = $event">
    <template #result>
      <campaign-detail-panel v-if="campaign"
        :campaign="campaign" />
    </template>

    <template #actions>
      <cc-button color="primary"
        @click="addCampaign()">
        Add Campaign
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script lang="ts">
import { CampaignStore, UserStore } from '@/stores';
import CampaignDetailPanel from './CampaignDetailPanel.vue';

export default {
  name: 'ShareCodeDialog',
  components: { CampaignDetailPanel },
  data: () => ({
    queryResult: null as any,
    campaign: null as any,
  }),
  computed: {
    userId() { return UserStore().Cognito?.userId },
    remoteItems() { return UserStore().UserMetadata?.RemoteItems ?? [] },
  },
  methods: {
    async addCampaign() {
      CampaignStore().AddCollectionCampaign(this.campaign);
      (this.$refs as any).importer.reset();
      (this.$refs as any).importer.close();
    },
  },
};
</script>
