<template>
  <cc-panel v-if="backups.length > 0"
    :title="`Pending V2 Imports (${backups.length})`"
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
          +{{ item.missingLcpNames.length - 3 }} more
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
            activator="parent">Attempt Re-import</v-tooltip>
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
                activator="parent">Force Import (strips missing items)</v-tooltip>
            </v-btn>
          </template>
          <cc-panel title="Force Import">
            <v-card-text class="pa-1">
              This will import the {{ item.type }} with all unresolvable items removed. The
              following dependencies cannot be found and will be stripped:
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
              <v-btn size="small">CANCEL</v-btn>
              <cc-button size="small"
                color="warning"
                class="ml-auto"
                :loading="loading"
                @click="doForceImport(item)">
                FORCE IMPORT
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
          <cc-panel title="Delete Backup">
            <v-card-text class="pa-2">
              Delete this pending v2 backup? This action cannot be undone.
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn size="
              small">CANCEL</v-btn>
              <cc-button size="small"
                color="error"
                class="ml-auto"
                @click="doDelete(item)">
                DELETE
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
          tooltip="Attempt to import all pending items. Items that are still missing dependencies will remain in a pending state."
          @click="reprocessAll">
          Import All
        </cc-button>
      </v-col>

      <v-col cols="auto">
        <cc-button size="small"
          color="primary"
          :loading="loading"
          tooltip="Force import all pending items, stripping any unresolvable dependencies. Use this if you want to get everything imported regardless of missing content, but be aware that the imported items will be stripped of missing data and may need to be manually fixed up after import."
          @click="forceImportAll()">
          Force Import All
        </cc-button>
      </v-col>
    </v-row>
    <v-dialog v-model="showStripped"
      max-width="400px">
      <v-card>
        <v-card-title class="text-subtitle-2">Items Stripped on Force Import</v-card-title>
        <v-card-text>
          The following items were removed because they could not be resolved:
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
            OK
          </cc-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </cc-panel>
</template>

<script lang="ts">
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

export default {
  name: 'V2Imports',
  data: () => ({
    backups: [] as any[],
    loading: false,
    strippedItems: [] as string[],
    showStripped: false,
    headers: [
      { title: 'Type', key: 'type', sortable: true },
      { title: 'Name', key: 'name', sortable: true },
      { title: 'Missing', key: 'missing', sortable: false },
      { title: 'Backed Up', key: 'date', sortable: true },
      { title: '', key: 'actions', sortable: false },
    ],
  }),
  async mounted() {
    await this.loadBackups()
  },
  methods: {
    async loadBackups() {
      this.backups = await getV2Backups()
    },
    isReady(item: any): boolean {
      if (item.type === 'pilot') return getV2PilotMissingLcps(item.originalData).missingIds.length === 0
      if (item.type === 'npc') return getV2NpcMissingLcps(item.originalData).missingIds.length === 0
      if (item.type === 'encounter') return getV2EncounterMissingNpcs(item.originalData).length === 0
      return false
    },
    typeIcon(type: string) {
      if (type === 'pilot') return 'cc:pilot'
      if (type === 'npc') return 'cc:frame'
      return 'cc:encounter'
    },
    formatDate(ts: number) {
      return new Date(ts).toLocaleDateString()
    },
    async reprocessAll() {
      this.loading = true
      try {
        const result = await reprocessV2Backups()
        await this.loadBackups()
        if (result.succeeded.length > 0) {
          this.$notify({ color: 'success', text: `${result.succeeded.length} item(s) imported successfully.` })
        }
        if (result.stillPending.length > 0) {
          this.$notify({ color: 'warning', text: `${result.stillPending.length} item(s) still pending missing content.` })
        }
        if (result.succeeded.length === 0 && result.stillPending.length === 0) {
          this.$notify({ color: 'info', text: 'No items to re-import.' })
        }
      } catch (e) {
        this.$notify({ color: 'error', text: `Re-import failed: ${e}` })
      }
      this.loading = false
    },
    async reprocessSingle(backup: any) {
      this.loading = true
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
          this.$notify({ color: 'warning', text: 'Missing dependencies are not yet available.' })
          this.loading = false
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
        await this.loadBackups()
        this.$notify({ color: 'success', text: 'Imported successfully.' })
      } catch (e) {
        this.$notify({ color: 'error', text: `Import failed: ${e}` })
      }
      this.loading = false
    },
    async doForceImport(backup: any) {
      this.loading = true
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
        await this.loadBackups()
        this.$notify({ color: 'success', text: 'Force import complete.' })
        if (result.stripped?.length > 0) {
          this.strippedItems = result.stripped
          this.showStripped = true
        }
      } catch (e) {
        this.$notify({ color: 'error', text: `Force import failed: ${e}` })
      }
      this.loading = false
    },
    async forceImportAll() {
      this.loading = true
      for (const backup of this.backups) {
        await this.doForceImport(backup)
      }
      this.loading = false
    },
    async doDelete(backup: any) {
      await deleteV2Backup(backup.id)
      await this.loadBackups()
    },
  },
}
</script>
