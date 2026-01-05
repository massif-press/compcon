<template>
  <v-card>
    <v-card-text>
      <v-row dense align="center" justify="space-between">
        <v-col cols="auto" class="heading">
          Last Saved:
          <b class="text-accent ml-1" :key="saveUpdate">
            {{
              new Date(encounterInstance.SaveController.LastModified).toLocaleString(undefined, {
                dateStyle: 'long',
                timeStyle: 'long',
              })
            }}
          </b>
        </v-col>
        <v-col cols="auto">
          <cc-button
            flat
            tile
            color="primary"
            prepend-icon="mdi-content-save"
            size="small"
            @click="manualSave()">
            Manual Save
          </cc-button>
        </v-col>
      </v-row>
      <div class="text-cc-overline mt-1 text-disabled">Autosave</div>
      <v-row dense align="center" justify="space-between">
        <v-col cols="auto">
          <cc-switch
            v-model="encounterInstance.Autosave"
            size="large"
            :label="encounterInstance.Autosave ? 'On Round End' : 'Off (Manual Saves Only)'"
            tooltip="Autosave encounter data on the end of every round. Defaults to ON." />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="my-2" />
    <v-card-text>
      <v-row dense align="center" justify="space-between">
        <v-col>
          <v-btn
            flat
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
          <cc-dialog :close-on-click="false" icon="mdi-import" title="Import Encounter State">
            <template #activator="{ open }">
              <v-btn
                flat
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
              <v-file-input
                v-model="fileValue"
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
                  <v-card class="mt-2 pa-2" flat tile color="panel">
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
                  <cc-alert color="warning" prominent class="mt-2">
                    <v-icon icon="mdi-alert" start />
                    Warning: The imported encounter state will replace the current encounter state.
                  </cc-alert>
                </div>
                <cc-alert v-if="importError" color="error" prominent class="mt-2">
                  <v-icon icon="mdi-alert" start />
                  {{ importError }}
                </cc-alert>
              </v-scroll-y-reverse-transition>
              <v-card-actions>
                <v-btn
                  text
                  color="accent"
                  @click="
                    reset();
                    close();
                  ">
                  Cancel
                </v-btn>
                <v-spacer />
                <cc-button text color="primary" :disabled="!importOk" @click="importState()">
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
      <v-row dense align="center" justify="space-between">
        <v-col class="heading">Set Round</v-col>
        <v-col>
          <cc-number-field color="primary" v-model="encounterInstance.Round" min="1" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="my-2" />

    <v-card-text>
      <div class="text-cc-overline text-disabled">Overrides</div>
      <v-expansion-panels variant="accordion" color="panel">
        <v-expansion-panel
          v-for="combatant in encounterInstance.Combatants.filter((c) => !c.reinforcement)">
          <v-expansion-panel-title>
            <div class="heading h3">{{ combatant.actor.Name }}</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="bg-background pa-0 mx-n5">
            <cc-select
              v-model="combatant.side"
              color="primary"
              chip-variant="text"
              :items="['ally', 'enemy', 'neutral']"
              label="Side" />
            <br />
            <div v-if="combatant.actor.StatController">
              <v-row
                v-for="key in combatant.actor.StatController.MaxStats"
                :key="key"
                dense
                class="border-sm mb-1 px-2"
                align="center">
                <v-col class="heading">{{ key }}</v-col>
                <v-col class="mx-6">
                  <div class="text-cc-overline ml-4 text-disabled">Current</div>
                  <cc-number-field
                    color="primary"
                    v-model="combatant.actor.StatController.CurrentStats[key]" />
                </v-col>
                <v-col>
                  <div class="text-cc-overline ml-4 text-disabled">Max</div>
                  <cc-number-field
                    color="exotic"
                    v-model="combatant.actor.StatController.MaxStats[key]" />
                </v-col>
              </v-row>
              <div class="d-flex justify-space-between pa-2">
                <v-btn flat tile size="small" color="primary">Add Stat</v-btn>
                <v-btn flat tile color="error" size="small" @click="removeActor(combatant.actor)">
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
      <i v-if="!reinforcements.length" class="text-text ml-2">No Reinforcement Schedule</i>
      <v-row v-for="combatant in reinforcements" :key="combatant.id" dense align="center">
        <v-col class="heading h3">{{ combatant.actor.Name }}</v-col>
        <v-col cols="auto">
          <cc-number-field
            color="primary"
            v-model="combatant.reinforcementTurn"
            label="Round"
            min="1" />
        </v-col>
        <v-col cols="auto">
          <v-btn flat tile color="error" size="small" @click="removeActor(combatant.actor)">
            Remove
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn flat tile color="primary" size="small" @click="removeActor(combatant.actor)">
            Deploy
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { EncounterStore } from '@/stores';

export default {
  name: 'gm-options-panel',
  props: {
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fileValue: null,
      importObj: null,
      importOk: false,
      importError: '',
      saveUpdate: Date.now(),
    };
  },
  mounted() {
    this.reset();
  },
  computed: {
    reinforcements() {
      return this.encounterInstance.Combatants.filter((c) => c.reinforcement);
    },
  },
  methods: {
    reset() {
      this.fileValue = null;
      this.importObj = null;
      this.importOk = false;
      this.importError = '';
    },
    removeActor(actor) {
      const combatantIndex = this.encounterInstance.Combatants.findIndex(
        (c) => c.actor.ID === actor.ID
      );
      if (combatantIndex !== -1) {
        this.encounterInstance.Combatants.splice(combatantIndex, 1);
      }
    },
    manualSave() {
      try {
        this.encounterInstance.Save();
        this.saveUpdate = Date.now();
        this.$notify({
          title: `Save Successful`,
          text: `Saved Encounter: ${this.encounterInstance.Encounter.Name} at Round ${this.encounterInstance.Round}`,
          data: { icon: 'mdi-content-save', color: 'success' },
        });
      } catch (error) {
        console.error('Manual Save Failed:', error);
        this.$notify({
          title: `Save Failed`,
          text: `Failed to save Encounter: ${this.encounterInstance.Encounter.Name}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
    exportState() {
      const data = this.encounterInstance.Serialize();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const filename = `encounter_${this.encounterInstance.Encounter.Name || 'unknown'}_${Date.now()}.json`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    importState() {
      if (!this.importOk || !this.importObj) {
        return;
      }
      EncounterStore().AddEncounterInstance(EncounterInstance.Deserialize(this.importObj));
      this.$router.go();
    },
    stageImport() {
      if (!this.fileValue) {
        this.importOk = false;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const result = e.target.result;
          this.importObj = JSON.parse(result);
          if (!this.importObj) {
            this.importOk = false;
            return;
          }
          if (
            !(this.importObj as any).itemType ||
            (this.importObj as any).itemType !== 'EncounterInstance'
          ) {
            this.importError = 'Invalid Encounter Instance file.';
            this.importOk = false;
            return;
          }
          console.log(this.importObj);
          this.importOk = true;
        } catch (error) {
          console.error('Failed to parse import file:', error);
          this.importError = 'Invalid JSON file.';
          this.importOk = false;
        }
      };
      reader.readAsText(this.fileValue);
    },
  },
};
</script>
