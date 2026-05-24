<template>
  <div v-if="hasMigrationData">

    <cc-dialog icon="mdi-transfer"
      title="V2 Data Migration"
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
              {{ migrationResult.pilotsImported }} {{ va.pilotsImported }}
            </v-list-item>
            <v-list-item v-if="migrationResult.pilotsBackedUp"
              class="bg-background my-1"
              prepend-icon="mdi-account-clock">
              {{ migrationResult.pilotsBackedUp }} {{ va.pilotsPending }}
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsImported"
              class="bg-background my-1"
              prepend-icon="cc:frame">
              {{ migrationResult.npcsImported }} {{ va.npcsImported }}
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsBackedUp"
              class="bg-background my-1"
              prepend-icon="cc:destroyed">
              {{ migrationResult.npcsBackedUp }} {{ va.npcsPending }}
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersImported"
              class="bg-background my-1"
              prepend-icon="cc:encounter">
              {{ migrationResult.encountersImported }} {{ va.encountersImported }}
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersBackedUp"
              class="bg-background my-1"
              prepend-icon="mdi-sword-cross">
              {{ migrationResult.encountersBackedUp }} {{ va.encountersPending }}
            </v-list-item>
            <v-list-item v-if="migrationResult.lcpsImported"
              class="bg-background my-1"
              prepend-icon="mdi-package-variant">
              {{ migrationResult.lcpsImported }} {{ va.lcpsImported }}
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
                {{ migrationResult.errors.length }} {{ va.errorsDuringMigration }}
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
              @click="dismiss(close)">Dismiss</v-btn>
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
import { NAV_STRINGS } from '@/features/nav/strings'

defineProps<{ block?: boolean }>()

const va = NAV_STRINGS.v2Auto

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
