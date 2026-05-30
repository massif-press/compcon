<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter">
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
      <menu-input :key="controller.ID"
        hide-input
        :active-effect="action"
        :encounter="encounter"
        :disabled="!selection"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

const props = defineProps<{
  action: object
  owner: object
  encounter: object
}>()

const emit = defineEmits<{
  'activate': []
}>()

const selection = ref(null as PilotWeapon | null)

const controller = computed(() => {
      return props.owner.actor.CombatController;
    })
const reloadOptions = computed(() => {
      return props.owner.actor.Loadout.Weapons.filter((x) => x.IsLoading && x.Used);
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
