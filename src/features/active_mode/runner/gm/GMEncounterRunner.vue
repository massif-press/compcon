<template>
  <div v-if="!instance"
    :key="instanceID">
    <v-progress-linear indeterminate
      color="primary"
      height="20"
      class="my-5" />
    <div class="text-center text-cc-overline">{{ $t('active.gmRunner.loading') }}</div>
  </div>
  <div v-else>
    <div style="overflow-y: hidden">
      <v-layout :style="`height: calc(100vh - ${xs ? '23px' : '41px'})`">
        <cc-panel-toggle v-model="showLeft"
          side="left"
          :open-offset="419"
          :closed-offset="91"
          :bottom-inset="36" />
        <div location="left"
          class="bg-background border-sm"
          :style="`width: ${showLeft ? '420' : '92'}px;`"
          style="
          position:
          absolute;
          z-index:
          3;
          height:
          calc(100vh
          -
          76px);
          overflow-y:
          auto">
          <gm-initiative-panel :encounter-instance="instance"
            :selected="selected"
            :expanded="showLeft"
            @select="selectActor($event)" />
        </div>

        <v-main style="overflow-y: scroll"
          :style="`padding-left:${mainLeftOffset}`">
          <div class="d-flex align-center justify-center bg-panel pa-1">
            <cc-button icon="mdi-undo"
              size="x-small"
              color="primary"
              class="mr-2"
              :disabled="!undoMeta.canUndo"
              :tooltip="undoMeta.canUndo ? $t('active.gmRunner.undoTooltip', { label: undoMeta.undoLabel }) : $t('active.gmRunner.undo')"
              @click="doUndo" />
            <div class="text-center heading h3 mx-3">
              {{ instance.Name }} &mdash; {{ $t('active.gmRunner.roundN', { n: instance.Round }) }}
            </div>
            <cc-button icon="mdi-redo"
              size="x-small"
              color="primary"
              class="ml-2"
              :disabled="!undoMeta.canRedo"
              :tooltip="undoMeta.canRedo ? $t('active.gmRunner.redoTooltip', { label: undoMeta.redoLabel }) : $t('active.gmRunner.redo')"
              @click="doRedo" />
          </div>
          <v-container>
            <div v-if="panel && instance">
              <component :is="panelMap[panel]"
                :key="panel"
                :encounter="instance.Encounter"
                :selected="selected"
                :encounter-instance="instance" />
            </div>
            <div v-else>
              <component :is="typeMap[selected.type]"
                :key="selected.id"
                :combatant="selected"
                :encounter-instance="instance"
                @deselect="selectActor($event)" />
              <v-row dense
                justify="end">
                <v-col cols="auto">

                  <actor-telemetry
                    v-if="selected.actor && selected.actor.CombatController.RootActor.ItemType === 'Pilot'"
                    :actor="selected.actor.CombatController.RootActor"
                    :encounter-instance="instance" />
                </v-col>
                <v-col cols="auto">

                  <actor-logs v-if="selected.actor"
                    :actor="selected.actor.CombatController.RootActor"
                    :encounter-instance="instance" />
                </v-col>
                <v-col cols="auto">
                  <combat-statblock-export v-if="selected.actor"
                    :actor="selected.actor.CombatController.RootActor"
                    :encounter-instance="instance" />
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-main>
        <cc-panel-toggle v-if="!mobile"
          v-model="showRight"
          side="right"
          :open-offset="249"
          :closed-offset="55"
          :bottom-inset="36" />

        <v-navigation-drawer :rail="!showRight"
          :width="250"
          location="right"
          permanent>
          <gm-tool-palette :expanded="showRight"
            :selected="panel"
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
              <gm-end-round-panel :encounter-instance="instance" />
            </v-col>
            <v-col>
              <gm-end-encounter-panel :encounter-instance="instance" />
            </v-col>
          </v-row>
        </v-footer>
      </v-layout>
    </div>
    <v-dialog v-model="diceDialog"
      max-height="80vh"
      max-width="80vw">
      <gm-dice-roller :encounter-instance="instance"
        :selected="selected"
        @close="diceDialog = false" />
    </v-dialog>

    <v-dialog v-model="tableDialog"
      max-width="80vw">
      <rollable-table-index :instance="instance"
        :selected="selected"
        @close="tableDialog = false" />
    </v-dialog>

    <runner-leave-dialog v-model="leaveDialog"
      @save="handleLeave('save')"
      @exit="handleLeave('exit')"
      @cancel="handleLeave('cancel')" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useDisplay } from 'vuetify';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { orderBy } from 'lodash-es';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import {
  undo as undoStack,
  redo as redoStack,
  pushCachedSnapshot,
  serializeSnapshot,
  getUndoMeta,
} from '@/classes/encounter/EncounterUndoStack';
import DeployablePanel from './EncounterPanels/DeployablePanel.vue';
import DoodadPanel from './EncounterPanels/DoodadPanel.vue';
import UnitPanel from './EncounterPanels/UnitPanel.vue';
import PilotPanel from './EncounterPanels/PcPanel.vue';
import EncounterInfoPanel from './InfoPanels/EncounterInfoPanel.vue';
import GmDiceRoller from './_components/GmDiceRoller.vue';
import ReferenceTagPanel from './InfoPanels/ReferenceTagPanel.vue';
import RollableTableIndex from './_components/RollableTableIndex.vue';
import QuickReferencePanel from './InfoPanels/QuickReferencePanel.vue';
import NpcReferencePanel from './InfoPanels/NpcReferencePanel.vue';
import { EncounterStore } from '@/stores';
import NotesPanel from './InfoPanels/GmNotesPanel.vue';
import GmInitiativePanel from './_components/GmInitiativePanel.vue';
import GmToolPalette from './_components/GmToolPalette.vue';
import GmEndRoundPanel from './EncounterPanels/_components/GmEndRoundPanel.vue';
import GmEndEncounterPanel from './EncounterPanels/_components/GmEndEncounterPanel.vue';
import OptionsPanel from './InfoPanels/GmOptionsPanel.vue';
import PlaceholderPanel from './EncounterPanels/PlaceholderPanel.vue';
import EidolonPanel from './EncounterPanels/EidolonPanel.vue';
import ActorLogs from './EncounterPanels/_components/ActorLogs.vue';
import CombatStatblockExport from './EncounterPanels/_components/CombatStatblockExport.vue';
import ActorTelemetry from './EncounterPanels/_components/ActorTelemetry.vue';
import RunnerLeaveDialog from '../_shared/_RunnerLeaveDialog.vue';
import CcPanelToggle from '@/ui/components/buttons/CCPanelToggle.vue';

const panelMap: Record<string, any> = {
  'encounter-info': EncounterInfoPanel,
  'notes': NotesPanel,
  'reference-tag': ReferenceTagPanel,
  'quick-reference': QuickReferencePanel,
  'npc-reference': NpcReferencePanel,
  'options': OptionsPanel,
};

const typeMap: Record<string, any> = {
  'pilot': PilotPanel,
  'deployable': DeployablePanel,
  'doodad': DoodadPanel,
  'unit': UnitPanel,
  'placeholder': PlaceholderPanel,
  'eidolon': EidolonPanel,
};

const props = withDefaults(defineProps<{ id?: string | null }>(), { id: null });

const { mdAndDown: mobile, xs } = useDisplay();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const selected = ref<any>(null);
const diceDialog = ref(false);
const tableDialog = ref(false);
const leaveDialog = ref(false);
let resolveLeaveDialog: ((value: string) => void) | null = null;
const panel = ref<string | undefined>('encounter-info');
const sort = ref('');
const showLeft = ref(true);
const showRight = ref(false);

const instance = computed(() =>
  EncounterStore().getActiveEncounter(
    props.id || route.params.id as string || EncounterStore().CurrentActiveID
  )
);
const instanceID = computed(() => instance.value?.ID ?? undefined);
const actors = computed(() => {
  if (!instance.value) return [];
  return instance.value.Combatants.map((c: any) => c.actor);
});
const actorCount = computed(() => actors.value.length);
const mainLeftOffset = computed(() => {
  if (!mobile.value && showLeft.value) return '430px';
  return '155px';
});

const undoMeta = computed(() => getUndoMeta(instance.value?.ID ?? ''));

let restoring = false;
let cachedSnapshot: ReturnType<typeof serializeSnapshot> | null = null;
let cachedVersions: number[] = [];
let cachedRound = 0;

const versionSignal = computed(() => {
  if (!instance.value) return [] as number[];
  return instance.value.Combatants.map((c: any) => c.actor.CombatController.CombatLogVersion as number);
});

function recacheUndoBaseline() {
  if (!instance.value) return;
  cachedSnapshot = serializeSnapshot(instance.value);
  cachedVersions = versionSignal.value.slice();
  cachedRound = instance.value.Round;
}

function labelForAutoCapture(): string {
  if (!instance.value) return '';
  if (instance.value.Round !== cachedRound) return t('active.gmRunner.undoRoundChange');
  const combatants = instance.value.Combatants;
  for (let i = 0; i < combatants.length; i++) {
    if (versionSignal.value[i] !== cachedVersions[i]) {
      const actor = combatants[i].actor;
      const name = actor.Callsign || actor.Name;
      const history = actor.CombatController.CombatLog?.History || [];
      const last = history[history.length - 1];
      const desc = last?.event || last?.action?.effectName || '';
      return desc ? `${name}: ${desc}` : name;
    }
  }
  return t('active.gmRunner.undoAction');
}

watch([versionSignal, () => instance.value?.Round], () => {
  if (restoring || !instance.value || !cachedSnapshot) return;
  if (versionSignal.value.length !== cachedVersions.length) {
    recacheUndoBaseline();
    return;
  }
  pushCachedSnapshot(instance.value.ID, cachedSnapshot, labelForAutoCapture());
  recacheUndoBaseline();
});

function reselectById(inst: EncounterInstance | undefined, id: string | undefined) {
  if (!inst || !id) {
    selected.value = null;
    return;
  }
  selected.value = inst.Combatants.find((c: any) => c.id === id) ?? null;
}

async function applyRestore(data: ReturnType<typeof serializeSnapshot> | null) {
  if (!data) return;
  restoring = true;
  const selectedId = selected.value?.id;
  const restored = EncounterInstance.Deserialize(data);
  EncounterStore().ReplaceActiveEncounter(restored);
  await nextTick();
  reselectById(restored, selectedId);
  recacheUndoBaseline();
  restoring = false;
}

async function doUndo() {
  if (!instance.value) return;
  await applyRestore(undoStack(instance.value));
}

async function doRedo() {
  if (!instance.value) return;
  await applyRestore(redoStack(instance.value));
}

function handleUndoRedoKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null;
  if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
  if (target?.isContentEditable) return;
  if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
  e.preventDefault();
  if (e.shiftKey) doRedo();
  else doUndo();
}

onMounted(() => window.addEventListener('keydown', handleUndoRedoKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', handleUndoRedoKeydown));

watch(instanceID, (newval) => {
  if (!newval) return;
  setEidolonHp();
  actors.value.forEach((a: any) => a.CombatController.Round = instance.value!.Round);
  recacheUndoBaseline();
}, { immediate: true });

watch(actorCount, (newval, oldval) => {
  if (instance.value && newval > 0 && newval !== oldval) setEidolonHp();
});

watch(instance, (newVal, oldVal) => {
  if (oldVal && !newVal) router.replace('/active-mode/manage-encounters');
});

onMounted(() => {
  if (mobile.value) {
    showLeft.value = false;
    showRight.value = false;
  }
});

function setEidolonHp() {
  const playerCount = instance.value!.Combatants.filter((c: any) => c.type === 'pilot').length;
  instance.value!.Combatants.filter((c: any) => c.type === 'eidolon').forEach((e: any) =>
    e.actor.SetLayerHp(
      playerCount,
      e.actor.StatController.CurrentStats.hp === e.actor.StatController.MaxStats.hp
    )
  );
}

async function sortBy(key: string) {
  const sorted = orderBy(actors.value, key, sort.value === key ? 'desc' : 'asc');
  if (sort.value === key) sorted.reverse();
  sort.value = key;
}

function selectActor(actor: any) {
  selected.value = actor;
  panel.value = undefined;
}

function selectPanel(p: string) {
  if (p === panel.value && selected.value) {
    panel.value = undefined;
  } else {
    panel.value = p;
  }
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
  if (!instance.value) return true;
  const choice = await openLeaveDialog();
  if (choice === 'save') {
    instance.value?.Save();
    return true;
  } else if (choice === 'exit') {
    return true;
  }
  return false;
});
</script>
