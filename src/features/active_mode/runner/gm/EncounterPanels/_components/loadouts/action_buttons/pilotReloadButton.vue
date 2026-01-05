<template>
  <cc-dialog
    :color="available ? action.Color : 'panel'"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="false"
    min-width="70vw"
    max-width="80vw">
    <template #activator="{ open }">
      <v-btn block flat tile size="small" :color="available ? action.Color : 'panel'" @click="open">
        <span class="ml-1">
          <v-icon v-bind="props" :icon="action.Icon" :color="available ? '' : 'error'" start />
          <v-tooltip v-if="!available" location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-exclamation-thick" color="error" class="ml-n2" />
            </template>
            <div class="text-center text-cc-overline">Cannot activate</div>
            <v-divider class="my-1" />
            <div v-if="!canActivate">
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
            <div v-else-if="!canUse">This action has already been used this turn.</div>
          </v-tooltip>
        </span>
        <v-tooltip location="top" width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ action.Name }}
            </span>
          </template>
          <div class="d-flex">
            <div class="heading h4 d-flex">{{ action.Name }}</div>
            <v-spacer />
            <v-chip
              size="x-small"
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
      <v-card color="panel" flat tile class="px-12">
        <v-row dense class="mb-4">
          <v-col>
            <div class="text-center text-cc-overline text-disabled py-2">choose one</div>
            <v-divider />
            <v-radio-group v-model="firstChoice" row>
              <v-radio label="Cool your mech, clearing all heat and EXPOSED." value="cool" />
              <v-radio label="Mark 1 REPAIR to restore all HP." value="repair" />
            </v-radio-group>
          </v-col>
          <v-col>
            <div class="text-center text-cc-overline text-disabled py-2">choose one</div>
            <v-divider />
            <v-radio-group v-model="secondChoice" row>
              <v-radio class="mt-1" label="Reload all LOADED weapons." value="reload" />
              <v-radio
                class="mt-1"
                label="Clear any burn currently affecting your mech."
                value="clear_burn" />
              <v-radio
                class="mt-1"
                label="Clear a
          condition that wasn’t caused by one of your own systems, talents, etc"
                value="clear_self" />
              <v-radio
                class="mt-1"
                label="Clear an adjacent allied character’s condition that wasn’t caused by one of their own systems, talents, etc."
                value="clear_ally" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="secondChoice === 'clear_self'" dense>
          <v-col>
            <div class="text-cc-overline text-disabled">Target</div>
            <v-select
              readonly
              variant="outlined"
              flat
              tile
              density="compact"
              :value="controller.CombatName" />
          </v-col>
          <v-col>
            <div class="text-cc-overline text-disabled">Condition</div>
            <v-select
              v-model="clearSelfCondition"
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
            <v-select
              v-model="selectedTarget"
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
            <v-select
              v-model="clearAlliedCondition"
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
      <menu-input
        hide-input
        :key="controller.ID"
        :active-effect="action"
        :encounter="encounter"
        :owner="controller.Parent"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </cc-dialog>
</template>

<script>
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'InvadeButton',
  props: {
    action: {
      type: Object,
      required: true,
    },
    controller: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  components: {
    MenuInput,
  },
  data: () => ({
    firstChoice: 'cool',
    secondChoice: 'reload',
    clearSelfCondition: null,
    clearAlliedCondition: null,
    selectedTarget: null,
  }),
  computed: {
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
      return !this.controller.IsActionUsed(this.actionId);
    },
    available() {
      return this.canActivate && this.canUse;
    },
    invadeActions() {
      return CompendiumStore()
        .Actions.filter((a) => a.Activation === 'Invade')
        .sort((a, b) => a.Name.localeCompare(b.Name));
    },
    alliedTargets() {
      const thisCombatant = this.encounter.Combatants.find(
        (c) => c.actor.ID === this.controller.RootActor.ID
      );
      if (!thisCombatant) return [];
      return this.encounter.Combatants.filter(
        (c) => c.id !== thisCombatant.id && c.side === thisCombatant.side
      );
    },
  },
  emits: ['activate'],
  methods: {
    clearableConditions(target) {
      if (!target) return [];
      return target.CombatController.Statuses.filter(
        (s) => s.status.StatusType.toLowerCase() === 'condition'
      );
    },
    apply(close) {
      this.controller.toggleCombatAction(this.action.Activation);

      if (this.firstChoice === 'cool') {
        this.controller.Stabilize('cool');
      } else if (this.firstChoice === 'repair') {
        this.controller.Stabilize('repair');
      }

      if (this.secondChoice === 'reload') {
        this.controller.Stabilize('reload');
      } else if (this.secondChoice === 'clear_burn') {
        this.controller.Stabilize('clear_burn');
      } else if (this.secondChoice === 'clear_self') {
        this.controller.Stabilize('clear_self');
        this.controller.RemoveStatus(this.clearSelfCondition.ID);
      } else if (this.secondChoice === 'clear_ally') {
        this.controller.Stabilize('clear_ally');
        this.selectedTarget.actor.CombatController.RemoveStatus(this.clearAlliedCondition.ID);
      }

      this.$emit('activate', this.actionId);
      // close();
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
