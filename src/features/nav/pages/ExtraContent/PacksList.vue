<template>
  <div v-if="contentPacks.length === 0">
    <cc-alert color="primary">{{ $t('nav.contentManager.noPacksInstalled') }}</cc-alert>
  </div>
  <div v-else>
    <v-data-table v-model:expanded="expandedRows"
      :headers="headers"
      :items="contentPacks"
      item-value="Key"
      :items-per-page="-1"
      hide-default-footer
      density="compact"
      :show-expand="mobile"
      :mobile="$vuetify.display.xs">
      <template #item.Name="{ item }">
        {{ item.Name }}
        <v-menu v-if="patchesFor(item).length"
          :close-on-content-click="false"
          location="bottom start">
          <template #activator="{ props }">
            <v-btn v-bind="props"
              variant="text"
              size="x-small"
              color="accent"
              class="ml-1"
              :title="$t('nav.packInfo.languagePatches')">
              <v-chip v-for="p in patchesFor(item)"
                :key="p.id + 'badge'"
                size="x-small"
                :color="patchIsStale(p, item.Manifest.version) ? 'warning' : undefined">{{ p.lang }}</v-chip>
            </v-btn>
          </template>
          <v-card min-width="280">
            <v-card-title class="text-caption bg-primary px-3 py-1">
              <v-icon start
                size="small"
                icon="mdi-translate" />
              {{ $t('nav.packInfo.languagePatches') }}
            </v-card-title>
            <v-list density="compact">
              <v-list-item v-for="p in patchesFor(item)"
                :key="p.id">
                <template #prepend>
                  <v-icon v-if="patchIsStale(p, item.Manifest.version)"
                    color="warning"
                    icon="mdi-alert"
                    :title="$t('nav.packInfo.patchOutdated', { version: p.target_version })" />
                </template>
                <v-list-item-title class="text-uppercase">{{ p.lang }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ p.translator || $t('nav.packInfo.patchUnknownAuthor') }}
                </v-list-item-subtitle>
                <template #append>
                  <v-btn icon="mdi-delete"
                    variant="plain"
                    color="error"
                    size="small"
                    :title="$t('nav.packInfo.removePatch')"
                    @click="removePatch(p.id)" />
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
      <template #item.toggleActive="{ item }">
        <cc-switch v-if="!item.Missing"
          :model-value="item.Active"
          size="large"
          @update:model-value="toggleActive(item.ID, item.Active)" />
        <cc-tooltip v-else
          icon="mdi-alert">
          {{ $t('nav.packsList.missingDependencies') }}
        </cc-tooltip>
      </template>
      <template #item.v3="{ item }">
        <v-tooltip v-if="item.v3"
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="success">
              mdi-check
            </v-icon>
          </template>
          {{ $t('nav.communityTable.v3Compatible') }}
        </v-tooltip>
        <v-tooltip v-else
          max-width="300px">
          <template #activator="{ props }">
            <v-icon v-bind="props"
              color="error">
              mdi-cancel
            </v-icon>
          </template>
          {{ $t('nav.communityTable.v3Incompatible') }}
        </v-tooltip>
      </template>
      <template #item.deleteAction="{ item }">
        <v-menu width="400px">
          <template #activator="{ props }">
            <v-btn icon
              color="error"
              variant="plain"
              v-bind="props">
              <v-icon icon="mdi-delete" />
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              {{ $t('nav.contentManager.deletePackConfirm') }}
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn size="small">{{ $t('common.cancel') }}</v-btn>
              <v-btn size="small"
                color="error"
                class="ml-auto"
                @click="deletePack(item.ID)">
                {{ $t('common.confirm') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </template>
      <template #expanded-row="{ columns, item }">
        <tr class="bg-panel">
          <td :colspan="columns.length">
            <pack-info-card :pack="<ContentPack>item" />
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-flex justify-end mt-2">
      <cc-button :loading="loading"
        size="small"
        color="error"
        @click="deleteAll">
        {{ $t('nav.contentManager.deleteAll') }}
      </cc-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { notify } from '@/util/notify'
import { ContentPack } from '@/classes/ContentPack'
import PackInfoCard from './components/PackInfoCard.vue'
import { CompendiumStore, ContentPackStore } from '@/stores'
import { LocalizationStore } from '@/stores/localization'
import { packPatches, removePatch, patchIsStale } from '@/i18n/translationPatch'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { smAndDown: mobile } = useDisplay()

const localizationStore = LocalizationStore()
onMounted(() => localizationStore.ensurePatchesLoaded())

function patchesFor(pack: ContentPack) {
  return packPatches([pack.ID, pack.Manifest.item_prefix, pack.Manifest.name])
}

const expandedRows = ref<any[]>([])
const loading = ref(false)

const initHeaders = [
  { title: '', key: 'data-table-expand' },
  { title: t('nav.titles.active'), value: 'toggleActive', sortable: false },
  { title: 'Name', value: 'Name' },
  { title: t('nav.titles.author'), value: 'Author' },
  { title: t('nav.titles.version'), value: 'Version' },
  { title: 'v3', value: 'v3' },
  { title: '', value: 'deleteAction', sortable: false },
]

const headers = computed(() => mobile.value ? initHeaders.slice(1) : initHeaders)

const contentPacks = computed(() =>
  [...CompendiumStore().ContentPacks].sort((a, b) => {
    if (a.v3 !== b.v3) return a.v3 ? -1 : 1
    return a.Name.localeCompare(b.Name)
  })
)

async function toggleActive(packID: string, state: boolean): Promise<void> {
  try {
    await ContentPackStore().togglePackActive(packID)
    notify({ color: 'success', text: t('nav.packsList.toggleSuccessText', { action: !state ? t('nav.packsList.activated') : t('nav.packsList.deactivated') }) })
  } catch (e) {
    notify({ color: 'error', text: t('nav.packsList.toggleErrorText', { error: String(e) }) })
  }
}

async function deletePack(id: string): Promise<void> {
  await ContentPackStore().deleteContentPack(id)
}

async function deleteAll() {
  loading.value = true
  await ContentPackStore().deleteAllContentPacks()
  notify({ color: 'success', text: t('nav.packsList.deleteAllSuccess') })
  loading.value = false
}
</script>

<style scoped>
.v-table :deep(.v-table__wrapper) {
  overflow: visible !important;
}
</style>
