<template>
  <v-container>
    <v-card flat class="ma-n4" style="container: inline-size">
      <v-img :src="campaign.BannerImageUrl || ''" cover>
        <v-row justify="center" align="center" style="height: 100%; min-height: 300px">
          <v-col class="text-center">
            <div
              class="heading h1"
              style="
                font-size: calc(12px + 4cqw);
                letter-spacing: calc(4px + 0.6cqw);
                background-color: rgba(122, 122, 122, 0.3);
              ">
              {{ campaign.Title }}
            </div>
            <v-card flat tile style="opacity: 0.85">
              <v-card-text>
                <div>
                  {{ campaign.Subtitle }}
                </div>
                <v-divider />
                <div>By {{ campaign.Author }}</div>
                <div class="text-center text-caption">
                  A
                  <i>Lancer</i>
                  campaign for
                  {{
                    campaign.MinPlayers === campaign.MaxPlayers
                      ? campaign.MaxPlayers
                      : `${campaign.MinPlayers}-${campaign.MaxPlayers}`
                  }}
                  pilots starting at License Level
                  {{
                    campaign.MinLL === campaign.MaxLL
                      ? campaign.MaxLL
                      : `${campaign.MinLL}-${campaign.MaxLL}`
                  }}.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-img>
    </v-card>

    <v-row justify="end" class="my-2">
      <v-col cols="auto">
        <a :href="campaign.Website" target="_blank" rel="noopener noreferrer">
          {{ campaign.Website }}
        </a>
      </v-col>
      <v-col cols="auto" v-for="item in campaign.AuthorContact">
        {{ item.service }}: {{ item.contact }}
      </v-col>
    </v-row>

    <page-content-container
      v-for="(item, i) in campaign.TitlePageContent.Content"
      :item="item"
      class="mb-4"
      @delete-item="campaign.TitlePageContent.RemoveContentItem(i)" />
  </v-container>
</template>

<script lang="ts">
import PageContentContainer from './containers/campaignContentContainer.vue';

export default {
  name: 'campaign-credits-page',
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
.text-outline {
  text-shadow:
    -3px -3px 0 rgb(var(--v-theme-anti)),
    3px -3px 0 rgb(var(--v-theme-anti)),
    -3px 3px 0 rgb(var(--v-theme-anti)),
    3px 3px 0 rgb(var(--v-theme-anti));
}
</style>
