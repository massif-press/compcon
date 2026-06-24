<template>
  <base-actions-panel
    :quick-actions="quickPilotActions"
    :full-actions="fullPilotActions"
    @deploy="$emit('deploy', $event)"
    @activate="activate($event)">
    <template #before-quick>
      <v-row dense>
        <v-col>
          <pilot-fight-button :action="getBaseAction('act_fight')"
            @activate="activate($event)" />
        </v-col>
      </v-row>
      <v-divider class="my-2" />
    </template>
    <template #quick-action-btn="{ action }">
      <invade-button v-if="action.ID === 'act_invade'"
        :action="action"
        @activate="activate($event)" />
      <pilot-reload-button v-else-if="action.ID === 'act_reload'"
        :action="action"
        @activate="activate($event)" />
      <basic-action-button v-else
        :action="action"
        @activate="activate($event)" />
    </template>
    <template #full-action-btn="{ action }">
      <skill-check-button v-if="action.ID === 'act_skill_check'"
        :action="action"
        @activate="activate($event)" />
      <pilot-jockey-button v-else-if="action.ID === 'act_jockey'"
        :action="action"
        @activate="activate($event)" />
      <basic-action-button v-else
        :action="action"
        @activate="activate($event)" />
    </template>
  </base-actions-panel>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import { useEncounterContext } from '../encounterContext'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed } from 'vue';
import { CompendiumStore } from '@/stores';
import { notify } from '@/util/notify';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import BaseActionsPanel from './BaseActionsPanel.vue';
import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue';
import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue';
import PilotReloadButton from './loadouts/action_buttons/pilotReloadButton.vue';
import PilotJockeyButton from './loadouts/action_buttons/pilotJockeyButton.vue';
import PilotFightButton from './loadouts/action_buttons/pilotFightButton.vue';
import InvadeButton from './loadouts/action_buttons/invadeButton.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
}>();

defineEmits<{ deploy: [event: any] }>();

const quickPilotActions = [
  'act_boost', 'act_hide', 'act_search', 'act_lockon',
  'act_prepare', 'act_reload', 'act_invade',
];
const fullPilotActions = ['act_skill_check', 'act_mount', 'act_disengage', 'act_jockey'];

const controller = computed(() => owner.value.actor.CombatController);

function getBaseAction(actionId: string) {
  return CompendiumStore().Actions.find((a: any) => a.ID === actionId);
}

function activate(event: string) {
  controller.value.MarkActionUsed(event);
  switch (event) {
    case 'act_prepare':
      controller.value.Prepared = true;
      notify({ type: 'success', title: t('active.pilotActions.preparedTitle'), text: t('active.common.preparedText', { name: controller.value.CombatName }) });
      break;
    case 'act_mount':
      if (controller.value.Mounted) {
        notify({ type: 'warning', title: t('active.pilotActions.mountFailedTitle'), text: t('active.pilotActions.mountFailedText', { name: controller.value.CombatName }) });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('mount');
        return;
      }
      controller.value.ToggleMounted();
      notify({ type: 'success', title: t('active.pcPanel.pilotMounted'), text: t('active.pilotActions.mountedText', { name: controller.value.CombatName }) });
      break;
    case 'act_hide':
      controller.value.AddStatus('hidden');
      notify({ type: 'success', title: t('active.pilotActions.hiddenTitle'), text: t('active.common.hiddenText', { name: controller.value.CombatName }) });
      break;
    case 'act_disengage':
      if (!controller.value.HasStatus('engaged')) {
        notify({ type: 'warning', title: t('active.common.disengageFailed'), text: t('active.common.disengageFailedText', { name: controller.value.CombatName }) });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('act_disengage');
      } else {
        controller.value.RemoveStatus('engaged');
        notify({ type: 'success', title: t('active.pilotActions.disengagedTitle'), text: t('active.common.disengagedText', { name: controller.value.CombatName }) });
      }
      break;
    default:
      break;
  }
}
</script>
