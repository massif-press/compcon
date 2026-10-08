<template>
  <cc-dialog :model-value="modelValue"
    :title="$t('active.turnWizard.title')"
    icon="mdi-auto-fix"
    color="primary"
    :close-on-click="false"
    max-width="1000"
    height="92vh"
    no-gutters
    @update:model-value="onDialogModel($event)">
    <template #toolbar-items>
      <v-btn icon
        size="small"
        variant="text"
        :disabled="!undo.undoMeta.value.canUndo"
        @click="undo.doUndo()">
        <v-icon icon="mdi-undo" />
        <v-tooltip activator="parent"
          location="bottom"
          :text="$t('active.gmRunner.undo')" />
      </v-btn>
      <v-btn icon
        size="small"
        variant="text"
        :disabled="!undo.undoMeta.value.canRedo"
        @click="undo.doRedo()">
        <v-icon icon="mdi-redo" />
        <v-tooltip activator="parent"
          location="bottom"
          :text="$t('active.gmRunner.redo')" />
      </v-btn>
    </template>
    <div v-if="current"
      class="d-flex flex-column h-100">
      <v-tabs v-if="!pc"
        v-model="tabId"
        height="56"
        bg-color="primary"
        center-active
        show-arrows>
        <v-tab v-for="c in tabs"
          :key="c.id"
          :value="c.id"
          size="large"
          selected-class="bg-accent"
          :class="activationsOf(c) ? '' : 'text-disabled'">
          {{ nameOf(c) }}
          <v-avatar v-for="i in maxActivationsOf(c)"
            :key="i"
            size="20"
            class="ml-1"
            :color="i <= completedOf(c) ? 'success' : undefined"
            :style="i <= completedOf(c) ? undefined : 'opacity: 0.4'">
            <v-icon :icon="i <= completedOf(c) ? 'mdi-check' : 'cc:activate'"
              size="14" />
          </v-avatar>
        </v-tab>
      </v-tabs>
      <div v-if="turnComplete"
        class="heading h2 text-success pa-8 flex-grow-1 d-flex align-center justify-center">
        <v-icon icon="mdi-check-circle"
          start />
        {{ $t('active.turnWizard.turnComplete') }}
      </div>
      <div v-else
        :key="current.id"
        class="flex-grow-1 d-flex flex-column">
        <div class="pa-4 flex-grow-1">
          <v-row v-if="speed > 0 && (canMove || showBlockedMove)"
            dense
            align="center"
            justify="center"
            class="mb-2">
            <v-col cols="auto">
              <b>{{ $t('active.runner.movement') }}</b>
              <span class="text-caption text-disabled ml-1">
                {{ $t('active.turnWizard.moveRemaining', { n: speed }) }}
              </span>
            </v-col>
            <v-col cols="auto">
              <v-text-field v-model.number="moveSpaces"
                type="number"
                min="1"
                :max="speed"
                density="compact"
                variant="outlined"
                hide-details
                style="width: 100px"
                :aria-label="$t('active.turnWizard.moveSpaces')" />
            </v-col>
            <v-col cols="auto">
              <cc-button size="small"
                color="primary"
                @click="commitMove()">
                {{ $t('active.turnWizard.commitMove') }}
              </cc-button>
            </v-col>
          </v-row>
          <div v-if="speed > 0 && !canMove"
            class="text-center">
            <unavailable-toggle v-model="showBlockedMove"
              :count="1" />
          </div>

          <component :is="actionsPanel"
            v-if="actionsPanel"
            @deploy="deploy($event)" />

          <div v-if="encounterInstance.PlayMode !== 'simple'"
            class="text-center mt-6">
            <cover-toggle :controller="controller" />
          </div>
        </div>

        <div class="pa-4 bg-surface"
          style="position: sticky; bottom: 0; z-index: 1">
          <cc-button v-if="pc"
            block
            color="success"
            prepend-icon="cc:activate"
            @click="completePcTurn()">
            {{ $t('active.turnWizard.completeTurn') }}
          </cc-button>
          <end-turn-control v-else
            v-slot="{ confirm }"
            :cc="controller"
            @complete="onTurnComplete()">
            <cc-button block
              color="success"
              prepend-icon="cc:activate"
              @click="confirm">
              {{ $t('active.turnWizard.completeTurn') }}
            </cc-button>
          </end-turn-control>
        </div>
      </div>
    </div>
  </cc-dialog>

  <v-dialog v-model="closePrompt"
    max-width="500">
    <v-card class="pa-4">
      <div class="heading h3 mb-2">{{ $t('active.turnWizard.closePromptTitle') }}</div>
      <div>{{ $t('active.turnWizard.closePromptText') }}</div>
      <v-checkbox v-model="dontAskAgain"
        density="compact"
        hide-details
        :label="$t('active.turnWizard.dontAskAgain')" />
      <v-card-actions>
        <cc-button variant="text"
          @click="reopen()">
          {{ $t('common.cancel') }}
        </cc-button>
        <v-spacer />
        <cc-button color="warning"
          prepend-icon="mdi-undo"
          @click="resolveClose('undo')">
          {{ $t('active.turnWizard.undoActions') }}
        </cc-button>
        <cc-button color="primary"
          @click="resolveClose('keep')">
          {{ $t('active.turnWizard.keepActions') }}
        </cc-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { isOutOfCombat, type CombatantData } from '@/classes/encounter/Encounter'
import type { CombatController } from '@/classes/components/combat/CombatController'
import { EncounterContextKey } from '../gm/EncounterPanels/encounterContext'
import MechActionsPanel from '../gm/EncounterPanels/_components/MechActionsPanel.vue'
import PilotActionsPanel from '../gm/EncounterPanels/_components/PilotActionsPanel.vue'
import NpcActionsPanel from '../gm/EncounterPanels/_components/NpcActionsPanel.vue'
import EndTurnControl from '../gm/EncounterPanels/_components/EndTurnControl.vue'
import CoverToggle from '../gm/EncounterPanels/_components/CoverToggle.vue'
import UnavailableToggle from '../gm/EncounterPanels/_components/loadouts/action_buttons/_unavailableToggle.vue'
import { injectRunnerUndo } from './useRunnerUndo'
import { turnWizardClosePolicy } from '@/features/active_mode/turnWizard'

defineOptions({ name: 'TurnWizard' })

const props = defineProps<{
  modelValue: boolean
  encounterInstance: EncounterInstance
  pc?: boolean
  initialId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'complete-turn': []
}>()

const { t } = useI18n()
const undo = injectRunnerUndo()

const TAB_TYPES = ['pilot', 'unit', 'eidolon']

const tabs = computed(() =>
  (props.encounterInstance?.Combatants ?? []).filter(
    c => TAB_TYPES.includes(c.type) && !c.reinforcement && !isOutOfCombat(c)
  )
)
const tabId = ref('')
const current = computed<CombatantData | undefined>(
  () => tabs.value.find(c => c.id === tabId.value) ?? tabs.value[0]
)

provide(EncounterContextKey, {
  owner: computed(() => current.value as CombatantData),
  encounterInstance: computed(() => props.encounterInstance),
  wizard: true,
})

const controllerOf = (c: CombatantData): CombatController =>
  (c.actor as any).CombatController.ActiveActor.CombatController
const controller = computed(() => controllerOf(current.value as CombatantData))

function activationsOf(c: CombatantData): number {
  return controllerOf(c).StatController.CurrentStats['activations'] || 0
}

function maxActivationsOf(c: CombatantData): number {
  return controllerOf(c).StatController.MaxStats['activations'] || 0
}

function completedOf(c: CombatantData): number {
  return maxActivationsOf(c) - activationsOf(c)
}

const turnComplete = computed(() => {
  const c = current.value as CombatantData
  return maxActivationsOf(c) > 0 && activationsOf(c) <= 0
})

function nameOf(c: CombatantData): string {
  const actor = c.actor as any
  const name = actor.Callsign || actor.Name
  return c.type === 'unit' && c.number ? `${name} #${c.number}` : name
}

const actionsPanel = computed(() => {
  if (current.value?.type === 'unit') return NpcActionsPanel
  if (current.value?.type === 'pilot')
    return controller.value.IsMech ? MechActionsPanel : PilotActionsPanel
  return null
})

const speed = computed<number>(() => controller.value.StatController.CurrentStats['speed'] || 0)
const canMove = computed(() => controller.value.CanActivate('move'))
const showBlockedMove = ref(false)
const moveSpaces = ref(1)
watch(speed, v => (moveSpaces.value = v), { immediate: true })

function commitMove() {
  const spaces = Math.min(Math.max(1, Math.floor(Number(moveSpaces.value) || 0)), speed.value)
  controller.value.SpendMovement(spaces)
}

function deploy(deployable: any) {
  props.encounterInstance.Deploy(deployable, current.value as CombatantData)
}

let baseline: string | null = null
let resuming = false
const closePrompt = ref(false)
const dontAskAgain = ref(false)

function comparable(json: string | null): string {
  if (!json) return ''
  const state = JSON.parse(json)
  delete state.save
  delete state.cloud
  delete state.layout
  delete state.turn_wizard_close
  return JSON.stringify(state)
}

function rebaseline() {
  baseline = undo.captureBaseline()
}

watch(
  () => props.modelValue,
  open => {
    if (!open) return
    if (resuming) {
      resuming = false
      return
    }
    const list = tabs.value
    const start =
      list.find(c => c.id === props.initialId) ?? list.find(c => activationsOf(c) > 0) ?? list[0]
    tabId.value = start?.id ?? ''
    showBlockedMove.value = false
    dontAskAgain.value = false
    rebaseline()
  }
)

function close() {
  rebaseline()
  emit('update:modelValue', false)
}

function reopen() {
  closePrompt.value = false
  resuming = true
  emit('update:modelValue', true)
}

async function resolveClose(choice: 'keep' | 'undo') {
  if (dontAskAgain.value) props.encounterInstance.TurnWizardClose = choice
  closePrompt.value = false
  if (choice === 'undo' && baseline)
    await undo.restoreTo(baseline, t('active.turnWizard.undoLabel'))
  rebaseline()
}

function onDialogModel(open: boolean) {
  if (open) return
  emit('update:modelValue', false)
  if (comparable(undo.captureBaseline()) === comparable(baseline)) return
  const policy = props.encounterInstance.TurnWizardClose ?? turnWizardClosePolicy()
  if (policy === 'ask') closePrompt.value = true
  else resolveClose(policy)
}

function onTurnComplete() {
  rebaseline()
  const list = tabs.value
  const idx = list.findIndex(c => c.id === current.value?.id)
  if (idx !== -1 && activationsOf(list[idx]) > 0) return
  const next = [...list.slice(idx + 1), ...list.slice(0, idx)].find(c => activationsOf(c) > 0)
  if (next) tabId.value = next.id
  else close()
}

function completePcTurn() {
  close()
  emit('complete-turn')
}
</script>
