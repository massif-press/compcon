<template>
  <div v-if="hasMigrationData">

    <cc-dialog icon="mdi-transfer"
      :title="$t('nav.titles.v2DataMigration')"
      :close-on-click="false">
      <template #activator="{ open }">
        <cc-button size="small"
          color="warning"
          :block="block"
          prepend-icon="mdi-alert-circle"
          style="z-index: 999!important;"
          @click="open">
          {{ va.v2Data }}
        </cc-button>
      </template>
      <template #default="{ close }">
        <v-card-text>
          <div>{{ va.autoMigrated }}</div>
          <div v-if="migrationResult">
            <v-list-item v-if="migrationResult.pilotsImported"
              class="bg-background my-1"
              prepend-icon="cc:pilot">
              {{ $t('nav.v2Auto.pilotsImported', { count: migrationResult.pilotsImported }, migrationResult.pilotsImported) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.pilotsBackedUp"
              class="bg-background my-1"
              prepend-icon="mdi-account-clock">
              {{ $t('nav.v2Auto.pilotsPending', { count: migrationResult.pilotsBackedUp }, migrationResult.pilotsBackedUp) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsImported"
              class="bg-background my-1"
              prepend-icon="cc:frame">
              {{ $t('nav.v2Auto.npcsImported', { count: migrationResult.npcsImported }, migrationResult.npcsImported) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsBackedUp"
              class="bg-background my-1"
              prepend-icon="cc:destroyed">
              {{ $t('nav.v2Auto.npcsPending', { count: migrationResult.npcsBackedUp }, migrationResult.npcsBackedUp) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersImported"
              class="bg-background my-1"
              prepend-icon="cc:encounter">
              {{ $t('nav.v2Auto.encountersImported', { count: migrationResult.encountersImported }, migrationResult.encountersImported) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersBackedUp"
              class="bg-background my-1"
              prepend-icon="mdi-sword-cross">
              {{ $t('nav.v2Auto.encountersPending', { count: migrationResult.encountersBackedUp }, migrationResult.encountersBackedUp) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.lcpsImported"
              class="bg-background my-1"
              prepend-icon="mdi-package-variant">
              {{ $t('nav.v2Auto.lcpsImported', { count: migrationResult.lcpsImported }, migrationResult.lcpsImported) }}
            </v-list-item>
          </div>
          <div
            v-if="migrationResult && (migrationResult.pilotsBackedUp || migrationResult.npcsBackedUp || migrationResult.encountersBackedUp)"
            class="mt-2 text-caption text-warning">
            {{ va.pendingNote }}
          </div>

          <v-expansion-panels
            v-if="migrationResult && migrationResult.errors && migrationResult.errors.length > 0"
            class="mt-2">
            <v-expansion-panel>
              <v-expansion-panel-title class="text-error">
                {{ $t('nav.v2Auto.errorsDuringMigration', { count: migrationResult.errors.length }, migrationResult.errors.length) }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-for="err in migrationResult.errors"
                  :key="err"
                  class="text-caption text-error">
                  {{ err }}
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-divider class="my-2" />
        </v-card-text>
        <v-row justify="space-between">
          <v-col>
            <cc-button color="primary"
              prepend-icon="mdi-download"
              :tooltip="va.downloadBackupTooltip"
              @click="downloadBackup">
              {{ va.downloadBackup }}
            </cc-button>
          </v-col>
          <v-col cols="auto">
            <v-btn variant="text"
              @click="dismiss(close)">{{ $t('common.dismiss') }}</v-btn>
          </v-col>
        </v-row>
      </template>
    </cc-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GetValue, SetValue } from '@/io/Storage'
import { downloadFullBackup } from '@/io/FullImporter'
import { useNavStrings } from '@/features/nav/useNavStrings'
const { section } = useNavStrings()

defineProps<{ block?: boolean }>()

const va = section('v2Auto')

const hasMigrationData = ref(false)
const migrationResult = ref<any>(null)
const backupData = ref<any>(null)

onMounted(async () => {
  const dismissed = await GetValue('v2_migration_dismissed')
  if (dismissed) return
  const backup = await GetValue('v2_backup_download')
  if (backup !== null) {
    hasMigrationData.value = true
    backupData.value = backup
    migrationResult.value = await GetValue('v2_migration_result')
  }
})

function downloadBackup() {
  if (backupData.value) downloadFullBackup(backupData.value)
}

async function dismiss(close: () => void) {
  await SetValue('v2_migration_dismissed', true)
  hasMigrationData.value = false
  close()
}
</script>
