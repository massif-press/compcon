<template>
  <combat-action-button
    :action="action"
    :owner="owner"
    :encounter="encounter">
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
      <menu-input hide-input
        :key="controller.ID"
        :active-effect="action"
        :encounter="encounter"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script>
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'StabilizeButton',
  components: { CombatActionButton, MenuInput },
  props: {
    action: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
  },
  emits: ['activate'],
  data: () => ({
    firstChoice: 'cool',
    secondChoice: 'reload',
    clearSelfCondition: null,
    clearAlliedCondition: null,
    selectedTarget: null,
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController;
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
  methods: {
    clearableConditions(target) {
      if (!target) return [];
      return target.CombatController.Statuses.filter(
        (s) => s.status.StatusType.toLowerCase() === 'condition'
      );
    },
    apply(close) {
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

      this.$emit('activate', this.action.ID);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
