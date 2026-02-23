<template>
  <v-card>
    <v-card-text>
      <v-row dense
        align="center"
        justify="space-between">
        <v-col cols="auto"
          class="heading">
          Last Saved:
          <b v-if="sheet.SaveController.LastModified > 0"
            class="text-accent ml-1"
            :key="saveUpdate">
            {{
              new Date(sheet.SaveController.LastModified).toLocaleString(undefined, {
                dateStyle: 'long',
                timeStyle: 'long',
              })
            }}
          </b>
          <i v-else
            class="text-disabled ml-1">Never</i>
        </v-col>
        <v-col cols="auto">
          <cc-button flat
            tile
            color="primary"
            prepend-icon="mdi-content-save"
            size="small"
            @click="manualSave()">
            Manual Save
          </cc-button>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="text-cc-overline mt-1 text-disabled">Autosave</div>
          <cc-switch v-model="sheet.Autosave"
            size="large"
            :label="sheet.Autosave ? 'On Round End' : 'Off (Manual Saves Only)'"
            tooltip="Autosave Character Sheet data on the end of every round. Defaults to ON." />
        </v-col>
        <v-col>
          <div class="text-cc-overline mt-1 text-disabled">Tracker Style</div>
          <cc-switch v-model="sheet.SimpleTickbars"
            size="large"
            :label="sheet.SimpleTickbars ? 'Simple' : 'Standard'"
            tooltip="Replace the thematic stat trackers for HP, Heat, etc. with straightforward number inputs" />
        </v-col>
      </v-row>
    </v-card-text>
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

<script lang="ts">
import { Mech } from '@/class';
import PilotSheet from '@/features/pilot_management/store/PilotSheet';
import { PilotStore } from '@/stores';


export default {
  name: 'pc-options-panel',
  props: {
    sheet: {
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
      activeMech: null,
    };
  },
  mounted() {
    this.reset();
    this.activeMech = this.sheet.Combatant.actor.ActiveMech;
  },
  methods: {
    reset() {
      this.fileValue = null;
      this.importObj = null;
      this.importOk = false;
      this.importError = '';
    },
    setActiveMech() {
      if (!this.activeMech) return;
      this.sheet.SetActiveMech(this.activeMech);
      this.$notify({
        title: 'Active Mech Changed',
        text: `Active mech changed to ${(this.activeMech as Mech).Name}. Character sheet state has been reset.`,
        data: { icon: 'cc:mech', color: 'info' },
      });
      this.manualSave();
    },
    manualSave() {
      try {
        this.sheet.Save();
        this.saveUpdate = Date.now();
        this.$notify({
          title: `Save Successful`,
          text: `Saved Character Sheet: ${this.sheet.Combatant.actor.Callsign} at Round ${this.sheet.Round}`,
          data: { icon: 'mdi-content-save', color: 'success' },
        });
      } catch (error) {
        console.error('Manual Save Failed:', error);
        this.$notify({
          title: `Save Failed`,
          text: `Failed to save Character Sheet: ${this.sheet.Combatant.actor.Callsign}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
    },
    exportState() {
      const data = this.sheet.Serialize();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const filename = `Character Sheet_${this.sheet.Combatant.actor.Callsign || 'unknown'}_${Date.now()}.json`;
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
      PilotStore().ImportPilotSheet(PilotSheet.Deserialize(this.importObj as any));
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
            (this.importObj as any).itemType !== 'sheet'
          ) {
            this.importError = 'Invalid Character Sheet Instance file.';
            this.importOk = false;
            return;
          }
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
