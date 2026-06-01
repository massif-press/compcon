<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter-instance="encounterInstance"
    min-width="1000">
    <template #default="{ close }">
      <cc-synergy-display :location="action.ID.replace('act_', '')"
        :mech="controller.Parent"
        alert />

      <cc-synergy-display v-if="isTechAttack"
        location="tech_attack"
        :mech="controller.Parent"
        alert />

      <menu-input :active-effect="action"
        :encounter-instance="encounterInstance"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { Action } from '@/classes/Action'
import { computed } from 'vue'
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

const props = defineProps<{
  action: Action
  owner: CombatantData
  encounterInstance: EncounterInstance
}>()

const emit = defineEmits<{
  'activate': []
}>()

const controller = computed(() => {
      return props.owner.actor.CombatController;
    })
const isTechAttack = computed(() => {
      if (props.action.ID.includes('tech_attack')) return true;
      return props.action.ActiveEffects.some((ae) => ae.Attack && ae.Attack === 'tech');
    })

function apply(close) {
      emit('activate', props.action.ID);
    }
function reset() {
      controller.value.ResetActivation(props.action.Activation);
    }
</script>
