<template>
  <v-col :cols="cols"
    v-if="event.OtherEvents.length">
    <div v-for="o in event.OtherEvents">
      <div class="text-cc-overline text-disabled">{{ o.Type }}</div>
      <v-text-field v-if="['overshield', 'hp', 'repair'].includes(o.Type)"
        v-model="o.Value"
        type="number"
        density="compact"
        hide-details
        variant="outlined"
        flat
        tile />
      <v-select v-if="o.Type === 'cover'"
        v-model="o.Value"
        :items="cover"
        density="compact"
        hide-details
        variant="outlined"
        flat
        tile />
      <base-duration-display v-if="o.Duration"
        :duration="o.Duration" />
    </div>
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
    cover: [
      {
        title: 'Soft Cover',
        value: 'soft',
      },
      {
        title: 'Hard Cover',
        value: 'hard',
      },
      {
        title: 'No Cover',
        value: 'none',
      },
    ],
  }),
};
</script>