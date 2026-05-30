<template>
  <v-card>
    <runner-options-header
      :context="encounterInstance"
      :save-key="saveUpdate"
      autosave-tooltip="Autosave encounter data on the end of every round. Defaults to ON."
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
            Export Encounter State
          </v-btn>
        </v-col>
        <v-col>
          <cc-dialog :close-on-click="false"
            icon="mdi-import"
            title="Import Encounter State">
            <template #activator="{ open }">
              <v-btn flat
                tile
                block
                color="primary"
                size="small"
                prepend-icon="mdi-import"
                @click="open">
                Import Encounter State
              </v-btn>
            </template>
            <template #default="{ close }">
              <div class="text-cc-overline text-disabled">
                Encounter Instance Import File (.json)
              </div>
              <v-file-input v-model="fileValue"
                accept=".json"
                variant="outlined"
                density="compact"
                hide-details
                autofocus
                placeholder="Select Encounter Export File"
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
                        {{ (importObj as any).encounter.name || 'Unnamed Encounter' }}
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
                    Warning: The imported encounter state will replace the current encounter state.
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
                  @click="importState(close)">
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
        justify="space-between">
        <v-col class="heading">Set Round</v-col>
        <v-col>
          <cc-number-field v-model="encounterInstance.Round"
            color="primary"
            min="1" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="my-2" />

    <v-card-text>
      <div class="text-cc-overline text-disabled">Overrides</div>
      <v-expansion-panels variant="accordion"
        color="panel">
        <v-expansion-panel
          v-for="combatant in encounterInstance.Combatants.filter((c) => !c.reinforcement)"
          :key="combatant.id">
          <v-expansion-panel-title>
            <div class="heading h3">{{ combatant.actor.Name }}</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="bg-background pa-0 mx-n5">
            <cc-select v-model="combatant.side"
              color="primary"
              chip-variant="text"
              :items="['ally', 'enemy', 'neutral']"
              label="Side" />
            <br />
            <div v-if="combatant.actor.StatController">
              <v-row v-for="stat in combatant.actor.StatController.DisplayKeys"
                :key="stat.key"
                dense
                class="border-sm mb-1 px-2"
                align="center">
                <v-col class="heading">{{ stat.title }}</v-col>
                <v-col class="mx-6">
                  <div class="text-cc-overline ml-4 text-disabled">Current</div>
                  <cc-number-field v-model="combatant.actor.StatController.CurrentStats[stat.key]"
                    color="primary" />
                </v-col>
                <v-col>
                  <div class="text-cc-overline ml-4 text-disabled">Max</div>
                  <cc-number-field v-model="combatant.actor.StatController.MaxStats[stat.key]"
                    color="exotic" />
                </v-col>
              </v-row>
              <div class="d-flex justify-space-between pa-2">
                <v-btn flat
                  tile
                  size="small"
                  color="primary">Add Stat</v-btn>
                <v-btn flat
                  tile
                  color="error"
                  size="small"
                  @click="removeActor(combatant.actor)">
                  Remove {{ combatant.actor.Name }} From Encounter
                </v-btn>
              </div>
            </div>
            <div v-else>No Stat Controller Found</div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-text>
      <div class="text-cc-overline text-disabled mb-1">Edit Reinforcements</div>
      <i v-if="!reinforcements.length"
        class="text-text ml-2">No Reinforcement Schedule</i>
      <v-row v-for="combatant in reinforcements"
        :key="combatant.id"
        dense
        align="center">
        <v-col class="heading h3">{{ combatant.actor.Name }}</v-col>
        <v-col cols="auto">
          <cc-number-field v-model="combatant.reinforcementTurn"
            color="primary"
            label="Round"
            min="1" />
        </v-col>
        <v-col cols="auto">
          <v-btn flat
            tile
            color="error"
            size="small"
            @click="removeActor(combatant.actor)">
            Remove
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn flat
            tile
            color="primary"
            size="small"
            @click="removeActor(combatant.actor)">
            Deploy
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterStore } from '@/stores'
import RunnerOptionsHeader from '../../_shared/_RunnerOptionsHeader.vue'
import { useRunnerOptions } from '../../_shared/useRunnerOptions'
import { notify } from '@kyvg/vue3-notification'

defineOptions({ name: 'GmOptionsPanel' })

const props = defineProps<{
  encounterInstance: object
}>()

const router = useRouter()
const { fileValue, importObj, importOk, importError, saveUpdate, reset, exportStateFile, stageImportFile } = useRunnerOptions()

onMounted(() => { reset() })

const reinforcements = computed(() =>
  (props.encounterInstance as any).Combatants.filter((c: any) => c.reinforcement)
)

function removeActor(actor: any) {
  const idx = (props.encounterInstance as any).Combatants.findIndex((c: any) => c.actor.ID === actor.ID)
  if (idx !== -1) (props.encounterInstance as any).Combatants.splice(idx, 1)
}

function manualSave() {
  try {
    ;(props.encounterInstance as any).Save()
    saveUpdate.value = Date.now()
    notify({
      title: 'Save Successful',
      text: `Saved Encounter: ${(props.encounterInstance as any).Encounter.Name} at Round ${(props.encounterInstance as any).Round}`,
      data: { icon: 'mdi-content-save', color: 'success' },
    })
  } catch (error) {
    console.error('Manual Save Failed:', error)
    notify({
      title: 'Save Failed',
      text: `Failed to save Encounter: ${(props.encounterInstance as any).Encounter.Name}`,
      data: { icon: 'mdi-alert', color: 'error' },
    })
  }
}

function exportState() {
  exportStateFile(
    (props.encounterInstance as any).Serialize(),
    `encounter_${(props.encounterInstance as any).Encounter.Name || 'unknown'}_${Date.now()}.json`
  )
}

async function importState(close: () => void) {
  if (!importOk.value || !importObj.value) return
  await EncounterStore().AddEncounterInstance(EncounterInstance.Deserialize(importObj.value))
  await EncounterStore().SaveActiveEncounterData()
  reset()
  close()
  router.go(0)
}

function stageImport() {
  stageImportFile('EncounterInstance', 'Invalid Encounter Instance file.')
}
</script>
