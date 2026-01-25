<template>
  <v-col :cols="cols"
    v-if="event.SpecialEvents.length">
    <div v-for="s in event.SpecialEvents">
      <v-tooltip location="top"
        max-width="400px">
        <template #activator="{ props }">
          <v-card v-bind="props"
            flat
            border="sm"
            color="exotic"
            class="text-center heading h3 rounded-lg mt-1">
            {{ s.Attribute }}
          </v-card>
        </template>
        <div class="text-center pa-1">
          {{ s.Detail }}
        </div>
      </v-tooltip>
      <BaseDurationDisplay v-if="s.Duration"
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
  }
};
</script>