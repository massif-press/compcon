<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col cols="12">
        <v-card variant="outlined" class="my-1">
          <v-img v-if="campaign.BannerImageUrl" :src="campaign.BannerImageUrl" height="187" cover />
          <v-row v-else justify="center" align="center" style="min-height: 200px">
            <v-col class="text-center">
              <div class="text-disabled">
                <i>{{ $t('gm.overview.bannerImage') }}</i>
              </div>
              <div class="text-overline text-disabled">6:1</div>
            </v-col>
          </v-row>
        </v-card>
        <v-dialog v-model="bannerDialog" max-width="50vw">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="x-small" block variant="tonal" color="accent">
              {{ $t('gm.overview.setBannerImage') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>{{ $t('gm.overview.setBannerImage') }}</v-card-title>
            <v-card-text>
              <i>{{ $t('gm.overview.imagesMustLink') }}</i>
              <v-row class="my-2">
                <v-col cols="10">
                  <v-text-field
                    v-model="bannerPreview"
                    prepend-inner-icon="mdi-image"
                    density="compact"
                    hide-details />
                  <v-footer color="transparent">
                    <v-btn @click="bannerDialog = false">{{ $t('common.cancel') }}</v-btn>
                    <v-spacer />
                    <v-btn color="accent" @click="setBannerImage()">{{ $t('common.set') }}</v-btn>
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
          :label="$t('gm.fields.subtitle')" />
        <v-text-field
          v-model="campaign.Author"
          variant="outlined"
          hide-details
          density="compact"
          :label="$t('gm.fields.authors')" />
      </v-col>
      <v-col>
        <div>
          <div class="text-caption mt-n5 mb-n2">{{ $t('gm.overview.recommendedFor') }}</div>
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
            <v-col cols="auto">{{ $t('gm.overview.to') }}</v-col>
            <v-col cols="auto">
              <v-text-field
                v-model="campaign.MaxPlayers"
                type="number"
                variant="outlined"
                hide-details
                density="compact"
                style="width: 70px" />
            </v-col>
            <v-col cols="auto">{{ $t('gm.overview.players') }}</v-col>
          </v-row>
          <div class="text-caption mt-1">{{ $t('gm.overview.fromLicenseLevels') }}</div>
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
            <v-col cols="auto">{{ $t('gm.overview.to') }}</v-col>
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
          :label="$t('gm.fields.campaignDescription')"
          hide-details
          class="my-3" />
        <v-text-field
          v-model="campaign.Website"
          variant="outlined"
          :label="$t('gm.fields.websiteUrl')"
          persistent-hint
          :hint="$t('gm.fields.mustBeAnItchioUrl')"
          class="my-3" />
        <div class="text-caption text-disabled">{{ $t('gm.overview.authorContact') }}</div>
        <v-row v-for="(item, index) in campaign.AuthorContact" :key="`contact-${index}`" dense align="center" class="mt-2">
          <v-col cols="3">
            <v-combobox
              v-model="item.service"
              :items="socialItems"
              variant="outlined"
              density="compact"
              hide-details
              :label="$t('gm.fields.service')" />
          </v-col>
          <v-col>
            <v-text-field
              v-model="item.contact"
              variant="outlined"
              density="compact"
              hide-details
              :label="$t('gm.fields.contactInformation')" />
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
            {{ $t('gm.overview.addContact') }}
          </v-btn>
        </v-footer>
      </v-col>
      <v-col cols="auto">
        <v-card variant="outlined" class="my-1" width="213" height="275">
          <v-img v-if="campaign.CoverImageUrl" :src="campaign.CoverImageUrl" height="550" />
          <v-row v-else justify="center" align="center" style="height: 100%">
            <v-col class="text-center">
              <div class="text-disabled">
                <i>{{ $t('gm.overview.coverImage') }}</i>
              </div>
              <div class="text-overline text-disabled">8.5:11</div>
            </v-col>
          </v-row>
        </v-card>
        <v-dialog v-model="coverDialog" max-width="50vw">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="x-small" block variant="tonal" color="accent">
              {{ $t('gm.overview.setCoverImage') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>{{ $t('gm.overview.setCoverImage') }}</v-card-title>
            <v-card-text>
              <i>{{ $t('gm.overview.imagesMustLink') }}</i>
              <v-row class="my-2">
                <v-col cols="10">
                  <v-text-field
                    v-model="coverPreview"
                    prepend-inner-icon="mdi-image"
                    density="compact"
                    hide-details />
                  <v-footer color="transparent">
                    <v-btn @click="coverDialog = false">{{ $t('common.cancel') }}</v-btn>
                    <v-spacer />
                    <v-btn color="accent" @click="setCoverImage()">{{ $t('common.set') }}</v-btn>
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
      :key="`content-${i}`"
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
        {{ $t('common.addContent') }}
      </v-btn>
    </v-footer>

    <div v-if="campaign.VersionHistory && campaign.VersionHistory.length">
      <v-divider class="my-3" />
      <fieldset style="border-radius: 3px">
        <legend class="ml-2 px-2 text-caption">{{ $t('common.versionHistory') }}</legend>
        <div v-for="(hist, index) in campaign.VersionHistory" :key="`hist-${index}`" class="px-4 py-2">
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
              {{ $t('gm.overview.deleteHistory', { ver: hist.ver }) }}
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
          <span>{{ $t('common.preview') }}</span>
        </v-tooltip>
      </v-btn>
      <v-spacer />
    </v-footer>
  </v-container>
</template>

<script setup lang="ts">
import type { Campaign } from '@/classes/campaign/Campaign'
import { ref } from 'vue'
import PageContentContainer from './_components/PageContentContainer.vue';

defineOptions({ name: 'campaign-overview-page' })

const props = defineProps<{
  campaign: Campaign
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
