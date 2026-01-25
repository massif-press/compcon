<template>
  <v-col :cols="cols"
    v-if="event.StatusEvents.length">
    <div class="text-cc-overline text-disabled">
      Status
    </div>
    <div v-for="(s, s_idx) in event.StatusEvents"
      :key="`statusEvent_${event.ID}_${s_idx}`"
      no-gutters>
      <v-select v-model="s.Status"
        :items="statusOptions"
        return-object
        density="compact"
        hide-details
        variant="outlined"
        :item-title="s => s.Name"
        :item-value="s => s.ID"
        flat
        tile />
      <base-duration-display v-if="s.Duration"
        :duration="s.Duration" />
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
  computed: {
    statusOptions() {
      return CompendiumStore().Statuses
    },
  },
};
</script>