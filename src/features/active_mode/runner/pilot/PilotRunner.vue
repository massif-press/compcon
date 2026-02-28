<template>
  <div
    v-if="!sheet"
    :key="sheetID"
  >
    <v-progress-linear
      indeterminate
      color="primary"
      height="20"
      class="my-5"
    />
    <div class="text-center text-cc-overline">Loading pilot sheet...</div>
  </div>
  <div v-else>
    <div style="overflow-y: hidden">
      <v-layout :style="`height: calc(100vh - ${$vuetify.display.xs ? '23px' : '41px'})`">
        <v-main style="overflow-y: scroll">
          <v-container fluid>
            <div>
              <div v-if="panel && sheet">
                <component
                  :is="`${panel}-panel`"
                  :key="panel"
                  :combatant="combatant"
                  :encounter="encounterInstance.Encounter"
                  :selected="pilot"
                  :sheet="sheet"
                  pc
                  :encounter-instance="encounterInstance"
                />
              </div>

              <v-row
                dense
                justify="end"
              >
                <v-col cols="auto">
                  <actor-telemetry
                    :actor="pilot"
                    :encounter="encounterInstance"
                  />
                </v-col>
                <v-col cols="auto">
                  <actor-logs
                    :actor="pilot"
                    :encounter="encounterInstance"
                  />
                </v-col>
                <v-col cols="auto">
                  <combat-statblock-export
                    :actor="pilot"
                    :encounter="encounterInstance"
                  />
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-main>

        <div
          style="position: absolute; z-index: 999"
          :style="`right: ${showRight ? (mobile ? '60' : '256') : mobile ? '6' : '62'}px; top: 6px`"
        >
          <cc-button
            :icon="showRight ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'"
            size="small"
            color="primary"
            @click="showRight = !showRight"
          />
        </div>

        <v-navigation-drawer
          v-if="!mobile"
          :rail="!showRight"
          location="right"
          permanent
        >
          <gm-tool-palette
            pc
            :expanded="showRight"
            :selected="panel"
            :combatant="combatant"
            @select-panel="selectPanel"
            @open-dice-roller="diceDialog = true"
            @open-table-index="tableDialog = true"
          />
        </v-navigation-drawer>

        <v-navigation-drawer
          v-else
          v-model="showRight"
          rail
          location="right"
        >
          <gm-tool-palette
            pc
            :expanded="showRight"
            :selected="panel"
            :combatant="combatant"
            @select-panel="selectPanel"
            @open-dice-roller="diceDialog = true"
            @open-table-index="tableDialog = true"
          />
        </v-navigation-drawer>

        <v-footer
          app
          height="36"
          style="border-top: 1px solid rgba(255, 255, 255, 0.1)"
        >
          <v-row
            justify="space-between"
            align="center"
            no-gutters
          >
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

    <v-dialog
      v-model="diceDialog"
      :fullscreen="mobile"
      max-height="80vh"
      max-width="80vw"
    >
      <gm-dice-roller
        :encounter="encounterInstance"
        :selected="combatant"
        @close="diceDialog = false"
      />
    </v-dialog>

    <v-dialog
      v-model="tableDialog"
      :fullscreen="mobile"
      max-width="80vw"
    >
      <rollable-table-index
        :instance="encounterInstance"
        :selected="combatant"
        @close="tableDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
  import { PilotStore } from '@/stores'
  import ActorTelemetry from '../gm/EncounterPanels/_components/ActorTelemetry.vue'
  import ActorLogs from '../gm/EncounterPanels/_components/ActorLogs.vue'
  import CombatStatblockExport from '../gm/EncounterPanels/_components/CombatStatblockExport.vue'
  import QuickReferencePanel from '../gm/InfoPanels/QuickReferencePanel.vue'
  import ReferenceTagPanel from '../gm/InfoPanels/ReferenceTagPanel.vue'
  import RollableTableIndex from '../gm/_components/RollableTableIndex.vue'
  import GmDiceRoller from '../gm/_components/GmDiceRoller.vue'
  import { Pilot } from '@/class'
  import GmToolPalette from '../gm/_components/GmToolPalette.vue'
  import PcPanel from '../gm/EncounterPanels/PcPanel.vue'
  import NotesPanel from './_components/PcNotesPanel.vue'
  import OptionsPanel from './_components/PcOptionsPanel.vue'
  import DeployablesPanel from './_components/PcDeployablesPanel.vue'
  import PcEndRound from './_components/PcEndRound.vue'
  import PcEndEncounter from './_components/PcEndEncounter.vue'

  export default {
    name: 'PilotRunner',
    components: {
      ActorTelemetry,
      ActorLogs,
      CombatStatblockExport,
      QuickReferencePanel,
      ReferenceTagPanel,
      RollableTableIndex,
      GmToolPalette,
      GmDiceRoller,
      PcPanel,
      DeployablesPanel,
      NotesPanel,
      OptionsPanel,
      PcEndRound,
      PcEndEncounter,
    },
    props: {
      id: {
        type: String,
        required: false,
        default: null,
      },
    },
    data: () => ({
      loading: false,
      err: false,
      showRight: false,
      panel: 'pc',
      diceDialog: false,
      tableDialog: false,
    }),
    computed: {
      combatant() {
        return this.sheet!.Combatant
      },
      pilot() {
        return this.sheet!.Combatant.actor as Pilot
      },
      mobile() {
        return this.$vuetify.display.mdAndDown
      },
      sheet() {
        return PilotStore().GetSheet(
          this.id || this.$route.params.id || PilotStore().CurrentActiveID
        )
      },
      sheetID() {
        return this.sheet ? this.sheet.ID : 0
      },
      encounterInstance() {
        return this.sheet!.EncounterInstance
      },
    },
    methods: {
      selectPanel(panel) {
        this.panel = this.panel === panel ? null : panel
      },
    },
  }
</script>
