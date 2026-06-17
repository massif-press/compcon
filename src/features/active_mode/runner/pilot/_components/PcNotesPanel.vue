<template>
  <v-card>
    <v-card-title class="heading h2">{{ selected.Name }}</v-card-title>
    <v-card-subtitle class="text-cc-overline">
      {{ $t('active.pcNotes.playerNotes') }}
    </v-card-subtitle>
    <v-card-text class="pb-4">
      <div class="text-cc-overline text-disabled">{{ $t('active.pcNotes.sessionNotes') }}</div>
      <cc-rich-text-area v-model="encounter.Note" />
    </v-card-text>
    <v-card-text class="pb-4">
      <div class="text-cc-overline text-disabled">{{ $t('pm.print.pilotNotes') }}</div>
      <cc-rich-text-area v-model="selected.Notes" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Encounter } from '@/classes/encounter/Encounter'
import { Clock } from '@/classes/narrative/elements/Clock';

const props = defineProps<{
  selected: object
  encounter: Encounter
}>()
</script>
