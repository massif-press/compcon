<template>
  <v-card-text class="pa-1">
    {{ bonus.Detail }}
    <div class="text-right text-disabled">
      <i>From {{ bonus.Source }}</i>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import type { Bonus } from '@/classes/components/feature/bonus/Bonus'
const props = defineProps<{
  bonus: Bonus
  tier?: number
}>()
</script>
