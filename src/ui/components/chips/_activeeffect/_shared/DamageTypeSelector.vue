<template>
  <v-col :cols="cols">
    <div class="text-cc-overline text-disabled">damage type</div>
    <v-select
      :disabled="disabled"
      :model-value="selectedDamageType"
      :items="damageOptions"
      density="compact"
      hide-details
      variant="outlined"
      flat
      tile
      @update:model-value="$emit('update:damage-type', $event)" />
  </v-col>
  <v-col :cols="cols" class="ml-4">
    <div class="text-cc-overline text-disabled">damage value</div>
    <v-text-field
      :disabled="disabled"
      :model-value="selectedDamageValue"
      :placeholder="damagePlaceholder"
      type="number"
      density="compact"
      hide-details
      hide-spin-buttons
      variant="outlined"
      flat
      tile
      width="160"
      @update:model-value="$emit('update:damage-value', Number($event))">
      <template #prepend>
        <DiceRollInterface
          :disabled="disabled"
          :damage-placeholder="damagePlaceholder"
          :reliable="reliable"
          :can-crit="canCrit"
          :critical="critical"
          :overkill="overkill"
          @roll-damage="handleRollDamage"
          @update:damage-value="$emit('update:damage-value', $event)" />
      </template>

      <template #append>
        <v-tooltip v-if="!['heat', 'burn'].includes(selectedDamageType)" location="top">
          <template #activator="{ props }">
            <v-btn
              :disabled="disabled"
              icon
              v-bind="props"
              variant="text"
              flat
              tile
              size="small"
              class="ml-n3"
              :color="armorPiercing ? 'accent' : 'rgba(125,125,125,0.5)'"
              @click="$emit('toggle-ap')">
              <v-icon size="25" icon="mdi-shield-off-outline" />
            </v-btn>
          </template>
          <div class="text-center">
            <span v-if="armorPiercing">This damage ignores armor</span>
            <span v-else>This damage does not ignore armor</span>
            <div>
              <i class="text-caption text-disabled">Click to Override</i>
            </div>
          </div>
        </v-tooltip>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              :disabled="disabled"
              icon
              v-bind="props"
              variant="text"
              flat
              tile
              size="small"
              class="ml-n3"
              :color="irreducible ? 'accent' : 'rgba(125,125,125,0.5)'"
              @click="$emit('toggle-irreducible')">
              <v-icon size="25" icon="cc:large_beam" />
            </v-btn>
          </template>
          <div class="text-center">
            <span v-if="irreducible">This damage cannot be reduced in any way</span>
            <span v-else>
              This damage can be reduced by the target's defenses
              <span v-if="armorPiercing">, except for armor</span>
            </span>
            <div>
              <i class="text-caption text-disabled">Click to Override</i>
            </div>
          </div>
        </v-tooltip>
      </template>
    </v-text-field>
  </v-col>
</template>

<script>
import { DiceRoller } from '@/class';
import DiceRollInterface from './DiceRollInterface.vue';

export default {
  name: 'DamageTypeSelector',
  components: {
    DiceRollInterface,
  },
  props: {
    selectedDamageType: { type: String, required: true },
    selectedDamageValue: { type: [Number, String], required: false },
    damagePlaceholder: { type: String, default: '' },
    armorPiercing: { type: Boolean, required: true },
    reliable: { type: Number, required: false },
    irreducible: { type: Boolean, required: false },
    canCrit: { type: Boolean, required: false },
    critical: { type: Boolean, required: false },
    overkill: { type: Boolean, required: false },
    cols: { type: [Number, String], default: 2 },
    disabled: { type: Boolean, default: false },
  },
  emits: [
    'update:damage-type',
    'update:damage-value',
    'roll-damage',
    'toggle-ap',
    'toggle-irreducible',
  ],
  data: () => ({
    damageOptions: [
      { title: 'Kinetic', value: 'kinetic' },
      { title: 'Energy', value: 'energy' },
      { title: 'Explosive', value: 'explosive' },
      { title: 'Heat', value: 'heat' },
      { title: 'Burn', value: 'burn' },
    ],
  }),
  methods: {
    handleRollDamage(rollResult) {
      this.$emit('roll-damage', rollResult);
    },
  },
};
</script>
