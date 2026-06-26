<template>
  <v-col v-if="event.RemoveSpecialStatus?.length"
    :cols="cols">
    <div class="text-cc-overline text-disabled">{{ $t('ui.combat.removeSpecialCondition') }}</div>
    <v-card v-for="(s, index) in event.RemoveSpecialStatus"
      :key="`remove-special-status-${index}`"
      flat
      border="sm"
      color="exotic"
      class="text-center heading h3 rounded-lg mt-1">
      {{ s }}
    </v-card>
  </v-col>
</template>



<script setup lang="ts">
import type { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
const props = withDefaults(defineProps<{
  event: ActiveEffectEvent
  cols?: number | string
}>(), {
  cols: 'auto',
})
</script>