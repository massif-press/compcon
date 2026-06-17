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
        <span>v2</span>
        <v-icon icon="mdi-arrow-right"
          size="small" />
        {{ $t("mainMenu.migration.title") }}
      </template>
      <v-card-text class="text-text pa-1">
        <div v-if="!isMigrating && !migrationResult">
          <div v-if="isError"
            class="text-warning mb-2">
            {{ $t("mainMenu.migration.previousError") }}
          </div>
          <div v-else>
            <i18n-t keypath="mainMenu.migration.migrationDesc" tag="span" scope="global">
              <template #detected><b class="text-accent">{{ $t("mainMenu.migration.detectedText") }}</b></template>
            </i18n-t>
          </div>
          <div v-if="detectionData">
            <v-list-item v-if="detectionData.pilots"
              class="bg-background my-1"
              prepend-icon="cc:pilot">
              {{ $t("mainMenu.migration.pilotsDetected", { count: detectionData.pilots }, detectionData.pilots) }}
            </v-list-item>
            <v-list-item v-if="detectionData.npcs"
              class="bg-background my-1"
              prepend-icon="cc:frame">
              {{ $t("mainMenu.migration.npcsDetected", { count: detectionData.npcs }, detectionData.npcs) }}
            </v-list-item>
            <v-list-item v-if="detectionData.encounters"
              class="bg-background my-1"
              prepend-icon="cc:encounter">
              {{ $t("mainMenu.migration.encountersDetected", { count: detectionData.encounters }, detectionData.encounters) }}
            </v-list-item>
            <v-list-item class="bg-background my-1"
              prepend-icon="mdi-package-variant">
              {{ $t("mainMenu.migration.contentPacksAvailable") }}
            </v-list-item>
          </div>
          <div class="my-1 text-caption text-center">
            <i18n-t keypath="mainMenu.migration.v2NotModified" tag="span" scope="global"><template #not><strong>{{ $t("mainMenu.migration.notLabel") }}</strong></template></i18n-t>
          </div>
        </div>

        <div v-if="isMigrating"
          class="d-flex align-center ga-3 py-2">
          <v-progress-circular indeterminate
            size="24" />
          <span>{{ $t("mainMenu.migration.downloading") }}</span>
        </div>

        <div v-if="migrationResult && !isMigrating">
          <div v-if="migrationResult.status === 'empty'">
            {{ $t("mainMenu.migration.noData") }}
          </div>
          <div v-else>
            <v-list-item v-if="migrationResult.pilotsImported"
              class="bg-background my-1"><v-icon start
                color=success
                icon="cc:pilot" />
              {{ $t("mainMenu.migration.pilotsImported", { count: migrationResult.pilotsImported }, migrationResult.pilotsImported) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.pilotsBackedUp"
              class="bg-background my-1"><v-icon start
                color=warning
                icon="mdi-account-clock" />
              {{ $t("mainMenu.migration.pilotsPending", { count: migrationResult.pilotsBackedUp }, migrationResult.pilotsBackedUp) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsImported"
              class="bg-background my-1"><v-icon start
                color=success
                icon="cc:frame" />
              {{ $t("mainMenu.migration.npcsImported", { count: migrationResult.npcsImported }, migrationResult.npcsImported) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.npcsBackedUp"
              class="bg-background my-1"><v-icon start
                color=warning
                icon="cc:destroyed" />
              {{ $t("mainMenu.migration.npcsPending", { count: migrationResult.npcsBackedUp }, migrationResult.npcsBackedUp) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersImported"
              class="bg-background my-1"><v-icon start
                color=success
                icon="cc:encounter" />
              {{ $t("mainMenu.migration.encountersImported", { count: migrationResult.encountersImported }, migrationResult.encountersImported) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.encountersBackedUp"
              class="bg-background my-1"><v-icon start
                color=warning
                icon="mdi-sword-cross" />
              {{ $t("mainMenu.migration.encountersPending", { count: migrationResult.encountersBackedUp }, migrationResult.encountersBackedUp) }}
            </v-list-item>
            <v-list-item v-if="migrationResult.lcpsImported"
              class="bg-background my-1"><v-icon start
                color=success
                icon="mdi-package-variant" />
              {{ $t("mainMenu.migration.lcpsImported", { count: migrationResult.lcpsImported }, migrationResult.lcpsImported) }}
            </v-list-item>

            <div
              v-if="migrationResult.pilotsBackedUp || migrationResult.npcsBackedUp || migrationResult.encountersBackedUp"
              class="mt-2 text-caption text-warning">
              {{ $t("nav.v2Auto.pendingNote") }}
            </div>

            <v-expansion-panels v-if="migrationResult.errors && migrationResult.errors.length > 0"
              class="mt-2">
              <v-expansion-panel>
                <v-expansion-panel-title class="text-error">
                  {{ $t("mainMenu.migration.errorsDuringMigration", { count: migrationResult.errors.length }, migrationResult.errors.length) }}
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
                {{ $t("mainMenu.migration.completedSuccess") }}
              </div>
              <div class="text-caption text-disabled">
                {{ $t("mainMenu.migration.dismissNote") }}
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
          {{ $t("common.reset") }}
        </cc-button>
        <v-spacer />
        <cc-button v-if="!migrationResult && !isMigrating"
          color="success"
          @click="startMigration">
          {{ isError ? $t("mainMenu.migration.retryMigration") : $t("mainMenu.migration.migrateNow") }}
        </cc-button>
        <cc-button :disabled="isMigrating"
          :loading="isMigrating"
          @click="dismiss">
          {{ migrationResult ? $t("common.close") : $t("mainMenu.migration.later") }}
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
