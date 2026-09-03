<template>
  <combat-action-button :action="action">
    <template #default="{ close }">
      <div class="text-cc-overline text-disabled">{{ $t('active.reload.selectWeapon') }}</div>
      <div v-if="!reloadOptions.length">
        <div class="text-center my-4">{{ $t('active.reload.noTargets') }}</div>
      </div>
      <cc-select
        v-else
        v-model="selection"
        :items="reloadOptions"
        item-title="Name"
        return-object
        size="small"
      />
      <menu-input
        :key="controller.RootActor.ID"
        :owner="owner"
        :encounter-instance="encounterInstance"
        hide-input
        :active-effect="action"
        :disabled="!selection"
        :close="close"
        @apply="apply"
        @reset="reset"
      />
    </template>
  </combat-action-button>
</template>

<script setup lang="ts">
  import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import { useEncounterContext } from '../../../encounterContext'
  import type { CombatantData } from '@/classes/encounter/Encounter'
  import type { Action } from '@/classes/Action'
  import { computed, ref } from 'vue'
  import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon'
  import CombatActionButton from './CombatActionButton.vue'
  import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue'

  const { owner, encounterInstance } = useEncounterContext()

  const props = defineProps<{
    action: Action
  }>()

  const selection = ref(null as PilotWeapon | null)

  const controller = computed(() => {
    return owner.value.actor.CombatController
  })
  const reloadOptions = computed(() => controller.value.ReloadOptions())

  function apply() {
    controller.value.PerformAction(props.action.ID, { target: selection.value })
  }
  function reset() {
    controller.value.UndoActivation(props.action.Activation, { actionId: props.action.ID })
  }
</script>
