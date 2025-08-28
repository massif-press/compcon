<template>
  <v-card>
    <v-card-title class="heading h2">{{ encounter.Name }}</v-card-title>
    <v-card-subtitle class="text-cc-overline">
      {{ encounter.Environment.Name }} {{ encounter.Sitrep.Name }}
    </v-card-subtitle>
    <v-card-text class="pb-0">
      <div class="text-cc-overline text-disabled">GM Notes</div>
      <cc-rich-text-area v-model="encounter.Note" />
    </v-card-text>
    <v-card-text>
      <div class="text-cc-overline text-disabled">Encounter Clocks</div>
      <cc-clock
        v-for="clock in encounter.NarrativeController.Clocks"
        :clock="clock"
        density="compact"
        class="my-1" />
      <div class="text-right">
        <v-btn
          size="x-small"
          color="primary"
          flat
          tile
          prepend-icon="mdi-plus"
          @click="encounter.NarrativeController.AddClock()">
          Add Clock
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { Clock } from '@/classes/narrative/elements/Clock';

export default {
  name: 'GmNotesPanel',
  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
};
</script>
