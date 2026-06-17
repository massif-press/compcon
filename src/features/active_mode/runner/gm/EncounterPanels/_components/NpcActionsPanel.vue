<template>
  <base-actions-panel
    :quick-actions="quickNpcActions"
    :full-actions="fullNpcActions"
    @deploy="$emit('deploy', $event)"
    @activate="activate($event)">
    <template #quick-action-btn="{ action }">
      <invade-button v-if="action.ID === 'act_invade'"
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
import InvadeButton from './loadouts/action_buttons/invadeButton.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
}>();

const emit = defineEmits<{ deploy: [event: any] }>();

const quickNpcActions = [
  'act_boost', 'act_grapple_npc', 'act_hide', 'act_prepare',
  'act_ram_npc', 'act_invade', 'act_lockon', 'act_search',
];
const fullNpcActions = ['act_disengage', 'act_improvised_attack_npc', 'act_stabilize_npc'];

const controller = computed(() => owner.value.actor.CombatController);

function activate(event: string) {
  controller.value.MarkActionUsed(event);

  switch (event) {
    case 'act_prepare':
      controller.value.Prepared = true;
      notify({ type: 'success', title: t('active.npcActions.npcPreparedTitle'), text: t('active.common.preparedText', { name: controller.value.CombatName }) });
      break;
    case 'act_stabilize_npc':
      controller.value.Stabilize('npc');
      notify({ type: 'success', title: t('active.npcActions.npcStabilizedTitle'), text: t('active.npcActions.npcStabilizedText', { name: controller.value.CombatName }) });
      break;
    case 'act_hide':
      controller.value.AddStatus('hidden');
      notify({ type: 'success', title: t('active.npcActions.npcHiddenTitle'), text: t('active.common.hiddenText', { name: controller.value.CombatName }) });
      break;
    case 'act_disengage':
      if (!controller.value.HasStatus('engaged')) {
        notify({ type: 'warning', title: t('active.common.disengageFailed'), text: t('active.common.disengageFailedText', { name: controller.value.CombatName }) });
        controller.value.ResetActivation('full');
        controller.value.ClearActionUsed('act_disengage');
      } else {
        controller.value.RemoveStatus('engaged');
        notify({ type: 'success', title: t('active.npcActions.npcDisengagedTitle'), text: t('active.common.disengagedText', { name: controller.value.CombatName }) });
      }
      break;
    default:
      break;
  }
}
</script>
