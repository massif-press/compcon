<template>
  <v-container>
    <div v-if="campaign.VersionHistory && campaign.VersionHistory.length">
      <fieldset style="border-radius: 3px">
        <legend class="ml-2 px-2 text-caption">Version History</legend>
        <div v-for="hist in campaign.VersionHistory" class="px-4 py-2">
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

<script lang="ts">
import PageContentContainer from './containers/campaignContentContainer.vue';

export default {
  name: 'campaign-overview-page',
  components: { PageContentContainer },
  props: {
    campaign: { type: Object, required: true },
  },
  data: () => ({
    bannerPreview: '',
    coverPreview: '',
    bannerDialog: false,
    coverDialog: false,
    socialItems: ['Discord', 'Twitch', 'Twitter', 'Email'],
  }),
  methods: {
    setBannerImage() {
      this.campaign.BannerImageUrl = this.bannerPreview;
      this.bannerPreview = '';
      this.bannerDialog = false;
    },
    setCoverImage() {
      this.campaign.CoverImageUrl = this.coverPreview;
      this.coverPreview = '';
      this.coverDialog = false;
    },
    addContentItem() {
      this.campaign.TitlePageContent.AddContentItem();
    },
  },
};
</script>

<style scoped>
.row {
  margin: 0px !important;
}
</style>
