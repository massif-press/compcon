<template>
  <v-container>
    <cc-alert color="info"
      class="my-4"
      border
      icon="cc:campaign"
      dense>
      <i18n-t keypath="gm.campaign.managedIn" tag="span" scope="global">
        <template #library>
          <v-btn size="x-small"
            class="mx-1"
            flat
            tile
            to="/srd?tab=2">{{ $t('common.campaignLibrary') }}</v-btn>
        </template>
      </i18n-t>
    </cc-alert>

    <v-card class="mt-5">
      <v-card-title>
        <div class="heading h3 text-accent">{{ $t('gm.campaign.yourCampaigns') }}</div>
      </v-card-title>
      <v-card-text>
        <div v-if="!campaigns.length"
          class="text-center text-disabled pa-5">
          <i>{{ $t('common.noData') }}</i>
        </div>
        <v-card v-else
          v-for="(c, i) in campaigns"
          :key="c.ID"
          class="px-2 py-3"
          elevation="0"
          :color="i % 2 === 0 ? 'rgba(125, 125, 125, 0.05)' : 'rgba(125, 125, 125, 0.16)'">
          <v-row align="center">
            <v-col v-if="c.CoverImageUrl"
              cols="auto">
              <v-avatar rounded="sm">
                <v-img :src="c.CoverImageUrl"
                  height="100" />
              </v-avatar>
            </v-col>
            <v-col>
              <div class="heading h6">{{ c.Title }}</div>
              <div class="text-caption">{{ c.Subtitle }}</div>
              <div class="text-caption">
                <i>{{ $t('gm.campaign.versionLabel', { version: c.Version || $t('gm.campaign.unpublished') }) }}</i>
              </div>
            </v-col>
            <v-col cols="auto">
              <cc-button color="accent"
                size="small"
                prepend-icon="mdi-pencil"
                @click="openEditCampaign(<Campaign>c)">
                {{ $t('common.edit') }}
              </cc-button>
            </v-col>
            <v-col cols="auto">
              <v-dialog width="50vw">
                <template #activator="{ props }">
                  <cc-button v-bind="props"
                    color="error"
                    size="small"
                    prepend-icon="mdi-delete">
                    {{ $t('common.delete') }}
                  </cc-button>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card>
                    <v-toolbar color="error-darken-3">
                      <v-toolbar-title>
                        <v-icon start
                          icon="mdi-alert" />
                        {{ $t('gm.campaign.permanentDeletion') }}
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <i18n-t keypath="gm.campaign.deleteWarn1" tag="span" scope="global">
                        <template #strong><b class="text-error">{{ $t('gm.campaign.permanentlyDeleted') }}</b></template>
                      </i18n-t>
                      <div class="text-h6 text-center py-2">{{ c.Title }}</div>
                      <i18n-t keypath="gm.campaign.deleteWarn2" tag="span" scope="global">
                        <template #confirm><b>{{ $t('common.confirmDeletion') }}</b></template>
                      </i18n-t>
                      <v-text-field v-model="deleteText"
                        density="compact"
                        hide="detail"
                        class="my-2"
                        :placeholder="c.Title"
                        color="error" />
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <cc-button color="primary"
                        @click="isActive.value = false">{{ $t('common.dismiss') }}</cc-button>
                      <v-spacer />
                      <cc-button :color="deleteText !== c.Title ? '' : 'error'"
                        variant="elevated"
                        prepend-icon="mdi-delete"
                        :disabled="deleteText !== c.Title"
                        @click="deleteCampaign(<Campaign>c, isActive)">
                        {{ $t('gm.campaign.deletePermanently') }}
                      </cc-button>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
      <v-divider />

      <v-footer>
        <v-spacer />
        <v-dialog v-model="importDialog"
          max-width="750px">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              color="primary"
              class="mx-2"
              size="small">
              <v-icon start
                icon="mdi-import" />
              {{ $t('common.import') }}
            </cc-button>
          </template>
          <v-card>
            <v-card-title>{{ $t('gm.campaign.importJsonTitle') }}</v-card-title>
            <v-divider />
            <v-card-text>
              <p class="text-caption text-center">
                <i>
                  <i18n-t keypath="gm.campaign.importHelp" tag="span" scope="global">
                    <template #jsonFile><b class="text-secondary">{{ $t('gm.campaign.jsonFile') }}</b></template>
                    <template #br><br /></template>
                    <template #lcd><b class="text-secondary">{{ $t('gm.campaign.lcdExt') }}</b></template>
                    <template #campaignCollection><b>{{ $t('gm.campaign.campaignCollection') }}</b></template>
                    <template #manageContent><b>{{ $t('common.manageContent') }}</b></template>
                  </i18n-t>
                </i>
              </p>
              <v-row align="center"
                justify="center"
                class="mt-2">
                <v-col cols="10">
                  <v-file-input v-model="<any>fileValue"
                    accept="text/json"
                    variant="outlined"
                    :label="$t('gm.fields.selectDataFile')"
                    prepend-icon="mdi-paperclip"
                    @change="stageImport"
                    @click:clear="reset" />
                </v-col>
              </v-row>
              <div v-if="errorMessage"
                class="text-error text-center mt-2">{{ errorMessage }}</div>
              <div v-else-if="stagedData">
                <div class="text-caption">{{ $t('compendium.campaign.stagedCampaignData') }}</div>
                <v-card>
                  <v-card-title>{{ stagedData.Title }}</v-card-title>
                  <v-card-subtitle>{{ stagedData.Subtitle }}</v-card-subtitle>
                  <v-card-text class="pl-6">
                    <div class="text-center">
                      <i>{{ stagedData.Author }}</i>
                    </div>
                    {{ stagedData.Description }}

                    <v-alert v-if="importSameId"
                      variant="outlined"
                      :color="importIsOlder ? 'error' : 'warning'"
                      class="my-2"
                      density="compact"
                      icon="mdi-alert">
                      <div class="text-caption">{{ $t('common.warning') }}</div>
                      <div v-if="importIsOlder"
                        class="my-2 font-weight-bold">
                        {{ $t('compendium.campaign.existingNewer') }}
                      </div>
                      {{ $t('common.importOverwriteWarning', { title: importSameId.Title, date: new Date(importSameId.SaveController.LastModified).toLocaleString() }) }}
                    </v-alert>

                    <div class="text-caption text-right">
                      {{ $t('share.resultLastUpdated') }}: &nbsp;
                      <b>{{ new Date(stagedData.SaveController.LastModified).toLocaleString() }}</b>
                    </div>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <cc-button color="accent"
                      @click="importCampaign">{{ $t('common.importCampaign') }}</cc-button>
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <cc-button color="accent"
                @click="importDialog = false">{{ $t('common.dismiss') }}</cc-button>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <cc-button color="primary"
          class="mx-2"
          size="small"
          @click="addCampaign">
          <v-icon start
            icon="mdi-plus" />
          {{ $t('classes.newCampaign') }}
        </cc-button>
      </v-footer>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Campaign } from '@/classes/campaign/Campaign';
import CampaignBookshelf from '@/features/compendium/Views/CampaignLibrary/components/CampaignBookshelf.vue';
import { ImportData } from '@/io/Data';
import { CampaignStore } from '@/stores';
import logger from '@/user/logger';
const router = useRouter()

defineOptions({ name: 'campaign-landing' })

const slide = ref(null)
const libDialog = ref(false)
const deleteDialog = ref(false)
const importDialog = ref(false)
const deleteText = ref('')
const fileValue = ref(null as any)
const stagedData = ref(null as any)
const errorMessage = ref('')

const campaigns = computed(() => {
      return CampaignStore().Campaigns.filter((x) => !x.SaveController.IsDeleted);
    })
const importSameId = computed(() => {
      if (!stagedData.value) return null;
      return CampaignStore().Campaigns.find((c) => c.ID === stagedData.value.ID);
    })
const importIsOlder = computed(() => {
      if (!stagedData.value) return false;
      const existing = CampaignStore().Campaigns.find((c) => c.ID === stagedData.value.ID);
      if (!existing) return false;
      return existing.SaveController.LastModified > stagedData.value.SaveController.LastModified;
    })

function addCampaign() {
      const c = new Campaign();
      CampaignStore().AddCampaign(c);
    }
async function openEditCampaign(c: Campaign) {
      router.push(`campaigns/edit/${c.ID}`);
    }
async function deleteCampaign(c: Campaign, isActive: any) {
      CampaignStore().DeleteCampaign(c);
      isActive.value = false;
      deleteText.value = '';
    }
function reset() {
      fileValue.value = null;
      stagedData.value = null;
      errorMessage.value = '';
    }
async function stageImport(file: any) {
      if (!file) return;
      const data = await ImportData<any>(file.target.files[0]);

      try {
        const c = new Campaign(data);
        stagedData.value = c;
      } catch (e) {
        logger.error(`Error staging import: ${e}`, this);
        stagedData.value = null;
        errorMessage.value = JSON.stringify(e);
      }
    }
function importCampaign() {
      if (!stagedData.value) return;
      CampaignStore().AddCampaign(stagedData.value);
      reset();
      importDialog.value = false;
    }
</script>
