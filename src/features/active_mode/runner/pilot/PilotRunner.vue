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
    <div class="text-center text-cc-overline">{{ $t('active.pilotRunner.loading') }}</div>
  </div>
  <div
    v-else
    class="cc-fill cc-fill-root"
  >
    <div
      v-if="!mobile"
      class="bg-surface border-s-sm no-print"
      :style="`width: ${showRight ? 256 : 56}px`"
      style="
        position: fixed;
        top: 0;
        right: 0;
        height: var(--cc-app-offset, 41px);
        transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      "
    />
    <div
      class="cc-fill"
      style="overflow: hidden"
    >
      <v-layout style="height: 100%; flex: 1 1 auto; min-height: 0">
        <v-main
          tabindex="0"
          style="overflow-y: auto"
        >
          <runner-undo-bar>
            {{ pilot.Callsign }}
          </runner-undo-bar>
          <v-container fluid>
            <div>
              <div v-if="panel && sheet">
                <component
                  :is="panelMap[panel]"
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
                <v-col
                  v-if="sheet.PlayMode !== 'simple'"
                  cols="auto"
                >
                  <actor-telemetry
                    :actor="pilot"
                    :encounter-instance="encounterInstance"
                  />
                </v-col>
                <v-col
                  v-if="sheet.PlayMode !== 'simple'"
                  cols="auto"
                >
                  <actor-logs
                    :actor="pilot"
                    :encounter-instance="encounterInstance"
                  />
                </v-col>
                <v-col cols="auto">
                  <combat-statblock-export
                    :actor="pilot"
                    :encounter-instance="encounterInstance"
                  />
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-main>

        <cc-panel-toggle
          v-model="showRight"
          side="right"
          :open-offset="mobile ? 55 : 255"
          :closed-offset="mobile ? 0 : 55"
          :bottom-inset="36"
        />

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
            @open-turn-wizard="wizardDialog = true"
            @open-dice-roller="diceDialog = true"
            @open-table-index="tableDialog = true"
          />
        </v-navigation-drawer>

        <v-navigation-drawer
          v-else
          v-model="showRight"
          location="right"
          temporary
        >
          <gm-tool-palette
            pc
            expanded
            :selected="panel"
            :combatant="combatant"
            @select-panel="selectPanel"
            @open-turn-wizard="wizardDialog = true"
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
              <pc-end-round
                v-model="endRoundDialog"
                :sheet="sheet"
              />
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
        :encounter-instance="encounterInstance"
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

    <turn-wizard
      v-model="wizardDialog"
      pc
      :encounter-instance="encounterInstance"
      @complete-turn="endRoundDialog = true"
    />

    <runner-leave-dialog
      v-model="leaveDialog"
      @save="handleLeave('save')"
      @exit="handleLeave('exit')"
      @cancel="handleLeave('cancel')"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, provide, watch, watchEffect } from 'vue'
  import { useDisplay } from 'vuetify'
  import { useRoute, onBeforeRouteLeave } from 'vue-router'
  import { PilotSheetStore } from '@/stores'
  import ActorTelemetry from '../gm/EncounterPanels/_components/ActorTelemetry.vue'
  import ActorLogs from '../gm/EncounterPanels/_components/ActorLogs.vue'
  import CombatStatblockExport from '../gm/EncounterPanels/_components/CombatStatblockExport.vue'
  import QuickReferencePanel from '../gm/InfoPanels/QuickReferencePanel.vue'
  import ReferenceTagPanel from '../gm/InfoPanels/ReferenceTagPanel.vue'
  import RollableTableIndex from '../gm/_components/RollableTableIndex.vue'
  import GmDiceRoller from '../gm/_components/GmDiceRoller.vue'
  import { Pilot } from '@/classes/pilot/Pilot'
  import { CloudTransferController } from '@/classes/components/cloud/CloudTransferController'
  import GmToolPalette from '../gm/_components/GmToolPalette.vue'
  import PcPanel from '../gm/EncounterPanels/PcPanel.vue'
  import NotesPanel from './_components/PcNotesPanel.vue'
  import OptionsPanel from './_components/PcOptionsPanel.vue'
  import DeployablesPanel from './_components/PcDeployablesPanel.vue'
  import PcEndRound from './_components/PcEndRound.vue'
  import PcEndEncounter from './_components/PcEndEncounter.vue'
  import RunnerLeaveDialog from '../_shared/_RunnerLeaveDialog.vue'
  import { consumeLeaveGuardBypass } from '../_shared/useRunnerOptions'
  import { useRunnerUndo } from '../_shared/useRunnerUndo'
  import RunnerUndoBar from '../_shared/_RunnerUndoBar.vue'
  import TurnWizard from '../_shared/TurnWizard.vue'
  import PilotSheet from '@/features/pilot_management/store/PilotSheet'
  import CcPanelToggle from '@/ui/components/buttons/CCPanelToggle.vue'
  import { LayoutModeKey } from '@/features/active_mode/layoutOptions'

  const panelMap: Record<string, any> = {
    pc: PcPanel,
    deployables: DeployablesPanel,
    notes: NotesPanel,
    'reference-tag': ReferenceTagPanel,
    'quick-reference': QuickReferencePanel,
    options: OptionsPanel,
  }

  const props = withDefaults(defineProps<{ id?: string | null }>(), { id: null })

  const { mdAndDown: mobile } = useDisplay()
  const route = useRoute()

  const showRight = ref(false)
  const panel = ref('pc')
  const diceDialog = ref(false)
  const wizardDialog = ref(false)
  const endRoundDialog = ref(false)
  const tableDialog = ref(false)
  const leaveDialog = ref(false)
  let resolveLeaveDialog: ((value: string) => void) | null = null

  const sheet = computed(() =>
    PilotSheetStore().GetSheet(
      props.id || (route.params.id as string) || PilotSheetStore().CurrentActiveID
    )
  )
  const sheetID = computed(() => (sheet.value ? sheet.value.ID : 0))
  watchEffect(onCleanup => {
    const id = sheet.value?.ID
    if (!id) return
    CloudTransferController.OpenItems.add(id)
    onCleanup(() => CloudTransferController.OpenItems.delete(id))
  })
  provide(
    LayoutModeKey,
    computed(() => sheet.value?.PlayMode ?? 'full')
  )
  const { recacheUndoBaseline } = useRunnerUndo(sheet, data =>
    PilotSheetStore().ReplaceSheet(PilotSheet.Deserialize(data))
  )
  watch(sheetID, id => id && recacheUndoBaseline(), { immediate: true })
  const combatant = computed(() => sheet.value!.Combatant)
  const pilot = computed(() => sheet.value!.Combatant.actor as Pilot)
  const encounterInstance = computed(() => sheet.value!.EncounterInstance)

  function selectPanel(p: string) {
    panel.value = panel.value === p ? 'pc' : p
  }

  function openLeaveDialog(): Promise<string> {
    leaveDialog.value = true
    return new Promise(resolve => {
      resolveLeaveDialog = resolve
    })
  }

  function handleLeave(choice: 'save' | 'exit' | 'cancel') {
    leaveDialog.value = false
    resolveLeaveDialog?.(choice)
    resolveLeaveDialog = null
  }

  onBeforeRouteLeave(async () => {
    if (consumeLeaveGuardBypass()) return true
    const choice = await openLeaveDialog()
    if (choice === 'save') {
      sheet.value?.Save()
      return true
    } else if (choice === 'exit') {
      return true
    }
    return false
  })
</script>
