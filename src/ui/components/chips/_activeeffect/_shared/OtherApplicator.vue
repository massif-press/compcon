<template>
  <v-col :cols="cols"
    v-if="event.OtherEvents.length">
    <div v-for="(o, index) in event.OtherEvents" :key="`other-${index}`">
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

<script setup lang="ts">
import BaseDurationDisplay from './BaseDurationDisplay.vue'

withDefaults(defineProps<{
  event: Record<string, any>
  cols?: number | string
}>(), { cols: 'auto' })

const cover = [
  { title: 'Soft Cover', value: 'soft' },
  { title: 'Hard Cover', value: 'hard' },
  { title: 'No Cover', value: 'none' },
]
</script>