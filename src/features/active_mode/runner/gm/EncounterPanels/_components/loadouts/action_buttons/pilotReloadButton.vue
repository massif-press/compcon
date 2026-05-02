<template>
  <cc-dialog :color="available ? action.Color : 'panel'"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="false"
    min-width="70vw"
    max-width="80vw">
    <template #activator="{ open }">
      <v-btn block
        flat
        tile
        size="small"
        :color="available ? action.Color : 'panel'"
        @click="open">
        <span class="ml-1">
          <v-icon :icon="action.Icon"
            :color="available ? '' : 'error'"
            start />
          <v-tooltip v-if="!available"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-exclamation-thick"
                color="error"
                class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">Cannot activate</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
              Insufficient
              <v-chip :color="action.Color"
                size="small"
                variant="elevated"
                :prepend-icon="action.Icon || ''">
                {{ action.Activation }}
              </v-chip>
              actions remaining this turn.
            </div>
            <div v-else-if="!canUse">This action has already been used this turn.</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top"
          width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip size="x-small"
              :color="action.Color"
              :prepend-icon="action.Icon"
              variant="elevated"
              elevation="0">
              {{ action.Activation }} Action
            </v-chip>
          </div>
          <v-divider class="my-1" />
          {{ action.Terse }}
        </v-tooltip>
      </v-btn>
    </template>
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
  </cc-dialog>
</template>

<script lang="ts">
import { PilotWeapon } from '@/class';
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'InvadeButton',
  components: {
    MenuInput,
  },
  props: {
    action: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  emits: ['activate'],
  data: () => ({
    selection: null as PilotWeapon | null,
  }),
  computed: {
    reloadOptions() {
      return this.owner.actor.Loadout.Weapons.filter(x => x.IsLoading && x.Used)
    },
    controller() {
      return this.owner.actor.CombatController;
    },
    allActions() {
      return CompendiumStore()
        .Actions.filter((x) => x.Activation === 'Invade')
        .concat(this.controller.AllActions('Invade'));
    },
    selectedAction() {
      return this.allActions.find((a) => a.ID === this.tab);
    },
    canActivate() {
      return this.controller.CanActivate(this.action.Activation);
    },
    canUse() {
      return !this.controller.IsActionUsed(this.action.ID);
    },
    available() {
      return this.canActivate && this.canUse;
    },

  },
  methods: {
    apply(close) {
      // this.controller.toggleCombatAction(this.action.Activation);

      if (this.selection) {
        this.selection.Used = false;
      }
      // this.$emit('activate', this.action.ID);
      // close();
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
