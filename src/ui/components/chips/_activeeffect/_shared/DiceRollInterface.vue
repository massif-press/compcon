<template>

  <v-menu open-on-hover
    max-width="400"
    :close-on-content-click="false">
    <template #activator="{ props }">
      <div class="mr-n4 ml-n2">
        <v-btn icon
          size="x-small"
          variant="text"
          flat
          tile
          v-bind="props"
          @click="rollDamage()">
          <v-icon size="25"
            icon="mdi-dice-multiple" />
        </v-btn>
      </div>
    </template>
    <template #default="{ isActive }">
      <v-card class="text-center text-text text-cc-overline"
        style="overflow-x: hidden;"
        border>
        <v-card-text class="pa-2">
          <div class="mb-2">
            <v-chip v-if="rollData.Reliable"
              size="x-small"
              class="ml-1"
              text-color="white">
              RELIABLE {{ rollData.Reliable }}
            </v-chip>
          </div>
          <v-row>
            <v-col>
              <v-text-field v-model="count"
                density="compact"
                variant="outlined"
                type="number"
                hide-spin-buttons
                flat
                hide-details
                tile />
            </v-col>
            <v-col cols="auto"
              align-self="center"
              class="heading h3 mx-n3">d</v-col>
            <v-col>
              <v-select v-model="die"
                :items="dice"
                density="compact"
                variant="outlined"
                type="number"
                flat
                min-width="100"
                hide-details
                tile />
            </v-col>
            <v-col cols="auto"
              align-self="center"
              class="heading h3 mx-n3">+</v-col>
            <v-col>
              <v-text-field v-model="plus"
                density="compact"
                variant="outlined"
                type="number"
                hide-spin-buttons
                flat
                hide-details
                tile />
            </v-col>
          </v-row>
          <v-btn size="x-small"
            flat
            tile
            block
            color="panel"
            class="mt-1"
            @click="reset()">RESET</v-btn>

          <v-btn flat
            tile
            class="mt-2"
            color="primary"
            size="small"
            block
            @click="rollDamage()">
            Roll
          </v-btn>
          <div class="pa-2 text-left text-cc-overline text-accent">roll results</div>
          <div v-if="rollData.DamageRollResult"
            class="text-text">
            <span v-html-safe="rollData.DamageRollResult.toString()" />
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-menu>
</template>

<script>
import { DiceRoller } from '@/class';

export default {
  name: 'DiceRollInterface',
  props: {
    rollData: { type: Object, required: true },
  },
  emits: ['roll-damage', 'update:damage-value'],
  data: () => ({
    dice: [2, 3, 4, 6, 8, 10, 12, 20, 100],
  }),
  computed: {
    parts() {
      if (!this.rollData.DamageRollString.includes('d')) return [];
      return this.rollData.DamageRollString.split('d');
    },
    count() {
      if (this.parts.length === 0) return 0;
      return this.parts[0] ? parseInt(this.parts[0]) : 1;
    },
    die() {
      if (this.parts.length === 0) return 0;
      const diePart = this.parts[1];
      const plusParts = diePart.split('+');
      return parseInt(plusParts[0]);
    },
    plus() {
      if (this.parts.length === 0) {
        return Number(this.rollData.DamageRollString || 0);
      }
      const diePart = this.parts[1];
      const plusParts = diePart.split('+');
      if (plusParts.length === 2) {
        return parseInt(plusParts[1]);
      }
      return 0;
    },
  },
  methods: {
    rollDamage() {
      const diceValue = this.count && this.die ? `${this.count}d${this.die}+${this.plus || 0}` : 0;
      try {
        this.rollResult = DiceRoller.rollDamage(
          diceValue,
          this.rollData.IsCrit,
          this.rollData.Overkill,
          this.rollData.Reliable,
        );
      } catch {
        // static roll
        this.rollResult = { total: Number(this.plus), toString: () => this.plus.toString() };
      }
      this.rollData.DamageRollResult = this.rollResult;
      this.rollData.DamageRolledValue = this.rollResult.total;
    },
  },
};
</script>
