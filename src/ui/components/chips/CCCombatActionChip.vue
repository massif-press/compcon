<template>
  <v-row v-if="!isDeployable" dense align="center">
    <v-col cols="auto">
      <slot name="icon" />
      <v-tooltip location="top" :text="action.Activation">
        <template #activator="{ props }">
          <span v-bind="props" class="ml-1">
            <v-icon v-bind="props" :icon="action.Icon" :color="canActivate ? 'success' : 'error'" />
            <v-tooltip v-if="!canActivate" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" icon="mdi-exclamation-thick" color="error" />
              </template>
              <div class="text-center text-cc-overline">Cannot activate</div>
              <v-divider class="my-1" />
              <div v-if="customDisabledText" class="text-center">
                {{ customDisabledText }}
              </div>
              <div v-else>
                Insufficient
                <v-chip
                  :color="action.Color"
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
      <cc-dialog
        :color="canActivate ? action.Color : 'panel'"
        :icon="action.Icon"
        :title="action.Name"
        :close-on-click="false">
        <template #activator="{ open }">
          <cc-button
            size="x-small"
            block
            :color="canActivate ? action.Color : 'panel'"
            :prepend-icon="action.Icon"
            @click="open">
            {{ action.Name }}
          </cc-button>
        </template>
        <template #default="{ close }">
          <menu-input
            :active-effect="<any>action"
            :encounter="encounter"
            :owner="owner"
            :action="action"
            :close="close"
            @apply="apply"
            @reset="reset" />
        </template>
      </cc-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Action } from '@/interface';
import MenuInput from './_activeeffect/_ae_menu_input.vue';

export default {
  name: 'cc-combat-action-chip',
  components: {
    MenuInput,
  },
  props: {
    action: { type: Action, required: true },
    tier: { type: Number, required: false, default: 1 },
    encounter: { type: Object, required: true },
    owner: { type: Object, required: true },
    disabled: { type: Boolean, required: false, default: false },
    customDisabledText: { type: String, required: false, default: '' },
  },
  computed: {
    isDeployable(): boolean {
      return !!this.action.Deployable;
    },
    canActivate(): boolean {
      return !this.disabled && this.owner.CombatController.CanActivate(this.action.Activation);
    },
  },
  emits: ['activate', 'reset'],
  methods: {
    apply() {
      this.owner.CombatController.toggleCombatAction(this.action.Activation);
      this.$emit('activate');
    },
    reset() {
      this.owner.CombatController.ResetActivation(this.action.Activation);
      this.$emit('reset');
    },
  },
};
</script>
