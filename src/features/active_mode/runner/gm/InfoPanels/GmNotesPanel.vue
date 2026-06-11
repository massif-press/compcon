<template>
  <v-card>
    <v-card-title class="heading h2">{{ encounter.Name }}</v-card-title>
    <v-card-subtitle class="text-cc-overline">
      {{ encounter.Environment.Name }} {{ encounter.Sitrep.Name }}
    </v-card-subtitle>
    <v-card-text class="pb-0">
      <div class="text-cc-overline text-disabled">{{ $t('active.gmNotes.gmNotes') }}</div>
      <cc-rich-text-area v-model="encounter.Note" />
    </v-card-text>
    <v-card-text>
      <div class="text-cc-overline text-disabled">{{ $t('active.gmNotes.encounterClocks') }}</div>
      <cc-clock v-for="(clock, index) in encounter.NarrativeController.Clocks"
        :key="`clock-${index}`"
        :clock="clock"
        density="compact"
        class="my-1" />
      <div class="text-right">
        <v-btn size="x-small"
          color="primary"
          flat
          tile
          prepend-icon="mdi-plus"
          @click="encounter.NarrativeController.AddClock()">
          {{ $t('active.gmNotes.addClock') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Encounter } from '@/classes/encounter/Encounter'
const props = defineProps<{
  encounter: Encounter
}>()
</script>
