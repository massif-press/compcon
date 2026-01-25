<template>
  <v-col :cols="cols"
    v-if="event.ResistEvents.length">
    <v-row v-for="r in event.ResistEvents"
      no-gutters>
      <v-col>
        <div class="text-cc-overline text-disabled">damage type</div>
        <v-select :model-value="r.Resist"
          :items="resistanceOptions"
          density="compact"
          hide-details
          variant="outlined"
          flat
          tile />
        <base-duration-display v-if="r.Duration"
          :duration="r.Duration" />
      </v-col>
      <v-col>
        <div class="text-cc-overline text-disabled">resistance type</div>
        <v-select :model-value="r.resistTypes"
          :items="resistTypes"
          density="compact"
          hide-details
          variant="outlined"
          flat
          tile />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { CompendiumStore } from '@/stores';
import BaseDurationDisplay from './BaseDurationDisplay.vue';

export default {
  name: 'StatusApplicator',
  components: {
    BaseDurationDisplay
  },
  props: {
    event: { type: Object, required: true },
    cols: { type: [Number, String], default: 'auto' }
  },
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