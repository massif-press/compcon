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

<script lang="ts">
import { PilotWeapon } from '@/classes/pilot/components/Loadout/equipment/PilotWeapon';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'PilotReloadButton',
  components: { CombatActionButton, MenuInput },
  props: {
    action: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
  },
  emits: ['activate'],
  data: () => ({
    selection: null as PilotWeapon | null,
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController;
    },
    reloadOptions() {
      return this.owner.actor.Loadout.Weapons.filter((x) => x.IsLoading && x.Used);
    },
  },
  methods: {
    apply(close) {
      if (this.selection) {
        this.selection.Used = false;
      }
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
