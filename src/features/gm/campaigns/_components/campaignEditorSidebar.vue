<template>
  <div
    style="position: absolute; z-index: 999"
    :style="`left: ${showNav ? '260' : '4'}px; top: 6px`">
    <cc-button
      :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
      size="small"
      color="primary"
      @click="(showNav as any) = !showNav" />
  </div>
  <v-navigation-drawer v-if="showNav" app permanent fixed style="overflow-y: scroll" class="pb-8">
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
        {{ $t('gm.campaign.campaignInfo') }}
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
      <v-btn block size="small" class="my-2 pa-2" color="secondary" @click="save">
        {{ $t('gm.campaign.saveCampaign') }}
      </v-btn>
      <v-dialog max-width="850px">
        <template #activator="{ props }">
          <v-btn v-bind="props" block size="small" variant="tonal" class="my-2 pa-2">
            {{ $t('gm.campaign.exportCampaign') }}
          </v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card>
            <v-card-title>{{ $t('gm.campaign.exportCampaign') }}</v-card-title>
            <v-divider />
            <v-card-text v-if="campaign.VersionHistory.length">
              <div class="text-caption">{{ $t('gm.campaign.currentPublishedVersion') }}</div>
              <current-version-export :campaign="campaign" />
              <v-divider />
            </v-card-text>
            <v-card-text>
              <p class="text-caption">
                <i>{{ $t('gm.campaign.exportEditableHelp') }}</i>
              </p>
              <p v-if="!campaign.VersionHistory.length" class="text-caption">
                <i18n-t keypath="gm.campaign.toProduce" tag="i" scope="global">
                  <template #publish><b class="text-secondary">{{ $t('gm.campaign.publishCampaign') }}</b></template>
                </i18n-t>
              </p>
              <div class="text-right">
                <v-btn
                  variant="tonal"
                  color="accent"
                  prepend-icon="mdi-download"
                  class="my-2"
                  @click="exportEditable">
                  {{ $t('gm.campaign.exportCampaignJson') }}
                </v-btn>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn variant="text" @click="isActive.value = false">{{ $t('common.cancel') }}</v-btn>
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
        {{ $t('gm.campaign.returnToIndex') }}
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Campaign } from '@/classes/campaign/Campaign';
import { CampaignStore } from '../../store/campaign_store';
import CampaignPublisher from './campaignPublisher.vue';
import CurrentVersionExport from './currentVersionExport.vue';
import IndentedList from '@/features/compendium/Views/CampaignLibrary/components/IndentedList.vue';
import exportAsJson from '@/util/jsonExport';
import sectionAddMenu from './sectionAddMenu.vue';

defineOptions({ name: 'campaign-editor-sidebar' })

const props = defineProps<{
  campaign: Campaign
  currentPage?: string
}>()

const emit = defineEmits<{
  'set-page': [payload: any]
  'set-selected': [payload: any]
}>()

const lastSave = ref('')
const selected = ref(null)
const showNav = ref(true)

lastSave.value = props.campaign.SaveController.LastModified;

lastSave.value = props.campaign.SaveController.LastModified;

const dirty = computed(() => {
      return lastSave.value !== props.campaign.SaveController.LastModified;
    })

async function save() {
      props.campaign.SaveController.save();
      CampaignStore().SaveCampaign(props.campaign as Campaign);
    }
function setPage(type: string) {
      emit('set-page', type);
      selected.value = null;
    }
function setSelected(item: any) {
      selected.value = item;
      emit('set-selected', item);
    }
function exportEditable() {
      const filename =
        props.campaign.Title.replace(/\s/g, '_').toLowerCase() +
        new Date().toLocaleString() +
        '.json';
      exportAsJson(Campaign.Serialize(props.campaign as Campaign), filename);
    }
</script>
