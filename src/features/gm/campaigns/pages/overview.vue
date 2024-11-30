<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col cols="12">
        <v-card variant="outlined" class="my-1">
          <v-img v-if="campaign.BannerImageUrl" :src="campaign.BannerImageUrl" height="187" cover />
          <v-row v-else justify="center" align="center" style="min-height: 200px">
            <v-col class="text-center">
              <div class="text-disabled">
                <i>Campaign Banner Image</i>
              </div>
              <div class="text-overline text-disabled">6:1</div>
            </v-col>
          </v-row>
        </v-card>
        <v-dialog v-model="bannerDialog" max-width="50vw">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="x-small" block variant="tonal" color="accent">
              Set Banner Image
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Set Banner Image</v-card-title>
            <v-card-text>
              <i>Campaign images must be linked, and cannot originate from local COMP/CON data.</i>
              <v-row class="my-2">
                <v-col cols="10">
                  <v-text-field
                    v-model="bannerPreview"
                    prepend-inner-icon="mdi-image"
                    density="compact"
                    hide-details />
                  <v-footer color="transparent">
                    <v-btn @click="bannerDialog = false">Cancel</v-btn>
                    <v-spacer />
                    <v-btn color="accent" @click="setBannerImage()">Set</v-btn>
                  </v-footer>
                </v-col>
                <v-col>
                  <v-card variant="outlined">
                    <v-img :src="bannerPreview || campaign.BannerImageUrl" height="100" />
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <div class="text-center my-1 mx-auto" style="width: 80%">
      <cc-short-string-editor large @set="campaign.Title = $event">
        <div class="heading h1">
          {{ campaign.Title }}
        </div>
      </cc-short-string-editor>
    </div>
    <v-row align="center">
      <v-col cols="9">
        <v-text-field
          v-model="campaign.Subtitle"
          variant="outlined"
          density="compact"
          label="Subtitle" />
        <v-text-field
          v-model="campaign.Author"
          variant="outlined"
          hide-details
          density="compact"
          label="Author(s)" />
      </v-col>
      <v-col>
        <div>
          <div class="text-caption mt-n5 mb-n2">Recommended for</div>
          <v-row dense class="mt-1" align="center">
            <v-col cols="auto">
              <v-text-field
                v-model="campaign.MinPlayers"
                type="number"
                variant="outlined"
                hide-details
                density="compact"
                style="width: 70px" />
            </v-col>
            <v-col cols="auto">to</v-col>
            <v-col cols="auto">
              <v-text-field
                v-model="campaign.MaxPlayers"
                type="number"
                variant="outlined"
                hide-details
                density="compact"
                style="width: 70px" />
            </v-col>
            <v-col cols="auto">players</v-col>
          </v-row>
          <div class="text-caption mt-1">From License Levels</div>
          <v-row dense align="center">
            <v-col cols="auto">
              <v-text-field
                v-model="campaign.MinLL"
                type="number"
                variant="outlined"
                hide-details
                density="compact"
                style="width: 70px" />
            </v-col>
            <v-col cols="auto">to</v-col>
            <v-col cols="auto">
              <v-text-field
                v-model="campaign.MaxLL"
                type="number"
                variant="outlined"
                hide-details
                density="compact"
                style="width: 70px" />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-n2">
        <v-textarea
          v-model="campaign.Description"
          variant="outlined"
          auto-grow
          rows="3"
          label="Campaign Description"
          hide-details
          class="my-3" />
        <v-text-field
          v-model="campaign.Website"
          variant="outlined"
          label="Website URL"
          persistent-hint
          hint="Must be an itch.io URL to enable automatic management in COMP/CON"
          class="my-3" />
        <div class="text-caption text-disabled">Author Contact Information (Optional)</div>
        <v-row v-for="item in campaign.AuthorContact" dense align="center" class="mt-2">
          <v-col cols="3">
            <v-combobox
              v-model="item.service"
              :items="socialItems"
              variant="outlined"
              density="compact"
              hide-details
              label="Service" />
          </v-col>
          <v-col>
            <v-text-field
              v-model="item.contact"
              variant="outlined"
              density="compact"
              hide-details
              label="Contact Information" />
          </v-col>
          <v-col cols="auto">
            <v-btn
              icon
              variant="tonal"
              size="x-small"
              @click="campaign.AuthorContact.splice(campaign.AuthorContact.indexOf(item), 1)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-footer density="compact" color="transparent">
          <v-spacer />
          <v-btn
            size="x-small"
            variant="tonal"
            @click="campaign.AuthorContact.push({ service: '', contact: '' })">
            Add New Contact
          </v-btn>
        </v-footer>
      </v-col>
      <v-col cols="auto">
        <v-card variant="outlined" class="my-1" width="213" height="275">
          <v-img v-if="campaign.CoverImageUrl" :src="campaign.CoverImageUrl" height="550" />
          <v-row v-else justify="center" align="center" style="height: 100%">
            <v-col class="text-center">
              <div class="text-disabled">
                <i>Campaign Cover Image</i>
              </div>
              <div class="text-overline text-disabled">8.5:11</div>
            </v-col>
          </v-row>
        </v-card>
        <v-dialog v-model="coverDialog" max-width="50vw">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="x-small" block variant="tonal" color="accent">
              Set Cover Image
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Set Cover Image</v-card-title>
            <v-card-text>
              <i>Campaign images must be linked, and cannot originate from local COMP/CON data.</i>
              <v-row class="my-2">
                <v-col cols="10">
                  <v-text-field
                    v-model="coverPreview"
                    prepend-inner-icon="mdi-image"
                    density="compact"
                    hide-details />
                  <v-footer color="transparent">
                    <v-btn @click="coverDialog = false">Cancel</v-btn>
                    <v-spacer />
                    <v-btn color="accent" @click="setCoverImage()">Set</v-btn>
                  </v-footer>
                </v-col>
                <v-col>
                  <v-card variant="outlined">
                    <v-img :src="coverPreview || campaign.CoverImageUrl" height="100" cover />
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <page-content-container
      v-for="(item, i) in campaign.TitlePageContent.Content"
      :item="item"
      class="mb-4"
      @delete-item="campaign.TitlePageContent.RemoveContentItem(i)" />
    <v-footer color="transparent">
      <v-spacer />
      <v-btn
        color="accent"
        size="small"
        variant="tonal"
        prepend-icon="mdi-plus"
        @click="addContentItem()">
        Add Content
      </v-btn>
    </v-footer>

    <div v-if="campaign.VersionHistory && campaign.VersionHistory.length">
      <v-divider class="my-3" />
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
          <div class="text-right">
            <v-btn
              variant="tonal"
              color="error"
              size="x-small"
              class="fade-select"
              @click="
                campaign.VersionHistory.splice(campaign.VersionHistory.indexOf(hist), 1);
                campaign.save();
              ">
              <v-icon start icon="mdi-delete" />
              Delete History (v.{{ hist.ver }})
            </v-btn>
          </div>
        </div>
      </fieldset>
    </div>

    <v-footer app>
      <v-btn size="x-small" variant="tonal" class="mr-12" icon @click="$emit('preview', 'credits')">
        <v-tooltip location="bottom" open-delay="300">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" size="x-large" icon="mdi-eye" />
          </template>
          <span>Preview</span>
        </v-tooltip>
      </v-btn>
      <v-spacer />
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import PageContentContainer from './_components/PageContentContainer.vue';

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
