<template>
  <combat-action-button :action="action"
    :owner="owner"
    :encounter="encounter">
    <template #default="{ close }">
      <v-card color="panel"
        flat
        tile
        class="px-12">
        <cc-synergy-display location="overcharge"
          :mech="controller.Parent"
          alert />
        <div class="text-center text-cc-overline text-disabled my-2">OVERCHARGE cost</div>
        <v-row no-gutters>
          <v-col v-for="(t, n) in controller.OverchargeTrack"
            :key="`overcharge-${n}`"
            class="text-center mx-n4">
            <v-card flat
              color="overcharge"
              class="py-2"
              style="
                corner-shape: bevel;
                border-bottom-left-radius: 60px;
                border-top-left-radius: 0px;
                border-top-right-radius: 60px;
                border-bottom-right-radius: 0px;
              "
              :style="currentOvercharge > n ? 'opacity: 0.4 ' : ''"
              :variant="currentOvercharge >= n ? 'flat' : 'outlined'">
              <div class="heading h3">
                <v-icon>cc:heat</v-icon>
                +{{ t }}
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row dense
          class="text-center my-3"
          align="center"
          justify="center">
          <v-col cols="auto">Overcharging will incur</v-col>
          <v-col cols="auto">
            <v-btn icon
              flat
              tile
              color="panel"
              size="x-small"
              class="fade-select ml-2 mr-n2 mt-n1"
              @click="roll()">
              <v-icon icon="mdi-dice-d20"
                size="30" />
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-text-field v-model="heatCost"
              :placeholder="controller.OverchargeCost"
              class="d-inline-block"
              density="compact"
              type="number"
              width="200px"
              hide-details
              flat
              tile
              variant="outlined"
              color="overcharge"
              append-inner-icon="cc:heat" />
          </v-col>
          <v-col cols="auto">Heat</v-col>
        </v-row>
      </v-card>
      <menu-input :key="controller.ID"
        hide-input
        :active-effect="action"
        :encounter="encounter"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </combat-action-button>
</template>

<script lang="ts">
import { DamageType } from '@/classes/enums';
import { DiceRoller } from '@/classes/dice/DiceRoller';
import CombatActionButton from './CombatActionButton.vue';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'OverchargeButton',
  components: { CombatActionButton, MenuInput },
  props: {
    action: { type: Object, required: true },
    owner: { type: Object, required: true },
    encounter: { type: Object, required: true },
  },
  emits: ['activate'],
  data: () => ({
    heatCost: 1,
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController.ActiveActor.CombatController;
    },
    currentOvercharge() {
      return this.controller.OverchargeLevel;
    },
  },
  methods: {
    roll() {
      this.heatCost = DiceRoller.roll(this.controller.OverchargeCost);
    },
    apply() {
      this.controller.toggleCombatAction('Overcharge');
      this.controller.ResetActivation('quick')
      this.controller.TakeDamage(DamageType.Heat, Number(this.heatCost));
      this.controller.IncreaseOverchargeLevel();
      this.$emit('activate', this.action.ID);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
