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
          V2 Data
        </cc-button>
      </template>
      <template #default="{ close }">
        <v-card-text>
          <div>Your v2 data was automatically migrated to v3 on startup.</div>
          <div v-if="migrationResult">
            <v-list-item v-if="migrationResult.pilotsImported"
              class="bg-background my-1"
              prepend-icon="cc:pilot">
              {{ migrationResult.pilotsImported }} pilot(s) imported
            </v-list-item>
            <v-list-item v-if="migrationResult.pilotsBackedUp"
              class="bg-background my-1"
              prepend-icon="mdi-account-clock">
              {{ migrationResult.pilotsBackedUp }} pilot(s) pending (missing LCPs)
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsImported"
              class="bg-background my-1"
              prepend-icon="cc:frame">
              {{ migrationResult.npcsImported }} NPC(s) imported
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsBackedUp"
              class="bg-background my-1"
              prepend-icon="cc:destroyed">
              {{ migrationResult.npcsBackedUp }} NPC(s) pending (missing LCPs)
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersImported"
              class="bg-background my-1"
              prepend-icon="cc:encounter">
              {{ migrationResult.encountersImported }} encounter(s) imported
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersBackedUp"
              class="bg-background my-1"
              prepend-icon="mdi-sword-cross">
              {{ migrationResult.encountersBackedUp }} encounter(s) pending (missing NPCs)
            </v-list-item>
            <v-list-item v-if="migrationResult.lcpsImported"
              class="bg-background my-1"
              prepend-icon="mdi-package-variant">
              {{ migrationResult.lcpsImported }} content pack(s) imported
            </v-list-item>
          </div>
          <div
            v-if="migrationResult && (migrationResult.pilotsBackedUp || migrationResult.npcsBackedUp || migrationResult.encountersBackedUp)"
            class="mt-2 text-caption text-warning">
            Pending items can be re-imported from the Content Packs panel after installing the
            required LCPs.
          </div>

          <v-expansion-panels
            v-if="migrationResult && migrationResult.errors && migrationResult.errors.length > 0"
            class="mt-2">
            <v-expansion-panel>
              <v-expansion-panel-title class="text-error">
                {{ migrationResult.errors.length }} error(s) during migration
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
              tooltip="This .compcon file can be used in a v2 environment at https://old.compcon.app. This can be downloaded at any time from the Options menu"
              @click="downloadBackup">
              Download v2 Backup
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

<script lang="ts">
import { GetValue, SetValue } from '@/io/Storage'
import { downloadFullBackup } from '@/io/FullImporter'

export default {
  name: 'V2Auto',
  props: {
    block: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    hasMigrationData: true,
    dialog: false,
    migrationResult: null as any,
    backupData: null as any,
  }),
  async mounted() {
    const dismissed = await GetValue('v2_migration_dismissed')
    if (dismissed) return
    const backup = await GetValue('v2_backup_download')
    if (backup !== null) {
      this.hasMigrationData = true
      this.backupData = backup
      this.migrationResult = await GetValue('v2_migration_result')
    }
  },
  methods: {
    downloadBackup() {
      if (this.backupData) downloadFullBackup(this.backupData)
    },
    async dismiss(close) {
      await SetValue('v2_migration_dismissed', true)
      this.hasMigrationData = false
      close()
    },
  },
}
</script>
