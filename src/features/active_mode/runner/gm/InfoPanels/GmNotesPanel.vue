<template>
  <v-card>
    <v-card-title class="heading h2">Example Encounter</v-card-title>
    <v-card-subtitle class="text-cc-overline">Spire World Extraction</v-card-subtitle>
    <v-card-text class="pb-0">
      <div class="text-cc-overline text-disabled">GM Notes</div>
      <v-textarea v-model="notes" variant="outlined" rows="3" color="primary" auto-grow />
    </v-card-text>
    <v-card-text>
      <div class="text-cc-overline text-disabled">Encounter Clocks</div>
      <cc-clock v-for="clock in clocks" :clock="clock" density="compact" class="my-1" />
      <div class="text-right">
        <v-btn
          size="x-small"
          color="primary"
          flat
          tile
          prepend-icon="mdi-plus"
          @click="clocks.push(new Clock())">
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
  data: () => ({
    notes: 'these are some example GM notes',
    clocks: [],
  }),
  mounted() {
    this.clocks = [new Clock(), new Clock()];
  },
};
</script>
