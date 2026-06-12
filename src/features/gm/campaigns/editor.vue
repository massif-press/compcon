<template>
  <div>
    <div v-if="!campaign">{{ $t('gm.campaign.errNoCampaign') }}</div>
    <v-layout
      v-else
      style="position: relative"
      :style="{ height: mobile ? 'calc(100vh - 24px)' : 'calc(100vh - 40px)' }">
      <campaign-editor-sidebar
        :campaign="campaign"
        :current-page="currentPage"
        @set-selected="setSelected"
        @set-page="setPage" />
      <v-main style="padding-bottom: 45px; overflow: scroll">
        <v-fade-transition leave-absolute>
          <component
            v-if="itemComponent"
            :is="itemComponent"
            :campaign="campaign"
            :item="selected"
            @delete="deleteCampaignPage(selected)"
            @preview="showPreview($event)" />
        </v-fade-transition>
      </v-main>
    </v-layout>
  </div>
  <v-dialog v-if="campaign" v-model="previewDialog" fullscreen>
    <v-card class="pb-6">
      <component
        v-if="previewItemComponent"
        :is="previewItemComponent"
        :campaign="campaign"
        :item="selected" />
      <div
        class="bg-panel"
        style="
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          overflow-x: hidden;
          overflow-y: hidden;
        ">
        <v-row dense align="center" class="px-4 py-1">
          <v-col>
            <v-chip size="small">{{ $t('gm.campaign.currentlyViewing') }}</v-chip>
            {{ campaign.Title }} &mdash; {{ $t('gm.campaign.credits') }}
          </v-col>
          <v-col cols="auto">
            <v-btn size="small" variant="tonal" color="accent" @click="previewDialog = false">
              {{ $t('common.closePreview') }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import campaignEditorSidebar from './_components/campaignEditorSidebar.vue';
import Overview from './pages/overview.vue';
import Credits from '@/features/compendium/Views/CampaignLibrary/pages/credits.vue';
import ContentPage from '@/features/compendium/Views/CampaignLibrary/pages/contentPage.vue';
import Page from './pages/CampaignPage.vue';
import { CampaignStore } from '@/stores';
import { useDisplay } from 'vuetify';

defineOptions({ name: 'campaign-editor' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  id: string
}>()

const componentType = ref('overview')
const previewType = ref('credits')
const selected = ref(null)
const previewDialog = ref(false)

const itemComponent = computed(() => {
      switch (componentType.value.toLowerCase()) {
        case 'overview':
          return Overview;
        default:
          return Page;
      }
    })
const previewItemComponent = computed(() => {
      switch (previewType.value.toLowerCase()) {
        case 'credits':
          return Credits;
        default:
          return ContentPage;
      }
    })
const campaign = computed(() => {
      return CampaignStore().Campaigns.find((c) => c.ID === props.id);
    })
const currentPage = computed(() => {
      return componentType.value;
    })

function setPage(type) {
      componentType.value = type;
      selected.value = null;
    }
function setSelected(item) {
      componentType.value = item.SectionType;
      selected.value = item;
    }
function showPreview(preview) {
      previewType.value = preview;
      previewDialog.value = true;
    }
function deleteCampaignPage(item) {
      if (item) {
        componentType.value = 'overview';
        item.DeleteSelf();
      }
    }
</script>
