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
          <v-icon v-bind="props"
            :icon="action.Icon"
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
              :style="controller.OverchargeLevel > n ? 'opacity: 0.4 ' : ''"
              :variant="controller.OverchargeLevel >= n ? 'flat' : 'outlined'">
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
      <menu-input hide-input
        :key="controller.ID"
        :active-effect="action"
        :encounter="encounter"
        :owner="owner"
        :close="close"
        @apply="apply"
        @reset="reset" />
    </template>
  </cc-dialog>
</template>

<script>
import { DamageType, DiceRoller } from '@/class';
import { CompendiumStore } from '@/stores';
import MenuInput from '@/ui/components/chips/_activeeffect/_ae_menu_input.vue';

export default {
  name: 'InvadeButton',
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
  components: {
    MenuInput,
  },
  data: () => ({
    heatCost: null,
  }),
  computed: {
    controller() {
      return this.owner.actor.CombatController;
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
  },
  emits: ['activate'],
  methods: {
    roll() {
      const result = DiceRoller.roll(this.controller.OverchargeCost);
      this.heatCost = result;
    },
    apply(close) {
      this.controller.toggleCombatAction(this.action.Activation);

      this.controller.TakeDamage(DamageType.Heat, Number(this.heatCost));
      this.controller.IncreaseOverchargeLevel();

      this.$emit('activate', this.actionId);
    },
    reset() {
      this.controller.ResetActivation(this.action.Activation);
    },
  },
};
</script>
