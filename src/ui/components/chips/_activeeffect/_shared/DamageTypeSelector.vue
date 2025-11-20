<template>
  <v-col cols="2">
    <div class="text-cc-overline text-disabled">damage type</div>
    <v-select
      :model-value="selectedDamageType"
      :items="damageOptions"
      density="compact"
      hide-details
      variant="outlined"
      flat
      tile
      @update:model-value="$emit('update:damage-type', $event)" />
  </v-col>
  <v-col cols="2">
    <div class="text-cc-overline text-disabled">damage value</div>
    <v-text-field
      :model-value="selectedDamageValue"
      :placeholder="damagePlaceholder"
      type="number"
      density="compact"
      hide-details
      variant="outlined"
      flat
      tile
      @update:model-value="$emit('update:damage-value', $event)">
      <template v-if="damagePlaceholder" #prepend>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              icon
              size="x-small"
              variant="text"
              flat
              tile
              class="mr-n6"
              v-bind="props"
              @click="$emit('roll-damage')">
              <v-icon size="25" icon="mdi-dice-multiple" />
            </v-btn>
          </template>

          <div class="text-center">
            {{ damagePlaceholder }}
            <div>
              <i class="text-caption text-disabled">Click to roll damage</i>
            </div>
          </div>
        </v-tooltip>
      </template>

      <template v-if="!['heat', 'burn'].includes(selectedDamageType)" #append>
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
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
      </template>
    </v-text-field>
  </v-col>
</template>

<script>
export default {
  name: 'DamageTypeSelector',
  props: {
    selectedDamageType: { type: String, required: true },
    selectedDamageValue: { type: [Number, String], required: true },
    damagePlaceholder: { type: String, default: '' },
    armorPiercing: { type: Boolean, required: true },
  },
  emits: ['update:damage-type', 'update:damage-value', 'roll-damage', 'toggle-ap'],
  data: () => ({
    damageOptions: [
      { title: 'Kinetic', value: 'kinetic' },
      { title: 'Energy', value: 'energy' },
      { title: 'Explosive', value: 'explosive' },
      { title: 'Heat', value: 'heat' },
      { title: 'Burn', value: 'burn' },
    ],
  }),
};
</script>
