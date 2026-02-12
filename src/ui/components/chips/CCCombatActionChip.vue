<template>
  <v-row v-if="!isDeployable"
    dense
    align="center">
    <v-col cols="auto">
      <slot name="icon" />
      <v-tooltip location="top"
        :text="action.Activation">
        <template #activator="{ props }">
          <span v-bind="props"
            class="ml-1">
            <v-icon v-bind="props"
              :icon="action.Icon"
              :color="canActivate ? 'success' : 'error'" />
            <v-tooltip v-if="!canActivate"
              location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="mdi-exclamation-thick"
                  color="error" />
              </template>
              <div class="text-center text-cc-overline">Cannot activate</div>
              <v-divider class="my-1" />
              <div v-if="customDisabledText"
                class="text-center">
                {{ customDisabledText }}
              </div>
              <div v-else>
                Insufficient
                <v-chip :color="action.Color"
                  size="small"
                  variant="elevated"
                  :prepend-icon="action.Icon || ''">
                  {{ action.Activation }}
                </v-chip>
                actions remaining this turn.
              </div>
            </v-tooltip>
          </span>
        </template>
      </v-tooltip>
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
          <menu-input :key="owner.ID"
            :active-effect="<any>action"
            :encounter="encounter"
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

<script lang="ts">
import { Action } from '@/interface';
import MenuInput from './_activeeffect/_ae_menu_input.vue';
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';

export default {
  name: 'cc-combat-action-chip',
  components: {
    MenuInput,
  },
  props: {
    action: { type: Action, required: true },
    tier: { type: Number, required: false, default: 1 },
    encounter: { type: EncounterInstance, required: true },
    owner: { type: Object, required: true },
    disabled: { type: Boolean, required: false, default: false },
    customDisabledText: { type: String, required: false, default: '' },
  },
  computed: {
    isDeployable(): boolean {
      return !!this.action.Deployable;
    },
    controller() {
      return this.owner.actor.CombatController;
    },
    canActivate(): boolean {
      return !this.disabled && this.controller.CanActivate(this.action.Activation);
    },
  },
  emits: ['activate', 'reset'],
  methods: {
    apply() {
      this.controller.toggleCombatAction(this.action.Activation);
      this.controller.ApplyHeat(this.action.HeatCost || 0);
      this.$emit('activate', this.action.Cost);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
      this.controller.ApplyHeat(-this.action.HeatCost || 0);
      this.$emit('reset', this.action.Cost);
    },
  },
};
</script>
