<template>
  <v-col v-if="event.SpecialEvents.length"
    :cols="cols">
    <div v-for="(s, index) in event.SpecialEvents"
      :key="`special-${index}`">
      <v-tooltip location="top"
        max-width="400px">
        <template #activator="{ props }">
          <v-card v-bind="props"
            flat
            border="sm"
            color="exotic"
            class="text-center heading h3 rounded-lg mt-1 py-1 px-2">
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



<script lang="ts">
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