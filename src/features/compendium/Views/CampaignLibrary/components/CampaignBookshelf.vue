<template>
  <div>
    <v-row
      v-if="campaigns.length"
      class="text-center"
      no-gutters
      justify="center"
    >
      <v-col
        lg="8"
        xs="12"
        :class="!mobile && 'px-1'"
      >
        <v-tooltip
          location="top"
          open-delay="300"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="panel"
              flat
              tile
              size="small"
              style="width: 25%"
              class="border-e-sm"
              @click="setSort('title')"
            >
              <v-icon icon="mdi-format-text-variant" />
              <v-icon
                v-if="sort === 'title'"
                :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              />
            </v-btn>
          </template>
          <span>{{ $t('compendium.campaign.sortByTitle') }}</span>
        </v-tooltip>

        <v-tooltip
          location="top"
          open-delay="300"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="panel"
              flat
              tile
              size="small"
              style="width: 25%"
              class="border-e-sm"
              @click="setSort('author')"
            >
              <v-icon icon="mdi-fountain-pen" />
              <v-icon
                v-if="sort === 'author'"
                :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              />
            </v-btn>
          </template>
          <span>{{ $t('compendium.campaign.sortByAuthor') }}</span>
        </v-tooltip>

        <v-tooltip
          location="top"
          open-delay="300"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="panel"
              flat
              tile
              size="small"
              style="width: 25%"
              class="border-e-sm"
              @click="setSort('players')"
            >
              <v-icon
                size="24"
                icon="cc:pilot"
              />
              <v-icon
                v-if="sort === 'players'"
                :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              />
            </v-btn>
          </template>
          <span>{{ $t('compendium.campaign.sortBySuggestedPlayers') }}</span>
        </v-tooltip>

        <v-tooltip
          location="top"
          open-delay="300"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="panel"
              flat
              tile
              size="small"
              style="width: 25%"
              @click="setSort('ll')"
            >
              <v-icon
                size="28"
                icon="cc:license"
              />
              <v-icon
                v-if="sort === 'll'"
                :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              />
            </v-btn>
          </template>
          <span>{{ $t('compendium.campaign.sortByLicenseLevel') }}</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <dense-shelf
      v-if="density === 'compact'"
      :search="search"
      :sort="sort"
      :sort-dir="asc"
    />
    <compendium-shelf
      v-else
      :search="search"
      :sort="sort"
      :sort-dir="asc"
    />
  </div>

  <v-footer :app="density !== 'compact'">
    <cc-dialog :title="$t('compendium.titles.notYetImplemented')">
      <template #activator="{ open }">
        <cc-button
          color="secondary"
          class="mx-2"
          size="small"
          :icon="mobile ? 'cc:campaign' : undefined"
          prepend-icon="cc:campaign"
          @click="open"
        >
          {{ $t('compendium.campaign.lancerCampaignDirectory') }}
        </cc-button>
      </template>
      <v-card-text>
        {{ $t('compendium.campaign.directoryComingSoon') }}
      </v-card-text>
    </cc-dialog>
    <v-spacer />

    <campaign-share-code-dialog />

    <cc-modal
      v-model="importDialog"
      :title="$t('compendium.titles.importLancerCampaignData')"
      max-width="50vw"
      min-width="500"
    >
      <template #activator="{ open }">
        <cc-button
          color="primary"
          class="mx-2"
          size="small"
          :icon="mobile ? 'mdi-import' : undefined"
          prepend-icon="mdi-import"
          @click="open"
        >
          {{ $t('common.fileImport') }}
        </cc-button>
      </template>
      <v-card-text>
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="10">
            <v-file-input
              v-model="fileValue"
              variant="outlined"
              :label="$t('compendium.fields.selectLcdFile')"
              accept=".lcd"
              prepend-icon="mdi-paperclip"
              @change="stageImport"
              @click:clear="reset"
            />
          </v-col>
        </v-row>
        <div
          v-if="errorMessage"
          class="text-error text-center mt-2"
        >
          {{ errorMessage }}
        </div>
        <div v-else-if="stagedData">
          <div class="text-caption">{{ $t('compendium.campaign.stagedCampaignData') }}</div>
          <v-card variant="tonal">
            <v-card-title>{{ stagedData.title }}</v-card-title>
            <v-card-subtitle>{{ stagedData.subtitle }}</v-card-subtitle>
            <v-card-text class="pl-6">
              <div class="text-center">
                <i>{{ stagedData.author }}</i>
              </div>
              {{ stagedData.description }}

              <v-alert
                v-if="importSameId"
                variant="outlined"
                :color="importIsOlder ? 'error' : 'warning'"
                class="my-2"
                density="compact"
                icon="mdi-alert"
              >
                <div class="text-caption">{{ $t('common.warning') }}</div>
                <div
                  v-if="importIsOlder"
                  class="my-2 font-weight-bold"
                >
                  {{ $t('compendium.campaign.existingNewer') }}
                </div>
                {{ $t('common.importOverwriteWarning', { title: importSameId.title, date: new Date(importSameId.save.lastModified).toLocaleString() }) }}
              </v-alert>

              <div class="text-caption text-right">
                {{ $t('share.resultLastUpdated') }}: &nbsp;
                <b>{{ new Date(stagedData.save.lastModified).toLocaleString() }}</b>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="accent"
                @click="importCampaign"
              >
                {{ $t('common.importCampaign') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </div>
      </v-card-text>
    </cc-modal>
  </v-footer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { CampaignStore, UserStore } from '@/stores'
import DenseShelf from './denseShelf.vue'
import CompendiumShelf from './compendiumShelf.vue'
import JSZip from 'jszip'
import CampaignShareCodeDialog from './campaignShareCodeDialog.vue'
import { GetFromCode } from '@/io/apis/account'
import logger from '@/user/logger'
import { useDisplay } from 'vuetify';

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  density?: string
  search?: string
}>(), {
  density: 'default',
  search: ''
})

const importDialog = ref(false)
const deleteText = ref('')
const fileValue = ref(null as any)
const stagedData = ref(null as any)
const errorMessage = ref('')
const sort = ref('title')
const asc = ref(true)
const importType = ref('file')

const campaigns = computed(() => {
        if (!props.search) return CampaignStore().CampaignCollection
        return CampaignStore().CampaignCollection.filter(c =>
          c.title.toLowerCase().includes(props.search.toLowerCase())
        )
      })
const importSameId = computed(() => {
        if (!stagedData.value) return null
        return CampaignStore().CampaignCollection.find(c => c.id === stagedData.value.id)
      })
const importIsOlder = computed(() => {
        if (!stagedData.value) return false
        const existing = CampaignStore().CampaignCollection.find(c => c.id === stagedData.value.id)
        if (!existing) return false
        return existing.save.lastModified > stagedData.value.save.lastModified
      })

function reset() {
        fileValue.value = null
        stagedData.value = null
        errorMessage.value = ''
      }
function setSort(sort: string) {
        if (sort.value === sort) {
          asc.value = !asc.value
        } else {
          sort.value = sort
          asc.value = true
        }
      }
async function stageImport(file: any) {
        if (!file) return
        const unzipped = await JSZip.loadAsync(file.target.files[0])
        const json = await unzipped.file('campaign_data.json')?.async('text')

        if (!json) {
          errorMessage.value = 'No campaign data file found in the selected .lcd file.'
          return
        }

        const data = JSON.parse(json)

        try {
          stagedData.value = data
        } catch (e) {
          logger.error(`Error parsing campaign data: ${e}`, this)
          stagedData.value = null
          errorMessage.value = JSON.stringify(e)
        }
      }
function importCampaign() {
        if (!stagedData.value) return
        CampaignStore().AddCollectionCampaign(stagedData.value)
        reset()
        importDialog.value = false
      }
async function checkForUpdates() {
        if (!UserStore().IsLoggedIn) return
        for (const campaign of CampaignStore().CampaignCollection) {
          if (campaign.publish_info?.code) {
            const metadata = await GetFromCode(campaign.publish_info.code)
            if (metadata.item_modified !== campaign.save.lastModified) campaign.hasUpdate = true
          }
        }
      }

onMounted(() => {
// checkForUpdates();
})
</script>
