<template>
  <v-col cols="2">
    <div class="text-cc-overline text-disabled">damage type</div>
    <v-select
      :model-value="selectedResist"
      :items="resistanceOptions"
      density="compact"
      hide-details
      variant="outlined"
      flat
      tile
      @update:model-value="$emit('update:resist-type', $event)" />
  </v-col>
  <v-col cols="2">
    <div class="text-cc-overline text-disabled">resistance type</div>
    <v-select
      :model-value="selectedResistType"
      :items="resistTypes"
      density="compact"
      hide-details
      variant="outlined"
      flat
      tile
      @update:model-value="$emit('update:resistance-type', $event)" />
  </v-col>
</template>

<script>
export default {
  name: 'ResistanceTypeSelector',
  props: {
    selectedResist: { type: String, required: true },
    selectedResistType: { type: String, required: true },
  },
  emits: ['update:resist-type', 'update:resistance-type'],
  data: () => ({
    resistanceOptions: [
      { title: 'Kinetic', value: 'kinetic' },
      { title: 'Energy', value: 'energy' },
      { title: 'Explosive', value: 'explosive' },
      { title: 'Heat', value: 'heat' },
      { title: 'Burn', value: 'burn' },
      { title: 'Area of Effect', value: 'aoe' },
      { title: 'All', value: 'all' },
    ],
    resistTypes: [
      { title: 'Resistance', value: 'Resistance' },
      { title: 'Immunity', value: 'Immunity' },
      { title: 'Vulnerability', value: 'Vulnerability' },
    ],
  }),
};
</script>
