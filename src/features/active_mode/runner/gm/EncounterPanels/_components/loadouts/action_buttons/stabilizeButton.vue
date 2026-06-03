<template>
  <combat-action-button
    :action="action">
    <template #default="{ close }">
      <v-card color="panel"
        flat
        tile
        class="px-12">
        <cc-synergy-display location="stabilize"
          :mech="controller.Parent"
          alert />

        <v-row dense
          class="mb-4">
          <v-col>
            <div class="text-center text-cc-overline text-disabled py-2">choose one</div>
            <v-divider />
            <v-radio-group v-model="firstChoice"
              row>
              <v-radio label="Cool your mech, clearing all heat and EXPOSED."
                value="cool" />
              <v-radio label="Mark 1 REPAIR to restore all HP."
                value="repair" />
            </v-radio-group>
          </v-col>
          <v-col>
            <div class="text-center text-cc-overline text-disabled py-2">choose one</div>
            <v-divider />
            <v-radio-group v-model="secondChoice"
              row>
              <v-radio class="mt-1"
                label="Reload all LOADED weapons."
                value="reload" />
              <v-radio class="mt-1"
                label="Clear any burn currently affecting your mech."
                value="clear_burn" />
              <v-radio class="mt-1"
                label="Clear a condition that wasn't caused by one of your own systems, talents, etc"
                value="clear_self" />
              <v-radio class="mt-1"
                label="Clear an adjacent allied character's condition that wasn't caused by one of their own systems, talents, etc."
                value="clear_ally" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="secondChoice === 'clear_self'"
          dense>
          <v-col>
            <div class="text-cc-overline text-disabled">Target</div>
            <v-select readonly
              variant="outlined"
              flat
              tile
              density="compact"
              :value="controller.CombatName" />
          </v-col>
          <v-col>
            <div class="text-cc-overline text-disabled">Condition</div>
            <v-select v-model="clearSelfCondition"
              :items="clearableConditions(controller.ActiveActor)"
              item-title="status.Name"
              return-object
              flat
              tile
              density="compact"
              variant="outlined" />
          </v-col>
        </v-row>
        <v-row v-else-if="secondChoice === 'clear_ally'">
          <v-col>
            <div class="text-cc-overline text-disabled">Target</div>
            <v-select v-model="selectedTarget"
              :items="alliedTargets"
              item-title="actor.CombatController.CombatName"
              return-object
              flat
              tile
              density="compact"
              variant="outlined" />
          </v-col>
          <v-col>
            <div class="text-cc-overline text-disabled">Condition</div>
            <v-select v-model="clearAlliedCondition"
              :items="clearableConditions(selectedTarget?.actor?.CombatController?.ActiveActor)"
              item-title="status.Name"
              return-object
              flat
              tile
              density="compact"
              variant="outlined" />
          </v-col>
        </v-row>
      </v-card>
      <menu-input :owner="owner" :encounter-instance="encounterInstance" hide-input
        :key="controller.ID"
        :active-effect="action"
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
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

const { owner, encounterInstance } = useEncounterContext()

const props = defineProps<{
  action: Action
}>()

const emit = defineEmits<{
  'activate': []
}>()

const firstChoice = ref('cool')
const secondChoice = ref('reload')
const clearSelfCondition = ref(null)
const clearAlliedCondition = ref(null)
const selectedTarget = ref(null)

const controller = computed(() => {
      return owner.value.actor.CombatController;
    })
const alliedTargets = computed(() => {
      const thisCombatant = encounterInstance.value.Combatants.find(
        (c) => c.actor.ID === controller.value.RootActor.ID
      );
      if (!thisCombatant) return [];
      return encounterInstance.value.Combatants.filter(
        (c) => c.id !== thisCombatant.id && c.side === thisCombatant.side
      );
    })

function clearableConditions(target) {
      if (!target) return [];
      return target.CombatController.Statuses.filter(
        (s) => s.status.StatusType.toLowerCase() === 'condition'
      );
    }
function apply(close) {
      if (firstChoice.value === 'cool') {
        controller.value.Stabilize('cool');
      } else if (firstChoice.value === 'repair') {
        controller.value.Stabilize('repair');
      }

      if (secondChoice.value === 'reload') {
        controller.value.Stabilize('reload');
      } else if (secondChoice.value === 'clear_burn') {
        controller.value.Stabilize('clear_burn');
      } else if (secondChoice.value === 'clear_self') {
        controller.value.Stabilize('clear_self');
        controller.value.RemoveStatus(clearSelfCondition.value.ID);
      } else if (secondChoice.value === 'clear_ally') {
        controller.value.Stabilize('clear_ally');
        selectedTarget.value.actor.CombatController.RemoveStatus(clearAlliedCondition.value.ID);
      }

      emit('activate', props.action.ID);
    }
function reset() {
      controller.value.ResetActivation(props.action.Activation);
    }
</script>
