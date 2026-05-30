<template>
  <v-container>
    <cc-panel variant="tonal" flat tile>
      <template #toolbar>
        <v-toolbar density="compact" color="primary" height="22px">
          <v-toolbar-title class="heading h3 text-uppercase">Table of Contents</v-toolbar-title>
        </v-toolbar>
      </template>
      <v-card-text class="pt-2">
        <toc-item :items="campaign.Contents" :level="0" :selected="<any>campaign" />
      </v-card-text>
    </cc-panel>

    <v-divider class="my-5" />

    <div v-if="campaign.VersionHistory && campaign.VersionHistory.length">
      <fieldset style="border-radius: 3px">
        <legend class="ml-2 px-2 text-caption">Version History</legend>
        <div v-for="(hist, histIdx) in campaign.VersionHistory" :key="`hist-${histIdx}`" class="px-4 py-2">
          <div class="text-caption">
            v.
            <span class="heading h3">{{ hist.ver }}</span>
            <cc-slashes class="pl-2" />
            {{ new Date(hist.date).toLocaleDateString() }}
          </div>
          <p class="pl-4">{{ hist.changes }}</p>
        </div>
      </fieldset>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageContentContainer from './containers/campaignContentContainer.vue';
import TocItem from '../components/TocItem.vue';

defineOptions({ name: 'campaign-overview-page' })

const props = defineProps<{
  campaign: object
}>()

const bannerPreview = ref('')
const coverPreview = ref('')
const bannerDialog = ref(false)
const coverDialog = ref(false)
const socialItems = ref(['Discord', 'Twitch', 'Twitter', 'Email'])

function setBannerImage() {
      props.campaign.BannerImageUrl = bannerPreview.value;
      bannerPreview.value = '';
      bannerDialog.value = false;
    }
function setCoverImage() {
      props.campaign.CoverImageUrl = coverPreview.value;
      coverPreview.value = '';
      coverDialog.value = false;
    }
function addContentItem() {
      props.campaign.TitlePageContent.AddContentItem();
    }
</script>

<style scoped>
.row {
  margin: 0px !important;
}
</style>
