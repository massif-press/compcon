<template>
  <v-card>
    <runner-options-header
      :context="sheet"
      :save-key="saveUpdate"
      autosave-tooltip="Autosave Character Sheet data on the end of every round. Defaults to ON."
      @manual-save="manualSave()" />
    <v-divider class="my-2" />
    <v-card-text>
      <v-row dense
        align="center"
        justify="space-between">
        <v-col>
          <v-btn flat
            tile
            block
            color="primary"
            size="small"
            prepend-icon="mdi-export"
            @click="exportState">
            Export Character Sheet State
          </v-btn>
        </v-col>
        <v-col>
          <cc-dialog :close-on-click="false"
            icon="mdi-import"
            title="Import Character Sheet State">
            <template #activator="{ open }">
              <v-btn flat
                tile
                block
                color="primary"
                size="small"
                prepend-icon="mdi-import"
                @click="open">
                Import Character Sheet State
              </v-btn>
            </template>
            <template #default="{ close }">
              <div class="text-cc-overline text-disabled">
                Character Sheet Instance Import File (.json)
              </div>
              <v-file-input v-model="fileValue"
                accept=".json"
                variant="outlined"
                density="compact"
                hide-details
                autofocus
                placeholder="Select Character Sheet Export File"
                prepend-icon="mdi-paperclip"
                @change="stageImport" />
              <v-scroll-y-reverse-transition>
                <div v-if="importOk && importObj">
                  <v-card class="mt-2 pa-2"
                    flat
                    tile
                    color="panel">
                    <div class="text-cc-overline text-disabled">Staged Import:</div>
                    <div class="ml-3">
                      <b class="text-accent">
                        {{ (importObj as any).Combatant.actor.Callsign || 'Unnamed Character Sheet'
                        }}
                      </b>
                      at Round
                      {{ (importObj as any).round }}
                      <i class="text-caption text-disabled">
                        {{ new Date((importObj as any).save.lastModified).toLocaleString() }}
                      </i>
                    </div>
                  </v-card>
                  <cc-alert color="warning"
                    prominent
                    class="mt-2">
                    <v-icon icon="mdi-alert"
                      start />
                    Warning: The imported Character Sheet state will replace the current Character
                    Sheet state.
                  </cc-alert>
                </div>
                <cc-alert v-if="importError"
                  color="error"
                  prominent
                  class="mt-2">
                  <v-icon icon="mdi-alert"
                    start />
                  {{ importError }}
                </cc-alert>
              </v-scroll-y-reverse-transition>
              <v-card-actions>
                <v-btn text
                  color="accent"
                  @click="
                    reset();
                  close();
                  ">
                  Cancel
                </v-btn>
                <v-spacer />
                <cc-button text
                  color="primary"
                  :disabled="!importOk"
                  @click="importState()">
                  Confirm Import
                </cc-button>
              </v-card-actions>
            </template>
          </cc-dialog>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="my-2" />

    <v-card-text>
      <v-row dense
        align="center"
        justify="end">
        <v-col cols="12"
          md=""
          class="heading">Change Active Mech</v-col>
        <v-col cols="12"
          md="">
          <cc-select v-model="activeMech"
            color="primary"
            :items="sheet.Combatant.actor.Mechs"
            :item-title="(m) => `${m.Name} (${m.Frame.Source} ${m.Frame.Name})`"
            return-object />
        </v-col>
        <v-col cols="auto">
          <cc-button text
            color="primary"
            :disabled="activeMech && (activeMech as Mech).ID === sheet.Combatant.actor.ActiveMech.ID"
            @click="setActiveMech()">
            Apply & Save
          </cc-button>
        </v-col>
      </v-row>
    </v-card-text>

  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mech } from '@/classes/mech/Mech'
import PilotSheet from '@/features/pilot_management/store/PilotSheet'
import { PilotSheetStore } from '@/stores'
import RunnerOptionsHeader from '../../_shared/_RunnerOptionsHeader.vue'
import { useRunnerOptions } from '../../_shared/useRunnerOptions'
import { notify } from '@kyvg/vue3-notification'

defineOptions({ name: 'PcOptionsPanel' })

const props = defineProps<{
  sheet: object
}>()

const router = useRouter()
const { fileValue, importObj, importOk, importError, saveUpdate, reset, exportStateFile, stageImportFile } = useRunnerOptions()

const activeMech = ref<Mech | null>(null)

onMounted(() => {
  reset()
  activeMech.value = (props.sheet as any).Combatant.actor.ActiveMech
})

function setActiveMech() {
  if (!activeMech.value) return
  ;(props.sheet as any).SetActiveMech(activeMech.value)
  notify({
    title: 'Active Mech Changed',
    text: `Active mech changed to ${activeMech.value.Name}. Character sheet state has been reset.`,
    data: { icon: 'cc:mech', color: 'info' },
  })
  manualSave()
}

function manualSave() {
  try {
    ;(props.sheet as any).Save()
    saveUpdate.value = Date.now()
    notify({
      title: 'Save Successful',
      text: `Saved Character Sheet: ${(props.sheet as any).Combatant.actor.Callsign} at Round ${(props.sheet as any).Round}`,
      data: { icon: 'mdi-content-save', color: 'success' },
    })
  } catch (error) {
    console.error('Manual Save Failed:', error)
    notify({
      title: 'Save Failed',
      text: `Failed to save Character Sheet: ${(props.sheet as any).Combatant.actor.Callsign}`,
      data: { icon: 'mdi-alert', color: 'error' },
    })
  }
}

function exportState() {
  exportStateFile(
    (props.sheet as any).Serialize(),
    `Character Sheet_${(props.sheet as any).Combatant.actor.Callsign || 'unknown'}_${Date.now()}.json`
  )
}

function importState() {
  if (!importOk.value || !importObj.value) return
  PilotSheetStore().ImportPilotSheet(PilotSheet.Deserialize(importObj.value as any))
  router.go(0)
}

function stageImport() {
  stageImportFile('sheet', 'Invalid Character Sheet Instance file.')
}
</script>
