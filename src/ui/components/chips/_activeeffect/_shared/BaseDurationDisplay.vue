<template>
  <v-card v-if="duration"
    style="width: 100%"
    flat
    tile
    variant="elevated"
    class="mt-1 pa-1"
    color="light-panel">
    <div class="text-text text-caption text-center">
      <span>Until&nbsp;</span>
      <b>{{ displayDuration }}</b>
    </div>
  </v-card>
</template>


<script lang="ts">
import { EffectDuration, EffectDurationText } from '@/classes/components/feature/active_effects/effect_subtype/EffectDuration';

export default {
  name: 'BaseDurationDisplay',
  props: {
    duration: { type: String, required: true }
  },
  computed: {
    displayDuration(): string {
      return EffectDurationText(this.duration as EffectDuration);
    }
  }
};
</script>
