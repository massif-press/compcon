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
        {{ $t('compendium.campaign.addCampaign') }}
      </cc-button>
    </template>
  </cc-share-code-importer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CampaignStore, UserStore } from '@/stores';
import CampaignDetailPanel from './CampaignDetailPanel.vue';

defineOptions({ name: 'ShareCodeDialog' })

const importer = ref<any>(null)

const queryResult = ref(null as any)
const campaign = ref(null as any)

const userId = computed(() => { return UserStore().Cognito?.userId })
const remoteItems = computed(() => { return UserStore().UserMetadata?.RemoteItems ?? [] })

async function addCampaign() {
      CampaignStore().AddCollectionCampaign(campaign.value);
      importer.value.reset();
      importer.value.close();
    }
</script>
