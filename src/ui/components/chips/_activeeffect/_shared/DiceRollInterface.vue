<template>
  <v-menu open-on-hover :close-on-content-click="false">
    <template #activator="{ props }">
      <div class="mr-n4 ml-n2">
        <v-btn icon size="x-small" variant="text" flat tile v-bind="props" @click="rollDamage">
          <v-icon size="25" icon="mdi-dice-multiple" />
        </v-btn>
      </div>
    </template>
    <template #default="{ isActive }">
      <v-card class="text-center text-text text-cc-overline pa-2" width="300" border>
        <div class="mb-2">
          <v-chip v-if="reliable" size="x-small" class="ml-1" color="reliable" text-color="white">
            RELIABLE {{ reliable }}
          </v-chip>
          <cc-switch
            v-if="canCrit"
            v-model="rollCritical"
            label="crit"
            tooltip="Roll as critical damage (roll damage dice twice, keep highest)" />
        </div>
        <v-row>
          <v-col>
            <v-text-field
              v-model="count"
              density="compact"
              variant="outlined"
              type="number"
              hide-spin-buttons
              flat
              hide-details
              tile />
          </v-col>
          <v-col cols="auto" align-self="center" class="heading h3 mx-n3">d</v-col>
          <v-col>
            <v-select
              v-model="die"
              :items="dice"
              density="compact"
              variant="outlined"
              type="number"
              flat
              min-width="100"
              hide-details
              tile />
          </v-col>
          <v-col cols="auto" align-self="center" class="heading h3 mx-n3">+</v-col>
          <v-col>
            <v-text-field
              v-model="plus"
              density="compact"
              variant="outlined"
              type="number"
              hide-spin-buttons
              flat
              hide-details
              tile />
          </v-col>
        </v-row>
        <v-btn size="x-small" flat tile block color="panel" @click="reset">RESET</v-btn>

        <v-btn flat tile class="mt-2" color="primary" size="small" block @click="rollDamage">
          Roll
        </v-btn>
        <div class="pa-2 border-s text-left">roll results</div>
        <div v-if="rollResult" class="text-caption text-accent">
          <span v-html-safe="rollResult.toString()" />
        </div>
      </v-card>
    </template>
  </v-menu>
</template>

<script>
import { DiceRoller } from '@/class';

export default {
  name: 'DiceRollInterface',
  props: {
    damagePlaceholder: { type: String, default: '' },
    reliable: { type: Number, required: false },
    canCrit: { type: Boolean, required: false },
    critical: { type: Boolean, required: false },
    overkill: { type: Boolean, required: false },
  },
  emits: ['roll-damage', 'update:damage-value'],
  data: () => ({
    rollCritical: false,
    count: null,
    die: null,
    dice: [2, 3, 4, 6, 8, 10, 12, 20, 100],
    plus: null,
    rollResult: null,
  }),
  mounted() {
    this.setDice();
  },
  watch: {
    damagePlaceholder() {
      this.setDice();
    },
    critical(newval) {
      this.rollCritical = newval;
    },
  },
  methods: {
    reset() {
      this.setDice();
    },
    setDice() {
      if (this.crits) this.rollCritical = true;

      if (!this.damagePlaceholder) return;

      const parts = this.damagePlaceholder.split('d');
      if (parts.length !== 2) {
        this.plus = parseInt(this.damagePlaceholder);
        return;
      }

      this.count = parts[0] ? parseInt(parts[0]) : 1;

      const plusParts = parts[1].split('+');
      if (plusParts.length === 2) {
        this.die = parseInt(plusParts[0]);
        this.plus = parseInt(plusParts[1]);
      } else {
        this.die = parseInt(parts[1]);
        this.plus = 0;
      }
    },
    rollDamage() {
      const diceValue = this.count && this.die ? `${this.count}d${this.die}+${this.plus || 0}` : 0;
      this.rollResult = DiceRoller.rollDamage(
        diceValue,
        this.rollCritical,
        this.overkill,
        this.reliable
      );
      this.$emit('roll-damage', { ...this.rollResult });
      this.$emit('update:damage-value', this.rollResult.total);
    },
  },
};
</script>
