<template>
  <combat-action-button :action="action">
    <template #default="{ close }">
      <v-card
        color="panel"
        flat
        tile
        class="px-12"
      >
        <cc-synergy-display
          location="stabilize"
          :mech="controller.Parent"
          alert
        />

        <v-row
          dense
          class="mb-4"
        >
          <v-col>
            <div class="text-center text-cc-overline text-disabled py-2">
              {{ $t('active.stabilize.chooseOne') }}
            </div>
            <v-divider />
            <v-radio-group
              v-model="firstChoice"
              row
            >
              <v-radio
                :label="$t('active.fields.coolYourMechClearingAll')"
                value="cool"
              />
              <v-radio
                :label="$t('active.fields.mark1RepairToRestore')"
                value="repair"
              />
            </v-radio-group>
          </v-col>
          <v-col>
            <div class="text-center text-cc-overline text-disabled py-2">
              {{ $t('active.stabilize.chooseOne') }}
            </div>
            <v-divider />
            <v-radio-group
              v-model="secondChoice"
              row
            >
              <v-radio
                class="mt-1"
                :label="$t('active.fields.reloadAllLoadedWeapons')"
                value="reload"
              />
              <v-radio
                class="mt-1"
                :label="$t('active.fields.clearAnyBurnCurrentlyAffecting')"
                value="clear_burn"
              />
              <v-radio
                class="mt-1"
                :label="$t('active.fields.clearAConditionThatWasnt')"
                value="clear_self"
              />
              <v-radio
                class="mt-1"
                :label="$t('active.fields.clearAnAdjacentAlliedCharacters')"
                value="clear_ally"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row
          v-if="secondChoice === 'clear_self'"
          dense
        >
          <v-col>
            <div class="text-cc-overline text-disabled">{{ $t('ui.combat.target') }}</div>
            <v-select
              readonly
              variant="outlined"
              flat
              tile
              density="compact"
              :value="controller.CombatName"
            />
          </v-col>
          <v-col>
            <div class="text-cc-overline text-disabled">
              {{ $t('active.common.condition_status') }}
            </div>
            <v-select
              v-model="clearSelfCondition"
              :items="clearableConditions(controller.ActiveActor)"
              item-title="status.Name"
              return-object
              flat
              tile
              density="compact"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-row v-else-if="secondChoice === 'clear_ally'">
          <v-col>
            <div class="text-cc-overline text-disabled">{{ $t('ui.combat.target') }}</div>
            <v-select
              v-model="selectedTarget"
              :items="alliedTargets"
              item-title="Label"
              return-object
              flat
              tile
              density="compact"
              variant="outlined"
            />
          </v-col>
          <v-col>
            <div class="text-cc-overline text-disabled">
              {{ $t('active.common.condition_status') }}
            </div>
            <v-select
              v-model="clearAlliedCondition"
              :items="clearableConditions(selectedTarget?.actor?.CombatController?.ActiveActor)"
              item-title="status.Name"
              return-object
              flat
              tile
              density="compact"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card>
      <menu-input
        :key="controller.RootActor.ID"
        :owner="owner"
        :encounter-instance="encounterInstance"
        hide-input
        :active-effect="action"
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
  import CombatActionButton from './CombatActionButton.vue'
  import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue'
  import type { Status } from '@/classes/Status'

  type ClearableCondition = { status: Status; expires: any }

  const { owner, encounterInstance, activeController: controller } = useEncounterContext()

  const props = defineProps<{
    action: Action
  }>()

  const firstChoice = ref('cool')
  const secondChoice = ref('reload')
  const clearSelfCondition = ref<ClearableCondition | null>(null)
  const clearAlliedCondition = ref<ClearableCondition | null>(null)
  const selectedTarget = ref<CombatantData | null>(null)

  const alliedTargets = computed(() => {
    const thisCombatant = encounterInstance.value.Combatants.find(
      c => c.actor.ID === controller.value.RootActor.ID
    )
    if (!thisCombatant) return []
    return encounterInstance.value.Combatants.filter(
      c => c.id !== thisCombatant.id && c.side === thisCombatant.side
    )
  })

  function clearableConditions(target: any): ClearableCondition[] {
    if (!target) return []
    return target.CombatController.ClearableConditions()
  }
  function apply() {
    const performed = controller.value.RunAction(props.action.ID, {
      options: [firstChoice.value, secondChoice.value],
    })
    if (!performed) return

    if (secondChoice.value === 'clear_self' && clearSelfCondition.value)
      controller.value.ClearCondition(clearSelfCondition.value.status.ID)
    else if (
      secondChoice.value === 'clear_ally' &&
      selectedTarget.value &&
      clearAlliedCondition.value
    )
      controller.value.ClearCondition(
        clearAlliedCondition.value.status.ID,
        selectedTarget.value.actor.CombatController
      )
  }
  function reset() {
    controller.value.UndoActivation(props.action.Activation, { actionId: props.action.ID })
  }
</script>
