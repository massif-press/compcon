<template>
  <base-actions-panel :owner="owner"
    :encounter-instance="encounterInstance"
    :quick-actions="quickNpcActions"
    :full-actions="fullNpcActions"
    @deploy="$emit('deploy', $event)"
    @activate="activate($event)">
    <template #quick-action-btn="{ action }">
      <invade-button v-if="action.ID === 'act_invade'"
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
import InvadeButton from './loadouts/action_buttons/invadeButton.vue';

const props = defineProps<{
  owner: CombatantData;
  encounterInstance: EncounterInstance;
}>();

const emit = defineEmits<{ deploy: [event: any] }>();

const quickNpcActions = [
  'act_boost', 'act_grapple_npc', 'act_hide', 'act_prepare',
  'act_ram_npc', 'act_invade', 'act_lockon', 'act_search',
];
const fullNpcActions = ['act_disengage', 'act_improvised_attack_npc', 'act_stabilize_npc'];

const controller = computed(() => props.owner.actor.CombatController);

function activate(event: string) {
  controller.value.MarkActionUsed(event);

  switch (event) {
    case 'act_prepare':
      controller.value.Prepared = true;
      notify({ type: 'success', title: 'NPC Prepared', text: `${controller.value.CombatName} has been marked as PREPARED.` });
      break;
    case 'act_stabilize_npc':
      controller.value.Stabilize('npc');
      notify({ type: 'success', title: 'NPC Stabilized', text: `${controller.value.CombatName} has cleared all HEAT, is no longer EXPOSED, and has reloaded their weapons.` });
      break;
    case 'act_hide':
      controller.value.AddStatus('hidden');
      notify({ type: 'success', title: 'NPC Hidden', text: `${controller.value.CombatName} is now HIDDEN.` });
      break;
    case 'act_disengage':
      if (!controller.value.HasStatus('engaged')) {
        notify({ type: 'warning', title: 'Disengage Failed', text: `${controller.value.CombatName} is not ENGAGED.` });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('act_disengage');
      } else {
        controller.value.RemoveStatus('engaged');
        notify({ type: 'success', title: 'NPC Disengaged', text: `${controller.value.CombatName} has DISENGAGED.` });
      }
      break;
    default:
      break;
  }
}
</script>
