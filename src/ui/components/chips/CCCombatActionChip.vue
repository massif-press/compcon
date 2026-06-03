<template>
  <v-row v-if="!isDeployable"
    dense
    align="center">
    <v-col cols="auto">
      <slot name="icon" />
      <combat-action-indicator :icon="action.Icon"
        :activation="action.Activation"
        :can-activate="canActivate"
        :custom-disabled-text="customDisabledText">
        <template #reason>
          <div v-if="controller.IsActionUsed(action.ID)"
            class="text-center">
            Action already used.
          </div>
          <div v-else-if="!controller.CanActivate(action.Activation)"
            class="text-center">
            Insufficient
            <v-chip :color="action.Color"
              size="small"
              variant="elevated"
              :prepend-icon="action.Icon || ''">
              {{ action.Activation }}
            </v-chip>
            actions remaining this turn.
          </div>
          <div v-else
            class="text-center">
            Cannot activate.
          </div>
        </template>
      </combat-action-indicator>
    </v-col>
    <v-col>
      <cc-dialog :color="canActivate ? action.Color : 'panel'"
        :icon="action.Icon"
        :title="action.Name"
        :close-on-click="false">
        <template #activator="{ open }">
          <cc-button size="x-small"
            block
            :color="canActivate ? action.Color : 'panel'"
            :prepend-icon="action.Icon"
            @click="open">
            {{ action.Name }}
          </cc-button>
        </template>
        <template #default="{ close }">
          <menu-input :key="owner.actor.ID"
            :active-effect="action"
            :encounter-instance="encounterInstance"
            :owner="owner"
            :action="action"
            :close="close"
            @apply="apply"
            @reset="reset" />
          <div v-if="action.HeatCost"
            class="text-right">
            <cc-chip bg-color="damage--heat"
              class="mr-4">
              <v-icon icon="cc:heat" />
              +{{ action.HeatCost }} Heat (Self)
            </cc-chip>
          </div>
        </template>
      </cc-dialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Action } from '@/classes/Action';
import MenuInput from './_activeeffect/_ae_menu_input.vue';
import CombatActionIndicator from './_CombatActionIndicator.vue';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import type { CombatantData } from '@/classes/encounter/Encounter';

const props = withDefaults(defineProps<{
  action: Action
  tier?: number
  encounterInstance: EncounterInstance
  owner: CombatantData
  disabled?: boolean
  customDisabledText?: string
}>(), {
  tier: 1,
  disabled: false,
  customDisabledText: '',
})

const emit = defineEmits<{
  activate: [...args: any[]]
  reset: [...args: any[]]
}>()

const isDeployable = computed((): boolean => !!props.action.Deployable)

const controller = computed(() => props.owner.actor.CombatController)

const canActivate = computed((): boolean =>
  !props.disabled && controller.value.CanActivate(props.action.Activation) && !controller.value.IsActionUsed(props.action.ID)
)

function apply() {
  controller.value.MarkActionUsed(props.action.ID);
  controller.value.ApplyHeat(props.action.HeatCost || 0);
  emit('activate', props.action.Cost);
}

function reset() {
  controller.value.ResetActivation(props.action.Activation);
  controller.value.ApplyHeat(-props.action.HeatCost || 0);
  emit('reset', props.action.Cost);
}
</script>
