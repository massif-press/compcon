<template>
  <div v-if="!sheet"
    :key="sheetID">
    <v-progress-linear indeterminate
      color="primary"
      height="20"
      class="my-5" />
    <div class="text-center text-cc-overline">Loading pilot sheet...</div>
  </div>
  <div v-else>
    <div style="overflow-y: hidden">
      <v-layout :style="`height: calc(100vh - ${$vuetify.display.xs ? '23px' : '41px'})`">
        <v-main style="overflow-y: scroll">
          <v-container fluid>
            <div>
              <div v-if="panel && sheet">
                <component :is="panelMap[panel]"
                  :key="panel"
                  :combatant="combatant"
                  :encounter="encounterInstance.Encounter"
                  :selected="pilot"
                  :sheet="sheet"
                  pc
                  :encounter-instance="encounterInstance" />
              </div>

              <v-row dense
                justify="end">
                <v-col cols="auto">
                  <actor-telemetry :actor="pilot"
                    :encounter="encounterInstance" />
                </v-col>
                <v-col cols="auto">
                  <actor-logs :actor="pilot"
                    :encounter="encounterInstance" />
                </v-col>
                <v-col cols="auto">
                  <combat-statblock-export :actor="pilot"
                    :encounter="encounterInstance" />
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-main>

        <div style="position: absolute; z-index: 999"
          :style="`right: ${showRight ? (mobile ? '60' : '256') : mobile ? '6' : '62'}px; top: 6px`">
          <cc-button :icon="showRight ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'"
            size="small"
            color="primary"
            @click="showRight = !showRight" />
        </div>

        <v-navigation-drawer v-if="!mobile"
          :rail="!showRight"
          location="right"
          permanent>
          <gm-tool-palette pc
            :expanded="showRight"
            :selected="panel"
            :combatant="combatant"
            @select-panel="selectPanel"
            @open-dice-roller="diceDialog = true"
            @open-table-index="tableDialog = true" />
        </v-navigation-drawer>

        <v-navigation-drawer v-else
          v-model="showRight"
          rail
          location="right">
          <gm-tool-palette pc
            :expanded="showRight"
            :selected="panel"
            :combatant="combatant"
            @select-panel="selectPanel"
            @open-dice-roller="diceDialog = true"
            @open-table-index="tableDialog = true" />
        </v-navigation-drawer>

        <v-footer app
          height="36"
          style="border-top: 1px solid rgba(255, 255, 255, 0.1)">
          <v-row justify="space-between"
            align="center"
            no-gutters>
            <v-col>
              <pc-end-round :sheet="sheet" />
            </v-col>
            <v-col>
              <pc-end-encounter :sheet="sheet" />
            </v-col>
          </v-row>
        </v-footer>
      </v-layout>
    </div>

    <v-dialog v-model="diceDialog"
      :fullscreen="mobile"
      max-height="80vh"
      max-width="80vw">
      <gm-dice-roller :encounter="encounterInstance"
        :selected="combatant"
        @close="diceDialog = false" />
    </v-dialog>

    <v-dialog v-model="tableDialog"
      :fullscreen="mobile"
      max-width="80vw">
      <rollable-table-index :instance="encounterInstance"
        :selected="combatant"
        @close="tableDialog = false" />
    </v-dialog>


    <cc-solo-dialog v-model="leaveDialog"
      :close-on-click="false"
      title="Exit Active Mode?"
      :z-index="9999">
      <v-card flat
        tile>

        <div class="text-center text-text ma-2">
          Do you want to save this encounter before exiting?</div>
        <v-divider class="my-3" />
        <v-card-actions class="pa-0">
          <cc-button variant="text"
            size="small"
            @click="handleLeave('cancel')">Cancel</cc-button>
          <v-spacer />
          <cc-button color="warning"
            size="small"
            variant="text"
            @click="handleLeave('exit')">Exit Without Saving</cc-button>
          <v-spacer />
          <cc-button color="accent"
            size="small"
            @click="handleLeave('save')">Save and Exit</cc-button>
        </v-card-actions>
      </v-card>
    </cc-solo-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { PilotStore } from '@/stores';
import ActorTelemetry from '../gm/EncounterPanels/_components/ActorTelemetry.vue';
import ActorLogs from '../gm/EncounterPanels/_components/ActorLogs.vue';
import CombatStatblockExport from '../gm/EncounterPanels/_components/CombatStatblockExport.vue';
import QuickReferencePanel from '../gm/InfoPanels/QuickReferencePanel.vue';
import ReferenceTagPanel from '../gm/InfoPanels/ReferenceTagPanel.vue';
import RollableTableIndex from '../gm/_components/RollableTableIndex.vue';
import GmDiceRoller from '../gm/_components/GmDiceRoller.vue';
import { Pilot } from '@/classes/pilot/Pilot'
import GmToolPalette from '../gm/_components/GmToolPalette.vue';
import PcPanel from '../gm/EncounterPanels/PcPanel.vue';
import NotesPanel from './_components/PcNotesPanel.vue';
import OptionsPanel from './_components/PcOptionsPanel.vue';
import DeployablesPanel from './_components/PcDeployablesPanel.vue';
import PcEndRound from './_components/PcEndRound.vue';
import PcEndEncounter from './_components/PcEndEncounter.vue';

const panelMap: Record<string, any> = {
  'pc': PcPanel,
  'deployables': DeployablesPanel,
  'notes': NotesPanel,
  'reference-tag': ReferenceTagPanel,
  'quick-reference': QuickReferencePanel,
  'options': OptionsPanel,
};

const props = withDefaults(defineProps<{ id?: string | null }>(), { id: null });

const { mdAndDown: mobile } = useDisplay();
const route = useRoute();

const showRight = ref(false);
const panel = ref('pc');
const diceDialog = ref(false);
const tableDialog = ref(false);
const leaveDialog = ref(false);
let resolveLeaveDialog: ((value: string) => void) | null = null;

const sheet = computed(() =>
  PilotStore().GetSheet(props.id || route.params.id as string || PilotStore().CurrentActiveID)
);
const sheetID = computed(() => sheet.value ? sheet.value.ID : 0);
const combatant = computed(() => sheet.value!.Combatant);
const pilot = computed(() => sheet.value!.Combatant.actor as Pilot);
const encounterInstance = computed(() => sheet.value!.EncounterInstance);

function selectPanel(p: string) {
  panel.value = panel.value === p ? 'pc' : p;
}

function openLeaveDialog(): Promise<string> {
  leaveDialog.value = true;
  return new Promise((resolve) => {
    resolveLeaveDialog = resolve;
  });
}

function handleLeave(choice: 'save' | 'exit' | 'cancel') {
  leaveDialog.value = false;
  resolveLeaveDialog?.(choice);
  resolveLeaveDialog = null;
}

onBeforeRouteLeave(async () => {
  const choice = await openLeaveDialog();
  if (choice === 'save') {
    sheet.value?.Save();
    return true;
  } else if (choice === 'exit') {
    return true;
  }
  return false;
});
</script>
