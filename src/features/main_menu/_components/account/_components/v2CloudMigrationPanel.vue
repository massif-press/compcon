<template>
  <v-fade-transition>
    <cc-panel v-if="showAccountMigration"
      border-color="accent"
      variant="outlined"
      color="accent"
      title=""
      icon="mdi-transfer"
      class="mb-2"
      prominent>
      <template #title>
        v2
        <v-icon icon="mdi-arrow-right"
          size="small" />
        v3 Account Migration
      </template>
      <v-card-text class="text-text pa-1">
        <div v-if="!isMigrating && !migrationResult">
          <div v-if="isError"
            class="text-warning mb-2">
            A previous migration attempt encountered an error. You can retry below.
          </div>
          <div v-else>
            <b class=text-accent>COMP/CON has detected that you have an existing account that has
              not yet
              been migrated
              to the new v3 cloud system.</b> The account migration tool will attempt to transfer
            all v2
            cloud data to the new v3 backend. This process may take some time; please don't refresh
            or close the page during the migration process. After using this tool (or dismissing
            it), you can find it again in the "Cloud Data" tab.
          </div>
          <div v-if="detectionData">
            <v-list-item v-if="detectionData.pilots"
              class="bg-background my-1"
              prepend-icon="cc:pilot">
              {{ detectionData.pilots }} Pilot(s)
            </v-list-item>
            <v-list-item v-if="detectionData.npcs"
              class="bg-background my-1"
              prepend-icon="cc:frame">
              {{ detectionData.npcs }} NPC(s)
            </v-list-item>
            <v-list-item v-if="detectionData.encounters"
              class="bg-background my-1"
              prepend-icon="cc:encounter">
              {{ detectionData.encounters }} Encounter(s)
            </v-list-item>
            <v-list-item class="bg-background my-1"
              prepend-icon="mdi-package-variant">
              Content packs (if available)
            </v-list-item>
          </div>
          <div class="my-1 text-caption text-center">
            Your v2 data will <strong>not</strong> be modified or deleted by this process.
          </div>
        </div>

        <div v-if="isMigrating"
          class="d-flex align-center ga-3 py-2">
          <v-progress-circular indeterminate
            size="24" />
          <span>Downloading and importing v2 data...</span>
        </div>

        <div v-if="migrationResult && !isMigrating">
          <div v-if="migrationResult.status === 'empty'">
            No importable data was found in your v2 cloud storage.
          </div>
          <div v-else>
            <v-list-item v-if="migrationResult.pilotsImported"
              class="bg-background my-1"><v-icon start
                color=success
                icon="cc:pilot" />
              {{ migrationResult.pilotsImported }} pilot(s) imported
            </v-list-item>
            <v-list-item v-if="migrationResult.pilotsBackedUp"
              class="bg-background my-1"><v-icon start
                color=warning
                icon="mdi-account-clock" />
              {{ migrationResult.pilotsBackedUp }} pilot(s) pending (missing LCPs)
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsImported"
              class="bg-background my-1"><v-icon start
                color=success
                icon="cc:frame" />
              {{ migrationResult.npcsImported }} NPC(s) imported
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsBackedUp"
              class="bg-background my-1"><v-icon start
                color=warning
                icon="cc:destroyed" />
              {{ migrationResult.npcsBackedUp }} NPC(s) pending (missing LCPs)
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersImported"
              class="bg-background my-1"><v-icon start
                color=success
                icon="cc:encounter" />
              {{ migrationResult.encountersImported }} encounter(s) imported
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersBackedUp"
              class="bg-background my-1"><v-icon start
                color=warning
                icon="mdi-sword-cross" />
              {{ migrationResult.encountersBackedUp }} encounter(s) pending (missing NPCs)
            </v-list-item>
            <v-list-item v-if="migrationResult.lcpsImported"
              class="bg-background my-1"><v-icon start
                color=success
                icon="mdi-package-variant" />
              {{ migrationResult.lcpsImported }} content pack(s) imported
            </v-list-item>

            <div
              v-if="migrationResult.pilotsBackedUp || migrationResult.npcsBackedUp || migrationResult.encountersBackedUp"
              class="mt-2 text-caption text-warning">
              Pending items can be re-imported from the Content Packs panel after installing the
              required LCPs.
            </div>

            <v-expansion-panels v-if="migrationResult.errors && migrationResult.errors.length > 0"
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

            <div v-else
              class="my-1 text-center">
              <div class="text-success heading">
                Migration completed successfully!
              </div>
              <div class="text-caption text-disabled">
                This panel can be safely dismissed. If you need to retry the migration you can
                repeat
                this
                process from the "Cloud Data" tab.
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <cc-button size="x-small"
          variant="text"
          :loading="isMigrating"
          @click="debugResetMigration">
          Reset
        </cc-button>
        <v-spacer />
        <cc-button v-if="!migrationResult && !isMigrating"
          color="success"
          @click="startMigration">
          {{ isError ? 'Retry Migration' : 'Migrate Now' }}
        </cc-button>
        <cc-button :disabled="isMigrating"
          :loading="isMigrating"
          @click="dismiss">
          {{ migrationResult ? 'Close' : 'Later' }}
        </cc-button>
      </v-card-actions>
    </cc-panel>
  </v-fade-transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserStore } from '@/stores';
import { runV2CloudMigration, type V2CloudMigrationResult } from '@/io/V2CloudImporter'

const isMigrating = ref(false)
const migrationResult = ref(null as V2CloudMigrationResult | null)

const showAccountMigration = computed(() => {
      const status = UserStore().UserMetadata?.V2CloudImportStatus
      return status === 'pending' || status === 'error'
    })
const isError = computed(() => {
      return UserStore().UserMetadata?.V2CloudImportStatus === 'error'
    })
const detectionData = computed(() => {
      return UserStore().V2CloudDetectData
    })

async function debugResetMigration() {
      await UserStore().resetV2CloudMigration()
    }
async function startMigration() {
      const store = UserStore()
      isMigrating.value = true
      migrationResult.value = null
      try {
        const result = await runV2CloudMigration(store.Cognito.userId)
        migrationResult.value = result
      } finally {
        isMigrating.value = false
      }
    }
async function dismiss() {
      const store = UserStore()
      store.UserMetadata.V2CloudImportStatus =
        migrationResult.value?.status === 'error' ? 'error' : 'complete'
      await store.setUserMetadata()
    }
</script>
