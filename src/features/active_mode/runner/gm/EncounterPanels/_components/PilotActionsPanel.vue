<template>
  <base-actions-panel :owner="owner"
    :encounter-instance="encounterInstance"
    :quick-actions="quickPilotActions"
    :full-actions="fullPilotActions"
    @deploy="$emit('deploy', $event)"
    @activate="activate($event)">
    <template #before-quick>
      <v-row dense>
        <v-col>
          <pilot-fight-button :action="getBaseAction('act_fight')"
            :owner="owner"
            :encounter-instance="encounterInstance"
            @activate="activate($event)" />
        </v-col>
      </v-row>
      <v-divider class="my-2" />
    </template>
    <template #quick-action-btn="{ action }">
      <invade-button v-if="action.ID === 'act_invade'"
        :action="action"
        :owner="owner"
        :encounter-instance="encounterInstance"
        @activate="activate($event)" />
      <pilot-reload-button v-else-if="action.ID === 'act_reload'"
        :action="action"
        :owner="owner"
        :encounter-instance="encounterInstance"
        @activate="activate($event)" />
      <basic-action-button v-else
        :action="action"
        :owner="owner"
        :encounter-instance="encounterInstance"
        @activate="activate($event)" />
    </template>
    <template #full-action-btn="{ action }">
      <skill-check-button v-if="action.ID === 'act_skill_check'"
        :action="action"
        :owner="owner"
        :encounter-instance="encounterInstance"
        @activate="activate($event)" />
      <pilot-jockey-button v-else-if="action.ID === 'act_jockey'"
        :action="action"
        :owner="owner"
        :encounter-instance="encounterInstance"
        @activate="activate($event)" />
      <basic-action-button v-else
        :action="action"
        :owner="owner"
        :encounter-instance="encounterInstance"
        @activate="activate($event)" />
    </template>
  </base-actions-panel>
</template>

<script setup lang="ts">
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { computed } from 'vue';
import { CompendiumStore } from '@/stores';
import { notify } from '@/util/notify';
import BaseActionsPanel from './BaseActionsPanel.vue';
import BasicActionButton from './loadouts/action_buttons/basicActionButton.vue';
import SkillCheckButton from './loadouts/action_buttons/skillCheckButton.vue';
import PilotReloadButton from './loadouts/action_buttons/pilotReloadButton.vue';
import PilotJockeyButton from './loadouts/action_buttons/pilotJockeyButton.vue';
import PilotFightButton from './loadouts/action_buttons/pilotFightButton.vue';
import InvadeButton from './loadouts/action_buttons/invadeButton.vue';

const props = defineProps<{
  owner: CombatantData;
  encounterInstance: EncounterInstance;
}>();

defineEmits<{ deploy: [event: any] }>();

const quickPilotActions = [
  'act_boost', 'act_hide', 'act_search', 'act_lockon',
  'act_prepare', 'act_reload', 'act_invade',
];
const fullPilotActions = ['act_skill_check', 'act_mount', 'act_disengage', 'act_jockey'];

const controller = computed(() => props.owner.actor.CombatController);

function getBaseAction(actionId: string) {
  return CompendiumStore().Actions.find((a: any) => a.ID === actionId);
}

function activate(event: string) {
  controller.value.MarkActionUsed(event);
  switch (event) {
    case 'act_prepare':
      controller.value.Prepared = true;
      notify({ type: 'success', title: 'Pilot Prepared', text: `${controller.value.CombatName} has been marked as PREPARED.` });
      break;
    case 'act_mount':
      if (controller.value.Mounted) {
        notify({ type: 'warning', title: 'Mount Failed', text: `${controller.value.CombatName} is already mounted.` });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('mount');
        return;
      }
      controller.value.ToggleMounted();
      notify({ type: 'success', title: 'Pilot Mountd', text: `${controller.value.CombatName} has mounted their Mech.` });
      break;
    case 'act_hide':
      controller.value.AddStatus('hidden');
      notify({ type: 'success', title: 'Pilot Hidden', text: `${controller.value.CombatName} is now HIDDEN.` });
      break;
    case 'act_disengage':
      if (!controller.value.HasStatus('engaged')) {
        notify({ type: 'warning', title: 'Disengage Failed', text: `${controller.value.CombatName} is not ENGAGED.` });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('act_disengage');
      } else {
        controller.value.RemoveStatus('engaged');
        notify({ type: 'success', title: 'Pilot Disengaged', text: `${controller.value.CombatName} has DISENGAGED.` });
      }
      break;
    default:
      break;
  }
}
</script>
