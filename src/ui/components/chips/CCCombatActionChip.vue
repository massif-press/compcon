<template>
  <v-row v-if="!isDeployable" dense align="center">
    <v-col cols="auto">
      <v-tooltip location="top" text="Equipment Action">
        <template #activator="{ props }">
          <v-icon v-bind="props" icon="cc:activate" />
        </template>
      </v-tooltip>
      <v-tooltip location="top" :text="action.Activation">
        <template #activator="{ props }">
          <span v-bind="props" class="ml-1">
            <v-icon
              v-bind="props"
              :icon="action.Icon"
              :color="
                owner.CombatController.CanActivate(action.Activation) ? 'success' : 'error'
              " />
            <v-tooltip v-if="!owner.CombatController.CanActivate(action.Activation)" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" icon="mdi-exclamation-thick" color="error" />
              </template>
              <div class="text-center text-cc-overline">Cannot activate</div>
              <v-divider class="my-1" />
              Insufficient
              <v-chip
                :color="action.Color"
                size="small"
                variant="elevated"
                :prepend-icon="action.Icon || ''">
                {{ action.Activation }}
              </v-chip>
              actions remaining
            </v-tooltip>
          </span>
        </template>
      </v-tooltip>
    </v-col>
    <v-col>
      <cc-dialog
        :color="action.Color"
        :icon="action.Icon"
        :title="action.Name"
        :close-on-click="false">
        <template #activator="{ open }">
          <cc-button
            size="x-small"
            block
            :color="action.Color"
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
            :close="close" />
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
  },
  computed: {
    isDeployable(): boolean {
      return !!this.action.Deployable;
    },
  },
};
</script>
