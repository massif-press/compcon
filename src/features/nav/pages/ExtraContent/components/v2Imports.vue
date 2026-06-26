<template>
  <cc-panel v-if="backups.length > 0"
    :title="`${$t('nav.v2Import.panelTitle')} (${backups.length})`"
    icon="mdi-database-import"
    class="mt-4">
    <div class="d-flex align-center mb-2">
      <v-spacer />

      <cc-button icon="mdi-refresh"
        size="small"
        @click="loadBackups">
      </cc-button>
    </div>
    <v-data-table :headers="headers"
      :items="backups"
      :items-per-page="-1"
      hide-default-footer
      density="compact">
      <template #item.type="{ item }">
        <v-chip :prepend-icon="isReady(item) ? 'mdi-check' : typeIcon(item.type)"
          :color="isReady(item) ? 'success' : undefined"
          size="small"
          class="mr-1">
          {{ item.type.toUpperCase() }}
        </v-chip>
      </template>
      <template #item.name="{ item }">
        {{ item.originalData.callsign || item.originalData.name || item.id }}
      </template>
      <template #item.missing="{ item }">
        <v-chip v-for="name in item.missingLcpNames.slice(0, 3)"
          :key="name"
          size="x-small"
          :color="isReady(item) ? 'success' : 'warning'"
          class="mr-1">
          {{ name }}
        </v-chip>
        <span v-if="item.missingLcpNames.length > 3"
          class="text-caption">
          {{ $t('nav.v2Import.moreCount', { count: item.missingLcpNames.length - 3 }) }}
        </span>
      </template>
      <template #item.date="{ item }">
        {{ formatDate(item.timestamp) }}
      </template>
      <template #item.actions="{ item }">
        <v-btn icon
          size="small"
          flat
          tile
          color="accent"
          variant="plain"
          :loading="loading"
          @click="reprocessSingle(item)">
          <v-icon icon="mdi-import" />
          <v-tooltip location="top"
            activator="parent">{{ $t('nav.v2Import.attemptReimport') }}</v-tooltip>
        </v-btn>
        <v-menu width="400px">
          <template #activator="{ props }">
            <v-btn icon
              size="small"
              flat
              tile
              color="warning"
              variant="plain"
              v-bind="props">
              <v-icon icon="mdi-alert-circle" />
              <v-tooltip location="top"
                activator="parent">{{ $t('nav.v2Import.forceImport') }}</v-tooltip>
            </v-btn>
          </template>
          <cc-panel :title="$t('nav.v2Import.forceImportPanelTitle')">
            <v-card-text class="pa-1">
              {{ $t('nav.v2Import.forceImportNotice', { type: item.type }) }}:
              <div class="mt-2">
                <v-chip v-for="name in item.missingLcpNames"
                  :key="name"
                  size="x-small"
                  color="error"
                  class="mr-1 mb-1">
                  {{ name }}
                </v-chip>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn size="small">{{ $t('common.cancel') }}</v-btn>
              <cc-button size="small"
                color="warning"
                class="ml-auto"
                :loading="loading"
                @click="doForceImport(item)">
                {{ $t('nav.v2Import.confirmForceImport') }}
              </cc-button>
            </v-card-actions>
          </cc-panel>
        </v-menu>
        <v-menu width="400px">
          <template #activator="{ props }">
            <v-btn icon
              size="small"
              flat
              tile
              color="error"
              variant="plain"
              v-bind="props">
              <v-icon icon="mdi-delete" />
            </v-btn>
          </template>
          <cc-panel :title="$t('nav.v2Import.deleteTitle')">
            <v-card-text class="pa-2">
              {{ $t('nav.v2Import.deleteConfirm') }}
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn size="small">{{ $t('common.cancel') }}</v-btn>
              <cc-button size="small"
                color="error"
                class="ml-auto"
                @click="doDelete(item)">
                {{ $t('common.delete') }}
              </cc-button>
            </v-card-actions>
          </cc-panel>
        </v-menu>
      </template>
    </v-data-table>
    <v-row class="my-1">
      <v-spacer />
      <v-col cols="auto">
        <cc-button size="small"
          color="primary"
          :loading="loading"
          :tooltip="$t('nav.v2Import.importAllTooltip')"
          @click="reprocessAll">
          {{ $t('nav.v2Import.importAll') }}
        </cc-button>
      </v-col>

      <v-col cols="auto">
        <cc-button size="small"
          color="primary"
          :loading="loading"
          :tooltip="$t('nav.v2Import.forceImportAllTooltip')"
          @click="forceImportAll()">
          {{ $t('nav.v2Import.forceImportAll') }}
        </cc-button>
      </v-col>
    </v-row>
    <v-dialog v-model="showStripped"
      max-width="400px">
      <v-card>
        <v-card-title class="text-subtitle-2">{{ $t('nav.v2Import.strippedTitle') }}</v-card-title>
        <v-card-text>
          {{ $t('nav.v2Import.strippedBody') }}
          <div class="mt-2">
            <div v-for="id in strippedItems"
              :key="id"
              class="text-caption">
              {{ id }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <cc-button class="ml-auto"
            @click="showStripped = false">
            {{ $t('common.ok') }}
          </cc-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </cc-panel>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { notify } from '@/util/notify'
import {
  getV2Backups,
  deleteV2Backup,
  reprocessV2Backups,
  forceImportV2Pilot,
  forceImportV2Npc,
  forceImportV2Encounter,
  transformV2Pilot,
  transformV2Npc,
  transformV2Encounter,
  getV2PilotMissingLcps,
  getV2NpcMissingLcps,
  getV2EncounterMissingNpcs,
} from '@/io/V2Importer'
import { ImportPilot, ImportNpcData, ImportEncounter } from '@/io/Importer'
import { UserStore } from '@/stores'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const backups = ref<any[]>([])
const loading = ref(false)
const strippedItems = ref<string[]>([])
const showStripped = ref(false)

const headers = [
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Missing', key: 'missing', sortable: false },
  { title: 'Backed Up', key: 'date', sortable: true },
  { title: '', key: 'actions', sortable: false },
]

onMounted(async () => {
  await loadBackups()
})

async function loadBackups() {
  backups.value = await getV2Backups()
}

function isReady(item: any): boolean {
  if (item.type === 'pilot') return getV2PilotMissingLcps(item.originalData).missingIds.length === 0
  if (item.type === 'npc') return getV2NpcMissingLcps(item.originalData).missingIds.length === 0
  if (item.type === 'encounter') return getV2EncounterMissingNpcs(item.originalData).length === 0
  return false
}

function typeIcon(type: string) {
  if (type === 'pilot') return 'cc:pilot'
  if (type === 'npc') return 'cc:frame'
  return 'cc:encounter'
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString()
}

async function reprocessAll() {
  loading.value = true
  try {
    const result = await reprocessV2Backups()
    await UserStore().refreshV2BackupIds()
    await loadBackups()
    if (result.succeeded.length > 0) {
      notify({ color: 'success', text: t('nav.v2ImportNotify.reimportSuccessText', { count: result.succeeded.length }, result.succeeded.length) })
    }
    if (result.stillPending.length > 0) {
      notify({ color: 'warning', text: t('nav.v2ImportNotify.reimportPendingText', { count: result.stillPending.length }, result.stillPending.length) })
    }
    if (result.succeeded.length === 0 && result.stillPending.length === 0) {
      notify({ color: 'info', text: t('nav.v2ImportNotify.noItemsToReimport') })
    }
  } catch (e) {
    notify({ color: 'error', text: t('nav.v2ImportNotify.reimportFailedText', { error: String(e) }) })
  }
  loading.value = false
}

async function reprocessSingle(backup: any) {
  loading.value = true
  try {
    let missing: string[] = []
    if (backup.type === 'pilot') {
      missing = getV2PilotMissingLcps(backup.originalData).missingIds
    } else if (backup.type === 'npc') {
      missing = getV2NpcMissingLcps(backup.originalData).missingIds
    } else if (backup.type === 'encounter') {
      missing = getV2EncounterMissingNpcs(backup.originalData)
    }

    if (missing.length > 0) {
      notify({ color: 'warning', text: t('nav.v2ImportNotify.missingDependencies') })
      loading.value = false
      return
    }

    if (backup.type === 'pilot') {
      await ImportPilot(transformV2Pilot(backup.originalData))
    } else if (backup.type === 'npc') {
      await ImportNpcData(transformV2Npc(backup.originalData))
    } else if (backup.type === 'encounter') {
      for (const enc of transformV2Encounter(backup.originalData)) {
        await ImportEncounter(enc)
      }
    }

    await deleteV2Backup(backup.id)
    await UserStore().refreshV2BackupIds()
    await loadBackups()
    notify({ color: 'success', text: t('nav.v2ImportNotify.importedSuccessfully') })
  } catch (e) {
    notify({ color: 'error', text: t('nav.v2ImportNotify.importFailedText', { error: String(e) }) })
  }
  loading.value = false
}

async function doForceImport(backup: any) {
  loading.value = true
  try {
    let result: any
    if (backup.type === 'pilot') {
      result = await forceImportV2Pilot(backup.originalData)
    } else if (backup.type === 'npc') {
      result = await forceImportV2Npc(backup.originalData)
    } else {
      result = await forceImportV2Encounter(backup.originalData)
    }
    await deleteV2Backup(backup.id)
    await UserStore().refreshV2BackupIds()
    await loadBackups()
    notify({ color: 'success', text: t('nav.v2ImportNotify.forceImportComplete') })
    if (result.stripped?.length > 0) {
      strippedItems.value = result.stripped
      showStripped.value = true
    }
  } catch (e) {
    notify({ color: 'error', text: t('nav.v2ImportNotify.forceImportFailedText', { error: String(e) }) })
  }
  loading.value = false
}

async function forceImportAll() {
  loading.value = true
  for (const backup of backups.value) {
    await doForceImport(backup)
  }
  loading.value = false
}

async function doDelete(backup: any) {
  await deleteV2Backup(backup.id)
  await UserStore().refreshV2BackupIds()
  await loadBackups()
}
</script>
