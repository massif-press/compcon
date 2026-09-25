<template>
  <cc-dialog
    :close-on-click="false"
    icon="mdi-import"
    :title="title"
    @close="reset"
  >
    <template #activator="{ open }">
      <slot
        name="activator"
        :open="open"
      />
    </template>
    <template #default="{ close }">
      <div class="text-cc-overline text-disabled">
        {{ $t('active.gmOptions.importFileLabel') }}
      </div>
      <v-file-input
        v-model="fileValue"
        accept=".json"
        variant="outlined"
        density="compact"
        hide-details
        :placeholder="$t('active.fields.selectEncounterExportFile')"
        prepend-icon="mdi-paperclip"
        @change="stageImportFile('EncounterInstance', $t('active.gmOptions.invalidEncounterFile'))"
      />
      <v-scroll-y-reverse-transition>
        <div v-if="importOk && importObj">
          <v-card
            class="mt-2 pa-2"
            flat
            tile
            color="panel"
          >
            <div class="text-cc-overline text-disabled">
              {{ $t('active.pcOptions.stagedImport') }}:
            </div>
            <div class="ml-3">
              <b class="text-accent">
                {{ importObj.encounter?.name || $t('classes.newEncounter') }}
              </b>
              {{ $t('active.pcOptions.atRound') }}
              {{ importObj.round }}
              <i
                v-if="importObj.save?.lastModified"
                class="text-caption text-disabled"
              >
                {{ new Date(importObj.save.lastModified).toLocaleString() }}
              </i>
            </div>
          </v-card>
          <slot name="warning" />
        </div>
        <cc-alert
          v-if="importError"
          color="error"
          prominent
          class="mt-2"
        >
          <v-icon
            icon="mdi-alert"
            start
          />
          {{ importError }}
        </cc-alert>
      </v-scroll-y-reverse-transition>
      <v-card-actions>
        <v-btn
          text
          color="accent"
          @click="close"
        >
          {{ $t('common.cancel') }}
        </v-btn>
        <v-spacer />
        <cc-button
          text
          color="primary"
          :disabled="!importOk"
          @click="confirmImport(close)"
        >
          {{ $t('common.confirmImport') }}
        </cc-button>
      </v-card-actions>
    </template>
  </cc-dialog>
</template>

<script setup lang="ts">
  import { toRaw } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { EncounterStore } from '@/stores'
  import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { CloudController } from '@/classes/components/cloud/CloudController'
  import { useRunnerOptions } from './useRunnerOptions'
  import logger from '@/user/logger'

  const props = defineProps<{ title: string; replaceId?: string }>()
  const emit = defineEmits<{ imported: [instance: EncounterInstance] }>()

  const { t } = useI18n()

  const { fileValue, importObj, importOk, importError, reset, stageImportFile } = useRunnerOptions()

  async function confirmImport(close: () => void) {
    const store = EncounterStore()
    try {
      const data = { ...importObj.value }
      const live = props.replaceId && store.ActiveEncounters.find(e => e.ID === props.replaceId)
      if (live) {
        data.id = live.ID
        data.cloud = undefined
        CloudController.Serialize(toRaw(live) as EncounterInstance, data)
      }
      const imported = EncounterInstance.Deserialize(data)
      const taken = [...store.ActiveEncounters, ...store.ArchivedEncounters].some(
        e => e.ID === imported.ID
      )
      if (!live && taken) imported.RenewID()
      else imported.StampLogContext()
      imported.SaveController.markModified()
      await store.AddEncounterInstance(imported)
      close()
      emit('imported', imported)
    } catch (error) {
      logger.error('Encounter state import failed', null, error)
      importError.value = t('active.gmOptions.importFailed')
      importOk.value = false
    }
  }
</script>
