<template>
  <v-card>
    <v-card-title class="heading h2">{{ selected.Name }}</v-card-title>
    <v-card-subtitle class="text-cc-overline">
      Player Notes
    </v-card-subtitle>
    <v-card-text class="pb-4">
      <div class="text-cc-overline text-disabled">Session Notes</div>
      <cc-rich-text-area v-model="encounter.Note" />
    </v-card-text>
    <v-card-text class="pb-4">
      <div class="text-cc-overline text-disabled">Pilot Notes</div>
      <cc-rich-text-area v-model="selected.Notes" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Clock } from '@/classes/narrative/elements/Clock';

const props = defineProps<{
  selected: object
  encounter: object
}>()
</script>
