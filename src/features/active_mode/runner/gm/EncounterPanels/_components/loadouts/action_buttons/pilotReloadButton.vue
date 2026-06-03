<template>
  <combat-action-button
    :action="action">
    <template #default="{ close }">
      <div class="text-cc-overline text-disabled">Select a weapon to reload</div>
      <div v-if="!reloadOptions.length">
        <div class="text-center my-4">No valid targets for reload</div>
      </div>
      <cc-select v-else
        v-model="selection"
        :items="reloadOptions"
        item-title="Name"
        return-object
        size="small" />
      <menu-input :owner="owner" :encounter-instance="encounterInstance" :key="controller.ID"
        hide-input
        :active-effect="action"
        :disabled="!selection"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { useEncounterContext } from '../../../encounterContext'
import type { CombatantData } from '@/classes/encounter/Encounter'
import type { Action } from '@/classes/Action'
import { computed, ref } from 'vue'
import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
}>()

const emit = defineEmits<{
  'activate': []
}>()

const selection = ref(null as PilotWeapon | null)

const controller = computed(() => {
      return owner.value.actor.CombatController;
    })
const reloadOptions = computed(() => {
      return owner.value.actor.Loadout.Weapons.filter((x) => x.IsLoading && x.Used);
    })

function apply(close) {
      if (selection.value) {
        selection.value.Used = false;
      }
    }
function reset() {
      controller.value.ResetActivation(props.action.Activation);
    }
</script>
